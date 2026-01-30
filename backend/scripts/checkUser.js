/**
 * Check if user exists in the database
 * Usage: node scripts/checkUser.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/schemas/User');

async function checkUser() {
    try {
        console.log('Connecting to:', process.env.DATABASE_URL);
        await mongoose.connect(process.env.DATABASE_URL);
        console.log('✅ Connected to MongoDB\n');

        // Find all users
        const allUsers = await User.find({}).select('email role name');

        console.log('📋 All users in database:');
        console.log('========================');

        if (allUsers.length === 0) {
            console.log('❌ No users found in database!');
        } else {
            allUsers.forEach((user, i) => {
                console.log(`${i + 1}. ${user.email} (${user.role}) - ${user.name}`);
            });
        }

        console.log('\n========================');
        console.log(`Total: ${allUsers.length} users`);

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔌 Disconnected');
    }
}

checkUser();
