import axios from 'axios';
import config from './config';

const API = axios.create({
  baseURL: config.API_URL,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getCategories = () => API.get('/questions/categories');
export const getQuestionsByCategory = (category) => API.get(`/questions/${category}`);
export const submitAnswer = (data) => API.post('/interview/submit', data);
export const getUserResults = (userId) => API.get(`/interview/results/${userId}`);

export default API;