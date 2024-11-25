// controllers/admin/course.controller.js
const Course = require('../../models/course.model');
const Video = require('../../models/video.model');
const Lesson = require('../../models/lesson.model');
const User = require('../../models/user.model');

// Lấy danh sách khóa học với thống kê
const getCourses = async (req, res) => {
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
      }
    ]);

    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({
      message: 'Lỗi khi lấy danh sách khóa học',
      error: error.message
    });
  }
};

// Cập nhật thông tin khóa học
const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { price, isPremium } = req.body;

    const course = await Course.findByIdAndUpdate(
      id,
      { price, isPremium },
      { new: true }
    );

    if (!course) {
      return res.status(404).json({
        message: 'Không tìm thấy khóa học'
      });
    }

    res.status(200).json({
      message: 'Cập nhật khóa học thành công',
      course
    });
  } catch (error) {
    res.status(500).json({
      message: 'Lỗi khi cập nhật khóa học',
      error: error.message
    });
  }
};

// Xóa khóa học và tất cả dữ liệu liên quan
const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    // Xóa tất cả videos của khóa học
    await Video.deleteMany({ courseId: id });

    // Xóa tất cả bài giảng của khóa học
    await Lesson.deleteMany({ courseId: id });

    // Xóa khóa học khỏi danh sách premium courses của users
    await User.updateMany(
      { premiumCourses: id },
      { $pull: { premiumCourses: id } }
    );

    // Xóa khóa học
    const course = await Course.findByIdAndDelete(id);

    if (!course) {
      return res.status(404).json({
        message: 'Không tìm thấy khóa học'
      });
    }

    res.status(200).json({
      message: 'Xóa khóa học và dữ liệu liên quan thành công'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Lỗi khi xóa khóa học',
      error: error.message
    });
  }
};

module.exports = {
  getCourses,
  updateCourse,
  deleteCourse
};