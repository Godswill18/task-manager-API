const express = require('express');
const router = express.Router();
const { registerUser, login, logout } = require('../controllers/authController.js');

router.post('/register', registerUser);
router.post('/login', login);
router.post('/logout', logout);

module.exports = router;