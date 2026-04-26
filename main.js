/* ============================================================
   ALIYAN PORTFOLIO — MAIN JAVASCRIPT
   Interactions, animations, scroll behavior
   ============================================================ */

/* ── DOM READY ── */
document.addEventListener('DOMContentLoaded', () => {
  initCookieBanner();
  initScrollReveal();
  initNavHighlight();
  initSkillBars();
  initProcessSteps();
  initImageErrorFallback();
});

/* ============================================================
   COOKIE BANNER
   ============================================================ */
function initCookieBanner() {
  const banner = document.getElementById('cookieBanner');
  if (!banner) return;

  // Check if already accepted/declined
  const cookieChoice = localStorage.getItem('cookieChoice');
  if (cookieChoice) {
    banner.classList.add('hidden');
    return;
  }

  // Show after short delay
  setTimeout(() => {
    banner.style.display = 'block';
  }, 1200);
}

function acceptCookies() {
  localStorage.setItem('cookieChoice', 'accepted');
  document.getElementById('cookieBanner').classList.add('hidden');
}

function declineCookies() {
  localStorage.setItem('cookieChoice', 'declined');
  document.getElementById('cookieBanner').classList.add('hidden');
}

/* ============================================================
   CONTACT PANEL
   ============================================================ */
function toggleContact() {
  const panel   = document.getElementById('contactPanel');
  const overlay = document.getElementById('contactOverlay');
  const isOpen  = panel.classList.contains('active');

  if (isOpen) {
    panel.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  } else {
    panel.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

/* Close on Escape key */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const panel = document.getElementById('contactPanel');
    if (panel && panel.classList.contains('active')) {
      toggleContact();
    }
  }
});

/* ============================================================
   SMOOTH SCROLL TO SECTION
   ============================================================ */
function scrollToSection(sectionId) {
  const el = document.getElementById(sectionId);
  if (!el) return;

  const sidebar = document.querySelector('.sidebar');
  // On mobile the sidebar is at the bottom, no offset needed
  const isMobile = window.innerWidth <= 700;
  const offset = isMobile ? 0 : 0;

  const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
  window.scrollTo({ top, behavior: 'smooth' });
}

/* ============================================================
   ACTIVE NAV HIGHLIGHT (scroll spy)
   ============================================================ */
