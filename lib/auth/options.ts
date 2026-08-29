import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// Use a valid URL format to prevent build-time URL validation errors
const getApiUrl = (): string => {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url) return 'http://localhost:3001';
  return url;
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        // eslint-disable-next-line no-console
        console.log('[auth]u=' + (apiUrl ? 'yes' : 'no'));

        if (!credentials?.email || !credentials?.password) {
          // eslint-disable-next-line no-console
          console.log('[auth]nocred');
          return null;
        }

        // Skip if no real API URL configured (e.g., during build)
        if (!process.env.NEXT_PUBLIC_API_URL) {
          // eslint-disable-next-line no-console
          console.log('[auth]empty');
          return null;
        }

        try {
          // eslint-disable-next-line no-console
          console.log('[auth]call');
          const res = await fetch(`${getApiUrl()}/v1/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          // eslint-disable-next-line no-console
          console.log('[auth]resp=' + res.status);

          if (!res.ok) {
            return null;
          }

          const data = await res.json();

          // NestJS 全局 TransformInterceptor 把响应包装成 { success, data: {...} }
          // 兼容两种结构：直接 body 或 unwrapped
          const body = (data?.data ?? data) as {
            user?: { id?: string; email?: string; name?: string; role?: string };
            accessToken?: string;
          };

          if (!body?.user?.id || !body.accessToken) {
            return null;
          }

          return {
            id: body.user.id as string,
            email: (body.user.email as string | undefined) ?? "",
            name: (body.user.name as string | undefined) ?? "",
            role: (body.user.role as string | undefined) ?? "USER",
            accessToken: body.accessToken as string,
          };
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error('[auth]err=' + ((e as Error)?.message || String(e)).slice(0, 60));
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  secret: process.env.NEXTAUTH_SECRET || 'dev-secret-for-build-time',
};
