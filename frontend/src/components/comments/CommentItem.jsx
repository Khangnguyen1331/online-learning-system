import {
    Edit,
    Loader,
    MessageCircle,
    MoreVertical,
    Trash2
} from 'lucide-react';
import React, { useState } from 'react';

// Mock comment data for testing
const mockComment = {
  _id: '1',
  content: 'This is a test comment',
  user: {
    _id: '1',
    fullName: 'John Doe',
    avatar: '/default-avatar.png'
  },
  createdAt: new Date(),
  replies: [],
  courseId: '1',
  contentType: 'video',
  contentId: '1'
};

export default function CommentItem({ comment = mockComment, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment?.content || '');
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!comment) return null;

  // ... rest of the component code remains the same

  return (
    <div className="p-4">
      <div className="flex items-start space-x-3">
        <img
          src={comment.user?.avatar || '/default-avatar.png'}
          alt={comment.user?.fullName || 'User'}
          className="w-8 h-8 rounded-full"
        />
        
        <div className="flex-1">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-gray-900">
                  {comment.user?.fullName || 'Anonymous'}
                </h4>
                {isEditing ? (
                  <div className="mt-2">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 resize-none"
                      rows="3"
                    />
                    <div className="mt-2 flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-3 py-1 text-sm text-gray-600 hover:text-gray-700"
                      >
                        Hủy
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          onUpdate?.(comment);
                        }}
                        disabled={loading}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                      >
                        {loading ? (
                          <Loader className="h-4 w-4 animate-spin" />
                        ) : (
                          'Lưu'
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-700 mt-1">{comment.content}</p>
                )}
              </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-1 rounded-full hover:bg-gray-200"
                >
                  <MoreVertical className="h-4 w-4 text-gray-500" />
                </button>
                
                {showMenu && (
                  <div className="absolute right-0 mt-1 py-1 w-48 bg-white rounded-lg shadow-lg z-10">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(true);
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Chỉnh sửa
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete?.(comment._id)}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 flex items-center"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Xóa
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-2 flex items-center text-sm space-x-4">
            <button
              type="button"
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="text-gray-500 hover:text-gray-700 flex items-center"
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              Trả lời
            </button>
            <span className="text-gray-400">
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
          </div>

          {showReplyForm && (
            <div className="mt-3">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Viết phản hồi..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 resize-none"
                rows="2"
              />
              <div className="mt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    if (replyContent.trim()) {
                      onUpdate?.({
                        ...comment,
                        replies: [...(comment.replies || []), {
                          _id: Date.now().toString(),
                          content: replyContent,
                          user: {
                            _id: '1',
                            fullName: 'Current User',
                            avatar: '/default-avatar.png'
                          },
                          createdAt: new Date()
                        }]
                      });
                      setReplyContent('');
                      setShowReplyForm(false);
                    }
                  }}
                  disabled={loading || !replyContent.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader className="h-4 w-4 animate-spin" />
                  ) : (
                    'Gửi phản hồi'
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Hiển thị replies */}
          {comment.replies?.length > 0 && (
            <div className="mt-4 space-y-4 pl-4 border-l-2 border-gray-100">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply._id}
                  comment={reply}
                  onDelete={onDelete}
                  onUpdate={onUpdate}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}