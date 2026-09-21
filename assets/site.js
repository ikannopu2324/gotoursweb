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
