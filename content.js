console.log("CapThat content script loaded 🚀");

let captureMode = false;
const highlightClass = "capthat-highlight";

function addHighlightStyles() {
  if (document.getElementById("capthat-style")) return;

  const style = document.createElement("style");
  style.id = "capthat-style";
  style.textContent = `
    .${highlightClass} {
      outline: 3px solid #00b894;
      cursor: copy !important;
    }
  `;
  document.head.appendChild(style);
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "TOGGLE_CAPTURE_MODE") {
    captureMode = !captureMode;
    console.log("Capture mode:", captureMode);
    if (captureMode) {
      addHighlightStyles();
      enableCapture();
    } else {
      disableCapture();
    }
  }
});

function enableCapture() {
  document.addEventListener("mouseover", highlightImage, true);
  document.addEventListener("mouseout", unhighlightImage, true);
  document.addEventListener("click", captureImage, true);
}

function disableCapture() {
  document.removeEventListener("mouseover", highlightImage, true);
  document.removeEventListener("mouseout", unhighlightImage, true);
  document.removeEventListener("click", captureImage, true);

  document
    .querySelectorAll("." + highlightClass)
    .forEach((el) => el.classList.remove(highlightClass));
}

function highlightImage(e) {
  if (!captureMode) return;
  const img = e.target.closest("img");
  if (img) img.classList.add(highlightClass);
}

function unhighlightImage(e) {
  const img = e.target.closest("img");
  if (img) img.classList.remove(highlightClass);
}

function captureImage(e) {
  if (!captureMode) return;

  const img = e.target.closest("img");
  if (!img) return;

  e.preventDefault();
  e.stopPropagation();

  const src = img.src;
  if (!src) return;

  chrome.storage.local.get({ capturedImages: [] }, (data) => {
    const images = data.capturedImages || [];
    if (!images.includes(src)) {
      images.push(src);
      chrome.storage.local.set({ capturedImages: images }, () => {
        console.log("Captured image; storage now:", images);
      });
    }
  });
}