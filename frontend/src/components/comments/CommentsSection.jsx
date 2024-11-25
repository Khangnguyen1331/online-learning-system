/*
* Path: /frontend/src/components/comments/CommentsSection.jsx
*/

import {
    Loader,
    MessageSquare,
    Send
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

export default function CommentsSection({ 
  courseId,
  contentType, // 'video' hoặc 'theory'
  contentId 
}) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newComment, setNewComment] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [courseId, contentId, currentPage]);

  const fetchComments = async () => {
    try {
      const response = await fetch(
        `/api/comments?courseId=${courseId}&contentType=${contentType}&contentId=${contentId}&page=${currentPage}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Không thể tải bình luận');
      }

      setComments(currentPage === 1 ? data.comments : [...comments, ...data.comments]);
      setTotalPages(data.pagination.totalPages);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || submitting) return;

    setSubmitting(true);
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          courseId,
          contentType,
          contentId,
          content: newComment
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Không thể đăng bình luận');
      }

      setComments([data.comment, ...comments]);
      setNewComment('');
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h3 className="text-lg font-medium flex items-center">
          <MessageSquare className="h-5 w-5 mr-2" />
          Bình luận
        </h3>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="p-4 border-b">
        <div className="flex items-start space-x-3">
          <img
            src={localStorage.getItem('userAvatar') || '/default-avatar.png'}
            alt="Your avatar"
            className="w-8 h-8 rounded-full"
          />
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Thêm bình luận của bạn..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows="3"
            />
            {error && (
              <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={submitting || !newComment.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <Loader className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="divide-y">
        {loading && currentPage === 1 ? (
          <div className="p-8 text-center">
            <Loader className="h-8 w-8 animate-spin mx-auto text-blue-500" />
            <p className="mt-2 text-gray-500">Đang tải bình luận...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
          </div>
        ) : (
          <>
            {comments.map((comment) => (
              <CommentItem 
                key={comment._id} 
                comment={comment}
                onDelete={() => {
                  setComments(comments.filter(c => c._id !== comment._id));
                }}
                onUpdate={(updatedComment) => {
                  setComments(comments.map(c => 
                    c._id === updatedComment._id ? updatedComment : c
                  ));
                }}
              />
            ))}

            {/* Load More Button */}
            {currentPage < totalPages && (
              <div className="p-4 text-center">
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={loading}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  {loading ? (
                    <Loader className="h-5 w-5 animate-spin mx-auto" />
                  ) : (
                    'Xem thêm bình luận'
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}