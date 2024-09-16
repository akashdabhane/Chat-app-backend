const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    required: function () {
      return this.isGroupChat; // `name` is required only when `isGroupChat` is true
    },
  },
  profileImage: {
    type: String, 
    required: function () {
      return this.isGroupChat; // `profileImage` is required only when `isGroupChat` is true
    },
  },
  isGroupChat: {
    type: Boolean,
    default: false,
  },
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ChatMessage",
  },
  participants: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
  },
  admin: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
  },
}, { timestamps: true });

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
