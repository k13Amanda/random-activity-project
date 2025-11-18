// main.js file

import dotenv from "dotenv";
dotenv.config();

const UNSPLASH_KEY = "GDEPa_G7zFAva2TIeIByEpXJF5CJdDlbkH5i3GEid7E"

const suggestionEl = document.getElementById("suggestion");
const typeEl = document.getElementById("type");
const imageEl = document.getElementById("image");
const participantsEl = document.getElementById("participants");
const newSuggestionBtn = document.getElementById("newSuggestion");
const alertEl = document.getElementById("alert");




const imageCache = {};



async function fetchActivity(participants = 1) {
    try {
        const res = await fetch(`https://www.boredapi.com/api/activity?participants=${participants}`);
        const data = await res.json();
        renderActivity(data);
    } catch (err) {
        showAlert("Failed to fetch activity.");
    }
}




async function fetchImage(activity) {
    try {
        const res = await fetch(
            `https://api.unsplash.com/search/photos?query=${encodeURIComponent(activity)}&client_id=${UNSPLASH_KEY}`
        );
        const data = await res.json();
        return data.results[0]?.urls?.regular || "assets/fallback.jpg";
    } catch (err) {
        return "assets/fallback.jpg";
    }
}


// async function fetchImage(activity) {
//     if (imageCache[activity]) return imageCache[activity];

//     try {
//         const res = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(activity)}&client_id=YOUR_ACCESS_KEY`);
//         const data = await res.json();
//         const imageUrl = data.results[0]?.urls?.regular || "fallback.jpg";
//         imageCache[activity] = imageUrl;
//         return imageUrl;
//     } catch (err) {
//         return "fallback.jpg";
//     }
// }




async function renderActivity(data) {
    suggestionEl.textContent = data.activity;
    typeEl.textContent = `Type: ${data.type}`;
    const imageUrl = await fetchImage(data.activity);
    imageEl.src = imageUrl;
    showAlert("New activity loaded!");
}



function showAlert(message) {
    alertEl.textContent = message;
    alertEl.style.opacity = 1;
    setTimeout(() => {
        alertEl.style.opacity = 0;
    }, 2000);
}



newSuggestionBtn.addEventListener("click", () => {
    const participants = participantsEl.value;
    fetchActivity(participants);
});

window.addEventListener("load", () => {
    fetchActivity();
});