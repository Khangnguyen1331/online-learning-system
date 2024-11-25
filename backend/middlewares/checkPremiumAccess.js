// middlewares/checkPremiumAccess.js
const checkPremiumAccess = async (req, res, next) => {
    try {
      const { courseId } = req.params;
      const course = await Course.findById(courseId);
      
      if (course.isPremium) {
        // Kiểm tra user có quyền premium với khóa học này không
        const user = await User.findById(req.user.id);
        if (!user.isPremium || !user.premiumCourses.includes(courseId)) {
          return res.status(403).json({
            message: 'Bạn cần nâng cấp tài khoản Premium để truy cập nội dung này'
          });
        }
      }
      next();
    } catch (error) {
      res.status(500).json({
        message: 'Lỗi khi kiểm tra quyền truy cập',
        error: error.message
      });
    }
  };