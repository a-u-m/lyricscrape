chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url && tab.url.includes("youtube") && tab.url.includes("watch")) {
    if (changeInfo.status == "complete") {
      console.log("again");
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
