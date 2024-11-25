// controllers/course.controller.js
const deleteCourse = async (req, res) => {
    try {
      const { id } = req.params;
      
      // Xóa tất cả video lessons
      const videoLessons = await VideoLesson.find({ courseId: id });
      for (let video of videoLessons) {
        await deleteVideo(video.videoUrl);
        await video.remove();
      }
      
      // Xóa tất cả theory lessons
      await TheoryLesson.deleteMany({ courseId: id });
      
      // Xóa course image
      const course = await Course.findById(id);
      if (course.imageUrl) {
        await deleteFile(course.imageUrl);
      }
      
      // Xóa khỏi premiumCourses của users
      await User.updateMany(
        { premiumCourses: id },
        { $pull: { premiumCourses: id } }
      );
      
      // Xóa khóa học
      await course.remove();
      
      res.status(200).json({
        message: 'Xóa khóa học và tất cả dữ liệu liên quan thành công'
      });
    } catch (error) {
      res.status(500).json({
        message: 'Lỗi khi xóa khóa học',
        error: error.message
      });
    }
  };