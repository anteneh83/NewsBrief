import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import apiRoutes from './routes/api';
import { startAllJobs } from './jobs/feedScheduler';
import { connectDatabase } from './config/database';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDatabase();

// Middleware
// Simple request logger
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

app.use(cors({
    origin: true, // Be permissive during debugging
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve audio files
app.use('/audio', express.static(path.join(__dirname, '../audio')));

// API Routes
app.use('/api', apiRoutes);

// Basic test endpoint
app.get('/test', (req, res) => {
    res.json({ message: 'Server is reachable' });
});

// Health check with database status
app.get('/health', async (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    res.json({
        status: dbStatus === 'connected' ? 'ok' : 'error',
        database: dbStatus,
        timestamp: new Date().toISOString()
    });
});

// Alias for health check under /api/health
app.get('/api/health', (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    res.json({
        status: dbStatus === 'connected' ? 'ok' : 'error',
        database: dbStatus,
        timestamp: new Date().toISOString()
    });
});

// Start server
const server = app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`✅ Server running on http://0.0.0.0:${PORT}`);
    console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);

    // Start background jobs
    startAllJobs();
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\nShutting down gracefully...');
    try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
        process.exit(0);
    } catch (err) {
        console.error('Error closing MongoDB connection:', err);
        process.exit(1);
    }
});

export default app;
