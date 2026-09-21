// Static site generator: `node build.js` writes all .html pages into ./
const fs = require('fs');
const path = require('path');

const PHONE = '(909) 633-2577', EMAIL = 'info@gotours.org';

const tours = [
  { slug: 'washington-dc', name: 'Washington, DC', img: 'dc.jpg', region: 'east', days: '4 to 6 days',
    blurb: 'Walk the halls of American history, from the Capitol to the memorials.',
    intro: 'Our flagship tour. Students stand where history happened, then reflect on what it means for a life of faith and citizenship.',
    special: [['dc.jpg', 'Guided visits to the Capitol, monuments, and memorials on the National Mall'], ['nyc.jpg', 'Museums and archives that bring the founding era to life'], ['eastcoast.jpg', 'Evening devotions and reflection tied to your school’s biblical themes']],
    stops: ['U.S. Capitol & National Mall', 'Lincoln, Jefferson & MLK Memorials', 'Smithsonian museums', 'Arlington National Cemetery', 'Mount Vernon'] },
  { slug: 'williamsburg', name: 'Williamsburg', img: 'williamsburg.jpg', region: 'east', days: '3 to 5 days',
    blurb: 'Step into colonial life and meet the people who shaped a new nation.',
    intro: 'Living history at its best. Costumed interpreters, working trades, and the stories of the Revolution.',
    special: [['williamsburg.jpg', 'Walk the streets of Colonial Williamsburg with expert interpreters'], ['eastcoast.jpg', 'Explore Jamestown and Yorktown, where a nation began'], ['dc.jpg', 'Pair with Washington, DC for a full Virginia history tour']],
    stops: ['Colonial Williamsburg', 'Historic Jamestowne', 'Yorktown Battlefield', 'Trades and hands-on workshops'] },
  { slug: 'new-york-city', name: 'New York City', img: 'nyc.jpg', region: 'east', days: '4 to 5 days',
    blurb: 'Immigration, industry, and iconic skylines in the city that never sleeps.',
    intro: 'From Ellis Island to the 9/11 Memorial, students see the story of America’s hopes, struggles, and resilience.',
    special: [['nyc.jpg', 'Take in the skyline and the Statue of Liberty by ferry'], ['dc.jpg', 'Reflect at the 9/11 Memorial & Museum'], ['performance.jpg', 'Optional Broadway and performance experiences']],
    stops: ['Statue of Liberty & Ellis Island', '9/11 Memorial & Museum', 'Times Square', 'Central Park', 'Broadway (optional)'] },
  { slug: 'gettysburg', name: 'Gettysburg', img: 'eastcoast.jpg', region: 'east', days: '2 to 3 days',
    blurb: 'Walk the battlefield where the outcome of the Civil War turned.',
    intro: 'Licensed battlefield guides and thoughtful reflection on courage, sacrifice, and reconciliation.',
    special: [['eastcoast.jpg', 'Licensed guides lead a full battlefield tour'], ['dc.jpg', 'Deliver the Gettysburg Address where it was spoken'], ['williamsburg.jpg', 'Combine with DC or Williamsburg for a longer trip']],
    stops: ['Gettysburg National Military Park', 'Soldiers’ National Cemetery', 'Museum & Cyclorama', 'Little Round Top'] },
  { slug: 'east-coast', name: 'Other East Coast Tours', img: 'eastcoast.jpg', region: 'east', days: 'Custom length',
    blurb: 'Philadelphia, Boston, Charleston and more, built around your goals.',
    intro: 'Beyond the classics, we design multi-city East Coast journeys for schools that want something different.',
    special: [['eastcoast.jpg', 'Multi-city itineraries built around your curriculum'], ['williamsburg.jpg', 'Historic sites from Boston to the Carolinas'], ['nyc.jpg', 'Flexible pacing for middle and high school groups']],
    stops: ['Philadelphia & Independence Hall', 'Boston Freedom Trail', 'Charleston & Fort Sumter', 'Your ideas welcome'] },
  { slug: 'california', name: 'California History', img: 'california.jpg', region: 'west', days: '5 to 7 days',
    blurb: 'Missions, gold rush country, and the Pacific coast, with faith and history woven together.',
    intro: 'A West Coast alternative: California’s missions, natural wonders, and the stories that shaped the Golden State.',
    special: [['california.jpg', 'Explore the California mission trail'], ['goserve.jpg', 'Add a service project to your itinerary'], ['eastcoast.jpg', 'Coastal and mountain landscapes students never forget']],
    stops: ['California missions', 'San Francisco', 'Gold Rush country', 'Pacific coastline'] },
  { slug: 'performance-tours', name: 'Band & Choir Tours', img: 'performance.jpg', region: 'performance', days: '4 to 6 days',
    blurb: 'Perform for new audiences in world-class venues while you explore.',
    intro: 'Your ensembles perform. We handle the venues, logistics, and sightseeing that make it unforgettable.',
    special: [['performance.jpg', 'Perform in inspiring venues and churches'], ['nyc.jpg', 'Pair performances with iconic destination sightseeing'], ['dc.jpg', 'Worship and service opportunities alongside concerts']],
    stops: ['Venue coordination', 'Workshops & clinics (optional)', 'Group sightseeing', 'Worship opportunities'] },
  { slug: 'custom-tours', name: 'Custom Tours', img: 'custom.jpg', region: 'east west performance', days: 'Any length',
    blurb: 'Every tour is customized to your school’s learning goals.',
    intro: 'Tell us your grade level, curriculum, and dream destinations. We build the tour from the ground up.',
    special: [['custom.jpg', 'Designed around your grade level and curriculum'], ['performance.jpg', 'Any mix of history, service, and performance'], ['goserve.jpg', 'Domestic or international, we make it happen']],
    stops: ['Your destinations', 'Your themes', 'Your schedule', 'Your budget'] },
];

