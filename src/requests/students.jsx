import axios from 'axios';
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const getAllStudents = async (token, signal = null) => {
  const response = await axios.get(`${backendUrl}/students`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    signal,
  });

  return response;
};

export async function createStudent(data, token) {
  const response = await axios.post(`${backendUrl}/students`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response; 
}

export async function updateStudent(id, data, token) {
  const response = await axios.put(`${backendUrl}/students/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
}

export async function deleteStudent(id, token, signal = null) {
  const response = await axios.delete(`${backendUrl}/students/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    signal,
  });

  return response;
}

export async function fetchIncidentsByUser(userId, token, signal = null) {
  
  const response = await axios.get(`${backendUrl}/students/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    signal,
  });

  return response;
}
