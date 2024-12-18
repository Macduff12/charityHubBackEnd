const express = require('express');
const sponsorController = require('../controllers/sponsor-controller');

const router = express.Router();

// Створення нового спонсора
router.post('/create-sponsor', sponsorController.createSponsor);

// Перегляд всіх спонсорів
router.get('/sponsors', sponsorController.getSponsors);

// Оновлення спонсора
router.put('/update-sponsor/:sponsorId', sponsorController.updateSponsor);

// Видалення спонсора
router.delete('/delete-sponsor/:sponsorId', sponsorController.deleteSponsor);

module.exports = router;
