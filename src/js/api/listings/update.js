import { API_LISTINGS } from "../../constants/api.js";
import { headers } from "../../constants/headers.js";

export async function updateListing(id, updateData) {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("You need to be logged in to update a listing.");
  }

  const response = await fetch(API_LISTINGS.SINGLE(id), {
    method: "PUT",
    headers: headers(token),
    body: JSON.stringify(updateData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return response.json();
}
