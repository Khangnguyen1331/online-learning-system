// routes/theoryLesson.routes.js
const express = require('express');
const router = express.Router();
const theoryLessonController = require('../controllers/theoryLesson.controller');
const { verifyToken, isInstructor } = require('../middlewares/auth.jwt');

// Routes cho giảng viên
router.post(
  '/theory-lessons', 
  [verifyToken, isInstructor],
  theoryLessonController.createTheoryLesson
);

router.put(
  '/theory-lessons/:id',
  [verifyToken, isInstructor],
  theoryLessonController.updateTheoryLesson
);

router.delete(
  '/theory-lessons/:id',
  [verifyToken, isInstructor],
  theoryLessonController.deleteTheoryLesson
);

// Routes cho tất cả người dùng
router.get(
  '/courses/:courseId/theory-lessons',
  verifyToken,
  theoryLessonController.getTheoryLessonsByCourse
);

router.get(
  '/theory-lessons/:id',
  verifyToken,
  theoryLessonController.getTheoryLesson
);

module.exports = router;