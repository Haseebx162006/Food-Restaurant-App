/**
 * Socket Manager Utility
 * 
 * Purpose: Central utility for managing Socket.IO operations across the application.
 * This allows any part of the backend (controllers, services) to emit socket events
 * without needing direct access to the io instance.
 * 
 * Design Pattern: Singleton pattern - stores one global io instance
 * 
 * Usage Example:
 *   const socketManager = require('../utils/socketManager');
 *   socketManager.emitToAdmin('new-order', orderData);
 */

// Store the Socket.IO instance globally
let io = null;

/**
 * Initialize the socket manager with the Socket.IO instance
 * Called once during server startup
 * @param {Object} socketIO - The Socket.IO server instance
 */
const initializeSocket = (socketIO) => {
    io = socketIO;
    console.log('[SocketManager] Initialized successfully');
};

/**
 * Get the Socket.IO instance
 * @returns {Object} The Socket.IO server instance
 */
const getIO = () => {
    if (!io) {
        console.warn('[SocketManager] Socket.IO not initialized yet');
    }
    return io;
};

/**
 * Emit an event to all connected admin users
 * Admins join the 'admin-room' when they connect
 * @param {string} event - Event name (e.g., 'new-order')
 * @param {Object} data - Data to send with the event
 */
const emitToAdmin = (event, data) => {
    if (!io) {
        console.warn('[SocketManager] Cannot emit - Socket.IO not initialized');
        return;
    }
    io.to('admin-room').emit(event, data);
    console.log(`[SocketManager] Emitted '${event}' to admin-room`);
};

/**
 * Emit an event to a specific customer watching their order
 * Customers join a room named 'order-{orderId}' when tracking their order
 * @param {string} orderId - The order ID (used as room name)
 * @param {string} event - Event name (e.g., 'order-status-updated')
 * @param {Object} data - Data to send with the event
 */
const emitToCustomer = (orderId, event, data) => {
    if (!io) {
        console.warn('[SocketManager] Cannot emit - Socket.IO not initialized');
        return;
    }
    io.to(`order-${orderId}`).emit(event, data);
    console.log(`[SocketManager] Emitted '${event}' to order-${orderId}`);
};

/**
 * Broadcast an event to ALL connected clients
 * Use sparingly - typically for public announcements
 * @param {string} event - Event name (e.g., 'menu-updated')
 * @param {Object} data - Data to send with the event
 */
const emitToAll = (event, data) => {
    if (!io) {
        console.warn('[SocketManager] Cannot emit - Socket.IO not initialized');
        return;
    }
    io.emit(event, data);
    console.log(`[SocketManager] Broadcast '${event}' to all clients`);
};

/**
 * Add a socket to a specific room
 * @param {Object} socket - The socket instance
 * @param {string} room - Room name to join
 */
const addToRoom = (socket, room) => {
    socket.join(room);
    console.log(`[SocketManager] Socket ${socket.id} joined room: ${room}`);
};

/**
 * Remove a socket from a specific room
 * @param {Object} socket - The socket instance
 * @param {string} room - Room name to leave
 */
const removeFromRoom = (socket, room) => {
    socket.leave(room);
    console.log(`[SocketManager] Socket ${socket.id} left room: ${room}`);
};

module.exports = {
    initializeSocket,
    getIO,
    emitToAdmin,
    emitToCustomer,
    emitToAll,
    addToRoom,
    removeFromRoom
};
