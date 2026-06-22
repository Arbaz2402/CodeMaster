const API_BASE_URL = 'https://codemaster-backend-2o0m.onrender.com/api';

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
  
  getMe: () => apiFetch('/auth/me'),
  
  confirmEmail: (token) => apiFetch('/auth/confirm-email', {
    method: 'POST',
    body: JSON.stringify({ token })
  }),
  
  resendConfirmation: () => apiFetch('/auth/resend-confirmation', {
    method: 'POST'
  }),
  
  forgotPassword: (email) => apiFetch('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email })
  }),
  
  resetPassword: (token, newPassword) => apiFetch('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, newPassword })
  })
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
  updateActivity: (day, hours, description) => apiFetch('/users/activity', {
    method: 'PUT',
    body: JSON.stringify({ day, hours, description })
  }),
  addRecentActivity: (type, description) => apiFetch('/users/activity/recent', {
    method: 'POST',
    body: JSON.stringify({ type, description })
  }),
  getSkills: () => apiFetch('/users/skills'),
  addSkill: (skill) => apiFetch('/users/skills', {
    method: 'POST',
    body: JSON.stringify({ skill })
  }),
  removeSkill: (skill) => apiFetch(`/users/skills/${skill}`, {
    method: 'DELETE'
  }),
  addAchievement: (title, icon, color) => apiFetch('/users/achievements', {
    method: 'POST',
    body: JSON.stringify({ title, icon, color })
  }),
  addCertificate: (courseId, courseTitle, certificateUrl) => apiFetch('/users/certificates', {
    method: 'POST',
    body: JSON.stringify({ courseId, courseTitle, certificateUrl })
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

// Playgrounds API
const playgroundsApi = {
  getAll: () => apiFetch('/playgrounds'),
  getById: (id) => apiFetch(`/playgrounds/${id}`),
  create: (projectData) => apiFetch('/playgrounds', {
    method: 'POST',
    body: JSON.stringify(projectData)
  }),
  update: (id, projectData) => apiFetch(`/playgrounds/${id}`, {
    method: 'PUT',
    body: JSON.stringify(projectData)
  }),
  delete: (id) => apiFetch(`/playgrounds/${id}`, { method: 'DELETE' })
};
