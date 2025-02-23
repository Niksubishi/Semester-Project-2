import { getProfile } from "../../api/profiles/read.js";
import { API_PROFILES, API_FLAGS } from "../../constants/api.js";
import { createListingCard } from "../../ui/components/cards.js";
import { headers } from "../../constants/headers.js";

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
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 justify-items-center" id="listings-container"></div>
            <div class="flex justify-center items-center my-8 hidden" id="listings-loader">
                <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-text"></div>
            </div>
            <div class="flex justify-center">
                <button id="load-more-listings" class="hidden mt-4 px-6 py-2 bg-[#E0AFA0] text-white rounded-lg hover:bg-opacity-90 transition-colors">Load More</button>
            </div>
        </div>

        <h2 class="text-xl text-center mb-3">Item Wins</h2>
        <div class="bg-[#F4F3EE] rounded-lg p-4 mb-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 justify-items-center" id="wins-container"></div>
            <div class="flex justify-center items-center my-8 hidden" id="wins-loader">
                <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-text"></div>
            </div>
            <div class="flex justify-center">
                <button id="load-more-wins" class="hidden mt-4 px-6 py-2 bg-[#E0AFA0] text-white rounded-lg hover:bg-opacity-90 transition-colors">Load More</button>
            </div>
        </div>
    `;
}

export async function initUser() {
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
    const { data: profile } = await getProfile(username);
    const mainContent = document.querySelector("main");
    mainContent.innerHTML = createUserProfileHTML(profile);
    const token = localStorage.getItem("token");

    const listingsLoader = document.getElementById("listings-loader");
    const listingsContainer = document.getElementById("listings-container");
    const loadMoreListings = document.getElementById("load-more-listings");

    listingsLoader.classList.remove("hidden");
    const response = await fetch(
      `${API_PROFILES.LISTINGS(username)}?${API_FLAGS.LISTINGS}`,
      {
        headers: headers(token),
      }
    );
    const { data: listings } = await response.json();
    allListings = listings || [];

    function displayListings() {
      listingsLoader.classList.remove("hidden");
      loadMoreListings.classList.add("hidden");

      const sortedListings = allListings.sort(
        (a, b) => new Date(a.endsAt) - new Date(b.endsAt)
      );
      const start = currentListingsPage * itemsPerPage;
      const end = start + itemsPerPage;
      const pageListings = sortedListings.slice(start, end);

      setTimeout(() => {
        pageListings.forEach((listing) => {
          const card = createListingCard({
            ...listing,
            seller: { name: profile.name },
          });
          listingsContainer.appendChild(card);
        });

        currentListingsPage++;
        listingsLoader.classList.add("hidden");

        if (end < allListings.length) {
          loadMoreListings.classList.remove("hidden");
        }
      }, 500);
    }

    if (allListings.length > 0) {
      displayListings();
      loadMoreListings.addEventListener("click", displayListings);
    } else {
      listingsLoader.classList.add("hidden");
      listingsContainer.innerHTML =
        '<p class="text-gray-500">No listings yet</p>';
    }

    const winsLoader = document.getElementById("wins-loader");
    const winsContainer = document.getElementById("wins-container");
    const loadMoreWins = document.getElementById("load-more-wins");

    winsLoader.classList.remove("hidden");
    const winsResponse = await fetch(
      `${API_PROFILES.WINS(username)}?${API_FLAGS.WINS}`,
      {
        headers: headers(token),
      }
    );
    const { data: wins } = await winsResponse.json();
    allWins = wins || [];

    function displayWins() {
      winsLoader.classList.remove("hidden");
      loadMoreWins.classList.add("hidden");

      const sortedWins = allWins.sort(
        (a, b) => new Date(b.created) - new Date(a.created)
      );
      const start = currentWinsPage * itemsPerPage;
      const end = start + itemsPerPage;
      const pageWins = sortedWins.slice(start, end);

      setTimeout(() => {
        pageWins.forEach((win) => {
          const card = createListingCard({
            ...win,
            seller: { name: win.seller?.name || "Unknown Seller" },
          });
          winsContainer.appendChild(card);
        });

        currentWinsPage++;
        winsLoader.classList.add("hidden");

        if (end < allWins.length) {
          loadMoreWins.classList.remove("hidden");
        }
      }, 500);
    }

    if (allWins.length > 0) {
      displayWins();
      loadMoreWins.addEventListener("click", displayWins);
    } else {
      winsLoader.classList.add("hidden");
      winsContainer.innerHTML = '<p class="text-gray-500">No wins yet</p>';
    }
  } catch (error) {
    console.error("Error loading user profile:", error);
  }
}
