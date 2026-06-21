const API_BASE_URL = 'https://codemaster-backend-20m.onrender.com/api';

// Helper to get stored token
const getToken = () => localStorage.getItem('codemaster_token');

// Helper to set token
const setToken = (token) => localStorage.setItem('codemaster_token', token);

// Helper to remove token
const removeToken = () => localStorage.removeItem('codemaster_token');

// Helper to get stored user
const getUser = () => {
  const user = localStorage.getItem('codemaster_user');
  return user ? JSON.parse(user) : null;
};

// Helper to set user
const setUser = (user) => localStorage.setItem('codemaster_user', JSON.stringify(user));

// Helper to remove user
const removeUser = () => localStorage.removeItem('codemaster_user');

// Generic fetch wrapper
const apiFetch = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    
    return data;
  } catch (error) {
    throw error;
  }
};

// Auth API
const authApi = {
  register: (name, email, password) => apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password })
  }),
  
  login: (email, password) => apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  }),
  
  getMe: () => apiFetch('/auth/me')
};

// Courses API
const coursesApi = {
  getAll: () => apiFetch('/courses'),
  getById: (id) => apiFetch(`/courses/${id}`),
  enroll: (id) => apiFetch(`/courses/${id}/enroll`, { method: 'POST' }),
  getEnrolled: () => apiFetch('/courses/user/enrolled'),
  completeLesson: (courseId, lessonId) => apiFetch(`/courses/${courseId}/lessons/${lessonId}/complete`, { method: 'PUT' })
};

// Users API
const usersApi = {
  updateProfile: (profileData) => apiFetch('/users/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData)
  }),
  updateActivity: (day, hours) => apiFetch('/users/activity', {
    method: 'PUT',
    body: JSON.stringify({ day, hours })
  })
};

// Quizzes API
const quizzesApi = {
  getAll: () => apiFetch('/quizzes'),
  getByCourseId: (courseId) => apiFetch(`/quizzes/course/${courseId}`)
};

// Notes API
const notesApi = {
  getAll: () => apiFetch('/notes'),
  getByLesson: (courseId, lessonId) => apiFetch(`/notes/course/${courseId}/lesson/${lessonId}`),
  save: (lessonId, courseId, content) => apiFetch('/notes', {
    method: 'POST',
    body: JSON.stringify({ lessonId, courseId, content })
  })
};
