/*
* Path: /frontend/src/components/home/BannerSlider.jsx
*/

import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useEffect, useState } from 'react';

export default function BannerSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Mock data cho banners
  const banners = [
    {
      id: 1,
      imageUrl: '/api/placeholder/1920/600',
      title: 'Học lập trình từ zero đến hero',
      description: 'Khám phá hơn 100+ khóa học với những giảng viên hàng đầu',
      buttonText: 'Khám phá ngay',
      buttonLink: '/courses'
    },
    {
      id: 2,
      imageUrl: '/api/placeholder/1920/600',
      title: 'Khóa học Premium giảm giá 50%',
      description: 'Cơ hội cuối cùng để nâng cấp kiến thức của bạn',
      buttonText: 'Xem ưu đãi',
      buttonLink: '/premium'
    },
    {
      id: 3,
      imageUrl: '/api/placeholder/1920/600',
      title: 'Học NodeJS và React từ cơ bản đến nâng cao',
      description: 'Xây dựng ứng dụng web fullstack trong 3 tháng',
      buttonText: 'Bắt đầu học',
      buttonLink: '/courses/web-development'
    },
    {
      id: 4,
      imageUrl: '/api/placeholder/1920/600',
      title: 'Cộng đồng học tập sôi động',
      description: 'Kết nối với hơn 10,000 học viên trên khắp cả nước',
      buttonText: 'Tham gia ngay',
      buttonLink: '/community'
    }
  ];

  // Auto play slider
  useEffect(() => {
    let interval;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
      }, 5000); // Change slide every 5 seconds
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, banners.length]);

  const nextSlide = () => {
    setCurrentSlide(currentSlide === banners.length - 1 ? 0 : currentSlide + 1);
  };

  const prevSlide = () => {
    setCurrentSlide(currentSlide === 0 ? banners.length - 1 : currentSlide - 1);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div 
      className="relative h-[400px] md:h-[500px] lg:h-[600px] w-full overflow-hidden"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Slides */}
      <div 
        className="h-full transition-transform duration-500 ease-out flex"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {banners.map((banner) => (
          <div 
            key={banner.id}
            className="h-full w-full flex-shrink-0 relative"
          >
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 bg-black/30"></div>
            <img
              src={banner.imageUrl}
              alt={banner.title}
              className="h-full w-full object-cover"
            />

            {/* Content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white px-4 max-w-4xl">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 animate-fadeIn">
                  {banner.title}
                </h2>
                <p className="text-lg md:text-xl mb-8 animate-fadeIn animation-delay-300">
                  {banner.description}
                </p>
                <a
                  href={banner.buttonLink}
                  className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors animate-fadeIn animation-delay-600"
                >
                  {banner.buttonText}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/30 hover:bg-white/50 transition-colors"
      >
        <ChevronLeft className="h-6 w-6 text-white" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/30 hover:bg-white/50 transition-colors"
      >
        <ChevronRight className="h-6 w-6 text-white" />
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              currentSlide === index ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-gray-900/50 to-transparent"></div>
    </div>
  );
}