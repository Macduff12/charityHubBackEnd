const express = require('express');
const helpRequestController = require('../controllers/help-request-controller');

const router = express.Router();
// Створення запиту на допомогу
router.post('/create', helpRequestController.createHelpRequest);

// Призначення команди для виконання завдання
router.post('/assign-team', helpRequestController.assignTeamToHelpRequest);

// Оновлення статусу запиту
router.post('/update-status', helpRequestController.updateHelpRequestStatus);

// Додавання відгуку про команду
router.post('/add-feedback', helpRequestController.addFeedback);

// Отримання всіх запитів на допомогу
router.get('/requests', helpRequestController.getHelpRequests);

module.exports = router;
