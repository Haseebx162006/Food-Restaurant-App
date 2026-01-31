const request = require('supertest');
const app = require('../src/app');
const User = require('../src/schemas/User');
const MenuItem = require('../src/schemas/MenuItem');
const mongoose = require('mongoose');

describe('Menu Endpoints', () => {
    let adminToken;
    let itemId;

    beforeAll(async () => {
        // Create Admin User
        const adminUser = await User.create({
            name: 'Admin User',
            email: `admin${Date.now()}@example.com`,
            password: 'password123',
            role: 'admin'
        });

        // Login to get token
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: adminUser.email,
                password: 'password123'
            });

        adminToken = res.body.token;
    });

    it('should create a new menu item', async () => {
        const res = await request(app)
            .post('/api/menu/createitem')
            .set('Authorization', `Bearer ${adminToken}`)
            .field('name', 'Test Burger')
            .field('description', 'Delicious test burger')
            .field('price', 150)
            .field('category', 'Fast Food')
            .field('availability', true);
        // .attach('image', 'path/to/test/image.jpg'); // Skipping image for now or need a dummy file

        expect(res.statusCode).toEqual(201);
        expect(res.body.data).toHaveProperty('name', 'Test Burger');
        itemId = res.body.data._id;
    });

    it('should get all menu items', async () => {
        const res = await request(app)
            .get('/api/menu/getallitems');

        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body.data)).toBeTruthy();
        const createdItem = res.body.data.find(i => i._id === itemId);
        expect(createdItem).toBeTruthy();
    });

    it('should update a menu item', async () => {
        const res = await request(app)
            .put(`/api/menu/updateitem/${itemId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                price: 180,
                name: 'Updated Burger'
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toHaveProperty('price', 180);
        expect(res.body.data).toHaveProperty('name', 'Updated Burger');
    });

    it('should delete a menu item (soft delete)', async () => {
        const res = await request(app)
            .delete(`/api/menu/deleteitem/${itemId}`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toEqual(200);

        // Verify it's gone from getAllItems
        const checkRes = await request(app).get('/api/menu/getallitems');
        const defaultFound = checkRes.body.data.find(i => i._id === itemId);
        expect(defaultFound).toBeUndefined();
    });
});
