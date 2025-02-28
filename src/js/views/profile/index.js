import {
  getProfile,
  getProfileBids,
  getProfileWins,
  getListing,
} from "../../api/profiles/read.js";
import { updateProfile } from "../../api/profiles/update.js";
import { createEditProfileModal } from "../../ui/components/editProfileModal.js";
import { createListingCard } from "../../ui/components/cards.js";

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
    const { data: profile } = await getProfile(username);
    const mainContent = document.querySelector("main");
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

    function displayListings() {
      listingsLoader.classList.remove("hidden");
      loadMoreListings.classList.add("hidden");

      const start = currentPage.listings * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE;
      const pageListings = currentListings.slice(start, end);

      setTimeout(() => {
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
        listingsLoader.classList.add("hidden");

        if (end < currentListings.length) {
          loadMoreListings.classList.remove("hidden");
        }
      }, 500);
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

    const { data: bids } = await getProfileBids(username);
    const activeBids =
      bids
        ?.filter((bid) => new Date(bid.listing.endsAt) > new Date())
        .sort(
          (a, b) => new Date(a.listing.endsAt) - new Date(b.listing.endsAt)
        ) || [];

    async function displayBids() {
      bidsLoader.classList.remove("hidden");
      loadMoreBids.classList.add("hidden");

      const start = currentPage.bids * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE;
      const pageBids = activeBids.slice(start, end);

      const listingPromises = pageBids.map(async (bid) => {
        try {
          const { data: listing } = await getListing(bid.listing.id);
          return { ...bid, listing };
        } catch (error) {
          console.error("Error fetching listing:", error);
          return { ...bid, listing: { seller: { name: "Unknown Seller" } } };
        }
      });

      const bidsWithListings = await Promise.all(listingPromises);

      setTimeout(() => {
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
        bidsLoader.classList.add("hidden");

        if (end < activeBids.length) {
          loadMoreBids.classList.remove("hidden");
        }
      }, 500);
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

    const { data: wins } = await getProfileWins(username);

    const sortedWins =
      wins?.sort((a, b) => new Date(b.created) - new Date(a.created)) || [];

    function displayWins() {
      winsLoader.classList.remove("hidden");
      loadMoreWins.classList.add("hidden");

      const start = currentPage.wins * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE;
      const pageWins = sortedWins.slice(start, end);

      setTimeout(() => {
        pageWins.forEach((win) => {
          const card = createListingCard({
            ...win,
            seller: { name: win.seller?.name || "Unknown Seller" },
          });
          winsContainer.appendChild(card);
        });

        currentPage.wins++;
        winsLoader.classList.add("hidden");

        if (end < sortedWins.length) {
          loadMoreWins.classList.remove("hidden");
        }
      }, 500);
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
          await updateProfile(username, updateData);
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
    console.error("Error loading profile:", error);
  }
}
