'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initVideo();
  initParticles();
  initNavbar();
  initHamburger();
  initTypewriter();
  initScrollReveal();
  initSkillBars();
  initContactForm();
  initCursor();
  initSmoothScroll();
  initSoundBtn();
});

/* ══════════════════════════════════
   VIDEO
══════════════════════════════════ */
function initVideo() {
  const video = document.getElementById('bg-video');
  if (!video) return;
  // Start muted for autoplay policy; sound btn unmutes
  video.muted = true;
  video.play().catch(() => {});
}

function initSoundBtn() {
  const btn   = document.getElementById('sound-btn');
  const video = document.getElementById('bg-video');
  if (!btn || !video) return;

  let muted = true;
  btn.addEventListener('click', () => {
    muted = !muted;
    video.muted = muted;
    btn.innerHTML = muted
      ? '<i class="fas fa-volume-mute"></i>'
      : '<i class="fas fa-volume-up"></i>';
    if (!muted) video.play().catch(() => { video.muted = true; muted = true; btn.innerHTML = '<i class="fas fa-volume-mute"></i>'; });
  });
}

/* ══════════════════════════════════
   PARTICLES
══════════════════════════════════ */
function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;
  const COUNT = 55;
  const particles = [];

  function resize() { W = canvas.width = innerWidth; H = canvas.height = innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  function make(fromBottom = false) {
    return {
      x: Math.random() * (W || 800),
      y: fromBottom ? (H || 600) + 10 : Math.random() * (H || 600),
      size: .5 + Math.random() * 1.5,
      vy: -(0.2 + Math.random() * 0.5),
      vx: (Math.random() - .5) * .25,
      alpha: .1 + Math.random() * .45,
      color: Math.random() > .5 ? '#ff003c' : '#ff6b9d',
      pulse: Math.random() * Math.PI * 2,
    };
  }

  for (let i = 0; i < COUNT; i++) particles.push(make());

  (function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p, i) => {
      p.x += p.vx; p.y += p.vy; p.pulse += .02;
      const a = p.alpha * (.6 + Math.sin(p.pulse) * .4);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = a;
      ctx.shadowBlur = 6; ctx.shadowColor = p.color;
      ctx.fill();
      ctx.globalAlpha = 1; ctx.shadowBlur = 0;
      if (p.y < -10 || p.x < -10 || p.x > W + 10) particles[i] = make(true);
    });
    requestAnimationFrame(draw);
  })();
}

/* ══════════════════════════════════
   NAVBAR
══════════════════════════════════ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const links  = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', scrollY > 50);
    let current = '';
    document.querySelectorAll('section[id]').forEach(s => {
      if (scrollY >= s.offsetTop - 120) current = s.id;
    });
    links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${current}`));
  }, { passive: true });
}

function initHamburger() {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('nav-links');
  if (!btn || !menu) return;
  btn.addEventListener('click', () => { btn.classList.toggle('open'); menu.classList.toggle('open'); });
  document.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => { btn.classList.remove('open'); menu.classList.remove('open'); }));
  document.addEventListener('click', e => { if (!btn.contains(e.target) && !menu.contains(e.target)) { btn.classList.remove('open'); menu.classList.remove('open'); } });
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });
}

/* ══════════════════════════════════
   TYPEWRITER
══════════════════════════════════ */
function initTypewriter() {
  const el = document.getElementById('typed-text');
  if (!el) return;
  const phrases = ['Web Dev', 'AI Prompt Engineer', 'Hackathon Slayer', 'Three.js Wizard', 'Open Source Chaos', 'Discord Bot Builder'];
  let pi = 0, ci = 0, del = false, paused = false;

  function tick() {
    const p = phrases[pi];
    if (del) {
      el.textContent = p.substring(0, --ci);
      if (ci === 0) { del = false; pi = (pi + 1) % phrases.length; setTimeout(tick, 400); return; }
      setTimeout(tick, 40);
    } else {
      el.textContent = p.substring(0, ++ci);
      if (ci === p.length) {
        if (paused) return;
        paused = true;
        setTimeout(() => { paused = false; del = true; tick(); }, 2000);
        return;
      }
      setTimeout(tick, 80);
    }
  }
  setTimeout(tick, 1500);
}

