/*
* Path: /frontend/src/components/courses/CourseDetail.jsx
*/

import {
    DollarSign,
    FileText,
    MessageSquare,
    Play,
    Star,
    Users
} from 'lucide-react';
import React, { useState } from 'react';

export default function CourseDetail() {
  // Mock data cho course detail
  const courseDetail = {
    id: 1,
    title: "NodeJS Premium Course",
    description: "Khóa học NodeJS từ cơ bản đến nâng cao, giúp bạn xây dựng được các ứng dụng web server-side với hiệu suất cao. Khóa học bao gồm nhiều ví dụ thực tế và bài tập thực hành.",
    imageUrl: "/api/placeholder/800/400",
    isPremium: true,
    price: 1500000,
    instructor: {
      name: "John Doe",
      avatar: "/api/placeholder/64/64",
      title: "Senior Backend Developer",
      bio: "10+ năm kinh nghiệm phát triển web với NodeJS"
    },
    stats: {
      students: 256,
      rating: 4.8,
      reviews: 45
    },
    videos: [
      { id: 1, title: "Giới thiệu NodeJS", duration: "10:25" },
      { id: 2, title: "Cài đặt môi trường", duration: "15:30" },
      { id: 3, title: "Node Package Manager (NPM)", duration: "20:15" },
      { id: 4, title: "Express Framework", duration: "25:40" },
      { id: 5, title: "RESTful API", duration: "30:10" }
    ],
    lessons: [
      { id: 1, title: "Tổng quan về NodeJS và V8 Engine" },
      { id: 2, title: "Kiến trúc và các thành phần của NodeJS" },
      { id: 3, title: "Event Loop và Non-blocking I/O" },
      { id: 4, title: "Modules và Package Management" },
      { id: 5, title: "Working with File System" }
    ],
    reviews: [
      {
        id: 1,
        user: {
          name: "Alice Johnson",
          avatar: "/api/placeholder/40/40"
        },
        rating: 5,
        comment: "Khóa học rất chi tiết và dễ hiểu. Giảng viên giảng dạy rất nhiệt tình.",
        date: "2024-02-15"
      },
      {
        id: 2,
        user: {
          name: "Bob Smith",
          avatar: "/api/placeholder/40/40"
        },
        rating: 4,
        comment: "Nội dung phong phú, nhiều ví dụ thực tế.",
        date: "2024-02-10"
      }
    ]
  };

  const [activeTab, setActiveTab] = useState('videos');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Course Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Course Info */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {courseDetail.title}
              </h1>
              <p className="text-gray-600 mb-6">
                {courseDetail.description}
              </p>
              
              <div className="flex items-center space-x-6 mb-6">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">
                    {courseDetail.stats.students} học viên
                  </span>
                </div>
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 mr-2" />
                  <span className="text-sm text-gray-600">
                    {courseDetail.stats.rating} ({courseDetail.stats.reviews} đánh giá)
                  </span>
                </div>
              </div>

              {/* Instructor Info */}
              <div className="flex items-center">
                <img
                  src={courseDetail.instructor.avatar}
                  alt={courseDetail.instructor.name}
                  className="h-12 w-12 rounded-full mr-4"
                />
                <div>
                  <h3 className="font-medium text-gray-900">
                    {courseDetail.instructor.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {courseDetail.instructor.title}
                  </p>
                </div>
              </div>
            </div>

            {/* Course Preview */}
            <div>
              <div className="relative rounded-lg overflow-hidden">
                <img
                  src={courseDetail.imageUrl}
                  alt={courseDetail.title}
                  className="w-full h-64 object-cover"
                />
                {courseDetail.isPremium && (
                  <div className="absolute top-4 right-4 px-4 py-2 bg-white rounded-full shadow-md">
                    <div className="flex items-center text-yellow-600 font-medium">
                      <DollarSign className="h-5 w-5 mr-1" />
                      {new Intl.NumberFormat('vi-VN').format(courseDetail.price)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex space-x-1 rounded-lg bg-white p-1 shadow-sm mb-6">
          <button
            onClick={() => setActiveTab('videos')}
            className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium ${
              activeTab === 'videos'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Play className="h-4 w-4 mr-2" />
            Video bài giảng
          </button>
          <button
            onClick={() => setActiveTab('lessons')}
            className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium ${
              activeTab === 'lessons'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FileText className="h-4 w-4 mr-2" />
            Bài giảng lý thuyết
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium ${
              activeTab === 'reviews'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Đánh giá
          </button>
        </div>

        {/* Content based on active tab */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {activeTab === 'videos' && (
            <div className="space-y-4">
              {courseDetail.videos.map((video, index) => (
                <div
                  key={video.id}
                  className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                >
                  <div className="bg-blue-100 rounded-full p-2 mr-4">
                    <Play className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">
                      {index + 1}. {video.title}
                    </h3>
                    <p className="text-sm text-gray-500">{video.duration}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'lessons' && (
            <div className="space-y-4">
              {courseDetail.lessons.map((lesson, index) => (
                <div
                  key={lesson.id}
                  className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                >
                  <div className="bg-green-100 rounded-full p-2 mr-4">
                    <FileText className="h-5 w-5 text-green-600" />
                  </div>
                  <h3 className="font-medium text-gray-900">
                    {index + 1}. {lesson.title}
                  </h3>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {courseDetail.reviews.map(review => (
                <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
                  <div className="flex items-center mb-3">
                    <img
                      src={review.user.avatar}
                      alt={review.user.name}
                      className="h-8 w-8 rounded-full mr-3"
                    />
                    <div>
                      <h4 className="font-medium text-gray-900">{review.user.name}</h4>
                      <div className="flex items-center">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-400" fill="currentColor" />
                        ))}
                        <span className="text-sm text-gray-500 ml-2">
                          {new Date(review.date).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}