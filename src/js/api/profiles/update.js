import { API_PROFILES } from "../../constants/api.js";
import { headers } from "../../constants/headers.js";

export async function updateProfile(name, profileData) {
  const response = await fetch(API_PROFILES.SINGLE(name), {
    method: "PUT",
    eaders: headers(token),
    body: JSON.stringify(profileData),
  });

  if (!response.ok) {
    throw new Error("Failed to update profile");
  }

  return response.json();
}
