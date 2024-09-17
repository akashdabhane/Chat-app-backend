const ChatMessage = require('../model/chatMessage.model');
const Chat = require('../model/chat.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const validateMongodbId = require('../utils/validateMongodbId');

// this function is responsible for sending all the messages of chats to which user is connected.
const sendMessagesList = async (req, res) => {
    const { chatId } = req.params;
    validateMongodbId(chatId);

    const room = await Chat.findById(chatId);
    if (!room) {
        throw new ApiError(404, "Chat/room not found");
    }

    const messagesList = await ChatMessage.find({ chat: chatId });

    const messageFiles = [];

    if (req.files && req.files.attachments?.length > 0) {
        req.files.attachments?.map((attachment) => {
            messageFiles.push({
                url: getStaticFilePath(req, attachment.filename),
                localPath: getLocalPath(attachment.filename),
            });
        });
    }

    // logic to emit socket event about the new message created to the other participants
    // chat.participants.forEach((participantObjectId) => {
    //     // here the chat is the raw instance of the chat in which participants is the array of object ids of users
    //     // avoid emitting event to the user who is sending the message
    //     if (participantObjectId.toString() === req.user._id.toString()) return;

    //     // emit the receive message event to the other participants with received message as the payload
    //     emitSocketEvent(
    //         req,
    //         participantObjectId.toString(),
    //         ChatEventEnum.MESSAGE_RECEIVED_EVENT,
    //         receivedMessage
    //     );
    // });

    return res
        .status(201)
        .json(201, receivedMessage, "Message saved successfully");
}

// for saving the message into the database when user sends message to user user.
const saveMessage = async (messageData) => {
    const { author, message, room, time } = messageData;

    try {
        const createMessage = await ChatMessage.create({
            author: author,
            message: message,
            attachments: messageData?.attachments,
            chat: room
        });

        await Chat.findByIdAndUpdate(room,
            {
                $set: {
                    lastMessage: createMessage._id,
                    updatedAt: new Date(),
                }
            }, { runValidators: true, new: true }
        )
    } catch (error) {
        console.log(error)
        // throw new ApiError(500, "Failed to update message")
    }
}

module.exports = {
    sendMessagesList,
    saveMessage,
}