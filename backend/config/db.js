import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        // Event listener for successful connection
        mongoose.connection.on('connected', () => {
            console.log('Database Connected');
        });

        // Attempting to connect to the MongoDB database
        await mongoose.connect(process.env.MONGO_URI);
    } catch (error) {
        console.error('Database Connection Error:', error.message);
    }
};

export default connectDB;
