/**
 * Admin Seed Script
 * Run this to create an admin user in the database
 * Usage: node scripts/seedAdmin.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/schemas/User');

const ADMIN_EMAIL = 'muzaffar10112@gmail.com';
const ADMIN_PASSWORD = 'jarvisxhaseeb';
const ADMIN_NAME = 'Haseeb Ahmad';

async function seedAdmin() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.DATABASE_URL);
        console.log('✅ Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });

        if (existingAdmin) {
            console.log('⚠️  Admin user already exists!');
            console.log(`   Email: ${ADMIN_EMAIL}`);

            // Update role to admin if not already
            if (existingAdmin.role !== 'admin') {
                existingAdmin.role = 'admin';
                await existingAdmin.save();
                console.log('   Role updated to admin ✅');
            }
        } else {
            // Create admin user
            const admin = await User.create({
                name: ADMIN_NAME,
                email: ADMIN_EMAIL,
                password: ADMIN_PASSWORD,
                role: 'admin'
            });

            console.log('✅ Admin user created successfully!');
            console.log(`   Email: ${ADMIN_EMAIL}`);
            console.log(`   Password: ${ADMIN_PASSWORD}`);
        }

        console.log('\n📌 Login at: http://localhost:3000/login');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔌 Disconnected from MongoDB');
    }
}

seedAdmin();
