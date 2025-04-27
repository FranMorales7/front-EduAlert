import axios from 'axios';

// Creamos una instancia personalizada de axios
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,  // Usamos la variable de entorno para la URL base
  withCredentials: true,  // Es imprescindible para que las cookies sean enviadas correctamente
});

export default api;
