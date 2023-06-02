import { getLyrics, getSong } from "genius-lyrics-api";
import {
  manualInputForm,
  noLyrics,
  noMetadata,
  orDialog,
  loadingAnimation,
  primaryInnerLyricsBlock,
  primaryInnerLyricsToggler,
  innerManualBlock,
  loadingAnimationBlock,
  searchIcon,
  goBackIcon,
} from "./utils/htmlComponents";

const options = {
  apiKey: "",
  title: "",
  artist: "",
  optimizeQuery: true,
};

const getVideoIdLocalStorage = (key) => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get([key], (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(result[key]);
      }
    });
  });
};

const fetchLyrics = async () => {
  const lcPrimaryInnerLyricsBlock = document.querySelector(
    "#ce-primary-inner-lyrics-block"
  );
  const lcPrimaryManualBlock = document.querySelector(
    "#ce-primary-inner-manual-block"
  );
  const lcLoadingBlock = document.querySelector(
    "#ce-primary-inner-loading-block"
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

    console.log("request sent");

    await getLyrics(options).then(async (lyrics) => {
      console.log("lyrics recieved");
      const currentVideoId = await getVideoIdLocalStorage(
        "lyricscrape-videoId"
      );
      if (currentVideoId === gVideoId) console.log("same");
      else {
        console.log("different");
        return;
      }
      console.log("lyrics injected");
      if (lyrics === null) {
        lcLoadingBlock.setAttribute("show", false);
        lcPrimaryInnerLyricsBlock.setAttribute("show", false);
        lcPrimaryManualBlock.setAttribute("show", true);
        lcPrimaryManualBlock.setAttribute("error", true);
        if (lcPrimaryManualBlock.firstChild.id === "lyrics-loader-container")
          lcPrimaryManualBlock.removeChild(lcPrimaryManualBlock.firstChild);
        lcPrimaryManualBlock.prepend(noLyrics);

        if (
          lcLoadingBlock.classList.contains("ce-display-none") &&
          lcPrimaryInnerLyricsBlock.classList.contains("ce-display-none") &&
          lcPrimaryManualBlock.classList.contains("ce-display-none")
        ) {
          lcPrimaryManualBlock.classList.add("ce-display-none");
        } else {
          lcLoadingBlock.classList.add("ce-display-none");
          lcPrimaryManualBlock.classList.remove("ce-display-none");
        }
      } else {
        lcLoadingBlock.setAttribute("show", false);
        lcPrimaryInnerLyricsBlock.setAttribute("show", true);
        lcPrimaryManualBlock.setAttribute("show", false);

        if (
          lcLoadingBlock.classList.contains("ce-display-none") &&
          lcPrimaryInnerLyricsBlock.classList.contains("ce-display-none") &&
          lcPrimaryManualBlock.classList.contains("ce-display-none")
        ) {
          lcPrimaryInnerLyricsBlock.classList.add("ce-display-none");
        } else {
          lcLoadingBlock.classList.add("ce-display-none");
          lcPrimaryInnerLyricsBlock.classList.remove("ce-display-none");
          gSearchIcon.classList.remove("ce-display-none");
          gGoBackIcon.classList.add("ce-display-none");
        }
        lcPrimaryInnerLyricsBlock.innerText = lyrics;
      }
    });
  } else {
    lcLoadingBlock.setAttribute("show", false);
    lcPrimaryInnerLyricsBlock.setAttribute("show", false);
    lcPrimaryManualBlock.setAttribute("show", true);
    lcPrimaryManualBlock.setAttribute("error", true);
    if (lcPrimaryManualBlock.firstChild.id === "lyrics-loader-container")
      lcPrimaryManualBlock.removeChild(lcPrimaryManualBlock.firstChild);
    lcPrimaryManualBlock.prepend(noMetadata);
    if (
      lcLoadingBlock.classList.contains("ce-display-none") &&
      lcPrimaryInnerLyricsBlock.classList.contains("ce-display-none") &&
      lcPrimaryManualBlock.classList.contains("ce-display-none")
    ) {
      lcPrimaryManualBlock.classList.add("ce-display-none");
    } else {
      lcLoadingBlock.classList.add("ce-display-none");
      lcPrimaryManualBlock.classList.remove("ce-display-none");
    }
  }
};

