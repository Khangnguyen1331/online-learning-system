import { CheckCircle, Loader, XCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';

export default function EmailVerification() {
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Lấy token từ URL
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (!token) {
          setStatus('error');
          setMessage('Token xác thực không hợp lệ');
          return;
        }

        const response = await fetch(`/api/auth/verify-email/${token}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Xác thực email thất bại');
        }

        setStatus('success');
        setMessage('Email đã được xác thực thành công!');

        // Tự động chuyển hướng sau 3 giây
        setTimeout(() => {
          window.location.href = '/login';
        }, 3000);

      } catch (error) {
        setStatus('error');
        setMessage(error.message);
      }
    };

    verifyEmail();
  }, []);

  const renderContent = () => {
    switch (status) {
      case 'verifying':
        return (
          <div className="text-center">
            <Loader className="h-16 w-16 text-blue-500 mx-auto animate-spin mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Đang xác thực email
            </h2>
            <p className="text-gray-600">
              Vui lòng đợi trong giây lát...
            </p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Xác thực thành công!
            </h2>
            <p className="text-gray-600 mb-6">
              {message}
            </p>
            <p className="text-sm text-gray-500">
              Bạn sẽ được chuyển hướng đến trang đăng nhập trong vài giây...
            </p>
            <button
              onClick={() => window.location.href = '/login'}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Đăng nhập ngay
            </button>
          </div>
        );

      case 'error':
        return (
          <div className="text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Xác thực thất bại
            </h2>
            <p className="text-gray-600 mb-6">
              {message}
            </p>
            <div className="space-y-4">
              <button
                onClick={() => window.location.reload()}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Thử lại
              </button>
              <button
                onClick={() => window.location.href = '/login'}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Quay lại đăng nhập
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {renderContent()}
        </div>

        {/* Email Support Section */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Không nhận được email?{' '}
            <button
              onClick={() => window.location.href = '/resend-verification'}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Gửi lại email
            </button>
          </p>
          <p className="mt-2 text-xs text-gray-400">
            Nếu bạn vẫn gặp vấn đề, vui lòng liên hệ{' '}
            <a href="mailto:support@example.com" className="text-blue-600 hover:text-blue-700">
              support@example.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}