const MenuItem = require('../schemas/MenuItem');
const Order = require('../schemas/Order');

/**
 * Generate a unique order ID: ORD-YYYYMMDD-XXX
 */
const generateOrderId = async () => {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD

    // Find the count of orders today to increment XXX
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    const count = await Order.countDocuments({
        createdAt: { $gte: startOfDay, $lte: endOfDay }
    });

    const increment = (count + 1).toString().padStart(3, '0');
    return `ORD-${dateStr}-${increment}`;
};

/**
 * Calculate order totals: subtotal, tax (5%), delivery (Rs. 50), grandTotal
 */
const calculateOrderTotals = (items) => {
    const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const taxAmount = Math.round(subtotal * 0.05); // 5% tax
    const deliveryAmount = 50; // Fixed delivery charge
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
 * Placeholder for WebSocket notifications to Admin
 */
const notifyAdminNewOrder = (order) => {
    console.log(`[WebSocket] Notifying Admin: New Order ${order.orderId}`);
    // Future: io.emit('newOrder', order);
};

/**
 * Placeholder for WebSocket notifications to Customer
 */
const notifyCustomerOrderStatus = (order) => {
    console.log(`[WebSocket] Notifying Customer: Order ${order.orderId} is now ${order.orderStatus}`);
    // Future: io.to(order.customerId).emit('orderUpdate', order);
};

module.exports = {
    generateOrderId,
    calculateOrderTotals,
    validateAndFetchItems,
    notifyAdminNewOrder,
    notifyCustomerOrderStatus
};
