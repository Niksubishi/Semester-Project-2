import { API_LISTINGS, API_FLAGS } from "../../constants/api.js";

export async function getListings(
  page = 1,
  limit = 9,
  sort = "created",
  sortOrder = "desc"
) {
  const response = await fetch(
    `${API_LISTINGS.BASE}?page=${page}&limit=${limit}&sort=${sort}&sortOrder=${sortOrder}&_active=true&${API_FLAGS.SELLER}&${API_FLAGS.BIDS}`
  );

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  const data = await response.json();

  return {
    listings: data.data || [],
    meta: data.meta || { isLastPage: true },
    currentPage: page,
  };
}
