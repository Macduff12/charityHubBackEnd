// controllers/help-request-controller.js
const HelpRequest = require('../models/help-model');
const TeamModel = require('../models/team-model');
const UserModel = require('../models/user-model');
const ChatModel = require('../models/chat-model'); // додаємо модель чату

class HelpRequestController {
    // Створення запиту на допомогу
    async createHelpRequest(req, res, next) {
        try {
            const { userId, title, description } = req.body;

            // Перевірка чи користувач існує
            const user = await UserModel.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'Користувач не знайдений' });
            }

            const helpRequest = new HelpRequest({ userId, title, description });
            await helpRequest.save();

            // Створення чату для цього запиту
            const chat = new ChatModel({ helpRequestId: helpRequest._id, messages: [] });
            await chat.save();

            return res.status(201).json({ message: 'Запит на допомогу створено, чат також створено', helpRequest, chat });
        } catch (e) {
            next(e);
        }
    }
    // Додавання повідомлення в чат
    async addMessageToChat(req, res, next) {
        try {
            const { helpRequestId, senderId, messageContent } = req.body;

            // Знаходимо чат за допомогою ID запиту на допомогу
            const chat = await ChatModel.findOne({ helpRequestId });
            if (!chat) {
                return res.status(404).json({ message: 'Чат не знайдений' });
            }

            // Додаємо нове повідомлення
            chat.messages.push({ sender: senderId, content: messageContent });
            await chat.save();

            return res.status(200).json({ message: 'Повідомлення додано в чат', chat });
        } catch (e) {
            next(e);
        }
    }
    // Отримання повідомлень чату за ID запиту на допомогу
    async getChatMessages(req, res, next) {
        try {
            const { helpRequestId } = req.params;

            const chat = await ChatModel.findOne({ helpRequestId }).populate('messages.sender', 'fullName email');
            if (!chat) {
                return res.status(404).json({ message: 'Чат не знайдений' });
            }

            return res.status(200).json({ messages: chat.messages });
        } catch (e) {
            next(e);
        }
    }
    // Призначення команди для виконання завдання
    async assignTeamToHelpRequest(req, res, next) {
        try {
            const { helpRequestId, teamId } = req.body;

            // Перевірка, чи існує запит та команда
            const helpRequest = await HelpRequest.findById(helpRequestId);
            if (!helpRequest) {
                return res.status(404).json({ message: 'Запит не знайдений' });
            }

            const team = await TeamModel.findById(teamId);
            if (!team) {
                return res.status(404).json({ message: 'Команда не знайдена' });
            }

            // Оновлення запиту, призначаючи команду
            helpRequest.assignedTeam = teamId;
            helpRequest.status = 'Виконується';
            await helpRequest.save();

            return res.status(200).json({ message: 'Команду призначено для виконання завдання', helpRequest });
        } catch (e) {
            next(e);
        }
    }

    // Оновлення статусу завдання (наприклад, завершення)
    async updateHelpRequestStatus(req, res, next) {
        try {
            const { helpRequestId, status } = req.body;

            const validStatuses = ['Очікує', 'Виконується', 'Завершено'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({ message: 'Невірний статус' });
            }

            // Знаходимо запит
            const helpRequest = await HelpRequest.findById(helpRequestId);
            if (!helpRequest) {
                return res.status(404).json({ message: 'Запит не знайдений' });
            }

            // Оновлюємо статус
            helpRequest.status = status;
            await helpRequest.save();

            return res.status(200).json({ message: 'Статус запиту оновлено', helpRequest });
        } catch (e) {
            next(e);
        }
    }

    // Оновлення відгуку користувача
    async addFeedback(req, res, next) {
        try {
            const { helpRequestId, feedback } = req.body;

            // Знаходимо запит
            const helpRequest = await HelpRequest.findById(helpRequestId);
            if (!helpRequest) {
                return res.status(404).json({ message: 'Запит не знайдений' });
            }

            // Додаємо відгук
            helpRequest.feedback = feedback;
            await helpRequest.save();

            return res.status(200).json({ message: 'Відгук додано', helpRequest });
        } catch (e) {
            next(e);
        }
    }

    // Отримання всіх запитів на допомогу
    async getHelpRequests(req, res, next) {
        try {
            const helpRequests = await HelpRequest.find().populate('userId', 'fullName email').populate('assignedTeam', 'name');
            return res.status(200).json(helpRequests);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new HelpRequestController();
