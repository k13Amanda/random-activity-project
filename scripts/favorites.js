// favorites.js

// Get reference to the favorites list container
const favoritesListEl = document.getElementById("favorites-list");

// Load favorites from localStorage
function loadFavorites() {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    renderFavorites(favorites);
}

// Render favorites into the list
function renderFavorites(favorites) {
    favoritesListEl.innerHTML = "";

    if (favorites.length === 0) {
        favoritesListEl.innerHTML = "<li>No favorites yet!</li>";
        return;
    }

    favorites.forEach((fav, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
      <strong>${fav.activity}</strong> 
      <em>(${fav.type})</em>
      <button data-index="${index}" class="remove-btn">Remove</button>
    `;
        favoritesListEl.appendChild(li);
    });

    // Attach remove handlers
    document.querySelectorAll(".remove-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const idx = e.target.dataset.index;
            removeFavorite(idx);
        });
    });
}

// Remove a favorite
function removeFavorite(index) {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favorites.splice(index, 1);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    loadFavorites();
}

// Initialize on page load
window.addEventListener("load", loadFavorites);




const saveFavoriteBtn = document.getElementById("saveFavorite");
saveFavoriteBtn.addEventListener("click", () => {
    // logic to save current activity
    showAlert("Activity saved to favorites!");
});