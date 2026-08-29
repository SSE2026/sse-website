// Centralized admin API configuration. Source of truth for the NestJS API
// base URL, used by every /api/admin/** proxy route. Reads from
// NEXT_PUBLIC_API_URL at runtime; falls back to a valid localhost URL
// so the file is import-safe during `next build` when env is absent.

export function getApiBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url || url.trim() === "") {
    return "http://localhost:3001";
  }
  return url;
}

export const API_PREFIX = "/v1";
