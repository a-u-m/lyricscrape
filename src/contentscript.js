import { getLyrics, getSong } from "genius-lyrics-api";
import {
  manualInputForm,
  noLyrics,
  noMetadata,
  orDialog,
  loadingAnimation,
} from "./utils/htmlComponents";

const options = {
  apiKey: "",
  title: "",
  artist: "",
  optimizeQuery: true,
};

const fetchLyrics = () => {
  const primaryInnerLyricsBlock = document.querySelector(
    "#ce-primary-inner-lyrics-block"
  );
  const ytMusicVideoMetadata = document.querySelectorAll(
    "#description ytd-video-description-music-section-renderer"
  );
  if (ytMusicVideoMetadata.length) {
    const song = document.querySelector(
      `ytd-video-description-music-section-renderer 
      #info-rows ytd-info-row-renderer:nth-child(1) 
      #default-metadata-section yt-formatted-string`
    );
    const artist = document.querySelector(
      `ytd-video-description-music-section-renderer 
      #info-rows ytd-info-row-renderer:nth-child(2) 
      #default-metadata-section yt-formatted-string`
    );
    options.title = song.textContent.trim().split("(")[0];
    options.artist = artist.textContent.trim().split(",")[0];
    console.log(options.title);
    console.log(options.artist);
    try {
      getLyrics(options).then((lyrics) => {
        if (lyrics === null) {
          primaryInnerLyricsBlock.innerHTML = "";
          primaryInnerLyricsBlock.appendChild(noLyrics);
          primaryInnerLyricsBlock.appendChild(manualInputForm);
          manualLyricSearch();
        } else primaryInnerLyricsBlock.innerText = lyrics;
      });
    } catch (e) {
      primaryInnerLyricsBlock.innerHTML = "";
      primaryInnerLyricsBlock.appendChild(noMetadata);
      primaryInnerLyricsBlock.appendChild(manualInputForm);
      manualLyricSearch();
    }
  } else {
    primaryInnerLyricsBlock.innerHTML = "";
    primaryInnerLyricsBlock.appendChild(noMetadata);
    primaryInnerLyricsBlock.appendChild(manualInputForm);
    primaryInnerLyricsBlock.appendChild(orDialog);
    manualLyricSearch();
  }
};

const manualLyricSearch = () => {
  const manualSearchButton = document.querySelector(
    "#ce-manual-form-box #ce-manual-button"
  );
  const primaryInnerLyricsBlock = document.querySelector(
    "#ce-primary-inner-lyrics-block"
  );
  manualSearchButton.addEventListener("click", (e) => {
    options.artist = document.querySelector(
      "#ce-manual-form-box #artistInput"
    ).value;
    options.title = document.querySelector(
      "#ce-manual-form-box #songInput"
    ).value;
    primaryInnerLyricsBlock.innerHTML = "";
    primaryInnerLyricsBlock.appendChild(loadingAnimation);
    getLyrics(options).then((lyrics) => {
      if (lyrics) primaryInnerLyricsBlock.innerText = lyrics;
      else {
        primaryInnerLyricsBlock.innerHTML = "";
        primaryInnerLyricsBlock.appendChild(noLyrics);
        primaryInnerLyricsBlock.appendChild(manualInputForm);
        manualLyricSearch();
      }
    });
  });
};

const waitDOMYtReqComponent = () => {
  const ytSecondaryInnerPanel = document.querySelector(
    "#secondary #secondary-inner #panels"
  );
  const ytDescription = document.querySelector(
    "#description ytd-text-inline-expander"
  );
  if (!ytSecondaryInnerPanel || !ytDescription) {
    setTimeout(waitDOMYtReqComponent, 50);
    return;
  } else addBaseStructure();
};

const toggleHandler = (event) => {
  const primaryInnerLyricsBlock = document.querySelector(
    "#ce-primary-inner-lyrics-block"
  );
  primaryInnerLyricsBlock.classList.toggle("ce-display-none");
  if (event.srcElement.innerText.trim() === "Show Lyrics")
    event.srcElement.innerText = "Hide Lyrics";
  else event.srcElement.innerText = "Show Lyrics";
};

const mutationObserver = () => {
  const ytDescription = document.querySelector(
    "#description ytd-text-inline-expander"
  );
  const observer = new MutationObserver((mutationsList) => {
    clearTimeout(timeout);
    timeout = setTimeout(timeoutFunction, 1000);
  });

  const observerConfig = {
    attributes: true,
    childList: true,
    subtree: true,
  };

  observer.observe(ytDescription, observerConfig);

  const timeoutFunction = () => {
    // No changes detected within the timeout duration
    // Perform the desired function here
    observer.disconnect();
    console.log("No changes detected.");
    fetchLyrics();
  };

  let timeout = setTimeout(timeoutFunction, 1000);
};

