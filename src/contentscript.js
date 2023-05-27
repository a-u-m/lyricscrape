import { getLyrics, getSong } from "genius-lyrics-api";

const options = {
  apiKey: "",
  title: "",
  artist: "",
  optimizeQuery: true,
};
const addLyricBlock = () => {
  let secondaryInnerLyricBlock = document.querySelector(
    "#secondary-inner-lyrics"
  );
  if (secondaryInnerLyricBlock === null) {
    const secondaryInnerPanels = document.querySelector(
      "#secondary #secondary-inner #panels"
    );
    secondaryInnerLyricBlock = document.createElement("div");
    secondaryInnerLyricBlock.setAttribute("id", "secondary-inner-lyrics");
    secondaryInnerPanels.before(secondaryInnerLyricBlock);
    secondaryInnerLyricBlock.innerHTML =
      '<div id="lyrics-loader-container"><svg id="lyrics-loader-svg" viewBox="25 25 50 50"><circle id="lyrics-loader-circle" r="20" cy="50" cx="50"></circle></svg></div>';
  } else {
    secondaryInnerLyricBlock.innerHTML =
      '<div id="lyrics-loader-container"><svg id="lyrics-loader-svg" viewBox="25 25 50 50"><circle id="lyrics-loader-circle" r="20" cy="50" cx="50"></circle></svg></div>';
  }

  const musicVideoMetadata = document.getElementsByTagName(
    "ytd-video-description-music-section-renderer"
  );
  if (musicVideoMetadata.length) {
    console.log("inside");
    const song = document.querySelector(
      "ytd-video-description-music-section-renderer #info-rows ytd-info-row-renderer:nth-child(1) #default-metadata-section yt-formatted-string"
    );
    const artist = document.querySelector(
      "ytd-video-description-music-section-renderer #info-rows ytd-info-row-renderer:nth-child(2) #default-metadata-section yt-formatted-string"
    );
    options.title = song.textContent.trim();
    options.artist = artist.textContent.trim();
    getLyrics(options).then((lyrics) => {
      if (lyrics === null)
        secondaryInnerLyricBlock.innerHTML =
          '<div id="lyrics-loader-container">lyrics not found!</div>';
      else secondaryInnerLyricBlock.innerText = lyrics;
    });
  } else {
    secondaryInnerLyricBlock.innerHTML =
      "<div>Video doesn't have any metadata</div>";
    return;
  }
};

function handleNoMutations() {
  addLyricBlock();
  observer.disconnect();
}

const observer = new MutationObserver((mutationsList) => {
  clearTimeout(timeout);
  timeout = setTimeout(handleNoMutations, 100);
});

let timeout = setTimeout(handleNoMutations, 100);

const observerConfig = {
  attributes: true,
  childList: true,
  subtree: true,
};

observer.observe(document, observerConfig);
// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//   secondaryInnerLyricBlock.innerHTML =
//     '<div id="lyrics-loader-container"><svg id="lyrics-loader-svg" viewBox="25 25 50 50"><circle id="lyrics-loader-circle" r="20" cy="50" cx="50"></circle></svg></div>';
// });
