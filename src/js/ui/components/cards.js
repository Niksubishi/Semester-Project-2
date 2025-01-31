export function createListingCard(listing) {
  const card = document.createElement("div");
  card.dataset.listingDate = listing.created;
  card.dataset.endDate = listing.endsAt;
  card.className = "flex flex-col mb-8";

  const imageLink = document.createElement("a");
  imageLink.href = `/src/pages/listing/index.html?id=${listing.id}`;

  const image = document.createElement("img");
  image.src = listing.media[0]?.url || "src/assets/images/noimage.png";
  image.alt = listing.media[0]?.alt || listing.title;
  image.className = "w-[280px] h-[320px] object-cover rounded-2xl";

  imageLink.appendChild(image);

  const content = document.createElement("div");
  content.className = "mt-2 w-[280px]";

  const titleLink = document.createElement("a");
  titleLink.href = `/src/pages/listing/index.html?id=${listing.id}`;

  const title = document.createElement("h3");
  title.className = "text-lg mb-1";
  title.textContent = listing.title;

  titleLink.appendChild(title);

  const seller = document.createElement("p");
  seller.className = "text-brand-text";

  const sellerLink = document.createElement("a");
  sellerLink.href = `/src/pages/user/index.html?name=${listing.seller.name}`;
  sellerLink.className = "hover:text-opacity-80";
  sellerLink.textContent = listing.seller.name;

  seller.textContent = "By: ";
  seller.appendChild(sellerLink);

  const currentPrice = document.createElement("p");
  currentPrice.className = "text-brand-text";

  if (listing.bids && listing.bids.length > 0) {
    const highestBid = listing.bids.sort((a, b) => b.amount - a.amount)[0];
    const isEnded = new Date(listing.endsAt) <= new Date();
    const priceLabel = isEnded ? "Final Price" : "Current Price";
    currentPrice.textContent = `${priceLabel}: $${highestBid.amount}`;
  } else {
    currentPrice.textContent = "Current Price: No bids yet";
  }
  const currentBid = document.createElement("p");
  currentBid.className = "text-brand-text";
  currentBid.textContent = `Total Bids: ${listing._count?.bids || 0}`;

  const timeLeft = document.createElement("p");
  timeLeft.className = "text-brand-text";
  timeLeft.textContent = `Time Left: ${calculateTimeLeft(listing.endsAt)}`;

  content.append(titleLink, seller, currentPrice, currentBid, timeLeft);
  card.append(imageLink, content);

  return card;
}

function calculateTimeLeft(endsAt) {
  const end = new Date(endsAt);
  const now = new Date();
  const diff = end - now;

  if (diff <= 0) {
    return "Ended";
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) {
    return `${days} day${days !== 1 ? "s" : ""}`;
  } else if (hours > 0) {
    return `${hours} hour${hours !== 1 ? "s" : ""}`;
  } else {
    return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
  }
}
