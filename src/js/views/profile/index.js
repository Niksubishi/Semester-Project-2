import {
  getProfile,
  getProfileBids,
  getProfileWins,
} from "../../api/profiles/read.js";
import { updateProfile } from "../../api/profiles/update.js";
import { createEditProfileModal } from "../../ui/components/editProfileModal.js";
import { createListingCard } from "../../ui/components/cards.js";

function createProfileHTML(profile) {
  return `
        <h1 class="text-4xl font-semibold text-center text-brand-text mb-8">PROFILE</h1>
        
        <div class="bg-[#F4F3EE] rounded-lg p-6 mb-8">
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
                                class="bg-[#E0AFA0] text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors">
                            Edit Profile
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <h2 class="text-2xl font-semibold mb-4">My Listings</h2>
        <div class="bg-[#F4F3EE] rounded-lg p-6 mb-8">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="listings-container">
            </div>
        </div>

        <h2 class="text-2xl font-semibold mb-4">My Bids</h2>
        <div class="bg-[#F4F3EE] rounded-lg p-6 mb-8">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="bids-container">
            </div>
        </div>

        <h2 class="text-2xl font-semibold mb-4">My Wins</h2>
        <div class="bg-[#F4F3EE] rounded-lg p-6 mb-8">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="wins-container">
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

  try {
    const { data: profile } = await getProfile(username);
    const mainContent = document.querySelector("main");
    mainContent.innerHTML = createProfileHTML(profile);

    // Handle Listings
    const listingsContainer = document.getElementById("listings-container");
    if (profile.listings?.length > 0) {
      profile.listings.forEach((listing) => {
        const card = createListingCard({
          ...listing,
          seller: { name: profile.name },
          media: listing.media || [
            {
              url: "/src/assets/images/noimage.png",
              alt: "No image available",
            },
          ],
        });
        listingsContainer.appendChild(card);
      });
    } else {
      listingsContainer.innerHTML =
        '<p class="text-gray-500">No listings yet</p>';
    }

    // Handle Bids
    const { data: bids } = await getProfileBids(username);
    const bidsContainer = document.getElementById("bids-container");

    // Filter for active listings only
    const activeBids = bids
      ?.filter((bid) => new Date(bid.listing.endsAt) > new Date())
      .sort((a, b) => new Date(a.listing.endsAt) - new Date(b.listing.endsAt));

    if (activeBids?.length > 0) {
      activeBids.forEach((bid) => {
        const listingData = {
          ...bid.listing,
          bids: [{ amount: bid.amount }],
          _count: { bids: bid.listing._count?.bids || 1 },
          seller: bid.listing.seller || { name: "Unknown Seller" },
        };
        const card = createListingCard(listingData);
        bidsContainer.appendChild(card);
      });
    } else {
      bidsContainer.innerHTML = '<p class="text-gray-500">No active bids</p>';
    }

    // Handle Wins
    const { data: wins } = await getProfileWins(username);
    const winsContainer = document.getElementById("wins-container");
    if (wins?.length > 0) {
      wins.forEach((win) => {
        const card = createListingCard({
          ...win,
          seller: { name: win.seller?.name || "Unknown Seller" },
          media: win.media || [
            {
              url: "/src/assets/images/noimage.png",
              alt: "No image available",
            },
          ],
        });
        winsContainer.appendChild(card);
      });
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
          window.location.reload();
        } catch (error) {
          alert(error.message);
        }
      });
    });
  } catch (error) {
    console.error("Error loading profile:", error);
  }
}
