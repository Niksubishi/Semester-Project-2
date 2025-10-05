import { getProfile } from "../../api/profiles/read.js";
import { API_PROFILES, API_FLAGS } from "../../constants/api.js";
import { createListingCard } from "../../ui/components/cards.js";
import { headers } from "../../constants/headers.js";
import { loading } from "../../utils/loadingState.js";
import Logger from "../../utils/logger.js";

function createUserProfileHTML(profile) {
  return `
        <h1 class="text-4xl text-center text-brand-text mb-8">PROFILE</h1>
        
        <div class="bg-[#F4F3EE] rounded-lg p-8 mb-8">
            <div class="flex flex-col md:flex-row gap-8">
                <div class="w-full md:w-1/3">
                    <img src="${
                      profile.avatar?.url || "/src/assets/images/auctionpic.png"
                    }" 
                         alt="Profile" 
                         class="w-full h-64 object-cover rounded-lg">
                </div>
                <div class="w-full md:w-2/3 space-y-4">
                    <div class="w-full text-left">
                        <p class="text-lg"><strong>Name:</strong> ${
                          profile.name
                        }</p>
                        <p class="text-lg"><strong>Bio:</strong> ${
                          profile.bio || "No bio yet"
                        }</p>
                        <p class="text-lg"><strong>Wins:</strong> ${
                          profile._count.wins
                        }</p>
                    </div>
                </div>
            </div>
        </div>

        <h2 class="text-xl text-center mb-3">Listings</h2>
        <div class="bg-[#F4F3EE] rounded-lg p-4 mb-6">
            <div class="flex justify-center gap-4 mb-4">
                <button id="active-listings-tab" class="px-6 py-2 bg-[#E0AFA0] text-brand-text rounded-lg">Active</button>
                <button id="expired-listings-tab" class="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg">Expired</button>
            </div>
            <div id="listings-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 justify-items-center"></div>
            <div class="flex justify-center items-center my-8 hidden" id="listings-loader">
                <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-text"></div>
            </div>
            <div class="flex justify-center">
                <button id="load-more-listings" class="hidden mt-4 px-6 py-2 bg-[#E0AFA0] text-brand-text rounded-lg hover:bg-opacity-90 transition-colors">Load More</button>
            </div>
        </div>

        <h2 class="text-xl text-center mb-3">Item Wins</h2>
        <div class="bg-[#F4F3EE] rounded-lg p-4 mb-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 justify-items-center" id="wins-container"></div>
            <div class="flex justify-center items-center my-8 hidden" id="wins-loader">
                <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-text"></div>
            </div>
            <div class="flex justify-center">
                <button id="load-more-wins" class="hidden mt-4 px-6 py-2 bg-[#E0AFA0] text-brand-text rounded-lg hover:bg-opacity-90 transition-colors">Load More</button>
            </div>
        </div>
    `;
}

