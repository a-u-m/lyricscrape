import { getLyrics, getSong } from "genius-lyrics-api";

const options = {
  apiKey: "",
  title: "",
  artist: "",
  optimizeQuery: true,
};

const fetchLyrics = () => {
  console.log("fetch lyrics");
  const primaryInnerLyricsBlock = document.querySelector(
    "#ce-primary-inner-lyrics-block"
  );
  console.log(primaryInnerLyricsBlock);
  const ytMusicVideoMetadata = document.querySelectorAll(
    "#description ytd-video-description-music-section-renderer"
  );
  if (ytMusicVideoMetadata.length) {
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
        primaryInnerLyricsBlock.innerHTML =
          '<div id="lyrics-loader-container">lyrics not found!</div>';
      else primaryInnerLyricsBlock.innerText = lyrics;
    });
  } else {
    primaryInnerLyricsBlock.innerHTML =
      "<div>Video doesn't have any metadata</div>";
    return;
  }
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
    // Changes detected, perform necessary actions
    console.log(mutationsList);
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
    primaryInnerLyricsBlock.innerHTML =
      '<div id="ce-lyrics-loader-container"><svg id="ce-lyrics-loader-svg" viewBox="25 25 50 50"><circle id="ce-lyrics-loader-circle" r="20" cy="50" cx="50"></circle></svg></div>';

    const primaryInnerLyricsToggler = document.createElement("div");
    primaryInnerLyricsToggler.setAttribute(
      "id",
      "ce-primary-inner-lyrics-toggler"
    );
    primaryInnerLyricsToggler.innerText = "Show Lyrics";
    primaryInnerLyricsToggler.addEventListener("click", toggleHandler);

    primaryLyricsBlock.appendChild(primaryInnerLyricsBlock);
    primaryLyricsBlock.appendChild(primaryInnerLyricsToggler);
    refAdjacentElement.before(primaryLyricsBlock);
  } else {
    const primaryInnerLyricsBlock = document.querySelector(
      "#ce-primary-inner-lyrics-block"
    );
    const primaryInnerLyricsToggler = document.querySelector(
      "#ce-primary-inner-lyrics-toggler"
    );

    primaryInnerLyricsBlock.classList.add("ce-display-none");
    primaryInnerLyricsBlock.innerHTML =
      '<div id="ce-lyrics-loader-container"><svg id="ce-lyrics-loader-svg" viewBox="25 25 50 50"><circle id="ce-lyrics-loader-circle" r="20" cy="50" cx="50"></circle></svg></div>';

    primaryInnerLyricsToggler.innerText = "Show Lyrics";
  }

  mutationObserver();
};

waitDOMYtReqComponent();
