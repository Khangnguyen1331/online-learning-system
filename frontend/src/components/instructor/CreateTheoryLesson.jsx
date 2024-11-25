/*
* Path: /frontend/src/components/instructor/CreateTheoryLesson.jsx
*/

import {
    Loader,
    Save
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

export default function CreateTheoryLesson() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [loading, setLoading] = useState(false);
  const [lesson, setLesson] = useState({
    courseId: '',
    chapter: '',
    title: '',
    content: ''
  });

  // Fetch danh sách khóa học của giảng viên
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('/api/instructor/courses', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };
    fetchCourses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/instructor/theory-lessons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(lesson)
      });

      if (!response.ok) {
        throw new Error('Không thể tạo bài giảng');
      }

      alert('Tạo bài giảng thành công!');
      // Reset form hoặc redirect
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const insertCodeBlock = (language) => {
    const textarea = document.getElementById('lessonContent');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const content = textarea.value;
    
    const codeBlock = `\n\`\`\`${language}\n${content.substring(start, end)}\n\`\`\`\n`;
    
    setLesson({
      ...lesson,
      content: content.substring(0, start) + codeBlock + content.substring(end)
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tạo bài giảng lý thuyết</h1>
        <p className="mt-1 text-sm text-gray-500">
          Soạn thảo nội dung bài giảng với Markdown và code snippets
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-xl shadow-lg p-6">
        {/* Chọn khóa học */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Khóa học
          </label>
          <select
            value={lesson.courseId}
            onChange={(e) => setLesson({ ...lesson, courseId: e.target.value })}
            className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Chọn khóa học</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>

        {/* Chọn chương */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chương
          </label>
          <input
            type="number"
            min="1"
            value={lesson.chapter}
            onChange={(e) => setLesson({ ...lesson, chapter: e.target.value })}
            className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Nhập số chương (VD: 1, 2, 3...)"
            required
          />
        </div>

        {/* Tiêu đề bài giảng */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tiêu đề bài giảng
          </label>
          <input
            type="text"
            value={lesson.title}
            onChange={(e) => setLesson({ ...lesson, title: e.target.value })}
            className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Nhập tiêu đề bài giảng"
            required
          />
        </div>

        {/* Code snippet toolbar */}
        <div className="border-b pb-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chèn code snippet
          </label>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => insertCodeBlock('javascript')}
              className="px-3 py-1 rounded bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
            >
              JavaScript
            </button>
            <button
              type="button"
              onClick={() => insertCodeBlock('python')}
              className="px-3 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200"
            >
              Python
            </button>
            <button
              type="button"
              onClick={() => insertCodeBlock('html')}
              className="px-3 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200"
            >
              HTML
            </button>
            <button
              type="button"
              onClick={() => insertCodeBlock('css')}
              className="px-3 py-1 rounded bg-purple-100 text-purple-700 hover:bg-purple-200"
            >
              CSS
            </button>
          </div>
        </div>

        {/* Nội dung bài giảng */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nội dung bài giảng
          </label>
          <textarea
            id="lessonContent"
            value={lesson.content}
            onChange={(e) => setLesson({ ...lesson, content: e.target.value })}
            className="w-full h-96 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 font-mono"
            placeholder={`Nhập nội dung bài giảng ở đây...

Ví dụ về code snippet:

\`\`\`javascript
function example() {
  console.log("Hello World!");
}
\`\`\`

Bạn có thể sử dụng các nút phía trên để chèn code block.`}
            required
          />
        </div>

        {/* Submit button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader className="animate-spin h-5 w-5 mr-2" />
                Đang lưu...
              </>
            ) : (
              <>
                <Save className="h-5 w-5 mr-2" />
                Lưu bài giảng
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}