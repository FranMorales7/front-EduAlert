// src/services/authService.js
import axios from 'axios';

export async function login(email, password) {
    // Usamos la variable de entorno para la URL base
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    try {
        const response = await axios.post(`${backendUrl}/login`, {
            email,
            password,
        });

        return response.data; // Devuelve la respuesta (user, role, etc.)
    } catch (error) {
        throw error.response.data; // Lanza el error para manejarlo en el componente
    }
}
