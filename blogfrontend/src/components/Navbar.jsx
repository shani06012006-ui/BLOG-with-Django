import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span></span>
          <span>BlogApp</span>
        </Link>
        
        <div className="navbar-links">
          {user && (
            <Link to="/blogs" className="nav-link">
               Blogs
            </Link>
          )}
          
          {user ? (
            <>
              <Link to="/create" className="btn-write">
                 Write
              </Link>
              <div className="user-info">
                 <span className="username">{user.username}</span>
                <button onClick={handleLogout} className="btn-logout">
                   Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-login">
                 Login
              </Link>
              <Link to="/register" className="btn-register">
                 Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
