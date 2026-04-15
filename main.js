/* main.js – StandUp Anti-Bullying Website */

// ---------- Mobile nav toggle ----------
const navToggle = document.querySelector('.nav-toggle');
const navLinks  = document.querySelector('.nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', navLinks.classList.contains('open'));
  });

  // Close nav when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// ---------- Footer year ----------
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ---------- Pledge counter ----------
const PLEDGE_KEY = 'standup_pledge_count';
const pledgeBtn   = document.getElementById('pledgeBtn');
const pledgeCount = document.getElementById('pledgeCount');

function getCount() {
  return parseInt(localStorage.getItem(PLEDGE_KEY) || '0', 10);
}

function setCount(n) {
  localStorage.setItem(PLEDGE_KEY, String(n));
}

function formatCount(n) {
  return n.toLocaleString();
}

function updatePledgeDisplay(count) {
  if (!pledgeCount) return;
  if (count === 0) {
    pledgeCount.textContent = 'Be the first to take the pledge today!';
  } else {
    pledgeCount.textContent = `${formatCount(count)} ${count === 1 ? 'person has' : 'people have'} taken the pledge!`;
  }
}

if (pledgeBtn && pledgeCount) {
  const hasPledged = localStorage.getItem('standup_pledged') === 'true';

  // Initialise display
  updatePledgeDisplay(getCount());

  if (hasPledged) {
    pledgeBtn.textContent = 'Pledge Taken ✅';
    pledgeBtn.disabled = true;
    pledgeBtn.style.opacity = '.7';
    pledgeBtn.style.cursor = 'default';
  }

  pledgeBtn.addEventListener('click', () => {
    if (localStorage.getItem('standup_pledged') === 'true') return;

    const newCount = getCount() + 1;
    setCount(newCount);
    localStorage.setItem('standup_pledged', 'true');

    pledgeBtn.textContent = 'Pledge Taken ✅';
    pledgeBtn.disabled = true;
    pledgeBtn.style.opacity = '.7';
    pledgeBtn.style.cursor = 'default';

    updatePledgeDisplay(newCount);
  });
}

// ---------- Report form ----------
const reportForm = document.getElementById('reportForm');
const formMsg    = document.getElementById('formMsg');

function showMessage(type, text) {
  if (!formMsg) return;
  formMsg.className = `form-message ${type}`;
  formMsg.textContent = text;
  formMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

if (reportForm) {
  reportForm.addEventListener('submit', e => {
    e.preventDefault();

    const incidentType = reportForm.querySelector('#incidentType').value.trim();
    const description  = reportForm.querySelector('#description').value.trim();

    if (!incidentType) {
      showMessage('error', 'Please select a type of bullying.');
      reportForm.querySelector('#incidentType').focus();
      return;
    }

    if (!description) {
      showMessage('error', 'Please describe the incident.');
      reportForm.querySelector('#description').focus();
      return;
    }

    if (description.length < 20) {
      showMessage('error', 'Please provide a more detailed description (at least 20 characters).');
      reportForm.querySelector('#description').focus();
      return;
    }

    // In a real deployment this would POST to a server or form service (e.g. Netlify Forms).
    // For now we show a thank-you message.
    showMessage('success', 'Thank you for your report. You are brave for speaking up. Someone will follow up if you provided contact details.');
    reportForm.reset();
  });
}

// ---------- Smooth scroll offset for sticky nav ----------
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navHeight = document.querySelector('.navbar')?.offsetHeight || 70;
    const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 8;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ---------- Scroll-reveal animation ----------
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.card, .type-item, .effect-group, .step, .resource-card').forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});
