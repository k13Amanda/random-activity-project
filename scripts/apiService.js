// apiService.js
import { getCachedImage, setCachedImage } from "./cache.js";

const UNSPLASH_KEY = "GDEPa_G7zFAva2TIeIByEpXJF5CJdDlbkH5i3GEid7E"; // Replace with your Unsplash key

// Fetch random activity from Le Wagon Bored API
export async function fetchActivity(participants = 1) {
    try {
        const res = await fetch(`https://bored.api.lewagon.com/api/activity?participants=${participants}`);
        const data = await res.json();

        console.log("Fetched activity:", data); // Debug
        return data;
    } catch (err) {
        console.error("Error fetching activity:", err);
        throw err;
    }
}

// Fetch image from Unsplash with caching
export async function fetchImage(activity) {
    const cached = getCachedImage(activity);
    if (cached) return cached;

    try {
        const res = await fetch(
            `https://api.unsplash.com/search/photos?query=${encodeURIComponent(activity)}&client_id=${UNSPLASH_KEY}`
        );
        const data = await res.json();
        const imageUrl = data.results[0]?.urls?.regular || "assets/fallback.jpg";

        setCachedImage(activity, imageUrl);
        return imageUrl;
    } catch (err) {
        console.error("Error fetching image:", err);
        return "assets/fallback.jpg";
    }
}