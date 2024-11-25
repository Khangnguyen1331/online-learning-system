/*
* Path: /frontend/src/components/layout/Footer.jsx
*/

import {
    ArrowRight,
    Facebook,
    Instagram,
    Mail,
    MapPin,
    Phone,
    Youtube
} from 'lucide-react';
import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center mb-4">
              <img src="/logo-white.png" alt="Logo" className="h-8 mr-2" />
              <span className="text-xl font-bold text-white">EduOnline</span>
            </div>
            <p className="text-sm mb-4">
              Nền tảng học trực tuyến hàng đầu với hơn 1000+ khóa học từ các giảng viên uy tín.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-white">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-white">
                <Youtube className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-white">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Khám phá</h3>
            <ul className="space-y-2">
              <li>
                <a href="/courses" className="hover:text-white flex items-center">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Tất cả khóa học
                </a>
              </li>
              <li>
                <a href="/premium" className="hover:text-white flex items-center">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Khóa học Premium
                </a>
              </li>
              <li>
                <a href="/instructors" className="hover:text-white flex items-center">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Giảng viên
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-white flex items-center">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Về chúng tôi
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-white flex items-center">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Liên hệ
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Danh mục</h3>
            <ul className="space-y-2">
              <li>
                <a href="/category/web-development" className="hover:text-white">
                  Lập trình Web
                </a>
              </li>
              <li>
                <a href="/category/mobile-development" className="hover:text-white">
                  Lập trình Mobile
                </a>
              </li>
              <li>
                <a href="/category/frontend" className="hover:text-white">
                  Frontend Development
                </a>
              </li>
              <li>
                <a href="/category/backend" className="hover:text-white">
                  Backend Development
                </a>
              </li>
              <li>
                <a href="/category/database" className="hover:text-white">
                  Database
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Liên hệ</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 mt-1" />
                <p>123 Đường ABC, Quận XYZ<br />TP. Hồ Chí Minh, Việt Nam</p>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-3" />
                <p>+84 123 456 789</p>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 mr-3" />
                <p>support@eduonline.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">
              © 2024 EduOnline. Tất cả quyền được bảo lưu.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="/privacy" className="text-sm hover:text-white">
                Chính sách bảo mật
              </a>
              <a href="/terms" className="text-sm hover:text-white">
                Điều khoản sử dụng
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}