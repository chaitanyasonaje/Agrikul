import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import dbConnect from './db';
import User from '@/models/User';
import { getServerSession as getNextAuthServerSession } from 'next-auth/next';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        await dbConnect();
        
        // Find user by email with password included
        const user = await User.findOne({ email: credentials.email }).select('+password');
        
        if (!user) {
          throw new Error('No user found with this email');
        }
        
        // Compare passwords
        const isPasswordValid = await compare(credentials.password, user.password);
        
        if (!isPasswordValid) {
          throw new Error('Invalid password');
        }
        
        // Return user without password
        return {
          id: user._id ? user._id.toString() : '',
          name: user.name,
          email: user.email,
          userType: user.userType,
          image: user.profileImage || null,
        };
      }
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.userType = user.userType;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.userType = token.userType;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
    signOut: '/',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

// Function to get session data on the server
export async function getServerSession() {
  return await getNextAuthServerSession(authOptions);
}

// Types
declare module 'next-auth' {
  interface User {
    id: string;
    userType: 'farmer' | 'buyer';
  }
  
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      userType: 'farmer' | 'buyer';
      image?: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    userType: 'farmer' | 'buyer';
  }
} 