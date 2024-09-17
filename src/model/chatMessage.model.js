const mongoose = require('mongoose')

const chatMessageSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    message: {
        type: String,
    },
    attachments: {
        type: [
            {
                url: String,
                localPath: String,
            },
        ],
        default: [],
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
        required: true
    }
}, { timestamps: true });

const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema);

module.exports = ChatMessage;

