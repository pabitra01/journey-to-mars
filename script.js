/* ============================================
   JOURNEY TO MARS — Enhanced Interactive Script
   With 3D effects, particle systems, smooth transitions
   ============================================ */

// ---- CUSTOM CURSOR ----
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');
let cursorX = 0, cursorY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', (e) => {
  cursorX = e.clientX;
  cursorY = e.clientY;
  cursorDot.style.left = cursorX - 3 + 'px';
  cursorDot.style.top = cursorY - 3 + 'px';
});

function animateCursorRing() {
  ringX += (cursorX - ringX) * 0.12;
  ringY += (cursorY - ringY) * 0.12;
  cursorRing.style.left = ringX - 18 + 'px';
  cursorRing.style.top = ringY - 18 + 'px';
  requestAnimationFrame(animateCursorRing);
}
animateCursorRing();

// Hover effect on interactive elements
document.querySelectorAll('a, button, .poi-marker-3d, [data-tilt]').forEach(el => {
  el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
  el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
});

// ---- LOADER ----
const loader = document.getElementById('loader');
const loaderBar = document.getElementById('loaderBar');
const loaderStatus = document.getElementById('loaderStatus');

const loadMessages = [
  'Initializing systems...',
  'Calibrating sensors...',
  'Connecting to mission control...',
  'Plotting trajectory...',
  'Running diagnostics...',
  'Systems nominal.',
  'Ready for launch.'
];

let loadProgress = 0;
const loadInterval = setInterval(() => {
  loadProgress += Math.random() * 15 + 10;
  if (loadProgress > 100) loadProgress = 100;
  loaderBar.style.width = loadProgress + '%';
  const msgIdx = Math.min(Math.floor((loadProgress / 100) * loadMessages.length), loadMessages.length - 1);
  loaderStatus.textContent = loadMessages[msgIdx];
  if (loadProgress >= 100) {
    clearInterval(loadInterval);
    setTimeout(() => {
      loader.classList.add('hidden');
      initAll();
    }, 600);
  }
}, 280);

// ---- CANVAS STARFIELD ----
const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');
let stars = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createStars(count) {
  stars = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + 0.3,
      a: Math.random() * 0.8 + 0.2,
      speed: Math.random() * 0.02 + 0.005,
      phase: Math.random() * Math.PI * 2,
      color: Math.random() > 0.85 ? [255, 180, 100] :
             Math.random() > 0.7 ? [160, 196, 255] : [240, 240, 255]
    });
  }
}

function drawStars(time) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const s of stars) {
    const twinkle = Math.sin(time * 0.001 * s.speed * 50 + s.phase) * 0.35 + 0.65;
    const alpha = s.a * twinkle;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${s.color[0]},${s.color[1]},${s.color[2]},${alpha})`;
    ctx.fill();
    if (s.r > 1.2) {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r * 3.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${s.color[0]},${s.color[1]},${s.color[2]},${alpha * 0.08})`;
      ctx.fill();
    }
  }
  requestAnimationFrame(drawStars);
}

resizeCanvas();
createStars(250);
requestAnimationFrame(drawStars);
window.addEventListener('resize', () => { resizeCanvas(); createStars(250); });

// ---- PARTICLE FIELD (second canvas) ----
const pCanvas = document.getElementById('particleField');
const pCtx = pCanvas.getContext('2d');
let particles = [];

function resizeParticleCanvas() {
  pCanvas.width = window.innerWidth;
  pCanvas.height = window.innerHeight;
}

function createParticles(count) {
  particles = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * pCanvas.width,
      y: Math.random() * pCanvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5,
      a: Math.random() * 0.3 + 0.1,
      color: Math.random() > 0.5 ? '255,107,53' : '0,229,255'
    });
  }
}

function drawParticles() {
  pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0) p.x = pCanvas.width;
    if (p.x > pCanvas.width) p.x = 0;
    if (p.y < 0) p.y = pCanvas.height;
    if (p.y > pCanvas.height) p.y = 0;
    pCtx.beginPath();
    pCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    pCtx.fillStyle = `rgba(${p.color},${p.a})`;
    pCtx.fill();
  }
  // Draw connecting lines between close particles
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        pCtx.beginPath();
        pCtx.moveTo(particles[i].x, particles[i].y);
        pCtx.lineTo(particles[j].x, particles[j].y);
        pCtx.strokeStyle = `rgba(255,255,255,${0.03 * (1 - dist / 120)})`;
        pCtx.lineWidth = 0.5;
        pCtx.stroke();
      }
    }
  }
  requestAnimationFrame(drawParticles);
}

resizeParticleCanvas();
createParticles(60);
requestAnimationFrame(drawParticles);
window.addEventListener('resize', () => { resizeParticleCanvas(); createParticles(60); });

