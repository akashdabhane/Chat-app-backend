const ChatMessage = require("../model/chatMessage.model");
const { saveMessage } = require("../controller/message.controller");
const { getConnectChatRoomsList } = require("../controller/socket.controller");

const initializeSocketIO = (io) => {
    io.on("connection", (socket) => {
        console.log("User connected : ", socket.id);

        socket.on('send-active-flag', (data) => {
            console.log('User is active', data);

            socket.emit('receive-active-flag', data)        // to(getConnectChatRoomsList(data.userId))
        })

        socket.on('send-inactive-flag', (data) => {
            console.log('User is inactive', data);

            socket.emit('receive-inactive-flag', data)      // to(getConnectChatRoomsList(data.userId))
        })

        socket.on('disconnect', () => {
            console.log("User disconnected", socket.id);
        })

        socket.on("join_room", async (roomName) => {
            socket.join(roomName);
            console.log('user join the room', roomName);

            const chat = await ChatMessage.find({ chat: roomName });

            socket.on('send-typing-flag', (data) => {
                console.log('User is typing', data);
                socket.to(data.roomName).emit('receive-typing-flag', data);
            })

            socket.on('send-typing-stop-flag', (data) => {
                console.log('User stopped typing', data);
                socket.to(data.roomName).emit('receive-typing-stop-flag', data);
            })
        });

        socket.on("leaveRoom", (roomName) => {
            socket.leave(roomName);
            console.log('User left the room', roomName);
        });

        // leaveChatEvent(socket);

        // mountJoinChatEvent(socket);

        socket.on("send_message", (data) => {
            console.log('send dataa is :', data)
            // save message to database before sending it to all clients in the room
            saveMessage(data.messageData);

            socket.to(data.roomName).emit("receive_message", data);     // can use broadcast here if we want to share to everyone

        });

        socket.on("send_userdata", (data) => {
            socket.broadcast.emit("receive_userdata", data);
        });
    });
}

const mountJoinChatEvent = (socket) => {

}

const leaveChatEvent = (socket) => {

}

const mountParticipantTypingEvent = (socket) => {
    socket.on(ChatEventEnum.TYPING_EVENT, (chatId) => {
        socket.in(chatId).emit(ChatEventEnum.TYPING_EVENT, chatId);
    });
}

const mountParticipantStoppedTypingEvent = (socket) => {
    socket.on(ChatEventEnum.STOP_TYPING_EVENT, (chatId) => {
        socket.in(chatId).emit(ChatEventEnum.STOP_TYPING_EVENT, chatId);
    });
}

module.exports = initializeSocketIO;