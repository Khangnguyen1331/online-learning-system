/*
* Path: /frontend/src/components/instructor/Dashboard.jsx
*/

import {
    Book,
    ChevronRight,
    FileText,
    MessageSquare,
    Star,
    Users,
    Video
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

export default function InstructorDashboard() {
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalVideos: 0,
    totalLessons: 0,
    totalComments: 0,
    premiumCourses: 0
  });
  const [recentCourses, setRecentCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/instructor/dashboard', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setStats(data.stats);
      setRecentCourses(data.recentCourses);
      setLoading(false);
    } catch (error) {
      setError('Không thể tải dữ liệu dashboard');
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, bgColor }) => (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center">
        <div className={`${bgColor} p-3 rounded-lg`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  const CourseCard = ({ course }) => (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4">
      <div className="flex items-center mb-4">
        <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <Book className="h-6 w-6 text-blue-600" />
        </div>
        <div className="ml-4">
          <h3 className="font-medium text-gray-900">{course.title}</h3>
          <p className="text-sm text-gray-500">{course.category}</p>
        </div>
      </div>
      <div className="flex justify-between items-center text-sm">
        <div className="flex space-x-4">
          <div className="flex items-center text-gray-500">
            <Users className="h-4 w-4 mr-1" />
            {course.students} học viên
          </div>
          <div className="flex items-center text-gray-500">
            <Video className="h-4 w-4 mr-1" />
            {course.videos} video
          </div>
          <div className="flex items-center text-gray-500">
            <FileText className="h-4 w-4 mr-1" />
            {course.lessons} bài giảng
          </div>
        </div>
        {course.isPremium && (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
            Premium
          </span>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-gray-500">Xem tổng quan về các khóa học của bạn</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={Book}
          title="Tổng số khóa học"
          value={stats.totalCourses}
          bgColor="bg-blue-500"
        />
        <StatCard
          icon={Users}
          title="Tổng số học viên"
          value={stats.totalStudents}
          bgColor="bg-green-500"
        />
        <StatCard
          icon={Video}
          title="Tổng số video"
          value={stats.totalVideos}
          bgColor="bg-purple-500"
        />
        <StatCard
          icon={FileText}
          title="Tổng số bài giảng"
          value={stats.totalLessons}
          bgColor="bg-orange-500"
        />
        <StatCard
          icon={Star}
          title="Khóa học Premium"
          value={stats.premiumCourses}
          bgColor="bg-yellow-500"
        />
        <StatCard
          icon={MessageSquare}
          title="Bình luận mới"
          value={stats.totalComments}
          bgColor="bg-pink-500"
        />
      </div>

      {/* Recent Courses */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium">Khóa học gần đây</h2>
          <button
            onClick={() => window.location.href = '/instructor/courses'}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
          >
            Xem tất cả
            <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recentCourses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={() => window.location.href = '/instructor/courses/new'}
          className="p-4 bg-blue-50 hover:bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-medium"
        >
          <Book className="h-5 w-5 mr-2" />
          Tạo khóa học mới
        </button>
        <button
          onClick={() => window.location.href = '/instructor/videos/upload'}
          className="p-4 bg-purple-50 hover:bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 font-medium"
        >
          <Video className="h-5 w-5 mr-2" />
          Upload video
        </button>
        <button
          onClick={() => window.location.href = '/instructor/lessons/new'}
          className="p-4 bg-orange-50 hover:bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 font-medium"
        >
          <FileText className="h-5 w-5 mr-2" />
          Tạo bài giảng
        </button>
      </div>
    </div>
  );
}