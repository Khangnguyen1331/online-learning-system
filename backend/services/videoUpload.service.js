// services/videoUpload.service.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);

// Cấu hình storage cho multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/videos';
    // Tạo thư mục nếu chưa tồn tại
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Kiểm tra file type
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('File type not supported. Please upload MP4, WebM, or MOV video.'), false);
  }
};

const videoUpload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  }
});

// Function để xóa video
const deleteVideo = async (videoUrl) => {
  try {
    if (videoUrl) {
      const filePath = path.join(__dirname, '..', videoUrl);
      await unlinkAsync(filePath);
    }
  } catch (error) {
    console.error('Error deleting video:', error);
  }
};

module.exports = {
  videoUpload,
  deleteVideo
};