import { createListing } from "../../api/listings/create.js";

export async function initCreate() {
  const form = document.getElementById("create-listing-form");
  const token = localStorage.getItem("token");

  if (!token) {
    redirectToLogin();
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const currentToken = localStorage.getItem("token");
    if (!currentToken) {
      redirectToLogin();
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
      await createListing(formData, currentToken);
      showSuccessMessage();
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } catch (error) {
      alert(error.message);
    }
  });
}

function redirectToLogin() {
  const returnUrl = encodeURIComponent(window.location.href);
  window.location.href = `/src/pages/login/?returnTo=${returnUrl}`;
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
