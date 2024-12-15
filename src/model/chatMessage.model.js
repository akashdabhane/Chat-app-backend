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
    status: {
        type: String,
        enum: ['pending', 'sent', 'delivered', 'read'],
        default: 'pending',
        required: true,
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
        required: true
    }
}, { timestamps: true });

chatMessageSchema.pre("save", async function (next) {
    this.status = "sent";
    next()
})

const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema);

module.exports = ChatMessage;

