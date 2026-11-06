// src/api/client.ts
const BASE_URL = import.meta.env.VITE_API_URL || "https://free.dev";

export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${BASE_URL}${cleanEndpoint}`;

  const headers = {
    "Content-Type": "application/json",
    // 🔥 CRITICAL: Instructs ngrok to skip the warning splash page and return raw API data
    "ngrok-skip-browser-warning": "true",
    ...options?.headers,
  };

  try {
    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
      );
    }

    if (response.status === 204) return {} as T;
    return await response.json();
  } catch (error) {
    console.error(`[API Error] Request failed on ${endpoint}:`, error);
    throw error;
  }
}
