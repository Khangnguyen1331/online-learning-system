import { Award, Book, Target, Users } from 'lucide-react';
import React from 'react';

export default function AboutPage() {
  const stats = [
    { icon: Users, title: "Học viên", value: "10,000+" },
    { icon: Book, title: "Khóa học", value: "100+" },
    { icon: Award, title: "Giảng viên", value: "50+" },
    { icon: Target, title: "Hoàn thành", value: "95%" }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-blue-600 text-white py-20">
        <div className="absolute inset-0">
          <img
            src="/api/placeholder/1920/400"
            alt="Hero background"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Về chúng tôi</h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto">
            EduOnline là nền tảng học trực tuyến hàng đầu, cung cấp các khóa học chất lượng cao từ các giảng viên uy tín
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center transform hover:scale-105 transition-transform duration-300">
                <stat.icon className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.title}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alternating Sections */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          {/* Section 1 */}
          <div className="flex flex-col md:flex-row items-center mb-20">
            <div className="md:w-1/2 md:pr-12 mb-8 md:mb-0">
              <h2 className="text-3xl font-bold mb-6">Sứ mệnh của chúng tôi</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                EduOnline được thành lập với sứ mệnh đem đến kiến thức lập trình chất lượng cao,
                giúp học viên có thể học tập mọi lúc, mọi nơi với chi phí hợp lý nhất.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Chúng tôi tin rằng công nghệ và giáo dục có thể thay đổi cuộc sống của mọi người,
                và chúng tôi đang nỗ lực để biến điều đó thành hiện thực.
              </p>
            </div>
            <div className="md:w-1/2">
              <div className="relative">
                <img
                  src="/api/placeholder/600/400"
                  alt="Mission"
                  className="rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-600 rounded-lg opacity-20"></div>
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="flex flex-col md:flex-row-reverse items-center mb-20">
            <div className="md:w-1/2 md:pl-12 mb-8 md:mb-0">
              <h2 className="text-3xl font-bold mb-6">Đội ngũ giảng viên</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Với đội ngũ giảng viên giàu kinh nghiệm, làm việc tại các công ty công nghệ hàng đầu,
                chúng tôi mang đến những kiến thức thực tế và cập nhật nhất.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Mỗi khóa học được thiết kế công phu, kết hợp giữa lý thuyết và thực hành,
                giúp học viên nhanh chóng áp dụng vào công việc thực tế.
              </p>
            </div>
            <div className="md:w-1/2">
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-yellow-400 rounded-lg opacity-20"></div>
                <img
                  src="/api/placeholder/600/400"
                  alt="Instructors"
                  className="rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 md:pr-12 mb-8 md:mb-0">
              <h2 className="text-3xl font-bold mb-6">Công nghệ hiện đại</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Nền tảng học tập của chúng tôi được xây dựng trên công nghệ hiện đại,
                đảm bảo trải nghiệm học tập mượt mà và thuận tiện cho người dùng.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Hệ thống video streaming chất lượng cao, tương tác real-time,
                và các công cụ học tập thông minh giúp việc học trực tuyến trở nên hiệu quả hơn bao giờ hết.
              </p>
            </div>
            <div className="md:w-1/2">
              <div className="relative">
                <img
                  src="/api/placeholder/600/400"
                  alt="Technology"
                  className="rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-green-500 rounded-lg opacity-20"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values with Visual Elements */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Giá trị cốt lõi</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-6 mx-auto">
                <Award className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-center mb-4">Chất lượng</h3>
              <p className="text-gray-600 text-center">
                Cam kết mang đến nội dung học tập chất lượng cao và cập nhật
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center mb-6 mx-auto">
                <Book className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-center mb-4">Sáng tạo</h3>
              <p className="text-gray-600 text-center">
                Luôn đổi mới phương pháp giảng dạy để tăng hiệu quả học tập
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mb-6 mx-auto">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-center mb-4">Tận tâm</h3>
              <p className="text-gray-600 text-center">
                Hỗ trợ học viên tận tình trong suốt quá trình học tập
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}