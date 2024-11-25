// controllers/admin/course.controller.js
const Course = require('../../models/course.model');

// Quản lý khóa học với phân trang
const getCourses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const { isPremium } = req.query;

    const filter = {};
    if (isPremium !== undefined) {
      filter.isPremium = isPremium === 'true';
    }

    const totalCourses = await Course.countDocuments(filter);
    const totalPages = Math.ceil(totalCourses / limit);

    const courses = await Course.aggregate([
      { $match: filter },
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
          description: 1,
          instructor: 1,
          price: 1,
          isPremium: 1,
          videoCount: { $size: '$videos' },
          lessonCount: { $size: '$lessons' },
          enrolledCount: { $size: '$enrolledStudents' },
          revenue: {
            $multiply: [
              { $size: '$enrolledStudents' },
              '$price'
            ]
          }
        }
      },
      { $skip: (page - 1) * limit },
      { $limit: limit }
    ]);

    res.status(200).json({
      courses,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalCourses,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Lỗi khi lấy danh sách khóa học',
      error: error.message
    });
  }
};

// Thống kê video và bài giảng với phân trang
const getContentStatistics = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;

    const totalCourses = await Course.countDocuments();
    const totalPages = Math.ceil(totalCourses / limit);

    const courseStats = await Course.aggregate([
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
          videoCount: { $size: '$videos' },
          lessonCount: { $size: '$lessons' },
          totalContent: { 
            $add: [
              { $size: '$videos' },
              { $size: '$lessons' }
            ]
          },
          lastUpdated: {
            $max: [
              { $max: '$videos.createdAt' },
              { $max: '$lessons.createdAt' }
            ]
          }
        }
      },
      { $skip: (page - 1) * limit },
      { $limit: limit },
      { $sort: { lastUpdated: -1 } }
    ]);

    res.status(200).json({
      courseStats,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalCourses,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Lỗi khi lấy thống kê nội dung',
      error: error.message
    });
  }
};

module.exports = {
  getCourses,
  getContentStatistics
};