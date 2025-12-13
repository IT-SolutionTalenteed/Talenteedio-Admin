import axios from 'axios';
import { useAuthStore } from '@/views/auth-module/stores/auth.store';

const apiUrl = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use((config) => {
  // Récupérer le token depuis localStorage directement
  let authData = null;
  try {
    const authString = localStorage.getItem('auth');
    if (authString) {
      authData = JSON.parse(authString);
    }
  } catch (error) {
    console.error('Error parsing auth data:', error);
  }
  
  if (authData && authData.token) {
    config.headers.Authorization = `Bearer ${authData.token}`;
  }
  
  return config;
});

// Intercepteur pour gérer les erreurs d'authentification
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Nettoyer localStorage directement
      localStorage.removeItem('auth');
      window.location.href = import.meta.env.VITE_HOST_URL + '/authentication/sign-in';
    }
    
    return Promise.reject(error);
  }
);

export default api;