const addBaseStructure = () => {
  let primaryLyricsBlock = document.querySelector("#ce-primary-lyrics-block");
  const refAdjacentElement = document.querySelector(
    //future proofing
    "#secondary #secondary-inner #panels"
  );
  if (!primaryLyricsBlock && refAdjacentElement) {
    primaryLyricsBlock = document.createElement("div");
    primaryLyricsBlock.setAttribute("id", "ce-primary-lyrics-block");

    const primaryInnerLyricsBlock = document.createElement("div");
    primaryInnerLyricsBlock.setAttribute("id", "ce-primary-inner-lyrics-block");
    primaryInnerLyricsBlock.classList.add("ce-display-none");
    primaryInnerLyricsBlock.innerHTML = "";
    primaryInnerLyricsBlock.appendChild(loadingAnimation);
    primaryInnerLyricsBlock.style.fontSize =
      lyricscrapeSettings.fontSize + "px";
    primaryInnerLyricsBlock.style.lineHeight = lyricscrapeSettings.lineHeight;
    // primaryInnerLyricsBlock.appendChild(reloader);

    const primaryInnerLyricsToggler = document.createElement("div");
    primaryInnerLyricsToggler.setAttribute(
      "id",
      "ce-primary-inner-lyrics-toggler"
    );
    primaryInnerLyricsToggler.innerText = "Show Lyrics";
    primaryInnerLyricsToggler.addEventListener("click", toggleHandler);

    // handle light theme ---- default for dark theme
    if (lyricscrapeSettings.theme === "light") {
      primaryInnerLyricsBlock.classList.add("ce-lyrics-block-light");
      primaryInnerLyricsToggler.classList.add("ce-lyrics-toggler-light");
    } else {
      primaryInnerLyricsBlock.classList.add("ce-lyrics-block-dark");
      primaryInnerLyricsToggler.classList.add("ce-lyrics-toggler-dark");
    }

    primaryLyricsBlock.appendChild(primaryInnerLyricsBlock);
    primaryLyricsBlock.appendChild(primaryInnerLyricsToggler);
    // primaryLyricsBlock.appendChild(reloader);
    refAdjacentElement.before(primaryLyricsBlock);
  } else {
    const primaryInnerLyricsBlock = document.querySelector(
      "#ce-primary-inner-lyrics-block"
    );
    const primaryInnerLyricsToggler = document.querySelector(
      "#ce-primary-inner-lyrics-toggler"
    );

    // handle light theme ---- default for dark theme
    if (lyricscrapeSettings.theme === "light") {
      primaryInnerLyricsBlock.classList.remove("ce-lyrics-block-dark");
      primaryInnerLyricsBlock.classList.add("ce-lyrics-block-light");
      primaryInnerLyricsToggler.classList.remove("ce-lyrics-toggler-dark");
      primaryInnerLyricsToggler.classList.add("ce-lyrics-toggler-light");
    } else {
      primaryInnerLyricsBlock.classList.remove("ce-lyrics-block-light");
      primaryInnerLyricsBlock.classList.add("ce-lyrics-block-dark");
      primaryInnerLyricsToggler.classList.remove("ce-lyrics-toggler-light");
      primaryInnerLyricsToggler.classList.add("ce-lyrics-toggler-dark");
    }

    primaryInnerLyricsBlock.classList.add("ce-display-none");
    primaryInnerLyricsBlock.innerHTML = "";
    primaryInnerLyricsBlock.appendChild(loadingAnimation);
    primaryInnerLyricsBlock.style.fontSize =
      lyricscrapeSettings.fontSize + "px";
    primaryInnerLyricsBlock.style.lineHeight = lyricscrapeSettings.lineHeight;

    primaryInnerLyricsToggler.innerText = "Show Lyrics";
  }

  mutationObserver();
  // setTimeout(fetchLyrics, 1000);
};
const retrieveSettings = async () => {
  const result = await new Promise((resolve) => {
    chrome.storage.sync.get(["lyricscrape"], (result) => {
      resolve(result);
    });
  });

  if (result.lyricscrape) {
    if (result.lyricscrape.fontSize) {
      lyricscrapeSettings.fontSize = result.lyricscrape.fontSize;
    }
    if (result.lyricscrape.lineHeight) {
      lyricscrapeSettings.lineHeight = result.lyricscrape.lineHeight;
    }
  }
  const darkVal = document.querySelector("html").getAttribute("dark");
  lyricscrapeSettings.theme = darkVal === "" ? "dark" : "light";
  console.log(lyricscrapeSettings);
};

const storageChangeHandler = (changes, areaName) => {
  if (areaName === "sync" && changes.lyricscrape) {
    const newLyricscrapeValue = changes.lyricscrape.newValue;
    const primaryInnerLyricsBlock = document.querySelector(
      "#ce-primary-inner-lyrics-block"
    );
    primaryInnerLyricsBlock.style.fontSize =
      newLyricscrapeValue.fontSize + "px";
    primaryInnerLyricsBlock.style.lineHeight = newLyricscrapeValue.lineHeight;
  }
};

const programFLow = async () => {
  await retrieveSettings();
  waitDOMYtReqComponent();
};

let lyricscrapeSettings = { fontSize: 12, lineHeight: 1.45 };
programFLow();
chrome.storage.onChanged.addListener(storageChangeHandler);
