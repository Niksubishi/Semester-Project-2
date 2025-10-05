import { API_LISTINGS, API_FLAGS } from "../../constants/api.js";
import { api } from "../../utils/apiClient.js";

export async function getListings(
  page = 1,
  limit = 9,
  sort = "created",
  sortOrder = "desc"
) {
  const url = `${API_LISTINGS.BASE}?page=${page}&limit=${limit}&sort=${sort}&sortOrder=${sortOrder}&_active=true&${API_FLAGS.SELLER}&${API_FLAGS.BIDS}`;

  const data = await api.get(url, {
    cache: true,
    cacheTime: 2 * 60 * 1000, // Cache for 2 minutes
    timeout: 15000, // 15 second timeout for listings
  });

  return {
    listings: data.data || [],
    meta: data.meta || { isLastPage: true },
    currentPage: page,
  };
}
