/* PLUMBING_V 4 — Bespoke Studio · meccanica invisibile canonica.
   ────────────────────────────────────────────────────────────────
   CONFINE (inviolabile): questo file contiene SOLO plumbing — la meccanica
   che il visitatore non percepisce come design. NIENTE markup di sezioni,
   NIENTE stile, NIENTE struttura: concept, griglia, tipografia, hero e
   animazioni-firma si progettano DA ZERO per ogni cliente (GATE #3).
   Se qui dentro scivola del layout, questo diventa il nuovo scheletro
   condiviso — cioè il difetto "copia-incolla" che il metodo combatte.

   Come si usa: si COPIA nella cartella js/ del sito e si adatta la sola
   costante SITE. Le animazioni-firma del sito si scrivono nel proprio
   main.js DOPO questo file (o in coda a questo file, sotto il marcatore).
   Ogni bug nuovo si corregge QUI (bump PLUMBING_V + changelog nel README)
   e poi nel sito: mai il contrario.

   Fix già incorporati (non rimuovere):
   - ScrollTrigger registrato SUBITO allo script load, MAI dentro l'intro
     o un setTimeout (bug APF #5 del 16/7: race col watchdog → sezioni
     che sparivano allo scroll).
   - Reveal con once:true (niente re-animazioni da zero ri-scorrendo).
   - Watchdog 1,5s che forza visibile e UCCIDE i trigger non scattati.
   - Lightbox su [hidden] + override CSS !important (bug: display:flex
     batteva [hidden] e la lightbox restava visibile).
   - Foto-contenuto MAI lazy (regola workflow §8): il plumbing non tocca
     il loading, ma il lint lo verifica.
   - Orari Europe/Rome con finestre multiple e scavalco di mezzanotte
     (pattern Il Cavallante 18:00–00:30). */

