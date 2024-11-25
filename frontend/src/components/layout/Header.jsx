/*
* Path: /frontend/src/components/layout/Header.jsx
*/

import {
    ChevronDown,
    Home,
    Info,
    LogOut,
    Menu,
    Phone,
    Search,
    Star,
    Tag,
    User
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log('Search query:', searchQuery);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo and Hamburger */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg md:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
            <a href="/" className="flex items-center space-x-2">
              <img src="/logo.png" alt="Logo" className="h-8" />
              <span className="font-bold text-xl hidden md:inline">EduOnline</span>
            </a>
          </div>

          {/* Search Bar */}
          <form 
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-xl mx-4"
          >
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm khóa học..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </form>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg"
            >
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <ChevronDown className="h-4 w-4" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
                <a
                  href="/profile"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <User className="h-4 w-4 mr-2" />
                  Thông tin cá nhân
                </a>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu - Mobile */}
        <div
          className={`fixed inset-0 bg-gray-800 bg-opacity-50 z-40 md:hidden transition-opacity duration-300 ${
            isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setIsMenuOpen(false)}
        >
          <div
            className={`fixed inset-y-0 left-0 w-64 bg-white transform transition-transform duration-300 ${
              isMenuOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-8">
                <img src="/logo.png" alt="Logo" className="h-8" />
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <Menu className="h-6 w-6" />
                </button>
              </div>

              <nav className="space-y-1">
                <a
                  href="/"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <Home className="h-4 w-4 mr-3" />
                  Trang chủ
                </a>
                <a
                  href="/featured"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <Star className="h-4 w-4 mr-3" />
                  Khóa học nổi bật
                </a>
                <a
                  href="/deals"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <Tag className="h-4 w-4 mr-3" />
                  Khóa học ưu đãi
                </a>
                <a
                  href="/about"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <Info className="h-4 w-4 mr-3" />
                  Giới thiệu
                </a>
                <a
                  href="/contact"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <Phone className="h-4 w-4 mr-3" />
                  Liên hệ
                </a>
              </nav>

              {/* Mobile Search */}
              <div className="mt-4">
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Tìm kiếm khóa học..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu - Desktop */}
        <nav className="hidden md:flex items-center justify-center space-x-6 mt-4">
          <a href="/" className="text-gray-700 hover:text-blue-600">
            Trang chủ
          </a>
          <a href="/featured" className="text-gray-700 hover:text-blue-600">
            Khóa học nổi bật
          </a>
          <a href="/deals" className="text-gray-700 hover:text-blue-600">
            Khóa học ưu đãi
          </a>
          <a href="/about" className="text-gray-700 hover:text-blue-600">
            Giới thiệu
          </a>
          <a href="/contact" className="text-gray-700 hover:text-blue-600">
            Liên hệ
          </a>
        </nav>
      </div>
    </header>
  );
}