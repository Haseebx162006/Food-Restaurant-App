const express = require('express')
const {signUp,login,logout}= require('../controllers/authcontroller')
const router= express.Router()

// for signup
router.post('/signup',signUp)

// fr login

router.post('/login',login)


// for admin route
router.get('/admin',protect,adminOnly, (req,res)=>{
    res.json({
        success:true,
        message:"Welcome Admin"
    })
})


// for viewing the profile
router.get('/profile',protect,(req,res)=>{
    res.json(req.user)
})

router.get('/logout',logout)

module.exports=router