// All testimonials pulled verbatim from gotours.org/testimonials (see testimonials.json)
const testimonials = require('./testimonials.json');

const faqs = [
  ['What makes GO Tours different from other student travel companies?', 'GO Tours is built around purpose-driven, educational travel with personalized design and top-of-the-line trip planning, materials, and service—without the inflated costs of the large tour providers.'],
  ['Can our school’s trip be customized?', 'Every GO Tour is built from the ground up around your school’s goals, grade level, curriculum, and desired destinations, tailored to highlight specific themes.'],
  ['What types of trips do you offer?', 'GO Tours specializes in educational and Christian faith-based travel for schools and homeschool groups, with popular destinations on the East Coast, California, and mission experiences abroad.'],
  ['How far in advance should we begin planning?', 'Most schools start planning 9–12 months in advance, though shorter timelines are possible for better pricing and family preparation.'],
  ['How does registration work for our group?', 'Schools receive a custom online registration portal where students and families can sign up, make payments, and access trip details while leaders monitor progress in real time.'],
  ['What payment options are available?', 'Families can pay by credit card or by EFT or ACH transfer directly from their bank account—without any additional fees—with flexible scheduling options.'],
  ['What happens if a trip must be canceled or changed?', 'GO Tours provides the most flexible options possible, including basic travel insurance and optional enhanced coverage protecting against illness, weather, and emergencies.'],
  ['Can students fundraise for their trip?', 'Every group receives a custom web portal that includes fundraising features allowing students to personalize pages and solicit contributions from family and friends.'],
  ['How does transportation work?', 'GO Tours partners with top national airlines—including United, Southwest, Alaska, American, Delta, and JetBlue—plus safe, licensed motorcoach transportation on the ground.'],
  ['What types of hotels do you use?', 'We select clean, comfortable, and student-friendly hotels like Hampton Inn & Suites and Courtyard by Marriott, prioritizing proximity to attractions and budget considerations.'],
  ['How many students and adults can go on a trip?', 'Groups range from fewer than 20 homeschool participants to full school classes, with flexible chaperone participation determined by group needs.'],
  ['What is the recommended student-to-chaperone ratio?', 'A ratio of about 1 adult for every 5–10 students works best for middle and high school groups, balancing supervision with relationship-building.'],
  ['What safety measures are in place during travel?', 'All providers are carefully vetted, and GO Tours employs additional nighttime security in hotel hallways with staff trained in safety protocols and emergency procedures.'],
  ['What if a student gets sick or needs medical care on the trip?', 'In emergencies, the team immediately contacts local emergency services or 911 and assists with urgent care access while keeping leaders and families informed.'],
  ['Are GO Tours trips insured?', 'Every trip includes basic travel insurance, with optional add-on coverage available for cancellations, medical emergencies, and travel interruptions.'],
  ['How does GO Tours incorporate Christian or educational themes into its tours?', 'Itineraries connect classroom learning with real-world experiences while providing meaningful opportunities for spiritual reflection aligned with identified biblical themes.'],
  ['What is the GO Tours educational Tour Book, and how is it customized for each school?', 'Each school receives a customized educational Tour Book featuring background information, maps, videos, speeches, and reflection questions tied to biblical and educational themes, sometimes graded for coursework credit.'],
  ['What kinds of learning experiences do students gain outside the classroom on a GO Tour?', 'Students experience hands-on learning, cultural immersion, and opportunities for personal growth through historical exploration, service projects, and devotional moments within a Christian worldview framework.'],
];

