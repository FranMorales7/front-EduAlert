import axios from 'axios';
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const getAllTeachers = async (token, signal = null) => {
  const response = await axios.get(`${backendUrl}/teachers`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    signal,
  });

  return response;
};

export async function createTeacher(data, token) {
  const response = await axios.post(`${backendUrl}/users`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response; 
}

export async function updateTeacher(id, data, token) {
  const response = await axios.put(`${backendUrl}/teachers/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
}

export async function deleteTeacher(id, token, signal = null) {
  const response = await axios.delete(`${backendUrl}/teachers/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    signal,
  });

  return response;
}
