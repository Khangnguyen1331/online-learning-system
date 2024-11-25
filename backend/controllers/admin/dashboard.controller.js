// controllers/admin/dashboard.controller.js
const User = require('../../models/user.model');
const Course = require('../../models/course.model');
const Payment = require('../../models/payment.model');

const getDashboardStats = async (req, res) => {
  try {
    const dateLimit = new Date();
    dateLimit.setFullYear(dateLimit.getFullYear() - 1);


     // Lấy dữ liệu doanh thu
     const revenueDataLastYear = await Payment.aggregate([
        {
          $match: {
            createdAt: { $gte: dateLimit }
          }
        },
        // ... aggregation stages khác
      ]);

      // Top 3 khóa học doanh thu cao nhất
    const topCourses = await Course.aggregate([
        {
          $lookup: {
            from: 'payments',
            localField: '_id',
            foreignField: 'courseId',
            as: 'payments'
          }
        },
        {
          $project: {
            title: 1,
            totalRevenue: { $sum: '$payments.amount' },
            studentCount: { $size: '$payments' }
          }
        },
        { $sort: { totalRevenue: -1 } },
        { $limit: 3 }  // Giới hạn 3 khóa học
      ]);
  
      res.status(200).json({
        basicStats,
        charts: {
          revenue: revenueDataLastYear,
          topCourses
        }
      });

    // Thống kê cơ bản
    const basicStats = {
      users: {
        totalInstructors: await User.countDocuments({ role: 'instructor' }),
        totalStudents: await User.countDocuments({ role: 'student', isPremium: false }),
        totalPremiumStudents: await User.countDocuments({ role: 'student', isPremium: true })
      },
      courses: {
        total: await Course.countDocuments(),
        premium: await Course.countDocuments({ isPremium: true }),
        free: await Course.countDocuments({ isPremium: false })
      }
    };

    // Dữ liệu biểu đồ doanh thu theo tháng (12 tháng gần nhất)
    const revenueDataMonthly = await Payment.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().setMonth(new Date().getMonth() - 11))
          }
        }
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" }
          },
          totalRevenue: { $sum: "$amount" }
        }
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1
        }
      }
    ]);

    // Dữ liệu biểu đồ đăng ký học viên theo tháng
    const studentRegistrations = await User.aggregate([
      {
        $match: {
          role: 'student',
          createdAt: {
            $gte: new Date(new Date().setMonth(new Date().getMonth() - 11))
          }
        }
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1
        }
      }
    ]);

    // Dữ liệu biểu đồ phân bố khóa học
    const courseDistribution = await Course.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: 'premiumCourses',
          as: 'enrolledStudents'
        }
      },
      {
        $project: {
          title: 1,
          isPremium: 1,
          studentCount: { $size: '$enrolledStudents' }
        }
      }
    ]);

    res.status(200).json({
      basicStats,
      charts: {
        monthlyRevenue: revenueDataMonthly.map(item => ({
          month: `${item._id.month}/${item._id.year}`,
          revenue: item.totalRevenue
        })),
        studentGrowth: studentRegistrations.map(item => ({
          month: `${item._id.month}/${item._id.year}`,
          students: item.count
        })),
        courseDistribution: courseDistribution.map(course => ({
          name: course.title,
          students: course.studentCount,
          type: course.isPremium ? 'Premium' : 'Free'
        }))
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Lỗi khi lấy thống kê dashboard',
      error: error.message
    });
  }
};

module.exports = { getDashboardStats };