// ---------- shared pieces ----------
// Icons: Lucide (https://lucide.dev), ISC license, inlined as SVG
const ICONS={
 plane:'<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>',
 bed:'<path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8"/><path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4"/><path d="M12 4v6"/><path d="M2 18h20"/>',
 utensils:'<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>',
 camera:'<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>',
 ticket:'<path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/>',
 user:'<circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"/>',
 map:'<polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" x2="9" y1="3" y2="18"/><line x1="15" x2="15" y1="6" y2="21"/>',
 book:'<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
 shield:'<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
 monitor:'<rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/>',
 arrow:'<path d="M7 7h10v10"/><path d="M7 17 17 7"/>',
 star:'<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
};
const ico=(n,fill)=>'<svg viewBox="0 0 24 24" width="'+(fill?16:28)+'" height="'+(fill?16:28)+'" fill="'+(fill?'currentColor':'none')+'" stroke="currentColor" stroke-width="'+(fill?1:1.6)+'" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+ICONS[n]+'</svg>';
const stars = '<span class="stars" aria-label="5 out of 5 stars">' + ('<i>'+ico('star',true)+'</i>').repeat(5) + '</span>';
const short = (t, n = 150) => t.length <= n ? t : t.slice(0, n).replace(/s+S*$/, '') + '…';
const revCard = ([n, t], brief) => `<figure class="rev">${stars}<p>“${brief ? short(t) : t}”</p><cite>${n}</cite></figure>`;

const nav = (active) => `
<header class="site"><div class="wrap nav">
  <a class="logo" href="index.html" aria-label="GO Tours home"><img src="images/logo.png" alt="GO Tours"></a>
  <button class="burger" aria-label="Menu" aria-expanded="false"><span></span><span></span><span></span></button>
  <ul class="menu">
    <li><a href="about.html" class="${active === 'about' ? 'active' : ''}">About</a></li>
    <li class="has-sub"><a href="destinations.html" class="${active === 'dest' ? 'active' : ''}">Destinations</a>
      <ul class="sub">${tours.map(t => `<li><a href="${t.slug}.html">${t.name}</a></li>`).join('')}</ul></li>
    <li><a href="go-serve.html" class="${active === 'serve' ? 'active' : ''}">GO Serve</a></li>
    <li><a href="tour-planning.html" class="${active === 'plan' ? 'active' : ''}">Tour Planning</a></li>
    <li class="has-sub"><a href="faqs.html">Resources</a>
      <ul class="sub"><li><a href="faqs.html">FAQs</a></li><li><a href="testimonials.html">Testimonials</a></li><li><a href="gallery.html">Gallery</a></li><li><a href="merch.html">Merch</a></li></ul></li>
    <li class="has-sub"><a href="get-a-quote.html">Get Started</a>
      <ul class="sub"><li><a href="contact.html">Talk to an Advisor</a></li><li><a href="get-a-quote.html">Get a Quote</a></li></ul></li>
  </ul>
  <div class="nav-cta"><a class="btn contact" href="contact.html">Contact us</a><a class="btn primary" href="https://gotours.wetravel.com" target="_blank" rel="noopener">My Account</a></div>
</div></header>`;

const footer = `
<footer><div class="wrap">
  <div class="foot">
    <div><img class="fl" src="images/logo-white.png" alt="GO Tours"><p>GO See | GO Learn | GO Serve.<br>Faith-centered educational travel for Christian schools and homeschool groups.</p><img class="acsi" src="images/acsi.png" alt="ACSI Strategic Partner"></div>
    <div><h4>Explore</h4><ul><li><a href="about.html">About</a></li><li><a href="destinations.html">Destinations</a></li><li><a href="go-serve.html">GO Serve</a></li><li><a href="tour-planning.html">Tour Planning</a></li></ul></div>
    <div><h4>Resources</h4><ul><li><a href="faqs.html">FAQs</a></li><li><a href="testimonials.html">Testimonials</a></li><li><a href="gallery.html">Gallery</a></li><li><a href="merch.html">Merch</a></li><li><a href="https://gotours.wetravel.com">My Account</a></li></ul></div>
    <div><h4>Get in touch</h4><ul><li><a href="tel:+19096332577">${PHONE}</a></li><li><a href="mailto:${EMAIL}">${EMAIL}</a></li><li><a href="contact.html">Talk to an Advisor</a></li><li><a href="get-a-quote.html">Get a Quote</a></li></ul></div>
  </div>
  <div class="legal"><span>© ${new Date().getFullYear()} GO Tours LLC</span><span>Fully Licensed as Seller of Travel · CA SOT #2150239-50 · Surety-Bonded · Member of the California Travel Restitution Fund</span></div>
</div></footer>`;

