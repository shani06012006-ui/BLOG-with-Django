import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { blogs, updateBlog, fetchBlogs } = useBlog();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (blogs.length === 0) {
      fetchBlogs();
    } else {
      const blog = blogs.find(b => b.id === parseInt(id));
      if (blog) {
        setTitle(blog.title);
        setBody(blog.body);
      }
    }
  }, [id, blogs, fetchBlogs]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !body.trim()) {
      setError('Please fill in both title and content');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await updateBlog(id, { title, body });
      navigate('/blogs/' + id);
    } catch (error) {
      console.error('Error updating blog:', error);
      setError(error.response?.data?.message || 'Failed to update blog. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <div className="form-header">
          <Link to={'/blogs/' + id} className="back-link">
            ← Back to blog
          </Link>
          <h1 className="form-title">Edit Blog Post</h1>
          <p className="form-subtitle">Update your blog content</p>
        </div>

        {error && (
          <div className="error-message">
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Content</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows="12"
              className="form-textarea"
              required
              disabled={loading}
            />
          </div>

          <div className="form-buttons">
            <button 
              type="submit" 
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : '💾 Save Changes'}
            </button>
            <button 
              type="button" 
              onClick={() => navigate('/blogs/' + id)} 
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

export default EditBlog;
