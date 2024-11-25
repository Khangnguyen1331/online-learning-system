// routes/auth.routes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const upload = require('../middlewares/fileUpload');
const { verifyToken } = require('../middlewares/auth.jwt');

// Public routes
router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/verify-email/:token', authController.verifyEmail);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);

// Protected routes
router.post(
  '/instructor/update-profile',
  verifyToken,
  upload.single('avatar'),
  authController.updateInstructorProfile
);

router.get('/me', verifyToken, authController.getCurrentUser);
router.post('/logout', verifyToken, authController.logout);

module.exports = router;