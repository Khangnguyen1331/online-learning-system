// utils/apiResponse.js
const sendResponse = (res, status, message, data = null) => {
    const response = {
      success: status < 400,
      message
    };
    
    if (data) {
      response.data = data;
    }
    
    return res.status(status).json(response);
  };
  
  // Sử dụng trong controllers
  const getVideoLesson = async (req, res) => {
    try {
      const video = await VideoLesson.findById(req.params.id);
      if (!video) {
        return sendResponse(res, 404, 'Không tìm thấy video bài giảng');
      }
      sendResponse(res, 200, 'Lấy thông tin video thành công', video);
    } catch (error) {
      sendResponse(res, 500, 'Lỗi server', { error: error.message });
    }
  };