// ---- NAV ----
const nav = document.getElementById('mainNav');
const navLinks = document.querySelectorAll('.nav-link');
const navHamburger = document.getElementById('navHamburger');
const navLinksContainer = document.getElementById('navLinks');
const sections = document.querySelectorAll('.section');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (window.scrollY / scrollHeight) * 100;
  document.getElementById('scrollProgress').style.width = progress + '%';

  let currentSection = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 200) currentSection = s.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('data-section') === currentSection);
  });
});

navHamburger.addEventListener('click', () => {
  navHamburger.classList.toggle('open');
  navLinksContainer.classList.toggle('open');
});
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navHamburger.classList.remove('open');
    navLinksContainer.classList.remove('open');
  });
});

// ---- SMOOTH SCROLL ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

// ---- INIT ALL GSAP ANIMATIONS ----
function initAll() {
  gsap.registerPlugin(ScrollTrigger);

  // -- Hero Entrance --
  const heroTl = gsap.timeline({ delay: 0.1 });
  heroTl
    .from('.hero-tag', { opacity: 0, y: 30, duration: 0.8, ease: 'power3.out' })
    .from('.hero-title-line', { opacity: 0, y: 60, rotationX: 20, duration: 1, stagger: 0.2, ease: 'power3.out' }, '-=0.4')
    .from('.hero-subtitle', { opacity: 0, y: 30, duration: 0.8, ease: 'power3.out' }, '-=0.4')
    .from('.hero-stat', { opacity: 0, y: 20, scale: 0.9, duration: 0.6, stagger: 0.12, ease: 'back.out(1.7)' }, '-=0.3')
    .to('#scrollIndicator', { opacity: 1, duration: 0.5 }, '-=0.2');

  // Hero parallax out
  gsap.to('.hero-content', {
    y: -100, opacity: 0, scale: 0.95, rotationX: 5,
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1.5 }
  });

  gsap.to('#scrollIndicator', {
    opacity: 0,
    scrollTrigger: { trigger: '#hero', start: '15% top', end: '30% top', scrub: true }
  });

  // -- Section title lines --
  document.querySelectorAll('.section-title-line').forEach(line => {
    ScrollTrigger.create({
      trigger: line,
      start: 'top 80%',
      onEnter: () => line.classList.add('visible'),
      onLeaveBack: () => line.classList.remove('visible')
    });
  });

  // -- Section headers 3D entrance --
  document.querySelectorAll('.section:not(.section-hero) .section-header').forEach(header => {
    gsap.from(header.querySelector('.section-number'), {
      opacity: 0, y: 20, duration: 0.6,
      scrollTrigger: { trigger: header, start: 'top 75%', toggleActions: 'play none none reverse' }
    });
    gsap.from(header.querySelector('.section-title'), {
      opacity: 0, y: 50, rotationX: 15, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: header, start: 'top 75%', toggleActions: 'play none none reverse' }
    });
    gsap.from(header.querySelector('.section-desc'), {
      opacity: 0, y: 30, duration: 0.8, delay: 0.2,
      scrollTrigger: { trigger: header, start: 'top 75%', toggleActions: 'play none none reverse' }
    });
  });

  // -- LAUNCH --
  const countdownEl = document.getElementById('countdownNumber');
  const exhaust = document.getElementById('rocketExhaust');
  const padSmoke = document.getElementById('padSmoke');
  let lastNum = 10;

  ScrollTrigger.create({
    trigger: '.launch-scene',
    start: 'top 70%',
    end: 'top 15%',
    onUpdate: (self) => {
      const num = Math.max(0, Math.round(10 - self.progress * 10));
      if (num !== lastNum) {
        countdownEl.classList.add('flip');
        setTimeout(() => {
          countdownEl.textContent = num;
          countdownEl.classList.remove('flip');
        }, 150);
        lastNum = num;
      }
      if (num <= 3) {
        exhaust.classList.add('active');
        padSmoke.classList.add('active');
      } else {
        exhaust.classList.remove('active');
        padSmoke.classList.remove('active');
      }
    }
  });

  gsap.to('.rocket-3d', {
    y: -250, rotation: -2,
    scrollTrigger: { trigger: '.launch-scene', start: 'top 15%', end: 'bottom top', scrub: 1.5 }
  });

  gsap.from('.info-card-3d', {
    opacity: 0, y: 60, rotationY: 8, stagger: 0.15,
    scrollTrigger: { trigger: '.launch-cards', start: 'top 82%', end: 'top 50%', scrub: 1 }
  });

  // -- SPACE --
  gsap.to('.parallax-stars-back', {
    y: -120,
    scrollTrigger: { trigger: '#space', start: 'top bottom', end: 'bottom top', scrub: true }
  });
  gsap.to('.parallax-stars-mid', {
    y: -240,
    scrollTrigger: { trigger: '#space', start: 'top bottom', end: 'bottom top', scrub: true }
  });
  gsap.to('.parallax-stars-front', {
    y: -360,
    scrollTrigger: { trigger: '#space', start: 'top bottom', end: 'bottom top', scrub: true }
  });
  gsap.to('.parallax-nebula', {
    y: -80, scale: 1.1,
    scrollTrigger: { trigger: '#space', start: 'top bottom', end: 'bottom top', scrub: true }
  });

  // Journey ship progress
  const journeyLineFill = document.getElementById('journeyLineFill');
  const journeyShip = document.getElementById('journeyShip');
  ScrollTrigger.create({
    trigger: '.space-journey',
    start: 'top 60%',
    end: 'bottom 40%',
    onUpdate: (self) => {
      const pct = Math.min(100, self.progress * 100);
      journeyLineFill.style.width = pct + '%';
      journeyShip.style.left = pct + '%';
    }
  });

  // -- LANDING --
  const heatShield = document.getElementById('heatShield');
  ScrollTrigger.create({
    trigger: '#landing',
    start: 'top 60%',
    end: 'top 20%',
    onUpdate: (self) => {
      heatShield.style.opacity = Math.min(0.5, self.progress * 0.8);
    },
    onLeave: () => { heatShield.style.opacity = 0; },
    onLeaveBack: () => { heatShield.style.opacity = 0; }
  });

  // Timeline line fill
  const timelineLineFill = document.getElementById('timelineLineFill');
  ScrollTrigger.create({
    trigger: '.landing-timeline',
    start: 'top 60%',
    end: 'bottom 40%',
    onUpdate: (self) => {
      timelineLineFill.style.height = (self.progress * 100) + '%';
    }
  });

  // Meter fills animate on reveal
  document.querySelectorAll('.meter-fill').forEach(fill => {
    ScrollTrigger.create({
      trigger: fill,
      start: 'top 85%',
      onEnter: () => { fill.style.width = fill.style.getPropertyValue('--fill'); },
      onLeaveBack: () => { fill.style.width = '0%'; }
    });
  });

  // -- EXPLORE --
  const rover = document.getElementById('rover');
  ScrollTrigger.create({
    trigger: '.mars-map',
    start: 'top 60%',
    end: 'bottom 40%',
    onUpdate: (self) => {
      if (rover) rover.style.left = (10 + self.progress * 70) + '%';
    }
  });

  // -- CONCLUSION counters --
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        counterObserver.disconnect();
      }
    });
  }, { threshold: 0.3 });
  const countersSection = document.querySelector('.summary-counters');
  if (countersSection) counterObserver.observe(countersSection);

  // -- GENERIC REVEAL ELEMENTS --
  document.querySelectorAll('.reveal-el').forEach((el, i) => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      onEnter: () => {
        setTimeout(() => el.classList.add('visible'), i % 4 * 80);
      },
      onLeaveBack: () => el.classList.remove('visible')
    });
  });

  // Timeline events special reveal
  document.querySelectorAll('.timeline-event').forEach(ev => {
    ScrollTrigger.create({
      trigger: ev,
      start: 'top 85%',
      onEnter: () => ev.classList.add('visible'),
      onLeaveBack: () => ev.classList.remove('visible')
    });
  });
}

