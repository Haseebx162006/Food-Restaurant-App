const express = require('express')
const app = express()
const auth_routes = require('./routes/auth_routes')
const menu_routes = require('./routes/menu_routes')
const order_routes = require('./routes/orderRoutes')


app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api/auth", auth_routes)
app.use("/api/menu", menu_routes)
app.use("/api/orders", order_routes)
app.get('/', (req, res) => {
    res.send("Helloooo kya hal ha theak ho")
})


module.exports = app