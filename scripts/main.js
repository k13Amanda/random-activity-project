// main.js file

import { fetchActivity, fetchImage } from "./apiService.js";
import { showAlert } from "./alerts.js";

const suggestionEl = document.getElementById("suggestion");
const typeEl = document.getElementById("type");
const imageEl = document.getElementById("image");
const priceEl = document.getElementById("price");       // New
const durationEl = document.getElementById("duration"); // New
const participantsEl = document.getElementById("participants");
const activityTypeEl = document.getElementById("activity-type");
const newSuggestionBtn = document.getElementById("newSuggestion");
const saveFavoriteBtn = document.getElementById("saveFavorite");

let currentActivity = null;

async function renderActivity(data) {
    console.log("Fetched activity:", data);
    suggestionEl.textContent = data.activity || "No activity found";
    typeEl.textContent = data.type ? `Type: ${data.type}` : "Type: unknown";

    // Price formatting
    priceEl.textContent = data.price !== undefined
        ? `Price: ${formatPrice(data.price)}`
        : "Price: unknown";

    // Duration (if provided by API)
    durationEl.textContent = data.duration
        ? `Duration: ${data.duration}`
        : "Duration: unknown";

    try {
        const imageUrl = await fetchImage(data.activity);
        imageEl.src = imageUrl || "images/fallback.jpg"; // ✅ use images/ not assets/
        imageEl.onerror = () => {
            imageEl.src = "images/fallback.jpg";
        };
    } catch (err) {
        console.error("Image fetch failed:", err);
        imageEl.src = "images/fallback.jpg";
    }

    if (data.isFallback) {
        showAlert("No activity found for that type — showing a random one instead.", "warning");
    } else {
        showAlert("New activity loaded!", "success");
    }

    currentActivity = data; // ✅ ensures favorites work
}

function saveFavorite() {
    if (!currentActivity) return;

    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favorites.push(currentActivity);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    showAlert("Activity saved to favorites!", "success");
}

newSuggestionBtn.addEventListener("click", async () => {
    const participants = participantsEl.value;
    const type = activityTypeEl.value;

    const data = await fetchActivity(participants, type);
    renderActivity(data);
});

saveFavoriteBtn.addEventListener("click", saveFavorite);

window.addEventListener("load", () => {
    fetchActivity().then(renderActivity);
});

// Utility: format price nicely
function formatPrice(value) {
    if (value === 0) return "Free";
    if (value <= 0.3) return "Low cost";
    if (value <= 0.6) return "Moderate cost";
    return "High cost";
}


document.getElementById("priceFill").style.width = `${data.price * 100}%`;