// apiService.js
import { getCachedImage, setCachedImage } from "./cache.js";

const UNSPLASH_KEY = "GDEPa_G7zFAva2TIeIByEpXJF5CJdDlbkH5i3GEid7E";

// Fetch random activity from BoredAPI
export async function fetchActivity(participants = 1) {
    try {
        const url = `https://boredapi.com/api/activity?participants=${participants}`;
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;

        const res = await fetch(proxyUrl);
        const data = await res.json();
        return data;
    } catch (err) {
        console.error("Error fetching activity:", err);
        throw err;
    }
}


// Fetch image from Unsplash with caching
export async function fetchImage(activity) {
    // Check cache first
    const cached = getCachedImage(activity);
    if (cached) return cached;

    try {
        const res = await fetch(
            `https://api.unsplash.com/search/photos?query=${encodeURIComponent(activity)}&client_id=${UNSPLASH_KEY}`
        );
        const data = await res.json();
        const imageUrl = data.results[0]?.urls?.regular || "assets/fallback.jpg";

        // Save to cache
        setCachedImage(activity, imageUrl);

        return imageUrl;
    } catch (err) {
        console.error("Error fetching image:", err);
        return "assets/fallback.jpg";
    }
}