const { Schema, model } = require('mongoose');

// Модель для команди з полем для опису
const TeamSchema = new Schema({
    name: { type: String, required: true, unique: true }, // Назва команди
    description: { type: String, required: true }, // Опис команди
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }] // Список користувачів в команді
});

module.exports = model('Team', TeamSchema);
