const request = require('supertest');
const app = require('../src/app');
const User = require('../src/schemas/User');
const MenuItem = require('../src/schemas/MenuItem');
const Order = require('../src/schemas/Order');
const mongoose = require('mongoose');

describe('Order Endpoints', () => {
    let customerToken;
    let adminToken;
    let menuItemId;
    let orderId;

    beforeAll(async () => {
        // Create Customer
        const customer = await User.create({
            name: 'Customer User',
            email: `cust${Date.now()}@example.com`,
            password: 'password123',
            role: 'customer'
        });
        const custRes = await request(app).post('/api/auth/login').send({ email: customer.email, password: 'password123' });
        customerToken = custRes.body.token;

        // Create Admin
        const admin = await User.create({
            name: 'Admin User',
            email: `admin${Date.now()}@example.com`,
            password: 'password123',
            role: 'admin'
        });
        const adminRes = await request(app).post('/api/auth/login').send({ email: admin.email, password: 'password123' });
        adminToken = adminRes.body.token;

        // Create a Menu Item
        const item = await MenuItem.create({
            name: 'Order Test Item',
            description: 'Test Desc',
            price: 100,
            category: 'Test',
            availability: true
        });
        menuItemId = item._id.toString();
    });

    it('should create an order', async () => {
        const res = await request(app)
            .post('/api/orders')
            .set('Authorization', `Bearer ${customerToken}`)
            .send({
                items: [{ itemId: menuItemId, quantity: 2 }],
                customerName: 'Test Customer',
                customerPhone: '1234567890',
                deliveryAddress: 'Test Address'
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('success', true);
        expect(res.body.order).toHaveProperty('grandTotal', 360); // 200 + 10(5%) + 150 delivery
        orderId = res.body.order._id;
    });

    it('should get customer orders', async () => {
        const res = await request(app)
            .get('/api/orders/my-orders')
            .set('Authorization', `Bearer ${customerToken}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.data.length).toBeGreaterThan(0);
        expect(res.body.data[0]._id).toEqual(orderId);
    });

    it('should update order status (Admin)', async () => {
        const res = await request(app)
            .patch(`/api/orders/${orderId}/status`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ orderStatus: 'Preparing' });

        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toHaveProperty('orderStatus', 'Preparing');
    });

    it('should get dashboard stats (Admin)', async () => {
        const res = await request(app)
            .get('/api/orders/stats')
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body.stats).toHaveProperty('totalOrders');
        expect(res.body.stats).toHaveProperty('trends');
    });
});
