// src/api/auth/[...nextauth].js
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
      try {
        const params = new URLSearchParams();
        params.append('email', credentials.email);
        params.append('password', credentials.password);

        const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/login`, params, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
          },
    });

    const user = res.data.user;

    if (user && res.data.token) {
      return {
        ...user,
        token: res.data.token,
      };
    }

    return null;
  } catch (err) {
    console.error('Error en autorización', err?.response?.data || err);
    return null;
  }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.accessToken = user.token;
        token.is_admin = user.is_admin;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.accessToken = token.accessToken;
      session.user.is_admin = token.is_admin;
      return session;
    },
  },
  pages: {
    signIn: '/not_logged/login',
  },
};

export default NextAuth(authOptions);
