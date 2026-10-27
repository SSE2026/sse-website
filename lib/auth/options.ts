import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { AUTH_SECRET } from './secret';
import { getApiBaseUrl, API_PREFIX } from '@/lib/api/config';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // 原来这里有一句「没配 API 地址就直接返回 null」。它本意是
        // 避免构建期取不到 env，但 authorize 只在请求时执行，构建期根本
        // 不会走到这里；留着反而让「没配地址」和「密码错」变成同一个
        // 不可区分的现象。现在交给 fetch 自己失败，错误仍然回到同一个
        // null 分支，但代码里不再有这层误导。
        try {
          const res = await fetch(`${getApiBaseUrl()}${API_PREFIX}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

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
        } catch {
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
  secret: AUTH_SECRET,
};
