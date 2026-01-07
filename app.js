const statusEl = document.getElementById("status");

document.querySelectorAll(".pad").forEach(btn => {
  btn.addEventListener("click", () => {
    statusEl.textContent = `Ai apăsat: ${btn.dataset.sound} (Stage 1)`;
  });
});
