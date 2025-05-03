const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const dbname = process.env.dbname; // e.g., "chit-chat"
        
        // MongoDB Atlas connection string (replace with your own values)
        const mongoURI = process.env.MONGO_URI || `mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/${dbname}?retryWrites=true&w=majority`;

        await mongoose.connect(mongoURI);

        console.log(`✅ MongoDB connected: ${dbname}`);
    } catch (err) {
        console.error('❌ MongoDB connection failed:', err.message);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;
