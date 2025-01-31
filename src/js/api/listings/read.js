import { API_LISTINGS, API_FLAGS } from "../../constants/api.js";

export async function getListings() {
  let allListings = [];
  let currentPage = 1;
  let hasMorePages = true;

  while (hasMorePages) {
    const response = await fetch(
      `${API_LISTINGS.BASE}?page=${currentPage}&${API_FLAGS.SELLER}&${API_FLAGS.BIDS}`
    );
    const { data, meta } = await response.json();

    allListings = [...allListings, ...data];

    hasMorePages = !meta.isLastPage;
    currentPage++;
  }

  return allListings;
}
