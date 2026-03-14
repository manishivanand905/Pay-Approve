const express = require('express');
const { login, signupRequester, getCurrentUser } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();
router.post('/login', login);
router.post('/signup', signupRequester);
router.get('/me', protect, getCurrentUser);
module.exports = router;
