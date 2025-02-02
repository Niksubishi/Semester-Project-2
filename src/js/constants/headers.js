export const API_KEY = import.meta.env.VITE_API_KEY;

export function headers(token) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    "X-Noroff-API-Key": API_KEY,
  };
}
