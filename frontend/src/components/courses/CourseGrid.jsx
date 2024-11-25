/*
* Path: /frontend/src/components/courses/CourseGrid.jsx
*/

import { DollarSign } from 'lucide-react';
import React from 'react';

export default function CourseGrid() {
  const courses = [
    {
      id: 1,
      title: "NodeJS Premium Course",
      description: "Học NodeJS từ cơ bản đến nâng cao với những ví dụ thực tế",
      imageUrl: "/api/placeholder/240/160",
      isPremium: true,
      price: 1500000,
      instructor: {
        name: "John Doe",
        avatar: "/api/placeholder/32/32"
      }
    },
    {
      id: 2,
      title: "ReactJS Fundamentals",
      description: "Làm quen với ReactJS và xây dựng ứng dụng web hiện đại",
      imageUrl: "/api/placeholder/240/160",
      isPremium: false,
      instructor: {
        name: "Jane Smith",
        avatar: "/api/placeholder/32/32"
      }
    },
    {
      id: 3,
      title: "HTML/CSS/JavaScript Basics",
      description: "Nền tảng vững chắc cho Frontend Development",
      imageUrl: "/api/placeholder/240/160",
      isPremium: true,
      price: 1200000,
      instructor: {
        name: "Mike Johnson",
        avatar: "/api/placeholder/32/32"
      }
    },
    {
      id: 4,
      title: "MongoDB Complete Guide",
      description: "Thành thạo MongoDB trong các ứng dụng thực tế",
      imageUrl: "/api/placeholder/240/160",
      isPremium: true,
      price: 1800000,
      instructor: {
        name: "Sarah Wilson",
        avatar: "/api/placeholder/32/32"
      }
    }
  ];

  if (!courses || courses.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        Chưa có khóa học nào.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-4">
      {courses.map(course => (
        <div 
          key={course.id}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer max-w-[240px]"
          onClick={() => window.location.href = `/courses/${course.id}`}
        >
          {/* Course Image */}
          <div className="relative h-32">
            <img
              src={course.imageUrl}
              alt={course.title}
              className="w-full h-full object-cover"
            />
            {course.isPremium && (
              <div className="absolute top-2 right-2 px-2 py-1 bg-white rounded-full shadow-sm">
                <div className="flex items-center text-yellow-600 text-xs font-medium">
                  <DollarSign className="h-3 w-3 mr-0.5" />
                  {new Intl.NumberFormat('vi-VN', { 
                    notation: "compact",
                    maximumFractionDigits: 1
                  }).format(course.price)}
                </div>
              </div>
            )}
          </div>

          {/* Course Info */}
          <div className="p-3">
            <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2 leading-tight">
              {course.title}
            </h3>
            <p className="text-xs text-gray-500 line-clamp-2 mb-2 leading-relaxed">
              {course.description}
            </p>
            <div className="flex items-center text-xs text-gray-500">
              <img
                src={course.instructor.avatar}
                alt={course.instructor.name}
                className="h-4 w-4 rounded-full mr-1"
              />
              <span className="truncate">{course.instructor.name}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}