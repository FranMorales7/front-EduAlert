import axios from 'axios';
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const getAllLessons = async (token, signal = null) => {
  const response = await axios.get(`${backendUrl}/lessons`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    signal,
  });

  return response;
};

export async function createLesson(data, token) {
  const response = await axios.post(`${backendUrl}/lessons`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response; 
}

export async function updateLesson(id, data, token) {
  const response = await axios.put(`${backendUrl}/lessons/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
}

export async function deleteLesson(id, token, signal = null) {
  const response = await axios.delete(`${backendUrl}/lessons/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    signal,
  });

  return response;
}
