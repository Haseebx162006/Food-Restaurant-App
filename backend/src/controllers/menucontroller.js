const MenuItem = require('../schemas/MenuItem');

// CREATE MENU ITEM
exports.createMenuItem = async (req, res) => {
    try {
        const { name, description, price, category, image, availiabilty } = req.body;

        // validation
        if (!name || typeof name !== 'string') {
            return res.status(400).json(
                { msg: "Error in name!" }
            );
        }
        if (!description || typeof description !== 'string') {
            return res.status(400).json({
                 msg: "Error in description!" 
                });
        }
        if (price === undefined || typeof price !== 'number') {
            return res.status(400).json({ msg: "Error in price!" });
        }
        if (!category || typeof category !== 'string') {
            return res.status(400).json({ msg: "Error in category!" });
        }
        if (availiabilty === undefined || typeof availiabilty !== 'boolean') {
            return res.status(400).json({ msg: "Error in availability!" });
        }

        const menuItem = await MenuItem.create({
            name,
            description,
            price,
            category,
            image,
            availiabilty
        });

        return res.status(201).json({
            success: true,
            data: menuItem
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Server error while creating menu item",
            error: error.message
        });
    }
};

// UPDATE MENU ITEM
exports.updateMenuItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, category, image, availiabilty } = req.body;

        if (name && typeof name !== 'string') {
            return res.status(400).json({ msg: "Name must be a string" });
        }
        if (description && typeof description !== 'string') {
            return res.status(400).json({ msg: "Description must be a string" });
        }
        if (price !== undefined && typeof price !== 'number') {
            return res.status(400).json({ msg: "Price must be a number" });
        }
        if (category && typeof category !== 'string') {
            return res.status(400).json({ msg: "Category must be a string" });
        }
        if (availiabilty !== undefined && typeof availiabilty !== 'boolean') {
            return res.status(400).json({ msg: "Availability must be a boolean" });
        }
        if (image && typeof image !== 'string') {
            return res.status(400).json({ msg: "Image must be a string" });
        }

        const menuItem = await MenuItem.findByIdAndUpdate(
            id,
            { name, description, price, category, image, availiabilty },
            { new: true, runValidators: true }
        );

        if (!menuItem) {
            return res.status(404).json({ msg: "Menu item not found" });
        }

        return res.status(200).json({
            success: true,
            data: menuItem
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: "Invalid menu item ID",
            error: error.message
        });
    }
};

// SOFT DELETE MENU ITEM
exports.deleteItm = async (req, res) => {
    try {
        const { id } = req.params;

        const menuItem = await MenuItem.findByIdAndUpdate(
            id,
            { isDeleted: true },
            { new: true }
        );

        if (!menuItem) {
            return res.status(404).json({ msg: "Menu item not found" });
        }

        return res.status(200).json({
            success: true,
            msg: "Menu item deleted successfully"
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: "Invalid menu item ID",
            error: error.message
        });
    }
};

// GET ALL MENU ITEMS
exports.getAllItems = async (req, res) => {
    try {
        const menuItems = await MenuItem.find({ isDeleted: false });

        return res.status(200).json({
            success: true,
            count: menuItems.length,
            data: menuItems
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Failed to fetch menu items",
            error: error.message
        });
    }
};

// FILTER BY CATEGORY
exports.filterByCategory = async (req, res) => {
    try {
        const { category } = req.query;

        const items = await MenuItem.find({
            category,
            isDeleted: false
        });

        if (items.length === 0) {
            return res.status(404).json({
                success: false,
                msg: "No items found in this category"
            });
        }

        return res.status(200).json({
            success: true,
            data: items
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error filtering items",
            error: error.message
        });
    }
};

// GET SINGLE MENU ITEM
exports.getSingleMenuItem = async (req, res) => {
    try {
        const { id } = req.params;

        const menuItem = await MenuItem.findOne({
            _id: id,
            isDeleted: false
        });

        if (!menuItem) {
            return res.status(404).json({
                success: false,
                msg: "Menu item not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: menuItem
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: "Invalid menu item ID",
            error: error.message
        });
    }
};
