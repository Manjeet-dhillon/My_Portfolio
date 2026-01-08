/* ===== Mobile nav ===== */
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

navToggle?.addEventListener("click", () => {
  const open = navLinks.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(open));
});

navLinks?.querySelectorAll("a").forEach(a => {
  a.addEventListener("click", () => {
    navLinks.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

/* ===== Smooth scroll (native) ===== */
document.documentElement.style.scrollBehavior = "smooth";

/* ===== Reveal on scroll ===== */
const revealEls = Array.from(document.querySelectorAll(".reveal"));
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add("is-visible");
  });
}, { threshold: 0.15 });

revealEls.forEach(el => io.observe(el));

/* ===== Footer year ===== */
document.getElementById("year").textContent = new Date().getFullYear();

/* ===== Contact form (mailto) ===== */
const form = document.getElementById("contactForm");
form?.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const name = String(data.get("name") || "");
  const email = String(data.get("email") || "");
  const subject = String(data.get("subject") || "");
  const message = String(data.get("message") || "");

  const to = "Manjeetsinght655@gmail.com";
  const fullSubject = encodeURIComponent(subject || "Portfolio Query");
  const body = encodeURIComponent(
`Name: ${name}
Email: ${email}

Message:
${message}
`
  );

  window.location.href = `mailto:${to}?subject=${fullSubject}&body=${body}`;
});

/* ===== Ambient particles (no libraries) ===== */
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d", { alpha: true });

let W = 0, H = 0, DPR = Math.min(window.devicePixelRatio || 1, 2);
let particles = [];
let mouse = { x: -9999, y: -9999 };

function resize() {
  W = window.innerWidth;
  H = window.innerHeight;
  DPR = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(W * DPR);
  canvas.height = Math.floor(H * DPR);
  canvas.style.width = W + "px";
  canvas.style.height = H + "px";
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

  const count = Math.floor(Math.min(140, (W * H) / 18000));
  particles = new Array(count).fill(0).map(() => ({
    x: Math.random() * W,
    y: Math.random() * H,
    r: 1 + Math.random() * 2.2,
    vx: (-0.25 + Math.random() * 0.5),
    vy: (-0.25 + Math.random() * 0.5),
    a: 0.25 + Math.random() * 0.35
  }));
}

window.addEventListener("resize", resize);
window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
}, { passive: true });

function step() {
  ctx.clearRect(0, 0, W, H);

  // subtle gradient glow
  const g = ctx.createRadialGradient(mouse.x, mouse.y, 20, mouse.x, mouse.y, 220);
  g.addColorStop(0, "rgba(40,215,255,0.12)");
  g.addColorStop(1, "rgba(40,215,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  // particles + connections
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];

    p.x += p.vx;
    p.y += p.vy;

    if (p.x < -10) p.x = W + 10;
    if (p.x > W + 10) p.x = -10;
    if (p.y < -10) p.y = H + 10;
    if (p.y > H + 10) p.y = -10;

    // draw particle
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(234,240,255,${p.a})`;
    ctx.fill();

    // connect nearby
    for (let j = i + 1; j < particles.length; j++) {
      const q = particles[j];
      const dx = p.x - q.x, dy = p.y - q.y;
      const d2 = dx*dx + dy*dy;
      const max = 130;
      if (d2 < max * max) {
        const alpha = 0.06 * (1 - Math.sqrt(d2) / max);
        ctx.strokeStyle = `rgba(138,92,255,${alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(step);
}

resize();
step();