// ---- COUNTER ANIMATION ----
function animateCounters() {
  document.querySelectorAll('.counter-value').forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'));
    const duration = 2200;
    const start = performance.now();
    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(2, -10 * progress);
      counter.textContent = Math.round(target * ease);
      if (progress < 1) requestAnimationFrame(update);
      else counter.textContent = target;
    }
    requestAnimationFrame(update);
  });
}

// ---- POI MARKERS ----
const poiMarkers = document.querySelectorAll('.poi-marker-3d');
poiMarkers.forEach(marker => {
  marker.addEventListener('click', (e) => {
    e.stopPropagation();
    const isActive = marker.classList.contains('active');
    poiMarkers.forEach(m => m.classList.remove('active'));
    if (!isActive) marker.classList.add('active');
  });
});
document.addEventListener('click', () => poiMarkers.forEach(m => m.classList.remove('active')));

// ---- MISSION CONTROL TOGGLE ----
const mcToggle = document.getElementById('mcToggle');
const mcPanel = document.getElementById('mcPanel');
mcToggle.addEventListener('click', () => {
  mcToggle.classList.toggle('open');
  mcPanel.classList.toggle('open');
});

// ---- 3D TILT ON CARDS ----
document.querySelectorAll('[data-tilt]').forEach(card => {
  const inner = card.querySelector('.card-3d-inner') || card;
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateX = (y - 0.5) * -12;
    const rotateY = (x - 0.5) * 12;
    inner.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
  });
  card.addEventListener('mouseleave', () => {
    inner.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0) scale(1)';
  });
});

// ---- PARALLAX ON MOUSE MOVE (Hero) ----
document.addEventListener('mousemove', (e) => {
  const mx = (e.clientX / window.innerWidth - 0.5) * 2;
  const my = (e.clientY / window.innerHeight - 0.5) * 2;
  // Subtle particle response to mouse
  particles.forEach((p, i) => {
    if (i % 3 === 0) {
      p.vx += mx * 0.003;
      p.vy += my * 0.003;
    }
  });
});
