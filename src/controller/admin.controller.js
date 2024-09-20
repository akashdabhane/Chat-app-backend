const Chat = require('../model/chat.model');
const ChatMessage = require('../model/chatMessage.model');
const User = require('../model/user.model');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const validateMongodbId = require('../utils/validateMongodbId');

// checks wether logged in user is admin of group or not
const isAdmin = asyncHandler(async (chatId, userId) => {
    const groupInfo = await Chat.findById(chatId);
    if (!groupInfo) {
        throw new ApiError(`Chat ${chatId} does not exist or not found`)
    }

    const isAdmin = groupInfo.participants.includes(userId);

    if(!isAdmin) {
        throw new ApiError(`Logged in user is not admin of this group`);
    }
    return;
})

// admin can remove participants or participants itself can leave the group
const removeParticipant = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;
    const loggedInUser = req.user._id;

    validateMongodbId(chatId);
    validateMongodbId(userId);
    isAdmin(chatId, loggedInUser);

    const updatedGroupInfo = await Chat.findByIdAndUpdate(chatId,
        {
            $pull: {
                participants: [userId]
            }
        }, { runValidators: true, new: true }
    )

    return res
        .status(200)
        .json(
            new ApiResponse(200, updatedGroupInfo, "Chat/Group information is updated successfully")
        )
})

// create a new group admin/ give admin privileges to user (their could be multiple admins)
const createNewAdmin = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;
    const loggedInUser = req.user._id;

    validateMongodbId(chatId);
    validateMongodbId(userId);
    isAdmin(chatId, loggedInUser);

    const updatedGroupInfo = await Chat.findByIdAndUpdate(chatId,
        {
            $push: {
                admin: [userId]
            }
        }, { runValidators: true, new: true }
    )

    return res
        .status(200)
        .json(
            new ApiResponse(200, updatedGroupInfo, "Admin privileges are granted")
        )
})

const removeAdminPrivileges = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;
    const loggedInUser = req.user._id;

    validateMongodbId(chatId);
    validateMongodbId(userId);
    isAdmin(chatId, loggedInUser);

    const updatedGroupAdminInfo = await Chat.findByIdAndUpdate(chatId,
        {
            $pull: {
                admin: [userId]
            }
        }, { runValidators: true, new: true }
    );

    return res
        .status(200)
        .json(
            new ApiResponse(200, updatedGroupAdminInfo, "Admin privileges are removed from the user")
        );
})


module.exports = {
    removeParticipant,
    createNewAdmin,
    removeAdminPrivileges
};