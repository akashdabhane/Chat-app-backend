const chatMessage = require('../model/chatMessage')

exports.sendMessage = async (req, res) => {
    const { chatId } = req.params;
    const { content } = req.body;

    if (!content && !req.files?.attachments?.length) {
        throw new Error(400, "Message content or attachment is required");
    }

    const selectedChat = await chatMessage.findById(chatId);

    // if (!selectedChat) {
    //     throw new Error(404, "Chat does not exist");
    // }

    const messageFiles = [];

    if (req.files && req.files.attachments?.length > 0) {
        req.files.attachments?.map((attachment) => {
            messageFiles.push({
                url: getStaticFilePath(req, attachment.filename),
                localPath: getLocalPath(attachment.filename),
            });
        });
    }

    // Create a new message instance with appropriate metadata
    const message = await chatMessage.create({
        sender: new mongoose.Types.ObjectId(req.body.sender),
        content: content || "",
        chat: new mongoose.Types.ObjectId(chatId),
        attachments: messageFiles,
    });

    // update the chat's last message which could be utilized to show last message in the list item
    // const chat = await chatMessage.findByIdAndUpdate(
    //     chatId,
    //     {
    //         $set: {
    //             lastMessage: message._id,
    //         },
    //     },
    //     { new: true }
    // );

    // structure the message
    // const messages = await chatMessage.aggregate([
    //     {
    //         $match: {
    //             _id: new mongoose.Types.ObjectId(message._id),
    //         },
    //     },
    //     ...chatMessageCommonAggregation(),
    // ]);

    // Store the aggregation result
    // const receivedMessage = messages[0];

    // if (!receivedMessage) {
    //     throw new Error(500, "Internal server error");
    // }

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