const manualLyricSearch = async () => {
  const lcPrimaryInnerLyricsBlock = document.querySelector(
    "#ce-primary-inner-lyrics-block"
  );
  const lcPrimaryManualBlock = document.querySelector(
    "#ce-primary-inner-manual-block"
  );
  const lcLoadingBlock = document.querySelector(
    "#ce-primary-inner-loading-block"
  );
  options.artist = document.querySelector(
    "#ce-manual-form-box #artistInput"
  ).value;
  options.title = document.querySelector(
    "#ce-manual-form-box #songInput"
  ).value;

  lcLoadingBlock.setAttribute("show", true);
  lcPrimaryInnerLyricsBlock.setAttribute("show", false);
  lcPrimaryManualBlock.setAttribute("show", false);

  if (
    lcLoadingBlock.classList.contains("ce-display-none") &&
    lcPrimaryInnerLyricsBlock.classList.contains("ce-display-none") &&
    lcPrimaryManualBlock.classList.contains("ce-display-none")
  ) {
    lcLoadingBlock.classList.add("ce-display-none");
  } else {
    lcPrimaryManualBlock.classList.add("ce-display-none");
    lcLoadingBlock.classList.remove("ce-display-none");
    gSearchIcon.classList.add("ce-display-none");
    gGoBackIcon.classList.add("ce-display-none");
  }

  await getLyrics(options).then((lyrics) => {
    console.log("lyrics recieved");
    if (lyrics === null) {
      lcLoadingBlock.setAttribute("show", false);
      lcPrimaryInnerLyricsBlock.setAttribute("show", false);
      if (lcPrimaryManualBlock.firstChild.id === "lyrics-loader-container")
        lcPrimaryManualBlock.removeChild(lcPrimaryManualBlock.firstChild);
      lcPrimaryManualBlock.prepend(noLyrics);
      if (
        lcLoadingBlock.classList.contains("ce-display-none") &&
        lcPrimaryInnerLyricsBlock.classList.contains("ce-display-none") &&
        lcPrimaryManualBlock.classList.contains("ce-display-none")
      ) {
        lcPrimaryManualBlock.classList.add("ce-display-none");
      } else {
        lcLoadingBlock.classList.add("ce-display-none");
        lcPrimaryManualBlock.classList.remove("ce-display-none");
      }
    } else {
      lcLoadingBlock.setAttribute("show", false);
      lcPrimaryInnerLyricsBlock.setAttribute("show", true);
      lcPrimaryManualBlock.setAttribute("show", false);

      if (
        lcLoadingBlock.classList.contains("ce-display-none") &&
        lcPrimaryInnerLyricsBlock.classList.contains("ce-display-none") &&
        lcPrimaryManualBlock.classList.contains("ce-display-none")
      ) {
        lcPrimaryInnerLyricsBlock.classList.add("ce-display-none");
      } else {
        lcLoadingBlock.classList.add("ce-display-none");
        lcPrimaryInnerLyricsBlock.classList.remove("ce-display-none");
        gSearchIcon.classList.remove("ce-display-none");
        gGoBackIcon.classList.add("ce-display-none");
      }

      lcPrimaryInnerLyricsBlock.innerText = lyrics;
    }
  });
};

const waitDOMYtReqComponent = () => {
  const ytSecondaryInnerPanel = document.querySelector(
    "#secondary #secondary-inner #panels"
  );

  const ytDescription = document.querySelector(
    "#description ytd-structured-description-content-renderer #items"
  );
  if (!ytSecondaryInnerPanel || !ytDescription) {
    console.log("waiting");
    setTimeout(waitDOMYtReqComponent, 100);
    return;
  } else {
    console.log("adding base structure");
    addBaseStructure();
  }
};

const toggleHandler = (event) => {
  const lcPrimaryInnerLyricsBlock = document.querySelector(
    "#ce-primary-inner-lyrics-block"
  );
  const lcPrimaryManualLyricsBlock = document.querySelector(
    "#ce-primary-inner-manual-block"
  );
  const lcSearchIcon = document.querySelector("#ce-manual-search-icon");
  const lcLoadingAnimationBlock = document.querySelector(
    "#ce-primary-inner-loading-block"
  );
  if (lcPrimaryInnerLyricsBlock.getAttribute("show") == "true") {
    lcPrimaryInnerLyricsBlock.classList.toggle("ce-display-none");
    gSearchIcon.classList.toggle("ce-display-none");
  } else if (lcPrimaryManualLyricsBlock.getAttribute("show") == "true") {
    lcPrimaryManualLyricsBlock.classList.toggle("ce-display-none");
    if (lcPrimaryManualLyricsBlock.getAttribute("error") == null) {
      gGoBackIcon.classList.toggle("ce-display-none");
    }
  } else lcLoadingAnimationBlock.classList.toggle("ce-display-none");
  if (event.srcElement.innerText.trim() === "Show Lyrics")
    event.srcElement.innerText = "Hide Lyrics";
  else event.srcElement.innerText = "Show Lyrics";
};

