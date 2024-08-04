const mongoose = require('mongoose');
const url = process.env.MONGODB_URI || "mongodb+srv://akashdabhane10:ERMteGrUFW88yCmm@cluster0.7ybtc37.mongodb.net/ChatApp?retryWrites=true&w=majority"; 

const connectDB = async () => {
    try {
        const con = await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log(`MongoDB connected: ${con.connection.host}`);
    } catch (error) {
        console.log('some error occured!'); 
    }
}

module.exports = connectDB;


