// apiService.js
import { getCachedImage, setCachedImage } from "./cache.js";

const UNSPLASH_KEY = "GDEPa_G7zFAva2TIeIByEpXJF5CJdDlbkH5i3GEid7E"; // Replace with your Unsplash key

// Fetch random activity with optional type filter
export async function fetchActivity(participants = 1, type = "") {
    try {
        let url = `https://bored.api.lewagon.com/api/activity?participants=${participants}`;
        if (type && type.trim()) {
            url += `&type=${encodeURIComponent(type.trim().toLowerCase())}`;
        }

        const res = await fetch(url);
        const data = await res.json();

        if (data.error) {
            console.warn("No activity found for filters:", { participants, type });
            // Fallback: try again without type
            const fallbackUrl = `https://bored.api.lewagon.com/api/activity?participants=${participants}`;
            const fallbackRes = await fetch(fallbackUrl);
            const fallbackData = await fallbackRes.json();
            fallbackData.isFallback = true; // ✅ mark fallback
            return fallbackData;
        }

        data.isFallback = false; // ✅ mark normal result
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
        const imageUrl = data.results?.[0]?.urls?.regular || "assets/fallback.jpg";

        setCachedImage(activity, imageUrl);
        return imageUrl;
    } catch (err) {
        console.error("Error fetching image:", err);
        return "assets/fallback.jpg";
    }
}