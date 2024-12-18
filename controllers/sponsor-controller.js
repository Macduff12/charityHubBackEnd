const SponsorModel = require('../models/sponsor-model'); // Імпортуємо модель спонсорів

class SponsorController {

    // Створення нового спонсора
    async createSponsor(req, res, next) {
        try {
            const { name, description, amountDonated, logoUrl } = req.body;

            // Перевіряємо, чи спонсор з такою назвою вже існує
            const existingSponsor = await SponsorModel.findOne({ name });
            if (existingSponsor) {
                return res.status(400).json({ message: 'Спонсор з такою назвою вже існує' });
            }

            // Створюємо нового спонсора
            const sponsor = new SponsorModel({ name, description, amountDonated, logoUrl });
            await sponsor.save();

            return res.status(201).json({ message: 'Спонсора створено', sponsor });
        } catch (e) {
            next(e);
        }
    }

    // Перегляд всіх спонсорів
    async getSponsors(req, res, next) {
        try {
            const sponsors = await SponsorModel.find();
            return res.status(200).json({ sponsors });
        } catch (e) {
            next(e);
        }
    }

    // Оновлення інформації про спонсора
    async updateSponsor(req, res, next) {
        try {
            const { sponsorId } = req.params;
            const { name, description, amountDonated, logoUrl } = req.body;

            const updatedSponsor = await SponsorModel.findByIdAndUpdate(sponsorId, {
                name,
                description,
                amountDonated,
                logoUrl,
            }, { new: true });

            if (!updatedSponsor) {
                return res.status(404).json({ message: 'Спонсора не знайдено' });
            }

            return res.status(200).json({ message: 'Інформацію про спонсора оновлено', updatedSponsor });
        } catch (e) {
            next(e);
        }
    }

    // Видалення спонсора
    async deleteSponsor(req, res, next) {
        try {
            const { sponsorId } = req.params;

            const deletedSponsor = await SponsorModel.findByIdAndDelete(sponsorId);

            if (!deletedSponsor) {
                return res.status(404).json({ message: 'Спонсора не знайдено' });
            }

            return res.status(200).json({ message: 'Спонсора видалено' });
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new SponsorController();
