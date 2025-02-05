import { API_LISTINGS } from "../../constants/api.js";
import { headers } from "../../constants/headers.js";

export async function initCreate() {
  const form = document.getElementById("create-listing-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You need to be logged in to create a listing.");
      return;
    }

    const formData = {
      title: form.title.value,
      description: form.description.value,
      tags: form.tags.value
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      media: form.media.value
        .split(",")
        .map((url) => ({
          url: url.trim(),
          alt: "Listing image",
        }))
        .filter((media) => media.url),
      endsAt: new Date(form.endsAt.value).toISOString(),
    };

    try {
      const response = await fetch(API_LISTINGS.BASE, {
        method: "POST",
        headers: headers(token),
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        showSuccessMessage();
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      } else {
        const error = await response.json();
        alert(error.message);
      }
    } catch (error) {
      console.error("Error creating listing:", error);
      alert("Failed to create listing");
    }
  });
}

function showSuccessMessage() {
  const message = document.createElement("div");
  message.className =
    "fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg";
  message.textContent = "Listing created successfully!";
  document.body.appendChild(message);

  setTimeout(() => {
    message.remove();
  }, 2000);
}