const page = (file, { title, desc, active, body }) => {
  fs.writeFileSync(path.join(__dirname, file), `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title} | GO Tours</title>
<meta name="description" content="${desc}">
<meta property="og:title" content="${title} | GO Tours"><meta property="og:description" content="${desc}"><meta property="og:type" content="website"><meta name="theme-color" content="#1d2660">
<link rel="icon" href="images/logo.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/style.css">
</head><body>
<a class="skip" href="#main">Skip to content</a>
${nav(active)}
<main id="main">${body}</main>
${footer}
<script src="assets/site.js"></script>
</body></html>`);
};

const pageHero = (img, eyebrow, h1, p, extra = '') => `
<section class="hero page-hero"><img class="bg" src="images/${img}" alt=""><div class="wrap">
<span class="eyebrow">${eyebrow}</span><h1>${h1}</h1>${p ? `<p>${p}</p>` : ''}${extra}</div></section>`;

const tourCard = (t) => `
<a class="card reveal" href="${t.slug}.html" data-region="${t.region}"><div class="ph"><img src="images/${t.img}" alt="${t.name}" loading="lazy"></div>
<div class="tx"><h3>${t.name}</h3><p>${t.blurb}</p><small>${t.days}</small></div></a>`;

const cta = (h = 'Ready to plan your school’s trip?', p = 'Talk with an expert tour planner. Every tour is completely customized to meet your school’s learning goals.') => `
<section class="cta"><div class="wrap"><h2>${h}</h2><p>${p}</p>
<div class="btn-row" style="justify-content:center"><a class="btn primary" href="get-a-quote.html">Get a Quote</a><a class="btn light" href="contact.html">Talk to an Advisor</a></div></div></section>`;

const incItems = [['plane', 'Airfare & transportation'], ['bed', 'Hotels'], ['utensils', 'Regional-style meals'], ['camera', 'Guided sightseeing'], ['ticket', 'Entrances'],
  ['user', 'Full-time Tour Director'], ['map', 'Expert local guides'], ['book', 'Custom educational Tour Book'], ['shield', 'Basic travel insurance'], ['monitor', 'Online registration portal']];
const includes = `<div class="includes">${incItems.map(([i, t]) => `<div class="inc reveal"><i>${ico(i)}</i>${t}</div>`).join('')}</div>`;

