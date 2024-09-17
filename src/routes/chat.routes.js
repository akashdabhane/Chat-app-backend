const express = require('express');
const chatRouter = express.Router();
const {
    getOrCreateOneToOneRoom,
    createGroupChat,
    getConnectedChats,
    getMessagesList
} = require("../controller/chat.controller");
const verifyJWT = require("../middlewares/auth.middleware");

chatRouter.use(verifyJWT);  // protect routes with JWT middleware

chatRouter.route('/get-or-create-one-to-one-chat').post(getOrCreateOneToOneRoom);
chatRouter.route('/create-group-chat').post(createGroupChat);
chatRouter.route('/get-connected-chats').get(getConnectedChats);
chatRouter.route('/get-messages-list/:chatId').get(getMessagesList);

module.exports = chatRouter; 