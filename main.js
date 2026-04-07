const PHONE = '201558143429';

const MENU_IMAGES = [
  'img/',
];

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initPopup();
  initCountdown();
  initScrollBar();
  initReveal();
  initCounterAnimation();
});

function initTheme() {
  const saved = localStorage.getItem('theme') || 'dark';
  applyTheme(saved);
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  const icon = document.getElementById('theme-icon');
  if (icon) {
    icon.className = theme === 'dark' ? 'fa fa-sun' : 'fa fa-moon';
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
}

function initPopup() {
  const shown = sessionStorage.getItem('popup_shown');
  if (!shown) {
    setTimeout(() => {
      const overlay = document.getElementById('popup-overlay');
      if (overlay) overlay.classList.remove('hidden');
    }, 1500);
  }
}

function closePopup() {
  const overlay = document.getElementById('popup-overlay');
  if (overlay) {
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.3s ease';
    setTimeout(() => overlay.classList.add('hidden'), 300);
  }
  sessionStorage.setItem('popup_shown', '1');
}

function initCountdown() {
  const endTime = getOrSetEndTime();
  updateTimer(endTime);
  setInterval(() => updateTimer(endTime), 1000);
}

function getOrSetEndTime() {
  let end = localStorage.getItem('countdown_end');
  if (!end || Date.now() > parseInt(end)) {
    end = Date.now() + 8 * 60 * 60 * 1000;
    localStorage.setItem('countdown_end', end);
  }
  return parseInt(end);
}

function updateTimer(endTime) {
  const diff = endTime - Date.now();
  const el = document.getElementById('countdown-timer');
  if (!el) return;
  if (diff <= 0) {
    el.textContent = '00:00:00';
    const newEnd = Date.now() + 8 * 60 * 60 * 1000;
    localStorage.setItem('countdown_end', newEnd);
    return;
  }
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  el.textContent = `${pad(h)}:${pad(m)}:${pad(s)}`;
}

function pad(n) { return String(n).padStart(2, '0'); }

let lastScrollY = 0;
let barVisible = true;
const BAR_HEIGHT = 42;

function initScrollBar() {
  window.addEventListener('scroll', () => {
    const bar = document.getElementById('countdown-bar');
    const nav = document.getElementById('main-nav');
    const scrollY = window.scrollY;

    if (scrollY > lastScrollY && scrollY > BAR_HEIGHT) {
      if (barVisible) {
        bar.classList.add('hide');
        nav.style.top = '0';
        barVisible = false;
      }
    } else {
      if (!barVisible) {
        bar.classList.remove('hide');
        nav.style.top = BAR_HEIGHT + 'px';
        barVisible = true;
      }
    }
    lastScrollY = scrollY;
  }, { passive: true });
}

function initReveal() {
  const els = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
}

function initCounterAnimation() {
  const counters = document.querySelectorAll('[data-target]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target);
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

function animateCounter(el) {
  const target = parseFloat(el.getAttribute('data-target'));
  const isDecimal = target % 1 !== 0;
  const duration = 1600;
  const start = performance.now();

  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = eased * target;
    el.textContent = isDecimal ? current.toFixed(1) : Math.floor(current).toLocaleString('ar-EG');
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = isDecimal ? target.toFixed(1) : target.toLocaleString('ar-EG');
  }

  requestAnimationFrame(step);
}

function toggleFaq(el) {
  const item = el.closest('.faq-item');
  const isActive = item.classList.contains('active');
  document.querySelectorAll('.faq-item.active').forEach(i => i.classList.remove('active'));
  if (!isActive) item.classList.add('active');
}

function openLightbox(el) {
  const img = el.querySelector('img');
  if (!img) return;
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightbox-img');
  lbImg.src = img.src;
  lb.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('active');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});

function toggleMenu() {
  const menu = document.getElementById('mobile-menu');
  if (menu) menu.classList.toggle('open');
}

function copyPhone() {
  navigator.clipboard.writeText('01558143429').then(() => {
    showToast('تم نسخ الرقم بنجاح!');
  }).catch(() => {
    showToast('الرقم: 01558143429');
  });
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  const msgEl = document.getElementById('toast-msg');
  if (!toast || !msgEl) return;
  msgEl.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

function downloadMenus() {
  if (MENU_IMAGES.length === 0) {
    showToast('لا يوجد منيو متاح حالياً');
    return;
  }
  MENU_IMAGES.forEach((src, i) => {
    const a = document.createElement('a');
    a.href = src;
    a.download = MENU_IMAGES.length > 1 ? `menu-${i + 1}.png` : 'menu.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });
  showToast('جاري تحميل المنيو...');
}

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});