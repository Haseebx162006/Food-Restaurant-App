/**
 * Order Socket Events Handler
 * 
 * Purpose: Handle all order-related socket events.
 * This includes customers joining order rooms and admins acknowledging orders.
 * 
 * Events handled:
 * 1. 'customer-join-order' - Customer joins their order room to receive updates
 * 2. 'admin-acknowledge-order' - Admin acknowledges order, updates status to Preparing
 * 
 * Note: The actual emission of 'new-order' and 'order-status-updated' events
 * happens from orderService.js when orders are created/updated via REST API.
 */

const Order = require('../../schemas/Order');
const socketManager = require('../../utils/socketManager');

/**
 * Register order-related socket events for a connected socket
 * @param {Object} io - The Socket.IO server instance
 * @param {Object} socket - The connected socket instance
 */
const registerOrderEvents = (io, socket) => {

    /**
     * Event: customer-join-order
     * 
     * When a customer wants to track their order in real-time,
     * they emit this event to join a room specific to their order.
     * 
     * Data expected: { orderId: "ORD-20260131-001" }
     */
    socket.on('customer-join-order', async (data) => {
        try {
            const { orderId } = data;

            // Validate orderId was provided
            if (!orderId) {
                socket.emit('error', { message: 'Order ID is required' });
                return;
            }

            // Find the order to get current status
            const order = await Order.findOne({
                $or: [{ _id: orderId }, { orderId: orderId }]
            });

            if (!order) {
                socket.emit('error', { message: 'Order not found' });
                return;
            }

            // Security check: Only allow order owner or admin to join
            if (socket.user) {
                const isOwner = order.customerId.toString() === socket.user._id.toString();
                const isAdmin = socket.user.role === 'admin';

                if (!isOwner && !isAdmin) {
                    socket.emit('error', { message: 'Not authorized to track this order' });
                    return;
                }
            }

            // Join the order-specific room
            const roomName = `order-${order.orderId}`;
            socketManager.addToRoom(socket, roomName);

            // Send current order status to the customer
            socket.emit('order-current-status', {
                orderId: order.orderId,
                status: order.orderStatus,
                updatedAt: order.updatedAt
            });

            console.log(`[OrderEvents] Socket ${socket.id} joined ${roomName}`);

        } catch (error) {
            console.error('[OrderEvents] Error joining order room:', error.message);
            socket.emit('error', { message: 'Failed to join order room' });
        }
    });

    /**
     * Event: admin-acknowledge-order
     * 
     * When admin clicks "Received" on an order, update status to "Preparing"
     * and notify the customer.
     * 
     * Data expected: { orderId: "ORD-20260131-001" }
     */
    socket.on('admin-acknowledge-order', async (data) => {
        try {
            // Check if user is admin
            if (!socket.user || socket.user.role !== 'admin') {
                socket.emit('error', { message: 'Only admins can acknowledge orders' });
                return;
            }

            const { orderId } = data;

            if (!orderId) {
                socket.emit('error', { message: 'Order ID is required' });
                return;
            }

            // Find and update the order
            const order = await Order.findOneAndUpdate(
                { $or: [{ _id: orderId }, { orderId: orderId }], orderStatus: 'Pending' },
                { orderStatus: 'Preparing' },
                { new: true }
            );

            if (!order) {
                socket.emit('error', { message: 'Order not found or already being prepared' });
                return;
            }

            // Notify the customer in their order room
            socketManager.emitToCustomer(order.orderId, 'order-status-updated', {
                orderId: order.orderId,
                status: order.orderStatus,
                updatedAt: order.updatedAt,
                message: 'Your order is now being prepared!'
            });

            // Confirm to admin
            socket.emit('order-acknowledged', {
                orderId: order.orderId,
                status: order.orderStatus
            });

            console.log(`[OrderEvents] Order ${order.orderId} acknowledged by admin`);

        } catch (error) {
            console.error('[OrderEvents] Error acknowledging order:', error.message);
            socket.emit('error', { message: 'Failed to acknowledge order' });
        }
    });

    /**
     * Event: customer-leave-order
     * 
     * When customer navigates away from order tracking page
     * 
     * Data expected: { orderId: "ORD-20260131-001" }
     */
    socket.on('customer-leave-order', (data) => {
        const { orderId } = data;
        if (orderId) {
            const roomName = `order-${orderId}`;
            socketManager.removeFromRoom(socket, roomName);
            console.log(`[OrderEvents] Socket ${socket.id} left ${roomName}`);
        }
    });
};

module.exports = registerOrderEvents;
