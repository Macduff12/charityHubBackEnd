const { Schema, model } = require('mongoose');

// Модель для спонсорів
const SponsorSchema = new Schema({
    name: { type: String, required: true, unique: true }, // Назва спонсора
    description: { type: String, required: true }, // Опис спонсора
    amountDonated: { type: Number, default: 0 }, // Сума внеску спонсора
    logoUrl: { type: String, required: false }, // Логотип спонсора (необов'язково)
});

const SponsorModel = model('Sponsor', SponsorSchema);

module.exports = SponsorModel;
