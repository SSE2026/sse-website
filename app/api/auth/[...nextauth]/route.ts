// Re-export NextAuth handler from the single source of truth in lib/auth/.
// lib/auth/options.ts is the only place where NextAuth config lives
// (authorize / jwt / session callbacks, including accessToken propagation).
export { GET, POST } from '@/lib/auth/[...nextauth]';