(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) root.classList.add('reduced-motion');

  /* ══════════ CONFIG PER-SITO — l'unica parte da adattare ══════════ */
  var SITE = {
    slug: 'master-color-niguarda',    // usato per localStorage lang
    whatsapp: {
      number: '',                     // '39xxxxxxxxxx' — vuoto = niente wiring
      message: 'Ciao! Vorrei informazioni.',
      ids: ['ctaPrenota', 'heroWhatsapp', 'doveWhatsapp', 'barWhatsapp'],
    },
    /* orari: per giorno (0=domenica) un array di finestre [inizio, fine]
       in minuti-stringa 'HH:MM'. Fine oltre '24:00' = scavalca mezzanotte
       (es. ['18:00','24:30'] = apre alle 18, chiude alle 00:30 del giorno
       dopo). Giorno chiuso = []. */
    /* Scheda Google, tabella aperta a schermo il 24/9/2026: lunedì 15–19, mar–sab 8:30–12:30 e 15–19, domenica chiuso. */
    hours: {
      0: [],
      1: [['15:00', '19:00']],
      2: [['08:30', '12:30'], ['15:00', '19:00']],
      3: [['08:30', '12:30'], ['15:00', '19:00']],
      4: [['08:30', '12:30'], ['15:00', '19:00']],
      5: [['08:30', '12:30'], ['15:00', '19:00']],
      6: [['08:30', '12:30'], ['15:00', '19:00']],
    },
    hoursStatusId: 'orarioStato',     // elemento testo stato
    hoursTableSelector: '[data-day]', // righe/li con data-day da evidenziare
    todayClass: 'is-today',
    introId: 'intro',
    introDuration: 2600,
    revealSelector: '.reveal',
    inViewClass: 'in-view',
    breakpointMenu: 960,
    /* dizionario EN: SOLO overlay — l'HTML è la versione italiana.
       Forma storica a due lingue, resta valida e invariata. */
    EN: {
      "intro.f": "Master Color Niguarda · via Luigi Ornato 17, Milan",
      "intro.skip": "skip",
      "nav.home": "Master Color Niguarda, back to top",
      "nav.apri": "Open the menu",
      "marchio.s": "paint shop · via Luigi Ornato 17, Milan",
      "nav.voglie": "What to do",
      "nav.banco": "At the counter",
      "nav.metri": "Square metres",
      "nav.recensioni": "Reviews",
      "nav.orari": "Hours and where",
      "nav.domande": "Questions",
      "cta.chiama": "Call",
      "cta.chiama2": "Call +39 02 642 5848",
      "h.k": "Paint shop · paints, enamels, varnishes, art supplies, household products · via Luigi Ornato 17, Niguarda, Milan",
      "h.gloss": "It is written on the shop windows in via Ornato, in coloured letters, one colour each: a longing for colour.",
      "h.p": "Inside is a neighbourhood paint shop where what counts is leaving with <b>the right product</b> for what you have to do, and the advice to use it: walls, iron, wood, mould, drawing, the house.",
      "h.cta1": "Call +39 02 642 5848",
      "h.cta2": "What do you have to do?",
      "h.cta3": "How many square metres",
      "h.badge": "4.4 on Google with 38 reviews · «competent» is the word customers write most often",
      "h.zoom": "Enlarge the photo of the shopfront",
      "h.alt": "The shopfront in via Luigi Ornato: the two signs Mastercolor Niguarda and Mastercolor Colorificio, and on the windows the words Voglia di colore in coloured letters",
      "h.cap": "the windows at via Luigi Ornato 17 (photo from the Google listing)",
      "v.k": "what to do",
      "v.h": "What do you have to do?",
      "v.p": "Six reasons people walk into a paint shop, plus one written on the sign in the window. For each, what to bring and what you leave with. The product names come from the counter: they depend on the wall, the iron, the wood you have.",
      "v1.h": "Repaint a room",
      "v1.p": "Walls and ceiling: washable or breathable emulsion, a primer if the wall asks for it, rollers, brushes, dust sheets and tape.",
      "v1.b": "<b>Bring:</b> the measurements of the room (the square-metre calculator is below) and a photo of the wall as it is now.",
      "v2.h": "A gate, a railing, a radiator",
      "v2.p": "Iron wants sandpaper, an anti-rust primer and the right enamel for staying outdoors or indoors.",
      "v2.b": "<b>Bring:</b> a photo, and tell us whether it is outside or inside.",
      "v3.h": "Doors, shutters, a piece of furniture",
      "v3.p": "Wood is treated differently if it is new, already varnished or to be brought back to natural: stains, varnishes, enamels, waxes.",
      "v3.b": "<b>Bring:</b> a photo is enough to start; a chip of the old colour, if there is one, helps.",
      "v4.h": "Mould and damp",
      "v4.p": "First you work out where it comes from, then you choose: anti-mould, breathable paints, products for walls that sweat.",
      "v4.b": "<b>Bring:</b> a photo of the stain, and say whether the wall faces outside.",
      "v5.h": "Drawing and painting",
      "v5.p": "Pencils, pastels, tempera, watercolours, easels: the art-supplies window, for school and for people who really paint.",
      "v5.b": "<b>Bring:</b> the school list, or the idea of what you want to try.",
      "v6.h": "Cleaning and scenting the house",
      "v6.p": "Detergents, sanitisers, products for floors and surfaces, recommended one by one: one customer writes about a spotless, fragrant home.",
      "v6.b": "<b>Bring:</b> the name of the surface: marble, parquet, stoneware, glass.",
      "v.zoom": "Enlarge the photo of the art-supplies window",
      "v.alt": "The art-supplies window: easels, paintings, boxes of pastels and coloured pencils",
      "v.cap": "the art-supplies window, for want number five (photo from the Google listing)",
      "v7.h": "Made-to-measure doormats",
      "v7.p": "It says so on the sign in the window.",
      "v7.b": "<b>Bring:</b> the measurements of your entrance.",
      "b.k": "at the counter",
      "b.h": "The right product.",
      "b.p1": "The shop belongs to Mr Oggioni, and it shows: he updates the Google listing himself, he answers the reviews himself, and when you come in with a problem the answer is a product, not an aisle.",
      "b.cit": "«The product is the most suitable one»",
      "b.cit2": "from a Google review three months ago",
      "b.p2": "Bring what you have: a photo of the wall or the furniture, the measurements, the old tin if it is still around. That is where it starts.",
      "b.n1": "reviews out of 17 mention competence and advice",
      "b.n2": "say the shop is well stocked",
      "b.n3": "mention helpfulness and courtesy",
      "b.nota": "counted on the 17 Google reviews with a text, September 2026",
      "b.zoom": "Enlarge the photo of the inside",
      "b.alt": "Inside the paint shop: the spray-can rack, the paint buckets, the red counter and the colour charts",
      "b.cap": "inside: the spray cans, the buckets, the counter (photo from the Google listing)",
      "q.k": "how many square metres?",
      "q.h": "Measure the room.",
      "q.p": "Length, width, height; then doors and windows. The sum gives the square metres of walls and ceiling: bring them to the counter. How many coats and how many litres, Mr Oggioni will tell you, because it depends on the product and on the wall.",
      "q.l": "Length (m)",
      "q.w": "Width (m)",
      "q.a": "Height (m)",
      "q.d": "Doors",
      "q.f": "Windows",
      "q.pareti": "walls",
      "q.soffitto": "ceiling",
      "q.nota": "Doors counted as 1.7 m² each, windows 1.5 m²: an indicative sum, to reach the counter with a number in hand.",
      "r.k": "reviews",
      "r.h": "What people write.",
      "r.p": "Five Google reviews, as they were written.",
      "r.voto": "out of 5 · 38 Google reviews",
      "r1.c": "Marco C. · 3 years ago · 5 stars",
      "r2.c": "lucia p. · a year ago · 5 stars",
      "r3.c": "Marika D. S. · 10 months ago · 5 stars",
      "r4.c": "Zoe T. · 2 years ago · 5 stars",
      "r5.c": "Graziano 68 · 6 years ago · 5 stars",
      "o.k": "hours and where",
      "o.h": "On Monday we open at 3 pm.",
      "o.p": "Tuesday to Saturday morning and afternoon, 8:30–12:30 and 15–19. On Monday only the afternoon. Closed on Sunday.",
      "o.cap": "Opening hours",
      "g.lun": "Monday",
      "g.pom": "afternoon only",
      "g.mar": "Tuesday",
      "g.mer": "Wednesday",
      "g.gio": "Thursday",
      "g.ven": "Friday",
      "g.sab": "Saturday",
      "g.dom": "Sunday",
      "g.chiuso": "closed",
      "o.nota": "For holidays and for the summer, better to call first.",
      "k.ind": "address",
      "k.tel": "phone",
      "o.strada": "Get directions",
      "o.zoom": "Enlarge the photo of the street",
      "o.alt": "Via Luigi Ornato seen from the street: the building with number 17, the two Mastercolor signs and the tram tracks",
      "o.cap2": "via Luigi Ornato 17, from the street (Google Street View)",
      "o.mappa": "Map: Master Color Niguarda, Via Luigi Ornato 17, Milan",
      "d.k": "questions",
      "d.h": "The questions we get asked.",
      "qa.1": "Are you open on Monday morning?",
      "ra.1": "No: on Monday we open at 15:00 and close at 19:00. Tuesday to Saturday 8:30–12:30 and 15–19. Closed on Sunday.",
      "qa.2": "How much paint do I need?",
      "ra.2": "Bring us the measurements: the square-metre calculation for walls and ceiling is above. How many coats and how many litres we tell you at the counter, because it depends on the product and on the wall.",
      "qa.3": "Which brands do you carry?",
      "ra.3": "On the sign, between the two Mastercolor lettering panels, there is MaxMeyer. For the rest, ask at the counter: it depends on what you have to do.",
      "qa.4": "Do you sell drawing supplies?",
      "ra.4": "Yes: pencils, pastels, tempera, watercolours and easels, in the window and inside.",
      "qa.5": "Do you have brushes, rollers and dust sheets?",
      "ra.5": "Yes, together with the paints: brushes, wide brushes, rollers, dust sheets and tape.",
      "qa.6": "Do you make doormats to measure?",
      "ra.6": "Yes, it says so in the window: bring the measurements of your entrance.",
      "qa.7": "Do you have household cleaning products?",
      "ra.7": "Yes: detergents, sanitisers, products for floors and surfaces, recommended according to what you have to clean.",
      "piede.s": "paint shop · paints, enamels, varnishes, art supplies, household products, made-to-measure doormats · Monday 15–19, Tuesday–Saturday 8:30–12:30 and 15–19",
      "piede.b": "Demo site by <a href=\"https://bespokestud.io\" target=\"_blank\" rel=\"noopener\">Bespoke Studio</a> · texts, hours and services from the shop windows, the business's Google listing and the public Google reviews (September 2026); photographs from the business's Google listing and from Google Street View.",
      "b.chiama": "Call",
      "b.voglie": "What to do",
      "b.orari": "Hours",
      "b.mappa": "Map",
      "lb.chiudi": "Close",
    },
    /* MULTILINGUA (V4) — per i siti con più di due lingue, al posto di EN:
         LANGS: { en: {chiave:'...'}, ar: {chiave:'...'} }
       L'italiano resta SEMPRE la lingua del DOM e non ha dizionario.
       Se si valorizza EN e non LANGS, il comportamento è identico a prima. */
    LANGS: null,
    RTL: ['ar', 'he', 'fa', 'ur'],   // lingue che ribaltano dir=rtl
    /* etichette dello stato orari per lingua non-IT; l'IT è nel codice.
       Chiave mancante = fallback all'inglese, poi all'italiano. */
    HOURS_I18N: null,
  };
  /* normalizzazione: EN storico -> LANGS */
  if (!SITE.LANGS) SITE.LANGS = SITE.EN && Object.keys(SITE.EN).length ? { en: SITE.EN } : {};
  var LANG_CODES = Object.keys(SITE.LANGS);   // senza 'it', che è il DOM
  /* ═════════════════════════════════════════════════════════════════ */

  /* ---------- WhatsApp wiring ---------- */
  if (SITE.whatsapp.number) {
    var waHref = 'https://wa.me/' + SITE.whatsapp.number + '?text=' +
      encodeURIComponent(SITE.whatsapp.message);
    SITE.whatsapp.ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { el.href = waHref; el.target = '_blank'; el.rel = 'noopener'; }
    });
  }

  /* ---------- GSAP: registrazione IMMEDIATA + reveal + watchdog ---------- */
  var hasGsap = typeof gsap !== 'undefined';
  var hasST = hasGsap && typeof ScrollTrigger !== 'undefined';
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  function showAllReveals() {
    var els = document.querySelectorAll(SITE.revealSelector);
    els.forEach(function (el) { el.classList.add(SITE.inViewClass); });
    if (hasGsap) {
      if (hasST) {
        els.forEach(function (el) {
          ScrollTrigger.getAll().forEach(function (st) {
            if (st.trigger === el && !st.progress) st.kill();
          });
        });
      }
      gsap.set(els, { opacity: 1, y: 0, x: 0 });
    }
  }
  // FIX FOUC (18/7): il watchdog è SOLO un fallback se GSAP non c'è (o reduced-motion).
  // Rivelare in anticipo tutti i .reveal mentre gli scroll-trigger sono attivi causava il
  // flash (scompaiono/ricompaiono) sotto la piega. Con GSAP attivo, rivelano gli ScrollTrigger.
  setTimeout(function () { if (!hasGsap || reducedMotion) showAllReveals(); }, 1500);

  if (hasGsap && !reducedMotion) {
    // reveal generico: le animazioni-FIRMA del sito vanno oltre questo,
    // ma si registrano ANCHE LORO subito, mai dopo l'intro.
    // ⚠️ REGOLA ANTI-FLASH (18/7): un elemento .reveal deve avere UNA SOLA animazione che
    // ne porta l'opacità a 1. Se un elemento ha una FIRMA che ne anima l'opacità (stagger,
    // timeline, ecc.), ESCLUDILO da qui via SITE.revealSelector (es. '.reveal:not(.mondo)'),
    // altrimenti il reveal generico + la firma si sovrappongono e l'elemento FLASHA.
    // immediateRender:false → lo stato "from" (opacity:0) NON viene ri-applicato ad ogni
    // ScrollTrigger.refresh() (che scatta al window.load mentre scrolli) → niente flash su refresh.
    gsap.utils.toArray(SITE.revealSelector).forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', immediateRender: false,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });
  } else {
    // fallback senza GSAP: IntersectionObserver + classe
    if ('IntersectionObserver' in window && !reducedMotion) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add(SITE.inViewClass); io.unobserve(e.target); }
        });
      }, { threshold: 0.12 });
      document.querySelectorAll(SITE.revealSelector).forEach(function (el) { io.observe(el); });
    } else {
      showAllReveals();
    }
  }

  /* ---------- intro skippabile (NON gate-a nulla) ---------- */
  var intro = document.getElementById(SITE.introId);
  /* ⚠️ L'hook si legge AL MOMENTO DELLA CHIAMATA, mai catturato per valore
     qui. Il codice-firma vive sotto il marcatore di fine plumbing — cioè
     gira DOPO questa riga — quindi `window.bespokeHeroEntrance ||
     function(){}` congelava la funzione vuota e l'entrata dell'hero non
     partiva più: titolo a opacity 0 per sempre, hero vuota sul live.
     (20/7/2026, riprodotto a schermo su Benessere Futuro #159.) */
  function heroEntrance() {
    if (typeof window.bespokeHeroEntrance === 'function') window.bespokeHeroEntrance();
  }
  function hideIntro() {
    if (!intro) return;
    var el = intro; intro = null;
    el.classList.add('hide');
    setTimeout(function () { el.remove(); }, 700);
    heroEntrance();
  }
  // rimozione IMMEDIATA (niente fade): serve quando qualcosa deve stare sopra
  // l'intro subito, es. l'apertura del menu. Durante il fade l'intro resta
  // hit-testable e i link del drawer non sono cliccabili.
  function killIntroNow() {
    if (!intro) return;
    var el = intro; intro = null;
    el.remove();
    heroEntrance();
  }
  if (reducedMotion || !intro) {
    if (intro) { intro.remove(); intro = null; }
    /* ⚠️ setTimeout 0 NON è decorativo: senza intro questo ramo gira in modo
       SINCRONO, cioè PRIMA che il codice-firma — che sta sotto il marcatore
       di fine plumbing, dentro questa stessa IIFE — abbia assegnato
       `window.bespokeHeroEntrance`. Il risultato è un'entrata dell'hero MUTA:
       nessun errore, elementi visibili, animazione semplicemente mai partita.
       Rimandando di un tick la IIFE è conclusa e l'hook esiste.
       (14/8/2026, A.S.FA. Sicilia: misurato h1 a opacity 1 già al load.)
       Cugino del bug `hero-hook-congelato` del 20/7: lì l'hook era catturato
       troppo presto, qui è CHIAMATO troppo presto. */
    setTimeout(heroEntrance, 0);
  } else {
    setTimeout(hideIntro, SITE.introDuration);
    setTimeout(hideIntro, 6000); // safety net: l'intro non può incastrarsi
    intro.addEventListener('click', hideIntro);
  }

  /* ---------- burger menu (inert + focus + Escape + resize) ---------- */
  var burger = document.getElementById('burger');
  /* 26/7/2026 (Il Papiro #168) — IL PANNELLO SI RISOLVE DA `aria-controls`.
     Il canone apriva sempre `#mainNav`, dando per scontato che la nav
     desktop FOSSE anche il drawer. Molti siti invece hanno un drawer
     separato (`#mobile-menu`) con `hidden`, mentre `#mainNav` su mobile è
     `display:none`: il burger aggiungeva `nav-open` a un elemento nascosto
     e il menu non si apriva. È la stessa decisione già presa il 20/7 per
     qa-motion — «è lì che il markup accessibile dice qual è il pannello» —
     che però non era mai rientrata qui. */
  var nav = (function () {
    var byAria = burger && burger.getAttribute('aria-controls');
    return (byAria && document.getElementById(byAria)) || document.getElementById('mainNav');
  })();
  if (burger && nav) {
    var navUsaHidden = nav.hasAttribute('hidden');
    var lastFocus = null;
    var closeNav = function () {
      nav.classList.remove('nav-open');
      if (navUsaHidden) nav.hidden = true;
      burger.setAttribute('aria-expanded', 'false');
      if (lastFocus) { lastFocus.focus(); lastFocus = null; }
    };
    var openNav = function () {
      // L'intro ha z-index alto ed è figlia del body: se è ancora a schermo
      // copre il drawer (che vive nello stacking context dell'header) e i link
      // risultano non cliccabili. Aprire il menu chiude l'intro.
      // (bug trovato da qa-motion su Linea Uomo, 19/7/2026 → PLUMBING_V 2)
      if (typeof killIntroNow === 'function') killIntroNow();
      lastFocus = document.activeElement;
      if (navUsaHidden) nav.hidden = false;
      nav.classList.add('nav-open');
      burger.setAttribute('aria-expanded', 'true');
      var first = nav.querySelector('a, button');
      if (first) first.focus();
    };
    burger.addEventListener('click', function () {
      nav.classList.contains('nav-open') ? closeNav() : openNav();
    });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('nav-open')) closeNav();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > SITE.breakpointMenu) closeNav();
    });
  }

  /* ---------- lightbox accessibile ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');
  if (lightbox && lightboxImg) {
    var opener = null;
    var openLb = function (src, alt) {
      lightboxImg.src = src; lightboxImg.alt = alt || '';
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      if (lightboxClose) lightboxClose.focus();
    };
    var closeLb = function () {
      lightbox.hidden = true; lightboxImg.src = '';
      document.body.style.overflow = '';
      if (opener) { opener.focus(); opener = null; }
    };
    document.querySelectorAll('[data-full]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        opener = btn;
        var img = btn.querySelector('img');
        openLb(btn.getAttribute('data-full'), img ? img.alt : '');
      });
    });
    if (lightboxClose) lightboxClose.addEventListener('click', closeLb);
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lightbox.hidden) closeLb();
    });
  }

  /* ---------- orari dinamici Europe/Rome (finestre multiple + scavalco) ---------- */
  function romeNow() {
    try {
      var f = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Rome', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
      });
      var p = f.formatToParts(new Date());
      var map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      var get = function (t) { return p.find(function (x) { return x.type === t; }).value; };
      return { day: map[get('weekday')], mins: parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10) };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), mins: d.getHours() * 60 + d.getMinutes() };
    }
  }
  var toMin = function (hm) {
    var a = hm.split(':');
    return parseInt(a[0], 10) * 60 + parseInt(a[1], 10);
  };
  var fmt = function (m) {
    m = m % 1440;
    return ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2);
  };
  var DAYS_IT = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  var DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var HOURS_BASE = {
    it: { open: 'Aperto ora', closesAt: 'chiude alle ', opensToday: 'Chiuso · apre oggi alle ',
          opensOn: 'Chiuso · apre {day} alle ', closed: 'Chiuso', days: DAYS_IT },
    en: { open: 'Open now', closesAt: 'closes at ', opensToday: 'Closed · opens today at ',
          opensOn: 'Closed · opens {day} at ', closed: 'Closed', days: DAYS_EN },
  };
  /* risolve le etichette orari per la lingua richiesta, con fallback en -> it */
  function strings(lang) {
    var custom = (SITE.HOURS_I18N && SITE.HOURS_I18N[lang]) || null;
    var base = HOURS_BASE[lang] || HOURS_BASE.en;
    if (!custom) return base;
    var outp = {};
    Object.keys(HOURS_BASE.it).forEach(function (k) {
      outp[k] = custom[k] !== undefined ? custom[k] : base[k];
    });
    return outp;
  }

  function hoursState() {
    var now = romeNow();
    // finestra del giorno corrente
    var wins = SITE.hours[now.day] || [];
    for (var i = 0; i < wins.length; i++) {
      var s = toMin(wins[i][0]), e = toMin(wins[i][1]);
      if (now.mins >= s && now.mins < Math.min(e, 1440)) {
        return { open: true, day: now.day, closesAt: fmt(e) };
      }
    }
    // coda dopo mezzanotte della sera PRIMA
    var prev = (now.day + 6) % 7;
    var pw = SITE.hours[prev] || [];
    for (var j = 0; j < pw.length; j++) {
      var pe = toMin(pw[j][1]);
      if (pe > 1440 && now.mins < pe - 1440) {
        return { open: true, day: prev, closesAt: fmt(pe) };
      }
    }
    // chiuso: prossima apertura (oggi o nei prossimi 7 giorni)
    for (var k = 0; k < wins.length; k++) {
      if (now.mins < toMin(wins[k][0])) {
        return { open: false, day: now.day, opensToday: fmt(toMin(wins[k][0])) };
      }
    }
    for (var d = 1; d <= 7; d++) {
      var nd = (now.day + d) % 7;
      var nw = SITE.hours[nd] || [];
      if (nw.length) return { open: false, day: now.day, opensDay: nd, opensAt: fmt(toMin(nw[0][0])) };
    }
    return { open: false, day: now.day };
  }

  function renderHours() {
    var el = document.getElementById(SITE.hoursStatusId);
    var st = hoursState();
    document.querySelectorAll(SITE.hoursTableSelector).forEach(function (row) {
      row.classList.toggle(SITE.todayClass,
        parseInt(row.getAttribute('data-day'), 10) === st.day);
    });
    if (!el) return;
    /* V4: le etichette si risolvono per lingua corrente, non con un booleano
       en/it. Fallback a catena lingua -> en -> it, così un sito con AR o FR
       che non traduce lo stato orari resta comunque leggibile. */
    var L = strings(root.lang);
    var txt;
    if (st.open) {
      txt = L.open + ' · ' + L.closesAt + st.closesAt;
    } else if (st.opensToday) {
      txt = L.opensToday + st.opensToday;
    } else if (st.opensAt !== undefined) {
      txt = L.opensOn.replace('{day}', L.days[st.opensDay]) + st.opensAt;
    } else {
      txt = L.closed;
    }
    el.textContent = txt;
  }
  renderHours();
  setInterval(renderHours, 60000);

  /* ---------- i18n overlay (EN sopra l'IT del DOM) ---------- */
  var originals = {}; // attr -> key -> testo IT
  var I18N_ATTRS = [
    ['data-i18n', null],
    ['data-i18n-aria', 'aria-label'],
    ['data-i18n-alt', 'alt'],
    ['data-i18n-placeholder', 'placeholder'],
    ['data-i18n-title', 'title'],
  ];
  function setLang(lang) {
    /* V4: qualunque lingua dichiarata in SITE.LANGS, non più solo 'en'.
       'it' resta la lingua del DOM: nessun dizionario, nessuna sostituzione.
       Una lingua sconosciuta ricade su 'it' invece di rompere la pagina. */
    root.lang = (lang === 'it' || LANG_CODES.indexOf(lang) !== -1) ? lang : 'it';
    root.dir = SITE.RTL.indexOf(root.lang) !== -1 ? 'rtl' : 'ltr';
    var dict = SITE.LANGS[root.lang] || null;
    I18N_ATTRS.forEach(function (pair) {
      var dattr = pair[0], target = pair[1];
      if (!originals[dattr]) originals[dattr] = {};
      document.querySelectorAll('[' + dattr + ']').forEach(function (el) {
        var key = el.getAttribute(dattr);
        var store = originals[dattr];
        /* innerHTML, NON textContent: gli elementi tradotti contengono
           quasi sempre markup (<strong>, <br>) e con textContent il primo
           passaggio a EN lo appiattisce — tornando in italiano il grassetto
           non torna più. I valori del dizionario sono statici e scritti da
           noi. (20/7/2026: la flotta era già così, il boilerplate no.) */
        if (!(key in store)) store[key] = target ? el.getAttribute(target) : el.innerHTML;
        var val = dict && dict[key] !== undefined ? dict[key] : store[key];
        if (target) el.setAttribute(target, val); else el.innerHTML = val;
      });
    });
    renderHours();
    /* stato visivo della coppia di bottoni lingua, se il sito la usa */
    document.querySelectorAll('[data-lang]').forEach(function (b) {
      var on = b.getAttribute('data-lang') === root.lang;
      b.classList.toggle('is-on', on);
      if (b.tagName === 'BUTTON') b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    try { localStorage.setItem(SITE.slug + '-lang', lang); } catch (e) {}
  }
  /* 26/7/2026 (Il Papiro #168) — SI CABLANO ENTRAMBE LE FORME DI SELETTORE.
     Il canone conosceva solo il toggle singolo `#langToggle`, ma nella
     flotta esiste da tempo anche la COPPIA di bottoni `[data-lang]`
     (Warsa, Mido…): `i18n-roundtrip` era già stato insegnato a riconoscerle
     il 20/7, il plumbing no. Chi copiava il boilerplate e usava la coppia
     si ritrovava il cambio lingua MORTO, e nessun lint statico se ne
     accorgeva (lo becca solo qa-motion, a runtime). */
  var langToggle = document.getElementById('langToggle');
  if (langToggle) {
    /* V4: il toggle singolo CICLA sull'anello ['it', ...LANG_CODES].
       Con due lingue il comportamento è identico a prima (it <-> en). */
    var RING = ['it'].concat(LANG_CODES);
    langToggle.addEventListener('click', function () {
      var i = RING.indexOf(root.lang);
      setLang(RING[(i + 1) % RING.length]);
    });
  }
  document.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });
  try {
    var saved = localStorage.getItem(SITE.slug + '-lang');
    if (saved && saved !== 'it' && LANG_CODES.indexOf(saved) !== -1) setLang(saved);
  } catch (e) {}

  /* ---------- action-bar mobile (opzionale: #actionBar) ---------- */
  var actionBar = document.getElementById('actionBar');
  if (actionBar) {
    var onScroll = function () {
      actionBar.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ══════════ FINE PLUMBING — da qui in giù SOLO il codice-firma
     del sito (animazioni e interazioni uniche del cliente), che si
     registra comunque SUBITO, mai dentro setTimeout/intro. ══════════ */
  /* ═══ FIRMA · Master Color Niguarda — «Voglia di colore.»: le lettere in vetrina ═══
     Sulle vetrine la scritta è fatta di lettere adesive, una per colore. Ogni [data-vetrina] è un titolo fatto di
     lettere (.lt): nell'intro e nell'hero le lettere sono già nel markup (coi colori c1…c6), nei titoli di sezione
     il JS le ricava dal testo (colore della sezione via --c). Stato finale nel CSS = lettere visibili e ferme:
     senza JS e in reduced-motion è tutto già applicato. Con GSAP: le lettere partono invisibili, un po' ruotate e
     più grandi (data-stato=da-applicare) e si «premono» sul vetro una alla volta (applicata). L'intro parte subito,
     l'hero dopo l'intro (bespokeHeroEntrance), i titoli di sezione quando entrano in vista. */
  var vetrineVive = hasGsap && hasST && !reducedMotion;
  var spezza = function (el) {
    if (el.querySelector('.lt')) return;
    var parole = el.textContent.replace(/\s+/g, ' ').trim().split(' ');
    el.textContent = '';
    parole.forEach(function (parola, w) {
      if (w > 0) el.appendChild(document.createTextNode(' '));
      var pw = document.createElement('span');
      pw.className = 'parola';           // le lettere non si spezzano a metà parola
      for (var i = 0; i < parola.length; i++) {
        var sp = document.createElement('span');
        sp.className = 'lt';
        sp.textContent = parola[i];
        pw.appendChild(sp);
      }
      el.appendChild(pw);
    });
  };
  var applica = function (el, subito) {
    var lettere = el.querySelectorAll('.lt');
    if (!lettere.length) { el.setAttribute('data-stato', 'applicata'); return; }
    if (subito || !hasGsap) { if (hasGsap) gsap.set(lettere, { clearProps: 'opacity,transform' }); el.setAttribute('data-stato', 'applicata'); return; }
    if (el.getAttribute('data-stato') !== 'da-applicare') return;
    el.setAttribute('data-stato', 'in-posa');
    gsap.to(lettere, { opacity: 1, y: 0, rotate: 0, scale: 1, duration: .42, stagger: .055, ease: 'back.out(2.2)',
      onComplete: function () { gsap.set(lettere, { clearProps: 'opacity,transform' }); el.setAttribute('data-stato', 'applicata'); } });
  };
  var stacca = function (el) {
    var lettere = el.querySelectorAll('.lt');
    if (!lettere.length) return;
    gsap.set(lettere, { opacity: 0, y: -10, rotate: -7, scale: 1.18, transformOrigin: '50% 80%' });
    el.setAttribute('data-stato', 'da-applicare');
  };
  var vetrine = Array.prototype.slice.call(document.querySelectorAll('[data-vetrina]'));
  if (vetrineVive) {
    vetrine.forEach(function (v) { if (!v.hasAttribute('data-vetrina-manuale')) spezza(v); });
    vetrine.forEach(stacca);
    var introV = document.getElementById('introVetrina');
    if (introV) {
      setTimeout(function () { applica(introV); }, 200);
      setTimeout(function () { var f = document.getElementById('introFine'); if (f) f.classList.add('is-on'); }, 1500);
    }
    vetrine.filter(function (v) { return !v.hasAttribute('data-vetrina-manuale'); }).forEach(function (v) {
      ScrollTrigger.create({ trigger: v, start: 'top 85%', once: true, onEnter: function () { applica(v); } });
    });
    // rete di sicurezza: dopo 7 s ciò che è in vista e ancora da applicare si applica
    setTimeout(function () {
      vetrine.forEach(function (v) {
        if (v.getAttribute('data-stato') !== 'da-applicare') return;
        var r = v.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) applica(v, true);
      });
    }, 7000);
  } else {
    var f0 = document.getElementById('introFine'); if (f0) f0.classList.add('is-on');
  }

  window.bespokeHeroEntrance = function () {
    var hero = document.getElementById('heroVetrina');
    if (!vetrineVive) { if (hero) applica(hero, true); return; }
    if (hero) applica(hero);
    var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from(['.apertura__gloss', '.apertura__p', '.apertura__stato', '.apertura__azioni', '.apertura__badge'], { opacity: 0, y: 16, duration: .6, stagger: .08 }, 0.7)
      .from('.apertura__foto', { opacity: 0, y: 24, duration: .8 }, '-=.6');
  };

  /* ═══ IL CALCOLO DEI METRI QUADRI — pareti e soffitto, niente litri ═══ */
  var calc = document.getElementById('calc');
  if (calc) {
    var num = function (id) { var v = parseFloat((document.getElementById(id) || {}).value); return isFinite(v) && v >= 0 ? v : 0; };
    var fmt = function (n) { return n.toFixed(1).replace('.', ','); };
    var conta = function () {
      var L = num('cL'), W = num('cW'), H = num('cH'), P = num('cP'), Fi = num('cF');
      var pareti = Math.max(0, 2 * (L + W) * H - P * 1.7 - Fi * 1.5);
      var soffitto = L * W;
      var a = document.getElementById('cOutPareti'), b = document.getElementById('cOutSoffitto');
      if (a) a.textContent = fmt(pareti);
      if (b) b.textContent = fmt(soffitto);
    };
    calc.addEventListener('input', conta);
    calc.addEventListener('submit', function (e) { e.preventDefault(); conta(); });
    conta();
  }

})();
