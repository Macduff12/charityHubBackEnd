const TeamModel = require('../models/team-model'); // Імпортуємо модель для команди
const UserModel = require('../models/user-model'); // Імпортуємо модель для користувачів

class TeamController {

    // Створення нової команди
    async createTeam(req, res, next) {
        try {
            const { name, description } = req.body;

            // Перевіряємо, чи команда з такою назвою вже існує
            const existingTeam = await TeamModel.findOne({ name });
            if (existingTeam) {
                return res.status(400).json({ message: 'Команда з такою назвою вже існує' });
            }

            // Створюємо нову команду
            const team = new TeamModel({ name, description });
            await team.save();

            return res.status(201).json({ message: 'Команду створено', team });
        } catch (e) {
            next(e);
        }
    }

    // Додавання користувача до команди
    async addUserToTeam(req, res, next) {
        try {
            const { teamId, userId } = req.body;

            // Знаходимо команду
            const team = await TeamModel.findById(teamId);
            if (!team) {
                return res.status(404).json({ message: 'Команда не знайдена' });
            }

            // Знаходимо користувача
            const user = await UserModel.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'Користувач не знайдений' });
            }

            // Перевіряємо, чи вже є користувач в команді
            if (team.users.includes(userId)) {
                return res.status(400).json({ message: 'Користувач вже є в цій команді' });
            }

            // Додаємо користувача до команди
            team.users.push(userId);
            await team.save();

            return res.status(200).json({ message: 'Користувача додано до команди', team });
        } catch (e) {
            next(e);
        }
    }

    // Видалення користувача з команди
    async removeUserFromTeam(req, res, next) {
        try {
            const { teamId, userId } = req.body;

            // Знаходимо команду
            const team = await TeamModel.findById(teamId);
            if (!team) {
                return res.status(404).json({ message: 'Команда не знайдена' });
            }

            // Перевіряємо, чи є користувач в команді
            if (!team.users.includes(userId)) {
                return res.status(400).json({ message: 'Користувач не є частиною цієї команди' });
            }

            // Видаляємо користувача з команди
            team.users = team.users.filter(user => user.toString() !== userId.toString());
            await team.save();

            return res.status(200).json({ message: 'Користувача видалено з команди', team });
        } catch (e) {
            next(e);
        }
    }

    // Оновлення опису команди
    async updateTeamDescription(req, res, next) {
        try {
            const { teamId, newDescription } = req.body;

            // Знаходимо команду
            const team = await TeamModel.findById(teamId);
            if (!team) {
                return res.status(404).json({ message: 'Команда не знайдена' });
            }

            // Оновлюємо опис команди
            team.description = newDescription;
            await team.save();

            return res.status(200).json({ message: 'Опис команди оновлено', team });
        } catch (e) {
            next(e);
        }
    }
    async deleteUserFromTeam(req, res, next){
        try {
          const { teamId, userId } = req.body;
      
          // Логіка для видалення користувача з команди
          const team = await Team.findById(teamId); // Припустимо, що використовуємо Mongoose для MongoDB
      
          if (!team) {
            return res.status(404).json({ message: 'Team not found' });
          }
      
          // Видаляємо користувача з масиву членів команди
          team.members = team.members.filter(member => member.toString() !== userId);
      
          await team.save(); // Зберігаємо зміни
      
          return res.status(200).json({ message: 'User removed from team successfully' });
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Something went wrong' });
        }
      };
    // Переміщення користувача між командами
    async moveUserToAnotherTeam(req, res, next) {
        try {
            const { fromTeamId, toTeamId, userId } = req.body;

            // Знаходимо обидві команди
            const fromTeam = await TeamModel.findById(fromTeamId);
            const toTeam = await TeamModel.findById(toTeamId);
            if (!fromTeam || !toTeam) {
                return res.status(404).json({ message: 'Одна з команд не знайдена' });
            }

            // Знаходимо користувача
            const user = await UserModel.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'Користувач не знайдений' });
            }

            // Видаляємо користувача з поточної команди
            fromTeam.users = fromTeam.users.filter(user => user.toString() !== userId.toString());
            await fromTeam.save();

            // Додаємо користувача до нової команди
            toTeam.users.push(userId);
            await toTeam.save();

            return res.status(200).json({ message: 'Користувача переміщено між командами', fromTeam, toTeam });
        } catch (e) {
            next(e);
        }
    }

    // Отримання інформації про команди
    async getTeams(req, res, next) {
        try {
            const teams = await TeamModel.find().populate('users', 'fullName email');
            return res.json(teams);
        } catch (e) {
            next(e);
        }
    }
    // controllers/team-controller.js
// Додати метод для перегляду запитів на допомогу, що знаходяться в статусі "Очікує"

async getHelpRequestsForTeam(req, res, next) {
    try {
        const teamId = req.params.teamId;
        const helpRequests = await HelpRequest.find({ assignedTeam: null, status: 'Очікує' })
            .populate('userId', 'fullName email')
            .populate('assignedTeam', 'name');
        return res.status(200).json(helpRequests);
    } catch (e) {
        next(e);
    }
}

}

module.exports = new TeamController();
