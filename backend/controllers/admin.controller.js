// controllers/admin.controller.js
const User = require('../models/user.model');
const Course = require('../models/course.model');
const Lesson = require('../models/lesson.model');
const Video = require('../models/video.model');

// Dashboard Overview
const getDashboardStats = async (req, res) => {
  try {
    const stats = {
      users: {
        totalInstructors: await User.countDocuments({ role: 'instructor' }),
        totalStudents: await User.countDocuments({ role: 'student', isPremium: false }),
        totalPremiumStudents: await User.countDocuments({ role: 'student', isPremium: true })
      },
      courses: {
        total: await Course.countDocuments(),
        premium: await Course.countDocuments({ isPremium: true }),
        free: await Course.countDocuments({ isPremium: false })
      },
      content: {
        totalVideos: await Video.countDocuments(),
        totalLessons: await Lesson.countDocuments()
      },
      revenue: {
        total: await calculateTotalRevenue(),
        thisMonth: await calculateMonthlyRevenue()
      }
    };

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({
      message: 'Lỗi khi lấy thống kê dashboard',
      error: error.message
    });
  }
};

// Course Statistics
const getCourseStatistics = async (req, res) => {
  try {
    const courses = await Course.aggregate([
      {
        $lookup: {
          from: 'videos',
          localField: '_id',
          foreignField: 'courseId',
          as: 'videos'
        }
      },
      {
        $lookup: {
          from: 'lessons',
          localField: '_id',
          foreignField: 'courseId',
          as: 'lessons'
        }
      },
      {
        $project: {
          title: 1,
          isPremium: 1,
          price: 1,
          videoCount: { $size: '$videos' },
          lessonCount: { $size: '$lessons' },
          totalContent: { $add: [{ $size: '$videos' }, { $size: '$lessons' }] }
        }
      }
    ]);

    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({
      message: 'Lỗi khi lấy thống kê khóa học',
      error: error.message
    });
  }
};

// Database Backup
const backupDatabase = async (req, res) => {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = `./backups/backup-${timestamp}`;

    // Sử dụng MongoDB tools để backup
    const { exec } = require('child_process');
    const command = `mongodump --uri="${process.env.MONGODB_URI}" --out="${backupPath}"`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        return res.status(500).json({
          message: 'Lỗi khi backup database',
          error: error.message
        });
      }

      res.status(200).json({
        message: 'Backup database thành công',
        path: backupPath
      });
    });
  } catch (error) {
    res.status(500).json({
      message: 'Lỗi khi backup database',
      error: error.message
    });
  }
};

module.exports = {
  getDashboardStats,
  getCourseStatistics,
  backupDatabase
};