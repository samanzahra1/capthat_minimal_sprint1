// Toggle capture mode in the current tab AND start a fresh board
document.getElementById("toggle-capture").addEventListener("click", async () => {
    // Clear any previous images so this is a new moodboard
    await chrome.storage.local.set({ capturedImages: [] });
  
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.tabs.sendMessage(tab.id, { type: "TOGGLE_CAPTURE_MODE" });
  });
  
  // Open simple built-in moodboard page
  document.getElementById("open-moodboard").addEventListener("click", () => {
    chrome.tabs.create({ url: chrome.runtime.getURL("moodboard.html") });
  });