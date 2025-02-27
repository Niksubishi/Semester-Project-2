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

  let currentPage = 1;
  const itemsPerPage = 9;
  let isLastPage = false;

  let currentSortSettings = getSortSettings(sortSelect.value);

  function getSortSettings(uiSortValue) {
    switch (uiSortValue) {
      case "newest":
        return { sort: "created", sortOrder: "desc" };
      case "oldest":
        return { sort: "created", sortOrder: "asc" };
      case "ending-soon":
        return { sort: "endsAt", sortOrder: "asc" };
      case "ending-last":
        return { sort: "endsAt", sortOrder: "desc" };
      default:
        return { sort: "created", sortOrder: "desc" };
    }
  }

  window.addEventListener("reloadListings", () => {
    listingsGrid.innerHTML = "";
    currentPage = 1;
    isLastPage = false;
    loadListings();
  });

  async function loadListings() {
    try {
      loader.classList.remove("hidden");
      loadMoreBtn.style.display = "none";

      const { sort, sortOrder } = currentSortSettings;
      const { listings, meta } = await getListings(
        currentPage,
        itemsPerPage,
        sort,
        sortOrder
      );

      isLastPage = meta.isLastPage;

      if (listings.length === 0) {
        if (currentPage === 1) {
          listingsGrid.innerHTML = `<p class="col-span-full text-center text-lg">No active listings found</p>`;
        }
        loadMoreBtn.style.display = "none";
        return;
      }

      listings.forEach((listing) => {
        const card = createListingCard(listing);
        listingsGrid.appendChild(card);
      });

      currentPage++;

      loadMoreBtn.style.display = isLastPage ? "none" : "block";
    } catch (error) {
      console.error("Error loading listings:", error);
      listingsGrid.innerHTML += `<p class="col-span-full text-center text-lg text-red-500">Error loading listings. Please try again later.</p>`;
    } finally {
      loader.classList.add("hidden");
    }
  }

  sortSelect.addEventListener("change", () => {
    currentSortSettings = getSortSettings(sortSelect.value);
    listingsGrid.innerHTML = "";
    currentPage = 1;
    isLastPage = false;
    loadListings();
  });

  loadMoreBtn.addEventListener("click", loadListings);

  loadListings();
}
