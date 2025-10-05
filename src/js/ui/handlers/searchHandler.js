import { API_LISTINGS, API_FLAGS } from "../../constants/api.js";
import { api } from "../../utils/apiClient.js";
import { createListingCard } from "../components/cards.js";
import { loading } from "../../utils/loadingState.js";

export function initializeSearch() {
  const searchInput = document.querySelector("[data-search-input]");
  const listingsGrid = document.querySelector("[data-listings-grid]");
  const sortSelect = document.querySelector("[data-sort-select]");

  searchInput.addEventListener(
    "input",
    debounce(async (event) => {
      const searchTerm = event.target.value.trim();

      if (!searchTerm) {
        // Clear search and reload normal listings
        listingsGrid.innerHTML = "";
        hidePagination();
        window.dispatchEvent(new CustomEvent("reloadListings"));
        return;
      }

      try {
        // Show skeleton loading
        loading.skeleton(listingsGrid, 6);
        hidePagination();

        const data = await api.get(
          `${API_LISTINGS.SEARCH}?q=${searchTerm}&${API_FLAGS.SELLER}&${API_FLAGS.BIDS}`,
          { cache: true, cacheTime: 60 * 1000 } // Cache search for 1 minute
        );

        const activeListings = data.data.filter(
          (listing) => new Date(listing.endsAt) > new Date()
        );

        listingsGrid.innerHTML = "";

        if (activeListings.length === 0) {
          listingsGrid.innerHTML = `<div class="col-span-full text-center py-12">
            <div class="text-gray-400 text-6xl mb-4">🔍</div>
            <p class="text-lg text-gray-600">No active listings found</p>
            <p class="text-sm text-gray-500 mt-2">Try searching for "${searchTerm}" with different keywords</p>
          </div>`;
          return;
        }

        const sortedListings = sortListings(activeListings, sortSelect.value);

        // Add fade-in animation to search results
        sortedListings.forEach((listing, index) => {
          const card = createListingCard(listing);
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          listingsGrid.appendChild(card);

          setTimeout(() => {
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, index * 50);
        });

        // Show search results info
        showSearchInfo(searchTerm, activeListings.length);

      } catch (error) {
        listingsGrid.innerHTML = `<div class="col-span-full text-center py-12">
          <div class="text-red-400 text-6xl mb-4">⚠️</div>
          <p class="text-lg text-red-600 mb-2">Search failed</p>
          <p class="text-sm text-gray-600">Please try again</p>
        </div>`;
      }
    }, 300)
  );
}

function showSearchInfo(searchTerm, resultCount) {
  const paginationContainer = document.querySelector("[data-pagination]");
  if (paginationContainer) {
    paginationContainer.innerHTML = `
      <div class="text-center mt-6 p-4 bg-blue-50 rounded-lg">
        <p class="text-sm text-blue-700">
          Found <strong>${resultCount}</strong> result${resultCount !== 1 ? 's' : ''} for "<em>${searchTerm}</em>"
        </p>
        <button onclick="document.querySelector('[data-search-input]').value=''; document.querySelector('[data-search-input]').dispatchEvent(new Event('input'))"
                class="mt-2 text-xs text-blue-600 hover:text-blue-800 underline">
          Clear search
        </button>
      </div>
    `;
  }
}

function hidePagination() {
  const paginationContainer = document.querySelector("[data-pagination]");
  if (paginationContainer) {
    paginationContainer.innerHTML = '';
  }
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
