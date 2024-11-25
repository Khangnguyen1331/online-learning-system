// config/email.config.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const sendVerificationEmail = async (to, token) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: 'Xác thực tài khoản của bạn',
    html: `
      <h2>Xin chào!</h2>
      <p>Cảm ơn bạn đã đăng ký tài khoản. Vui lòng click vào link bên dưới để xác thực email của bạn:</p>
      <a href="${verificationUrl}">Xác thực email</a>
      <p>Link này sẽ hết hạn sau 24 giờ.</p>
      <p>Nếu bạn không đăng ký tài khoản, vui lòng bỏ qua email này.</p>
    `
  };

  return await transporter.sendMail(mailOptions);
};

const sendResetPasswordEmail = async (to, token) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: 'Đặt lại mật khẩu',
    html: `
      <h2>Xin chào!</h2>
      <p>Bạn đã yêu cầu đặt lại mật khẩu. Click vào link bên dưới để đặt lại mật khẩu:</p>
      <a href="${resetUrl}">Đặt lại mật khẩu</a>
      <p>Link này sẽ hết hạn sau 1 phút.</p>
      <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
    `
  };

  return await transporter.sendMail(mailOptions);
};

module.exports = {
  sendVerificationEmail,
  sendResetPasswordEmail
};