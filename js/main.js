// ===== theme toggle =====
const themeBtn = document.getElementById('themeToggle');
const root = document.body;
const saved = localStorage.getItem('theme');
if (saved) root.classList.toggle('dark', saved === 'dark');
themeBtn.addEventListener('click', () => {
  root.classList.toggle('dark');
  localStorage.setItem('theme', root.classList.contains('dark') ? 'dark' : 'light');
});

// ===== mobile menu =====
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
menuBtn?.addEventListener('click', () => {
  const open = mobileMenu.style.display === 'flex';
  mobileMenu.style.display = open ? 'none' : 'flex';
});
mobileMenu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.style.display = 'none'));

// ===== smooth scroll buttons =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
document.querySelector('.scroll-indicator')?.addEventListener('click', () =>
  document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
);

// ===== intersection observer (reveal on scroll) =====
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ===== simple typewriter =====
const words = ["Ilyas MARDHI", "Full-Stack Engineer", "Problem Solver", "Performance Nerd", "Digital Craftsman"];
const target = document.getElementById('typewriter');
let wi = 0, ci = 0, dir = 1, pause = 0;
function tick() {
  if (!target) return;
  if (pause > 0) { pause--; return requestAnimationFrame(tick); }
  const word = words[wi];
  ci += dir;
  target.textContent = word.slice(0, ci);
  if (ci === word.length) { dir = -1; pause = 25; }
  if (ci === 0) { dir = 1; wi = (wi + 1) % words.length; pause = 8; }
  setTimeout(tick, 60);
}
tick();

// ===== particles background (lightweight) =====
const canvas = document.getElementById('bg');
const ctx = canvas?.getContext('2d');
let W, H, particles;
function resize() {
  if (!canvas) return;
  W = canvas.width = canvas.offsetWidth = canvas.parentElement.offsetWidth;
  H = canvas.height = canvas.offsetHeight = canvas.parentElement.offsetHeight;
  // init particles
  particles = Array.from({ length: 80 }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    vx: (Math.random() - 0.5) * 0.6,
    vy: (Math.random() - 0.5) * 0.6,
    r: Math.random() * 2 + 0.5,
  }));
}
function step() {
  if (!ctx) return;
  ctx.clearRect(0, 0, W, H);
  // gradient backdrop glow
  const grad = ctx.createLinearGradient(0,0,W,H);
  grad.addColorStop(0, 'rgba(110,168,254,0.15)');
  grad.addColorStop(1, 'rgba(171,123,255,0.15)');
  ctx.fillStyle = grad;
  ctx.fillRect(0,0,W,H);

  // particles
  ctx.fillStyle = 'rgba(230,240,255,0.85)';
  for (const p of particles) {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > W) p.vx *= -1;
    if (p.y < 0 || p.y > H) p.vy *= -1;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.fill();
  }
  // links
  ctx.strokeStyle = 'rgba(164,190,255,0.18)';
  for (let i=0;i<particles.length;i++){
    for (let j=i+1;j<particles.length;j++){
      const a = particles[i], b = particles[j];
      const dx = a.x-b.x, dy = a.y-b.y, d = Math.hypot(dx,dy);
      if (d < 110){
        ctx.globalAlpha = 1 - (d/110);
        ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
  }
  requestAnimationFrame(step);
}
window.addEventListener('resize', resize, { passive: true });
resize(); step();

// ===== modals (native <dialog>) =====
document.querySelectorAll('.project').forEach(card => {
  card.addEventListener('click', () => {
    const id = card.getAttribute('data-modal');
    const dlg = document.getElementById(id);
    dlg?.showModal();
  });
});
document.querySelectorAll('.modal .close').forEach(btn => {
  btn.addEventListener('click', e => e.target.closest('dialog')?.close());
});

// ===== footer year =====
document.getElementById('year').textContent = new Date().getFullYear().toString();

// ===== contact form (client-side demo) =====
const form = document.getElementById('contactForm');
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  if (!data.name || !data.email || !data.message){
    form.querySelector('.form-note').textContent = "Please fill all fields.";
    return;
  }
  form.querySelector('.form-note').textContent = "Thanks! I’ll get back to you soon.";
  form.reset();
});
