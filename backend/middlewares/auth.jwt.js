// middlewares/auth.jwt.js
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || 
                  req.cookies?.rememberToken;
    
    if (!token) {
      return res.status(403).json({ message: "No token provided!" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(403).json({ message: "User not found!" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized!" });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: "Require Admin Role!" });
  }
  next();
};

const isInstructor = (req, res, next) => {
  if (req.user.role !== 'instructor') {
    return res.status(403).json({ message: "Require Instructor Role!" });
  }
  next();
};

const isInstructorProfileComplete = (req, res, next) => {
  if (req.user.role === 'instructor' && !req.user.profileCompleted) {
    return res.status(403).json({ 
      message: "Please complete your profile first!",
      requireProfileCompletion: true 
    });
  }
  next();
};

const isStudent = (req, res, next) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ message: "Require Student Role!" });
  }
  next();
};

const isPremiumStudent = (req, res, next) => {
  if (!req.user.isPremium) {
    return res.status(403).json({ message: "Require Premium Access!" });
  }
  next();
};

module.exports = {
  verifyToken,
  isAdmin,
  isInstructor,
  isInstructorProfileComplete,
  isStudent,
  isPremiumStudent
};