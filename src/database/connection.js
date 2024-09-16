const mongoose = require('mongoose');

const connectDB = async () => {
    const url = process.env.MONGODB_URI; 
    try {
        const con = await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log(`MongoDB connected: ${con.connection.host}`);
    } catch (error) {
        console.log(error,'some error occured!'); 
    }
}

module.exports = connectDB;
