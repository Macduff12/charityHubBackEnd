const userService = require('../service/user-service');
const { validationResult } = require('express-validator');
const ApiError = require('../exceptions/api-error');
const UserModel = require('../models/user-model'); // Потрібно переконатися, що імпорт правильний
const { v4: uuidv4 } = require('uuid');

class UserController {
    
    async registration(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Validation error', errors.array()));
            }
    
            // Додайте `fullName` та `role` до деструктуризації
            const { email, password, phone, fullName, role } = req.body;
    
    
            // Передайте всі необхідні параметри в сервіс
            const userData = await userService.registration(email, password, phone, fullName, role);
    
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
    
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async getProfile(req, res, next) {
        try {
            const userId = req.user.id;
            const userData = await userService.getProfile(userId);
            return res.json(userData);
        } catch (e) {
            console.error("Get profile error:", e);
            next(e);
        }
    }

    async updateProfile(req, res, next) {
        try {
            const userId = req.user.id;
            const { email, phone, fullName, role} = req.body;

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Validation error', errors.array()));
            }

            const userData = await userService.updateProfile(userId, email, phone, fullName, role);
            return res.json(userData);
        } catch (e) {
            console.error("Update profile error:", e);
            next(e);
        }
    }
    async forgotPassword(req, res, next) {
        try {
            const { email } = req.body;
            const response = await userService.forgotPassword(email);
            res.status(200).json(response);
        } catch (e) {
            next(e);
        }
    }

    async resetPassword(req, res, next) {
        try {
            const { resetToken, newPassword } = req.body;
            const response = await userService.resetPassword(resetToken, newPassword);
            res.status(200).json(response);
        } catch (e) {
            next(e);
        }
    }
    
    async getTrainers(req, res, next) {
        try {
            const trainers = await UserModel.find({ role: 'trainer' });
            return res.json(trainers);
        } catch (e) {
            next(e);
        }
    }
    
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const userData = await userService.login(email, password);
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
            return res.json(userData);
        } catch (e) {
            console.error("Login error:", e);
            next(e);
        }
    }

    async logout(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const token = await userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token);
        } catch (e) {
            console.error("Logout error:", e);
            next(e);
        }
    }

    async activate(req, res, next) {
        try {
            const activationLink = req.params.link;
            console.log("Activation link received:", activationLink);

            const user = await UserModel.findOne({ activationLink });

            if (!user) {
                console.log("Activation link not found for any user.");
                return res.status(400).json({ message: "Activation link is not valid" });
            }

            if (user.isActivated) {
                return res.status(400).json({ message: "User is already activated" });
            }

            user.isActivated = true;
            await user.save();

            console.log("User activated successfully.");
            return res.json({ message: "User activated successfully" });

        } catch (error) {
            console.error("Activation error:", error);
            return res.status(500).json({ message: "An unexpected error occurred" });
        }
    }

    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const userData = await userService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
            return res.json(userData);
        } catch (e) {
            console.error("Refresh token error:", e);
            next(e);
        }
    }

    async getUsers(req, res, next) {
        try {
            const users = await userService.getAllUsers();
            return res.json(users);
        } catch (e) {
            console.error("Get users error:", e);
            next(e);
        }
    }
}

module.exports = new UserController();
