import { API_PROFILES, API_FLAGS } from "../../constants/api.js";
import { headers } from "../../constants/headers.js";

export async function getProfile(name) {
  const token = localStorage.getItem("token");

  const listingsResponse = await fetch(
    `${API_PROFILES.SINGLE(name)}/listings?_bids=true&_seller=true`,
    {
      headers: headers(token),
    }
  );

  const winsResponse = await fetch(`${API_PROFILES.SINGLE(name)}?_wins=true`, {
    headers: headers(token),
  });

  if (!listingsResponse.ok || !winsResponse.ok) {
    throw new Error("Failed to fetch profile data");
  }

  const listingsData = await listingsResponse.json();
  const winsData = await winsResponse.json();

  const combinedData = {
    ...winsData,
    data: {
      ...winsData.data,
      listings: listingsData.data,
    },
  };

  return combinedData;
}

export async function getProfileBids(name) {
  const token = localStorage.getItem("token");
  const response = await fetch(
    `${API_PROFILES.BIDS(name)}?_listings=true&_seller=true&_active=true&${
      API_FLAGS.BIDS
    }`,
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
