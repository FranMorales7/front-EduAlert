import axios from 'axios';

// Creamos una instancia personalizada de axios
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,  // Usamos la variable de entorno para la URL base
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;