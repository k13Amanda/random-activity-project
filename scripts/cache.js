// cache.js

const CACHE_KEY = "imageCache";

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
    return cache[activity] || null;
}

// Store image in cache
export function setCachedImage(activity, imageUrl) {
    const cache = loadCache();
    cache[activity] = imageUrl;
    saveCache(cache);
}