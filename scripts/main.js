// main.js file

import { fetchActivity, fetchImage } from "./apiService.js";
import { showAlert } from "./alerts.js";

const suggestionEl = document.getElementById("suggestion");
const typeEl = document.getElementById("type");
const imageEl = document.getElementById("image");
const participantsEl = document.getElementById("participants");
const newSuggestionBtn = document.getElementById("newSuggestion");
const saveFavoriteBtn = document.getElementById("saveFavorite");

let currentActivity = null;

async function renderActivity(data) {
    console.log("Fetched activity:", data); // Debug line
    suggestionEl.textContent = data.activity || "No activity found";
    typeEl.textContent = data.type ? `Type: ${data.type}` : "Type: unknown";
    const imageUrl = await fetchImage(data.activity);
    imageEl.src = imageUrl;
    showAlert("New activity loaded!", "success");
}

function saveFavorite() {
    if (!currentActivity) return;

    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favorites.push(currentActivity);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    showAlert("Activity saved to favorites!", "success");
}

newSuggestionBtn.addEventListener("click", () => {
    const participants = participantsEl.value;
    fetchActivity(participants).then(renderActivity);
});

saveFavoriteBtn.addEventListener("click", saveFavorite);

window.addEventListener("load", () => {
    fetchActivity().then(renderActivity);
});