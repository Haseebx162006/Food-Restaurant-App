const express = require('express')
const { createMenuItem, updateMenuItem, deleteItem, getAllItems, filterByCategory, getSingleMenuItem } = require('../controllers/menucontroller')
const { protect, adminOnly } = require('../middleware/auth_middleware')
const upload = require('../middleware/upload')
const router = express.Router()

// creating the MenuItem (with image upload)
router.post('/createitem', protect, adminOnly, upload.single('image'), createMenuItem)

// Updating the MenuItem (with optional image upload)
router.put('/updateitem/:id', protect, adminOnly, upload.single('image'), updateMenuItem)

// delete the item

router.delete('/deleteitem/:id', protect, adminOnly, deleteItem)


// get all items
router.get('/getallitems', getAllItems)

// filterByCategory
router.get('/getbycategory', filterByCategory)

// get Single item
router.get('/getSingleitem/:id', getSingleMenuItem)

module.exports = router