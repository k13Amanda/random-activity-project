const CACHE_KEY = "imageCache";
const EXPIRATION_MS = 24 * 60 * 60 * 1000; // 24 hours
const MAX_ENTRIES = 50; // limit cache size

// Load cache from localStorage
function loadCache() {
    return JSON.parse(localStorage.getItem(CACHE_KEY)) || {};
}

// Save cache back to localStorage
function saveCache(cache) {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
}

// Get cached image by activity keyword
export function getCachedImage(activity) {
    const cache = loadCache();
    const entry = cache[activity];

    if (!entry) return null;

    // Check expiration
    if (Date.now() - entry.timestamp > EXPIRATION_MS) {
        delete cache[activity];
        saveCache(cache);
        return null;
    }

    return entry.url;
}

// Store image in cache
export function setCachedImage(activity, imageUrl) {
    const cache = loadCache();

    // Add new entry with timestamp
    cache[activity] = { url: imageUrl, timestamp: Date.now() };

    // Enforce size limit
    const keys = Object.keys(cache);
    if (keys.length > MAX_ENTRIES) {
        // Sort by oldest timestamp and remove extras
        const sorted = keys.sort((a, b) => cache[a].timestamp - cache[b].timestamp);
        const excess = sorted.slice(0, keys.length - MAX_ENTRIES);
        excess.forEach(key => delete cache[key]);
    }

    saveCache(cache);
}