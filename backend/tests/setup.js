const mongoose = require('mongoose');
require('dotenv').config();

beforeAll(async () => {
    // Force test database
    let testURI = process.env.MONGO_URI || 'mongodb://localhost:27017/food-app';
    testURI = testURI.replace(/\/[^/]+$/, '/food-app-test'); // Replace DB name with test DB

    // Disconnect if already connected (e.g. by app.js side effects if any)
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }

    await mongoose.connect(testURI);
});

afterAll(async () => {
    // Cleanup might be dangerous if we use the main DB, so we'll skip dropping for now 
    // and rely on manual request cleanup or specific test logic
    await mongoose.connection.close();
});
