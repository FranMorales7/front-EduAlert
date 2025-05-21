import api from '@/api/axios';
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const getAllTrips = async (token, signal = null) => {
  const response = await api.get(`${backendUrl}/trips`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    signal,
  });

  return response.data;
};

export async function createTrip(data, token) {
  return api.post(`${backendUrl}/trips`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}


export async function updateTrip(id, data, token) {
  return api.put(`${backendUrl}/trips/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function deleteTrip(id, token, signal) {
  return api.delete(`${backendUrl}/trips/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    signal,
  });
}

export async function fetchTripsByUser(userId, token, signal) {
  return api.get(`${backendUrl}/trips/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    signal,
  });
}
