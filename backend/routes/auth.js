const express = require('express');
const {
  googleAuth,
  getMe,
  logout
} = require('../controllers/authController');

const router = express.Router();

const { protect } = require('../middlewares/auth');

router.post('/google', googleAuth);
router.get('/me', protect, getMe);
router.get('/logout', protect, logout);

module.exports = router;
