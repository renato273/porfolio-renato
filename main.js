const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

document.querySelectorAll(".badge").forEach((badge) => {
  badge.addEventListener("mouseenter", () => badge.classList.add("glow"));
  badge.addEventListener("mouseleave", () => badge.classList.remove("glow"));
});

