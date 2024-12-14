const express = require('express');
const router = express.Router();
const {
    userRegister,
    userLogin,
    loggedInUser,
    getAllUsers,
    searchUser,
    getUser,
    updateUserProfileImage
} = require("../controller/user.controller");
const verifyJWT = require("../middlewares/auth.middleware");
const upload = require("../middlewares/multer.middleware");

router.route('/register').post(userRegister);
router.route('/login').post(userLogin);
router.route('/logged-in-user').get(verifyJWT, loggedInUser);
router.route('/').get(verifyJWT, getAllUsers);
router.route('/search').get(verifyJWT, searchUser);
router.route('/update-user-profile-picture').patch(verifyJWT, upload.single("profileImage"), updateUserProfileImage);
router.route('/:id').get(verifyJWT, getUser);

module.exports = router; 