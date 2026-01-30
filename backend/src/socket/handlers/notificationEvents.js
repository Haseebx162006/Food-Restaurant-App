/**
 * Notification Socket Events Handler
 * 
 * Purpose: Handle general notification events.
 * This includes system-wide announcements, promotional notifications,
 * and custom notification subscriptions.
 * 
 * Events:
 * - 'subscribe-notifications' - User subscribes to receive notifications
 * - 'unsubscribe-notifications' - User unsubscribes from notifications
 * - 'notification' (emitted by server) - General notification to users
 */

const socketManager = require('../../utils/socketManager');

/**
 * Register notification-related socket events for a connected socket
 * @param {Object} io - The Socket.IO server instance
 * @param {Object} socket - The connected socket instance
 */
const registerNotificationEvents = (io, socket) => {

    /**
     * Event: subscribe-notifications
     * 
     * User subscribes to receive general notifications.
     * For authenticated users, they join a user-specific room.
     */
    socket.on('subscribe-notifications', () => {
        // All users join general notifications room
        socket.join('notifications-room');

        // Authenticated users also join their personal room
        if (socket.user) {
            socket.join(`user-${socket.user._id}`);
            console.log(`[NotificationEvents] User ${socket.user.name} subscribed to notifications`);
        } else {
            console.log(`[NotificationEvents] Anonymous user ${socket.id} subscribed to notifications`);
        }

        // Confirm subscription
        socket.emit('notification-subscription-confirmed', {
            message: 'You are now subscribed to notifications'
        });
    });

    /**
     * Event: unsubscribe-notifications
     * 
     * User unsubscribes from notifications
     */
    socket.on('unsubscribe-notifications', () => {
        socket.leave('notifications-room');

        if (socket.user) {
            socket.leave(`user-${socket.user._id}`);
        }

        console.log(`[NotificationEvents] Socket ${socket.id} unsubscribed from notifications`);
    });
};

/**
 * Helper function to send notification to a specific user
 * @param {string} userId - The user's MongoDB _id
 * @param {Object} notification - The notification data
 */
const sendNotificationToUser = (userId, notification) => {
    const io = socketManager.getIO();
    if (io) {
        io.to(`user-${userId}`).emit('notification', {
            ...notification,
            timestamp: new Date()
        });
        console.log(`[NotificationEvents] Sent notification to user ${userId}`);
    }
};

/**
 * Helper function to broadcast notification to all users
 * @param {Object} notification - The notification data
 */
const broadcastNotification = (notification) => {
    const io = socketManager.getIO();
    if (io) {
        io.to('notifications-room').emit('notification', {
            ...notification,
            timestamp: new Date()
        });
        console.log(`[NotificationEvents] Broadcast notification to all users`);
    }
};

module.exports = registerNotificationEvents;
module.exports.sendNotificationToUser = sendNotificationToUser;
module.exports.broadcastNotification = broadcastNotification;
