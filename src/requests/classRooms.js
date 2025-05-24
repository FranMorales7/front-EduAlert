import axios from 'axios';
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const getAllClassRooms = async (token, signal = null) => {
  const response = await axios.get(`${backendUrl}/classRooms`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    signal,
  });

  return response;
};

export async function createClassRooms(data, token) {
  const response = await axios.post(`${backendUrl}/classRooms`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response; 
}

export async function updateClassRooms(id, data, token) {
  const response = await axios.put(`${backendUrl}/classRooms/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
}

export async function deleteClassRooms(id, token, signal = null) {
  const response = await axios.delete(`${backendUrl}/classRooms/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    signal,
  });

  return response;
}
