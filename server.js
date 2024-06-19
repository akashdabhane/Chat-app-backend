const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./server/database/connection');
// const morgan = require('mongan'); 
// const bodyparser = require('body-parser'); 

const app = express();

// .env file 
require("dotenv").config();

// cross origin platform
app.use(cors());


// log requests
// app.use(morgan('tiny'));

// // parse request to body parser 
// app.use(bodyparser.urlencoded({ extended: true }))

// allow json data format
app.use(express.json());

// connect to the DB
connectDB();

// load router 
app.use('/', require("./server/routes/router"));

// http server holding express js instance
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ["GET", "POST"],
    },
});


// running socket.io 
io.on("connection", (socket) => {
    console.log("User connected : ", socket.id);

    socket.on('disconnect', () => {
        console.log("User disconnected", socket.id);
    })

    socket.on("leaveRoom", (roomName) => {
        socket.leave(roomName);
        console.log('User left the room', roomName); 
    }); 

    socket.on("join_room", (roomName) => {
        socket.join(roomName);
        console.log('user join the room', roomName); 
    });

    socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message", data);     // can use broadcast here if we want to share to everyone
    });

    socket.on("send_userdata", (data) => {
        socket.broadcast.emit("receive_userdata", data);
    });
});


const port = process.env.PORT || 9000;
server.listen(port, () => {
    console.log('server is running on port ', port);
});




