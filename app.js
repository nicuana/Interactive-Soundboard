const statusEl = document.getElementById("status");

document.querySelectorAll(".pad").forEach(btn => {
  btn.addEventListener("click", () => {
    statusEl.textContent = `Ai apăsat: ${btn.dataset.sound} (Stage 1)`;
  });
});

const fxCanvas = document.getElementById("fx");
const fxCtx = fxCanvas.getContext("2d");

function resizeFxCanvas() {
  const dpr = window.devicePixelRatio || 1;
  fxCanvas.width = Math.floor(window.innerWidth * dpr);
  fxCanvas.height = Math.floor(window.innerHeight * dpr);
  fxCanvas.style.width = window.innerWidth + "px";
  fxCanvas.style.height = window.innerHeight + "px";
  fxCtx.setTransform(dpr, 0, 0, dpr, 0, 0); 
}
window.addEventListener("resize", resizeFxCanvas);
resizeFxCanvas();

const particles = [];

function spawnBurst(x, y) {
  for (let i = 0; i < 18; i++) {
    particles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 6,
      vy: (Math.random() - 0.5) * 6,
      r: 4 + Math.random() * 10,
      life: 1, 
      hue: Math.random() * 360
    });
  }
}

function animate() {
  fxCtx.fillStyle = "rgba(0, 0, 0, 0.18)";
  fxCtx.fillRect(0, 0, window.innerWidth, window.innerHeight);

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vx *= 0.98;
    p.vy *= 0.98;
    p.life -= 0.02;

    if (p.life <= 0) {
      particles.splice(i, 1);
      continue;
    }

    fxCtx.beginPath();
    fxCtx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2);
    fxCtx.fillStyle = `hsla(${p.hue}, 85%, 60%, ${p.life})`;
    fxCtx.fill();
  }

  requestAnimationFrame(animate);
}
animate();

document.querySelectorAll(".pad").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    spawnBurst(e.clientX, e.clientY);
  });
});
