import { API_LISTINGS, API_FLAGS } from "../../constants/api.js";
import { createListingCard } from "../components/cards.js";
import { getListings } from "../../api/listings/read.js";

export function initializeSearch() {
  const searchInput = document.querySelector("[data-search-input]");

  searchInput.addEventListener(
    "input",
    debounce(async (event) => {
      const searchTerm = event.target.value.trim();
      const listingsGrid = document.querySelector("[data-listings-grid]");

      if (!searchTerm) {
        const listings = await getListings();
        const activeListings = listings.filter(
          (listing) => new Date(listing.endsAt) > new Date()
        );

        listingsGrid.innerHTML = "";

        activeListings.forEach((listing) => {
          const card = createListingCard(listing);
          listingsGrid.appendChild(card);
        });
        return;
      }

      const response = await fetch(
        `${API_LISTINGS.SEARCH}?q=${searchTerm}&${API_FLAGS.SELLER}&${API_FLAGS.BIDS}`
      );
      const { data } = await response.json();

      const activeListings = data.filter(
        (listing) => new Date(listing.endsAt) > new Date()
      );

      listingsGrid.innerHTML = "";

      if (activeListings.length === 0) {
        listingsGrid.innerHTML = `<p class="col-span-full text-center text-lg">No active listings found matching "${searchTerm}"</p>`;
        return;
      }

      activeListings.forEach((listing) => {
        const card = createListingCard(listing);
        listingsGrid.appendChild(card);
      });
    }, 300)
  );
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
