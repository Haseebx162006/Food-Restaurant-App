const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/auth_middleware');

// 1. Create Order (Customer)
router.post('/', protect, orderController.createOrder);

// 2. Get Dashboard Stats (Admin) - Must be before /:id route
router.get('/stats', protect, adminOnly, orderController.getDashboardStats);

// 3. Get Analytics Data (Admin) - For stats page
router.get('/analytics', protect, adminOnly, orderController.getAnalytics);

// 4. Get All Orders (Admin)
router.get('/', protect, adminOnly, orderController.getAllOrders);

// 3. Get My Orders (Customer)
router.get('/my-orders', protect, orderController.getMyOrders);

// 4. Get Single Order (Customer/Admin)
router.get('/:id', protect, orderController.getSingleOrder);

// 5. Update Order Status (Admin)
router.patch('/:id/status', protect, adminOnly, orderController.updateOrderStatus);

// 6. Cancel Order (Customer/Admin)
router.delete('/:id', protect, orderController.cancelOrder);

module.exports = router;
