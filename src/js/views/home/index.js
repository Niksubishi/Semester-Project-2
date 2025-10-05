import { getListings } from "../../api/listings/read.js";
import { createListingCard } from "../../ui/components/cards.js";
import { initializeSearch } from "../../ui/handlers/searchHandler.js";
import { initializeSort } from "../../ui/handlers/sortHandler.js";
import { loading } from "../../utils/loadingState.js";
import Logger from "../../utils/logger.js";

export async function renderListings() {
  initializeSearch();
  initializeSort();

  const listingsGrid = document.querySelector("[data-listings-grid]");
  const loader = document.getElementById("listingsLoader");
  const sortSelect = document.querySelector("[data-sort-select]");

  let currentPage = 1;
  const itemsPerPage = 12;
  let totalPages = 1;

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
    totalPages = 1;
    loadListings();
  });

  async function loadListings(page = currentPage) {
    const operationId = `load-listings-${page}`;

    try {
      // Show skeleton loading
      loading.skeleton(listingsGrid, 8);
      hidePagination();

      const { sort, sortOrder } = currentSortSettings;

      const { listings, meta } = await loading.withLoading(
        operationId,
        () => getListings(page, itemsPerPage, sort, sortOrder),
        null,
        'Loading listings...'
      );

      // Update pagination info
      currentPage = page;
      totalPages = meta.pageCount || 1;

      // Clear grid
      listingsGrid.innerHTML = '';

      if (listings.length === 0) {
        listingsGrid.innerHTML = `<div class="col-span-full text-center py-12">
          <div class="text-gray-400 text-6xl mb-4">📦</div>
          <p class="text-lg text-gray-600">No active listings found</p>
          <p class="text-sm text-gray-500 mt-2">Check back later for new auctions!</p>
        </div>`;
        hidePagination();
        return;
      }

      // Add fade-in animation to listings
      listings.forEach((listing, index) => {
        const card = createListingCard(listing);
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        listingsGrid.appendChild(card);

        // Stagger animation
        setTimeout(() => {
          card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, index * 50); // Faster stagger for more items
      });

      // Show pagination
      renderPagination();

    } catch (error) {
      Logger.apiError("loading listings", error);

      // Show user-friendly error message
      listingsGrid.innerHTML = `<div class="col-span-full text-center py-12">
        <div class="text-red-400 text-6xl mb-4">⚠️</div>
        <p class="text-lg text-red-600 mb-2">Unable to load listings</p>
        <p class="text-sm text-gray-600 mb-4">Please check your connection and try again</p>
        <button onclick="location.reload()" class="px-4 py-2 bg-brand-nav text-brand-text rounded-lg hover:opacity-90">
          Retry
        </button>
      </div>`;
      hidePagination();
    } finally {
      loader.classList.add("hidden");
    }
  }

  // Pagination functions
  function renderPagination() {
    const paginationContainer = document.querySelector("[data-pagination]");
    if (!paginationContainer) return;

    if (totalPages <= 1) {
      paginationContainer.innerHTML = '';
      return;
    }

    let paginationHTML = '<div class="flex justify-center items-center space-x-2 mt-8">';

    // Previous button
    if (currentPage > 1) {
      paginationHTML += `<button onclick="changePage(${currentPage - 1})"
        class="px-3 py-2 bg-brand-nav text-brand-text rounded-lg hover:opacity-90 transition-opacity">
        Previous
      </button>`;
    }

    // Page numbers
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    // First page + ellipsis
    if (startPage > 1) {
      paginationHTML += `<button onclick="changePage(1)"
        class="px-3 py-2 bg-brand-nav text-brand-text rounded-lg hover:opacity-90 transition-opacity">1</button>`;
      if (startPage > 2) {
        paginationHTML += '<span class="px-2 text-gray-500">...</span>';
      }
    }

    // Page numbers around current page
    for (let i = startPage; i <= endPage; i++) {
      const isCurrentPage = i === currentPage;
      paginationHTML += `<button onclick="changePage(${i})"
        class="px-3 py-2 rounded-lg transition-opacity ${
          isCurrentPage
            ? 'bg-brand-text text-brand-nav font-bold'
            : 'bg-brand-nav text-brand-text hover:opacity-90'
        }">${i}</button>`;
    }

    // Last page + ellipsis
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        paginationHTML += '<span class="px-2 text-gray-500">...</span>';
      }
      paginationHTML += `<button onclick="changePage(${totalPages})"
        class="px-3 py-2 bg-brand-nav text-brand-text rounded-lg hover:opacity-90 transition-opacity">${totalPages}</button>`;
    }

    // Next button
    if (currentPage < totalPages) {
      paginationHTML += `<button onclick="changePage(${currentPage + 1})"
        class="px-3 py-2 bg-brand-nav text-brand-text rounded-lg hover:opacity-90 transition-opacity">
        Next
      </button>`;
    }

    paginationHTML += '</div>';

    // Add page info
    paginationHTML += `<div class="text-center mt-4 text-sm text-gray-600">
      Page ${currentPage} of ${totalPages} (${itemsPerPage} items per page)
    </div>`;

    paginationContainer.innerHTML = paginationHTML;
  }

  function hidePagination() {
    const paginationContainer = document.querySelector("[data-pagination]");
    if (paginationContainer) {
      paginationContainer.innerHTML = '';
    }
  }

  // Make changePage available globally for onclick handlers
  window.changePage = function(page) {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      loadListings(page);
      // Scroll to top smoothly
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  sortSelect.addEventListener("change", () => {
    currentSortSettings = getSortSettings(sortSelect.value);
    currentPage = 1;
    totalPages = 1;
    loadListings();
  });


  loadListings();
}