export async function initUser() {
  const token = localStorage.getItem("token");
  if (!token) {
    const returnUrl = encodeURIComponent(window.location.href);
    window.location.href = `/src/pages/login/?returnTo=${returnUrl}`;
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const username = params.get("name");

  if (!username) {
    window.location.href = "/";
    return;
  }

  const itemsPerPage = 3;
  let currentListingsPage = 0;
  let currentWinsPage = 0;
  let allListings = [];
  let allWins = [];

  try {
    const mainContent = document.querySelector("main");

    // Show skeleton loading
    loading.skeleton(mainContent, 1);

    const { data: profile } = await loading.withLoading(
      'load-user-profile',
      () => getProfile(username),
      null,
      'Loading profile...'
    );

    mainContent.innerHTML = createUserProfileHTML(profile);
    const token = localStorage.getItem("token");

    const listingsLoader = document.getElementById("listings-loader");
    const listingsContainer = document.getElementById("listings-container");
    const loadMoreListings = document.getElementById("load-more-listings");
    const activeTab = document.getElementById("active-listings-tab");
    const expiredTab = document.getElementById("expired-listings-tab");

    // Show skeleton loading for listings
    loading.skeleton(listingsContainer, 3);

    const { data: listings } = await loading.withLoading(
      'load-user-listings',
      async () => {
        const response = await fetch(
          `${API_PROFILES.LISTINGS(username)}?${API_FLAGS.LISTINGS}`,
          {
            headers: headers(token),
          }
        );
        return response.json();
      },
      null,
      'Loading listings...'
    );

    allListings = listings || [];

    const activeListings = allListings.filter(
      (listing) => new Date(listing.endsAt) > new Date()
    );
    const expiredListings = allListings.filter(
      (listing) => new Date(listing.endsAt) <= new Date()
    );
    let currentListings = activeListings;

    function switchTab(isActive) {
      currentListingsPage = 0;
      listingsContainer.innerHTML = "";
      currentListings = isActive ? activeListings : expiredListings;

      activeTab.className = isActive
        ? "px-6 py-2 bg-[#E0AFA0] text-brand-text rounded-lg"
        : "px-6 py-2 bg-gray-300 text-gray-700 rounded-lg";

      expiredTab.className = !isActive
        ? "px-6 py-2 bg-[#E0AFA0] text-brand-text rounded-lg"
        : "px-6 py-2 bg-gray-300 text-gray-700 rounded-lg";

      if (currentListings.length > 0) {
        displayListings();
      } else {
        listingsContainer.innerHTML = `<p class="text-gray-500">No ${
          isActive ? "active" : "expired"
        } listings</p>`;
        loadMoreListings.classList.add("hidden");
      }
    }

    activeTab.addEventListener("click", () => switchTab(true));
    expiredTab.addEventListener("click", () => switchTab(false));

    async function displayListings() {
      try {
        loadMoreListings.classList.add("hidden");

        const start = currentListingsPage * itemsPerPage;
        const end = start + itemsPerPage;
        const pageListings = currentListings.slice(start, end);

        // Show skeleton for first load
        if (currentListingsPage === 0) {
          loading.skeleton(listingsContainer, itemsPerPage);
        }

        await loading.withLoading(
          `display-user-listings-${currentListingsPage}`,
          async () => {
            await new Promise(resolve => setTimeout(resolve, 300));

            if (currentListingsPage === 0) {
              listingsContainer.innerHTML = '';
            }

            pageListings.forEach((listing) => {
              const card = createListingCard({
                ...listing,
                seller: { name: profile.name },
              });
              listingsContainer.appendChild(card);
            });

            currentListingsPage++;

            if (end < currentListings.length) {
              loadMoreListings.classList.remove("hidden");
            }
          },
          null,
          'Loading more listings...'
        );
      } catch (error) {
        Logger.apiError("displaying listings", error);
        listingsContainer.innerHTML = `<div class="col-span-full text-center py-8">
          <div class="text-red-400 text-4xl mb-2">⚠️</div>
          <p class="text-red-600 mb-2">Unable to load listings</p>
          <button onclick="location.reload()" class="px-4 py-2 bg-brand-nav text-brand-text rounded-lg hover:opacity-90">
            Retry
          </button>
        </div>`;
      }
    }

    if (activeListings.length > 0) {
      switchTab(true);
    } else {
      listingsContainer.innerHTML =
        '<p class="text-gray-500">No active listings</p>';
    }

    loadMoreListings.addEventListener("click", displayListings);

    const winsLoader = document.getElementById("wins-loader");
    const winsContainer = document.getElementById("wins-container");
    const loadMoreWins = document.getElementById("load-more-wins");

    // Show skeleton loading for wins
    loading.skeleton(winsContainer, 3);

    const { data: wins } = await loading.withLoading(
      'load-user-wins',
      async () => {
        const winsResponse = await fetch(
          `${API_PROFILES.WINS(username)}?${API_FLAGS.WINS}`,
          {
            headers: headers(token),
          }
        );
        return winsResponse.json();
      },
      null,
      'Loading wins...'
    );

    allWins = wins || [];

    async function displayWins() {
      try {
        loadMoreWins.classList.add("hidden");

        const sortedWins = allWins.sort(
          (a, b) => new Date(b.created) - new Date(a.created)
        );
        const start = currentWinsPage * itemsPerPage;
        const end = start + itemsPerPage;
        const pageWins = sortedWins.slice(start, end);

        // Show skeleton for first load
        if (currentWinsPage === 0) {
          loading.skeleton(winsContainer, itemsPerPage);
        }

        await loading.withLoading(
          `display-user-wins-${currentWinsPage}`,
          async () => {
            await new Promise(resolve => setTimeout(resolve, 300));

            if (currentWinsPage === 0) {
              winsContainer.innerHTML = '';
            }

            pageWins.forEach((win) => {
              const card = createListingCard({
                ...win,
                seller: { name: win.seller?.name || "Unknown Seller" },
              });
              winsContainer.appendChild(card);
            });

            currentWinsPage++;

            if (end < allWins.length) {
              loadMoreWins.classList.remove("hidden");
            }
          },
          null,
          'Loading more wins...'
        );
      } catch (error) {
        Logger.apiError("displaying wins", error);
        winsContainer.innerHTML = `<div class="col-span-full text-center py-8">
          <div class="text-red-400 text-4xl mb-2">⚠️</div>
          <p class="text-red-600 mb-2">Unable to load wins</p>
          <button onclick="location.reload()" class="px-4 py-2 bg-brand-nav text-brand-text rounded-lg hover:opacity-90">
            Retry
          </button>
        </div>`;
      }
    }

    if (allWins.length > 0) {
      displayWins();
      loadMoreWins.addEventListener("click", displayWins);
    } else {
      winsLoader.classList.add("hidden");
      winsContainer.innerHTML = '<p class="text-gray-500">No wins yet</p>';
    }
  } catch (error) {
    Logger.apiError("Error loading user profile:", error);

    // Show user-friendly error message
    const mainContent = document.querySelector("main");
    mainContent.innerHTML = `<div class="text-center py-12">
      <div class="text-red-400 text-6xl mb-4">⚠️</div>
      <p class="text-lg text-red-600 mb-2">Unable to load user profile</p>
      <p class="text-sm text-gray-600 mb-4">Please check your connection and try again</p>
      <button onclick="location.reload()" class="px-4 py-2 bg-brand-nav text-brand-text rounded-lg hover:opacity-90">
        Retry
      </button>
    </div>`;
  }
}
