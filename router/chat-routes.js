// routes/chat-routes.js
const express = require('express');
const helpRequestController = require('../controllers/help-request-controller');

const router = express.Router();

// Додавання повідомлення в чат
router.post('/add-message', helpRequestController.addMessageToChat);

// Отримання повідомлень чату
router.get('/:helpRequestId/messages', helpRequestController.getChatMessages);

module.exports = router;
