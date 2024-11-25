const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: false,
  },
  phone: {
    type: String,
    required: false,
  },
  avatar: {
    type: String,  // URL của ảnh
    required: function() {
      return this.role === 'instructor';  // Bắt buộc với giảng viên
    }
  },
  role: {
    type: String,
    enum: ['admin', 'instructor', 'student'],
    default: 'student'
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  profileCompleted: {
    type: Boolean,
    default: false
  },
  rememberToken: String,
  lastLogin: Date,
  coursesEnrolled: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  premiumCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }]
}, {
  timestamps: true
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate email verification token
UserSchema.methods.generateEmailVerificationToken = function() {
  const token = crypto.randomBytes(32).toString('hex');
  this.emailVerificationToken = token;
  this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  return token;
};

// Generate password reset token
UserSchema.methods.generateResetPasswordToken = function() {
  const token = crypto.randomBytes(32).toString('hex');
  this.resetPasswordToken = token;
  this.resetPasswordExpires = Date.now() + 60 * 1000; // 1 minute
  return token;
};

// Generate remember me token
UserSchema.methods.generateRememberToken = function() {
  const token = crypto.randomBytes(32).toString('hex');
  this.rememberToken = token;
  return token;
};

module.exports = mongoose.model('User', UserSchema);