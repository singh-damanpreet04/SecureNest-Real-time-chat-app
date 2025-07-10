import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './lib/db.js';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import aiRoutes from './routes/ai.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';
import { createServer } from 'http';
import { io, app, server } from './lib/socket.js';

// Initialize environment variables and database
dotenv.config();


const PORT = process.env.PORT || 5003;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/ai', aiRoutes);

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    connectDB();
});