const Order = require('../schemas/Order');
const Invoice = require('../schemas/Invoice');

/**
 * Generate a unique invoice ID based on date and daily count
 * Format: INV-YYYYMMDD-XXX (e.g., INV-20260130-001)
 */
const generateInvoiceId = async () => {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD

    // Find the count of invoices today to increment XXX
    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
    const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);

    const count = await Invoice.countDocuments({
        created_at: { $gte: startOfDay, $lte: endOfDay }
    });

    const increment = (count + 1).toString().padStart(3, '0');
    return `INV-${dateStr}-${increment}`;
};

/**
 * Create invoice data object from an order
 */
const createInvoiceData = (order, user = null) => {
    return {
        customer_id: order.customerId,
        order_id: order._id,
        customerName: order.customerName,
        customerEmail: user?.email || '',
        restaurantName: 'FoodExpress',
        restaurantAddress: '123 Food Street, Tasty City',
        items: order.items.map(item => ({
            itemName: item.itemName,
            quantity: item.quantity,
            price: item.price,
            subtotal: item.subtotal
        })),
        subtotal: order.totalAmount,
        taxAmount: order.taxAmount,
        deliveryAmount: order.deliveryAmount,
        payment_Status: order.paymentStatus,
        payment_Method: order.paymentMethod,
        invoice_date: new Date()
    };
};

/**
 * Generate and save invoice for an order
 */
const generateAndSaveInvoice = async (orderId, user = null) => {
    const order = await Order.findById(orderId);
    if (!order) {
        throw new Error('Order not found');
    }

    // Check if invoice already exists
    const existingInvoice = await Invoice.findOne({ order_id: orderId });
    if (existingInvoice) {
        return { invoice: existingInvoice, isNew: false };
    }

    // Generate invoice ID and create invoice
    const invoiceId = await generateInvoiceId();
    const invoiceData = await createInvoiceData(order, user);
    invoiceData.invoice_id = invoiceId;

    const invoice = await Invoice.create(invoiceData);
    return { invoice, isNew: true };
};

module.exports = {
    generateInvoiceId,
    createInvoiceData,
    generateAndSaveInvoice
};