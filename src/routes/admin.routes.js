const express = require('express');
const adminRouter = express.Router();
const {
    removeParticipant,
    createNewAdmin,
    removeAdminPrivileges
} = require("../controller/admin.controller");
const verifyJWT = require("../middlewares/auth.middleware");

adminRouter.use(verifyJWT)

adminRouter.route('/remove-participant').patch(removeParticipant);
adminRouter.route('/create-admin').patch(createNewAdmin);
adminRouter.route('/remove-admin-privileges').patch(removeAdminPrivileges);

export default adminRouter;