// ---------- pages ----------
// HOME
page('index.html', {
  title: 'Educational Tours for Christian Schools', desc: 'Faith-centered educational travel for Christian schools and homeschool groups. GO See. GO Learn. GO Serve.', active: '',
  body: `
<section class="hero"><img class="bg" src="images/dc.jpg" alt="U.S. Capitol at sunset"><div class="wrap">
  <span class="eyebrow">Educational tours for Christian schools</span>
  <h1>GO See. GO Learn. <em>GO Serve.</em></h1>
  <p>Faith-centered educational travel that empowers students to explore history, adventure, and their faith—through a biblical worldview.</p>
  <div class="btn-row"><a class="btn primary" href="destinations.html">See tour destinations</a><a class="btn light" href="contact.html">Talk to an Advisor</a></div>
</div></section>

<section><div class="wrap define">
  <div class="reveal"><span class="eyebrow">Who we are</span><h2>Defining faith-centered educational travel</h2>
    <p>GO Tours was founded by Nathan Lambert after 23 years directing educational journeys for Christian schools. We understand educators because we are educators. Every tour is built around your school’s mission, curriculum, and goals—blending learning, adventure, and spiritual development.</p>
    <p>We handle every logistical detail so your trip is secure, meaningful, and stress-free.</p>
    <div class="btn-row"><a class="btn" href="about.html">Learn more ${ico('arrow')}</a></div></div>
  <div class="circles reveal" aria-hidden="true"><div class="c1"></div><div class="c2"></div><div class="c3"></div></div>
</div></section>

<section class="bigtext" id="where"><div class="wrap"><h2>Let’s get you where you need to go</h2>
  <div class="btn-row"><a class="btn navy" href="tour-planning.html">Information for schools</a><a class="btn" href="faqs.html">Information for families</a></div></div>
  <div class="bigword" aria-hidden="true">Where learning meets life</div>
  <div class="band" role="img" aria-label="Group touring Washington, DC"></div>
</section>

<section id="tours"><div class="wrap">
  <div class="center"><h2>Popular Tours</h2><p class="lead" style="margin-top:16px">If you’re ready to inspire what’s next for your students, this is the perfect place to start. Every itinerary is customized to your group.</p></div>
  <div class="filters"><button class="chip on" data-filter="all">All</button><button class="chip" data-filter="east">East Coast</button><button class="chip" data-filter="west">West Coast</button><button class="chip" data-filter="performance">Performance</button></div>
  <div class="count" id="tour-count">Showing ${tours.length} tours</div>
  <div class="grid4">${tours.map(tourCard).join('')}</div>
</div></section>

<section class="dark" id="special"><div class="wrap">
  <div class="dark-head"><h2>What makes GO Tours special?</h2><a class="btn white" href="tour-planning.html">How planning works</a></div>
  <div class="special">
    <div class="reveal"><img src="images/williamsburg.jpg" alt="" loading="lazy"><p>Costumed interpreters and living history that bring the story of America to life</p></div>
    <div class="reveal"><img src="images/nyc.jpg" alt="" loading="lazy"><p>Iconic cities, landmarks, and hidden gems chosen for your school’s learning goals</p></div>
    <div class="reveal"><img src="images/goserve.jpg" alt="" loading="lazy"><p>Optional GO Serve projects that turn sightseeing into meaningful service</p></div>
  </div>
</div></section>

<section class="dark" style="padding-top:0"><div class="wrap itin">
  <div class="itin-img reveal"><img src="images/eastcoast.jpg" alt="" loading="lazy"></div>
  <div><span class="eyebrow">What you’ll do</span><h2>Explore a sample itinerary</h2>
    <ul class="days">
      <li><b>Day 1: Travel to Washington, DC</b><span>Meet your Tour Director and begin your journey</span></li>
      <li><b>Day 2: Monuments & memorials</b><span>Walk the National Mall with expert local guides</span></li>
      <li><b>Day 3: Museums & the Capitol</b><span>Hands-on learning tied to your Tour Book</span></li>
    </ul><a class="btn white" href="washington-dc.html">View full itinerary</a></div>
</div></section>

<section id="includes"><div class="wrap center"><h2>Your experience includes</h2>${includes}
  <div class="btn-row"><a class="btn" href="tour-planning.html">View more</a></div></div></section>

<section id="reviews"><div class="wrap">
  <h2>Reviews</h2><p class="lead" style="margin-top:12px">Real stories from the parents, teachers, and students who have traveled with us.</p>
  <div class="reviews">
    <div class="rating"><b>Loved by families and schools</b><br><small style="color:var(--muted)">Live rating from WeTravel coming soon</small></div>
    <div class="rev-track">${testimonials.slice(0, 8).map(r => revCard(r, true)).join('')}</div>
  </div>
  <div class="wetravel-slot" id="wetravel-reviews">WeTravel reviews widget mounts here (API integration pending). Showing our published testimonials for now.</div>
  <div class="btn-row"><a class="btn" href="testimonials.html">Read all testimonials</a></div>
</div></section>

<section style="padding:0" id="people"><div class="split">
  <div class="txt"><span class="eyebrow">Peace of mind</span><h2>Guides who care about every student</h2>
    <p>Our Tour Directors and guides are experienced educators who connect history and faith at every stop. Every trip includes basic travel insurance, vetted providers, and additional nighttime hotel security so leaders and families can travel with confidence.</p>
    <div class="btn-row"><a class="btn" href="faqs.html">Read our safety FAQs</a></div></div>
  <div class="img" style="background-image:url(images/about1.jpg)" role="img" aria-label="GO Tours group"></div>
</div></section>

<section><div class="wrap"><div class="center"><span class="eyebrow">How it works</span><h2>From first call to final day</h2></div>
  <div class="steps">
    <div class="step reveal"><h3>Talk with an advisor</h3><p>Share your goals, grade level, and dream destinations.</p></div>
    <div class="step reveal"><h3>Get a custom quote</h3><p>A tour built around your curriculum and budget.</p></div>
    <div class="step reveal"><h3>Register families</h3><p>Your own online portal with payments and fundraising.</p></div>
    <div class="step reveal"><h3>GO!</h3><p>Your Tour Director handles the details. Your students grow.</p></div>
  </div></div></section>

<section style="padding:0"><div class="wrap" style="padding-bottom:70px;text-align:center"><p style="color:var(--muted);font-size:.9rem;margin-bottom:12px">Proud partner</p><img src="images/acsi.png" alt="ACSI Strategic Partner" style="height:56px;margin:auto"></div></section>
${cta()}`,
});

