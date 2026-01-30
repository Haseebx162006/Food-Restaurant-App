const MenuItem = require('../schemas/MenuItem');
const socketManager = require('../utils/socketManager');

// CREATE MENU ITEM
exports.createMenuItem = async (req, res) => {
    try {
        console.log('[MenuController] createMenuItem called');
        console.log('[MenuController] req.body:', req.body);
        console.log('[MenuController] req.file:', req.file);

        const { name, description, price, category, availability } = req.body;

        // Handle image - could be uploaded file or URL
        let image = req.body.image || '';
        if (req.file) {
            // File was uploaded via multer
            image = `/uploads/menu/${req.file.filename}`;
            console.log('[MenuController] Image path set to:', image);
        }

        // Parse price if it's a string (from FormData)
        const parsedPrice = typeof price === 'string' ? parseFloat(price) : price;

        // Parse availability if it's a string (from FormData)
        const parsedAvailability = typeof availability === 'string'
            ? availability === 'true'
            : availability;

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
        if (parsedPrice === undefined || isNaN(parsedPrice)) {
            return res.status(400).json({ msg: "Error in price!" });
        }
        if (!category || typeof category !== 'string') {
            return res.status(400).json({ msg: "Error in category!" });
        }
        if (parsedAvailability === undefined || typeof parsedAvailability !== 'boolean') {
            return res.status(400).json({ msg: "Error in availability!" });
        }

        const menuItem = await MenuItem.create({
            name,
            description,
            price: parsedPrice,
            category,
            image,
            availability: parsedAvailability
        });

        return res.status(201).json({
            success: true,
            data: menuItem
        });

    } catch (error) {
        console.error('[MenuController] createMenuItem CRITICAL ERROR:', error);
        return res.status(500).json({
            success: false,
            msg: "Server error while creating menu item",
            error: error.message,
            stack: error.stack // Temporarily show stack for debugging
        });
    }
};

// UPDATE MENU ITEM
exports.updateMenuItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, category, availability } = req.body;

        // Handle image - could be uploaded file or URL or keep existing
        let image = req.body.image;
        if (req.file) {
            // File was uploaded via multer
            image = `/uploads/menu/${req.file.filename}`;
        }

        // Parse price if it's a string (from FormData)
        const parsedPrice = price !== undefined
            ? (typeof price === 'string' ? parseFloat(price) : price)
            : undefined;

        // Parse availability if it's a string (from FormData)
        const parsedAvailability = availability !== undefined
            ? (typeof availability === 'string' ? availability === 'true' : availability)
            : undefined;

        if (name && typeof name !== 'string') {
            return res.status(400).json({ msg: "Name must be a string" });
        }
        if (description && typeof description !== 'string') {
            return res.status(400).json({ msg: "Description must be a string" });
        }
        if (parsedPrice !== undefined && isNaN(parsedPrice)) {
            return res.status(400).json({ msg: "Price must be a number" });
        }
        if (category && typeof category !== 'string') {
            return res.status(400).json({ msg: "Category must be a string" });
        }

        // Build update object with only provided fields
        const updateData = {};
        if (name) updateData.name = name;
        if (description) updateData.description = description;
        if (parsedPrice !== undefined) updateData.price = parsedPrice;
        if (category) updateData.category = category;
        if (image) updateData.image = image;
        if (parsedAvailability !== undefined) updateData.availability = parsedAvailability;

        const menuItem = await MenuItem.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!menuItem) {
            return res.status(404).json({ msg: "Menu item not found" });
        }

        // Emit real-time update to customers if availability changed
        if (availability !== undefined) {
            socketManager.emitToAll('menu-updated', {
                itemId: menuItem._id,
                name: menuItem.name,
                availability: menuItem.availability,
                updatedAt: new Date()
            });
            console.log(`[MenuController] Emitted menu-updated for ${menuItem.name}`);
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
exports.deleteItem = async (req, res) => {
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
            data: await menuItems
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
