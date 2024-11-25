// services/email.service.js
const jwt = require('jsonwebtoken');
const emailConfig = require('../config/email.config');
const User = require('../models/user.model');

class EmailService {
  static generateVerificationToken(userId, email) {
    return jwt.sign(
      { userId, email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
  }

  static generateResetPasswordToken(userId, email) {
    return jwt.sign(
      { userId, email },
      process.env.JWT_SECRET,
      { expiresIn: '1m' }
    );
  }

  static async sendVerificationEmail(userId, email) {
    try {
      const verificationToken = this.generateVerificationToken(userId, email);
      await emailConfig.sendVerificationEmail(email, verificationToken);
      
      // Update user with verification token
      await User.findByIdAndUpdate(userId, {
        verificationToken,
        verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
      });

      return { success: true, message: 'Email xác thực đã được gửi' };
    } catch (error) {
      console.error('Send verification email error:', error);
      throw new Error('Không thể gửi email xác thực');
    }
  }

  static async verifyEmail(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const user = await User.findOne({
        _id: decoded.userId,
        verificationToken: token,
        verificationTokenExpires: { $gt: Date.now() }
      });

      if (!user) {
        throw new Error('Token không hợp lệ hoặc đã hết hạn');
      }

      // Update user as verified
      await User.findByIdAndUpdate(user._id, {
        isVerified: true,
        verificationToken: undefined,
        verificationTokenExpires: undefined
      });

      return { success: true, message: 'Email đã được xác thực thành công' };
    } catch (error) {
      console.error('Verify email error:', error);
      throw new Error('Xác thực email thất bại');
    }
  }

  static async sendResetPasswordEmail(email) {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('Không tìm thấy người dùng với email này');
      }

      const resetToken = this.generateResetPasswordToken(user._id, email);
      await emailConfig.sendResetPasswordEmail(email, resetToken);

      // Update user with reset token
      await User.findByIdAndUpdate(user._id, {
        resetPasswordToken: resetToken,
        resetPasswordExpires: Date.now() + 60 * 1000 // 1 minute
      });

      return { success: true, message: 'Email đặt lại mật khẩu đã được gửi' };
    } catch (error) {
      console.error('Send reset password email error:', error);
      throw new Error('Không thể gửi email đặt lại mật khẩu');
    }
  }

  static async verifyResetPasswordToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const user = await User.findOne({
        _id: decoded.userId,
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
      });

      if (!user) {
        throw new Error('Token không hợp lệ hoặc đã hết hạn');
      }

      return { success: true, userId: user._id };
    } catch (error) {
      console.error('Verify reset password token error:', error);
      throw new Error('Token không hợp lệ hoặc đã hết hạn');
    }
  }

  static async resetPassword(token, newPassword) {
    try {
      const { userId } = await this.verifyResetPasswordToken(token);
      
      // Update password and clear reset token
      await User.findByIdAndUpdate(userId, {
        password: newPassword,
        resetPasswordToken: undefined,
        resetPasswordExpires: undefined
      });

      return { success: true, message: 'Mật khẩu đã được đặt lại thành công' };
    } catch (error) {
      console.error('Reset password error:', error);
      throw new Error('Đặt lại mật khẩu thất bại');
    }
  }

  static async resendVerificationEmail(userId, email) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('Không tìm thấy người dùng');
      }

      if (user.isVerified) {
        throw new Error('Email đã được xác thực');
      }

      return await this.sendVerificationEmail(userId, email);
    } catch (error) {
      console.error('Resend verification email error:', error);
      throw new Error('Không thể gửi lại email xác thực');
    }
  }
}

module.exports = EmailService;