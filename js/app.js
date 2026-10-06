/* Leerlingenpagina */
(function () {
  'use strict';
  var C = window.OEFENSITE_CONFIG, O = window.Opslag, V = window.Vragen, fmt = V.fmt, esc = V.esc;
  var hoofd = document.getElementById('hoofd'), wie = document.getElementById('wie'), kopknoppen = document.getElementById('kopknoppen');
  var S = { user: null, leerling: null, inst: {}, res: {} };
  var ICOON = { j1: '✓', j: '✓', f: '✗', o: '◉' };
  var uitlegOpen = true;
  try { uitlegOpen = !localStorage.getItem('oefensite_uitleg_' + O.prefix); } catch (e) { uitlegOpen = true; }
  var STATUSNAAM = { j1: 'juist', j: 'juist', f: 'nog niet juist', o: 'oplossing bekeken', '': 'nog niet gemaakt' };

  function actief(m) { var a = (S.inst.actief || {})[m.id]; return a == null ? m.standaardActief !== false : !!a; }
  function sleutel(d, v) { return d.id + '_' + v.id; }
  function status(m, d, v) { var r = (S.res[m.id] || {})[sleutel(d, v)]; return r ? (r.s || '') : ''; }
  function tel(m, deel) {
    var tot = 0, gemaakt = 0, juist = 0;
    (deel ? [deel] : m.delen).forEach(function (d) {
      d.vragen.forEach(function (v) { tot++; var s = status(m, d, v); if (s) gemaakt++; if (s === 'j1' || s === 'j') juist++; });
    });
    return { tot: tot, gemaakt: gemaakt, juist: juist };
  }
  async function laadRes(m) { if (!S.res[m.id]) { try { S.res[m.id] = await O.leesResultaten(m.id); } catch (e) { S.res[m.id] = {}; } } }

  function tekenKop() {
    if (!S.user) { wie.innerHTML = ''; kopknoppen.innerHTML = ''; return; }
    var g = S.leerling && S.leerling.groep;
    wie.innerHTML = '<strong>' + esc(S.user.naam) + '</strong>' + (g ? '<span class="groep">' + esc(g) + '</span> <a href="#/groep" class="accent" style="font-weight:500">wijzig</a>' : '');
    kopknoppen.innerHTML = '<button type="button" class="knop klein" id="afmelden">Afmelden</button>';
    document.getElementById('afmelden').addEventListener('click', function () { O.afmelden(); });
  }

  /* ---------- aanmelden ---------- */
  function toonLogin() {
    tekenKop();
    hoofd.innerHTML = '<div class="login"><div class="kaart-blok"><div class="blok-in">' +
      '<img src="img/logo.jpg" alt=""><h1>' + esc(C.titel) + '</h1>' +
      '<p>Meld je aan met je schoolaccount om te oefenen.</p>' +
      '<p style="margin-top:18px"><button type="button" class="knop vol" id="aanmelden">Aanmelden met je ' + esc(C.domein) + '-account</button></p>' +
      (O.fout ? '<p class="melding">' + esc(O.fout) + '</p>' : '') +
      '</div></div><p style="margin-top:14px;font-size:.9rem"><a class="accent" href="leerkracht.html">Voor leerkrachten</a></p></div>';
    document.getElementById('aanmelden').addEventListener('click', function () { O.aanmelden(); });
  }

  function toonGroep() {
    tekenKop();
    var huidig = S.leerling && S.leerling.groep;
    hoofd.innerHTML = '<div class="login" style="max-width:620px"><div class="kaart-blok"><div class="balk">Kies je niveaugroep</div><div class="blok-in">' +
      '<p>In welke niveaugroep zit je voor wiskunde? Twijfel je, vraag het dan aan je leerkracht.</p>' +
      '<div class="groepen">' + C.groepen.map(function (g) { return '<button type="button" class="groepknop' + (g === huidig ? ' gekozen' : '') + '" data-g="' + esc(g) + '">' + esc(g) + '</button>'; }).join('') + '</div>' +
      '<p id="groepfout"></p></div></div></div>';
    hoofd.querySelectorAll('.groepknop').forEach(function (b) {
      b.addEventListener('click', async function () {
        try {
          await O.bewaarLeerling({ groep: b.dataset.g });
          S.leerling = Object.assign(S.leerling || {}, { groep: b.dataset.g });
          location.hash = '#/'; route();
        } catch (e) { document.getElementById('groepfout').innerHTML = '<span class="melding" style="display:block">Bewaren is niet gelukt. Controleer je internetverbinding en probeer opnieuw.</span>'; }
      });
    });
  }

  var UITLEG = '<details class="kaart-blok" id="zowerkthet"><summary class="balk" style="cursor:pointer">Zo werkt het</summary><div class="blok-in"><ul class="vinklijst">' +
    '<li>Je <span class="accent">kiest zelf</span> welke vragen je maakt en in welke volgorde. Je mag een vraag overslaan en er later naar terugkeren.</li>' +
    '<li>Klik op <span class="accent">Controleer</span> om je antwoord na te kijken. Je krijgt meteen feedback en je mag opnieuw proberen.</li>' +
    '<li>Weet je het niet? Klik op <span class="accent">Hulp</span> voor een stukje theorie. Lukt het daarna nog niet, klik dan op <span class="accent">Toon oplossing</span>.</li>' +
    '<li>Je resultaat wordt <span class="accent">automatisch bewaard</span> telkens je op Controleer klikt. Je leerkracht ziet welke vragen je maakte.</li>' +
    '<li>Kommagetallen typ je met een komma. Bij een breuk typ je de teller boven de breukstreep en de noemer eronder.</li>' +
    '</ul></div></details>';

  /* ---------- modules ---------- */
  async function toonModules() {
    tekenKop();
    var lijst = window.MODULES.filter(actief);
    hoofd.innerHTML = '<p>Even laden…</p>';
    await Promise.all(lijst.map(laadRes));
    var html = '<h1 class="paginatitel">Kies een module</h1><p class="onder">Dag ' + esc(S.user.naam.split(' ')[0]) + ', waar wil je vandaag op oefenen?</p>' + UITLEG;
    if (!lijst.length) html += '<div class="kaart-blok"><div class="blok-in">Er staan nog geen modules open. Vraag het aan je leerkracht.</div></div>';
    html += '<div class="modules">' + lijst.map(function (m) {
      var t = tel(m), pct = t.tot ? Math.round(t.gemaakt / t.tot * 100) : 0;
      return '<a class="modulekaart" href="#/m/' + m.id + '"><div class="kaart-blok"><div class="balk">Module ' + m.nummer + '</div><div class="blok-in">' +
        '<p class="domein">' + esc(m.domein || '') + '</p><h2>' + esc(m.titel) + '</h2>' +
        '<div class="voortgang" aria-hidden="true"><span style="width:' + pct + '%"></span></div>' +
        '<p class="voortgangtekst">' + t.gemaakt + ' van ' + t.tot + ' vragen gemaakt, ' + t.juist + ' juist</p></div></div></a>';
    }).join('') + '</div>';
    hoofd.innerHTML = html;
    var d = document.getElementById('zowerkthet');
    d.open = uitlegOpen;
    d.addEventListener('toggle', function () {
      uitlegOpen = d.open;
      if (!d.open) { try { localStorage.setItem('oefensite_uitleg_' + O.prefix, '1'); } catch (e) { /* ok */ } }
    });
  }

  async function toonModule(m) {
    tekenKop(); await laadRes(m);
    var t = tel(m);
    var html = '<p class="kruimel"><a href="#/">← Alle modules</a></p><h1 class="paginatitel">Module ' + m.nummer + ': ' + esc(m.titel) + '</h1>' +
      '<p class="onder">Je maakte ' + t.gemaakt + ' van de ' + t.tot + ' vragen. Nog ' + (t.tot - t.gemaakt) + ' te gaan. Kies zelf een vraag.</p>';
    m.delen.forEach(function (d) {
      var td = tel(m, d);
      html += '<section class="kaart-blok"><div class="balk">' + esc(d.nr + '  ' + d.titel) + '<span class="rechts">' + td.gemaakt + ' van ' + td.tot + ' gemaakt</span></div><div class="blok-in"><div class="tegels">' +
        d.vragen.map(function (v, i) {
          var s = status(m, d, v);
          return '<a class="tegel" href="#/m/' + m.id + '/' + d.id + '/' + v.id + '" title="' + STATUSNAAM[s] + '"><span class="nr">' + (i + 1) + '</span><span class="naam">' + esc(v.titel || 'Vraag ' + (i + 1)) + '</span><span class="st ' + s + '" aria-label="' + STATUSNAAM[s] + '">' + (ICOON[s] || '') + '</span></a>';
        }).join('') + '</div></div></section>';
    });
    html += '<div class="legende"><span><span class="st"></span>nog niet gemaakt</span><span><span class="st j">✓</span>juist</span><span><span class="st f">✗</span>nog niet juist</span><span><span class="st o">◉</span>oplossing bekeken</span></div>';
    hoofd.innerHTML = html;
  }

  /* ---------- hulp ---------- */
  var dlg = document.getElementById('hulp');
  document.getElementById('hulpsluit').addEventListener('click', function () { dlg.close(); });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  function toonHulp(m, d, v) {
    var keys = [].concat(v.hulp || d.hulp || []), html = '';
    keys.forEach(function (k) { var t = (m.theorie || {})[k]; if (t) html += '<h3>' + fmt(t.titel) + '</h3>' + fmt(t.html); });
    document.getElementById('hulpinhoud').innerHTML = html || '<p>Voor deze vraag is er geen extra uitleg. Vraag hulp aan je leerkracht.</p>';
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
    document.getElementById('hulpinhoud').scrollTop = 0;
  }

  /* ---------- vraag ---------- */
  async function toonVraag(m, did, vid) {
    tekenKop(); await laadRes(m);
    var d = m.delen.find(function (x) { return x.id === did; });
    var vi = d ? d.vragen.findIndex(function (x) { return x.id === vid; }) : -1;
    if (vi < 0) return toonModule(m);
    var v = d.vragen[vi], key = sleutel(d, v);
    var plat = []; m.delen.forEach(function (dd) { dd.vragen.forEach(function (vv) { plat.push({ d: dd, v: vv }); }); });
    var pi = plat.findIndex(function (x) { return x.v === v; });
    function link(x) { return '#/m/' + m.id + '/' + x.d.id + '/' + x.v.id; }

    hoofd.innerHTML = '<p class="kruimel"><a href="#/">Alle modules</a> › <a href="#/m/' + m.id + '">Module ' + m.nummer + ': ' + esc(m.titel) + '</a></p>' +
      '<section class="kaart-blok vraagblok" id="vraagblok"><div class="balk">' + esc(d.nr + '  ' + d.titel) + '<span class="rechts">Vraag ' + (vi + 1) + ' van ' + d.vragen.length + '</span></div>' +
      '<nav class="stippen" aria-label="Vragen van dit onderdeel"><span class="lbl">Vragen:</span>' + d.vragen.map(function (vv, i) {
        var s = status(m, d, vv);
        return '<a class="stip ' + s + (i === vi ? ' nu' : '') + '" href="#/m/' + m.id + '/' + d.id + '/' + vv.id + '" title="Vraag ' + (i + 1) + ': ' + STATUSNAAM[s] + '"' + (i === vi ? ' aria-current="true"' : '') + '>' + (i + 1) + '</a>';
      }).join('') + '</nav>' +
      '<div class="blok-in"><div class="opgave">' + fmt(v.vraag) + '</div><div id="fig"></div><div id="antw"></div><div id="fb" aria-live="polite"></div></div>' +
      '<div class="acties"><button type="button" class="knop oranje" id="bHulp">? Hulp</button><button type="button" class="knop vol" id="bCheck">Controleer</button>' +
      '<button type="button" class="knop" id="bOpl" disabled title="Probeer eerst zelf">Toon oplossing</button><button type="button" class="knop stil" id="bNieuw">Opnieuw beginnen</button>' +
      '<span class="bewaard" id="bewaard"></span><span class="ruimte"></span>' +
      (pi > 0 ? '<a class="knop stil" href="' + link(plat[pi - 1]) + '">← Vorige</a>' : '') +
      '<a class="knop stil" href="#/m/' + m.id + '">Overzicht</a>' +
      (pi < plat.length - 1 ? '<a class="knop" href="' + link(plat[pi + 1]) + '">Volgende →</a>' : '') + '</div></section>';

    V.toonFiguur(document.getElementById('fig'), v.figuur);
    var maak = V.VT[v.type], ctl;
    if (!maak) { document.getElementById('antw').textContent = 'Onbekend vraagtype: ' + v.type; return; }
    ctl = maak(document.getElementById('antw'), v);
    if (O.demo) window.__vraag = { ctl: ctl, v: v };   // alleen in demomodus, handig bij het testen
    var blok = document.getElementById('vraagblok');
    if (blok.getBoundingClientRect().bottom > window.innerHeight) blok.scrollIntoView({ block: 'start' });

    var fb = document.getElementById('fb'), bOpl = document.getElementById('bOpl'), bew = document.getElementById('bewaard'), oplGetoond = false;
    function toonFb(soort, kop, tekst, extra) {
      fb.innerHTML = '<div class="feedback ' + soort + '"><strong>' + kop + '</strong>' + (tekst ? '<p>' + fmt(tekst) + '</p>' : '') + (extra ? '<p>' + extra + '</p>' : '') + '</div>';
    }
    async function bewaar(rec) {
      S.res[m.id][key] = rec;
      var stip = hoofd.querySelector('.stip.nu'); if (stip) stip.className = 'stip nu ' + rec.s;
      bew.textContent = 'Bewaren…';
      try { await O.bewaarVraag(m.id, key, rec); bew.textContent = '✓ Bewaard'; }
      catch (e) { bew.textContent = 'Niet bewaard: controleer je internetverbinding.'; }
    }
    document.getElementById('bHulp').addEventListener('click', function () { toonHulp(m, d, v); });
    document.getElementById('bNieuw').addEventListener('click', function () { toonVraag(m, did, vid); });
    document.getElementById('bCheck').addEventListener('click', function () {
      var r = ctl.controleer();
      if (r.leeg) { toonFb('', 'Vul eerst een antwoord in.', 'Je hebt nog niets ingevuld of getekend. Weet je niet hoe je moet beginnen? Klik op Hulp.'); return; }
      var goed = r.juist === r.totaal;
      bOpl.disabled = false; bOpl.removeAttribute('title');
      if (goed) toonFb('juist', '✓ Juist!', v.uitleg, oplGetoond ? 'Dit telt niet mee als juist, want je bekeek eerst de oplossing. Klik op Opnieuw beginnen om het zelf te proberen.' : (r.opmerking || ''));
      else toonFb('fout', '✗ ' + (r.totaal > 1 ? r.juist + ' van de ' + r.totaal + ' onderdelen zijn juist.' : 'Dat is nog niet juist.'), ((r.nota || '') + ' ' + (v.tip || '')).trim(),
        'Verbeter je antwoord en klik opnieuw op Controleer. Je kunt ook de Hulp of de oplossing bekijken.');
      if (oplGetoond) return;
      var oud = S.res[m.id][key] || { p: 0, s: '' }, al = oud.s === 'j1' || oud.s === 'j';
      var rec = { p: (oud.p || 0) + 1, s: oud.s || '', b: Math.max(oud.b || 0, Math.round(r.juist / r.totaal * 100) / 100), t: Date.now() };
      if (goed && !al) rec.s = oud.p ? 'j' : 'j1'; else if (!goed && !oud.s) rec.s = 'f';
      bewaar(rec);
    });
    bOpl.addEventListener('click', function () {
      ctl.oplossing(); oplGetoond = true;
      toonFb('opl', 'Oplossing', v.uitleg, 'Bekijk de oplossing goed. Klik daarna op Opnieuw beginnen om de vraag zelf nog eens te maken.');
      var oud = S.res[m.id][key] || { p: 0, s: '' };
      if (oud.s !== 'j1' && oud.s !== 'j' && oud.s !== 'o') bewaar({ p: oud.p || 0, s: 'o', b: oud.b || 0, t: Date.now() });
    });
  }

  /* ---------- route ---------- */
  function route() {
    if (dlg.open) dlg.close();
    if (!S.user) return toonLogin();
    var h = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
    if (!S.leerling || !S.leerling.groep || h[0] === 'groep') return toonGroep();
    window.scrollTo(0, 0);
    if (h[0] === 'm' && h[1]) {
      var m = window.MODULES.find(function (x) { return x.id === h[1]; });
      if (m && actief(m)) return h[2] && h[3] ? toonVraag(m, h[2], h[3]) : toonModule(m);
    }
    return toonModules();
  }

  (async function start() {
    if (O.demo) document.getElementById('demo').hidden = false;
    try {
      await window.laadModules();
      O.onAuth(async function (u) {
        S.user = u; S.res = {};
        if (!u) { S.leerling = null; return route(); }
        try { S.leerling = await O.leesLeerling(); S.inst = await O.leesInstellingen(); if (S.leerling && S.leerling.groep) O.bewaarLeerling({}).catch(function () { }); }
        catch (e) { S.leerling = S.leerling || null; }
        route();
      });
      await O.init();
    } catch (e) {
      hoofd.innerHTML = '<div class="kaart-blok"><div class="blok-in"><p class="melding">De site kon niet starten: ' + esc(e.message || e) + '</p></div></div>';
    }
    window.addEventListener('hashchange', route);
  })();
})();
