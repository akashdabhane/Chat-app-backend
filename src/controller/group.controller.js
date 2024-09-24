const Chat = require('../model/chat.model');
const ChatMessage = require('../model/chatMessage.model');
const User = require('../model/user.model');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const validateMongodbId = require('../utils/validateMongodbId');
const { uploadOnCloudinary, deleteFromCloudinary } = require('../utils/cloudinary');

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

// add a new member to the group
const addNewGroupMember = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { chatId, newUser } = req.body;
    validateMongodbId(chatId);
    validateMongodbId(newUser);

    const groupInfo = await Chat.findById(chatId);

    if (!groupInfo.admin.includes(userId)) {
        throw new ApiError(401, "You are not allowed to add new members");
    }

    if (groupInfo.participants.includes(newUser)) {
        return res.status(200).json(
            new ApiResponse(200, {}, "User is already added")
        )
    }

    const updatedGroupMember = await Chat.findByIdAndUpdate(chatId,
        {
            $push: {
                participants: [newUser]
            }
        }, { new: true }
    )

    return res
        .status(200)
        .json(
            new ApiResponse(200, updatedGroupMember, "new user added to group")
        )
})

// update group profile picture
const updateGroupProfileImage = asyncHandler(async (req, res) => {
    const chatId = req.params.chatId;
    const userId = req.user._id;
    const LocalPhotoPath = req.file?.path;

    const groupInfo = await Chat.findById(chatId);
    if (!groupInfo.admin.includes(userId)) {
        throw new ApiError(401, "You are not allowed to update this group profile picture");
    }

    const photo = await uploadOnCloudinary(LocalPhotoPath);
    if (!photo) {
        throw new ApiError(500, "Failed to upload photo to cloudinary");
    }

    if (groupInfo?.profileImage) {
        await deleteFromCloudinary(req.user.profileImage);
    }

    const updateProfilePhoto = await Chat.findByIdAndUpdate(chatId,
        {
            $set: {
                profileImage: photo.secure_url,
            }
        },
        { new: true }
    )

    return res
        .status(200)
        .json(
            new ApiResponse(200, { user: updateProfilePhoto }, "Group Profile photo updated successfully")
        )
})

module.exports = {
    createGroupChat,
    getAllGroupUsers,
    addNewGroupMember,
    updateGroupProfileImage
};