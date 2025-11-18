

// alerts.js
export function showAlert(message, type = "info") {
    const alertEl = document.getElementById("alert");
    if (!alertEl) return;

    // Apply base styles
    alertEl.textContent = message;
    alertEl.className = `alert ${type}`;
    alertEl.style.opacity = 1;

    // Auto-hide after 2 seconds
    setTimeout(() => {
        alertEl.style.opacity = 0;
    }, 2000);
}