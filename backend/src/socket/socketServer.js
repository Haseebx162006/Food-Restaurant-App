/**
 * Socket Server Configuration
 * 
 * Purpose: Main entry point for Socket.IO setup.
 * This file initializes Socket.IO, applies middleware, and registers event handlers.
 * 
 * Architecture:
 * - Uses socketAuthMiddleware for JWT authentication
 * - Event handlers are separated into different files by feature (orders, menu, notifications)
 * - Uses socketManager for centralized socket operations
 */

const { Server } = require('socket.io');
const socketAuthMiddleware = require('./middleware/socketAuthMiddleware');
const socketManager = require('../utils/socketManager');

// Import event handlers
const registerOrderEvents = require('./handlers/orderEvents');
const registerMenuEvents = require('./handlers/menuEvents');
const registerNotificationEvents = require('./handlers/notificationEvents');

/**
 * Initialize Socket.IO with the HTTP server
 * @param {Object} httpServer - The HTTP server instance (from Express)
 * @returns {Object} The Socket.IO server instance
 */
const initializeSocketServer = (httpServer) => {
    // Step 1: Create Socket.IO server with CORS configuration
    const io = new Server(httpServer, {
        cors: {
            origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
            methods: ['GET', 'POST'],
            credentials: true
        }
    });

    // Step 2: Store io instance in socketManager for global access
    socketManager.initializeSocket(io);

    // Step 3: Apply authentication middleware to all connections
    io.use(socketAuthMiddleware);

    // Step 4: Handle new socket connections
    io.on('connection', (socket) => {
        console.log(`[Socket] New connection: ${socket.id}`);

        // Log user info if authenticated
        if (socket.user) {
            console.log(`[Socket] User connected: ${socket.user.name} (${socket.user.role})`);

            // Auto-join admin users to admin-room for receiving order notifications
            if (socket.user.role === 'admin') {
                socket.join('admin-room');
                console.log(`[Socket] Admin joined admin-room: ${socket.user.name}`);
            }
        } else {
            console.log('[Socket] Anonymous user connected');
        }

        // Step 5: Register event handlers for this socket connection
        registerOrderEvents(io, socket);
        registerMenuEvents(io, socket);
        registerNotificationEvents(io, socket);

        // Step 6: Handle disconnection
        socket.on('disconnect', (reason) => {
            console.log(`[Socket] Disconnected: ${socket.id} - Reason: ${reason}`);
        });

        // Step 7: Handle connection errors
        socket.on('error', (error) => {
            console.error(`[Socket] Error: ${socket.id}`, error.message);
        });
    });

    console.log('[Socket] Socket.IO server initialized successfully');
    return io;
};

module.exports = initializeSocketServer;
