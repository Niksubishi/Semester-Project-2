export function createCarousel(media = []) {
  if (!media.length) {
    return `<img src="/src/assets/images/noimage.png" alt="No image available" class="w-full h-auto rounded-lg object-cover">`;
  }

  return `
        <div class="relative w-full" data-carousel-container>
            <div class="overflow-hidden rounded-lg">
                <div class="flex transition-transform duration-300 ease-in-out" data-carousel-track>
                    ${media
                      .map(
                        (image, index) => `
                        <div class="w-full flex-shrink-0">
                            <img src="${image.url}" alt="${
                          image.alt || "Listing Image"
                        }" class="w-full h-auto rounded-lg object-cover">
                        </div>
                    `
                      )
                      .join("")}
                </div>
            </div>
            ${
              media.length > 1
                ? `
                <button type="button" class="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-[#E0AFA0] hover:text-white transition-colors" data-carousel-prev>←</button>
                <button type="button" class="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-[#E0AFA0] hover:text-white transition-colors" data-carousel-next>→</button>
            `
                : ""
            }
        </div>
    `;
}

export function setupCarousel() {
  let currentIndex = 0;
  const track = document.querySelector("[data-carousel-track]");
  const prevButton = document.querySelector("[data-carousel-prev]");
  const nextButton = document.querySelector("[data-carousel-next]");

  track.style.width = `${track.children.length * 100}%`;
  Array.from(track.children).forEach((child) => {
    child.style.width = `${100 / track.children.length}%`;
  });

  function moveSlide(direction) {
    currentIndex =
      direction === "next"
        ? (currentIndex + 1) % track.children.length
        : (currentIndex - 1 + track.children.length) % track.children.length;

    track.style.transform = `translateX(-${
      currentIndex * (100 / track.children.length)
    }%)`;
  }

  prevButton?.addEventListener("click", () => moveSlide("prev"), true);
  nextButton?.addEventListener("click", () => moveSlide("next"), true);
}
