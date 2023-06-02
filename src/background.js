const setVideoIdLocalStorage = (key, value) => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({ [key]: value }, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve();
      }
    });
  });
};

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  const url = new URL(tab.url);
  const videoId = url.searchParams.get("v");
  console.log(videoId);
  await setVideoIdLocalStorage("lyricscrape-videoId", videoId)
    .then(() => {
      console.log("Value set in LocalStorage");
    })
    .catch((error) => {
      console.error("Error setting value in LocalStorage:", error);
    });
  if (tab.url && tab.url.includes("youtube") && tab.url.includes("watch")) {
    if (changeInfo.status == "complete") {
      console.log("again");
      const url = new URL(tab.url);
      const videoId = url.searchParams.get("v");
      console.log(videoId);
      chrome.scripting.executeScript(
        {
          target: { tabId: tabId },
          files: ["contentscript.js"],
        },
        () => {
          console.log("Script injected");
        }
      );
      chrome.scripting.insertCSS({
        files: ["inject.css"],
        target: { tabId: tabId },
      });
    }
  }
});
