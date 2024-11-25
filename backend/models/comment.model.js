// models/comment.model.js
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  // Người viết comment
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Khóa học
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  // Comment có thể thuộc video hoặc bài lý thuyết
  contentType: {
    type: String,
    enum: ['video', 'theory'],
    required: true
  },
  // ID của video hoặc bài lý thuyết
  contentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    // Sẽ ref đến VideoLesson hoặc TheoryLesson tùy theo contentType
  },
  // Nội dung comment
  content: {
    type: String,
    required: true,
    trim: true
  },
  // Comment này là reply cho comment nào (nếu có)
  parentComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null
  },
  // Các replies của comment này
  replies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  // Trạng thái comment
  isEdited: {
    type: Boolean,
    default: false
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Thêm indexes để tối ưu query
commentSchema.index({ course: 1, contentType: 1, contentId: 1 });
commentSchema.index({ parentComment: 1 });

module.exports = mongoose.model('Comment', commentSchema);