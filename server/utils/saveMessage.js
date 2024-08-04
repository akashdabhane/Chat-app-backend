const mongoose = require("mongoose")
const ChatMessage = require("../model/chatMessage")


const saveMessage = async(sender, message, chat) => {
    if(!sender) console.log('sender is missing')
    if(!message) console.log('message is missing')
    if(!chat) console.log('chat is missing')

    await ChatMessage.create({sender, message, chat})
}

exports.saveMessage
