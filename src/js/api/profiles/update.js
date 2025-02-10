import { API_PROFILES } from "../../constants/api.js";
import { headers } from "../../constants/headers.js";

export async function updateProfile(name, profileData) {
  const token = localStorage.getItem("token");
  const response = await fetch(API_PROFILES.SINGLE(name), {
    method: "PUT",
    headers: headers(token),
    body: JSON.stringify({
      avatar: {
        url: profileData.avatar.url,
        alt: profileData.avatar.alt,
      },
      bio: profileData.bio,
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.errors?.[0]?.message || "Failed to update profile");
  }

  return response.json();
}
