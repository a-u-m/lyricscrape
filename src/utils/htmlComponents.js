const noLyrics = document.createElement("div");
noLyrics.setAttribute("id", "lyrics-loader-container");
noLyrics.innerText =
  "lyrics not found! Maybe there is some issue with the metadata. Wanna try searching manually?";

const noMetadata = document.createElement("div");
noMetadata.setAttribute("id", "lyrics-loader-container");
noMetadata.innerText =
  "Whoops! No Metadata found. Wanna try searching manually?";

const orDialog = document.createElement("div");
orDialog.setAttribute("id", "ce-or-dialog");
orDialog.innerHTML = `
<b>Things you may try when you are not satified with the result or you get a wrong output.</b>
<ul>
<li>If wrong lyrics, click on the search icon on the top right corner to search manually.</li>
<li>Try refreshing to solve any DOM related issues.</li>
</ul>`;

const searchIcon = document.createElement("div");
searchIcon.setAttribute("id", "ce-manual-search-icon");
searchIcon.classList.add("ce-display-none");
searchIcon.classList.add("displayHandlerIcon");
searchIcon.innerHTML = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="gray" class="w-6 h-6">
  <path d="M8.25 10.875a2.625 2.625 0 115.25 0 2.625 2.625 0 01-5.25 0z" />
  <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.125 4.5a4.125 4.125 0 102.338 7.524l2.007 2.006a.75.75 0 101.06-1.06l-2.006-2.007a4.125 4.125 0 00-3.399-6.463z" clip-rule="evenodd" />
</svg>

`;

const goBackIcon = document.createElement("div");
goBackIcon.setAttribute("id", "ce-manual-back-icon");
goBackIcon.classList.add("ce-display-none");
goBackIcon.classList.add("displayHandlerIcon");
goBackIcon.innerHTML = `
<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 24 24"
  fill="gray"
  class="w-6 h-6"
>
  <path
    fill-rule="evenodd"
    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-4.28 9.22a.75.75 0 000 1.06l3 3a.75.75 0 101.06-1.06l-1.72-1.72h5.69a.75.75 0 000-1.5h-5.69l1.72-1.72a.75.75 0 00-1.06-1.06l-3 3z"
    clip-rule="evenodd"
  />
</svg>
`;

const manualInputForm = document.createElement("div");
manualInputForm.setAttribute("id", "ce-manual-form-box");
manualInputForm.innerHTML = `
    <input id="artistInput" class="manual-input" type="text" placeholder="artist" required>
    <input id="songInput" class="manual-input" type="text" placeholder="song title" required>
    <div id="ce-manual-button">Search</div>
`;

const loadingAnimation = document.createElement("div");
loadingAnimation.setAttribute("id", "ce-lyrics-loader-container");
loadingAnimation.innerHTML = `
<svg id="ce-lyrics-loader-svg" viewBox="25 25 50 50">
<circle id="ce-lyrics-loader-circle" r="20" cy="50" cx="50">
</circle></svg>`;

const loadingAnimationBlock = document.createElement("div");
loadingAnimationBlock.setAttribute("id", "ce-primary-inner-loading-block");
loadingAnimationBlock.setAttribute("show", true);
loadingAnimationBlock.classList.add("ce-display-none");
loadingAnimationBlock.classList.add("ce-inner-first-container");
loadingAnimationBlock.appendChild(loadingAnimation);

const primaryInnerLyricsBlock = document.createElement("div");
primaryInnerLyricsBlock.setAttribute("id", "ce-primary-inner-lyrics-block");
primaryInnerLyricsBlock.setAttribute("show", false);
primaryInnerLyricsBlock.classList.add("ce-display-none");
primaryInnerLyricsBlock.classList.add("ce-inner-first-container");
primaryInnerLyricsBlock.appendChild(searchIcon);
// primaryInnerLyricsBlock.innerHTML = "";
// primaryInnerLyricsBlock.appendChild(loadingAnimation);

const primaryInnerLyricsToggler = document.createElement("div");
primaryInnerLyricsToggler.setAttribute("id", "ce-primary-inner-lyrics-toggler");
primaryInnerLyricsToggler.innerText = "Show Lyrics";

const innerManualBlock = document.createElement("div");
innerManualBlock.setAttribute("id", "ce-primary-inner-manual-block");
innerManualBlock.setAttribute("show", false);
innerManualBlock.classList.add("ce-display-none");
innerManualBlock.classList.add("ce-inner-first-container");
innerManualBlock.appendChild(manualInputForm);
innerManualBlock.appendChild(orDialog);

export {
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
};
