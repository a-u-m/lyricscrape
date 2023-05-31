const manualInputForm = document.createElement("div");
manualInputForm.setAttribute("id", "ce-manual-form-box");
manualInputForm.innerHTML = `
    <input id="artistInput" class="manual-input" type="text" placeholder="artist" required>
    <input id="songInput" class="manual-input" type="text" placeholder="song title" required>
    <div id="ce-manual-button">Search</div>
`;

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
<b>or you may</b>
<ul>
<li>Try Reloading the page</li>
<li>Try Reloading the page</li>
</ul>`;

const loadingAnimation = document.createElement("div");
loadingAnimation.setAttribute("id", "ce-lyrics-loader-container");
loadingAnimation.innerHTML = `
<svg id="ce-lyrics-loader-svg" viewBox="25 25 50 50">
<circle id="ce-lyrics-loader-circle" r="20" cy="50" cx="50">
</circle></svg>`;

export { manualInputForm, noLyrics, noMetadata, orDialog, loadingAnimation };
