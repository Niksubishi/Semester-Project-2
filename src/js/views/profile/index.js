import {
  getProfile,
  getProfileBids,
  getProfileWins,
  getListing,
} from "../../api/profiles/read.js";
import { updateProfile } from "../../api/profiles/update.js";
import { createEditProfileModal } from "../../ui/components/editProfileModal.js";
import { createListingCard } from "../../ui/components/cards.js";
import { loading } from "../../utils/loadingState.js";
import Logger from "../../utils/logger.js";

const ITEMS_PER_PAGE = 3;

function createProfileHTML(profile) {
  return `
        <h1 class="text-4xl text-center text-brand-text mb-8 mt-4">PROFILE</h1>
        
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
                    <div class="flex justify-between items-start">
                        <div>
                            <p class="text-lg"><strong>Name:</strong> ${
                              profile.name
                            }</p>
                            <p class="text-lg"><strong>Bio:</strong> ${
                              profile.bio || "No bio yet"
                            }</p>
                            <p class="text-lg"><strong>Credits:</strong> ${
                              profile.credits
                            }</p>
                            <p class="text-lg"><strong>Wins:</strong> ${
                              profile._count.wins
                            }</p>
                        </div>
                        <button id="edit-profile" 
                                class="bg-[#E0AFA0] text-brand-text px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors">
                            Edit Profile
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <h2 class="text-xl text-center mb-3">My Listings</h2>
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
                <button id="load-more-listings" class="hidden mt-4 px-6 py-2 bg-[#E0AFA0] text-white rounded-lg hover:bg-opacity-90 transition-colors">Load More</button>
            </div>
        </div>

        <h2 class="text-xl text-center mb-3">My Bids</h2>
        <div class="bg-[#F4F3EE] rounded-lg p-4 mb-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 justify-items-center" id="bids-container"></div>
            <div class="flex justify-center items-center my-8 hidden" id="bids-loader">
                <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-text"></div>
            </div>
            <div class="flex justify-center">
                <button id="load-more-bids" class="hidden mt-4 px-6 py-2 bg-[#E0AFA0] text-white rounded-lg hover:bg-opacity-90 transition-colors">Load More</button>
            </div>
        </div>

        <h2 class="text-xl text-center mb-3">My Wins</h2>
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

export async function initProfile() {
  const username = localStorage.getItem("username");
  if (!username) {
    window.location.href = "/login";
    return;
  }

  let currentPage = {
    listings: 0,
    bids: 0,
    wins: 0,
  };

  try {
    const mainContent = document.querySelector("main");

    // Show skeleton loading for profile
    loading.skeleton(mainContent, 1);

    const { data: profile } = await loading.withLoading(
      'load-profile',
      () => getProfile(username),
      null,
      'Loading profile...'
    );

    mainContent.innerHTML = createProfileHTML(profile);

    const listingsLoader = document.getElementById("listings-loader");
    const listingsContainer = document.getElementById("listings-container");
    const loadMoreListings = document.getElementById("load-more-listings");
    const activeTab = document.getElementById("active-listings-tab");
    const expiredTab = document.getElementById("expired-listings-tab");

    const activeListings =
      profile.listings?.filter(
        (listing) => new Date(listing.endsAt) > new Date()
      ) || [];
    const expiredListings =
      profile.listings?.filter(
        (listing) => new Date(listing.endsAt) <= new Date()
      ) || [];
    let currentListings = activeListings;

    function switchTab(isActive) {
      currentPage.listings = 0;
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

        const start = currentPage.listings * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        const pageListings = currentListings.slice(start, end);

        // Show skeleton for listings
        if (currentPage.listings === 0) {
          loading.skeleton(listingsContainer, ITEMS_PER_PAGE);
        }

        await loading.withLoading(
          `load-listings-page-${currentPage.listings}`,
          async () => {
            await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay

            if (currentPage.listings === 0) {
              listingsContainer.innerHTML = '';
            }

            pageListings.forEach((listing) => {
              const card = createListingCard({
                ...listing,
                seller: { name: profile.name },
                _count: {
                  bids: listing.bids?.length || 0,
                },
                bids: listing.bids || [],
              });
              listingsContainer.appendChild(card);
            });

            currentPage.listings++;

            if (end < currentListings.length) {
              loadMoreListings.classList.remove("hidden");
            }
          },
          null,
          'Loading listings...'
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

    // Handle Bids
    const bidsLoader = document.getElementById("bids-loader");
    const bidsContainer = document.getElementById("bids-container");
    const loadMoreBids = document.getElementById("load-more-bids");

    // Show skeleton loading for bids
    loading.skeleton(bidsContainer, ITEMS_PER_PAGE);

    const { data: bids } = await loading.withLoading(
      'load-profile-bids',
      () => getProfileBids(username),
      null,
      'Loading bids...'
    );

    const activeBids =
      bids
        ?.filter((bid) => new Date(bid.listing.endsAt) > new Date())
        .sort(
          (a, b) => new Date(a.listing.endsAt) - new Date(b.listing.endsAt)
        ) || [];

    async function displayBids() {
      try {
        loadMoreBids.classList.add("hidden");

        const start = currentPage.bids * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        const pageBids = activeBids.slice(start, end);

        // Show skeleton for first page load
        if (currentPage.bids === 0) {
          loading.skeleton(bidsContainer, ITEMS_PER_PAGE);
        }

        await loading.withLoading(
          `load-bids-page-${currentPage.bids}`,
          async () => {
            const listingPromises = pageBids.map(async (bid) => {
              try {
                const { data: listing } = await getListing(bid.listing.id);
                return { ...bid, listing };
              } catch (error) {
                Logger.apiError("fetching listing", error);
                return { ...bid, listing: { seller: { name: "Unknown Seller" } } };
              }
            });

            const bidsWithListings = await Promise.all(listingPromises);

            if (currentPage.bids === 0) {
              bidsContainer.innerHTML = '';
            }

            bidsWithListings.forEach((bid) => {
              const sellerName = bid.listing.seller?.name || "Unknown Seller";

              const card = createListingCard({
                ...bid.listing,
                bids: [{ amount: bid.amount }],
                _count: { bids: bid.listing._count?.bids || 1 },
                seller: { name: sellerName },
              });
              bidsContainer.appendChild(card);
            });

            currentPage.bids++;

            if (end < activeBids.length) {
              loadMoreBids.classList.remove("hidden");
            }
          },
          null,
          'Loading bids...'
        );
      } catch (error) {
        Logger.apiError("displaying bids", error);
        bidsContainer.innerHTML = `<div class="col-span-full text-center py-8">
          <div class="text-red-400 text-4xl mb-2">⚠️</div>
          <p class="text-red-600 mb-2">Unable to load bids</p>
          <button onclick="location.reload()" class="px-4 py-2 bg-brand-nav text-brand-text rounded-lg hover:opacity-90">
            Retry
          </button>
        </div>`;
      }
    }

    if (activeBids.length > 0) {
      displayBids();
      loadMoreBids.addEventListener("click", displayBids);
    } else {
      bidsContainer.innerHTML = '<p class="text-gray-500">No active bids</p>';
    }

    // Handle Wins
    const winsLoader = document.getElementById("wins-loader");
    const winsContainer = document.getElementById("wins-container");
    const loadMoreWins = document.getElementById("load-more-wins");

    // Show skeleton loading for wins
    loading.skeleton(winsContainer, ITEMS_PER_PAGE);

    const { data: wins } = await loading.withLoading(
      'load-profile-wins',
      () => getProfileWins(username),
      null,
      'Loading wins...'
    );

    const sortedWins =
      wins?.sort((a, b) => new Date(b.created) - new Date(a.created)) || [];

    async function displayWins() {
      try {
        loadMoreWins.classList.add("hidden");

        const start = currentPage.wins * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        const pageWins = sortedWins.slice(start, end);

        // Show skeleton for first page load
        if (currentPage.wins === 0) {
          loading.skeleton(winsContainer, ITEMS_PER_PAGE);
        }

        await loading.withLoading(
          `load-wins-page-${currentPage.wins}`,
          async () => {
            await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay

            if (currentPage.wins === 0) {
              winsContainer.innerHTML = '';
            }

            pageWins.forEach((win) => {
              const card = createListingCard({
                ...win,
                seller: { name: win.seller?.name || "Unknown Seller" },
              });
              winsContainer.appendChild(card);
            });

            currentPage.wins++;

            if (end < sortedWins.length) {
              loadMoreWins.classList.remove("hidden");
            }
          },
          null,
          'Loading wins...'
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

    if (sortedWins.length > 0) {
      displayWins();
      loadMoreWins.addEventListener("click", displayWins);
    } else {
      winsContainer.innerHTML = '<p class="text-gray-500">No wins yet</p>';
    }

    // Handle Edit Profile
    const editButton = document.getElementById("edit-profile");
    editButton.addEventListener("click", () => {
      document.body.insertAdjacentHTML(
        "beforeend",
        createEditProfileModal(profile)
      );

      const modal = document.getElementById("edit-profile-modal");
      const form = document.getElementById("edit-profile-form");
      const cancelButton = document.getElementById("cancel-edit");

      cancelButton.addEventListener("click", () => modal.remove());

      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const updateData = {
          bio: form.querySelector("#edit-bio").value,
          avatar: {
            url: form.querySelector("#edit-avatar").value,
            alt: "Profile avatar",
          },
        };

        try {
          await loading.withLoading(
            'update-profile',
            () => updateProfile(username, updateData),
            form,
            'Updating profile...'
          );

          const successMessage = document.createElement("div");
          successMessage.className =
            "fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-transform duration-500 ease-in-out";
          successMessage.textContent = "Profile Updated!";
          document.body.appendChild(successMessage);

          setTimeout(() => {
            successMessage.remove();
            window.location.reload();
          }, 3000);

          modal.remove();
        } catch (error) {
          Logger.apiError("updating profile", error);
          const errorMessage = document.createElement("div");
          errorMessage.className =
            "fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg";
          errorMessage.textContent =
            error.message || "Failed to update profile";
          document.body.appendChild(errorMessage);

          setTimeout(() => errorMessage.remove(), 3000);
        }
      });
    });
  } catch (error) {
    Logger.apiError("loading profile", error);

    // Show user-friendly error message
    const mainContent = document.querySelector("main");
    mainContent.innerHTML = `<div class="text-center py-12">
      <div class="text-red-400 text-6xl mb-4">⚠️</div>
      <p class="text-lg text-red-600 mb-2">Unable to load profile</p>
      <p class="text-sm text-gray-600 mb-4">Please check your connection and try again</p>
      <button onclick="location.reload()" class="px-4 py-2 bg-brand-nav text-brand-text rounded-lg hover:opacity-90">
        Retry
      </button>
    </div>`;
  }
}
