// controllers/admin/export.controller.js
const excel = require('exceljs');
const User = require('../../models/user.model');
const Course = require('../../models/course.model');
const { formatDate } = require('../../utils/date.utils');

const exportSearchResults = async (req, res) => {
  try {
    const { type, searchParams } = req.body;
    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet('Search Results');

    if (type === 'users') {
      // Cấu hình worksheet cho users
      worksheet.columns = [
        { header: 'Username', key: 'username', width: 20 },
        { header: 'Email', key: 'email', width: 30 },
        { header: 'Họ Tên', key: 'fullName', width: 25 },
        { header: 'Vai Trò', key: 'role', width: 15 },
        { header: 'Premium', key: 'isPremium', width: 10 },
        { header: 'Ngày Tạo', key: 'createdAt', width: 20 }
      ];

      // Lấy dữ liệu users theo searchParams
      const users = await User.find(buildSearchFilter(searchParams))
        .select('-password')
        .lean();

      // Thêm dữ liệu vào worksheet
      users.forEach(user => {
        worksheet.addRow({
          ...user,
          role: translateRole(user.role),
          isPremium: user.isPremium ? 'Có' : 'Không',
          createdAt: new Date(user.createdAt).toLocaleDateString('vi-VN')
        });
      });

    } else if (type === 'courses') {
      // Cấu hình worksheet cho courses
      worksheet.columns = [
        { header: 'Tên Khóa Học', key: 'title', width: 30 },
        { header: 'Giá', key: 'price', width: 15 },
        { header: 'Premium', key: 'isPremium', width: 10 },
        { header: 'Số Video', key: 'videoCount', width: 12 },
        { header: 'Số Bài Giảng', key: 'lessonCount', width: 15 },
        { header: 'Doanh Thu', key: 'revenue', width: 20 }
      ];

      // Lấy dữ liệu courses với thống kê
      const courses = await Course.aggregate([
        { $match: buildSearchFilter(searchParams) },
        {
          $lookup: {
            from: 'videos',
            localField: '_id',
            foreignField: 'courseId',
            as: 'videos'
          }
        },
        {
          $lookup: {
            from: 'lessons',
            localField: '_id',
            foreignField: 'courseId',
            as: 'lessons'
          }
        },
        {
          $lookup: {
            from: 'payments',
            localField: '_id',
            foreignField: 'courseId',
            as: 'payments'
          }
        },
        {
          $project: {
            title: 1,
            price: 1,
            isPremium: 1,
            videoCount: { $size: '$videos' },
            lessonCount: { $size: '$lessons' },
            revenue: { $sum: '$payments.amount' }
          }
        }
      ]);

      // Thêm dữ liệu vào worksheet
      courses.forEach(course => {
        worksheet.addRow({
          ...course,
          isPremium: course.isPremium ? 'Có' : 'Không',
          price: `${course.price.toLocaleString('vi-VN')}đ`,
          revenue: `${course.revenue.toLocaleString('vi-VN')}đ`
        });
      });
    }

    // Tạo file Excel và gửi về client
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=export-${Date.now()}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();


    
    // Thêm header tổng hợp
    worksheet.mergeCells('A1:F1');
    worksheet.getCell('A1').value = 'BÁO CÁO THỐNG KÊ HỆ THỐNG KHÓA HỌC TRỰC TUYẾN';
    worksheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getCell('A1').font = { bold: true, size: 14 };

    worksheet.mergeCells('A2:F2');
    worksheet.getCell('A2').value = `Ngày xuất: ${formatDate(new Date())}`;
    worksheet.getCell('A2').alignment = { horizontal: 'center' };

    // Thêm dòng trống
    worksheet.addRow([]);

    if (type === 'users') {
      const users = await User.find(buildSearchFilter(searchParams)).select('-password').lean();

      // Thêm thông tin tổng hợp
      worksheet.addRow(['THỐNG KÊ NGƯỜI DÙNG']);
      worksheet.addRow([`Tổng số người dùng: ${users.length}`]);
      worksheet.addRow([`Số giảng viên: ${users.filter(u => u.role === 'instructor').length}`]);
      worksheet.addRow([`Số sinh viên thường: ${users.filter(u => u.role === 'student' && !u.isPremium).length}`]);
      worksheet.addRow([`Số sinh viên premium: ${users.filter(u => u.role === 'student' && u.isPremium).length}`]);
      worksheet.addRow([]);

      // Cấu hình và thêm dữ liệu
      worksheet.addRow(['Username', 'Email', 'Họ Tên', 'Vai Trò', 'Premium', 'Ngày Tạo']);
      users.forEach(user => {
        worksheet.addRow({
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          role: translateRole(user.role),
          isPremium: user.isPremium ? 'Có' : 'Không',
          createdAt: formatDate(user.createdAt)
        });
      });

    } else if (type === 'courses') {
      const courses = await Course.aggregate([
        { $match: buildSearchFilter(searchParams) },
        {
          $lookup: {
            from: 'payments',
            localField: '_id',
            foreignField: 'courseId',
            as: 'payments'
          }
        },
        {
          $project: {
            title: 1,
            price: 1,
            isPremium: 1,
            revenue: { $sum: '$payments.amount' },
            studentCount: { $size: '$payments' }
          }
        }
      ]);

      // Thêm thông tin tổng hợp
      const totalRevenue = courses.reduce((sum, course) => sum + course.revenue, 0);
      worksheet.addRow(['THỐNG KÊ KHÓA HỌC']);
      worksheet.addRow([`Tổng số khóa học: ${courses.length}`]);
      worksheet.addRow([`Tổng doanh thu: ${formatCurrency(totalRevenue)}`]);
      worksheet.addRow([`Số khóa học premium: ${courses.filter(c => c.isPremium).length}`]);
      worksheet.addRow([]);

      // Cấu hình và thêm dữ liệu
      worksheet.addRow(['Tên Khóa Học', 'Giá', 'Premium', 'Số Học Viên', 'Doanh Thu']);
      courses.forEach(course => {
        worksheet.addRow({
          title: course.title,
          price: formatCurrency(course.price),
          isPremium: course.isPremium ? 'Có' : 'Không',
          studentCount: course.studentCount,
          revenue: formatCurrency(course.revenue)
        });
      });
    }

    // Style cho worksheet
    worksheet.columns.forEach(column => {
      column.width = Math.max(20, column.width || 10);
    });

    // Xuất file
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=bao-cao-${type}-${formatDateForFilename(new Date())}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    res.status(500).json({
      message: 'Lỗi khi xuất dữ liệu',
      error: error.message
    });
  }
};
// Helper functions
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

const formatDateForFilename = (date) => {
  return formatDate(date).replace(/\//g, '-');
};
// Helper functions
const buildSearchFilter = (params) => {
  // Logic để xây dựng filter từ searchParams
  // Tương tự như trong searchController
  return params;
};

const translateRole = (role) => {
  const roles = {
    'admin': 'Quản trị viên',
    'instructor': 'Giảng viên',
    'student': 'Sinh viên'
  };
  return roles[role] || role;
};



module.exports = { exportSearchResults };