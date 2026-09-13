/* ============================================================
   All of the interactive bits, kept in plain readable JS —
   no build step, no framework, just a few small functions.
   ============================================================ */

// ---- 1. Nav: solid background once you've scrolled a bit ----
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('is-scrolled', window.scrollY > 40);
});

// ---- 2. Mobile nav toggle ----
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', isOpen);
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ---- 3. Reveal-on-scroll, using IntersectionObserver so we're
//         not doing scroll math by hand ----
const revealTargets = document.querySelectorAll('.reveal, .reveal-stagger');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealTargets.forEach(el => revealObserver.observe(el));

// ---- 4. Counting numbers, animated once they scroll into view ----
const counters = document.querySelectorAll('.numbers__value');
const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1400;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      // ease-out-ish curve so it settles rather than stopping abruptly
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      el.textContent = value.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    countObserver.unobserve(el);
  });
}, { threshold: 0.5 });
counters.forEach(el => countObserver.observe(el));

// ---- 5. Altitude dial: dragging the slider swaps the flavor
//         panel between three real elevation bands ----
const altitudeSlider = document.getElementById('altitudeSlider');
const altitudeValue = document.getElementById('altitudeValue');
const altitudeRegion = document.getElementById('altitudeRegion');
const altitudeTitle = document.getElementById('altitudeTitle');
const altitudeNotes = document.getElementById('altitudeNotes');
const altitudeDesc = document.getElementById('altitudeDesc');

const altitudeBands = [
  {
    max: 1450,
    region: 'Low-terrace · Kavre district',
    title: 'Round & easy-drinking',
    notes: ['Milk chocolate', 'Brown sugar', 'Low acidity'],
    desc: 'Warmer, lower ground means faster-ripening cherries and a gentle, easy cup — the one we hand new coffee drinkers first.'
  },
  {
    max: 1650,
    region: 'Mid-terrace · Ilam district',
    title: 'Balanced & round',
    notes: ['Cocoa', 'Toasted almond', 'Soft caramel'],
    desc: 'Grown on gentler, sun-fed terraces, these beans ripen faster and carry a rounder, lower-acid body — the cup most of our regulars order without thinking twice.'
  },
  {
    max: 1800,
    region: 'High-terrace · Panchthar district',
    title: 'Bright & floral',
    notes: ['Stone fruit', 'Jasmine', 'Citrus acidity'],
    desc: 'Cooler nights and slower ripening at this elevation push more acidity and aromatics into the cherry — closer to what a specialty roaster in Europe would fight over.'
  }
];

function updateAltitudePanel(value) {
  const band = altitudeBands.find(b => value <= b.max) || altitudeBands[altitudeBands.length - 1];
  altitudeValue.textContent = Number(value).toLocaleString();
  altitudeRegion.textContent = band.region;
  altitudeTitle.textContent = band.title;
  altitudeDesc.textContent = band.desc;
  altitudeNotes.innerHTML = band.notes.map(n => `<span>${n}</span>`).join('');
}
altitudeSlider.addEventListener('input', (e) => updateAltitudePanel(e.target.value));
updateAltitudePanel(altitudeSlider.value);

// ---- 6. Newsletter form: demo-only, no real submission ----
const newsletterForm = document.getElementById('newsletterForm');
const newsletterNote = document.getElementById('newsletterNote');
newsletterForm.addEventListener('submit', (e) => {
  e.preventDefault();
  newsletterNote.textContent = "You're on the list. First harvest email coming your way.";
});