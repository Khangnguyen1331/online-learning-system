// controllers/payment.controller.js
const Payment = require('../models/payment.model');
const Course = require('../models/course.model');
const User = require('../models/user.model');
const MomoService = require('../services/momo.service');
const { v4: uuidv4 } = require('uuid');

const createPayment = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;

    // Kiểm tra khóa học tồn tại và là premium
    const course = await Course.findOne({ _id: courseId, isPremium: true });
    if (!course) {
      return res.status(404).json({
        message: 'Không tìm thấy khóa học premium'
      });
    }

    // Kiểm tra user đã mua khóa học chưa
    const user = await User.findById(userId);
    if (user.premiumCourses.includes(courseId)) {
      return res.status(400).json({
        message: 'Bạn đã mua khóa học này'
      });
    }

    // Tạo payment record
    const orderId = `ORDER_${uuidv4()}`;
    const requestId = `REQ_${uuidv4()}`;

    const payment = new Payment({
      userId,
      courseId,
      orderId,
      amount: course.price,
      status: 'pending'
    });
    await payment.save();

    // Tạo payment URL từ MoMo
    const momoResponse = await MomoService.createPayment({
      courseId,
      amount: course.price,
      orderId,
      requestId,
      userId
    });

    res.status(200).json({
      paymentUrl: momoResponse.payUrl,
      orderId
    });

  } catch (error) {
    res.status(500).json({
      message: 'Lỗi khi tạo thanh toán',
      error: error.message
    });
  }
};

const handleMomoIPN = async (req, res) => {
  try {
    const { 
      orderId, 
      requestId,
      amount,
      orderInfo,
      orderType,
      transId,
      resultCode,
      message,
      payType,
      responseTime,
      extraData,
      signature 
    } = req.body;

    // Verify signature
    const rawSignature = `accessKey=${momoConfig.MOMO_ACCESS_KEY}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${momoConfig.MOMO_PARTNER_CODE}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;

    if (!MomoService.verifySignature(signature, rawSignature)) {
      return res.status(400).json({ message: 'Invalid signature' });
    }

    // Tìm và cập nhật payment
    const payment = await Payment.findOne({ orderId });
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (resultCode === '0') {
      // Thanh toán thành công
      payment.status = 'completed';
      payment.transactionId = transId;
      payment.paymentTime = new Date(responseTime);
      await payment.save();

      // Cập nhật user với khóa học premium
      await User.findByIdAndUpdate(
        payment.userId,
        { 
          $addToSet: { premiumCourses: payment.courseId },
          isPremium: true
        }
      );

      res.status(200).json({ message: 'Payment processed successfully' });
    } else {
      // Thanh toán thất bại
      payment.status = 'failed';
      await payment.save();
      res.status(400).json({ message: 'Payment failed' });
    }

  } catch (error) {
    res.status(500).json({
      message: 'Error processing payment notification',
      error: error.message
    });
  }
};

// Kiểm tra trạng thái thanh toán
const checkPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const payment = await Payment.findOne({ orderId })
      .populate('courseId', 'title price')
      .select('-__v');

    if (!payment) {
      return res.status(404).json({
        message: 'Không tìm thấy thông tin thanh toán'
      });
    }

    res.status(200).json(payment);

  } catch (error) {
    res.status(500).json({
      message: 'Lỗi khi kiểm tra trạng thái thanh toán',
      error: error.message
    });
  }
};

module.exports = {
  createPayment,
  handleMomoIPN,
  checkPaymentStatus
};