const UserModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mail-service');
const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dtos');
const ApiError = require('../exceptions/api-error');

class UserService {
    async registration(email, password, phone, fullName, role) {
        try {
            console.log("Starting registration process for:", { email, phone, fullName, role });

            await this.checkUniqueFields({ email, phone });
            console.log("Unique fields check passed");

            const hashPassword = await bcrypt.hash(password, 3);
            console.log("Password hashed");

            const activationLink = uuid.v4();
            console.log("Generated activation link:", activationLink);

            const user = await UserModel.create({
                email,
                password: hashPassword,
                phone,
                fullName,
                role,
                activationLink
            })
            console.log("User created:", user);

            await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);
            console.log("Activation email sent");

            const userDto = new UserDto(user);
            const tokens = tokenService.generateTokens({ ...userDto });
            await tokenService.saveToken(userDto.id, tokens.refreshToken);
            console.log("Tokens generated and saved");

            return { ...tokens, user: userDto };
        } catch (error) {
            console.error("Error during registration:", error);
            throw ApiError.InternalServerError('Unexpected error during registration');
        }
    }
    

    async checkUniqueFields(fields, userId) {
        for (const [key, value] of Object.entries(fields)) {
            const query = { [key]: value };
            if (userId) {
                query._id = { $ne: userId };
            }

            const existingUser = await UserModel.findOne(query);
            if (existingUser) {
                throw ApiError.BadRequest(`${key.charAt(0).toUpperCase() + key.slice(1)} already exists`);
            }
        }
    }

    async activate(activationLink) {
        const user = await UserModel.findOne({ activationLink });
        if (!user) {
            throw ApiError.BadRequest('Activation link is not valid');
        }
        user.isActivated = true;
        await user.save();
    }

    async login(email, password) {
        const user = await UserModel.findOne({ email });
        if (!user) {
            throw ApiError.BadRequest('User with this email not found');
        }

        const isPassEquals = await bcrypt.compare(password, user.password);
        if (!isPassEquals) {
            throw ApiError.BadRequest('Incorrect password');
        }

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });

        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return { ...tokens, user: userDto };
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }

        const userData = tokenService.validateRefreshToken(refreshToken);
        if (!userData) {
            throw ApiError.UnauthorizedError();
        }

        const tokenFromDb = await tokenService.findToken(refreshToken);
        if (!tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }

        const user = await UserModel.findById(userData.id);
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });

        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return { ...tokens, user: userDto };
    }

    async getProfile(userId) {
        const user = await UserModel.findById(userId);
        if (!user) {
            throw ApiError.BadRequest('User not found');
        }
        return new UserDto(user);
    }

    async updateProfile(userId, email, phone, fullName, role) {
        const updatedUser = await UserModel.findByIdAndUpdate(userId, {
            email,
            phone,
            fullName,
            role
        }, { new: true });

        if (!updatedUser) {
            throw ApiError.BadRequest('User not found');
        }

        return new UserDto(updatedUser);
    }
    async forgotPassword(email) {
        const user = await UserModel.findOne({ email });
        if (!user) {
            throw ApiError.BadRequest('Користувача з таким email не знайдено');
        }
    
        const resetToken = uuid.v4();
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 година
        await user.save();
    
        const resetLink = `${process.env.CLIENT_URL}/reset-password.html?token=${resetToken}`;
        await mailService.sendResetPasswordMail(email, resetLink);
        return { message: 'Посилання для скидання пароля відправлено на вашу електронну пошту' };
    }
    
    async resetPassword(token, newPassword) {
        const user = await UserModel.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });
    
        if (!user) {
            throw ApiError.BadRequest('Посилання для скидання пароля недійсне або термін дії минув');
        }
    
        user.password = await bcrypt.hash(newPassword, 3);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
    
        return { message: 'Пароль успішно змінено' };
    }    
    async getAllUsers() {
        return await UserModel.find();
    }
}

module.exports = new UserService();
