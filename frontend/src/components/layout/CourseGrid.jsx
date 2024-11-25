import { DollarSign, Star } from 'lucide-react';
import React from 'react';

export default function CourseGrid() {
  // Mock data
  const courses = {
    featured: [
      {
        id: 1,
        title: "NodeJS Full Stack",
        description: "Học NodeJS từ cơ bản đến nâng cao, xây dựng REST API",
        imageUrl: "/api/placeholder/300/200",
        isPremium: true,
        price: 1500000,
        instructor: {
          name: "John Doe",
          avatar: "/api/placeholder/40/40"
        },
        category: "Backend"
      },
      {
        id: 2,
        title: "React.js Advanced",
        description: "Làm chủ React.js và Redux trong hệ sinh thái React",
        imageUrl: "/api/placeholder/300/200",
        isPremium: true,
        price: 1200000,
        instructor: {
          name: "Jane Smith",
          avatar: "/api/placeholder/40/40"
        },
        category: "Frontend"
      },
      {
        id: 3,
        title: "Vue.js Basic",
        description: "Học Vue.js từ zero, xây dựng ứng dụng thực tế",
        imageUrl: "/api/placeholder/300/200",
        isPremium: true,
        price: 1100000,
        instructor: {
          name: "Mike Wilson",
          avatar: "/api/placeholder/40/40"
        },
        category: "Frontend"
      },
      {
        id: 4,
        title: "MongoDB Master",
        description: "Làm chủ MongoDB trong Node.js",
        imageUrl: "/api/placeholder/300/200",
        isPremium: true,
        price: 1300000,
        instructor: {
          name: "Sarah Lee",
          avatar: "/api/placeholder/40/40"
        },
        category: "Database"
      },
      {
        id: 5,
        title: "Docker Basic",
        description: "Docker cho người mới bắt đầu",
        imageUrl: "/api/placeholder/300/200",
        isPremium: true,
        price: 900000,
        instructor: {
          name: "David Kim",
          avatar: "/api/placeholder/40/40"
        },
        category: "DevOps"
      }
    ],
    newest: [
      {
        id: 6,
        title: "HTML & CSS",
        description: "Nền tảng Web Development",
        imageUrl: "/api/placeholder/300/200",
        isPremium: false,
        instructor: {
          name: "Tom Ford",
          avatar: "/api/placeholder/40/40"
        },
        category: "Web"
      },
      {
        id: 7,
        title: "JavaScript Basic",
        description: "Lập trình JavaScript cơ bản",
        imageUrl: "/api/placeholder/300/200",
        isPremium: false,
        instructor: {
          name: "Emma Stone",
          avatar: "/api/placeholder/40/40"
        },
        category: "Web"
      }
    ],
    premium: [
      {
        id: 8,
        title: "AWS Cloud Pro",
        description: "Triển khai ứng dụng trên AWS",
        imageUrl: "/api/placeholder/300/200",
        isPremium: true,
        price: 2000000,
        instructor: {
          name: "Chris Evans",
          avatar: "/api/placeholder/40/40"
        },
        category: "Cloud"
      },
      {
        id: 9,
        title: "React Native",
        description: "Phát triển ứng dụng di động",
        imageUrl: "/api/placeholder/300/200",
        isPremium: true,
        price: 1800000,
        instructor: {
          name: "Robert Jr",
          avatar: "/api/placeholder/40/40"
        },
        category: "Mobile"
      }
    ]
  };

  const CourseCard = ({ course }) => (
    <div className="flex flex-col bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden max-w-[200px]">
      <div className="relative h-32">
        <img
          src={course.imageUrl}
          alt={course.title}
          className="w-full h-full object-cover"
        />
        {course.isPremium && (
          <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-white rounded-full shadow-md">
            <div className="flex items-center text-yellow-600 text-[10px] font-medium">
              <DollarSign className="h-3 w-3 mr-0.5" />
              {new Intl.NumberFormat('vi-VN').format(course.price)}đ
            </div>
          </div>
        )}
        <div className="absolute bottom-2 left-2">
          <span className="px-1.5 py-0.5 bg-gray-900/70 text-white text-[10px] rounded-full">
            {course.category}
          </span>
        </div>
      </div>

      <div className="flex-1 p-3">
        <h3 className="font-medium text-gray-900 text-xs mb-1 line-clamp-2">
          {course.title}
        </h3>
        <p className="text-gray-500 text-[10px] mb-2 line-clamp-2">
          {course.description}
        </p>
      </div>

      <div className="p-3 pt-0 mt-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-[10px] text-gray-500">
            <img
              src={course.instructor.avatar}
              alt={course.instructor.name}
              className="w-4 h-4 rounded-full mr-1"
            />
            <span className="truncate">{course.instructor.name}</span>
          </div>
          {course.isPremium && (
            <span className="inline-flex items-center px-1.5 py-0.5 bg-yellow-100 text-yellow-800 text-[10px] rounded-full">
              <Star className="h-2 w-2 mr-0.5" />
              Premium
            </span>
          )}
        </div>
      </div>
    </div>
  );

  const CourseSection = ({ title, description, courses = [] }) => (
    <section className="mb-8">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          {title}
        </h2>
        <p className="text-gray-600 text-sm">
          {description}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </section>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <CourseSection
        title="Khóa học nổi bật"
        description="Những khóa học được đánh giá cao và được nhiều học viên lựa chọn"
        courses={courses.featured}
      />

      <CourseSection
        title="Khóa học mới nhất"
        description="Cập nhật những kiến thức mới nhất trong lĩnh vực lập trình"
        courses={courses.newest}
      />

      <CourseSection
        title="Khóa học Premium"
        description="Nội dung chuyên sâu với sự hướng dẫn trực tiếp từ giảng viên"
        courses={courses.premium}
      />
    </div>
  );
}