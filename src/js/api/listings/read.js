import { API_LISTINGS, API_FLAGS } from "../../constants/api.js";

export async function getListings() {
  const response = await fetch(`${API_LISTINGS.BASE}?${API_FLAGS.SELLER}`);
  const { data } = await response.json();
  return data;
}
