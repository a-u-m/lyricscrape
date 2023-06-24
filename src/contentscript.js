import { getLyrics } from "../src/scrape/getLyrics";
const axios = require("axios");

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

  async function checkProxy() {
    try {
      const proxyUrl = "http://110.34.13.4:8080";
      const response = await axios.get("https://www.example.com", {
        proxy: {
          host: "110.34.13.4",
          port: 8080,
          protocol: "http",
        },
      });
      const ipAddress = response.data;
      console.log("My IP address:", ipAddress);
      console.log(response.headers);
      const viaHeader = response.headers.via;
      if (viaHeader) {
        console.log("Request was made through a proxy.");
        console.log("Via:", viaHeader);
      } else {
        console.log("Request was not made through a proxy.");
      }
    } catch (error) {
      console.error("Error occurred while testing the proxy:", error);
    }
  }

  async function makeRequest(query) {
    const targetUrl = `https://www.jiosaavn.com/api.php?p=1&q=${query}&_format=json&_marker=0&api_version=4&ctx=web6dot0&n=20&__call=search.getResults`;

    try {
      const response = await axios.get(targetUrl);
      // Return the response from the destination server
      return response.data.results[0].id;
    } catch (error) {
      // Handle any errors
      console.error(error);
      throw error; // Rethrow the error to propagate it to the caller
    }
  }

  async function lyricsRequest(id) {
    const targetUrl = `https://www.jiosaavn.com/api.php?__call=lyrics.getLyrics&ctx=web6dot0&api_version=4&_format=json&_marker=0%3F_marker=0&lyrics_id=${id}`;

    try {
      const response = await axios.get(targetUrl);

      // Return the response from the destination server
      return response.data;
    } catch (error) {
      // Handle any errors
      console.error(error);
      throw error; // Rethrow the error to propagate it to the caller
    }
  }

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

      // await checkProxy();

      try {
        const id = await makeRequest(options.title);
        const lyrics = await lyricsRequest(id);
        console.log(lyrics);
      } catch (error) {
        console.error(error);
      }

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
          gPrimaryManualBlock.setAttribute("error", true);
          display(gLoadingBlock, gPrimaryManualBlock, noLyrics);
        } else {
          gPrimaryManualBlock.setAttribute("error", false);
          display(gLoadingBlock, gPrimaryInnerLyricsBlock, "");
          gPrimaryInnerLyricsBlock.innerText = lyrics;
        }
      });
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
    try {
      const id = await makeRequest(options.title);
      const lyrics = await lyricsRequest(id);
      console.log(lyrics);
    } catch (error) {
      console.error(error);
    }
    await getLyrics(options).then((lyrics) => {
      console.log("lyrics recieved");
      if (lyrics === null) {
        display(gLoadingBlock, gPrimaryManualBlock, noLyrics);
      } else {
        gPrimaryManualBlock.setAttribute("error", false);
        display(gLoadingBlock, gPrimaryInnerLyricsBlock, "");
        gPrimaryInnerLyricsBlock.innerText = lyrics;
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
  console.log(gVideoId);
  console.log(lyricscrapeSettings);
  waitDOMYtReqComponent();
  chrome.storage.onChanged.addListener(storageChangeHandler);
})();
