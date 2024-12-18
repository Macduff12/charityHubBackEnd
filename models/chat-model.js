// models/chat.js
const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    helpRequestId: { type: mongoose.Schema.Types.ObjectId, ref: 'HelpRequest', required: true },
    messages: [
        {
            sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
            content: { type: String, required: true },
            timestamp: { type: Date, default: Date.now },
        }
    ],
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
