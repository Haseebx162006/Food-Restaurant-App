/**
 * Menu Socket Events Handler
 * 
 * Purpose: Handle menu-related socket events.
 * This mainly involves broadcasting menu updates to all connected customers.
 * 
 * Note: The primary use case is emitting 'menu-updated' from the menuController
 * when admin changes item availability. This handler sets up any client-side
 * menu subscription events if needed.
 * 
 * Events:
 * - 'subscribe-menu-updates' - Client subscribes to menu updates
 * - 'menu-updated' (emitted by server) - Broadcast when menu item changes
 */

const socketManager = require('../../utils/socketManager');

/**
 * Register menu-related socket events for a connected socket
 * @param {Object} io - The Socket.IO server instance
 * @param {Object} socket - The connected socket instance
 */
const registerMenuEvents = (io, socket) => {

    /**
     * Event: subscribe-menu-updates
     * 
     * Customer can explicitly subscribe to menu updates.
     * This allows them to receive real-time notifications when
     * menu items become available or unavailable.
     */
    socket.on('subscribe-menu-updates', () => {
        // Join a room for menu updates
        socket.join('menu-updates-room');
        console.log(`[MenuEvents] Socket ${socket.id} subscribed to menu updates`);

        // Confirm subscription
        socket.emit('menu-subscription-confirmed', {
            message: 'You will receive real-time menu updates'
        });
    });

    /**
     * Event: unsubscribe-menu-updates
     * 
     * Customer can unsubscribe from menu updates
     */
    socket.on('unsubscribe-menu-updates', () => {
        socket.leave('menu-updates-room');
        console.log(`[MenuEvents] Socket ${socket.id} unsubscribed from menu updates`);
    });
};

/**
 * Helper function to broadcast menu update to all customers
 * Called from menuController when availability changes
 * 
 * Usage: broadcastMenuUpdate({ itemId: '123', name: 'Burger', availability: false })
 * 
 * @param {Object} updateData - The update data to broadcast
 */
const broadcastMenuUpdate = (updateData) => {
    const io = socketManager.getIO();
    if (io) {
        // Emit to customers subscribed to menu updates
        io.to('menu-updates-room').emit('menu-updated', updateData);
        // Also emit to all connected clients as fallback
        io.emit('menu-updated', updateData);
        console.log(`[MenuEvents] Broadcast menu update:`, updateData.itemId || updateData);
    }
};

module.exports = registerMenuEvents;
module.exports.broadcastMenuUpdate = broadcastMenuUpdate;
