import { showAlert } from "./alerts.js";

// -------------------- Helpers --------------------
function saveToFavorites(key, item) {
    const list = JSON.parse(localStorage.getItem(key)) || [];
    list.push(item);
    localStorage.setItem(key, JSON.stringify(list));
}

function removeFromFavorites(key, index) {
    const list = JSON.parse(localStorage.getItem(key)) || [];
    list.splice(index, 1);
    localStorage.setItem(key, JSON.stringify(list));
}

// -------------------- Activities --------------------
function loadFavorites() {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    renderFavorites(favorites);
}

function renderFavorites(favorites) {
    const favoritesListEl = document.getElementById("favorites-list");
    const emptyMessageEl = document.getElementById("empty-message");

    favoritesListEl.innerHTML = "";

    if (favorites.length === 0) {
        emptyMessageEl.style.display = "block";
        return;
    }

    emptyMessageEl.style.display = "none";

    favorites.forEach((fav, index) => {
        const li = document.createElement("li");
        li.classList.add("favorite-card");

        li.innerHTML = `
      <strong>⭐ ${fav.activity}</strong><br/>
      <em>Type: ${fav.type || "Unknown"}</em><br/>
      ${fav.price !== undefined ? `<span>Price: ${formatPrice(fav.price)}</span><br/>` : ""}
      ${fav.duration ? `<span>Duration: ${fav.duration}</span><br/>` : ""}
      <button data-index="${index}" class="remove-btn">Remove</button>
    `;

        favoritesListEl.appendChild(li);
    });

    // Attach remove handlers
    favoritesListEl.querySelectorAll(".remove-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const idx = e.target.dataset.index;
            removeFromFavorites("favorites", idx);
            loadFavorites();
            showAlert("Activity removed 🗑", "error");
        });
    });
}

function formatPrice(value) {
    if (value === 0) return "Free";
    if (value <= 0.3) return "Low cost";
    if (value <= 0.6) return "Moderate cost";
    return "High cost";
}

// -------------------- Jokes --------------------
function renderFavoriteJokes() {
    const jokes = JSON.parse(localStorage.getItem("favoriteJokes")) || [];
    const container = document.getElementById("jokesContainer");
    container.innerHTML = "";

    if (jokes.length === 0) {
        container.innerHTML = "<p>No saved jokes yet 😢</p>";
        return;
    }

    const ul = document.createElement("ul");
    ul.classList.add("favorites-grid");

    jokes.forEach((joke, index) => {
        const li = document.createElement("li");
        li.classList.add("favorite-card");

        li.innerHTML = `
      <strong>😂 Joke #${index + 1}</strong><br/>
      <em>${joke.setup}</em><br/>
      <span>${joke.punchline}</span><br/>
      <button data-index="${index}" class="remove-btn">Remove</button>
    `;

        ul.appendChild(li);
    });

    container.appendChild(ul);

    // Attach remove handlers
    container.querySelectorAll(".remove-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const idx = e.target.dataset.index;
            removeFromFavorites("favoriteJokes", idx);
            renderFavoriteJokes();
            showAlert("Joke removed 🗑", "error");
        });
    });
}

// -------------------- Initialize --------------------
window.addEventListener("load", () => {
    loadFavorites();
    renderFavoriteJokes();
});