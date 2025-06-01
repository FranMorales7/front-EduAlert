// src/api/auth/[...nextauth].js
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_IMAGE_URL}login`,
            {
              email: credentials.email,
              password: credentials.password,
            },
            {
              headers: {
                Accept: 'application/json',
              },
               withCredentials: true,
            }
          );
          const user = res.data.user;
          const token = res.data.token;

          if (res.status === 200 && user && token) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              is_admin: user.is_admin,
              accessToken: token,
            };
          }

          return null;
        } catch (err) {
          console.error('Error en autorización', err.response?.data || err.message);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.is_admin = user.is_admin;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.is_admin = token.is_admin;
      session.accessToken = token.accessToken;
      return session;
    },
  },
  pages: {
    signIn: '/not_logged/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
