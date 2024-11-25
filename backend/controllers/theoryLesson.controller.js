// controllers/theoryLesson.controller.js
const TheoryLesson = require('../models/theoryLesson.model');
const Course = require('../models/course.model');

// Tạo bài giảng mới
const createTheoryLesson = async (req, res) => {
  try {
    const { courseId, chapter, title, content } = req.body;
    
    // Kiểm tra khóa học tồn tại và thuộc về giảng viên này
    const course = await Course.findOne({
      _id: courseId,
      instructor: req.user.id
    });

    if (!course) {
      return res.status(404).json({
        message: 'Không tìm thấy khóa học hoặc bạn không có quyền thêm bài giảng cho khóa học này'
      });
    }

    const lesson = new TheoryLesson({
      courseId,
      chapter,
      title,
      content,
      instructor: req.user.id
    });

    await lesson.save();

    res.status(201).json({
      message: 'Tạo bài giảng thành công',
      lesson
    });
  } catch (error) {
    res.status(500).json({
      message: 'Lỗi khi tạo bài giảng',
      error: error.message
    });
  }
};

// Lấy danh sách bài giảng theo khóa học
const getTheoryLessonsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const lessons = await TheoryLesson.find({ courseId })
      .sort({ chapter: 1 })
      .populate('instructor', 'fullName');

    res.status(200).json(lessons);
  } catch (error) {
    res.status(500).json({
      message: 'Lỗi khi lấy danh sách bài giảng',
      error: error.message
    });
  }
};

// Lấy chi tiết một bài giảng
const getTheoryLesson = async (req, res) => {
  try {
    const { id } = req.params;
    
    const lesson = await TheoryLesson.findById(id)
      .populate('instructor', 'fullName')
      .populate('courseId', 'title');

    if (!lesson) {
      return res.status(404).json({
        message: 'Không tìm thấy bài giảng'
      });
    }

    res.status(200).json(lesson);
  } catch (error) {
    res.status(500).json({
      message: 'Lỗi khi lấy thông tin bài giảng',
      error: error.message
    });
  }
};

// Cập nhật bài giảng
const updateTheoryLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const { chapter, title, content } = req.body;

    const lesson = await TheoryLesson.findOne({
      _id: id,
      instructor: req.user.id
    });

    if (!lesson) {
      return res.status(404).json({
        message: 'Không tìm thấy bài giảng hoặc bạn không có quyền chỉnh sửa'
      });
    }

    lesson.chapter = chapter;
    lesson.title = title;
    lesson.content = content;
    lesson.updatedAt = Date.now();

    await lesson.save();

    res.status(200).json({
      message: 'Cập nhật bài giảng thành công',
      lesson
    });
  } catch (error) {
    res.status(500).json({
      message: 'Lỗi khi cập nhật bài giảng',
      error: error.message
    });
  }
};

// Xóa bài giảng
const deleteTheoryLesson = async (req, res) => {
  try {
    const { id } = req.params;

    const lesson = await TheoryLesson.findOneAndDelete({
      _id: id,
      instructor: req.user.id
    });

    if (!lesson) {
      return res.status(404).json({
        message: 'Không tìm thấy bài giảng hoặc bạn không có quyền xóa'
      });
    }

    res.status(200).json({
      message: 'Xóa bài giảng thành công'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Lỗi khi xóa bài giảng',
      error: error.message
    });
  }
};

module.exports = {
  createTheoryLesson,
  getTheoryLessonsByCourse,
  getTheoryLesson,
  updateTheoryLesson,
  deleteTheoryLesson
};