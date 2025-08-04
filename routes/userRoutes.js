
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');
const jwt = require('jsonwebtoken');
// GET /api/users
router.get('/', userController.getAllUsers);

router.post('/signup', userController.signup);
router.post('/signin', userController.signin);
router.post('/verify', userController.verifyEmail);
router.delete('/user/:id', authMiddleware, roleMiddleware('admin'),userController.deleteUser);
router.get('/verify-token', authMiddleware, (req, res) => {
  res.status(200).json({ valid: true });
});
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password', userController.resetPassword);
router.post('/verify-code-reset', userController.verifyCodeReset);
router.post('/resend-code',userController.resendCode);
router.post('/verifyEmail', userController.verifyEmail)




module.exports = router;
