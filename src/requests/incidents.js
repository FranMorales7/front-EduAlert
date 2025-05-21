import api from '@/api/axios';
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const getAllIncidents = async (token, signal = null) => {
  const response = await api.get(`${backendUrl}/incidents`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    signal,
  });

  return response.data;
};

export async function createIncident(data, token) {
  return api.post(`${backendUrl}/incidents`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}


export async function updateIncident(id, data, token) {
  return api.put(`${backendUrl}/incidents/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function deleteIncident(id, token, signal) {
  return api.delete(`${backendUrl}/incidents/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    signal,
  });
}

export async function fetchIncidentsByUser(userId, token, signal) {
  return api.get(`${backendUrl}/incidents/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    signal,
  });
}
