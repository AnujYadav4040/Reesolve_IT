import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api',
});

// Auto-attach token from localStorage
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('resolveIt_user') || 'null');
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Auth
export const loginUser = (data) => API.post('/auth/login', data);
export const registerUser = (data) => API.post('/auth/register', data);
export const getMe = () => API.get('/auth/me');

// Tickets
export const createTicket = (data) => API.post('/tickets', data);
export const getTickets = (params) => API.get('/tickets', { params });
export const getTicketById = (id) => API.get(`/tickets/${id}`);
export const getSuggestions = (query) => API.get('/tickets/suggestions', { params: { query } });
export const updateTicketStatus = (id, data) => API.put(`/tickets/${id}/status`, data);
export const assignTicket = (id, data) => API.put(`/tickets/${id}/assign`, data);
export const updateTicketPriority = (id, data) => API.put(`/tickets/${id}/priority`, data);
export const predictPriority = (data) => API.post('/tickets/predict-priority', data);

// Admin
export const getAdminDashboard = () => API.get('/admin/dashboard');
export const autoAssignTicket = (ticketId) => API.post(`/admin/auto-assign/${ticketId}`);
export const getUsers = () => API.get('/users');
export const createUser = (data) => API.post('/users', data);
export const deleteUser = (id) => API.delete(`/users/${id}`);
export const toggleUser = (id) => API.put(`/users/${id}/toggle`);

// Technicians
export const getTechnicians = () => API.get('/technicians');
export const getAvailableTechnicians = () => API.get('/technicians/available');
export const getMyTechnicianProfile = () => API.get('/technicians/me');
export const updateAvailability = (data) => API.put('/technicians/availability', data);
export const createTechnician = (data) => API.post('/technicians', data);
export const deleteTechnician = (id) => API.delete(`/technicians/${id}`);

// Feedback
export const submitFeedback = (data) => API.post('/feedback', data);
export const getAllFeedback = () => API.get('/feedback');

// Analytics
export const getTicketsByStatus = () => API.get('/analytics/tickets-by-status');
export const getTicketsByCategory = () => API.get('/analytics/tickets-by-category');
export const getTicketsByPriority = () => API.get('/analytics/tickets-by-priority');
export const getTicketsTrend = () => API.get('/analytics/tickets-trend');
export const getTechnicianPerformance = () => API.get('/analytics/technician-performance');
export const getAvgRating = () => API.get('/analytics/avg-rating');

// Chatbot
export const sendChatMessage = (data) => API.post('/chatbot', data);

export default API;
