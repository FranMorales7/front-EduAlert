// src/services/authService.js
import axios from 'axios';

export async function login(email, password) {
    // Usamos la variable de entorno para la URL base
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL.replace(/\/$/, '')}/login`;
    try {
        const response = await axios.post(url, {
            email,
            password,
        }, {
            headers: {
                Accept: 'application/json',
              },
            withCredentials: true, // ⬅️ Importante para Sanctum (envía cookies)
        });

        return response.data; // Devuelve la respuesta (user, role, etc.)
    } catch (error) {
        throw error.response.data; // Lanza el error para manejarlo en el componente
    }
}
