// controllers/auth.controller.js
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const { sendVerificationEmail, sendResetPasswordEmail } = require('../services/email.service');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const sendEmail = require('../services/email.service');

// Cấu hình multer cho upload ảnh
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/avatars');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Chỉ chấp nhận file ảnh!'));
  }
}).single('avatar');

const login = async (req, res) => {
  try {
    const { username, password, remember } = req.body;

    // Kiểm tra đăng nhập mặc định cho admin và instructor
    if (username === 'admin' && password === 'admin') {
      const token = jwt.sign({ id: 'admin', role: 'admin' }, process.env.JWT_SECRET, {
        expiresIn: '24h'
      });
      return res.status(200).json({
        token,
        role: 'admin'
      });
    }

    if (username === 'instructor' && password === 'instructor') {
      const token = jwt.sign({ role: 'instructor' }, process.env.JWT_SECRET, {
        expiresIn: '24h'
      });
      return res.status(200).json({
        token,
        role: 'instructor',
        requireProfileCompletion: true
      });
    }

    // Đăng nhập cho user thông thường
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Thông tin đăng nhập không chính xác' });
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Thông tin đăng nhập không chính xác' });
    }

    if (user.role === 'student' && !user.isEmailVerified) {
      return res.status(403).json({ message: 'Vui lòng xác thực email trước khi đăng nhập' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: remember ? '30d' : '24h'
    });

    if (remember) {
      const rememberToken = user.generateRememberToken();
      await user.save();
      res.cookie('rememberToken', rememberToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        httpOnly: true
      });
    }

    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        isPremium: user.isPremium
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// Các phương thức khác sẽ được thêm vào đây...

module.exports = {
  login,
  // ... các phương thức khác
};
// Đăng ký tài khoản
const register = async (req, res) => {
    try {
      const { username, email, password, fullName, phone } = req.body;
  
      // Kiểm tra username và email đã tồn tại chưa
      const existingUser = await User.findOne({
        $or: [{ username }, { email }]
      });
  
      if (existingUser) {
        return res.status(400).json({
          message: existingUser.username === username ? 
            'Tên đăng nhập đã tồn tại' : 
            'Email đã được sử dụng'
        });
      }
  
      // Tạo verification token
      const verificationToken = crypto.randomBytes(32).toString('hex');
      const verificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 giờ
  
      // Tạo user mới
      const newUser = new User({
        username,
        email,
        password,
        fullName,
        phone,
        role: 'student',
        emailVerificationToken: verificationToken,
        emailVerificationExpires: verificationExpires
      });
  
      await newUser.save();
  
      // Gửi email xác thực
      const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
      await sendEmail.sendVerificationEmail(email, verificationUrl);
  
      res.status(201).json({
        message: 'Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.'
      });
  
    } catch (error) {
      res.status(500).json({
        message: 'Đã có lỗi xảy ra khi đăng ký',
        error: error.message
      });
    }
  };
  
  // Xác thực email
  const verifyEmail = async (req, res) => {
    try {
      const { token } = req.params;
  
      const user = await User.findOne({
        emailVerificationToken: token,
        emailVerificationExpires: { $gt: Date.now() }
      });
  
      if (!user) {
        return res.status(400).json({
          message: 'Token không hợp lệ hoặc đã hết hạn'
        });
      }
  
      // Cập nhật trạng thái xác thực
      user.isEmailVerified = true;
      user.emailVerificationToken = undefined;
      user.emailVerificationExpires = undefined;
      await user.save();
  
      // Tạo JWT token
      const authToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
  
      res.status(200).json({
        message: 'Xác thực email thành công!',
        token: authToken,
        redirectUrl: '/home'
      });
  
    } catch (error) {
      res.status(500).json({
        message: 'Đã có lỗi xảy ra khi xác thực email',
        error: error.message
      });
    }
  };
  
  // Cập nhật thông tin giảng viên
  const updateInstructorProfile = async (req, res) => {
    try {
      const { username, password, email, fullName, phone } = req.body;
      const avatarFile = req.file;
  
      if (!avatarFile) {
        return res.status(400).json({
          message: 'Vui lòng upload ảnh đại diện'
        });
      }
  
      const avatarUrl = `${req.protocol}://${req.get('host')}/uploads/avatars/${avatarFile.filename}`;
  
      const instructor = new User({
        username,
        password,
        email,
        fullName,
        phone,
        role: 'instructor',
        avatar: avatarUrl,
        profileCompleted: true
      });
  
      await instructor.save();
  
      res.status(200).json({
        message: 'Cập nhật thông tin thành công',
        instructor: {
          username,
          email,
          fullName,
          phone,
          avatar: avatarUrl
        }
      });
  
    } catch (error) {
      res.status(500).json({
        message: 'Đã có lỗi xảy ra khi cập nhật thông tin',
        error: error.message
      });
    }
  };
  
  module.exports = {
    register,
    verifyEmail,
    updateInstructorProfile,
    // ... các phương thức khác
  };
  // Thêm vào file controllers/auth.controller.js

const forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
  
      if (!user) {
        // Vẫn trả về success để tránh leak thông tin user
        return res.status(200).json({
          message: 'Nếu email tồn tại trong hệ thống, bạn sẽ nhận được link đặt lại mật khẩu.'
        });
      }
  
      // Tạo reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = Date.now() + 60 * 1000; // 1 phút
      await user.save();
  
      // Gửi email
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
      
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Đặt lại mật khẩu',
        html: `
          <h3>Yêu cầu đặt lại mật khẩu</h3>
          <p>Click vào link sau để đặt lại mật khẩu:</p>
          <a href="${resetUrl}">Đặt lại mật khẩu</a>
          <p>Link này sẽ hết hạn sau 1 phút.</p>
          <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
        `
      };
  
      await transporter.sendMail(mailOptions);
  
      res.status(200).json({
        message: 'Nếu email tồn tại trong hệ thống, bạn sẽ nhận được link đặt lại mật khẩu.'
      });
  
    } catch (error) {
      res.status(500).json({
        message: 'Đã có lỗi xảy ra',
        error: error.message
      });
    }
  };
  
  const resetPassword = async (req, res) => {
    try {
      const { token } = req.params;
      const { newPassword } = req.body;
  
      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
      });
  
      if (!user) {
        return res.status(400).json({
          message: 'Token không hợp lệ hoặc đã hết hạn'
        });
      }
  
      // Cập nhật mật khẩu mới
      user.password = newPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
  
      res.status(200).json({
        message: 'Đặt lại mật khẩu thành công'
      });
  
    } catch (error) {
      res.status(500).json({
        message: 'Đã có lỗi xảy ra khi đặt lại mật khẩu',
        error: error.message
      });
    }
  };
  
  const logout = async (req, res) => {
    try {
      // Xóa remember token nếu có
      res.clearCookie('rememberToken');
      
      res.status(200).json({
        message: 'Đăng xuất thành công'
      });
    } catch (error) {
      res.status(500).json({
        message: 'Đã có lỗi xảy ra khi đăng xuất',
        error: error.message
      });
    }
  };
  
  const getCurrentUser = async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password');
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({
        message: 'Đã có lỗi xảy ra',
        error: error.message
      });
    }
  };