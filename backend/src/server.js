/**
 * Server Entry Point
 * 
 * Purpose: Main entry point for the Food Restaurant App backend.
 * This file:
 * 1. Loads environment variables
 * 2. Creates HTTP server from Express app
 * 3. Initializes Socket.IO for real-time communication
 * 4. Connects to database
 * 5. Starts listening for connections
 */

require('dotenv').config()

const http = require('http');
const app = require('./app');
const db = require('./configs/database');
const initializeSocketServer = require('./socket/socketServer');

// Connect to database
db();

// Create HTTP server from Express app
// This is needed because Socket.IO requires the HTTP server instance
const server = http.createServer(app);

// Initialize Socket.IO with the HTTP server
const io = initializeSocketServer(server);

// Start listening
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server connected Successfully on port ${PORT}`);
    console.log(`Socket.IO ready for real-time connections`);
});