/* ══════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════ */
function initScrollReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const siblings = entry.target.parentNode ? Array.from(entry.target.parentNode.children) : [];
      const idx = siblings.indexOf(entry.target);
      const isGrid = entry.target.closest('.skills-grid, .projects-grid');
      setTimeout(() => entry.target.classList.add('visible'), isGrid ? idx * 80 : 0);
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

/* ══════════════════════════════════
   SKILL BARS
══════════════════════════════════ */
function initSkillBars() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      setTimeout(() => { entry.target.style.width = entry.target.dataset.width + '%'; }, 200);
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.skill-fill').forEach(b => obs.observe(b));
}

/* ══════════════════════════════════
   CONTACT FORM
══════════════════════════════════ */
function initContactForm() {
  const form    = document.getElementById('contact-form');
  if (!form) return;
  const nameEl  = document.getElementById('fname');
  const emailEl = document.getElementById('femail');
  const msgEl   = document.getElementById('fmessage');
  const nameErr = document.getElementById('name-error');
  const emlErr  = document.getElementById('email-error');
  const msgErr  = document.getElementById('message-error');
  const success = document.getElementById('form-success');
  const btnText = document.getElementById('btn-text');
  const btnIcon = document.getElementById('btn-icon');
  const submitBtn = document.getElementById('submit-btn');

  function validate() {
    let ok = true;
    if (!nameEl.value.trim() || nameEl.value.trim().length < 2) { nameErr.textContent = '⚠ At least 2 characters'; nameEl.classList.add('error'); ok = false; } else { nameErr.textContent = ''; nameEl.classList.remove('error'); }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim())) { emlErr.textContent = '⚠ Enter a valid email'; emailEl.classList.add('error'); ok = false; } else { emlErr.textContent = ''; emailEl.classList.remove('error'); }
    if (!msgEl.value.trim() || msgEl.value.trim().length < 10) { msgErr.textContent = '⚠ At least 10 characters'; msgEl.classList.add('error'); ok = false; } else { msgErr.textContent = ''; msgEl.classList.remove('error'); }
    return ok;
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!validate()) return;
    submitBtn.disabled = true;
    btnText.textContent = 'TRANSMITTING...';
    btnIcon.className = 'fas fa-spinner fa-spin';
    console.log('[Sam Portfolio] Form:', { name: nameEl.value, email: emailEl.value, message: msgEl.value });
    setTimeout(() => {
      submitBtn.disabled = false;
      btnText.textContent = 'TRANSMIT MESSAGE';
      btnIcon.className = 'fas fa-paper-plane';
      form.reset();
      success.classList.add('show'); success.style.display = 'block';
      setTimeout(() => { success.classList.remove('show'); success.style.display = 'none'; }, 5000);
    }, 1200);
  });

  [nameEl, emailEl, msgEl].forEach(el => el.addEventListener('input', () => el.classList.remove('error')));
}

/* ══════════════════════════════════
   CURSOR
══════════════════════════════════ */
function initCursor() {
  const cursor = document.getElementById('cursor-glow');
  if (!cursor || innerWidth < 769) return;
  let cx = 0, cy = 0, tx = 0, ty = 0;
  window.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
  document.querySelectorAll('a,button,.skill-card,.project-card').forEach(el => {
    el.addEventListener('mouseenter', () => { cursor.style.width = '50px'; cursor.style.height = '50px'; });
    el.addEventListener('mouseleave', () => { cursor.style.width = '24px'; cursor.style.height = '24px'; });
  });
  (function loop() {
    cx += (tx - cx) * .12; cy += (ty - cy) * .12;
    cursor.style.left = cx + 'px'; cursor.style.top = cy + 'px';
    requestAnimationFrame(loop);
  })();
}

/* ══════════════════════════════════
   PARALLAX OVERLAY
══════════════════════════════════ */
window.addEventListener('scroll', () => {
  const ov = document.getElementById('overlay');
  if (ov) ov.style.opacity = .60 + (scrollY / (document.body.scrollHeight - innerHeight)) * .15;
}, { passive: true });
