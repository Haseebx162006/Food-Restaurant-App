const express = require('express')
const { createMenuItem, updateMenuItem, deleteItem, getAllItems, filterByCategory, getSingleMenuItem } = require('../controllers/menucontroller')
const { protect, adminOnly } = require('../middleware/auth_middleware')
const router = express.Router()

// creating the MenuItem
router.post('/createitem', protect, adminOnly, createMenuItem)
// Updating the MenuItem

router.put('/updateitem/:id',protect, adminOnly,updateMenuItem)

// delete the item

router.delete('/deleteitem/:id', protect, adminOnly, deleteItem)


// get all items

router.get('/getallitems',protect, getAllItems)


// filterByCategory

router.get('/getbycategory', protect, filterByCategory)

// get Single item


router.get('/getSingleitem/:id',protect, getSingleMenuItem)

module.exports = router