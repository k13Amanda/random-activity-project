import { fetchActivity, fetchImage } from "./apiService.js";
import { showAlert } from "./alerts.js";

// Card elements
const suggestionEl = document.getElementById("suggestion");
const typeEl = document.getElementById("type");
const imageEl = document.getElementById("image");
const priceFillEl = document.getElementById("priceFill");
const priceContextEl = document.querySelector(".price-context");

// Flow elements
const questionFormEl = document.getElementById("question-form");
const questionStepEl = document.getElementById("question-step");
const nextBtn = document.getElementById("nextBtn");
const activityCardEl = document.getElementById("activity-card");

// Controls (visible after first suggestion)
const participantsEl = document.getElementById("participants");
const activityTypeEl = document.getElementById("activity-type");
const costLevelEl = document.getElementById("cost-level");
const newSuggestionBtn = document.getElementById("newSuggestion");
const saveFavoriteBtn = document.getElementById("saveFavorite");

let currentActivity = null;
let step = 0;
let answers = { participants: null, type: null, cost: null };

// Helpers
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
    if (value === 0 || value <= 0.3) return "#4caf50";
    if (value <= 0.6) return "#ff9800";
    return "#f44336";
}

// Render activity
async function renderActivity(data) {
    suggestionEl.textContent = data.activity || "No activity found";
    typeEl.textContent = data.type ? `Type: ${data.type}` : "Type: unknown";

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

    try {
        const imageUrl = await fetchImage(data.activity);
        imageEl.src = imageUrl || "images/fallback.jpg";
        imageEl.onerror = () => { imageEl.src = "images/fallback.jpg"; };
    } catch {
        imageEl.src = "images/fallback.jpg";
    }

    showAlert("🎉 New activity loaded!", "success");
    currentActivity = data;
}

// Save favorite
function saveFavorite() {
    if (!currentActivity) return;
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favorites.push(currentActivity);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    showAlert("⭐ Activity saved to favorites!", "success");
}

// Fetch multiple, filter by cost
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

// Wizard steps with fun text + emojis
function showStep() {
    if (step === 0) {
        questionStepEl.innerHTML = `
      <p class="question-text">👥 First things first… who’s hanging out today?</p>
      <select id="participantsQ" class="question-select">
        <option value="1">Just me, solo adventure ✨</option>
        <option value="2">Me + a buddy 👫</option>
        <option value="4">A whole crew 🎉</option>
      </select>
    `;
    } else if (step === 1) {
        questionStepEl.innerHTML = `
      <p class="question-text">🎨 What vibe are you feeling right now?</p>
      <select id="activityTypeQ" class="question-select">
        <option value="">Surprise me 🤔</option>
        <option value="education">Learn something new 📚</option>
        <option value="recreational">Just for fun 😎</option>
        <option value="social">Social 🗣️</option>
        <option value="charity">Do some good ❤️</option>
        <option value="cooking">Cook it up 🍳</option>
        <option value="relaxation">Chill time 🛋️</option>
        <option value="music">Jam out 🎶</option>
        <option value="busywork">Keep busy 📝</option>
      </select>
    `;
    } else if (step === 2) {
        questionStepEl.innerHTML = `
      <p class="question-text">💰 How’s your wallet feeling today?</p>
      <select id="costLevelQ" class="question-select">
        <option value="">Doesn’t matter, surprise me 🎲</option>
        <option value="free">Free please 🙌</option>
        <option value="low">Cheap thrills 💵</option>
        <option value="moderate">Middle of the road ⚖️</option>
        <option value="high">Treat yourself 💎</option>
      </select>
    `;
    } else {
        // All answers collected -> fetch and show card
        questionFormEl.style.display = "none";
        activityCardEl.style.display = "block";

        // Copy answers into permanent dropdowns
        participantsEl.innerHTML = `
      <option value="1">1 Person</option>
      <option value="2">2 People</option>
      <option value="4">Group</option>
    `;
        participantsEl.value = answers.participants;

        activityTypeEl.innerHTML = `
      <option value="">Any Type</option>
      <option value="education">Education</option>
      <option value="recreational">Recreational</option>
      <option value="social">Social</option>
      <option value="charity">Charity</option>
      <option value="cooking">Cooking</option>
      <option value="relaxation">Relaxation</option>
      <option value="music">Music</option>
      <option value="busywork">Busywork</option>
    `;
        activityTypeEl.value = answers.type;

        costLevelEl.innerHTML = `
      <option value="">Any cost</option>
      <option value="free">Free</option>
      <option value="low">Low</option>
      <option value="moderate">Moderate</option>
      <option value="high">High</option>
    `;
        costLevelEl.value = answers.cost;

        getFilteredSuggestion(answers.participants, answers.type, answers.cost)
            .then(renderActivity);
    }
}

// Wizard: next button behavior
nextBtn.addEventListener("click", () => {
    if (step === 0) {
        answers.participants = document.getElementById("participantsQ").value;
    } else if (step === 1) {
        answers.type = document.getElementById("activityTypeQ").value;
    } else if (step === 2) {
        answers.cost = document.getElementById("costLevelQ").value;
    }
    step++;
    showStep();
});

// Card actions (after wizard)
newSuggestionBtn.addEventListener("click", async () => {
    const participants = participantsEl.value;
    const type = activityTypeEl.value;
    const costTier = costLevelEl.value;

    const data = await getFilteredSuggestion(participants, type, costTier);
    renderActivity(data);
});

saveFavoriteBtn.addEventListener("click", saveFavorite);

// Initialize wizard on load
window.addEventListener("load", () => {
    showStep();
});