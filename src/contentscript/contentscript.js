import "./video-page.css";

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
} from "../utils/htmlComponents";

(async () => {
  let lyricscrapeSettings = { fontSize: 12, lineHeight: 1.45 },
    gSearchIcon,
    gGoBackIcon,
    gVideoId,
    gPrimaryInnerLyricsBlock,
    gPrimaryManualBlock,
    gLoadingBlock,
    gPrimaryInnerLyricsToggler;

  const options = {
    apiKey: "",
    title: "",
    artist: "",
  };

const getLyrics = (options) => {
  return new Promise((resolve, reject) => {
    const port = chrome.runtime.connect({ name: "lyrics-port" });

    port.onMessage.addListener((response) => {
      if (response.success) {
        const lyrics = response.lyrics;
        console.log("Lyrics:", lyrics);
        resolve(lyrics);
        if (lyrics === null) {
          display(gLoadingBlock, gPrimaryManualBlock, noLyrics);
        } else {
          gPrimaryManualBlock.setAttribute("error", false);
          display(gLoadingBlock, gPrimaryInnerLyricsBlock, "");
          gPrimaryInnerLyricsBlock.innerText = lyrics;
        }
        port.disconnect();
      } else {
        console.error("Failed to fetch lyrics:", response.error);
        reject(response.error);
        display(gLoadingBlock, gPrimaryManualBlock, noLyrics);
        port.disconnect();
      }
    });

    port.postMessage({ action: "getLyrics", options });
  });
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

  const dispayInit = () => {
    gSearchIcon.classList.add("ce-display-none");
    gGoBackIcon.classList.add("ce-display-none");

    gLoadingBlock.setAttribute("show", true);
    gPrimaryInnerLyricsBlock.setAttribute("show", false);
    gPrimaryManualBlock.setAttribute("show", false);

    gLoadingBlock.classList.add("ce-display-none");
    gPrimaryInnerLyricsBlock.classList.add("ce-display-none");
    gPrimaryManualBlock.classList.add("ce-display-none");

    gPrimaryInnerLyricsToggler.innerText = "Show Lyrics";
  };

  const display = (srcBlock, dstBlock, error) => {
    srcBlock.setAttribute("show", false);
    dstBlock.setAttribute("show", true);

    if (
      gLoadingBlock.classList.contains("ce-display-none") &&
      gPrimaryInnerLyricsBlock.classList.contains("ce-display-none") &&
      gPrimaryManualBlock.classList.contains("ce-display-none")
    ) {
      dstBlock.classList.add("ce-display-none");
      if (
        dstBlock.id === "ce-primary-inner-manual-block" &&
        dstBlock.getAttribute("error") === "true"
      ) {
        gSearchIcon.classList.add("ce-display-none");
        gGoBackIcon.classList.add("ce-display-none");
        if (dstBlock.firstChild.id === "lyrics-loader-container") {
          dstBlock.removeChild(gPrimaryManualBlock.firstChild);
        }
        dstBlock.prepend(error);
      }
    } else {
      srcBlock.classList.add("ce-display-none");
      dstBlock.classList.remove("ce-display-none");
      if (dstBlock.id === "ce-primary-inner-lyrics-block") {
        gGoBackIcon.classList.add("ce-display-none");
        gSearchIcon.classList.remove("ce-display-none");
      } else if (dstBlock.id === "ce-primary-inner-manual-block") {
        if (dstBlock.getAttribute("error") === "true") {
          gSearchIcon.classList.add("ce-display-none");
          gGoBackIcon.classList.add("ce-display-none");
          if (dstBlock.firstChild.id === "lyrics-loader-container") {
            dstBlock.removeChild(gPrimaryManualBlock.firstChild);
          }
          dstBlock.prepend(error);
        } else {
          gSearchIcon.classList.add("ce-display-none");
          gGoBackIcon.classList.remove("ce-display-none");
        }
      } else {
        gSearchIcon.classList.add("ce-display-none");
        gGoBackIcon.classList.add("ce-display-none");
      }
    }
  };

  const theme = () => {
    if (lyricscrapeSettings.theme === "light") {
      gPrimaryInnerLyricsBlock.classList.remove("ce-lyrics-block-dark");
      gPrimaryManualBlock.classList.remove("ce-lyrics-block-dark");
      gLoadingBlock.classList.remove("ce-lyrics-block-dark");
      gPrimaryInnerLyricsToggler.classList.remove("ce-lyrics-toggler-dark");

      gPrimaryInnerLyricsBlock.classList.add("ce-lyrics-block-light");
      gPrimaryManualBlock.classList.add("ce-lyrics-block-light");
      gLoadingBlock.classList.add("ce-lyrics-block-light");
      gPrimaryInnerLyricsToggler.classList.add("ce-lyrics-toggler-light");
    } else {
      gPrimaryInnerLyricsBlock.classList.remove("ce-lyrics-block-light");
      gPrimaryManualBlock.classList.remove("ce-lyrics-block-light");
      gLoadingBlock.classList.remove("ce-lyrics-block-light");
      gPrimaryInnerLyricsToggler.classList.remove("ce-lyrics-toggler-light");

      gPrimaryInnerLyricsBlock.classList.add("ce-lyrics-block-dark");
      gPrimaryManualBlock.classList.add("ce-lyrics-block-dark");
      gLoadingBlock.classList.add("ce-lyrics-block-dark");
      gPrimaryInnerLyricsToggler.classList.add("ce-lyrics-toggler-dark");
    }
  };

  const toggleHandler = (event) => {
    if (gPrimaryInnerLyricsBlock.getAttribute("show") == "true") {
      gPrimaryInnerLyricsBlock.classList.toggle("ce-display-none");
      gSearchIcon.classList.toggle("ce-display-none");
    } else if (gPrimaryManualBlock.getAttribute("show") == "true") {
      gPrimaryManualBlock.classList.toggle("ce-display-none");
      if (gPrimaryManualBlock.getAttribute("error") == null) {
        gGoBackIcon.classList.toggle("ce-display-none");
      }
    } else gLoadingBlock.classList.toggle("ce-display-none");
    if (event.srcElement.innerText.trim() === "Show Lyrics")
      event.srcElement.innerText = "Hide Lyrics";
    else event.srcElement.innerText = "Show Lyrics";
  };

  const fetchLyrics = async () => {
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
      getLyrics(options);
    } else {
      gPrimaryManualBlock.setAttribute("error", true);
      display(gLoadingBlock, gPrimaryManualBlock, noMetadata);
    }
  };

  const manualLyricSearch = async () => {
    options.artist = document.querySelector(
      "#ce-manual-form-box #artistInput"
    ).value;
    options.title = document.querySelector(
      "#ce-manual-form-box #songInput"
    ).value;
    display(gPrimaryManualBlock, gLoadingBlock, "");
    getLyrics(options);
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

  const mutationObserver = () => {
    const ytExtraDescription = document.querySelector(
      '#description ytd-text-inline-expander div[slot="extra-content"]'
    );
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
      observer.disconnect();
      console.log("No changes detected.");
      console.log("firing up fetchlyrics");
      await fetchLyrics();
    };
    let timeout = setTimeout(timeoutFunction, 1000);
  };

  const addBaseStructure = () => {
    const parentBlock = document.querySelector("#secondary #secondary-inner ");
    let primaryLyricsBlock = document.querySelector("#ce-primary-lyrics-block");

    if (!primaryLyricsBlock && parentBlock) {
      primaryLyricsBlock = document.createElement("div");
      primaryLyricsBlock.setAttribute("id", "ce-primary-lyrics-block");

      gSearchIcon = searchIcon;
      gGoBackIcon = goBackIcon;
      gLoadingBlock = loadingAnimationBlock;
      gPrimaryInnerLyricsBlock = primaryInnerLyricsBlock;
      gPrimaryManualBlock = innerManualBlock;
      gPrimaryInnerLyricsToggler = primaryInnerLyricsToggler;

      dispayInit();

      // font settings

      gPrimaryInnerLyricsBlock.style.fontSize =
        lyricscrapeSettings.fontSize + "px";
      gPrimaryInnerLyricsBlock.style.lineHeight =
        lyricscrapeSettings.lineHeight;

      // Event Listners

      const searchButton = gPrimaryManualBlock.querySelector(
        "#ce-manual-form-box #ce-manual-button"
      );

      searchButton.addEventListener("click", manualLyricSearch);
      gSearchIcon.addEventListener("click", () => {
        display(gPrimaryInnerLyricsBlock, gPrimaryManualBlock, "");
      });
      gGoBackIcon.addEventListener("click", () => {
        display(gPrimaryManualBlock, gPrimaryInnerLyricsBlock, "");
      });
      gPrimaryInnerLyricsToggler.addEventListener("click", toggleHandler);

      // Theme based on yt theme

      theme();

      //

      primaryLyricsBlock.appendChild(gSearchIcon);
      primaryLyricsBlock.appendChild(gGoBackIcon);
      primaryLyricsBlock.appendChild(gLoadingBlock);
      primaryLyricsBlock.appendChild(gPrimaryInnerLyricsBlock);
      primaryLyricsBlock.appendChild(gPrimaryManualBlock);
      primaryLyricsBlock.appendChild(gPrimaryInnerLyricsToggler);
      parentBlock.prepend(primaryLyricsBlock);
    } else {
      gSearchIcon = document.querySelector("#ce-manual-search-icon");
      gGoBackIcon = document.querySelector("#ce-manual-back-icon");
      gLoadingBlock = document.querySelector("#ce-primary-inner-loading-block");
      gPrimaryInnerLyricsBlock = document.querySelector(
        "#ce-primary-inner-lyrics-block"
      );
      gPrimaryManualBlock = document.querySelector(
        "#ce-primary-inner-manual-block"
      );
      gPrimaryInnerLyricsToggler = document.querySelector(
        "#ce-primary-inner-lyrics-toggler"
      );

      dispayInit();

      // handle light theme ---- default for dark theme
      theme();

      // font settings
      gPrimaryInnerLyricsBlock.style.fontSize =
        lyricscrapeSettings.fontSize + "px";
      primaryInnerLyricsBlock.style.lineHeight = lyricscrapeSettings.lineHeight;
    }

    console.log("observing description mutation");
    mutationObserver();
    // setTimeout(fetchLyrics, 1000);
  };

  await retrieveSettings();
  gVideoId = await getVideoIdLocalStorage("lyricscrape-videoId");
  waitDOMYtReqComponent();
  chrome.storage.onChanged.addListener(storageChangeHandler);
})();
