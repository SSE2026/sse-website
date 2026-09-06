"use client";

import { signOut } from "next-auth/react";

/**
 * Wrapper around fetch for admin /api/admin/** calls.
 *
 * If the backend returns 401 (session expired or token rejected),
 * signs the user out and redirects to the login page with
 * ?error=session_expired instead of letting "Unauthorized"
 * leak into the UI.
 */
export async function adminFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const res = await fetch(input, init);

  if (res.status === 401) {
    // Best-effort sign-out; ignore errors since session may already be gone.
    try {
      await signOut({ callbackUrl: "/auth/login?error=session_expired", redirect: true });
    } catch {
      if (typeof window !== "undefined") {
        window.location.assign("/auth/login?error=session_expired");
      }
    }
  }

  return res;
}