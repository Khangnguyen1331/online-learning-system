// config/auth.config.js
const jwt = require('jsonwebtoken');

const authConfig = {
  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    tokenExpiration: '24h', // Token hết hạn sau 24 giờ
    refreshTokenExpiration: '7d', // Refresh token hết hạn sau 7 ngày
  },

  // Password configuration
  password: {
    minLength: 6,
    maxLength: 30,
    saltRounds: 10, // Số vòng lặp để tạo salt cho bcrypt
  },

  // Role configuration
  roles: {
    ADMIN: 'admin',
    INSTRUCTOR: 'instructor',
    STUDENT: 'student',
    PREMIUM: 'premium',
  },

  // Login attempts configuration
  loginAttempts: {
    maxAttempts: 5, // Số lần đăng nhập thất bại tối đa
    lockTime: 15 * 60 * 1000, // Thời gian khóa tài khoản (15 phút)
  },

  // Session configuration
  session: {
    name: 'sessionId',
    secret: process.env.SESSION_SECRET || 'your-session-secret',
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 24 giờ
      sameSite: 'strict'
    }
  },

  // Verification email configuration
  verification: {
    emailTokenExpiration: 24 * 60 * 60 * 1000, // 24 giờ
    passwordResetTokenExpiration: 60 * 60 * 1000, // 1 giờ
  },

  // Helper functions for token management
  generateAccessToken: (userId, role) => {
    return jwt.sign(
      { userId, role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: authConfig.jwt.tokenExpiration }
    );
  },

  generateRefreshToken: (userId) => {
    return jwt.sign(
      { userId },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: authConfig.jwt.refreshTokenExpiration }
    );
  },

  verifyToken: (token) => {
    try {
      return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    } catch (error) {
      throw new Error('Invalid token');
    }
  },

  // Permission levels for different roles
  permissions: {
    admin: {
      level: 3,
      actions: ['read', 'write', 'delete', 'manage_users', 'manage_courses']
    },
    instructor: {
      level: 2,
      actions: ['read', 'write', 'manage_own_courses']
    },
    premium: {
      level: 1,
      actions: ['read', 'comment', 'access_premium']
    },
    student: {
      level: 0,
      actions: ['read', 'comment']
    }
  },

  // Check if user has required permission
  hasPermission: (userRole, requiredAction) => {
    const userPermissions = authConfig.permissions[userRole];
    if (!userPermissions) return false;
    return userPermissions.actions.includes(requiredAction);
  },

  // Error messages
  errors: {
    INVALID_CREDENTIALS: 'Email hoặc mật khẩu không chính xác',
    ACCOUNT_LOCKED: 'Tài khoản đã bị khóa do đăng nhập sai nhiều lần',
    TOKEN_EXPIRED: 'Token đã hết hạn',
    INVALID_TOKEN: 'Token không hợp lệ',
    UNAUTHORIZED: 'Không có quyền truy cập',
    EMAIL_EXISTS: 'Email đã được sử dụng',
    USERNAME_EXISTS: 'Tên đăng nhập đã tồn tại',
    WEAK_PASSWORD: 'Mật khẩu phải có ít nhất 6 ký tự',
    EMAIL_REQUIRED: 'Email là bắt buộc',
    PASSWORD_REQUIRED: 'Mật khẩu là bắt buộc',
    VERIFICATION_REQUIRED: 'Vui lòng xác thực email của bạn'
  }
};

module.exports = authConfig;