import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "@/constants/config";

/**
 * Wrapper around fetch that automatically:
 * - Prepends the API base URL from config
 * - Attaches the Authorization header with the stored JWT token
 * - Sets Content-Type to application/json (unless overridden)
 *
 * Usage:
 *   const response = await apiFetch("/delivery/orders");
 *   const data = await response.json();
 */
export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = await AsyncStorage.getItem("userToken");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = `${config.apiUrl}${endpoint}`;

  return fetch(url, {
    ...options,
    headers,
  });
}
