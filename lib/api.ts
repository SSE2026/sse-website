// Simple API client with fallback URL handling for build-time safety
const getApiUrl = (): string => {
  const url = process.env.NEXT_PUBLIC_API_URL;
  // Return a valid localhost URL as fallback to prevent "Invalid URL" errors during build
  if (!url || url.trim() === '') {
    return 'http://localhost:3001';
  }
  return url;
};

interface FetchOptions extends RequestInit {
  token?: string;
}

export async function apiClient<T = any>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { token, ...fetchOptions } = options;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${getApiUrl()}/api/v1${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || 'Request failed');
  }

  return res.json();
}

// Auth API
export const authApi = {
  register: (data: { email: string; password: string; name: string }) =>
    apiClient('/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  login: (data: { email: string; password: string }) =>
    apiClient('/auth/login', { method: 'POST', body: JSON.stringify(data) }),

  getMe: (token: string) =>
    apiClient('/auth/me', { token }),
};

// Industries API
export const industriesApi = {
  getAll: (params?: { search?: string; level?: string }) => {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return apiClient(`/industries${query}`);
  },

  getWithCompanies: () =>
    apiClient('/industries/with-companies'),

  getBySlug: (slug: string) =>
    apiClient(`/industries/${slug}`),
};

// Companies API
export const companiesApi = {
  getAll: (params?: { search?: string; industryId?: string }) => {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return apiClient(`/companies${query}`);
  },

  search: (query: string) =>
    apiClient(`/companies/search?q=${encodeURIComponent(query)}`),

  getByCode: (code: string) =>
    apiClient(`/companies/${code}`),

  getQuote: (code: string) =>
    apiClient(`/companies/quote/${code}`),
};

// Reports API
export const reportsApi = {
  getExports: (token: string) =>
    apiClient('/reports/exports', { token }),

  getLatest: () =>
    apiClient('/reports/latest'),

  createExport: (token: string, data: { type: string; title: string; format: string }) =>
    apiClient('/reports/export', { method: 'POST', token, body: JSON.stringify(data) }),
};

// Users API
export const usersApi = {
  getProfile: (token: string) =>
    apiClient('/users/me', { token }),

  updateProfile: (token: string, data: { name?: string; avatar?: string }) =>
    apiClient('/users/me', { method: 'PUT', token, body: JSON.stringify(data) }),

  getFavorites: (token: string) =>
    apiClient('/users/me/favorites', { token }),

  addFavorite: (token: string, industryId: string) =>
    apiClient(`/users/me/favorites/${industryId}`, { method: 'POST', token }),

  removeFavorite: (token: string, industryId: string) =>
    apiClient(`/users/me/favorites/${industryId}`, { method: 'DELETE', token }),
};
