const canvas = document.querySelector(".starfield");
const ctx = canvas?.getContext("2d");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let stars = [];
let dust = [];
let animationFrame;

function resizeStarfield() {
  if (!canvas || !ctx) return;

  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  const { innerWidth: width, innerHeight: height } = window;
  canvas.width = Math.floor(width * pixelRatio);
  canvas.height = Math.floor(height * pixelRatio);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

  const starCount = Math.floor(Math.min(360, Math.max(150, (width * height) / 5600)));
  const dustCount = Math.floor(Math.min(62, Math.max(24, (width * height) / 30000)));

  stars = Array.from({ length: starCount }, (_, index) => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 1.25 + 0.28,
    alpha: Math.random() * 0.46 + 0.18,
    twinkle: Math.random() * Math.PI * 2,
    drift: (Math.random() * 0.05 + 0.012) * (index % 2 ? 1 : -1),
    glow: Math.random() > 0.78,
    tint: Math.random() > 0.78 ? "warm" : Math.random() > 0.58 ? "cool" : "white",
  }));

  dust = Array.from({ length: dustCount }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 2.2 + 0.8,
    alpha: Math.random() * 0.075 + 0.028,
    speed: Math.random() * 0.045 + 0.012,
  }));
}

function drawStarfield(time = 0) {
  if (!canvas || !ctx) return;

  const width = window.innerWidth;
  const height = window.innerHeight;
  ctx.clearRect(0, 0, width, height);

  for (const particle of dust) {
    if (!reduceMotion) {
      particle.x += particle.speed;
      particle.y -= particle.speed * 0.22;
      if (particle.x > width + 8) particle.x = -8;
      if (particle.y < -8) particle.y = height + 8;
    }

    ctx.beginPath();
    ctx.fillStyle = `rgba(154, 174, 202, ${particle.alpha})`;
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  for (const star of stars) {
    if (!reduceMotion) {
      star.x += star.drift;
      if (star.x < -2) star.x = width + 2;
      if (star.x > width + 2) star.x = -2;
    }

    const pulse = reduceMotion ? 0 : Math.sin(time * 0.0012 + star.twinkle) * 0.08;
    const alpha = Math.max(0.04, star.alpha + pulse);
    const color =
      star.tint === "warm"
        ? `rgba(231, 202, 139, ${alpha})`
        : star.tint === "cool"
          ? `rgba(130, 205, 218, ${alpha})`
          : `rgba(235, 239, 244, ${alpha})`;

    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fill();

    if (star.glow) {
      ctx.beginPath();
      ctx.fillStyle = color.replace(`${alpha})`, `${Math.min(alpha * 0.22, 0.12)})`);
      ctx.arc(star.x, star.y, star.radius * 3.1, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  if (!reduceMotion) {
    animationFrame = window.requestAnimationFrame(drawStarfield);
  }
}

if (canvas && ctx) {
  resizeStarfield();
  drawStarfield();
  window.addEventListener("resize", () => {
    window.cancelAnimationFrame(animationFrame);
    resizeStarfield();
    drawStarfield();
  });
}

const revealTargets = document.querySelectorAll(
  ".metrics, .research-card, .publication-list li, .timeline article, .talk-grid article, .expand-panel",
);

revealTargets.forEach((target) => target.classList.add("reveal"));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
);

revealTargets.forEach((target) => observer.observe(target));

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

document.querySelectorAll("[data-toggle]").forEach((button) => {
  const target = document.getElementById(button.dataset.toggle);
  if (!target) return;

  button.addEventListener("click", () => {
    const willOpen = target.hidden;
    target.hidden = !willOpen;
    button.setAttribute("aria-expanded", String(willOpen));
    button.textContent = willOpen ? "Show less" : "See more >>";

    if (willOpen) {
      target.classList.add("is-visible");
      target.querySelectorAll(".reveal").forEach((item) => item.classList.add("is-visible"));
    }
  });
});
