/*
* Path: /frontend/src/components/admin/RevenueManagement.jsx
*/

import {
    Calendar,
    ChevronLeft,
    ChevronRight,
    DollarSign,
    TrendingUp
} from 'lucide-react';
import React, { useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from 'recharts';

export default function RevenueManagement() {
  // Mock data cho biểu đồ
  const chartData = [
    { name: 'T1', revenue: 12000000 },
    { name: 'T2', revenue: 15000000 },
    { name: 'T3', revenue: 18000000 },
    { name: 'T4', revenue: 16000000 },
    { name: 'T5', revenue: 21000000 },
    { name: 'T6', revenue: 19000000 },
    { name: 'T7', revenue: 22000000 },
    { name: 'T8', revenue: 25000000 },
    { name: 'T9', revenue: 23000000 },
    { name: 'T10', revenue: 28000000 },
    { name: 'T11', revenue: 26000000 },
    { name: 'T12', revenue: 30000000 }
  ];

  const [revenueData, setRevenueData] = useState([
    {
      id: 1,
      title: "NodeJS Premium",
      category: "Backend Development",
      instructor: { name: "John Doe", email: "john@example.com" },
      studentCount: 150,
      price: 1500000,
      revenue: 225000000,
      percentageOfTotal: 35
    },
    {
      id: 2,
      title: "ReactJS Advanced",
      category: "Frontend Development",
      instructor: { name: "Jane Smith", email: "jane@example.com" },
      studentCount: 120,
      price: 1200000,
      revenue: 144000000,
      percentageOfTotal: 25
    },
    // Thêm mock data khác...
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(5);
  const [totalRevenue, setTotalRevenue] = useState(650000000);
  const [monthlyRevenue, setMonthlyRevenue] = useState(30000000);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount || 0);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý doanh thu</h1>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="ml-4 px-4 py-2 border border-gray-300 rounded-lg bg-white"
        >
          <option value="month">Theo tháng</option>
          <option value="quarter">Theo quý</option>
          <option value="year">Theo năm</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng doanh thu</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {formatCurrency(totalRevenue)}
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Doanh thu tháng này</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {formatCurrency(monthlyRevenue)}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium">Biểu đồ doanh thu</h3>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Cập nhật theo thời gian thực</span>
          </div>
        </div>
        <div className="h-96">
          <BarChart
            data={chartData}
            width={800}
            height={300}
            margin={{ top: 20, right: 30, left: 40, bottom: 30 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Legend />
            <Bar dataKey="revenue" fill="#3B82F6" name="Doanh thu" />
          </BarChart>
        </div>
      </div>

      {/* Revenue Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium">Chi tiết doanh thu theo khóa học</h3>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Khóa học
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Giảng viên
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Số học viên
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Giá bán
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Doanh thu
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {revenueData.map((course) => (
              <tr key={course.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-gray-500" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{course.title}</div>
                      <div className="text-sm text-gray-500">
                        {course.category}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{course.instructor.name}</div>
                  <div className="text-sm text-gray-500">{course.instructor.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {course.studentCount} học viên
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(course.price)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-green-600 font-medium">
                    {formatCurrency(course.revenue)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {course.percentageOfTotal}% tổng doanh thu
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-md bg-white border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="mx-4 text-sm text-gray-700">
                Trang {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-md bg-white border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      )}
    </div>
  );
}