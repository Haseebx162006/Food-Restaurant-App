const request = require('supertest');
const app = require('../src/app');
const User = require('../src/schemas/User');
const mongoose = require('mongoose');

describe('Auth Endpoints', () => {
    // Generate a unique user for this test run
    const testUser = {
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: 'password123',
        address: '123 Test St',
        phone: '1234567890'
    };

    let token = '';
    let userId = '';

    it('should register a new user', async () => {
        const res = await request(app)
            .post('/api/auth/signup')
            .send(testUser);

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('success', true);
        expect(res.body).toHaveProperty('result');
        // expect(res.body.user).toHaveProperty('email', testUser.email); // API doesn't return user on signup

        token = res.body.result;
        // userId = res.body.user._id; // API doesn't return user
    });

    it('should login the user', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: testUser.email,
                password: testUser.password
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('success', true);
        expect(res.body).toHaveProperty('token');
    });

    it('should fail to login with wrong password', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: testUser.email,
                password: 'wrongpassword'
            });

        expect(res.statusCode).toEqual(401); // Or 401 depending on controller
    });

    it('should update user profile', async () => {
        const res = await request(app)
            .put('/api/auth/profile')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Updated Name',
                phone: '0987654321'
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body.user).toHaveProperty('name', 'Updated Name');
        expect(res.body.user).toHaveProperty('phone', '0987654321');
    });
});
