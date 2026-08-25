import NextAuth, { type User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const getApiUrl = (): string => {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url) return 'http://localhost:3001';
  return url;
};

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) {
          console.log('[NextAuth] Missing credentials');
          return null;
        }

        const apiUrl = getApiUrl();
        console.log('[NextAuth] API URL:', apiUrl);
        console.log('[NextAuth] ENV var:', process.env.NEXT_PUBLIC_API_URL);

        try {
          const targetUrl = `${apiUrl}/api/v1/auth/login`;
          console.log('[NextAuth] Calling:', targetUrl);

          const res = await fetch(targetUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          console.log('[NextAuth] Response status:', res.status);
          if (!res.ok) {
            const errBody = await res.text().catch(() => '');
            console.log('[NextAuth] Error body:', errBody);
            return null;
          }

          const data = await res.json();
          console.log('[NextAuth] Response data:', JSON.stringify(data));

          return {
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            role: data.user.role,
          } as User;
        } catch (e) {
          console.log('[NextAuth] Fetch error:', (e as Error).message);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role || 'USER';
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET || 'dev-secret-for-build-time',
});

export { handler as GET, handler as POST };
