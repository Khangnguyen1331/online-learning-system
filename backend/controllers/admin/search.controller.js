// controllers/admin/search.controller.js
const User = require('../../models/user.model');
const Course = require('../../models/course.model');

const searchUsers = async (req, res) => {
  try {
    const { 
      query = '', 
      role, 
      isPremium,
      page = 1,
      limit = 10
    } = req.query;

    const filter = {
      $and: [
        {
          $or: [
            { username: { $regex: query, $options: 'i' } },
            { email: { $regex: query, $options: 'i' } },
            { fullName: { $regex: query, $options: 'i' } }
          ]
        }
      ]
    };

    if (role) {
      filter.$and.push({ role });
    }

    if (isPremium !== undefined) {
      filter.$and.push({ isPremium: isPremium === 'true' });
    }

    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      users,
      pagination: {
        total,
        page: parseInt(page),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Lỗi khi tìm kiếm người dùng',
      error: error.message
    });
  }
};

const searchCourses = async (req, res) => {
  try {
    const {
      query = '',
      isPremium,
      priceMin,
      priceMax,
      page = 1,
      limit = 10
    } = req.query;

    const filter = {
      title: { $regex: query, $options: 'i' }
    };

    if (isPremium !== undefined) {
      filter.isPremium = isPremium === 'true';
    }

    if (priceMin !== undefined || priceMax !== undefined) {
      filter.price = {};
      if (priceMin) filter.price.$gte = parseInt(priceMin);
      if (priceMax) filter.price.$lte = parseInt(priceMax);
    }

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
        $project: {
          title: 1,
          price: 1,
          isPremium: 1,
          videoCount: { $size: '$videos' },
          lessonCount: { $size: '$lessons' }
        }
      },
      { $skip: (page - 1) * limit },
      { $limit: parseInt(limit) }
    ]);

    const total = await Course.countDocuments(filter);

    res.status(200).json({
      courses,
      pagination: {
        total,
        page: parseInt(page),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Lỗi khi tìm kiếm khóa học',
      error: error.message
    });
  }
};

module.exports = {
  searchUsers,
  searchCourses
};