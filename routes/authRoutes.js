const express = require('express')

const {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  updateNameAndEmail,
  updatePassword,
} = require('../controllers/authControllers')

const router = express.Router()
const { protect } = require('../middleware/auth')

router.post('/register', register)
router.post('/login', login)
router.get('/logout', logout)
router.get('/me', protect, getMe)
router.put('/updateuser', protect, updateNameAndEmail)
router.put('/updatepassword', protect, updatePassword)
router.post('/forgotpassword', forgotPassword)
router.put('/resetpassword/:resettoken', resetPassword)

module.exports = router
