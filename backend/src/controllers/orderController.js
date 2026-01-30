const Order = require('../schemas/Order');
const orderService = require('../services/orderService');

/**
 * 1. Create Order (Customer)
 */
exports.createOrder = async (req, res) => {
    try {
        const { items, customerName, customerPhone, deliveryAddress, notes } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, msg: "Cart items are required." });
        }

        // Validate items and fetch details from DB
        const validatedItems = await orderService.validateAndFetchItems(items);

        // Calculate Totals
        const { subtotal, taxAmount, deliveryAmount, grandTotal } = orderService.calculateOrderTotals(validatedItems);

        // Generate Order ID
        const orderId = await orderService.generateOrderId();

        // Create Order
        const order = await Order.create({
            orderId,
            customerId: req.user._id, // Set by protect middleware
            items: validatedItems,
            totalAmount: subtotal,
            taxAmount,
            deliveryAmount,
            grandTotal,
            customerName,
            customerPhone,
            deliveryAddress,
            notes
        });

        // WebSocket Notify Admin
        orderService.notifyAdminNewOrder(order);

        res.status(201).json({
            success: true,
            message: "Order placed successfully.",
            orderId: order.orderId,
            order
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            msg: error.message || "Error creating order."
        });
    }
};

/**
 * 2. Get All Orders (Admin)
 */
exports.getAllOrders = async (req, res) => {
    try {
        const { status, customerId } = req.query;
        let filter = {};

        if (status) filter.orderStatus = status;
        if (customerId) filter.customerId = customerId;

        const orders = await Order.find(filter)
            .sort({ createdAt: -1 })
            .populate('customerId', 'name email');

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        console.error('[OrderController] getAllOrders error:', error);
        res.status(500).json({ success: false, msg: "Failed to fetch orders.", error: error.message });
    }
};

/**
 * 3. Get My Orders (Customer)
 */
exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ customerId: req.user._id })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        res.status(500).json({ success: false, msg: "Failed to fetch your orders." });
    }
};

/**
 * 4. Get Single Order
 */
exports.getSingleOrder = async (req, res) => {
    try {
        const order = await Order.findOne({
            $or: [{ _id: req.params.id }, { orderId: req.params.id }]
        }).populate('customerId', 'name email');

        if (!order) {
            return res.status(404).json({ success: false, msg: "Order not found." });
        }

        // Security: Ensure owner or admin is requesting
        if (req.user.role !== 'admin' && order.customerId._id.toString() !== req.user._id.toString()) {
            return res.status(401).json({ success: false, msg: "Unauthorized to view this order." });
        }

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        res.status(400).json({ success: false, msg: "Invalid Order ID." });
    }
};

/**
 * 5. Update Order Status (Admin)
 */
exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderStatus } = req.body;
        const validStatuses = ["Pending", "Preparing", "Ready", "Delivered", "Cancelled"];

        if (!validStatuses.includes(orderStatus)) {
            return res.status(400).json({ success: false, msg: "Invalid order status." });
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { orderStatus },
            { new: true, runValidators: true }
        );

        if (!order) {
            return res.status(404).json({ success: false, msg: "Order not found." });
        }

        // WebSocket Notify Customer
        orderService.notifyCustomerOrderStatus(order);

        res.status(200).json({
            success: true,
            message: `Order status updated to ${orderStatus}.`,
            data: order
        });
    } catch (error) {
        res.status(400).json({ success: false, msg: "Error updating status." });
    }
};

/**
 * 6. Cancel Order (Customer/Admin)
 */
exports.cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ success: false, msg: "Order not found." });
        }

        // Logic check: Only Pending or Preparing can be cancelled
        if (!["Pending", "Preparing"].includes(order.orderStatus)) {
            return res.status(400).json({
                success: false,
                msg: `Order cannot be cancelled as it is already ${order.orderStatus}.`
            });
        }

        order.orderStatus = "Cancelled";
        await order.save();

        // WebSocket Notify
        orderService.notifyAdminNewOrder(order); // Notify admin of cancellation

        res.status(200).json({
            success: true,
            message: "Order cancelled successfully."
        });
    } catch (error) {
        res.status(400).json({ success: false, msg: "Error cancelling order." });
    }
};

/**
 * 7. Get Dashboard Stats (Admin)
 */
exports.getDashboardStats = async (req, res) => {
    try {
        // Get total orders count
        const totalOrders = await Order.countDocuments();

        // Get pending orders count
        const pendingOrders = await Order.countDocuments({ orderStatus: 'Pending' });

        // Calculate total revenue from delivered orders
        const revenueResult = await Order.aggregate([
            { $match: { orderStatus: { $in: ['Delivered', 'Ready', 'Preparing'] } } },
            { $group: { _id: null, total: { $sum: '$grandTotal' } } }
        ]);
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

        // Get unique customers count
        const activeUsers = await Order.distinct('customerId').then(ids => ids.length);

        res.status(200).json({
            success: true,
            stats: {
                totalOrders,
                pendingOrders,
                totalRevenue,
                activeUsers
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, msg: "Failed to fetch dashboard stats." });
    }
};

/**
 * 8. Get Analytics Data (Admin)
 */
exports.getAnalytics = async (req, res) => {
    try {
        console.log('[OrderController] getAnalytics called by user:', req.user?.email);

        // Get date range for last 7 days
        const today = new Date();
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        // 1. Revenue by day (last 7 days)
        const revenueByDay = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: sevenDaysAgo },
                    orderStatus: { $in: ['Delivered', 'Ready', 'Preparing', 'Pending'] }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    revenue: { $sum: "$grandTotal" },
                    orders: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // 2. Category distribution from order items
        const categoryDistribution = await Order.aggregate([
            { $unwind: "$items" },
            {
                $lookup: {
                    from: "menuitems",
                    localField: "items.itemId",
                    foreignField: "_id",
                    as: "menuItem"
                }
            },
            { $unwind: { path: "$menuItem", preserveNullAndEmptyArrays: true } },
            {
                $group: {
                    _id: { $ifNull: ["$menuItem.category", "Unknown"] },
                    count: { $sum: "$items.quantity" },
                    revenue: { $sum: "$items.subtotal" }
                }
            },
            { $sort: { count: -1 } }
        ]);

        // Calculate percentages for category distribution
        const totalItems = categoryDistribution.reduce((sum, cat) => sum + cat.count, 0);
        const categoryWithPercent = categoryDistribution.map(cat => ({
            category: cat._id,
            count: cat.count,
            revenue: cat.revenue,
            percent: totalItems > 0 ? Math.round((cat.count / totalItems) * 100) : 0
        }));

        // 3. Top selling items
        const topSellingItems = await Order.aggregate([
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.itemName",
                    sales: { $sum: "$items.quantity" },
                    revenue: { $sum: "$items.subtotal" }
                }
            },
            { $sort: { sales: -1 } },
            { $limit: 5 }
        ]);

        // 4. Total sales today
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const salesToday = await Order.countDocuments({
            createdAt: { $gte: startOfToday }
        });

        res.status(200).json({
            success: true,
            analytics: {
                revenueByDay,
                categoryDistribution: categoryWithPercent,
                topSellingItems,
                salesToday
            }
        });
    } catch (error) {
        console.error('[OrderController] getAnalytics error:', error);
        res.status(500).json({ success: false, msg: "Failed to fetch analytics data." });
    }
};
