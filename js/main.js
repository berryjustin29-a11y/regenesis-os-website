/* ── NAVBAR SCROLL ─────────────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

/* ── MOBILE MENU ───────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

/* ── SCROLL REVEAL ─────────────────────────────────────── */
const reveals = document.querySelectorAll(
  'section > .container, .problem-card, .pipeline-step, .val-card, .timeline-item, .cred-item, .milestone-item'
);
reveals.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
    }
  });
}, { threshold: 0.08 });

reveals.forEach(el => revealObserver.observe(el));

/* ── ACTIVE NAV LINK ───────────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === '#' + entry.target.id) {
          link.style.color = 'var(--cyan)';
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

/* ── ANIMATED SIGNAL CANVAS ────────────────────────────── */
const canvas = document.getElementById('bioCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Bio signal lines
const lines = Array.from({ length: 6 }, (_, i) => ({
  y: (i + 1) * (window.innerHeight / 7),
  phase: Math.random() * Math.PI * 2,
  freq: 0.008 + Math.random() * 0.006,
  amp: 20 + Math.random() * 40,
  speed: 0.3 + Math.random() * 0.4,
  color: i === 2 ? '#00D4FF' : i === 4 ? '#00E676' : '#0066CC',
  opacity: 0.15 + Math.random() * 0.25,
}));

// Floating particles
const particles = Array.from({ length: 60 }, () => ({
  x: Math.random() * window.innerWidth,
  y: Math.random() * window.innerHeight,
  size: Math.random() * 2,
  vx: (Math.random() - 0.5) * 0.3,
  vy: (Math.random() - 0.5) * 0.3,
  opacity: Math.random() * 0.4,
  color: Math.random() > 0.7 ? '#00D4FF' : '#0066CC',
}));

let frame = 0;
let disorderPhase = 0; // 0=ordered, 1=disordering, 2=disordered

function drawBioSignal(line, t) {
  ctx.beginPath();
  ctx.strokeStyle = line.color;
  ctx.lineWidth = 1.2;
  ctx.globalAlpha = line.opacity;

  const points = 200;
  for (let i = 0; i <= points; i++) {
    const x = (i / points) * canvas.width;
    const progress = i / points;

    // Base sine wave
    let y = line.y + Math.sin(progress * Math.PI * 12 * line.freq * 100 + t * line.speed + line.phase) * line.amp;

    // Add disorder noise in the middle section (simulating pre-arrest disorder)
    const disorderZone = progress > 0.3 && progress < 0.85;
    if (disorderZone) {
      const disorderAmt = Math.sin((progress - 0.3) / 0.55 * Math.PI); // bell curve
      y += (Math.random() - 0.5) * line.amp * disorderAmt * 0.8;
      y += Math.sin(progress * 300 + t * 2) * line.amp * 0.15 * disorderAmt;
    }

    // Entropy spike near the end
    if (progress > 0.85) {
      const spikeAmt = (progress - 0.85) / 0.15;
      y += Math.sin(progress * 500 + t * 4) * line.amp * spikeAmt * 2;
    }

    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.globalAlpha = 1;
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw grid
  ctx.strokeStyle = '#1A2840';
  ctx.lineWidth = 0.5;
  ctx.globalAlpha = 0.4;
  for (let x = 0; x < canvas.width; x += 80) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += 80) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // Draw signal lines
  lines.forEach(line => {
    line.y = (lines.indexOf(line) + 1) * (canvas.height / 7);
    drawBioSignal(line, frame * 0.01);
  });

  // Draw particles
  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0) p.x = canvas.width;
    if (p.x > canvas.width) p.x = 0;
    if (p.y < 0) p.y = canvas.height;
    if (p.y > canvas.height) p.y = 0;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = p.opacity;
    ctx.fill();
  });
  ctx.globalAlpha = 1;

  // Disorder label
  ctx.font = '10px JetBrains Mono, monospace';
  ctx.fillStyle = '#00D4FF';
  ctx.globalAlpha = 0.5;
  ctx.fillText('ENTROPY ↑', canvas.width * 0.3, 20);
  ctx.fillText('VARIANCE ↑', canvas.width * 0.55, 20);
  ctx.fillText('DISORDER DETECTED', canvas.width * 0.75, 20);
  ctx.globalAlpha = 1;

  frame++;
  requestAnimationFrame(animate);
}
animate();

/* ── CONTACT FORM ──────────────────────────────────────── */
document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.textContent = 'Message Sent ✓';
  btn.style.background = 'var(--green)';
  btn.style.color = 'var(--bg)';
  setTimeout(() => {
    btn.textContent = 'Send Message';
    btn.style.background = '';
    btn.style.color = '';
    e.target.reset();
  }, 3000);
});

/* ── SMOOTH SECTION TRANSITIONS ────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ── SIGNAL BAR ANIMATION ON SCROLL ───────────────────── */
const signalBars = document.querySelectorAll('.signal-fill');
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.width = entry.target.style.width;
    }
  });
}, { threshold: 0.5 });
signalBars.forEach(bar => barObserver.observe(bar));
