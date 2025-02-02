import { API_AUTH_REGISTER } from "../../constants/api.js";
import { headers } from "../../constants/headers.js";

export async function register(userData) {
  const response = await fetch(API_AUTH_REGISTER, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error("Registration failed");
  }

  return response.json();
}
