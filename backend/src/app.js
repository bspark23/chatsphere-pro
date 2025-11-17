import dotenv from 'dotenv';
// Load environment variables FIRST before any other imports
dotenv.config();

console.log('🔑 Environment loaded successfully');

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { connectDB } from './config/db.js';
import { connectRedis } from './config/redis.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import messageRoutes from './routes/messages.js';
import groupRoutes from './routes/groups.js';
import analyticsRoutes from './routes/analytics.js';
import uploadRoutes from './routes/upload.js';
import verificationRoutes from './routes/verification.js';
import { setupSocketHandlers } from './socket/handlers.js';

const app = express();
const httpServer = createServer(app);

// CORS configuration for production
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
};

const io = new Server(httpServer, {
  cors: corsOptions,
  transports: ['websocket', 'polling'],
  path: '/socket.io/'
});

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV 
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/verification', verificationRoutes);

// Initialize connections
let redisClient;

const initializeConnections = async () => {
  try {
    await connectDB();
    redisClient = await connectRedis();
    setupSocketHandlers(io, redisClient);
    console.log('All connections initialized');
  } catch (error) {
    console.error('Connection initialization error:', error);
  }
};

// Initialize on startup
if (process.env.NODE_ENV !== 'production') {
  initializeConnections();
}

// Export for Vercel
export default app;
export { httpServer, io, initializeConnections };