const mutationObserver = () => {
  const ytExtraDescription = document.querySelector(
    '#description ytd-text-inline-expander div[slot="extra-content"]'
  );
  // const ytExtraDescription = document.querySelectorAll(
  //   "#description #extraco ytd-structured-description-content-renderer"
  // );
  console.log(ytExtraDescription);
  const observer = new MutationObserver((mutationsList) => {
    for (let m of mutationsList) {
      console.log("added nodes " + m.addedNodes);
      console.log("removed nodes " + m.removedNodes);
    }
    clearTimeout(timeout);
    timeout = setTimeout(timeoutFunction, 1000);
  });

  const observerConfig = {
    attributes: true,
    childList: true,
    subtree: true,
  };

  observer.observe(ytExtraDescription, observerConfig);

  const timeoutFunction = async () => {
    // No changes detected within the timeout duration
    // Perform the desired function here
    observer.disconnect();
    console.log("No changes detected.");
    console.log("firing up fetchlyrics");
    await fetchLyrics();
  };

  let timeout = setTimeout(timeoutFunction, 1000);
};

const manualDisplay = () => {
  const lcPrimaryInnerLyricsBlock = document.querySelector(
    "#ce-primary-inner-lyrics-block"
  );
  const lcPrimaryManualBlock = document.querySelector(
    "#ce-primary-inner-manual-block"
  );
  const lcLoadingBlock = document.querySelector(
    "#ce-primary-inner-loading-block"
  );
  lcLoadingBlock.setAttribute("show", false);
  lcPrimaryInnerLyricsBlock.setAttribute("show", false);
  lcPrimaryManualBlock.setAttribute("show", true);

  if (
    lcLoadingBlock.classList.contains("ce-display-none") &&
    lcPrimaryInnerLyricsBlock.classList.contains("ce-display-none") &&
    lcPrimaryManualBlock.classList.contains("ce-display-none")
  ) {
    lcPrimaryManualBlock.classList.add("ce-display-none");
  } else {
    gSearchIcon.classList.add("ce-display-none");
    gGoBackIcon.classList.remove("ce-display-none");
    lcPrimaryInnerLyricsBlock.classList.add("ce-display-none");
    lcPrimaryManualBlock.classList.remove("ce-display-none");
  }
};