// DESTINATIONS
page('destinations.html', {
  title: 'Destinations', desc: 'Explore GO Tours destinations: Washington DC, Williamsburg, New York City, Gettysburg, California, performance and custom tours.', active: 'dest',
  body: `${pageHero('williamsburg.jpg', 'Destinations', 'Exceptional school trips', 'From the nation’s capital to the California coast, every destination is customized to your school.')}
<section><div class="wrap">
  <div class="filters" style="margin-top:0"><button class="chip on" data-filter="all">All</button><button class="chip" data-filter="east">East Coast</button><button class="chip" data-filter="west">West Coast</button><button class="chip" data-filter="performance">Performance</button></div>
  <div class="count" id="tour-count">Showing ${tours.length} tours</div>
  <div class="grid4">${tours.map(tourCard).join('')}</div></div></section>${cta()}`,
});

// TOUR PAGES
tours.forEach(t => {
  page(`${t.slug}.html`, {
    title: t.name, desc: t.blurb, active: 'dest',
    body: `${pageHero(t.img, 'Destination', t.name, t.intro, `<div class="facts"><span>${t.days}</span><span>Fully customized</span><span>Tour Director included</span></div>`)}
<section class="dark"><div class="wrap"><div class="dark-head"><h2>What makes this tour special?</h2><a class="btn white" href="contact.html">Download a tour overview</a></div>
  <div class="special">${t.special.map(([i, s]) => `<div class="reveal"><img src="images/${i}" alt="" loading="lazy"><p>${s}</p></div>`).join('')}</div></div></section>
<section><div class="wrap two">
  <div><span class="eyebrow">What you’ll do</span><h2>Sample highlights</h2><p>Every itinerary is tailored, but these are some of the stops schools love on our ${t.name} tour.</p>
    <ul class="checks">${t.stops.map(s => `<li>${s}</li>`).join('')}</ul>
    <h3 style="margin-top:44px">Your experience includes</h3>${includes}</div>
  <aside class="side"><h3>Plan your ${t.name} trip</h3><p>Talk to an advisor or request a quote. We’ll build an itinerary around your goals.</p>
    <a class="btn primary" href="get-a-quote.html">Get a Quote</a> <a class="btn" style="margin-top:10px" href="contact.html">Talk to an Advisor</a></aside>
</div></section>${cta()}`,
  });
});

// ABOUT
page('about.html', {
  title: 'About', desc: 'GO Tours empowers students to explore their faith through educational travel. Founded by Nathan Lambert.', active: 'about',
  body: `${pageHero('about2.jpg', 'About us', 'GO See | GO Learn | GO Serve', 'Empowering students to explore their faith through educational travel.')}
<section><div class="wrap two">
  <div><span class="eyebrow">Our mission</span><h2>What is GO Tours?</h2>
    <p>Our mission is to empower students to explore their faith through educational travel. We deliver experiences that blend learning, adventure, and spiritual development, and we handle every logistical detail to ensure trips are secure and impactful.</p>
    <h3 style="margin-top:36px">Our values</h3>
    <p>We provide exceptional, faith-focused educational travel experiences for Christian institutions and homeschool organizations. Our tours integrate academics with careful planning, professional guidance, and experienced educators who connect history and faith at each location.</p></div>
  <div class="founder"><span class="eyebrow">Meet our founder</span><h3>Nathan Lambert</h3><p>Nathan directed Christian school tours for over 23 years before establishing GO Tours, focusing on academic, social, and spiritual development.</p></div>
</div></section>
<section style="background:var(--sand)"><div class="wrap"><div class="center"><span class="eyebrow">Our story</span><h2>Built by an educator, for educators</h2>
  <p class="lead" style="margin-top:16px">After 23 years directing educational journeys, Nathan saw a gap and set out to craft faith-centered, educational travel experiences aligned with each institution’s mission. That is GO Tours.</p></div>
  <div class="pillars"><div class="pillar reveal"><div class="n">GO</div><h3>See</h3><p>Stand where history happened and experience the world firsthand.</p></div>
  <div class="pillar navy reveal"><div class="n">GO</div><h3>Learn</h3><p>Connect classroom learning to real-world experience through a biblical worldview.</p></div>
  <div class="pillar reveal"><div class="n">GO</div><h3>Serve</h3><p>Put faith into action with service that changes students and communities.</p></div></div></div></section>
<section><div class="wrap"><div class="gallery" style="columns:4"><img src="images/about1.jpg" alt=""><img src="images/about2.jpg" alt=""><img src="images/about3.jpg" alt=""><img src="images/about4.jpg" alt=""></div></div></section>${cta('Have a question?', 'Our FAQs answer the most common questions from administrators, educators, and families.')}`,
});