function initNavHighlight() {
  const sections = ['home', 'projects', 'about'];
  const links = document.querySelectorAll('.nav-link[data-section]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        links.forEach(link => {
          link.classList.toggle('active', link.dataset.section === id);
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });
}

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
function initScrollReveal() {
  // Add reveal class to elements that should animate in
  const revealTargets = document.querySelectorAll(
    '.service-card, .project-card, .analysis-block, .timeline-item, .solution-point'
  );

  revealTargets.forEach((el, i) => {
    el.style.transitionDelay = `${(i % 3) * 0.1}s`;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealTargets.forEach(el => observer.observe(el));
}

/* ============================================================
   PROCESS STEPS ANIMATION
   ============================================================ */
function initProcessSteps() {
  const steps   = document.querySelectorAll('.process-step');
  const bubbles = document.querySelectorAll('.chat-bubble');

  const stepObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const allSteps = entry.target.parentElement.querySelectorAll('.process-step');
        allSteps.forEach((step, i) => {
          setTimeout(() => step.classList.add('visible'), i * 80);
        });
        stepObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  if (steps[0]) stepObserver.observe(steps[0]);

  const bubbleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const allBubbles = document.querySelectorAll('.chat-bubble');
        allBubbles.forEach((bubble, i) => {
          setTimeout(() => bubble.classList.add('visible'), i * 300 + 200);
        });
        bubbleObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  if (bubbles[0]) bubbleObserver.observe(bubbles[0]);
}

/* ============================================================
   SKILL BARS ANIMATION
   ============================================================ */
function initSkillBars() {
  const fills = document.querySelectorAll('.skill-fill');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Stagger each bar
        fills.forEach((fill, i) => {
          setTimeout(() => fill.classList.add('animated'), i * 100);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  const skillsWrap = document.querySelector('.skills-wrap');
  if (skillsWrap) observer.observe(skillsWrap);
}

/* ============================================================
   PROJECTS NAVIGATION
   ============================================================ */
let currentProjectPage = 0;

function navigateProjects(dir) {
  const grid = document.querySelector('.projects-grid');
  if (!grid) return;

  const cards = grid.querySelectorAll('.project-card');
  const perPage = getProjectsPerPage();
  const totalPages = Math.ceil(cards.length / perPage);

  currentProjectPage = Math.max(0, Math.min(currentProjectPage + dir, totalPages - 1));

  cards.forEach((card, i) => {
    const page = Math.floor(i / perPage);
    card.style.display = page === currentProjectPage ? '' : 'none';
  });

  // Update nav button states
  const prevBtn = document.getElementById('projPrev');
  const nextBtn = document.getElementById('projNext');
  if (prevBtn) prevBtn.style.opacity = currentProjectPage === 0 ? '0.4' : '1';
  if (nextBtn) nextBtn.style.opacity = currentProjectPage >= totalPages - 1 ? '0.4' : '1';
}

function getProjectsPerPage() {
  const w = window.innerWidth;
  if (w <= 700) return 2;
  if (w <= 1100) return 4;
  return 6;
}

window.addEventListener('resize', () => {
  currentProjectPage = 0;
  const cards = document.querySelectorAll('.project-card');
  cards.forEach(c => c.style.display = '');
});

/* ============================================================
   IMAGE ERROR FALLBACK
   Creates inline SVG avatars when profile.png is missing
   ============================================================ */
function initImageErrorFallback() {
  const imgs = document.querySelectorAll('img[src="img/profile.svg"]');
  imgs.forEach(img => {
    img.addEventListener('error', function() {
      // Replace with a styled div
      const div = document.createElement('div');
      div.className = img.className;

      // Determine what kind of fallback
      if (img.classList.contains('sidebar-avatar')) {
        div.className = 'sidebar-avatar-placeholder';
        div.textContent = 'A';
      } else if (img.classList.contains('hero-profile-img')) {
        div.style.cssText = `
          width: 160px; height: 160px; border-radius: 50%;
          background: linear-gradient(135deg, #1a1a1a, #e94560);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Syne', sans-serif; font-size: 3rem; font-weight: 800;
          color: white; border: 4px solid #1a1a1a;
          box-shadow: 0 20px 50px rgba(0,0,0,0.15);
          flex-shrink: 0;
        `;
        div.textContent = 'A';
      } else if (img.classList.contains('about-profile-img')) {
        div.style.cssText = `
          width: 200px; height: 200px; border-radius: 50%;
          background: linear-gradient(135deg, #1a1a1a, #e94560);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Syne', sans-serif; font-size: 4rem; font-weight: 800;
          color: white; border: 4px solid white;
          box-shadow: 0 20px 50px rgba(0,0,0,0.15);
          position: relative; z-index: 1;
        `;
        div.textContent = 'A';
      } else if (img.closest('.chat-avatar--me')) {
        div.style.cssText = `
          width: 100%; height: 100%; background: #e94560;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 800;
          color: white;
        `;
        div.textContent = 'A';
      }

      img.parentElement.replaceChild(div, img);
    });

    // Trigger check immediately (in case already errored)
    if (img.complete && img.naturalWidth === 0) {
      img.dispatchEvent(new Event('error'));
    }
  });
}

/* ============================================================
   CURSOR GLOW EFFECT (subtle)
   ============================================================ */
(function initCursorGlow() {
  // Only on desktop
  if (window.matchMedia('(hover: none)').matches) return;

  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(233,69,96,0.06) 0%, transparent 70%);
    pointer-events: none;
    z-index: 1;
    transform: translate(-50%, -50%);
    transition: left 0.15s ease, top 0.15s ease;
    will-change: left, top;
  `;
  document.body.appendChild(glow);

  document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
})();

/* ============================================================
   CONTACT FORM — SEND BUTTON
   ============================================================ */
document.addEventListener('click', (e) => {
  if (!e.target.classList.contains('btn-send')) return;

  const btn = e.target;
  const inputs = btn.closest('.contact-form').querySelectorAll('input, textarea');
  let allFilled = true;

  inputs.forEach(input => {
    if (!input.value.trim()) {
      allFilled = false;
      input.style.borderColor = '#e94560';
      setTimeout(() => input.style.borderColor = '', 2000);
    }
  });

  if (allFilled) {
    btn.textContent = 'Sent! ✓';
    btn.style.background = '#2d6a4f';
    setTimeout(() => {
      btn.textContent = 'Send';
      btn.style.background = '';
      inputs.forEach(input => input.value = '');
    }, 3000);
  }
});

/* ============================================================
   PAGE LOAD — stagger sections into view
   ============================================================ */
window.addEventListener('load', () => {
  document.body.style.opacity = '1';
});