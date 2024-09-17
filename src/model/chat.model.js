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
    default: "https://media.istockphoto.com/id/1158561473/vector/three-persons-icon-black-vector.jpg?s=612x612&w=0&k=20&c=UvL4Nvz9nL4zi5RdjAabosuFer98suMTA-FheZ2KLlQ="
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
