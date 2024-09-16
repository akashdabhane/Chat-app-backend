const app = require('./app.js');
const connectDB = require('../src/database/connection');
const initializeSocketIO = require('../src/socket.io/index.socket.js')
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config({
    path: './.env'
});

// http server holding express js instance
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ['http://localhost:3000', 'http://localhost:3001'],
        methods: ["GET", "POST"],
        credentials: true  // allow cookies from the client to be sent with the server's response
    },
});


// connect to the DB
connectDB()         //.then(() => {

// running socket.io 
initializeSocketIO(io);

const PORT = process.env.PORT || 9000;
server.listen(PORT, () => {
    console.log('server is running on port', PORT);
});

// }).catch(error => {
//     console.log("Mongodb connection failed", error);
// })



