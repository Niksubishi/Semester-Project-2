import { API_LISTINGS } from "../../constants/api.js";
import { headers } from "../../constants/headers.js";

export async function createListing(formData, token) {
  try {
    const response = await fetch(API_LISTINGS.BASE, {
      method: "POST",
      headers: headers(token),
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    return response.json();
  } catch (error) {
    Logger.apiError("Error creating listing:", error);
    throw error;
  }
}
