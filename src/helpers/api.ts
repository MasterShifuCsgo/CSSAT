const BASE_URL = import.meta.env.VITE_BASE_API;

/**
 * Generic API helper using Fetch.
 * Automatically prepends BASE_URL and handles JSON.
 */
export async function api<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error ${response.status}: ${errorText}`);
  }

  // If no content (e.g., 204), return empty object
  return response.status === 204 ? ({} as T) : response.json();
}
