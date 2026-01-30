const express = require('express')
const cors = require('cors')
const app = express()
const auth_routes = require('./routes/auth_routes')
const menu_routes = require('./routes/menu_routes')
const order_routes = require('./routes/orderRoutes')
const invoice_routes = require('./routes/invoiceRoutes')


// Enable CORS for frontend
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api/auth", auth_routes)
app.use("/api/menu", menu_routes)
app.use("/api/orders", order_routes)
app.use("/api/invoices", invoice_routes)
app.get('/', (req, res) => {
    res.send("Helloooo kya hal ha theak ho")
})


module.exports = app