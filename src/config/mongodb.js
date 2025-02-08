
import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect("LINK", {
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

export default connectDB;