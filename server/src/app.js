import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import authRoutes from './routes/auth.routes.js';
import documentRoutes from './routes/document.routes.js';
import studyRoutes from './routes/study.routes.js';

app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/study', studyRoutes);

// Basic Route
app.get('/', (req, res) => {
    res.send('AI Study Assistant API is running');
});

// Database Connection
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

// Start Server
if (process.env.MONGODB_URI) {
    connectDB().then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    });
} else {
    console.warn("MONGODB_URI is not defined in .env. Server starting without DB connection.");
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT} (No DB)`);
    });
}

export default app;
