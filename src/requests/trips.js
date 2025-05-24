import axios from 'axios';
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const getAllTrips = async (token, signal = null) => {
  const response = await axios.get(`${backendUrl}/trips`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    signal,
  });

  return response;
};

export async function createTrip(data, token) {
  return axios.post(`${backendUrl}/trips`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}


export async function updateTrip(id, data, token) {
  return axios.put(`${backendUrl}/trips/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function deleteTrip(id, token, signal) {
  return axios.delete(`${backendUrl}/trips/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    signal,
  });
}

export async function fetchTripsByUser(userId, token, signal) {
  return axios.get(`${backendUrl}/trips/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    signal,
  });
}
