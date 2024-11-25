// routes/comment.routes.js
const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controller');
const { verifyToken } = require('../middlewares/auth.jwt');

// Tạo comment mới
router.post('/', verifyToken, commentController.createComment);

// Lấy danh sách comments
router.get('/', verifyToken, commentController.getComments);

// Cập nhật comment
router.put('/:id', verifyToken, commentController.updateComment);

// Xóa comment
router.delete('/:id', verifyToken, commentController.deleteComment);

module.exports = router;