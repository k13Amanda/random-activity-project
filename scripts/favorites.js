// Get references
const favoritesListEl = document.getElementById("favorites-list");
const emptyMessageEl = document.getElementById("empty-message");

// Load favorites from localStorage
function loadFavorites() {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    renderFavorites(favorites);
}

// Render favorites into the list
function renderFavorites(favorites) {
    favoritesListEl.innerHTML = "";

    if (favorites.length === 0) {
        emptyMessageEl.style.display = "block"; // show empty message
        return;
    }

    emptyMessageEl.style.display = "none"; // hide empty message

    favorites.forEach((fav, index) => {
        const li = document.createElement("li");
        li.classList.add("favorite-card"); // for CSS styling

        li.innerHTML = `
      <strong>${fav.activity}</strong><br/>
      <em>Type: ${fav.type || "Unknown"}</em><br/>
      ${fav.price !== undefined ? `<span>Price: ${formatPrice(fav.price)}</span><br/>` : ""}
      ${fav.duration ? `<span>Duration: ${fav.duration}</span><br/>` : ""}
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

// Utility: format price nicely
function formatPrice(value) {
    if (value === 0) return "Free";
    if (value <= 0.3) return "Low cost";
    if (value <= 0.6) return "Moderate cost";
    return "High cost";
}

// Initialize on page load
window.addEventListener("load", loadFavorites);