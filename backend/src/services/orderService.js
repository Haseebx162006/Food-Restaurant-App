const MenuItem = require('../schemas/MenuItem');
const Order = require('../schemas/Order');
const socketManager = require('../utils/socketManager');

/**
 * Generate a unique order ID: ORD-YYYYMMDD-XXX
 * Uses LOCAL date (not UTC) for consistency
 */
const generateOrderId = async () => {
    const now = new Date();

    // Use LOCAL date components (not UTC) for the order ID
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(now.getDate()).padStart(2, '0');
    const dateStr = `${year}${month}${day}`; // YYYYMMDD in local time

    // Create date range for TODAY in local time
    const startOfDay = new Date(year, now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const endOfDay = new Date(year, now.getMonth(), now.getDate(), 23, 59, 59, 999);

    const count = await Order.countDocuments({
        createdAt: { $gte: startOfDay, $lte: endOfDay }
    });

    const increment = (count + 1).toString().padStart(3, '0');
    return `ORD-${dateStr}-${increment}`;
};

/**
 * Calculate order totals: subtotal, tax (5%), delivery (Rs. 150), grandTotal
 */
const calculateOrderTotals = (items) => {
    const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const taxAmount = Math.round(subtotal * 0.05); // 5% tax
    const deliveryAmount = 150; // Fixed delivery charge
    const grandTotal = subtotal + taxAmount + deliveryAmount;

    return {
        subtotal,
        taxAmount,
        deliveryAmount,
        grandTotal
    };
};

/**
 * Validate items exist and fetch their current details (price, name)
 */
const validateAndFetchItems = async (itemsInput) => {
    const validatedItems = [];

    for (const item of itemsInput) {
        const menuItem = await MenuItem.findById(item.itemId);
        if (!menuItem || menuItem.isDeleted) {
            throw new Error(`Item with ID ${item.itemId} not found or is no longer available.`);
        }

        validatedItems.push({
            itemId: menuItem._id,
            itemName: menuItem.name,
            quantity: item.quantity,
            price: menuItem.price,
            subtotal: menuItem.price * item.quantity
        });
    }

    return validatedItems;
};

/**
 * Notify admin dashboard of a new order via WebSocket
 * Emits 'new-order' event to all connected admin users
 * @param {Object} order - The order document
 */
const notifyAdminNewOrder = (order) => {
    console.log(`[WebSocket] Notifying Admin: New Order ${order.orderId}`);

    // Emit to admin-room where all admin sockets are connected
    socketManager.emitToAdmin('new-order', {
        orderId: order.orderId,
        orderDbId: order._id,
        customerId: order.customerId,
        customerName: order.customerName,
        items: order.items,
        grandTotal: order.grandTotal,
        orderStatus: order.orderStatus,
        createdAt: order.createdAt
    });
};

/**
 * Notify customer of order status update via WebSocket
 * Emits 'order-status-updated' event to the customer's order room
 * @param {Object} order - The updated order document
 */
const notifyCustomerOrderStatus = (order) => {
    console.log(`[WebSocket] Notifying Customer: Order ${order.orderId} is now ${order.orderStatus}`);

    // Emit to order-specific room where customer is listening
    socketManager.emitToCustomer(order.orderId, 'order-status-updated', {
        orderId: order.orderId,
        status: order.orderStatus,
        updatedAt: order.updatedAt,
        message: getStatusMessage(order.orderStatus)
    });
};

/**
 * Get user-friendly message for order status
 * @param {string} status - The order status
 * @returns {string} User-friendly message
 */
const getStatusMessage = (status) => {
    const messages = {
        'Pending': 'Your order has been received and is awaiting confirmation.',
        'Preparing': 'Great news! Your order is now being prepared.',
        'Ready': 'Your order is ready for pickup/delivery!',
        'Delivered': 'Your order has been delivered. Enjoy your meal!',
        'Cancelled': 'Your order has been cancelled.'
    };
    return messages[status] || 'Order status updated.';
};

module.exports = {
    generateOrderId,
    calculateOrderTotals,
    validateAndFetchItems,
    notifyAdminNewOrder,
    notifyCustomerOrderStatus
};
