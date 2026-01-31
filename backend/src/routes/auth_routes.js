const express = require('express')
const { signUp, login, logout, updateProfile } = require('../controllers/authcontroller')
const router = express.Router()
const { protect, adminOnly } = require('../middleware/auth_middleware')

// for signup
router.post('/signup', signUp)

// fr login

router.post('/login', login)


// for admin route - check authentication first, then admin role
router.get('/admin', protect, adminOnly, (req, res) => {
    res.json({
        success: true,
        message: "Welcome Admin"
    })
})


// for viewing the profile
router.get('/profile', protect, (req, res) => {
    const user = req.user;
    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        createdAt: user.createdAt
    })
})

// for updating the profile
router.put('/profile', protect, updateProfile)

router.get('/logout', logout)

module.exports = router