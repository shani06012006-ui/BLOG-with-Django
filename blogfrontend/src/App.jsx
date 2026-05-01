import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BlogProvider } from './context/BlogContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import axios from 'axios';


const BlogList = lazy(() => import('./pages/BlogList'));
const BlogDetail = lazy(() => import('./pages/BlogDetail'));
const CreateBlog = lazy(() => import('./pages/CreateBlog'));
const EditBlog = lazy(() => import('./pages/EditBlog'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));

function App() {
  return (
    <Router>
      <AuthProvider>
        <BlogProvider>
          <div className="app">
            <Navbar />
            <Suspense fallback={<div className="spinner"><div className="spinner-circle"></div></div>}>
              <Routes>
                <Route path="/" element={<Navigate to="/blogs" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/blogs" element={<ProtectedRoute><BlogList /></ProtectedRoute>} />
                <Route path="/blogs/:id" element={<ProtectedRoute><BlogDetail /></ProtectedRoute>} />
                <Route path="/create" element={<ProtectedRoute><CreateBlog /></ProtectedRoute>} />
                <Route path="/edit/:id" element={<ProtectedRoute><EditBlog /></ProtectedRoute>} />
              </Routes>
            </Suspense>
          </div>
        </BlogProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
