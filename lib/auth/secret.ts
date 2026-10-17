/**
 * Shared NextAuth secret.
 *
 * Lives in its own module (rather than being read from lib/auth/options.ts)
 * so the edge middleware can import it without pulling the Credentials
 * provider — and therefore all of next-auth's server code — into the edge
 * bundle.
 *
 * The fallback matters: the NextAuth route handler has always had one, but
 * the middleware had none, and a middleware without a secret redirects every
 * request to pages.error with error=Configuration. That is what broke the
 * Vercel preview deployments (NEXTAUTH_SECRET scoped to Production only).
 * Keeping both sides on the same resolution removes the mismatch.
 *
 * The fallback is a build-time placeholder, NOT a real secret — set
 * NEXTAUTH_SECRET in every Vercel environment (Production, Preview,
 * Development).
 */
const FALLBACK_SECRET = 'dev-secret-for-build-time';

const envSecret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET;

if (!envSecret && process.env.NODE_ENV === 'production') {
  console.warn(
    '[auth] NEXTAUTH_SECRET is not set — falling back to the build-time placeholder. ' +
      'Sessions will not be secure. Set it for every environment in Vercel.',
  );
}

export const AUTH_SECRET = envSecret || FALLBACK_SECRET;
