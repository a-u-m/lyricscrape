import { getLyrics } from '../scrape/getLyrics';

chrome.runtime.onConnect.addListener((port) => {
  if (port.name === 'lyrics-port') {
    port.onMessage.addListener(async (message) => {
      if (message.action === 'getLyrics') {
        const options = message.options;
        console.log(options);
        try {
          const lyrics = await getLyrics(options);
          console.log(lyrics);
          port.postMessage({ success: true, lyrics });
        } catch (error) {
          port.postMessage({
            success: false,
            error: 'Failed to fetch lyrics.',
          });
        }
      }
    });
  }
});

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
  const videoId = url.searchParams.get('v');
  console.log(videoId);
  await setVideoIdLocalStorage('lyricscrape-videoId', videoId)
    .then(() => {
      console.log('Value set in LocalStorage');
    })
    .catch((error) => {
      console.error('Error setting value in LocalStorage:', error);
    });
  if (tab.url && tab.url.includes('youtube') && tab.url.includes('watch')) {
    if (changeInfo.status == 'complete') {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabId },
          files: ['contentscript.js'],
        },
        () => {
          console.log('Script injected');
        },
      );
      chrome.scripting.insertCSS({
        files: ['video-page.css'],
        target: { tabId: tabId },
      });
    }
  }
});
