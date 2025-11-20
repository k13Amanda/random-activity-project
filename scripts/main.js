import { fetchActivity, fetchImage } from "./apiService.js";
import { showAlert } from "./alerts.js";

const suggestionEl = document.getElementById("suggestion");
const typeEl = document.getElementById("type");
const imageEl = document.getElementById("image");
const priceFillEl = document.getElementById("priceFill");
const participantsEl = document.getElementById("participants");
const activityTypeEl = document.getElementById("activity-type");
const costLevelEl = document.getElementById("cost-level");
const newSuggestionBtn = document.getElementById("newSuggestion");
const saveFavoriteBtn = document.getElementById("saveFavorite");

let currentActivity = null;

// Utility: format price nicely
function formatPrice(value) {
    if (value === 0) return "Free";
    if (value <= 0.3) return "Low cost";
    if (value <= 0.6) return "Moderate cost";
    return "High cost";
}

function getCostTier(value) {
    if (value === 0) return "free";
    if (value <= 0.3) return "low";
    if (value <= 0.6) return "moderate";
    return "high";
}

function getPriceColor(value) {
    if (value === 0 || value <= 0.3) return "#4caf50"; // green
    if (value <= 0.6) return "#ff9800"; // orange
    return "#f44336"; // red
}

// Render activity
async function renderActivity(data) {
    suggestionEl.textContent = data.activity || "No activity found";
    typeEl.textContent = data.type ? `Type: ${data.type}` : "Type: unknown";

    const priceContextEl = document.querySelector(".price-context");

    if (typeof data.price === "number") {
        const priceLabel = formatPrice(data.price);
        priceFillEl.style.width = `${data.price * 100}%`;
        priceFillEl.style.background = getPriceColor(data.price);
        priceContextEl.textContent = `Relative cost: ${priceLabel}`;
    } else {
        priceFillEl.style.width = "0%";
        priceFillEl.style.background = "#ccc";
        priceContextEl.textContent = "Cost information not available";
    }

    // Image
    try {
        const imageUrl = await fetchImage(data.activity);
        imageEl.src = imageUrl || "images/fallback.jpg";
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

    currentActivity = data;
}

// Save favorite
function saveFavorite() {
    if (!currentActivity) return;
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favorites.push(currentActivity);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    showAlert("Activity saved to favorites!", "success");
}

// Fetch multiple, then filter by cost tier
async function getFilteredSuggestion(participants, type, costTier) {
    const batchSize = 6;
    const suggestions = [];

    for (let i = 0; i < batchSize; i++) {
        const data = await fetchActivity(participants, type);
        suggestions.push(data);
    }

    if (costTier) {
        const filtered = suggestions.filter(
            s => typeof s.price === "number" && getCostTier(s.price) === costTier
        );
        return filtered.length > 0 ? filtered[0] : suggestions[0];
    }

    return suggestions[0];
}

// Events
newSuggestionBtn.addEventListener("click", async () => {
    const participants = participantsEl.value;
    const type = activityTypeEl.value;
    const costTier = costLevelEl.value;

    const data = await getFilteredSuggestion(participants, type, costTier);
    renderActivity(data);
});

saveFavoriteBtn.addEventListener("click", saveFavorite);

window.addEventListener("load", async () => {
    const data = await fetchActivity();
    renderActivity(data);
});