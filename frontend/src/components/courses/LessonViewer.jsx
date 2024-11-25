/*
* Path: /frontend/src/components/courses/LessonViewer.jsx
*/

import {
    ChevronLeft,
    ChevronRight,
    FileText,
    Menu,
    Play,
    X
} from 'lucide-react';
import React, { useState } from 'react';

export default function LessonViewer() {
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeType, setActiveType] = useState('video'); // 'video' or 'theory'
  const [currentLesson, setCurrentLesson] = useState(0);

  // Mock data
  const course = {
    title: "NodeJS Premium Course",
    lessons: [
      {
        id: 1,
        title: "Giới thiệu NodeJS",
        videoUrl: "https://example.com/video1.mp4",
        theory: `# Giới thiệu về NodeJS

NodeJS là một runtime environment cho JavaScript, cho phép bạn chạy mã JavaScript ở phía server.

## Ưu điểm chính:

**1. Non-blocking I/O**
- Xử lý bất đồng bộ hiệu quả
- Tối ưu hiệu suất

**2. NPM - Node Package Manager**
- Hệ sinh thái package lớn nhất thế giới
- Dễ dàng quản lý dependencies

## Code ví dụ:

\`\`\`javascript
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World!');
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});
\`\`\`

## Tài liệu tham khảo:
- [NodeJS Official Documentation](https://nodejs.org/docs)
- [NPM Registry](https://www.npmjs.com)
        `
      },
      {
        id: 2,
        title: "Cài đặt môi trường",
        videoUrl: "https://example.com/video2.mp4",
        theory: "# Cài đặt NodeJS\n\n**Bước 1:** Download NodeJS..."
      }
    ]
  };

  const handleNextLesson = () => {
    if (currentLesson < course.lessons.length - 1) {
      setCurrentLesson(currentLesson + 1);
    }
  };

  const handlePrevLesson = () => {
    if (currentLesson > 0) {
      setCurrentLesson(currentLesson - 1);
    }
  };

  const renderTheory = (content) => {
    return (
      <div 
        className="prose prose-slate max-w-none"
        dangerouslySetInnerHTML={{ 
          __html: content
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
            .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
            .replace(/^# (.*?)$/gm, '<h1 class="text-3xl font-bold my-4">$1</h1>')
            .replace(/^## (.*?)$/gm, '<h2 class="text-2xl font-bold my-3">$1</h2>')
            .replace(/^### (.*?)$/gm, '<h3 class="text-xl font-bold my-2">$1</h3>')
            .replace(/^- (.*?)$/gm, '<li class="ml-4">$1</li>')
        }} 
      />
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div 
        className={`
          fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          ${showSidebar ? 'translate-x-0' : '-translate-x-full'}
          md:relative md:translate-x-0
        `}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="font-bold text-lg">Nội dung khóa học</h2>
          <button 
            onClick={() => setShowSidebar(false)}
            className="md:hidden"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="overflow-y-auto h-[calc(100vh-64px)]">
          {course.lessons.map((lesson, index) => (
            <button
              key={lesson.id}
              onClick={() => setCurrentLesson(index)}
              className={`w-full p-4 text-left hover:bg-gray-50 border-b ${
                currentLesson === index ? 'bg-blue-50 text-blue-600' : ''
              }`}
            >
              <div className="flex items-center">
                {activeType === 'video' ? (
                  <Play className="h-4 w-4 mr-2" />
                ) : (
                  <FileText className="h-4 w-4 mr-2" />
                )}
                <span>{lesson.title}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="px-4 py-3 flex items-center justify-between">
            <button 
              onClick={() => setShowSidebar(true)}
              className="md:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <div className="flex space-x-1">
              <button
                onClick={() => setActiveType('video')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  activeType === 'video'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Play className="h-4 w-4 inline mr-2" />
                Video
              </button>
              <button
                onClick={() => setActiveType('theory')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  activeType === 'theory'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <FileText className="h-4 w-4 inline mr-2" />
                Lý thuyết
              </button>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={handlePrevLesson}
                disabled={currentLesson === 0}
                className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={handleNextLesson}
                disabled={currentLesson === course.lessons.length - 1}
                className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">
              {course.lessons[currentLesson].title}
            </h1>

            {activeType === 'video' ? (
              <div className="aspect-w-16 aspect-h-9 bg-black rounded-lg overflow-hidden mb-6">
                <video
                  controls
                  className="w-full h-full object-cover"
                  src={course.lessons[currentLesson].videoUrl}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-6">
                {renderTheory(course.lessons[currentLesson].theory)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}