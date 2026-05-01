import React, { createContext, useContext, useReducer, useCallback } from 'react';

const BlogContext = createContext();

const blogReducer = (state, action) => {
  switch (action.type) {
    case 'SET_BLOGS':
      return { ...state, blogs: action.payload, loading: false };
    case 'ADD_BLOG':
      return { ...state, blogs: [action.payload, ...state.blogs] };
    case 'UPDATE_BLOG':
      return {
        ...state,
        blogs: state.blogs.map(blog => blog.id === action.payload.id ? action.payload : blog),
      };
    case 'DELETE_BLOG':
      return { ...state, blogs: state.blogs.filter(blog => blog.id !== action.payload) };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

export const BlogProvider = ({ children }) => {
  const [state, dispatch] = useReducer(blogReducer, { 
    blogs: [], 
    loading: false, 
    error: null 
  });

  const fetchBlogs = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }
      
      const response = await fetch('http://localhost:8000/api/blogs/', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      
      const data = await response.json();
      dispatch({ type: 'SET_BLOGS', payload: data });
    } catch (error) {
      console.error('Fetch blogs error:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const addBlog = async (blogData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/blogs/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(blogData)
      });
      
      const data = await response.json();
      if (response.ok) {
        dispatch({ type: 'ADD_BLOG', payload: data });
        return data;
      } else {
        throw new Error(data.detail || 'Failed to create blog');
      }
    } catch (error) {
      console.error('Add blog error:', error);
      throw error;
    }
  };

  const updateBlog = async (id, blogData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/blogs/' + id + '/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(blogData)
      });
      
      const data = await response.json();
      if (response.ok) {
        dispatch({ type: 'UPDATE_BLOG', payload: data });
        return data;
      } else {
        throw new Error(data.detail || 'Failed to update blog');
      }
    } catch (error) {
      console.error('Update blog error:', error);
      throw error;
    }
  };

  const deleteBlog = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/blogs/' + id + '/', {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + token }
      });
      
      if (response.ok) {
        dispatch({ type: 'DELETE_BLOG', payload: id });
      } else {
        throw new Error('Failed to delete blog');
      }
    } catch (error) {
      console.error('Delete blog error:', error);
      throw error;
    }
  };

  return (
    <BlogContext.Provider value={{
      blogs: state.blogs,
      loading: state.loading,
      error: state.error,
      addBlog,
      updateBlog,
      deleteBlog,
      fetchBlogs,
    }}>
      {children}
    </BlogContext.Provider>
  );
};

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (!context) throw new Error('useBlog must be used within BlogProvider');
  return context;
};
