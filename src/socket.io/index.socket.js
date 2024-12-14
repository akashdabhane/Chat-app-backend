const { saveMessage } = require("../controller/message.controller");
const { getConnectChatRoomsList } = require("../controller/socket.controller");
const { ChatEventEnum } = require("../constants");
// const Redis = require('ioredis');
// const redis = new Redis(); // Default: connects to localhost:6379

const initializeSocketIO = (io) => {
    io.on("connection", (socket) => {
        // console.log("User connected : ", socket.id);

        socket.on(ChatEventEnum.ACTIVE_FLAG, (data) => handleActiveFlag(socket, data));
        socket.on(ChatEventEnum.INACTIVE_FLAG, (data) => handleInactiveFlag(socket, data));
        socket.on(ChatEventEnum.JOIN_ROOM, (roomName) => handleJoinRoom(socket, roomName));
        socket.on(ChatEventEnum.TYPING_FLAG, (data) => handleTypingFlag(socket, data));
        socket.on(ChatEventEnum.STOP_TYPING_FLAG, (data) => handleStopTypingFlag(socket, data));
        socket.on(ChatEventEnum.SEND_MESSAGE, (data) => handleSendMessage(socket, data));

        socket.on('disconnect', () => {
            console.log("User disconnected", socket.id);
        })

        socket.on("send_userdata", (data) => {
            socket.broadcast.emit("receive_userdata", data);
        });
    });
}

// commented code is of redis 
const handleJoinRoom = async (socket, roomName) => {
    console.log('user join the room', roomName);
    socket.join(roomName);

    // // Fetch current typing users in the room
    // const typingUsers = await redis.hgetall(`typing:${roomName}`);

    // // Send the current typing state to the newly joined user
    // socket.emit("current_typing_state", typingUsers);
}

const handleActiveFlag = (socket, data) => {
    console.log('User is active', data);
    socket.broadcast.emit('receive-active-flag', data);
}

const handleInactiveFlag = (socket, data) => {
    console.log('User is inactive', data);
    socket.broadcast.emit('receive-inactive-flag', data);
}

const handleTypingFlag = async (socket, data) => {
    console.log('User is typing', data);

    // // Add the user to the room's typing state
    // await redis.hset(`typing:${data.roomName}`, data.userId, true);

    socket.to(data.roomName).emit('receive-typing-flag', data);
}

const handleStopTypingFlag = async (socket, data) => {
    console.log('User stopped typing', data);

    // // Remove the user from the room's typing state
    // await redis.hdel(`typing:${data.roomName}`, data.userId);

    socket.to(data.roomName).emit('receive-typing-stop-flag', data);
}

handleSendMessage = (socket, data) => {
    console.log('send dataa is :', data)
    // save message to database before sending it to all clients in the room
    saveMessage(data.messageData);

    // can use broadcast here if we want to share to everyone
    socket.to(data.roomName).emit(ChatEventEnum.RECEIVE_MESSAGE, data);
}


module.exports = initializeSocketIO;