const express = require('express');
const groupRouter = express.Router();
const {
    createGroupChat,
    getAllGroupUsers,
    addNewGroupMember,
    updateGroupProfileImage
} = require("../controller/group.controller");
const verifyJWT = require("../middlewares/auth.middleware");
const upload = require('../middlewares/multer.middleware');

groupRouter.use(verifyJWT)

groupRouter.route('/create-group-chat').post(createGroupChat);
groupRouter.route('/get-all-group-users/:chatId').get(getAllGroupUsers);
groupRouter.route('/add-new-participants').post(addNewGroupMember);
groupRouter.route('/update-group-profile-image/:chatId').patch(upload.single("profileImage"), updateGroupProfileImage);

module.exports = groupRouter;