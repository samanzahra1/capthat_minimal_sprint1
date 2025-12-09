console.log("Moodboard page loaded");

function loadImages() {
  chrome.storage.local.get({ capturedImages: [] }, (data) => {
    const images = data.capturedImages || [];
    console.log("Moodboard read from storage:", images);

    const grid = document.getElementById("grid");
    const empty = document.getElementById("empty");

    grid.innerHTML = "";

    if (!images.length) {
      empty.style.display = "block";
      return;
    }

    empty.style.display = "none";

    images.forEach((src) => {
      const img = document.createElement("img");
      img.src = src;
      grid.appendChild(img);
    });
  });
}

document.getElementById("clear").addEventListener("click", () => {
  chrome.storage.local.set({ capturedImages: [] }, () => {
    console.log("Cleared images from storage");
    loadImages();
  });
});

loadImages();