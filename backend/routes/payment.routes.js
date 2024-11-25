// routes/payment.routes.js
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const { verifyToken } = require('../middlewares/auth.jwt');

// Tạo thanh toán mới
router.post('/create', verifyToken, paymentController.createPayment);

// IPN URL cho MoMo
router.post('/momo/ipn', paymentController.handleMomoIPN);

// Kiểm tra trạng thái thanh toán
router.get('/status/:orderId', verifyToken, paymentController.checkPaymentStatus);

module.exports = router;