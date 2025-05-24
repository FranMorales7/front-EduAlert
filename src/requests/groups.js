import axios from 'axios';
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const getAllGroups = async (token, signal = null) => {
  const response = await axios.get(`${backendUrl}/groups`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    signal,
  });

  return response;
};

export async function createGroup(data, token) {
  const response = await axios.post(`${backendUrl}/groups`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response; 
}

export async function updateGroup(id, data, token) {
  const response = await axios.put(`${backendUrl}/groups/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
}

export async function deleteGroup(id, token, signal = null) {
  const response = await axios.delete(`${backendUrl}/groups/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    signal,
  });

  return response;
}
