const express = require('express');
const teamController = require('../controllers/team-controller');

const router = express.Router();

// Створення нової команди
router.post('/create-team', teamController.createTeam);

// Додавання користувача до команди
router.post('/add-user-to-team', teamController.addUserToTeam);

// Видалення користувача з команди
router.post('/remove-user-from-team', teamController.removeUserFromTeam);

// Оновлення опису команди
router.post('/update-team-description', teamController.updateTeamDescription);

// Переміщення користувача між командами
router.post('/move-user-to-another-team', teamController.moveUserToAnotherTeam);

// Отримання всіх команд
router.get('/teams', teamController.getTeams);
router.delete('/remove-user-from-team', teamController.deleteUserFromTeam);
module.exports = router;
