const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String, 
        required: [true, "Email is required"], 
        unique: true, 
        index: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        unique: true, 
    },
}, {timestamps: true})

const User = mongoose.model("User", userSchema);

module.exports = User;



