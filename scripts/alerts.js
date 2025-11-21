// alerts.js
export function showAlert(message, type = "info") {
    const alertEl = document.getElementById("alert");
    if (!alertEl) return;

    // Apply base styles
    alertEl.textContent = message;
    alertEl.className = `alert ${type} show`; // use .show for CSS animation
    alertEl.style.opacity = 1;

    // Auto-hide after 6 seconds
    setTimeout(() => {
        alertEl.className = "alert"; 
        alertEl.style.opacity = 0;
    }, 6000); 
}