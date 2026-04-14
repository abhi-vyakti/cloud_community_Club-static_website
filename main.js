/* ═══════════════════════════════════════════════════════════
   C3 SNIST — main.js
   Pure vanilla JS – no frameworks, no dependencies.
   ═══════════════════════════════════════════════════════════ */

// Custom cursor
const cursor = document.getElementById('cursor');
let mx = 0, my = 0;
document.addEventListener('mousemove', e => { 
  mx = e.clientX; my = e.clientY; 
  cursor.style.left = mx + 'px'; cursor.style.top = my + 'px'; 
});

document.querySelectorAll('a,button,.stat-card,.team-card,.event-card,.org-card,.project-chip').forEach(el => {
  el.addEventListener('mouseenter', ()=>{ cursor.style.width='20px'; cursor.style.height='20px'; cursor.style.opacity='0.7'; });
  el.addEventListener('mouseleave', ()=>{ cursor.style.width='10px'; cursor.style.height='10px'; cursor.style.opacity='1'; });
});

// Data Stream Particle Trail
const trailChars = ['0', '1'];
const createTrailElement = (x, y) => {
  const el = document.createElement('div');
  el.className = 'data-stream-particle';
  el.textContent = trailChars[Math.floor(Math.random() * trailChars.length)];
  el.style.left = x + 'px';
  el.style.top = y + 'px';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 600);
};

let lastTrailTime = 0;
document.addEventListener('mousemove', (e) => {
  const now = performance.now();
  if (now - lastTrailTime > 40) {
    createTrailElement(e.clientX, e.clientY);
    lastTrailTime = now;
  }
});

// Parallax Badges
const badges = document.querySelectorAll('.glass-badge');
document.addEventListener('mousemove', (e) => {
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  const dx = e.clientX - cx;
  const dy = e.clientY - cy;

  badges.forEach(badge => {
    const speed = parseFloat(badge.getAttribute('data-speed'));
    badge.style.transform = `translate(${dx * speed}px, ${dy * speed}px)`;
  });
});

// Mobile nav
const ham = document.getElementById('ham');
const mobNav = document.getElementById('mob-nav');
ham.addEventListener('click', () => {
  const open = mobNav.classList.toggle('open');
  ham.setAttribute('aria-expanded', open);
  ham.querySelectorAll('span')[0].style.transform = open ? 'rotate(45deg) translate(5px,5px)' : '';
  ham.querySelectorAll('span')[1].style.opacity = open ? '0' : '1';
  ham.querySelectorAll('span')[2].style.transform = open ? 'rotate(-45deg) translate(5px,-5px)' : '';
});
mobNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  mobNav.classList.remove('open');
  ham.setAttribute('aria-expanded', false);
  ham.querySelectorAll('span').forEach(s => { s.style.transform=''; s.style.opacity=''; });
}));

// Scroll reveal
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); } });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// Hacker Text Decrypt Effect
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#0123456789!@$%^&*";
document.querySelectorAll('.hacker-text').forEach(el => {
  let interval = null;
  el.addEventListener('mouseenter', e => {
    let iteration = 0;
    clearInterval(interval);
    interval = setInterval(() => {
      e.target.textContent = e.target.textContent.split("")
        .map((letter, index) => {
          if(index < iteration) {
            return e.target.dataset.value[index];
          }
          return letters[Math.floor(Math.random() * letters.length)];
        }).join("");
      if(iteration >= e.target.dataset.value.length) { 
        clearInterval(interval);
      }
      iteration += 1 / 3;
    }, 30);
  });
});

// Typewriter
const words = ['Automate','Build','Deploy','Innovate','Collaborate','Scale'];
let wi=0, ci=0, deleting=false;
const tw = document.getElementById('tw-word');
function typeStep() {
  const w = words[wi];
  if (!deleting) {
    tw.textContent = w.slice(0, ++ci);
    if (ci === w.length) { deleting=true; setTimeout(typeStep, 1800); return; }
  } else {
    tw.textContent = w.slice(0, --ci);
    if (ci === 0) { deleting=false; wi=(wi+1)%words.length; }
  }
  setTimeout(typeStep, deleting ? 60 : 110);
}
typeStep();

// Count-up stats
const countObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target;
      const target = +el.getAttribute('data-count');
      let current = 0;
      const step = Math.ceil(target / 50);
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current + '+';
        if (current >= target) clearInterval(timer);
      }, 30);
      countObs.unobserve(el);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-count]').forEach(el => countObs.observe(el));

// Form Interactivity & Live ID Sync
const joinForm = document.getElementById('join-form');
const viewName = document.getElementById('view-name');
const viewBranch = document.getElementById('view-branch');

