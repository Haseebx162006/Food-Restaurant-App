const mongoose = require('mongoose')

const invoiceSchema = new mongoose.Schema({
    invoice_id: {
        type: String,
        required: true,
        unique: true
    },
    customer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    order_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    customerName: {
        type: String,
        required: true
    },
    customerEmail: {
        type: String
    },
    restaurantName: {
        type: String,
        default: 'FoodExpress'
    },
    restaurantAddress: {
        type: String,
        default: '123 Food Street, Tasty City'
    },
    items: [
        {
            itemName: String,
            quantity: Number,
            price: Number,
            subtotal: Number
        }
    ],
    subtotal: {
        type: Number
    },
    taxAmount: {
        type: Number
    },
    deliveryAmount: {
        type: Number
    },
    payment_Status: {
        type: String,
        enum: ['Pending', 'Paid', 'Failed'],
        default: 'Pending'
    },
    payment_Method: {
        type: String,
        default: 'Cash on Delivery'
    },
    invoice_date: {
        type: Date,
        default: Date.now
    },
    created_at: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Invoice', invoiceSchema)