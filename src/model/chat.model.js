const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema({
  // name, profileImage, admin is fields used when chat is GroupChat
  name: {
    type: String,
    minlength: 2,
    required: function () {
      return this.isGroupChat; // `name` is required only when `isGroupChat` is true
    },
  },
  profileImage: {
    type: String,
    default: function () {
      if (this.isGroupChat) {
        return "https://res.cloudinary.com/domlldpib/image/upload/v1727176778/chat-app-m/ploxjqwlnefsbwyptzou.jpg";
      }else {
        return "";
      }
    }
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
