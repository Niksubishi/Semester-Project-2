import { API_PROFILES, API_FLAGS } from "../../constants/api.js";
import { headers } from "../../constants/headers.js";

export async function getProfile(name) {
  const token = localStorage.getItem("token");
  const response = await fetch(
    `${API_PROFILES.SINGLE(name)}?${API_FLAGS.LISTINGS}&${API_FLAGS.WINS}`,
    {
      headers: headers(token),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch profile");
  }

  return response.json();
}

export async function getProfileBids(name) {
  const token = localStorage.getItem("token");
  const response = await fetch(
    `${API_PROFILES.BIDS(name)}?_listings=true&_seller=true&_active=true`,
    {
      headers: headers(token),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch bids");
  }

  return response.json();
}

export async function getProfileWins(name) {
  const token = localStorage.getItem("token");
  const response = await fetch(API_PROFILES.WINS(name), {
    headers: headers(token),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch wins");
  }

  return response.json();
}
