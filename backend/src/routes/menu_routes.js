const express= require('express')
const {createMenuItem,updateMenuItem,deleteItm,getAllItems,filterByCategory,getSingleMenuItem}= require ('../controllers/menucontroller')

const router = express.Router()

// creating the MenuItem
router.post('/createitem',createMenuItem)

// Updating the MenuItem

router.post('/updateitem',updateMenuItem)

// delete the item

router.post('/deleteitem',deleteItm)


// get all items

router.get('/getallitems',getAllItems)


// filterByCategory

router.get('/getbycategory',filterByCategory)

// get Single item


router.get('/getSingleitem',getSingleMenuItem)