const Invoice = require('../schemas/Invoice');
const Order = require('../schemas/Order');
const invoiceService = require('../services/InvoiceServices');
const pdfService = require('../services/pdfService');

/**
 * Generate Invoice from Order
 * Creates an invoice record from an existing order
 */
exports.generateInvoice = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ID
        if (!id || typeof id !== "string") {
            return res.status(400).json({
                success: false,
                message: "Valid order ID is required"
            });
        }

        // Find the order
        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Check if order is delivered
        if (order.orderStatus !== "Delivered") {
            return res.status(400).json({
                success: false,
                message: "Invoice can only be generated for delivered orders"
            });
        }

        // Use service to generate and save invoice
        const { invoice, isNew } = await invoiceService.generateAndSaveInvoice(id, req.user);

        return res.status(isNew ? 201 : 200).json({
            success: true,
            message: isNew ? 'Invoice generated successfully' : 'Invoice already exists',
            data: invoice
        });

    } catch (error) {
        console.error('Generate invoice error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to generate invoice',
            error: error.message
        });
    }
};

/**
 * Get Invoice by Order ID
 */
exports.getInvoiceByOrderId = async (req, res) => {
    try {
        const { id } = req.params;

        // Try to find existing invoice
        let invoice = await Invoice.findOne({ order_id: id });

        // If no invoice, generate one on-the-fly from order
        if (!invoice) {
            const order = await Order.findById(id);
            if (!order) {
                return res.status(404).json({
                    success: false,
                    message: 'Order not found'
                });
            }

            // Return order data formatted as invoice (without saving)
            const invoiceData = invoiceService.createInvoiceData(order, req.user);
            invoiceData.invoice_id = `INV-${order.orderId}`;
            invoiceData.grandTotal = order.grandTotal;
            invoiceData.orderId = order.orderId;
            invoiceData.customerPhone = order.customerPhone;
            invoiceData.deliveryAddress = order.deliveryAddress;

            return res.status(200).json({
                success: true,
                data: invoiceData
            });
        }

        return res.status(200).json({
            success: true,
            data: invoice
        });

    } catch (error) {
        console.error('Get invoice error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get invoice',
            error: error.message
        });
    }
};

/**
 * Get all invoices for current user
 */
exports.getMyInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find({ customer_id: req.user._id })
            .sort({ created_at: -1 });

        return res.status(200).json({
            success: true,
            count: invoices.length,
            data: invoices
        });

    } catch (error) {
        console.error('Get my invoices error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get invoices',
            error: error.message
        });
    }
};

/**
 * Get all invoices (Admin only)
 */
exports.getAllInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find()
            .populate('customer_id', 'name email')
            .sort({ created_at: -1 });

        return res.status(200).json({
            success: true,
            count: invoices.length,
            data: invoices
        });

    } catch (error) {
        console.error('Get all invoices error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get invoices',
            error: error.message
        });
    }
};

/**
 * Download Invoice as PDF
 * Generates and streams a PDF invoice for download
 */
exports.downloadInvoicePDF = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the order
        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Generate and stream the PDF
        pdfService.generateInvoicePDF(order, res);

    } catch (error) {
        console.error('Download invoice PDF error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to generate PDF',
            error: error.message
        });
    }
};
