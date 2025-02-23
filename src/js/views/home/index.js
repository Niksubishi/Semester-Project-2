import { getListings } from "../../api/listings/read.js";
import { createListingCard } from "../../ui/components/cards.js";
import { initializeSearch } from "../../ui/handlers/searchHandler.js";
import { initializeSort } from "../../ui/handlers/sortHandler.js";

export async function renderListings() {
  initializeSearch();
  initializeSort();

  const listingsGrid = document.querySelector("[data-listings-grid]");
  const loadMoreBtn = document.querySelector("[data-load-more]");
  const loader = document.getElementById("listingsLoader");
  const sortSelect = document.querySelector("[data-sort-select]");

  window.addEventListener("reloadListings", () => {
    currentPage = 0;
    displayListings();
  });

  let currentPage = 0;
  const itemsPerPage = 9;
  let allListings = [];

  try {
    loader.classList.remove("hidden");
    loadMoreBtn.style.display = "none";
    const listings = await getListings();

    allListings = listings.filter(
      (listing) => new Date(listing.endsAt) > new Date()
    );

    displayListings();

    loadMoreBtn.addEventListener("click", displayListings);
    sortSelect.addEventListener("change", () => {
      listingsGrid.innerHTML = "";
      currentPage = 0;
      displayListings();
    });
  } catch (error) {
    console.error("Error loading listings:", error);
  } finally {
    loader.classList.add("hidden");
  }

  function displayListings() {
    const sortedListings = sortListings(allListings, sortSelect.value);
    const start = currentPage * itemsPerPage;
    const end = start + itemsPerPage;
    const pageListings = sortedListings.slice(start, end);

    pageListings.forEach((listing) => {
      const card = createListingCard(listing);
      listingsGrid.appendChild(card);
    });

    currentPage++;

    if (end >= allListings.length) {
      loadMoreBtn.style.display = "none";
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
}
