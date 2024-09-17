const Chat = require('../model/chat.model');
const ChatMessage = require('../model/chatMessage.model');
const User = require('../model/user.model');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const validateMongodbId = require('../utils/validateMongodbId');

const getOrCreateOneToOneRoom = asyncHandler(async (req, res) => {
    const { otherUserId } = req.body;
    const userId = req.user._id;

    if (!otherUserId || otherUserId?.trim() === "" || otherUserId?.trim() === undefined) {
        throw new ApiError(400, "Other user ID is required");
    }

    const existingChat = await Chat.aggregate([
        {
            $match: {
                participants: {
                    $in: [userId, otherUserId]
                },
            }
        },
        {
            $match: {
                isGroupChat: false
            }
        }
    ]);

    if (existingChat.length > 0) {
        return res
            .status(200)
            .json(
                new ApiResponse(200, existingChat, "Chat already exists")
            );
    }

    const newChat = await Chat.create({
        participants: [userId, otherUserId],
    });

    return res
        .status(201)
        .json(
            new ApiResponse(201, newChat, "Chat created successfully")
        );
})

// const getOneToOneRoom = asyncHandler(async (req, res) => {
//     const { otherUserId } = req.body;
//     const userId = req.user._id;

//     if (!otherUserId || otherUserId?.trim() === "" || otherUserId?.trim() === undefined) {
//         throw new ApiError(400, "Other user ID is required");
//     }

//     const RoomInfo = await Chat.findOne({
//         participants: {
//             $in: [userId, otherUserId]
//         },
//     });

//     if (!RoomInfo) {
//         throw new ApiError(404, "No such chat found");
//     }

//     return res
//         .status(200)
//         .json(
//             new ApiResponse(200, RoomInfo, "Chat found")
//         );
// })

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

// list of users/groups where current user is as participant
const getConnectedChats = asyncHandler(async (req, res) => {
    let currentUserId = req.user._id;

    const connectedChats = await Chat.aggregate([
        {
            // Step 1: Lookup user details for one-on-one chats only
            $lookup: {
                from: 'users',                // Join with the 'users' collection
                localField: 'participants',   // 'participants' in 'Chat' contains user IDs
                foreignField: '_id',          // '_id' in 'User' matches the user ID
                as: 'userDetails'
            }
        },
        {
            // Step 2: Filter or project based on whether it's a group chat
            $project: {
                name: 1,                // Keep chat name
                isGroupChat: 1,         // Keep group chat flag
                participants: {
                    $cond: {
                        if: { $eq: ['$isGroupChat', false] },  // If it's not a group chat
                        then: '$userDetails',                 // Include user details
                        else: '$participants'                 // Otherwise keep participants as is
                    }
                },
                lastMessage: 1,          // Keep the last message
                admin: 1                 // Keep admin field
            }
        },
        {
            $sort: {
                lastMessage: -1
            }
        }
    ]);


    return res
        .status(200)
        .json(
            new ApiResponse(200, connectedChats, "Connected users fetched successfully")
        )
})

// information of group and group members 
const getChatInfo = asyncHandler(async (req, res) => {
    const { chatId } = req.params;

    const chatInfo = await Chat.findById(chatId).populate({ participants });

    if (!chatInfo) {
        throw new ApiError(404, "Chat not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, chatInfo, "Chat info fetched successfully")
        )
})

// get messages list of a chat / previous messages store in database
const getMessagesList = asyncHandler(async (req, res) => {
    const { chatId } = req.params;
    const { page = 1, limit = 40 } = req.query;
    validateMongodbId(chatId);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const messages = await ChatMessage.find({ chat: chatId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(startIndex)
        .populate({
            path: 'author',
            select: '_id name'
        });

    return res
        .status(200)
        .json(
            new ApiResponse(200, messages, "Messages fetched successfully")
        )
})

module.exports = {
    getOrCreateOneToOneRoom,
    createGroupChat,
    getConnectedChats,
    getChatInfo,
    getMessagesList
};