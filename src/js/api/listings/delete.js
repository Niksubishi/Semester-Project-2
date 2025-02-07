import { API_LISTINGS } from "../../constants/api.js";
import { headers } from "../../constants/headers.js";

export async function deleteListing(id) {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("You need to be logged in to delete a listing.");
  }

  const response = await fetch(API_LISTINGS.SINGLE(id), {
    method: "DELETE",
    headers: headers(token),
  });

  if (!response.ok) {
    throw new Error("Failed to delete listing");
  }

  return true;
}
