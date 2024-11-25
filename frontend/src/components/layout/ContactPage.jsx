/*
* Path: /frontend/src/components/pages/ContactPage.jsx
*/

import { Loader, Mail, MapPin, Phone, Send } from 'lucide-react';
import React, { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Add API call here
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <div className="bg-white">
      {/* Contact Info */}
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-12">Liên hệ với chúng tôi</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <Phone className="h-8 w-8 mx-auto mb-4" />
                  <p className="font-medium">Điện thoại</p>
                  <p>+84 123 456 789</p>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <Mail className="h-8 w-8 mx-auto mb-4" />
                  <p className="font-medium">Email</p>
                  <p>support@eduonline.com</p>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-8 w-8 mx-auto mb-4" />
                  <p className="font-medium">Địa chỉ</p>
                  <p>123 ABC, Quận 1, TP.HCM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tiêu đề</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Nội dung</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {loading ? (
                    <Loader className="animate-spin h-5 w-5" />
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      Gửi tin nhắn
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="h-96 bg-gray-200">
        {/* Add Google Map or map iframe here */}
        <div className="w-full h-full flex items-center justify-center text-gray-500">
          Map placeholder
        </div>
      </div>
    </div>
  );
}
