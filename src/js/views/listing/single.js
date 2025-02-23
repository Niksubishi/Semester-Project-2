import { API_LISTINGS } from "../../constants/api.js";
import { headers } from "../../constants/headers.js";
import { placeBid } from "../../ui/handlers/bidHandler.js";
import { updateListing } from "../../api/listings/update.js";
import { deleteListing } from "../../api/listings/delete.js";
import { calculateTimeLeft } from "../../ui/components/cards.js";
import { createEditModal } from "../../ui/components/editModal.js";
import { createCarousel, setupCarousel } from "../../ui/components/carousel.js";

function createListingHTML(listing) {
  const currentUser = localStorage.getItem("username");
  const isOwner = currentUser === listing.seller.name;

  return `
      <div class="flex flex-col md:flex-row gap-8 mb-8">
          <div class="w-full md:w-1/2">
              ${createCarousel(listing.media)}
          </div>
          <div class="w-full md:w-1/2 space-y-4">
              <h1 class="text-3xl font-semibold text-brand-text">${
                listing.title
              }</h1>
              <p class="text-gray-600">${listing.description}</p>
              <div class="flex gap-2">
                  ${listing.tags
                    .map(
                      (tag) => `
                      <span class="bg-gray-200 px-3 py-1 rounded-full text-sm text-gray-700">${tag}</span>
                  `
                    )
                    .join("")}
              </div>
              <div class="flex items-center gap-3 mt-6">
                  <img src="${
                    listing.seller?.avatar?.url ||
                    "/src/assets/images/auctionpic.png"
                  }" 
                       alt="" 
                       class="w-12 h-12 rounded-full object-cover" />
                  <div class="flex items-center gap-3">
                      <a href="/src/pages/user/index.html?name=${
                        listing.seller.name
                      }" 
                         class="text-brand-text hover:underline">${
                           listing.seller.name
                         }</a>
                      ${
                        isOwner
                          ? `
                          <div class="flex gap-2">
        <button id="edit-button" 
                class="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors">
            Edit
        </button>
        <button id="delete-button" 
                class="bg-red-700 text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors">
            Delete
        </button>
    </div>
                      `
                          : ""
                      }
                  </div>
              </div>
          </div>
      </div>

      <div class="bg-[#F4F3EE] rounded-lg p-6 mb-24">
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
              <div class="space-y-2">
                  <p class="text-brand-text">Auction Created: ${new Date(
                    listing.created
                  ).toLocaleDateString()}</p>
                  <p class="text-brand-text">Auction Ends: ${calculateTimeLeft(
                    listing.endsAt
                  )}</p>
                  <p class="text-brand-text">Current Bid: ${
                    listing._count.bids > 0
                      ? `${
                          listing.bids[listing.bids.length - 1].amount
                        } credits`
                      : "No bids yet"
                  }</p>
                  <p class="text-brand-text">Highest Bidder: ${
                    listing.bids && listing.bids.length > 0
                      ? listing.bids[listing.bids.length - 1].bidder.name
                      : "No bidder yet"
                  }</p>
              </div>
              <div class="space-y-3">
                  <div class="flex gap-3">
                      <input type="number" 
                             id="bid-amount" 
                             class="p-3 rounded-lg focus:outline-none focus:border-brand-text" 
                             placeholder="Enter bid amount" />
                      <button id="bid-button" 
                              class="bg-[#E0AFA0] text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors">
                          Bid
                      </button>
                  </div>
              </div>
          </div>
      </div>
  `;
}

export async function initListing() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const loader = document.getElementById("listingsLoader");

  if (!id) {
    window.location.href = "/404.html";
    return;
  }

  try {
    loader.classList.remove("hidden");

    const response = await fetch(
      `${API_LISTINGS.SINGLE(id)}?_seller=true&_bids=true`,
      {
        headers: headers(),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch listing data");
    }

    const { data } = await response.json();
    const mainContent = document.querySelector("main");

    mainContent.innerHTML = createListingHTML(data);
  } catch (error) {
    console.error("Error loading listing:", error);
    document.querySelector("main").innerHTML =
      "<p class='text-red-500 text-center'>Failed to load listing.</p>";
  } finally {
    loader.classList.add("hidden");
  }

  requestAnimationFrame(() => {
    setupCarousel();
  });

  const isLoggedIn = Boolean(localStorage.getItem("token"));
  const bidButton = document.getElementById("bid-button");
  const bidInput = document.getElementById("bid-amount");
  const editButton = document.getElementById("edit-button");
  const deleteButton = document.getElementById("delete-button");

  if (!isLoggedIn) {
    bidButton.style.display = "none";
    bidInput.style.display = "none";
  }

  if (bidButton) {
    bidButton.addEventListener("click", async () => {
      const amount = bidInput.value;
      try {
        await placeBid(id, amount);
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } catch (error) {
        alert(error.message);
      }
    });
  }

  if (editButton) {
    editButton.addEventListener("click", () => {
      document.body.insertAdjacentHTML("beforeend", createEditModal(data));

      const modal = document.getElementById("edit-modal");
      const form = document.getElementById("edit-form");
      const cancelButton = document.getElementById("cancel-edit");

      cancelButton.addEventListener("click", () => {
        modal.remove();
      });

      form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const updateData = {
          title: form.querySelector("#edit-title").value,
          description: form.querySelector("#edit-description").value,
          tags: form
            .querySelector("#edit-tags")
            .value.split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
          media: form
            .querySelector("#edit-media")
            .value.split(",")
            .map((url) => ({
              url: url.trim(),
              alt: "Listing image",
            }))
            .filter((media) => media.url),
        };

        try {
          await updateListing(id, updateData);
          showSuccessMessage("Listing updated successfully!");
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } catch (error) {
          alert(error.message);
        }
      });
    });
  }

  if (deleteButton) {
    deleteButton.addEventListener("click", async () => {
      if (confirm("Are you sure you want to delete this listing?")) {
        try {
          await deleteListing(id);
          showSuccessMessage("Listing deleted successfully!");
          setTimeout(() => {
            window.location.href = "/";
          }, 2000);
        } catch (error) {
          alert(error.message);
        }
      }
    });
  }
}

function showSuccessMessage(message) {
  const messageEl = document.createElement("div");
  messageEl.className =
    "fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg";
  messageEl.textContent = message;
  document.body.appendChild(messageEl);

  setTimeout(() => {
    messageEl.remove();
  }, 2000);
}
