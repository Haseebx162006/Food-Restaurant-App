/**
 * Reset password for a user
 * Usage: node scripts/resetPassword.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../src/schemas/User');

const TARGET_EMAIL = 'muzaffar10112@gmail.com';
const NEW_PASSWORD = 'jarvisxhaseeb';

async function resetPassword() {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log('✅ Connected to MongoDB\n');

        const user = await User.findOne({ email: TARGET_EMAIL });

        if (!user) {
            console.log('❌ User not found:', TARGET_EMAIL);
            return;
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(NEW_PASSWORD, salt);

        // Update directly to avoid the pre-save hook double-hashing
        await User.updateOne(
            { email: TARGET_EMAIL },
            { $set: { password: hashedPassword, role: 'admin' } }
        );

        console.log('✅ Password reset successfully!');
        console.log(`   Email: ${TARGET_EMAIL}`);
        console.log(`   Password: ${NEW_PASSWORD}`);
        console.log(`   Role: admin`);
        console.log('\n📌 Now login at: http://localhost:3000/login');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔌 Disconnected');
    }
}

resetPassword();
