const Chat = require('../model/chat.model');
const ChatMessage = require('../model/chatMessage.model');
const User = require('../model/user.model');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const validateMongodbId = require('../utils/validateMongodbId');

const createGroupChat = asyncHandler(async (req, res) => {
    const { name, isGroupChat, participants } = req.body;
    const userId = req.user._id;

    if (!name || name.trim() === "", name.trim() === undefined) {
        throw new ApiError(400, "Name is required");
    }

    if (participants.length < 1) {
        throw new ApiError(400, "At least two participants are required");
    }

    const createGroupChat = await Chat.create({
        name,
        isGroupChat,
        participants: [userId, ...participants],
        admin: userId,
    })

    return res
        .status(201)
        .json(
            new ApiResponse(201, createGroupChat, "Group chat created successfully")
        );
})

// this should be written inside chat controllers
const getAllGroupUsers = asyncHandler(async (req, res) => {
    const { chatId } = req.params;

    validateMongodbId(chatId);

    const group = await Chat.findById(chatId);
    if (!group) {
        throw new ApiError(404, "Chat/Group not found");
    }

    const GroupUsersList = await Chat.findById(chatId).populate({ path: "participants" });

    return res
        .status(200)
        .json(
            new ApiResponse(200, GroupUsersList, "List of participants of group")
        )
})

module.exports = {
    createGroupChat,
    getAllGroupUsers
};