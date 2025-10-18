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

  // 💡 FIX: Create a final options object by merging defaults and user-provided options.
  const finalOptions: RequestInit = {
    // 1. Start with user-provided options (allows method/body to be set)
    ...options, 
    // 2. Set default Content-Type header (but merge with existing options.headers)
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}), // 👈 Ensure user-defined headers override/merge
    },
    // 3. IMPORTANT: Ensure default method is set if not provided, e.g., 'GET'
    // You typically rely on the caller to provide 'POST', 'PUT', etc.
  };

  const response = await fetch(url, finalOptions);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error ${response.status}: ${errorText}`);
  }

  // If no content (e.g., 204), return empty object
  return response.status === 204 ? ({} as T) : response.json();
}