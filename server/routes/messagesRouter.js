const express = require('express'); 
const messageRouter = express.Router(); 
const message = require('../controller/message')

messageRouter.post('/chat/:chatId', message.sendMessage); 


module.exports = messageRouter; 

