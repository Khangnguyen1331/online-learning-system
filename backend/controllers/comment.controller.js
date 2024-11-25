// controllers/comment.controller.js
const Comment = require('../models/comment.model');
const Course = require('../models/course.model');
const User = require('../models/user.model');

// Tạo comment mới
const createComment = async (req, res) => {
  try {
    const { courseId, contentType, contentId, content, parentCommentId } = req.body;
    const userId = req.user.id;

    // Kiểm tra quyền comment (chỉ premium users mới được comment)
    const user = await User.findById(userId);
    const course = await Course.findById(courseId);

    if (!user.isPremium || !user.premiumCourses.includes(courseId)) {
      return res.status(403).json({
        message: 'Chỉ học viên premium mới có thể bình luận'
      });
    }

    // Tạo comment
    const comment = new Comment({
      user: userId,
      course: courseId,
      contentType,
      contentId,
      content,
      parentComment: parentCommentId || null
    });

    await comment.save();

    // Nếu là reply, thêm vào mảng replies của parent comment
    if (parentCommentId) {
      await Comment.findByIdAndUpdate(parentCommentId, {
        $push: { replies: comment._id }
      });
    }

    // Populate user info trước khi trả về
    await comment.populate('user', 'fullName avatar');

    res.status(201).json({
      message: 'Tạo bình luận thành công',
      comment
    });

  } catch (error) {
    res.status(500).json({
      message: 'Lỗi khi tạo bình luận',
      error: error.message
    });
  }
};

// Lấy danh sách comments cho một video/bài học
const getComments = async (req, res) => {
  try {
    const { courseId, contentType, contentId } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;

    // Lấy comments gốc (không phải replies)
    const comments = await Comment.find({
      course: courseId,
      contentType,
      contentId,
      parentComment: null,
      isDeleted: false
    })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('user', 'fullName avatar')
      .populate({
        path: 'replies',
        match: { isDeleted: false },
        populate: {
          path: 'user',
          select: 'fullName avatar'
        }
      });

    // Đếm tổng số comments
    const total = await Comment.countDocuments({
      course: courseId,
      contentType,
      contentId,
      parentComment: null,
      isDeleted: false
    });

    res.status(200).json({
      comments,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalComments: total
      }
    });

  } catch (error) {
    res.status(500).json({
      message: 'Lỗi khi lấy danh sách bình luận',
      error: error.message
    });
  }
};

// Cập nhật comment
const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({
        message: 'Không tìm thấy bình luận'
      });
    }

    // Kiểm tra quyền sửa comment
    if (comment.user.toString() !== userId) {
      return res.status(403).json({
        message: 'Bạn không có quyền sửa bình luận này'
      });
    }

    comment.content = content;
    comment.isEdited = true;
    await comment.save();

    res.status(200).json({
      message: 'Cập nhật bình luận thành công',
      comment
    });

  } catch (error) {
    res.status(500).json({
      message: 'Lỗi khi cập nhật bình luận',
      error: error.message
    });
  }
};

// Xóa comment (soft delete)
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const user = await User.findById(userId);

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({
        message: 'Không tìm thấy bình luận'
      });
    }

    // Kiểm tra quyền xóa (user là người viết hoặc là giảng viên của khóa học)
    if (comment.user.toString() !== userId && !user.role === 'instructor') {
      return res.status(403).json({
        message: 'Bạn không có quyền xóa bình luận này'
      });
    }

    comment.isDeleted = true;
    await comment.save();

    res.status(200).json({
      message: 'Xóa bình luận thành công'
    });

  } catch (error) {
    res.status(500).json({
      message: 'Lỗi khi xóa bình luận',
      error: error.message
    });
  }
};

module.exports = {
  createComment,
  getComments,
  updateComment,
  deleteComment
};