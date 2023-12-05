const mongoose = require('mongoose');
const url = process.env.MongoDBUrl || "mongodb+srv://akashdabhane10:ERMteGrUFW88yCmm@cluster0.7ybtc37.mongodb.net/ChatApp?retryWrites=true&w=majority";  

const connectDB = async () => {
    try {
        const con = await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log(`MongoDB connected: ${con.connection.host}`);
    } catch (error) {
        console.log('some error occured!'); 
        // console.log(error);
        // process.exit(1);
    }
}

module.exports = connectDB;


