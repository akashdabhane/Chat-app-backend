const express = require('express');
const router = express.Router();
const {
    userRegister,
    userLogin,
    getAllUsers,
    searchUser,
    getUser
} = require("../controller/user.controller");
const verifyJWT = require("../middlewares/auth.middleware");

router.route('/register').post(userRegister);
router.route('/login').post(userLogin);
router.route('/').get(verifyJWT, getAllUsers);
router.route('/search').get(verifyJWT, searchUser);
router.route('/:id').get(verifyJWT, getUser);

module.exports = router; 