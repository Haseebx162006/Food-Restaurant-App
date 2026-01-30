/**
 * PDF Generation Service for Invoices
 * Uses PDFKit to generate professional invoice PDFs
 */

const PDFDocument = require('pdfkit');

/**
 * Generate a PDF document for an invoice/order
 * @param {Object} order - The order data to generate invoice from
 * @param {Object} res - Express response object to pipe PDF to
 */
const generateInvoicePDF = (order, res) => {
    // Create a new PDF document
    const doc = new PDFDocument({
        margin: 50,
        size: 'A4'
    });

    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${order.orderId}.pdf`);

    // Pipe the PDF to the response
    doc.pipe(res);

    // --- Header Section ---
    generateHeader(doc);

    // --- Customer Information Section ---
    generateCustomerInfo(doc, order);

    // --- Invoice Details Section ---
    generateInvoiceDetails(doc, order);

    // --- Items Table Section ---
    generateItemsTable(doc, order);

    // --- Totals Section ---
    generateTotals(doc, order);

    // --- Footer Section ---
    generateFooter(doc);

    // Finalize the PDF
    doc.end();
};

/**
 * Generate the header section with company logo and info
 */
const generateHeader = (doc) => {
    doc
        .fillColor('#FF3131')
        .fontSize(28)
        .font('Helvetica-Bold')
        .text('FoodExpress', 50, 50)
        .fillColor('#666666')
        .fontSize(10)
        .font('Helvetica')
        .text('Delicious food, fast delivery', 50, 82)
        .moveDown();

    // Company Address
    doc
        .fontSize(10)
        .fillColor('#444444')
        .text('123 Food Street, Tasty City', 50, 105)
        .text('Phone: +1 234 567 890', 50, 120)
        .text('Email: billing@foodexpress.com', 50, 135);

    // Invoice Title on Right
    doc
        .fillColor('#1E1E24')
        .fontSize(24)
        .font('Helvetica-Bold')
        .text('INVOICE', 400, 50, { align: 'right' });
};

/**
 * Generate customer information section
 */
const generateCustomerInfo = (doc, order) => {
    const customerInfoTop = 180;

    // Invoice To Label
    doc
        .fillColor('#888888')
        .fontSize(10)
        .font('Helvetica-Bold')
        .text('INVOICE TO:', 50, customerInfoTop);

    // Customer Details
    doc
        .fillColor('#1E1E24')
        .fontSize(12)
        .font('Helvetica-Bold')
        .text(order.customerName || 'Customer', 50, customerInfoTop + 18)
        .font('Helvetica')
        .fontSize(10)
        .fillColor('#444444')
        .text(order.deliveryAddress || 'Address not provided', 50, customerInfoTop + 35)
        .text(order.customerPhone || 'Phone not provided', 50, customerInfoTop + 50);

    // Invoice Details on Right
    doc
        .fillColor('#888888')
        .fontSize(10)
        .font('Helvetica-Bold')
        .text('Invoice #:', 350, customerInfoTop)
        .fillColor('#1E1E24')
        .font('Helvetica')
        .text(`INV-${order.orderId}`, 420, customerInfoTop);

    doc
        .fillColor('#888888')
        .font('Helvetica-Bold')
        .text('Date:', 350, customerInfoTop + 18)
        .fillColor('#1E1E24')
        .font('Helvetica')
        .text(new Date(order.createdAt).toLocaleDateString(), 420, customerInfoTop + 18);

    doc
        .fillColor('#888888')
        .font('Helvetica-Bold')
        .text('Status:', 350, customerInfoTop + 36)
        .fillColor('#22C55E')
        .font('Helvetica-Bold')
        .text('PAID', 420, customerInfoTop + 36);
};

/**
 * Generate invoice details section (order info)
 */
const generateInvoiceDetails = (doc, order) => {
    doc
        .fillColor('#888888')
        .fontSize(10)
        .font('Helvetica-Bold')
        .text('Order ID:', 350, 244)
        .fillColor('#1E1E24')
        .font('Helvetica')
        .text(order.orderId, 420, 244);

    doc
        .fillColor('#888888')
        .font('Helvetica-Bold')
        .text('Payment:', 350, 262)
        .fillColor('#1E1E24')
        .font('Helvetica')
        .text(order.paymentMethod || 'Cash on Delivery', 420, 262);
};

/**
 * Generate the items table
 */
const generateItemsTable = (doc, order) => {
    const tableTop = 310;

    // Table Header
    doc
        .fillColor('#F5F5F5')
        .rect(50, tableTop, 500, 25)
        .fill();

    doc
        .fillColor('#888888')
        .fontSize(10)
        .font('Helvetica-Bold')
        .text('DESCRIPTION', 60, tableTop + 8)
        .text('QTY', 320, tableTop + 8, { width: 50, align: 'center' })
        .text('PRICE', 380, tableTop + 8, { width: 70, align: 'right' })
        .text('TOTAL', 460, tableTop + 8, { width: 80, align: 'right' });

    // Table Rows
    let position = tableTop + 35;
    const items = order.items || [];

    items.forEach((item, index) => {
        // Alternate row background
        if (index % 2 === 1) {
            doc
                .fillColor('#FAFAFA')
                .rect(50, position - 5, 500, 25)
                .fill();
        }

        doc
            .fillColor('#1E1E24')
            .fontSize(10)
            .font('Helvetica')
            .text(item.itemName || 'Item', 60, position)
            .text(item.quantity.toString(), 320, position, { width: 50, align: 'center' })
            .text(`Rs. ${item.price}`, 380, position, { width: 70, align: 'right' })
            .font('Helvetica-Bold')
            .text(`Rs. ${item.subtotal}`, 460, position, { width: 80, align: 'right' });

        position += 25;
    });

    // Store the position for totals section
    return position;
};

/**
 * Generate the totals section
 */
const generateTotals = (doc, order) => {
    const items = order.items || [];
    const totalsTop = 310 + 35 + (items.length * 25) + 20;

    // Horizontal line
    doc
        .strokeColor('#EEEEEE')
        .lineWidth(1)
        .moveTo(350, totalsTop)
        .lineTo(550, totalsTop)
        .stroke();

    // Subtotal
    doc
        .fillColor('#666666')
        .fontSize(10)
        .font('Helvetica')
        .text('Subtotal:', 350, totalsTop + 15)
        .text(`Rs. ${order.totalAmount || 0}`, 460, totalsTop + 15, { width: 80, align: 'right' });

    // Tax
    doc
        .text('GST (5%):', 350, totalsTop + 35)
        .text(`Rs. ${order.taxAmount || 0}`, 460, totalsTop + 35, { width: 80, align: 'right' });

    // Delivery
    doc
        .text('Delivery:', 350, totalsTop + 55)
        .text(`Rs. ${order.deliveryAmount || 0}`, 460, totalsTop + 55, { width: 80, align: 'right' });

    // Grand Total line
    doc
        .strokeColor('#1E1E24')
        .lineWidth(2)
        .moveTo(350, totalsTop + 75)
        .lineTo(550, totalsTop + 75)
        .stroke();

    // Grand Total
    doc
        .fillColor('#FF3131')
        .fontSize(14)
        .font('Helvetica-Bold')
        .text('Grand Total:', 350, totalsTop + 85)
        .text(`Rs. ${order.grandTotal || 0}`, 440, totalsTop + 85, { width: 100, align: 'right' });
};

/**
 * Generate the footer section
 */
const generateFooter = (doc) => {
    doc
        .fillColor('#888888')
        .fontSize(9)
        .font('Helvetica')
        .text(
            'Thank you for ordering with FoodExpress! We appreciate your business.',
            50,
            750,
            { align: 'center', width: 500 }
        )
        .text(
            'For any queries, please contact our support at support@foodexpress.com',
            50,
            765,
            { align: 'center', width: 500 }
        );
};

module.exports = {
    generateInvoicePDF
};
