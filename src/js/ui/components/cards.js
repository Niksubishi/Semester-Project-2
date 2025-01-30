export function createListingCard(listing) {
  const card = document.createElement("div");
  card.className = "flex flex-col";

  const imageLink = document.createElement("a");
  imageLink.href = `/src/pages/listing/index.html?id=${listing.id}`;

  const image = document.createElement("img");
  image.src = listing.media[0]?.url || "default-image.jpg";
  image.alt = listing.media[0]?.alt || listing.title;
  image.className = "w-[280px] h-[320px] object-cover rounded-2xl";

  imageLink.appendChild(image);

  const content = document.createElement("div");
  content.className = "mt-4 w-[280px]";

  const titleLink = document.createElement("a");
  titleLink.href = `/src/pages/listing/index.html?id=${listing.id}`;

  const title = document.createElement("h3");
  title.className = "font-bold text-lg mb-2";
  title.textContent = listing.title;

  titleLink.appendChild(title);

  const seller = document.createElement("p");
  seller.className = "text-brand-text mb-2";
  seller.textContent = `By: ${listing.seller?.name || "Unknown"}`;

  const currentBid = document.createElement("p");
  currentBid.className = "text-brand-text mb-2";
  currentBid.textContent = `Total Bids: ${listing._count?.bids || 0}`;

  const timeLeft = document.createElement("p");
  timeLeft.className = "text-brand-text";
  timeLeft.textContent = `Time Left: ${calculateTimeLeft(listing.endsAt)}`;

  content.append(titleLink, seller, currentBid, timeLeft);
  card.append(imageLink, content);

  return card;
}

function calculateTimeLeft(endsAt) {
  const end = new Date(endsAt);
  const now = new Date();
  const diff = end - now;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) {
    return `${days} days`;
  } else if (hours > 0) {
    return `${hours} hours`;
  } else {
    return `${minutes} minutes`;
  }
}
