import { getListings } from "../../api/listings/read.js";
import { createListingCard } from "../../ui/components/cards.js";

export async function renderListings() {
  const listingsGrid = document.querySelector("[data-listings-grid]");
  const loadMoreBtn = document.querySelector("[data-load-more]");

  let currentPage = 0;
  const itemsPerPage = 9;
  let allListings = [];

  try {
    allListings = await getListings();
    displayListings();

    loadMoreBtn.addEventListener("click", displayListings);
  } catch (error) {
    console.error("Error loading listings:", error);
  }

  function displayListings() {
    const start = currentPage * itemsPerPage;
    const end = start + itemsPerPage;
    const pageListings = allListings.slice(start, end);

    pageListings.forEach((listing) => {
      const card = createListingCard(listing);
      listingsGrid.appendChild(card);
    });

    currentPage++;

    if (end >= allListings.length) {
      loadMoreBtn.style.display = "none";
    }
  }
}
