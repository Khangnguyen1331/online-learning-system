import React, { useState } from 'react';

export default function Login() {
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
    remember: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Đăng nhập thất bại');
      }

      // Lưu token
      localStorage.setItem('token', data.token);

      // Chuyển hướng dựa trên role
      switch (data.role) {
        case 'admin':
          window.location.href = '/admin/dashboard';
          break;
        case 'instructor':
          window.location.href = data.requireProfileCompletion ? 
            '/instructor/complete-profile' : '/instructor/dashboard';
          break;
        case 'student':
          window.location.href = '/home';
          break;
        default:
          window.location.href = '/';
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-8">
          Đăng nhập
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tên đăng nhập
            </label>
            <input
              type="text"
              value={loginData.username}
              onChange={(e) => setLoginData({
                ...loginData,
                username: e.target.value
              })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mật khẩu
            </label>
            <input
              type="password"
              value={loginData.password}
              onChange={(e) => setLoginData({
                ...loginData,
                password: e.target.value
              })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={loginData.remember}
                onChange={(e) => setLoginData({
                  ...loginData,
                  remember: e.target.checked
                })}
                className="h-4 w-4 text-blue-600 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Ghi nhớ đăng nhập
              </label>
            </div>

            <a
              href="/forgot-password"
              className="text-sm text-blue-600 hover:underline"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = '/forgot-password';
              }}
            >
              Quên mật khẩu?
            </a>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Đang xử lý...' : 'Đăng nhập'}
            </button>
          </div>

          <div className="text-center">
            <span className="text-sm text-gray-600">
              Chưa có tài khoản?{' '}
              <a
                href="/register"
                className="text-blue-600 hover:underline"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = '/register';
                }}
              >
                Đăng ký ngay
              </a>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}