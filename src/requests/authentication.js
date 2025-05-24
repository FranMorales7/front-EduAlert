import axios from 'axios';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const updatePassword = async (data, token, signal = null) => {
  const response = await axios.patch(
    `${backendUrl}/user/password`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      signal,
    }
  );

  return response;
};