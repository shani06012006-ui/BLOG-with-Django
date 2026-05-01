import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBlogs = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }
      
      console.log('Fetching blogs...');
      const response = await fetch('http://localhost:8000/api/blogs/', {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Blogs received:', data.length);
        setBlogs(data);
      } else if (response.status === 401) {
        window.location.href = '/login';
      } else {
        setError('Failed to fetch blogs');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  const deleteBlog = async (id) => {
    if (!window.confirm('Delete this blog?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/blogs/' + id + '/', {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });
      
      if (response.ok) {
        setBlogs(blogs.filter(blog => blog.id !== id));
        alert('Blog deleted successfully!');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete blog');
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="spinner">
        <div className="spinner-circle"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-message">{error}</div>
        <button onClick={() => window.location.reload()} className="btn-primary">Retry</button>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1>All Blogs</h1>
          <p className="blog-count">Total {blogs.length} blog(s)</p>
        </div>
        <Link to="/create" className="btn-primary">
          + Create New Blog
        </Link>
      </div>

      {blogs.length === 0 ? (
        <div className="empty-state">
          <p> No blogs yet. Create your first blog!</p>
          <Link to="/create" className="btn-primary">Create Blog</Link>
        </div>
      ) : (
        <div className="blogs-grid">
          {blogs.map((blog) => (
            <div key={blog.id} className="card">
              <div className="card-content">
                <h2 className="card-title">{blog.title}</h2>
                <div className="card-meta">
                  <span className="author-badge"> {blog.author?.username}</span>
                  <span className="date-badge">{formatDate(blog.created_at)}</span>
                </div>
                <p className="card-text">{blog.body?.substring(0, 150)}...</p>
                <div className="card-buttons">
                  <Link 
                    to={`/blogs/${blog.id}`} 
                    className="btn-success"
                    style={{ display: 'inline-block', textDecoration: 'none' }}
                  >
                     View
                  </Link>
                  <Link 
                    to={`/blogs/${blog.id}/edit`} 
                    className="btn-primary"
                    style={{ display: 'inline-block', textDecoration: 'none' }}
                  >
                     Edit
                  </Link>
                  <button 
                    onClick={() => deleteBlog(blog.id)} 
                    className="btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogList;
