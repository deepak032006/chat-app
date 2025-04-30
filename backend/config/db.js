const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const dbname = process.env.dbname; // example: "chit-chat"
        const mongoURI = `mongodb://127.0.0.1:27017/${dbname}`;

        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`✅ MongoDB connected: ${dbname}`);
    } catch (err) {
        console.error('❌ MongoDB connection failed:', err.message);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;
