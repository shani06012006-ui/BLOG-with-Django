import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';

const CreateBlog = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { addBlog } = useBlog();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !body.trim()) {
      setError('Please fill in both title and content');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await addBlog({ title, body });
      navigate('/blogs');
    } catch (err) {
      setError(err.message || 'Failed to create blog');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <Link to="/blogs" className="back-link">
          ← Back to blogs
        </Link>
        <h1 className="form-title">Create New Blog Post</h1>
        <p className="form-subtitle">Share your thoughts with the world</p>

        {error && (
          <div className="error-message">
             {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              Blog Title <span className="required">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
              required
              placeholder="Enter an amazing title..."
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Blog Content <span className="required">*</span>
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows="10"
              className="form-textarea"
              required
              placeholder="Write your blog content here..."
              disabled={loading}
            />
            <div className="char-count">
              {body.length} characters
            </div>
          </div>

          <div className="form-buttons">
            <button 
              type="submit" 
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Publishing...' : 'Publish Blog'}
            </button>
            <button 
              type="button" 
              onClick={() => navigate('/blogs')} 
              className="btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBlog;
