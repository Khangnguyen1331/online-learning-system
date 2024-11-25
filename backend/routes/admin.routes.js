// routes/admin.routes.js
const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middlewares/auth.jwt');
const dashboardController = require('../controllers/admin/dashboard.controller');
const userController = require('../controllers/admin/user.controller');
const courseController = require('../controllers/admin/course.controller');
const searchController = require('../controllers/admin/search.controller');
const exportController = require('../controllers/admin/export.controller');
const backup = require('../utils/backup');

// Đảm bảo tất cả routes đều yêu cầu token admin
router.use(verifyToken, isAdmin);

// Dashboard routes
router.get('/dashboard', dashboardController.getDashboardStats);

// User management routes
router.get('/users/instructors', userController.getInstructors);
router.post('/users/instructors', userController.addInstructor);
router.get('/users/students', userController.getStudents);
router.patch('/users/students/:id/premium', userController.updateStudentStatus);
router.delete('/users/:id', userController.deleteUser);

// Course management routes
router.get('/courses', courseController.getCourses);
router.patch('/courses/:id', courseController.updateCourse);
router.delete('/courses/:id', courseController.deleteCourse);

// Search routes
router.get('/search/users', searchController.searchUsers);
router.get('/search/courses', searchController.searchCourses);

// Export routes
router.post('/export', exportController.exportSearchResults);

// Backup route
router.post('/backup', backup.createBackup);

module.exports = router;