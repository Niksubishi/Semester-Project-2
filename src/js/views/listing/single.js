import { API_LISTINGS } from "../../constants/api.js";
import { calculateTimeLeft } from "../../ui/components/cards.js";
import { headers } from "../../constants/headers.js";
import { createCarousel, setupCarousel } from "../../ui/components/carousel.js";
import { placeBid } from "../../ui/handlers/bidHandler.js";

function createListingHTML(listing) {
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
                    <a href="/src/pages/user/index.html?name=${
                      listing.seller.name
                    }" 
                       class="text-brand-text hover:underline">${
                         listing.seller.name
                       }</a>
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

  if (!id) {
    window.location.href = "/404.html";
    return;
  }

  try {
    const response = await fetch(
      `${API_LISTINGS.SINGLE(id)}?_seller=true&_bids=true`,
      {
        headers: headers(),
      }
    );
    const { data } = await response.json();

    const mainContent = document.querySelector("main");
    mainContent.innerHTML = createListingHTML(data);

    requestAnimationFrame(() => {
      setupCarousel();
    });

    const isLoggedIn = Boolean(localStorage.getItem("token"));
    const bidButton = document.getElementById("bid-button");
    const bidInput = document.getElementById("bid-amount");

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
  } catch (error) {
    console.error("Error fetching listing:", error);
  }
}
