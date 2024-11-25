// controllers/videoLesson.controller.js
const VideoLesson = require('../models/videoLesson.model');
const Course = require('../models/course.model');
const { deleteVideo } = require('../services/videoUpload.service');
const getVideoDurationInSeconds = require('get-video-duration');

// Upload video bài giảng
const uploadVideoLesson = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: 'Vui lòng upload video'
      });
    }

    const { courseId, chapter, title, isPremium } = req.body;

    // Kiểm tra khóa học tồn tại và thuộc về giảng viên này
    const course = await Course.findOne({
      _id: courseId,
      instructor: req.user.id
    });

    if (!course) {
      await deleteVideo(req.file.path);
      return res.status(404).json({
        message: 'Không tìm thấy khóa học hoặc bạn không có quyền thêm video cho khóa học này'
      });
    }

    // Lấy duration của video
    const duration = await getVideoDurationInSeconds(req.file.path);
    const formattedDuration = new Date(duration * 1000).toISOString().substr(11, 8);

    const videoLesson = new VideoLesson({
      courseId,
      chapter,
      title,
      videoUrl: `/uploads/videos/${req.file.filename}`,
      duration: formattedDuration,
      instructor: req.user.id,
      isPremium: Boolean(isPremium)
    });

    await videoLesson.save();

    res.status(201).json({
      message: 'Upload video bài giảng thành công',
      videoLesson
    });
  } catch (error) {
    if (req.file) {
      await deleteVideo(req.file.path);
    }
    res.status(500).json({
      message: 'Lỗi khi upload video bài giảng',
      error: error.message
    });
  }
};

// Lấy danh sách video theo khóa học
const getVideoLessonsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const videos = await VideoLesson.find({ courseId })
      .sort({ chapter: 1 })
      .populate('instructor', 'fullName');

    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({
      message: 'Lỗi khi lấy danh sách video',
      error: error.message
    });
  }
};

// Lấy chi tiết video bài giảng
const getVideoLesson = async (req, res) => {
  try {
    const { id } = req.params;
    
    const video = await VideoLesson.findById(id)
      .populate('instructor', 'fullName')
      .populate('courseId', 'title');

    if (!video) {
      return res.status(404).json({
        message: 'Không tìm thấy video bài giảng'
      });
    }

    // Kiểm tra quyền xem video premium
    if (video.isPremium && (!req.user.isPremium || !req.user.premiumCourses.includes(video.courseId))) {
      return res.status(403).json({
        message: 'Bạn cần nâng cấp tài khoản Premium để xem video này'
      });
    }

    res.status(200).json(video);
  } catch (error) {
    res.status(500).json({
      message: 'Lỗi khi lấy thông tin video',
      error: error.message
    });
  }
};

// Cập nhật thông tin video
const updateVideoLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const { chapter, title, isPremium } = req.body;

    const video = await VideoLesson.findOne({
      _id: id,
      instructor: req.user.id
    });

    if (!video) {
      return res.status(404).json({
        message: 'Không tìm thấy video hoặc bạn không có quyền chỉnh sửa'
      });
    }

    video.chapter = chapter;
    video.title = title;
    video.isPremium = Boolean(isPremium);
    video.updatedAt = Date.now();

    await video.save();

    res.status(200).json({
      message: 'Cập nhật thông tin video thành công',
      video
    });
  } catch (error) {
    res.status(500).json({
      message: 'Lỗi khi cập nhật thông tin video',
      error: error.message
    });
  }
};

// Xóa video bài giảng
const deleteVideoLesson = async (req, res) => {
  try {
    const { id } = req.params;

    const video = await VideoLesson.findOneAndDelete({
      _id: id,
      instructor: req.user.id
    });

    if (!video) {
      return res.status(404).json({
        message: 'Không tìm thấy video hoặc bạn không có quyền xóa'
      });
    }

    // Xóa file video
    await deleteVideo(video.videoUrl);

    res.status(200).json({
      message: 'Xóa video bài giảng thành công'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Lỗi khi xóa video bài giảng',
      error: error.message
    });
  }
};

module.exports = {
  uploadVideoLesson,
  getVideoLessonsByCourse,
  getVideoLesson,
  updateVideoLesson,
  deleteVideoLesson
};