const lyricsDisplay = () => {
  const lcPrimaryInnerLyricsBlock = document.querySelector(
    "#ce-primary-inner-lyrics-block"
  );
  const lcPrimaryManualBlock = document.querySelector(
    "#ce-primary-inner-manual-block"
  );
  const lcLoadingBlock = document.querySelector(
    "#ce-primary-inner-loading-block"
  );
  lcLoadingBlock.setAttribute("show", false);
  lcPrimaryInnerLyricsBlock.setAttribute("show", true);
  lcPrimaryManualBlock.setAttribute("show", false);

  if (
    lcLoadingBlock.classList.contains("ce-display-none") &&
    lcPrimaryInnerLyricsBlock.classList.contains("ce-display-none") &&
    lcPrimaryManualBlock.classList.contains("ce-display-none")
  ) {
    lcPrimaryInnerLyricsBlock.classList.add("ce-display-none");
  } else {
    gSearchIcon.classList.remove("ce-display-none");
    gGoBackIcon.classList.add("ce-display-none");
    lcPrimaryManualBlock.classList.add("ce-display-none");
    lcPrimaryInnerLyricsBlock.classList.remove("ce-display-none");
  }
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
    gSearchIcon = searchIcon;
    gGoBackIcon = goBackIcon;
    primaryLyricsBlock.appendChild(gSearchIcon);
    primaryLyricsBlock.appendChild(gGoBackIcon);

    gSearchIcon.addEventListener("click", manualDisplay);
    gGoBackIcon.addEventListener("click", lyricsDisplay);

    loadingAnimationBlock.setAttribute("show", true);
    loadingAnimationBlock.classList.add("ce-display-none");

    primaryInnerLyricsBlock.setAttribute("show", false);
    primaryInnerLyricsBlock.classList.add("ce-display-none");

    innerManualBlock.setAttribute("show", false);
    innerManualBlock.classList.add("ce-display-none");

    const searchButton = innerManualBlock.querySelector(
      "#ce-manual-form-box #ce-manual-button"
    );
    searchButton.addEventListener("click", manualLyricSearch);

    primaryInnerLyricsBlock.style.fontSize =
      lyricscrapeSettings.fontSize + "px";
    primaryInnerLyricsBlock.style.lineHeight = lyricscrapeSettings.lineHeight;

    primaryInnerLyricsToggler.addEventListener("click", toggleHandler);

    // handle light theme ---- default for dark theme
    if (lyricscrapeSettings.theme === "light") {
      primaryInnerLyricsBlock.classList.add("ce-lyrics-block-light");
      loadingAnimationBlock.classList.add("ce-lyrics-block-light");
      innerManualBlock.classList.add("ce-lyrics-block-light");
      primaryInnerLyricsToggler.classList.add("ce-lyrics-toggler-light");
    } else {
      primaryInnerLyricsBlock.classList.add("ce-lyrics-block-dark");
      loadingAnimationBlock.classList.add("ce-lyrics-block-dark");
      innerManualBlock.classList.add("ce-lyrics-block-dark");
      primaryInnerLyricsToggler.classList.add("ce-lyrics-toggler-dark");
    }

    primaryLyricsBlock.appendChild(loadingAnimationBlock);
    primaryLyricsBlock.appendChild(primaryInnerLyricsBlock);
    primaryLyricsBlock.appendChild(innerManualBlock);
    primaryLyricsBlock.appendChild(primaryInnerLyricsToggler);
    refAdjacentElement.before(primaryLyricsBlock);
  } else {
    const lcPrimaryInnerLyricsBlock = document.querySelector(
      "#ce-primary-inner-lyrics-block"
    );
    const lcPrimaryInnerManualBlock = document.querySelector(
      "#ce-primary-inner-manual-block"
    );
    const lcPrimaryInnerLyricsToggler = document.querySelector(
      "#ce-primary-inner-lyrics-toggler"
    );
    const lcLoadingBlock = document.querySelector(
      "#ce-primary-inner-loading-block"
    );
    gSearchIcon = document.querySelector("#ce-manual-search-icon");
    gGoBackIcon = document.querySelector("#ce-manual-back-icon");

    gSearchIcon.classList.add("ce-display-none");
    gGoBackIcon.classList.add("ce-display-none");

    // handle light theme ---- default for dark theme
    if (lyricscrapeSettings.theme === "light") {
      lcPrimaryInnerLyricsBlock.classList.remove("ce-lyrics-block-dark");
      lcPrimaryInnerManualBlock.classList.remove("ce-lyrics-block-dark");
      lcLoadingBlock.classList.remove("ce-lyrics-block-dark");
      lcPrimaryInnerLyricsToggler.classList.remove("ce-lyrics-toggler-dark");

      lcPrimaryInnerLyricsBlock.classList.add("ce-lyrics-block-light");
      lcPrimaryInnerManualBlock.classList.add("ce-lyrics-block-light");
      lcLoadingBlock.classList.add("ce-lyrics-block-light");
      lcPrimaryInnerLyricsToggler.classList.add("ce-lyrics-toggler-light");
    } else {
      lcPrimaryInnerLyricsBlock.classList.remove("ce-lyrics-block-light");
      lcPrimaryInnerManualBlock.classList.remove("ce-lyrics-block-light");
      lcLoadingBlock.classList.remove("ce-lyrics-block-light");
      lcPrimaryInnerLyricsToggler.classList.remove("ce-lyrics-toggler-light");

      lcPrimaryInnerLyricsBlock.classList.add("ce-lyrics-block-dark");
      lcPrimaryInnerManualBlock.classList.add("ce-lyrics-block-dark");
      lcLoadingBlock.classList.add("ce-lyrics-block-dark");
      lcPrimaryInnerLyricsToggler.classList.add("ce-lyrics-toggler-dark");
    }

    lcLoadingBlock.setAttribute("show", true);
    lcPrimaryInnerLyricsBlock.setAttribute("show", false);
    lcPrimaryInnerManualBlock.setAttribute("show", false);

    lcLoadingBlock.classList.add("ce-display-none");
    lcPrimaryInnerManualBlock.classList.add("ce-display-none");
    lcPrimaryInnerLyricsBlock.classList.add("ce-display-none");

    lcPrimaryInnerLyricsBlock.style.fontSize =
      lyricscrapeSettings.fontSize + "px";
    primaryInnerLyricsBlock.style.lineHeight = lyricscrapeSettings.lineHeight;

    lcPrimaryInnerLyricsToggler.innerText = "Show Lyrics";
  }

  console.log("observing description mutation");
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
  gVideoId = await getVideoIdLocalStorage("lyricscrape-videoId");
  console.log(gVideoId);
  console.log(lyricscrapeSettings);
  waitDOMYtReqComponent();
};
let lyricscrapeSettings = { fontSize: 12, lineHeight: 1.45 };
let gSearchIcon, gGoBackIcon, gVideoId;
let gPrimaryInnerLyricsBlock, gPrimaryManualBlock, gLoadingBlock;
// const lcPrimaryInnerLyricsBlock = document.querySelector(
//   "#ce-primary-inner-lyrics-block"
// );
// const lcPrimaryManualBlock = document.querySelector(
//   "#ce-primary-inner-manual-block"
// );
// const lcLoadingBlock = document.querySelector(
//   "#ce-primary-inner-loading-block"
// );
programFLow();
chrome.storage.onChanged.addListener(storageChangeHandler);
