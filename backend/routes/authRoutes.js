const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../middleware/validationMiddleware');

router.post('/login', validateLogin, authController.login);
router.post('/register', validateRegister, authController.register);

module.exports = router;
