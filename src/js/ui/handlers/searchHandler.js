import { API_LISTINGS, API_FLAGS } from "../../constants/api.js";
import { createListingCard } from "../components/cards.js";

export function initializeSearch() {
  const searchInput = document.querySelector("[data-search-input]");
  const listingsGrid = document.querySelector("[data-listings-grid]");
  const loadMoreBtn = document.querySelector("[data-load-more]");
  const sortSelect = document.querySelector("[data-sort-select]");

  searchInput.addEventListener(
    "input",
    debounce(async (event) => {
      const searchTerm = event.target.value.trim();

      if (!searchTerm) {
        listingsGrid.innerHTML = "";
        loadMoreBtn.style.display = "block";
        window.dispatchEvent(new CustomEvent("reloadListings"));
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
      loadMoreBtn.style.display = "none";

      if (activeListings.length === 0) {
        listingsGrid.innerHTML = `<p class="col-span-full text-center text-lg">No active listings found matching "${searchTerm}"</p>`;
        return;
      }

      const sortedListings = sortListings(activeListings, sortSelect.value);

      sortedListings.forEach((listing) => {
        const card = createListingCard(listing);
        listingsGrid.appendChild(card);
      });
    }, 300)
  );
}

function sortListings(listings, sortType) {
  switch (sortType) {
    case "newest":
      return [...listings].sort(
        (a, b) => new Date(b.created) - new Date(a.created)
      );
    case "oldest":
      return [...listings].sort(
        (a, b) => new Date(a.created) - new Date(b.created)
      );
    case "ending-soon":
      return [...listings].sort(
        (a, b) => new Date(a.endsAt) - new Date(b.endsAt)
      );
    case "ending-last":
      return [...listings].sort(
        (a, b) => new Date(b.endsAt) - new Date(a.endsAt)
      );
    default:
      return listings;
  }
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
