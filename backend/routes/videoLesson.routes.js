// routes/videoLesson.routes.js
const express = require('express');
const router = express.Router();
const videoLessonController = require('../controllers/videoLesson.controller');
const { verifyToken, isInstructor } = require('../middlewares/auth.jwt');
const { videoUpload } = require('../services/videoUpload.service');

// Routes cho giảng viên
router.post(
  '/video-lessons',
  [verifyToken, isInstructor],
  videoUpload.single('video'),
  videoLessonController.uploadVideoLesson
);

router.put(
  '/video-lessons/:id',
  [verifyToken, isInstructor],
  videoLessonController.updateVideoLesson
);

router.delete(
  '/video-lessons/:id',
  [verifyToken, isInstructor],
  videoLessonController.deleteVideoLesson
);

// Routes cho tất cả người dùng
router.get(
  '/courses/:courseId/video-lessons',
  verifyToken,
  videoLessonController.getVideoLessonsByCourse
);

router.get(
  '/video-lessons/:id',
  verifyToken,
  videoLessonController.getVideoLesson
);

module.exports = router;