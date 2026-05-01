import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8000/api/blogs/' + id + '/', {
          headers: { 'Authorization': 'Bearer ' + token }
        });
        
        if (response.ok) {
          const data = await response.json();
          setBlog(data);
        } else {
          setError('Blog not found');
        }
      } catch (err) {
        setError('Error fetching blog');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlog();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this blog?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:8000/api/blogs/' + id + '/', {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + token }
      });
      navigate('/blogs');
    } catch (err) {
      alert('Failed to delete');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) return <div className="spinner"><div className="spinner-circle"></div></div>;
  if (error) return <div className="container"><div className="error-message">{error}</div></div>;
  if (!blog) return <div className="container"><div className="error-message">Blog not found</div></div>;

  return (
    <div className="container">
      <div className="blog-detail">
        <div className="blog-detail-content">
          <Link to="/blogs" className="back-link">← Back to all blogs</Link>
          <h1 className="blog-detail-title">{blog.title}</h1>
          <div className="blog-detail-meta">
            <span className="author-badge">✍️ Author: {blog.author?.username}</span>
            <span className="date-badge">📅 Created: {formatDate(blog.created_at)}</span>
          </div>
          <div className="blog-detail-body">{blog.body}</div>
          <div className="blog-detail-actions">
            <Link to={'/edit/' + blog.id} className="btn-primary">✏️ Edit Post</Link>
            <button onClick={handleDelete} className="btn-danger">🗑️ Delete Post</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
