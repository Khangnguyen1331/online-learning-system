/*
* Path: /frontend/src/components/admin/Dashboard.jsx
*/

import {
    Book,
    Calendar,
    Clock,
    DollarSign,
    TrendingUp,
    UserCheck,
    Users
} from 'lucide-react';
import React, { useState } from 'react';
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';

// StatCard Component
const StatCard = ({ title, value, icon: Icon, trend }) => (
  <div className="bg-white rounded-xl shadow-md p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-semibold mt-2">{value}</p>
        {trend && (
          <div className="mt-2 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-500">{trend}</span>
          </div>
        )}
      </div>
      <div className="p-3 bg-blue-50 rounded-lg">
        <Icon className="h-6 w-6 text-blue-500" />
      </div>
    </div>
  </div>
);

// RevenueChart Component
const RevenueChart = ({ data }) => {
  if (!data) return null;

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium">Doanh thu</h3>
        <select 
          className="px-3 py-2 border rounded-lg"
        >
          <option value="month">Theo tháng</option>
          <option value="quarter">Theo quý</option>
          <option value="year">Theo năm</option>
        </select>
      </div>
      <div className="h-80">
        <BarChart
          data={data}
          width={600}
          height={300}
          margin={{ top: 20, right: 30, left: 40, bottom: 30 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="revenue" fill="#3B82F6" />
        </BarChart>
      </div>
    </div>
  );
};

// TopCourses Component
const TopCourses = ({ courses }) => {
  if (!courses) return null;

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-medium mb-4">Top khóa học</h3>
      <div className="space-y-4">
        {courses.map((course, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-medium">
                {index + 1}
              </span>
              <div className="ml-4">
                <p className="font-medium">{course.name}</p>
                <p className="text-sm text-gray-500">{course.students} học viên</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium text-green-600">{course.revenue}</p>
              <p className="text-sm text-gray-500">{course.type}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// RecentActivities Component
const RecentActivities = ({ activities }) => {
  if (!activities) return null;

  const getActivityIcon = (type) => {
    switch (type) {
      case 'registration':
        return <Users className="h-4 w-4 text-blue-500" />;
      case 'purchase':
        return <DollarSign className="h-4 w-4 text-green-500" />;
      case 'course_create':
        return <Book className="h-4 w-4 text-purple-500" />;
      default:
        return <Calendar className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const activityDate = new Date(date);
    const diffInMinutes = Math.floor((now - activityDate) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} phút trước`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} giờ trước`;
    } else {
      return activityDate.toLocaleDateString('vi-VN');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium">Hoạt động gần đây</h3>
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="h-4 w-4 mr-1" />
          <span>Cập nhật thời gian thực</span>
        </div>
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="p-2 bg-gray-100 rounded-lg">
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{activity.message}</p>
              <div className="mt-1 flex items-center text-xs text-gray-500">
                <span>{formatTime(activity.timestamp)}</span>
                {activity.type === 'purchase' && (
                  <>
                    <span className="mx-1">•</span>
                    <span className="text-green-600 font-medium">{activity.amount}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main Dashboard Component
export default function AdminDashboard() {
  const [stats, setStats] = useState({
    basicStats: {
      revenue: { total: '1,500,000,000đ' },
      users: { totalStudents: 1200, premiumStudents: 450 },
      courses: { total: 25 }
    },
    charts: {
      monthlyRevenue: [
        { name: 'T1', revenue: 120 },
        { name: 'T2', revenue: 150 },
        { name: 'T3', revenue: 180 },
        // Thêm dữ liệu các tháng khác...
      ],
      topCourses: [
        { name: 'NodeJS Premium', students: 350, revenue: '500,000,000đ', type: 'Premium' },
        { name: 'ReactJS Cơ bản', students: 280, revenue: '420,000,000đ', type: 'Premium' },
        { name: 'HTML/CSS', students: 220, revenue: '330,000,000đ', type: 'Premium' }
      ]
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Tổng doanh thu" 
          value={stats.basicStats.revenue.total} 
          icon={DollarSign}
          trend="+12% so với tháng trước"
        />
        <StatCard 
          title="Tổng học viên" 
          value={stats.basicStats.users.totalStudents} 
          icon={Users} 
        />
        <StatCard 
          title="Học viên Premium" 
          value={stats.basicStats.users.premiumStudents} 
          icon={UserCheck}
        />
        <StatCard 
          title="Tổng khóa học" 
          value={stats.basicStats.courses.total} 
          icon={Book}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <RevenueChart data={stats.charts.monthlyRevenue} />
        </div>
        <div>
          <TopCourses courses={stats.charts.topCourses} />
        </div>
      </div>

      <div className="mt-8">
        <RecentActivities 
          activities={[
            {
              type: 'registration',
              message: 'Nguyễn Văn A đã đăng ký tài khoản mới',
              timestamp: new Date(Date.now() - 15 * 60000)
            },
            {
              type: 'purchase',
              message: 'Trần Thị B đã mua khóa học NodeJS Premium',
              amount: '1,500,000đ',
              timestamp: new Date(Date.now() - 45 * 60000)
            },
            {
              type: 'course_create',
              message: 'Giảng viên Phạm C đã thêm khóa học mới: ReactJS Cơ bản',
              timestamp: new Date(Date.now() - 120 * 60000)
            }
          ]}
        />
      </div>
    </div>
  );
}