if (joinForm) {
  const nameInput = document.getElementById('fname');
  const branchInput = document.getElementById('fbranch');
  const submitBtn = document.getElementById('submit-btn');

  // Live Sync
  nameInput.addEventListener('input', (e) => {
    viewName.textContent = e.target.value.trim() || "Applicant Name";
  });

  branchInput.addEventListener('change', (e) => {
    viewBranch.textContent = e.target.value || "_ _ _";
  });

  // Sound cues for focus
  joinForm.querySelectorAll('input, select, textarea').forEach(el => {
    el.addEventListener('focus', () => {
      if (typeof playCloud === 'function') playCloud(0.3, 1400, 'bandpass', 0.1);
    });
  });

  // Enhanced Submit
  joinForm.addEventListener('submit', function(e) {
    e.preventDefault();
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    if (typeof playCloud === 'function') playCloud(0.6, 800, 'lowpass', 0.2);

    // Simulate "Deploying to Cloud"
    setTimeout(() => {
      submitBtn.classList.remove('loading');
      joinForm.style.display = 'none';
      const formOk = document.getElementById('form-ok');
      formOk.style.display = 'block';
      
      // Member card status update
      const statusDot = document.querySelector('.status-dot');
      const statusText = document.querySelector('.id-status');
      if (statusDot) {
        statusDot.style.background = 'var(--green)';
        statusDot.style.boxShadow = '0 0 12px var(--green)';
      }
      if (statusText) statusText.innerHTML = '<span class="status-dot" style="background:var(--green); box-shadow:0 0 12px var(--green);"></span> STATUS: DEPLOYED_SUCCESS';

      // Success Typewriter
      const successTextEl = document.getElementById('success-text');
      const applicantName = nameInput.value.trim().split(' ')[0] || "Friend"; // Use first name or fallback
      const finalMsg = `Application received! Welcome to the cloud, ${applicantName}.`;
      successTextEl.textContent = "";
      let charIdx = 0;
      
      function typeSuccess() {
        if (charIdx < finalMsg.length) {
          successTextEl.textContent += finalMsg.charAt(charIdx);
          charIdx++;
          setTimeout(typeSuccess, 35);
        }
      }
      typeSuccess();

    }, 2000);
  });
}

// Smooth-scroll for in-page links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const targetEl = document.querySelector(targetId);
    if (targetEl) {
      e.preventDefault();
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ═══════════════════════════════════════════════════════════
   Web Audio API — "Cloud & Atmosphere" Sound Engine
   ═══════════════════════════════════════════════════════════ */
let audioCtx = null;
function initAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
}
document.addEventListener('click', initAudio, { once: true });
document.addEventListener('keydown', initAudio, { once: true });
document.addEventListener('touchstart', initAudio, { once: true });

function playCloud(duration = 0.5, baseFreq = 800, type = 'lowpass', volume = 0.05) {
  if(!audioCtx) return;
  const bufferSize = audioCtx.sampleRate * duration;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1; // Pure atmospheric white noise
  }
  
  const noiseSource = audioCtx.createBufferSource();
  noiseSource.buffer = buffer;
  
  const filter = audioCtx.createBiquadFilter();
  filter.type = type;
  
  // Animate the cloud's resonance to create moving wind/air dynamics
  filter.frequency.setValueAtTime(Math.max(100, baseFreq * 0.1), audioCtx.currentTime);
  filter.frequency.exponentialRampToValueAtTime(baseFreq, audioCtx.currentTime + duration * 0.4);
  filter.frequency.exponentialRampToValueAtTime(Math.max(100, baseFreq * 0.1), audioCtx.currentTime + duration);
  
  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(volume, audioCtx.currentTime + duration * 0.4);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
  
  noiseSource.connect(filter);
  filter.connect(gain);
  gain.connect(audioCtx.destination);
  
  noiseSource.start();
}

// Global UI Cloud Matrix (Shaping white noise into specific weather types)
const cloudTriggers = [
  // 1. Hero Badges (Fast, high-altitude wind wisp)
  { selector: '.glass-badge, .decrypt-badge', dur: 0.3, freq: 1500, type: 'bandpass', vol: 0.1 },
  // 2. Clickable CTA Buttons (Short, sharp pressure air burst)
  { selector: '.btn-primary, .btn-secondary, .nav-btn', dur: 0.2, freq: 2000, type: 'bandpass', vol: 0.12 },
  // 3. Stats Cards (Deep, slow, heavy storm rumble)
  { selector: '.stat-card', dur: 0.8, freq: 300, type: 'lowpass', vol: 0.3 },
  // 4. Changelog Cards (Mid-level floating stratus fog)
  { selector: '.org-card', dur: 0.5, freq: 600, type: 'lowpass', vol: 0.1 },
  // 5. Event Cards (Bright passing breeze)
  { selector: '.event-card', dur: 0.4, freq: 1200, type: 'bandpass', vol: 0.05 },
  // 6. Inline Project Chips (Light wisp)
  { selector: '.project-chip', dur: 0.25, freq: 1800, type: 'bandpass', vol: 0.08 },
  // 7. Team Cards (Rolling dense cloud layer)
  { selector: '.team-card', dur: 0.6, freq: 400, type: 'lowpass', vol: 0.18 }
];

cloudTriggers.forEach(({ selector, dur, freq, type, vol }) => {
  document.querySelectorAll(selector).forEach(el => {
    el.addEventListener('mouseenter', () => playCloud(dur, freq, type, vol));
  });
});
