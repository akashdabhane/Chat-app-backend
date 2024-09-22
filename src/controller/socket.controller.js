const Chat = require("../model/chat.model");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const validateMongodbId = require("../utils/validateMongodbId");

// list of chats/room (could be user/group) where current user is as participant
const getConnectChatRoomsList = async (userId) => {
    validateMongodbId(userId);
    try {

        const connectedChatsList = await Chat.find({
            participants: { $in: [userId] }
        }).select("_id");

        console.log('20', connectedChatsList)
        return connectedChatsList;
    } catch (error) {
        console.log("server error", error)
        throw new ApiError(500, "Server error: " + error)
    }
}

module.exports = {
    getConnectChatRoomsList
};