// GO SERVE
page('go-serve.html', {
  title: 'GO Serve', desc: 'GO Serve mission trips: put faith into action through service-focused educational travel.', active: 'serve',
  body: `${pageHero('goserve.jpg', 'GO Serve', 'Faith in action', 'Mission and service experiences for students who are ready to do more than sightsee.')}
<section><div class="wrap two">
  <div><span class="eyebrow">Service travel</span><h2>Serve alongside the communities you visit</h2>
    <p>GO Serve trips combine hands-on service with cultural immersion and devotional moments within a Christian worldview. Add a service project to any domestic itinerary, or join a mission experience abroad such as Belize.</p>
    <ul class="checks"><li>Service projects designed with local ministry partners</li><li>Devotional moments and guided reflection</li><li>Cultural immersion and community connection</li><li>Full logistics, safety, and Tour Director support</li></ul>
    <div class="btn-row"><a class="btn primary" href="contact.html">Talk to an Advisor</a><a class="btn" href="merch.html">Get GO Serve gear</a></div></div>
  <div class="card" style="pointer-events:none"><div class="ph"><img src="images/goserve.jpg" alt="GO Serve"></div></div>
</div></section>${cta()}`,
});

// TOUR PLANNING
page('tour-planning.html', {
  title: 'Tour Planning', desc: 'How GO Tours plans your school trip: custom itineraries, registration portal, Tour Book, and full support.', active: 'plan',
  body: `${pageHero('custom.jpg', 'Tour planning', 'Every tour is completely customized', 'Built from the ground up around your school’s goals, grade level, curriculum, and desired destinations.')}
<section><div class="wrap"><div class="center"><span class="eyebrow">Our process</span><h2>Simple for you, unforgettable for them</h2></div>
  <div class="steps">
    <div class="step reveal"><h3>Consult</h3><p>Talk with an expert tour planner. Most schools start 9–12 months out.</p></div>
    <div class="step reveal"><h3>Design</h3><p>We build a custom itinerary and Tour Book tied to biblical and educational themes.</p></div>
    <div class="step reveal"><h3>Register</h3><p>A custom online portal for sign-ups, payments (no ACH fees), and fundraising.</p></div>
    <div class="step reveal"><h3>Travel</h3><p>Airlines, licensed motorcoaches, student-friendly hotels, and a full-time Tour Director.</p></div>
  </div></div></section>
<section style="background:var(--sand)"><div class="wrap center"><h2>Your experience includes</h2>${includes}</div></section>${cta()}`,
});

// FAQS
page('faqs.html', {
  title: 'FAQs', desc: 'Answers to common questions from administrators, educators, and families about GO Tours.', active: '',
  body: `${pageHero('about3.jpg', 'Resources', 'Frequently asked questions', 'Answers for administrators, educators, and families.')}
<section><div class="wrap"><div class="faq">${faqs.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join('')}</div></div></section>${cta('Still have questions?', 'Call us or talk with an advisor. We’re happy to help.')}`,
});

// TESTIMONIALS
page('testimonials.html', {
  title: 'Testimonials', desc: 'Testimonials for GO Tours from parents, teachers, and students.', active: '',
  body: `${pageHero('about4.jpg', 'Resources', 'Testimonials for GO Tours', 'Real stories from travelers like you.')}
<section><div class="wrap"><div class="wetravel-slot" id="wetravel-reviews">WeTravel reviews API integration pending. Showing testimonials from our guests.</div>
  <div class="wall">${testimonials.map(r => revCard(r)).join('')}</div></div></section>${cta()}`,
});

