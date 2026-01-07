const statusEl = document.getElementById("status");
const volumeEl = document.getElementById("volume");
const bgVideo = document.getElementById("bgVideo");

if (bgVideo) {
  bgVideo.muted = true; 
  bgVideo.play().catch((err) => {
    console.log("Video autoplay blocked:", err);
    document.addEventListener(
      "click",
      () => {
        bgVideo.play().catch(() => {});
      },
      { once: true }
    );
  });
}

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
      hue: Math.random() * 360,
    });
  }
}

function animate() {
  fxCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);

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

const soundFiles = {
  clap: "assets/audio/clap.mp3",
  kick: "assets/audio/kick.mp3",
  snare: "assets/audio/snare.mp3",
  hihat: "assets/audio/hihat.mp3",
  boom: "assets/audio/boom.mp3",
  laugh: "assets/audio/laugh.mp3",
};

const audioMap = {};
for (const [key, path] of Object.entries(soundFiles)) {
  const a = new Audio(path);
  a.preload = "auto";
  audioMap[key] = a;
}

document.querySelectorAll(".pad").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const soundName = btn.dataset.sound;
    statusEl.textContent = `Ai apăsat: ${soundName}`;

    spawnBurst(e.clientX, e.clientY);

    const audio = audioMap[soundName];
    if (!audio) {
      statusEl.textContent = `Nu există sunet pentru: ${soundName}`;
      return;
    }

    audio.volume = Number(volumeEl.value);
    audio.currentTime = 0;

    audio
      .play()
      .then(() => console.log("Playing:", soundName))
      .catch((err) => {
        console.log("Audio play error:", err);
        statusEl.textContent = "Audio error (vezi Console F12)";
      });
  });
});



