const express = require('express');
const groupRouter = express.Router();
const {
    createGroupChat,
    getAllGroupUsers
} = require("../controller/group.controller");
const verifyJWT = require("../middlewares/auth.middleware");

groupRouter.use(verifyJWT)

groupRouter.route('/create-group-chat').post(createGroupChat);
groupRouter.route('/get-all-group-users/:chatId').get(getAllGroupUsers);

module.exports = groupRouter;