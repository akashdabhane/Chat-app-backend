const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const app = express();

// cross origin platform
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true  // allow cookies from the client to be sent with the server's response
}));

// log requests
app.use(morgan('tiny'));

// allow json data format
app.use(express.json());

app.use(cookieParser());

// import router 
const router = require("../src/routes/user.routes");
const chatRouter = require("../src/routes/chat.routes");
const adminRouter = require("../src/routes/admin.routes");
const groupRouter = require("../src/routes/group.routes");

app.use('/api/v1/users', router);
app.use('/api/v1/chats', chatRouter);
app.use('/api/v1/admins', adminRouter);
app.use('/api/v1/groups', groupRouter);

module.exports = app;
