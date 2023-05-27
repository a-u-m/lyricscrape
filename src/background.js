chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url && tab.url.includes("youtube")) {
    if (changeInfo.status == "complete") {
      console.log("DOM loaded");
      console.log(tabId);
      chrome.scripting
        .executeScript({
          target: { tabId: tabId },
          files: ["contentscript.js"],
        })
        .then(() => console.log("script injected "));
    }
  }
});
