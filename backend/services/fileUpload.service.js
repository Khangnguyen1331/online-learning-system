// services/fileUpload.service.js
const multer = require('multer');
const path = require('path');

// Cấu hình chung cho việc upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'uploads/';
    
    // Phân loại thư mục theo loại file
    if (file.fieldname === 'video') {
      uploadPath += 'videos/';
    } else if (file.fieldname === 'courseImage') {
      uploadPath += 'courses/';
    } else if (file.fieldname === 'avatar') {
      uploadPath += 'avatars/';
    }
    
    // Tạo thư mục nếu chưa tồn tại
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Kiểm tra file type
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'video') {
    if (!file.mimetype.startsWith('video/')) {
      return cb(new Error('Only video files are allowed!'), false);
    }
  } else if (file.fieldname === 'courseImage' || file.fieldname === 'avatar') {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
  }
  cb(null, true);
};

module.exports = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: file.fieldname === 'video' ? 100 * 1024 * 1024 : 5 * 1024 * 1024
  }
});