export function initializeSort() {
  const sortSelect = document.querySelector("[data-sort-select]");
  const listingsGrid = document.querySelector("[data-listings-grid]");
  const searchInput = document.querySelector("[data-search-input]");

  sortSelect.addEventListener("change", (event) => {
    const searchTerm = searchInput.value.trim();

    if (searchTerm) {
      searchInput.dispatchEvent(new Event("input"));
      return;
    }

    const sortType = event.target.value;
    const listings = Array.from(listingsGrid.children);

    listings.sort((a, b) => {
      const dateA = new Date(a.dataset.listingDate);
      const dateB = new Date(b.dataset.listingDate);
      const endDateA = new Date(a.dataset.endDate);
      const endDateB = new Date(b.dataset.endDate);

      switch (sortType) {
        case "newest":
          return dateB - dateA;
        case "oldest":
          return dateA - dateB;
        case "ending-soon":
          return endDateA - endDateB;
        case "ending-last":
          return endDateB - endDateA;
        default:
          return 0;
      }
    });

    listingsGrid.innerHTML = "";
    listings.forEach((listing) => listingsGrid.appendChild(listing));
  });
}
