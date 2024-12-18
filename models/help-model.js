const mongoose = require('mongoose');

const helpRequestSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['Очікує', 'Виконується', 'Завершено'], default: 'Очікує' },
    assignedTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', default: null },
    feedback: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
});

const HelpRequest = mongoose.model('HelpRequest', helpRequestSchema);

module.exports = HelpRequest;
