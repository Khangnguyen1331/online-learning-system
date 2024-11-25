/*
* Path: /frontend/src/components/payment/PaymentForm.jsx
*/

import {
    AlertCircle,
    CreditCard,
    DollarSign,
    Loader
} from 'lucide-react';
import React, { useState } from 'react';

export default function PaymentForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Mock data để test
  const mockCourse = {
    id: 1,
    title: "NodeJS Premium Course",
    description: "Khóa học NodeJS từ cơ bản đến nâng cao với những ví dụ thực tế",
    price: 1500000
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          courseId: mockCourse.id
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Có lỗi xảy ra khi tạo thanh toán');
      }

      // Chuyển hướng đến trang thanh toán MoMo
      window.location.href = data.paymentUrl;

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">
        Thanh toán khóa học
      </h2>

      {/* Course Info */}
      <div className="mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-gray-900">{mockCourse.title}</h3>
          <p className="text-sm text-gray-500 mt-1">{mockCourse.description}</p>
          <div className="mt-4 flex justify-between items-center">
            <span className="text-sm text-gray-600">Giá khóa học</span>
            <span className="text-lg font-medium text-blue-600">
              {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
              }).format(mockCourse.price)}
            </span>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Payment Button */}
      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full bg-blue-600 text-white rounded-lg py-3 px-4 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors duration-200"
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
            Đang xử lý...
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <CreditCard className="h-5 w-5 mr-2" />
            Thanh toán qua MoMo
          </div>
        )}
      </button>

      {/* Payment Notes */}
      <div className="mt-6 text-sm text-gray-500">
        <p className="flex items-center mb-2">
          <DollarSign className="h-4 w-4 mr-1" />
          Thanh toán an toàn và bảo mật
        </p>
        <p className="text-xs">
          Bằng việc tiếp tục, bạn đồng ý với điều khoản sử dụng và chính sách bảo mật của chúng tôi.
        </p>
      </div>
    </div>
  );
}