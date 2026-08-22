import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";

// Use a valid localhost URL as fallback to prevent "Invalid URL" errors during build
const getApiUrl = (): string => {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url || url.trim() === '') {
    return 'http://localhost:3001';
  }
  return url;
};

interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
}

interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
  status: number;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = getApiUrl()) {
    this.baseUrl = baseUrl;
  }

  /**
   * Get the access token from the current session
   * For client-side usage
   */
  private async getClientToken(): Promise<string | null> {
    // Import dynamically to avoid circular dependency issues
    const { getSession } = await import("next-auth/react");
    const session = await getSession();
    return session?.user?.accessToken as string | null;
  }

  /**
   * Get the access token from server-side session
   * For server-side usage (RSC, API routes)
   */
  async getServerToken(): Promise<string | null> {
    const session = await getServerSession(authOptions);
    return session?.user?.accessToken as string | null;
  }

  /**
   * Make an authenticated request
   */
  private async request<T>(
    method: string,
    endpoint: string,
    options: {
      body?: unknown;
      token?: string | null;
      isServer?: boolean;
    } = {}
  ): Promise<ApiResponse<T>> {
    const { body, token, isServer = false } = options;

    // Get token if not provided
    const authToken = token || (isServer ? await this.getServerToken() : await this.getClientToken());

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        credentials: "include",
      });

      // Handle 401 Unauthorized
      if (response.status === 401) {
        if (typeof window !== "undefined") {
          // Redirect to login on client
          const { signOut } = await import("next-auth/react");
          await signOut({ callbackUrl: "/auth/login" });
        }
        return {
          error: { statusCode: 401, message: "Unauthorized" },
          status: 401,
        };
      }

      // Handle 403 Forbidden
      if (response.status === 403) {
        return {
          error: { statusCode: 403, message: "Access forbidden" },
          status: 403,
        };
      }

      // Handle other errors
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          error: {
            statusCode: response.status,
            message: errorData.message || "Request failed",
            error: errorData.error,
          },
          status: response.status,
        };
      }

      // Handle empty responses
      const text = await response.text();
      const data = text ? JSON.parse(text) : undefined;

      return { data, status: response.status };
    } catch (error) {
      console.error(`API Error [${method} ${endpoint}]:`, error);
      return {
        error: {
          statusCode: 500,
          message: error instanceof Error ? error.message : "Network error",
        },
        status: 500,
      };
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, options: { token?: string | null; isServer?: boolean } = {}): Promise<ApiResponse<T>> {
    return this.request<T>("GET", endpoint, options);
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, body: unknown, options: { token?: string | null; isServer?: boolean } = {}): Promise<ApiResponse<T>> {
    return this.request<T>("POST", endpoint, { ...options, body });
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, body: unknown, options: { token?: string | null; isServer?: boolean } = {}): Promise<ApiResponse<T>> {
    return this.request<T>("PUT", endpoint, { ...options, body });
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, body: unknown, options: { token?: string | null; isServer?: boolean } = {}): Promise<ApiResponse<T>> {
    return this.request<T>("PATCH", endpoint, { ...options, body });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, options: { token?: string | null; isServer?: boolean } = {}): Promise<ApiResponse<T>> {
    return this.request<T>("DELETE", endpoint, options);
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export type for use in components
export type { ApiError, ApiResponse };

// Export utility types for common API responses
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
