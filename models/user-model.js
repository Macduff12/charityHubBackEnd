const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    isActivated: { type: Boolean, default: false },
    activationLink: { type: String },
    resetToken: { type: String },
    resetTokenExpires: { type: Date },
    fullName: { type: String, required: true },
    role: { type: String, enum: ['trainer', 'student'], required: true },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
});

module.exports = model('User', UserSchema);
