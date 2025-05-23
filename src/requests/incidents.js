import axios from 'axios';
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const getAllIncidents = async (token, signal = null) => {
  const response = await axios.get(`${backendUrl}/incidents`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    signal,
  });

  return response;
};

export async function createIncident(data, token) {
  const response = await axios.post(`${backendUrl}/incidents`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response; 
}

export async function updateIncident(id, data, token) {
  const response = await axios.put(`${backendUrl}/incidents/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
}

export async function deleteIncident(id, token, signal = null) {
  const response = await axios.delete(`${backendUrl}/incidents/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    signal,
  });

  return response;
}

export async function fetchIncidentsByUser(userId, token, signal = null) {
  
  const response = await axios.get(`${backendUrl}/incidents/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    signal,
  });

  return response;
}