// GALLERY
page('gallery.html', {
  title: 'Gallery', desc: 'Photos from GO Tours trips.', active: '',
  body: `${pageHero('performance.jpg', 'Resources', 'Gallery', 'Moments from the road.')}
<section><div class="wrap"><div class="gallery">${['dc', 'williamsburg', 'nyc', 'performance', 'custom', 'eastcoast', 'california', 'goserve', 'about1', 'about2', 'about3', 'about4'].map(i => `<img src="images/${i}.jpg" alt="GO Tours trip photo" loading="lazy">`).join('')}</div></div></section>`,
});

// MERCH
page('merch.html', {
  title: 'Merch', desc: 'GO Tours merch: GO Serve hat and more.', active: '',
  body: `${pageHero('goserve.jpg', 'Merch', 'Gear up', 'Rep GO Tours on your next adventure.')}
<section><div class="wrap"><a class="prod" href="https://gotours.org/product/go-serve-hat/"><img src="images/hat.jpg" alt="GO Serve hat" onerror="this.src='images/logo.png'"><div><b>GO Serve hat</b><span>$19.50</span><p style="color:var(--muted);font-size:.92rem;margin-top:6px">Low profile, adjustable strap, curved visor. Perfect for Belize.</p></div></a></div></section>`,
});

const formFields = (quote) => `
<div class="row"><div><label>First name</label><input required name="first"></div><div><label>Last name</label><input required name="last"></div></div>
<div class="row"><div><label>Email</label><input required type="email" name="email"></div><div><label>Phone</label><input type="tel" name="phone"></div></div>
<div class="row"><div><label>School / organization</label><input name="school"></div><div><label>Role</label><select name="role"><option>Administrator</option><option>Teacher / Sponsor</option><option>Parent</option><option>Homeschool leader</option><option>Other</option></select></div></div>
${quote ? `<div class="row"><div><label>Destination</label><select name="dest">${tours.map(t => `<option>${t.name}</option>`).join('')}</select></div><div><label>Approx. group size</label><input name="size"></div></div><div class="row"><div><label>Preferred travel dates</label><input name="dates"></div><div><label>Grade levels</label><input name="grades"></div></div>` : ''}
<label>${quote ? 'Tell us about your goals' : 'How can we help?'}</label><textarea name="msg"></textarea>
<button class="btn primary" type="submit">${quote ? 'Request my quote' : 'Send message'}</button>
<p class="note">Zoho form integration pending. This form does not yet submit.</p>`;

page('contact.html', {
  title: 'Talk to an Advisor', desc: 'Talk with an expert tour planner at GO Tours.', active: '',
  body: `${pageHero('about1.jpg', 'Get started', 'Talk with an expert tour planner', '')}
<section><div class="wrap contact-grid"><div><h2>Let’s design your trip</h2><p class="lead" style="margin-top:14px">Tell us a little about your group and we’ll reach out to talk goals, destinations, and timing.</p>
  <ul class="contact-list"><li><a href="tel:+19096332577">${PHONE}</a></li><li><a href="mailto:${EMAIL}">${EMAIL}</a></li></ul></div>
  <div class="formbox"><form data-zoho>${formFields(false)}</form></div></div></section>`,
});

page('get-a-quote.html', {
  title: 'Get a Quote', desc: 'Request a custom quote for your school trip.', active: '',
  body: `${pageHero('dc.jpg', 'Get started', 'Request a quote', '')}
<section><div class="wrap contact-grid"><div><h2>A trip built around your goals</h2><p class="lead" style="margin-top:14px">Share a few details and we’ll put together a custom quote with no obligation.</p>
  <ul class="contact-list"><li><a href="tel:+19096332577">${PHONE}</a></li><li><a href="mailto:${EMAIL}">${EMAIL}</a></li></ul></div>
  <div class="formbox"><form data-zoho>${formFields(true)}</form></div></div></section>`,
});

page('404.html', {
  title: 'Page not found', desc: 'Page not found.', active: '',
  body: `${pageHero('dc.jpg', '404', 'This trip took a wrong turn', 'The page you are looking for does not exist.', '<div class="btn-row"><a class="btn primary" href="index.html">Back to home</a></div>')}`,
});

console.log('Built', fs.readdirSync(__dirname).filter(f => f.endsWith('.html')).length, 'pages');
