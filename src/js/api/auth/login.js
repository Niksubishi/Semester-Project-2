import { API_AUTH_LOGIN, API_PROFILES } from "../../constants/api.js";
import { headers } from "../../constants/headers.js";

export async function login(email, password) {
  const response = await fetch(API_AUTH_LOGIN, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Invalid credentials");
  }

  const { data } = await response.json();
  localStorage.setItem("token", data.accessToken);
  localStorage.setItem("username", data.name);

  const profileResponse = await fetch(`${API_PROFILES.SINGLE(data.name)}`, {
    headers: headers(data.accessToken),
  });

  const profileData = await profileResponse.json();

  localStorage.setItem("credits", profileData.data.credits);

  window.location.href = "/";
}
