// mobile menu
const burger = document.querySelector('.burger');
const menu = document.querySelector('.menu');
if (burger) burger.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
});

// scroll reveal
const io = new IntersectionObserver((es) => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// tour filters
const chips = document.querySelectorAll('[data-filter]');
const cards = document.querySelectorAll('[data-region]');
const count = document.getElementById('tour-count');
chips.forEach(c => c.addEventListener('click', () => {
  chips.forEach(x => x.classList.remove('on'));
  c.classList.add('on');
  const f = c.dataset.filter;
  let n = 0;
  cards.forEach(card => {
    const show = f === 'all' || card.dataset.region.split(' ').includes(f);
    card.classList.toggle('hidden', !show);
    if (show) n++;
  });
  if (count) count.textContent = `Showing ${n} tour${n === 1 ? '' : 's'}`;
}));

// placeholder forms (Zoho integration pending)
document.querySelectorAll('form[data-zoho]').forEach(f => f.addEventListener('submit', e => {
  e.preventDefault();
  f.innerHTML = '<h3>Thank you!</h3><p style="margin-top:10px;color:#5d6172">This form is a placeholder until our Zoho integration is connected. In the meantime, call (909) 633-2577 or email info@gotours.org.</p>';
}));

// "Schedule this trip" links prefill the quote form: get-a-quote.html?trip=<slug>
const trip = new URLSearchParams(location.search).get('trip');
const tripOpt = trip && document.querySelector(`option[data-trip="${CSS.escape(trip)}"]`);
if (tripOpt) {
  tripOpt.selected = true;
  const msg = tripOpt.closest('form').querySelector('textarea[name="msg"]');
  if (msg && !msg.value) msg.value = `We'd like to schedule the ${tripOpt.textContent} for our group.`;
}

// itinerary section nav: highlight the section in view
const dayLinks = document.querySelectorAll('.daynav a');
if (dayLinks.length) {
  const byId = new Map([...dayLinks].map(a => [a.hash.slice(1), a]));
  const spy = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    dayLinks.forEach(a => a.classList.remove('on'));
    const a = byId.get(e.target.id);
    if (a) { a.classList.add('on'); a.parentElement.scrollTo({ left: a.offsetLeft - 24, behavior: 'smooth' }); }
  }), { rootMargin: '-45% 0px -50% 0px' });
  byId.forEach((_, id) => { const el = document.getElementById(id); if (el) spy.observe(el); });
}

// photo gallery lightbox
document.querySelectorAll('[data-lightbox]').forEach(g => {
  const dlg = document.createElement('dialog');
  dlg.className = 'lightbox';
  dlg.innerHTML = '<button aria-label="Close">&times;</button><img alt=""><p></p>';
  document.body.appendChild(dlg);
  dlg.addEventListener('click', e => { if (e.target !== dlg.querySelector('img')) dlg.close(); });
  g.addEventListener('click', e => {
    const a = e.target.closest('a'); if (!a) return;
    e.preventDefault();
    const im = a.querySelector('img');
    dlg.querySelector('img').src = a.href; dlg.querySelector('img').alt = im.alt;
    dlg.querySelector('p').textContent = im.alt;
    dlg.showModal();
  });
});
