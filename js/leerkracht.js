/* Leerkrachtenpagina */
(function () {
  'use strict';
  var C = window.OEFENSITE_CONFIG, O = window.Opslag, esc = window.Vragen.esc;
  var hoofd = document.getElementById('hoofd'), wie = document.getElementById('wie'), kopknoppen = document.getElementById('kopknoppen');
  var S = { user: null, tab: 'res', mod: '', groep: '', weergave: 'delen', deel: '', leerlingen: null, inst: {}, res: {}, rijen: [] };

  function actief(m) { var a = (S.inst.actief || {})[m.id]; return a == null ? m.standaardActief !== false : !!a; }
  function mod() { return window.MODULES.find(function (m) { return m.id === S.mod; }) || window.MODULES[0]; }
  function datum(x) { var d = O.tijd(x); return d ? d.toLocaleString('nl-BE', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : ''; }

  /* voorbeeldleerlingen voor de demomodus */
  function demoData(m) {
    var namen = ['Amira Benali', 'Jules De Smet', 'Fien Vermeulen', 'Mats Claeys', 'Lore Peeters', 'Younes El Idrissi', 'Nina Maes'];
    var zaad = 7;
    function rnd() { zaad = (zaad * 9301 + 49297) % 233280; return zaad / 233280; }
    return namen.map(function (naam, i) {
      var vragen = {}, ijver = 0.25 + rnd() * 0.7, niveau = 0.4 + rnd() * 0.55;
      m.delen.forEach(function (d) {
        d.vragen.forEach(function (v) {
          if (rnd() > ijver) return; var x = rnd(), s = x < niveau * 0.75 ? 'j1' : x < niveau ? 'j' : x < niveau + 0.12 ? 'o' : 'f';
          vragen[d.id + '_' + v.id] = { s: s, p: s === 'j1' ? 1 : 2 + Math.floor(rnd() * 2), t: Date.now() - Math.floor(rnd() * 6e8) };
        });
      });
      return { uid: 'vb' + i, naam: naam, email: naam.toLowerCase().replace(/ /g, '.') + '@' + C.domein, groep: C.groepen[i % C.groepen.length], vragen: vragen, bijgewerkt: Date.now() - Math.floor(rnd() * 6e8) };
    });
  }

  function tekenKop() {
    if (!S.user) { wie.innerHTML = ''; kopknoppen.innerHTML = ''; return; }
    wie.innerHTML = '<strong>' + esc(S.user.naam) + '</strong>leerkracht';
    kopknoppen.innerHTML = '<button type="button" class="knop klein" id="afmelden">Afmelden</button>';
    document.getElementById('afmelden').addEventListener('click', function () { O.afmelden(); });
  }

  function toonLogin() {
    tekenKop();
    hoofd.innerHTML = '<div class="login"><div class="kaart-blok"><div class="balk">Voor leerkrachten</div><div class="blok-in">' +
      '<p>Meld je aan om de resultaten van je leerlingen te bekijken en modules open te zetten.</p>' +
      '<p style="margin-top:18px"><button type="button" class="knop vol" id="aanmelden">Aanmelden met je ' + esc(C.domein) + '-account</button></p>' +
      (O.fout ? '<p class="melding">' + esc(O.fout) + '</p>' : '') + '</div></div><p style="margin-top:14px;font-size:.9rem"><a class="accent" href="index.html">Naar de leerlingenpagina</a></p></div>';
    document.getElementById('aanmelden').addEventListener('click', function () { O.aanmelden(); });
  }
  function toonGeenToegang() {
    tekenKop();
    hoofd.innerHTML = '<div class="login"><div class="kaart-blok"><div class="balk">Geen toegang</div><div class="blok-in"><p>Het account <strong>' + esc(S.user.email) + '</strong> staat niet op de lijst van leerkrachten.</p>' +
      '<p style="margin-top:8px">Vraag een collega die al toegang heeft om je e-mailadres toe te voegen op het tabblad Leerkrachten.</p><p style="margin-top:16px"><a class="knop" href="index.html">Naar de leerlingenpagina</a></p></div></div></div>';
  }

  /* ---------- gegevens ---------- */
  async function laadRijen() {
    var m = mod();
    if (!S.leerlingen) S.leerlingen = await O.alleLeerlingen();
    if (!S.res[m.id]) S.res[m.id] = await O.resultatenVanModule(m.id);
    var per = {};
    S.leerlingen.forEach(function (l) { per[l.uid] = { uid: l.uid, naam: l.naam || l.email || '(onbekend)', email: l.email || '', groep: l.groep || '', vragen: {}, laatst: l.laatstActief }; });
    S.res[m.id].forEach(function (r) {
      var p = per[r.uid] || (per[r.uid] = { uid: r.uid, naam: r.naam || r.email || '(onbekend)', email: r.email || '', groep: '', vragen: {} });
      p.vragen = r.vragen || {}; if (r.bijgewerkt) p.laatst = r.bijgewerkt;
    });
    var rijen = Object.keys(per).map(function (k) { return per[k]; });
    if (O.demo) rijen = rijen.concat(demoData(m).map(function (d) { return { uid: d.uid, naam: d.naam, email: d.email, groep: d.groep, vragen: d.vragen, laatst: d.bijgewerkt }; }));
    rijen.sort(function (a, b) { return (a.groep || 'zz').localeCompare(b.groep || 'zz') || a.naam.localeCompare(b.naam); });
    S.rijen = rijen;
  }
  function telDeel(rij, d) {
    var g = 0, j = 0, j1 = 0;
    d.vragen.forEach(function (v) { var x = rij.vragen[d.id + '_' + v.id]; if (x && x.s) { g++; if (x.s === 'j1') { j++; j1++; } else if (x.s === 'j') j++; } });
    return { g: g, j: j, j1: j1, tot: d.vragen.length };
  }

  /* ---------- tabblad resultaten ---------- */
  function celVraag(x) {
    if (!x || !x.s) return '<span class="cel n" title="nog niet gemaakt">·</span>';
    if (x.s === 'j1') return '<span class="cel j1" title="juist bij de eerste poging">✓</span>';
    if (x.s === 'j') return '<span class="cel j" title="juist na ' + x.p + ' pogingen">✓' + x.p + '</span>';
    if (x.s === 'o') return '<span class="cel o" title="oplossing bekeken">◉</span>';
    return '<span class="cel f" title="nog niet juist na ' + x.p + (x.p === 1 ? ' poging' : ' pogingen') + '">✗' + x.p + '</span>';
  }

  function tabelDelen(m, rijen) {
    var totV = 0; m.delen.forEach(function (d) { totV += d.vragen.length; });
    var h = '<table class="res"><thead><tr><th class="l">Leerling</th><th>Groep</th>' + m.delen.map(function (d) { return '<th title="' + esc(d.titel) + '">' + esc(d.nr) + '. ' + esc(d.titel) + '<span class="mini">' + d.vragen.length + ' vragen</span></th>'; }).join('') + '<th>Totaal<span class="mini">' + totV + ' vragen</span></th><th>Laatst actief</th></tr></thead><tbody>';
    var som = m.delen.map(function () { return { g: 0, j: 0 }; });
    rijen.forEach(function (r) {
      var tg = 0, tj = 0;
      h += '<tr><td class="l naam" title="' + esc(r.email) + '">' + esc(r.naam) + '</td><td>' + esc(r.groep || '?') + '</td>';
      m.delen.forEach(function (d, i) {
        var t = telDeel(r, d); tg += t.g; tj += t.j; som[i].g += t.g; som[i].j += t.j;
        h += '<td>' + t.g + ' / ' + t.tot + '<span class="mini">' + t.j + ' juist</span><span class="staaf"><span style="width:' + Math.round(t.g / t.tot * 100) + '%"></span></span></td>';
      });
      h += '<td><strong>' + tg + ' / ' + totV + '</strong><span class="mini">' + tj + ' juist</span></td><td>' + (datum(r.laatst) || '') + '</td></tr>';
    });
    if (rijen.length) {
      h += '<tr class="som"><td class="l naam">Gemiddeld gemaakt</td><td></td>' + m.delen.map(function (d, i) { return '<td>' + Math.round(som[i].g / (rijen.length * d.vragen.length) * 100) + ' %<span class="mini">' + (som[i].g ? Math.round(som[i].j / som[i].g * 100) : 0) + ' % daarvan juist</span></td>'; }).join('') + '<td></td><td></td></tr>';
    }
    return h + '</tbody></table>';
  }

  function tabelVragen(m, d, rijen) {
    var h = '<table class="res"><thead><tr><th class="l">Leerling</th><th>Groep</th>' + d.vragen.map(function (v, i) { return '<th title="' + esc(v.titel || '') + '">' + (i + 1) + '</th>'; }).join('') + '<th>Gemaakt</th></tr></thead><tbody>';
    var som = d.vragen.map(function () { return { g: 0, j1: 0, j: 0 }; });
    rijen.forEach(function (r) {
      var t = telDeel(r, d);
      h += '<tr><td class="l naam" title="' + esc(r.email) + '">' + esc(r.naam) + '</td><td>' + esc(r.groep || '?') + '</td>';
      d.vragen.forEach(function (v, i) { var x = r.vragen[d.id + '_' + v.id]; if (x && x.s) { som[i].g++; if (x.s === 'j1') som[i].j1++; if (x.s === 'j1' || x.s === 'j') som[i].j++; } h += '<td>' + celVraag(x) + '</td>'; });
      h += '<td>' + t.g + ' / ' + t.tot + '</td></tr>';
    });
    if (rijen.length) {
      h += '<tr class="som"><td class="l naam">Aantal gemaakt</td><td></td>' + som.map(function (s) { return '<td>' + s.g + '</td>'; }).join('') + '<td></td></tr>';
      h += '<tr class="som"><td class="l naam">Juist bij eerste poging</td><td></td>' + som.map(function (s) { return '<td>' + (s.g ? Math.round(s.j1 / s.g * 100) + ' %' : '') + '</td>'; }).join('') + '<td></td></tr>';
    }
    h += '</tbody></table>';
    h += '<div class="blok-in" style="font-size:.88rem"><strong>Vragen in dit onderdeel</strong><ol style="margin:6px 0 0;padding-left:1.6em;columns:2">' + d.vragen.map(function (v) { return '<li>' + esc(v.titel || '') + '</li>'; }).join('') + '</ol></div>';
    return h;
  }

  function csv(m, rijen) {
    var kop = ['naam', 'e-mail', 'groep'], regels = [];
    m.delen.forEach(function (d) { d.vragen.forEach(function (v, i) { kop.push(d.nr + '.' + (i + 1) + ' ' + (v.titel || '')); }); });
    kop.push('gemaakt', 'juist');
    rijen.forEach(function (r) {
      var rij = [r.naam, r.email, r.groep], g = 0, j = 0;
      m.delen.forEach(function (d) {
        d.vragen.forEach(function (v) {
          var x = r.vragen[d.id + '_' + v.id], t = '';
          if (x && x.s) { g++; if (x.s === 'j1' || x.s === 'j') j++; t = x.s === 'j1' ? 'juist (1e poging)' : x.s === 'j' ? 'juist (' + x.p + ' pogingen)' : x.s === 'o' ? 'oplossing bekeken' : 'niet juist (' + x.p + ')'; }
          rij.push(t);
        });
      });
      rij.push(g, j); regels.push(rij);
    });
    var tekst = [kop].concat(regels).map(function (r) { return r.map(function (c) { return '"' + String(c == null ? '' : c).replace(/"/g, '""') + '"'; }).join(';'); }).join('\r\n');
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob(['\ufeff' + tekst], { type: 'text/csv;charset=utf-8' }));
    a.download = 'resultaten-module-' + m.nummer + (S.groep ? '-' + S.groep : '') + '.csv';
    document.body.appendChild(a); a.click(); a.remove();
  }

  async function tabResultaten(el) {
    var m = mod(); S.mod = m.id;
    el.innerHTML = '<p>Resultaten laden…</p>';
    try { await laadRijen(); } catch (e) { el.innerHTML = '<p class="melding">De resultaten konden niet geladen worden. Controleer de Firestore-regels en je internetverbinding.</p>'; return; }
    var d = m.delen.find(function (x) { return x.id === S.deel; }) || m.delen[0];
    var rijen = S.rijen.filter(function (r) { return !S.groep || r.groep === S.groep; });
    var h = '<div class="filters">' +
      '<label>Module<select id="fMod">' + window.MODULES.map(function (x) { return '<option value="' + x.id + '"' + (x.id === m.id ? ' selected' : '') + '>Module ' + x.nummer + ': ' + esc(x.titel) + '</option>'; }).join('') + '</select></label>' +
      '<label>Niveaugroep<select id="fGroep"><option value="">Alle groepen</option>' + C.groepen.map(function (g) { return '<option' + (g === S.groep ? ' selected' : '') + '>' + esc(g) + '</option>'; }).join('') + '</select></label>' +
      '<label>Weergave<select id="fWeergave"><option value="delen"' + (S.weergave === 'delen' ? ' selected' : '') + '>Overzicht per tussentitel</option><option value="vragen"' + (S.weergave === 'vragen' ? ' selected' : '') + '>Detail per vraag</option></select></label>' +
      (S.weergave === 'vragen' ? '<label>Tussentitel<select id="fDeel">' + m.delen.map(function (x) { return '<option value="' + x.id + '"' + (x.id === d.id ? ' selected' : '') + '>' + esc(x.nr + '. ' + x.titel) + '</option>'; }).join('') + '</select></label>' : '') +
      '<button type="button" class="knop klein" id="bVernieuw">Vernieuw</button><button type="button" class="knop klein" id="bCsv">Download als csv</button></div>';
    h += '<p class="onder" style="margin-bottom:8px">' + rijen.length + (rijen.length === 1 ? ' leerling' : ' leerlingen') + (S.groep ? ' in ' + esc(S.groep) : '') + '. Alleen leerlingen die zich al eens aanmeldden, staan in de lijst.</p>';
    h += '<div class="tabelwrap">' + (rijen.length ? (S.weergave === 'vragen' ? tabelVragen(m, d, rijen) : tabelDelen(m, rijen)) : '<p class="leeg">Nog geen leerlingen' + (S.groep ? ' in deze groep' : '') + '.</p>') + '</div>';
    if (S.weergave === 'vragen') h += '<div class="legende"><span><span class="cel j1">✓</span>juist bij de eerste poging</span><span><span class="cel j">✓3</span>juist na 3 pogingen</span><span><span class="cel f">✗2</span>nog niet juist na 2 pogingen</span><span><span class="cel o">◉</span>oplossing bekeken</span><span><span class="cel n">·</span>nog niet gemaakt</span></div>';
    el.innerHTML = h;
    function opnieuw() { tabResultaten(el); }
    el.querySelector('#fMod').addEventListener('change', function (e) { S.mod = e.target.value; S.deel = ''; opnieuw(); });
    el.querySelector('#fGroep').addEventListener('change', function (e) { S.groep = e.target.value; opnieuw(); });
    el.querySelector('#fWeergave').addEventListener('change', function (e) { S.weergave = e.target.value; opnieuw(); });
    var fd = el.querySelector('#fDeel'); if (fd) fd.addEventListener('change', function (e) { S.deel = e.target.value; opnieuw(); });
    el.querySelector('#bVernieuw').addEventListener('click', function () { S.leerlingen = null; S.res = {}; opnieuw(); });
    el.querySelector('#bCsv').addEventListener('click', function () { csv(m, rijen); });
  }

  /* ---------- tabblad modules ---------- */
  function tabModules(el) {
    var h = '<div class="kaart-blok"><div class="balk">Modules open zetten</div><div class="blok-in"><p class="onder" style="margin-bottom:6px">Vink aan welke modules de leerlingen mogen zien. Een wijziging wordt meteen bewaard.</p>';
    window.MODULES.forEach(function (m) {
      var n = 0; m.delen.forEach(function (d) { n += d.vragen.length; });
      h += '<label class="schakel"><input type="checkbox" data-m="' + m.id + '"' + (actief(m) ? ' checked' : '') + '><span class="wat"><strong>Module ' + m.nummer + ': ' + esc(m.titel) + '</strong><span class="mini">' + m.delen.length + ' tussentitels, ' + n + ' vragen</span></span></label>';
    });
    h += '<p id="modStatus" class="bewaard" style="margin-top:8px"></p></div></div>' +
      '<div class="kaart-blok"><div class="balk">Een module toevoegen</div><div class="blok-in"><ul class="vinklijst"><li>Zet het nieuwe modulebestand (bijvoorbeeld m03.js) in de map <span class="accent">modules</span> op GitHub.</li><li>Voeg de bestandsnaam toe in <span class="accent">modules/lijst.js</span>.</li><li>Vink de module hier aan zodra je leerlingen ermee mogen oefenen.</li></ul></div></div>';
    el.innerHTML = h;
    el.querySelectorAll('input[data-m]').forEach(function (cb) {
      cb.addEventListener('change', async function () {
        var st = document.getElementById('modStatus'), a = {};
        window.MODULES.forEach(function (m) { a[m.id] = el.querySelector('input[data-m="' + m.id + '"]').checked; });
        S.inst = { actief: a }; st.textContent = 'Bewaren…';
        try { await O.bewaarInstellingen(S.inst); st.textContent = '✓ Bewaard'; }
        catch (e) { st.textContent = 'Niet bewaard. Controleer je internetverbinding.'; }
      });
    });
  }

  /* ---------- tabblad leerkrachten ---------- */
  async function tabLeerkrachten(el) {
    el.innerHTML = '<p>Laden…</p>';
    var lijst = [];
    try { lijst = await O.leerkrachten(); } catch (e) { el.innerHTML = '<p class="melding">De lijst kon niet geladen worden.</p>'; return; }
    lijst.sort(function (a, b) { return a.email.localeCompare(b.email); });
    var h = '<div class="kaart-blok"><div class="balk">Wie heeft toegang tot deze pagina?</div><div class="blok-in">';
    lijst.forEach(function (l) {
      h += '<div class="schakel"><span class="wat">' + esc(l.email) + (l.email === S.user.email ? ' <span class="mini" style="display:inline">(jij)</span>' : '') + '</span>' + (l.email !== S.user.email ? '<button type="button" class="knop klein" data-weg="' + esc(l.email) + '">Verwijder</button>' : '') + '</div>';
    });
    h += '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:14px;align-items:center"><input class="tekstveld" id="nieuwLk" type="email" placeholder="voornaam.naam@' + esc(C.domein) + '" aria-label="E-mailadres van de nieuwe leerkracht"><button type="button" class="knop vol" id="bVoegToe">Voeg leerkracht toe</button></div><p id="lkStatus" class="bewaard" style="margin-top:8px">' + (O.demo ? 'In de demomodus kun je geen leerkrachten toevoegen.' : '') + '</p></div></div>';
    el.innerHTML = h;
    el.querySelector('#bVoegToe').addEventListener('click', async function () {
      var e = el.querySelector('#nieuwLk').value.trim().toLowerCase(), st = document.getElementById('lkStatus');
      if (!e.endsWith('@' + C.domein)) { st.textContent = 'Geef een e-mailadres van ' + C.domein + ' in.'; return; }
      try { await O.voegLeerkrachtToe(e); tabLeerkrachten(el); } catch (x) { st.textContent = 'Toevoegen is niet gelukt.'; }
    });
    el.querySelectorAll('[data-weg]').forEach(function (b) {
      b.addEventListener('click', async function () {
        if (!window.confirm('Toegang voor ' + b.dataset.weg + ' verwijderen?')) return;
        try { await O.verwijderLeerkracht(b.dataset.weg); tabLeerkrachten(el); } catch (x) { document.getElementById('lkStatus').textContent = 'Verwijderen is niet gelukt.'; }
      });
    });
  }

  function toon() {
    tekenKop();
    var tabs = [['res', 'Resultaten'], ['mod', 'Modules'], ['lk', 'Leerkrachten']];
    hoofd.innerHTML = '<h1 class="paginatitel">Opvolging van de leerlingen</h1><p class="onder">Bekijk wie welke vragen maakte en hoe dat ging.</p>' +
      '<div class="tabs" role="tablist">' + tabs.map(function (t) { return '<button type="button" class="tab' + (t[0] === S.tab ? ' actief' : '') + '" role="tab" aria-selected="' + (t[0] === S.tab) + '" data-tab="' + t[0] + '">' + t[1] + '</button>'; }).join('') + '</div><div id="paneel"></div>';
    hoofd.querySelectorAll('.tab').forEach(function (b) { b.addEventListener('click', function () { S.tab = b.dataset.tab; toon(); }); });
    var p = document.getElementById('paneel');
    if (S.tab === 'res') tabResultaten(p); else if (S.tab === 'mod') tabModules(p); else tabLeerkrachten(p);
  }

  (async function start() {
    if (O.demo) document.getElementById('demo').hidden = false;
    try {
      await window.laadModules();
      O.onAuth(async function (u) {
        S.user = u; S.leerlingen = null; S.res = {};
        if (!u) return toonLogin();
        if (!(await O.isLeerkracht())) return toonGeenToegang();
        S.inst = await O.leesInstellingen();
        toon();
      });
      await O.init();
    } catch (e) {
      hoofd.innerHTML = '<div class="kaart-blok"><div class="blok-in"><p class="melding">De pagina kon niet starten: ' + esc(e.message || e) + '</p></div></div>';
    }
  })();
})();
