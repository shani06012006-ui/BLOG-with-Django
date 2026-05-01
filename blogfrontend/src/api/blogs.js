import { apiClient } from "./client";

export const getBlogs = async () => {
  const res = await apiClient("http://127.0.0.1:8000/api/blogs/");
  return res.json();
};

export const createBlog = async (data) => {
  const res = await apiClient("http://127.0.0.1:8000/api/blogs/", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updateBlog = async (id, data) => {
  const res = await apiClient(`http://127.0.0.1:8000/api/blogs/${id}/`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteBlog = async (id) => {
  const res = await apiClient(`http://127.0.0.1:8000/api/blogs/${id}/`, {
    method: "DELETE",
  });
  return res.json();
};