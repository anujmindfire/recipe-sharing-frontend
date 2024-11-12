import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { apiService } from './service';
import constant from '../utils/constant';

declare module 'next-auth' {
    interface User {
        accessToken: string;
        refreshToken: string;
        id: string;
        name: string;
    }

    interface Session {
        accessToken: string;
        refreshToken: string;
        id: string;
        name: string;
    }
}

// Define a type for the credentials
interface Credentials {
    email: string;
    password: string;
}

export default NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials?: Credentials) {
                if (!credentials) {
                    return null;
                }

                const { email, password } = credentials;

                // Create your payload
                const payload = { email, password };

                // Call the apiService to verify credentials
                const result = await apiService(payload, constant.apiLabel.signin);

                if (result.success) {
                    return {
                        id: result.data.data.userId,
                        name: result.data.data.name,
                        email: result.data.data.email,
                        accessToken: result.data.accessToken,
                        refreshToken: result.data.refreshToken,
                    };
                }

                return null;
            },
        }),
    ],
    pages: {
        signIn: '/signin',
    },
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.accessToken = user.accessToken;
                token.refreshToken = user.refreshToken;
                token.id = user.id;
                token.name = user.name;
            }
            return token;
        },
        async session({ session, token }) {
            // Ensure token is defined and has the expected properties
            if (token && typeof token.accessToken === 'string') {
                session.accessToken = token.accessToken;
            }
            if (token && typeof token.refreshToken === 'string') {
                session.refreshToken = token.refreshToken;
            }
            if (token && typeof token.id === 'string') {
                session.id = token.id;
            }
            if (token && typeof token.name === 'string') {
                session.name = token.name;
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
});