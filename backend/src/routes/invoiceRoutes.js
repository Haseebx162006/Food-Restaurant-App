const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');
const { protect, adminOnly } = require('../middleware/auth_middleware');

// Generate invoice for an order (Customer/Admin)
router.post('/generate/:id', protect, invoiceController.generateInvoice);

// Get invoice by order ID (Customer/Admin)
router.get('/order/:id', protect, invoiceController.getInvoiceByOrderId);

// Get my invoices (Customer)
router.get('/my-invoices', protect, invoiceController.getMyInvoices);

// Get all invoices (Admin only)
router.get('/', protect, adminOnly, invoiceController.getAllInvoices);

// Download invoice as PDF (Customer/Admin)
router.get('/download/:id', protect, invoiceController.downloadInvoicePDF);

module.exports = router;
