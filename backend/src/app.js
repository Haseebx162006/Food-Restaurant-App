const express = require('express')
const cors = require('cors')
const path = require('path')
const app = express()
const auth_routes = require('./routes/auth_routes')
const menu_routes = require('./routes/menu_routes')
const order_routes = require('./routes/orderRoutes')
const invoice_routes = require('./routes/invoiceRoutes')


// Request Logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - Content-Type: ${req.headers['content-type']}`);
    next();
});

// Enable CORS for frontend
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

app.use("/api/auth", auth_routes)
app.use("/api/menu", menu_routes)
app.use("/api/orders", order_routes)
app.use("/api/invoices", invoice_routes)
app.get('/', (req, res) => {
    res.send("Helloooo kya hal ha theak ho")
})

// Global error handler
app.use((err, req, res, next) => {
    console.error('[GlobalError]', err.message, err.stack);

    // Handle multer errors
    if (err.name === 'MulterError') {
        return res.status(400).json({ success: false, msg: err.message });
    }

    res.status(err.status || 500).json({
        success: false,
        msg: err.message || 'Internal server error'
    });
});


module.exports = app