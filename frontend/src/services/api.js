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
export const getDailyChallenge = () => API.get('/questions/daily');
export const getQuestionsByCategory = (category, difficulty) =>
  API.get(`/questions/${category}?difficulty=${difficulty || 'all'}`);
export const getMockQuestions = (count) =>
  API.get(`/questions/mock/random?count=${count || 10}`);
export const submitAnswer = (data) => API.post('/interview/submit', data);
export const getUserResults = (userId) => API.get(`/interview/results/${userId}`);
export const getLeaderboard = () => API.get('/interview/leaderboard');

export default API;