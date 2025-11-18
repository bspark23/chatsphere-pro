// Vercel serverless function entry point
import app, { initializeConnections } from '../src/app.js';

// Initialize connections for serverless
let initialized = false;

export default async function handler(req, res) {
  if (!initialized) {
    try {
      await initializeConnections();
      initialized = true;
    } catch (error) {
      console.error('Failed to initialize:', error);
      return res.status(500).json({ error: 'Server initialization failed' });
    }
  }
  
  return app(req, res);
}
