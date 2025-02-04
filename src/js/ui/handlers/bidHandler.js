import { API_LISTINGS } from "../../constants/api.js";
import { headers } from "../../constants/headers.js";
import { updateCredits } from "../components/nav.js";

export async function placeBid(listingId, amount) {
  const response = await fetch(`${API_LISTINGS.SINGLE(listingId)}/bids`, {
    method: "POST",
    headers: {
      ...headers(),
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ amount: Number(amount) }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.errors?.[0]?.message || "Failed to place bid");
  }

  const result = await response.json();

  const successMessage = document.createElement("div");
  successMessage.className =
    "fixed top-4 right-4 bg-[#E0AFA0] text-white px-6 py-3 rounded-lg shadow-lg transition-opacity duration-300";
  successMessage.textContent = "Bid placed successfully!";
  document.body.appendChild(successMessage);

  setTimeout(() => {
    successMessage.style.opacity = "0";
    setTimeout(() => successMessage.remove(), 300);
  }, 2700);

  if (result.credits !== undefined) {
    updateCredits(result.credits);
  }

  return result;
}
