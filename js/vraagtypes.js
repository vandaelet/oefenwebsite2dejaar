/* Vraagtypes. Elk type krijgt een houder en de vraag en geeft terug:
   { controleer(): {juist, totaal, leeg?, nota?}, oplossing() }                       */
(function () {
  'use strict';
  var VT = {};

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  /* opmaak: {3/4} wordt een breuk met breukstreep, ^A wordt een hoek met dakje */
  function fmt(s) {
    if (s == null) return '';
    return String(s)
      .replace(/\{([^{}\/]+)\/([^{}\/]+)\}/g, '<span class="breuk"><span class="t">$1</span><span class="n">$2</span></span>')
      .replace(/\^([A-Z])(\d?)/g, function (m, l, d) { return '<span class="hk">' + l + '</span>' + (d ? '<sub>' + d + '</sub>' : ''); });
  }
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function schud(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function leesGetal(s) {
    s = String(s).trim().replace(/\s|°|%|€/g, '').replace(/[−–]/g, '-').replace(',', '.');
    if (!/^[-+]?(\d+\.?\d*|\.\d+)$/.test(s)) return NaN;
    return parseFloat(s);
  }
  function norm(s) { return String(s).toLowerCase().trim().replace(/\s+/g, ' ').replace(/[.!]$/, '').replace(/[’`]/g, "'"); }
  function komma(n) { return String(n).replace('.', ','); }


  /* ---------- lettervormen (algebra) lezen en vergelijken ---------- */
  var SUPER = '⁰¹²³⁴⁵⁶⁷⁸⁹';
  function algNorm(str) {
    return String(str).toLowerCase().replace(/\s+/g, '').replace(/[−–]/g, '-').replace(/[·*×]/g, '*').replace(/,/g, '.').replace(/:/g, '/')
      .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, function (m) { return '^' + m.split('').map(function (c) { return SUPER.indexOf(c); }).join(''); });
  }
  function sleutelVan(vars) { return Object.keys(vars).sort().filter(function (k) { return vars[k]; }).map(function (k) { return k + vars[k]; }).join(''); }
  function varsVan(key) { var v = {}, m, re = /([a-z])(\d+)/g; while ((m = re.exec(key))) v[m[1]] = +m[2]; return v; }
  function pAdd(a, b, teken) { var r = Object.assign({}, a); Object.keys(b).forEach(function (k) { r[k] = (r[k] || 0) + teken * b[k]; }); return r; }
  function pMul(a, b) {
    var r = {};
    Object.keys(a).forEach(function (ka) {
      Object.keys(b).forEach(function (kb) {
        var v = varsVan(ka), w = varsVan(kb); Object.keys(w).forEach(function (l) { v[l] = (v[l] || 0) + w[l]; });
        var k = sleutelVan(v); r[k] = (r[k] || 0) + a[ka] * b[kb];
      });
    });
    return r;
  }
  function pSchoon(p) { var r = {}; Object.keys(p).forEach(function (k) { if (Math.abs(p[k]) > 1e-9) r[k] = p[k]; }); return r; }
  /* geeft een veelterm terug als {sleutel: coëfficiënt}, of null als de invoer niet leesbaar is */
  function algParse(str) {
    var s = algNorm(str), i = 0;
    if (!s) return null;
    function fout() { throw new Error('onleesbaar'); }
    function expr() {
      var p = term();
      while (s[i] === '+' || s[i] === '-') { var op = s[i++]; p = pAdd(p, term(), op === '+' ? 1 : -1); }
      return p;
    }
    function teken() { var t = 1; while (s[i] === '+' || s[i] === '-') { if (s[i++] === '-') t = -t; } return t; }
    function term() {
      var t = teken(), p = factor(), q, k;
      for (;;) {
        if (s[i] === '*') { i++; k = teken(); q = factor(); p = pMul(p, q); if (k < 0) p = pMul(p, { '': -1 }); }
        else if (s[i] === '/') { i++; k = teken(); q = pSchoon(factor()); var ks = Object.keys(q); if (ks.length !== 1 || ks[0] !== '') fout(); p = pMul(p, { '': k / q[''] }); }
        else if (s[i] && /[a-z0-9.(]/.test(s[i])) p = pMul(p, factor());
        else break;
      }
      return t < 0 ? pMul(p, { '': -1 }) : p;
    }
    function getal() { var m = /^(\d+\.?\d*|\.\d+)/.exec(s.slice(i)); if (!m) fout(); i += m[0].length; return parseFloat(m[0]); }
    function exponent(p) {
      if (s[i] !== '^') return p;
      i++; var m = /^\d+/.exec(s.slice(i)); if (!m) fout(); i += m[0].length;
      var n = +m[0], r = { '': 1 }; if (n > 12) fout(); for (var k = 0; k < n; k++) r = pMul(r, p); return r;
    }
    function factor() {
      var c = s[i], p;
      if (c === '(') { i++; p = expr(); if (s[i] !== ')') fout(); i++; return exponent(p); }
      if (c && /[a-z]/.test(c)) {
        i++; var v = {}; v[c] = 1; p = {}; p[sleutelVan(v)] = 1;
        return exponent(p);
      }
      if (c && /[0-9.]/.test(c)) return exponent({ '': getal() });
      fout();
    }
    try { var res = expr(); if (i < s.length) return null; return pSchoon(res); } catch (e) { return null; }
  }
  function algGelijk(a, b) {
    var ks = {}; Object.keys(a).concat(Object.keys(b)).forEach(function (k) { ks[k] = 1; });
    return Object.keys(ks).every(function (k) { return Math.abs((a[k] || 0) - (b[k] || 0)) < 1e-9; });
  }
  /* is de invoer volledig herleid? (geen haakjes, geen maaltekens, gelijksoortige termen samengenomen, coëfficiënt vooraan) */
  function algHerleid(str, poly) {
    var s = algNorm(str);
    if (/[()*\/]/.test(s)) return false;
    var termen = s.match(/[+-]?[^+-]+/g) || [];
    var n = Object.keys(poly).length || 1;
    if (termen.length !== n) return false;
    return termen.every(function (t) {
      var kaal = t.replace(/([a-z])\^\d+/g, '$1');
      if (!/^[+-]?(\d+(\.\d+)?)?[a-z]*$/.test(kaal) || /^[+-]?$/.test(kaal)) return false;
      var letters = kaal.match(/[a-z]/g) || [];
      return letters.every(function (l, idx) { return letters.indexOf(l) === idx; });
    });
  }
  function algGraden(str) {
    return (algNorm(str).match(/[+-]?[^+-]+/g) || []).map(function (t) { var p = algParse(t); if (!p) return 0; var k = Object.keys(p)[0] || '', v = varsVan(k); return Object.keys(v).reduce(function (a, l) { return a + v[l]; }, 0); });
  }
  function algMooi(str) {
    return esc(String(str)).replace(/([a-zA-Z])\^(\d+)/g, '$1<sup>$2</sup>').replace(/\)\^(\d+)/g, ')<sup>$1</sup>')
      .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, function (m) { return '<sup>' + m.split('').map(function (c) { return SUPER.indexOf(c); }).join('') + '</sup>'; })
      .replace(/\*/g, '·').replace(/\s*([+\-−])\s*/g, function (m, o, pos) { return pos === 0 ? '−' === o || o === '-' ? '−' : '' : ' ' + (o === '+' ? '+' : '−') + ' '; }).replace(/\(\s−\s/g, '(−').replace(/·\s−\s/g, '· −');
  }

  /* ---------- invulvelden ---------- */
  var G = function (a, o) { return Object.assign({ t: 'getal', a: a }, o || {}); };
  var T = function () { return { t: 'tekst', a: Array.prototype.slice.call(arguments) }; };
  var B = function (t, n, o) { return Object.assign({ t: 'breuk', a: [t, n] }, o || {}); };
  var K = function (o, a) { return { t: 'keuze', o: o, a: a }; };
  var A = function (a, o) { return Object.assign({ t: 'alg', a: a }, o || {}); };

  function veldHtml(k, d) {
    var h;
    if (d.t === 'keuze') {
      h = '<select class="veld" data-k="' + k + '" aria-label="Kies het juiste antwoord"><option value="">kies</option>' +
        d.o.map(function (o) { return '<option>' + esc(o) + '</option>'; }).join('') + '</select>';
    } else if (d.t === 'breuk') {
      h = '<span class="breuk invoer veld" data-k="' + k + '"><input class="t" inputmode="numeric" aria-label="teller" autocomplete="off"><input class="n" inputmode="numeric" aria-label="noemer" autocomplete="off"></span>';
    } else if (d.t === 'alg') {
      return '<span class="veldwrap"><span class="algwrap"><input class="veld" data-k="' + k + '" style="width:' + ((d.w || 13) + 2) + 'ch" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="antwoord als lettervorm"><span class="algvb" data-vb="' + k + '"></span></span><span class="merk" data-m="' + k + '" aria-hidden="true"></span></span>';
    } else {
      var w = d.w || (d.t === 'tekst' ? 13 : 5);
      h = '<input class="veld" data-k="' + k + '" style="width:' + (w + 2) + 'ch" autocomplete="off" autocapitalize="off" spellcheck="false"' +
        (d.t === 'getal' ? ' inputmode="decimal"' : '') + ' aria-label="antwoord">';
    }
    return '<span class="veldwrap">' + h + '<span class="merk" data-m="' + k + '" aria-hidden="true"></span></span>';
  }
  function vulSjabloon(sjabloon, velden) {
    return fmt(sjabloon).replace(/\[\[(\w+)\]\]/g, function (m, k) { return velden[k] ? veldHtml(k, velden[k]) : m; });
  }
  function checkVeld(root, k, d) {
    var e = root.querySelector('[data-k="' + k + '"]'), ok = false, leeg = false, nota = '', opmerking = '';
    if (d.t === 'keuze') { leeg = !e.value; ok = e.value === d.a; }
    else if (d.t === 'breuk') {
      var tv = e.querySelector('.t').value, nv = e.querySelector('.n').value, t = leesGetal(tv), n = leesGetal(nv);
      leeg = tv.trim() === '' && nv.trim() === '';
      if (!isNaN(t) && !isNaN(n) && n !== 0) {
        if (t === d.a[0] && n === d.a[1]) ok = true;
        else if (t * d.a[1] === n * d.a[0]) { if (d.gelijkwaardig) ok = true; else nota = 'Een breuk heeft de juiste waarde, maar staat nog niet in de gevraagde vorm.'; }
      }
    } else if (d.t === 'alg') {
      leeg = e.value.trim() === ''; var pv = algParse(e.value), pj = algParse(d.a);
      if (!leeg && !pv) nota = 'Een antwoord kon niet gelezen worden. Kijk na of er geen teken of haakje ontbreekt.';
      else if (pv && algGelijk(pv, pj)) {
        if (d.vrij || algHerleid(e.value, pv)) {
          ok = true; var gr = algGraden(e.value);
          if (!d.vrij && gr.some(function (g, idx) { return idx > 0 && g > gr[idx - 1]; })) opmerking = 'Tip: rangschik je eindresultaat volgens dalende machten.';
        } else nota = 'Een antwoord heeft de juiste waarde, maar is nog niet volledig herleid of niet volgens de afspraken genoteerd.';
      }
      if (!ok && !leeg && cijferNaLetter(e.value)) nota = MACHT_NOTA;
    } else if (d.t === 'getal') {
      leeg = e.value.trim() === ''; var x = leesGetal(e.value);
      ok = [].concat(d.a).some(function (a) { return Math.abs(x - a) <= (d.tol || 1e-9); });
    } else {
      leeg = e.value.trim() === ''; var s = norm(e.value);
      ok = d.a.some(function (a) { return norm(a) === s; });
    }
    e.classList.remove('juist', 'fout'); if (!leeg) e.classList.add(ok ? 'juist' : 'fout');
    var m = root.querySelector('[data-m="' + k + '"]'); if (m) { m.textContent = leeg ? '' : ok ? '✓' : '✗'; m.className = 'merk ' + (ok ? 'juist' : 'fout'); }
    return { ok: ok, leeg: leeg, nota: nota, opmerking: opmerking };
  }
  function vulVeld(root, k, d) {
    var e = root.querySelector('[data-k="' + k + '"]');
    if (d.t === 'keuze') e.value = d.a;
    else if (d.t === 'breuk') { e.querySelector('.t').value = d.a[0]; e.querySelector('.n').value = d.a[1]; }
    else if (d.t === 'getal') e.value = komma([].concat(d.a)[0]);
    else if (d.t === 'alg') { e.value = d.a; toonAlg(root, e); }
    else e.value = d.a[0];
    e.classList.remove('fout'); e.classList.add('juist');
    var m = root.querySelector('[data-m="' + k + '"]'); if (m) { m.textContent = '✓'; m.className = 'merk juist'; }
  }
  function toonAlg(root, e) {
    var vb = root.querySelector('[data-vb="' + e.dataset.k + '"]'); if (!vb) return;
    var leeg = e.value.trim() === '', okk = leeg || !!algParse(e.value), macht = !leeg && cijferNaLetter(e.value);
    vb.textContent = macht ? 'Macht? Gebruik de knop x².' : okk ? '' : 'nog niet leesbaar';
    vb.classList.toggle('onleesbaar', macht || !okk);
  }
  var MACHT_NOTA = 'Staat er een cijfer vlak achter een letter? Een macht voer je in met de knoppen x², x³ of xⁿ. Een coëfficiënt staat vooraan.';
  function cijferNaLetter(str) { return /[a-z]\d/.test(algNorm(str)); }
  function naarExponent(cijfers) { return String(cijfers).split('').map(function (c) { return SUPER.charAt(+c); }).join(''); }
  /* zet getypte tekst om naar echte exponenten: in de exponentmodus worden cijfers een exponent, en ^2 wordt ² */
  function verwerkMacht(inp, ev, macht) {
    var val = inp.value, pos = inp.selectionStart == null ? val.length : inp.selectionStart;
    var data = ev ? ev.data : null, getypt = !!ev && typeof ev.inputType === 'string' && ev.inputType.indexOf('insert') === 0;
    if (macht && macht.aan && getypt && data != null) {
      if (/^\d$/.test(data) && val.charAt(pos - 1) === data) val = val.slice(0, pos - 1) + naarExponent(data) + val.slice(pos);
      else if (data !== '^') macht.zet(false);
    }
    function om(t) { return t.replace(/\^(\d+)/g, function (m, c) { return naarExponent(c); }); }
    var voor = om(val.slice(0, pos)), na = om(val.slice(pos));
    if (macht && /\^$/.test(voor)) { voor = voor.slice(0, -1); macht.zet(true); }
    if (voor + na !== inp.value) { inp.value = voor + na; try { inp.setSelectionRange(voor.length, voor.length); } catch (e) { /* ok */ } }
  }
  function voegIn(inp, tekst) {
    var a = inp.selectionStart == null ? inp.value.length : inp.selectionStart, b = inp.selectionEnd == null ? a : inp.selectionEnd;
    inp.value = inp.value.slice(0, a) + tekst + inp.value.slice(b);
    inp.focus(); try { inp.setSelectionRange(a + tekst.length, a + tekst.length); } catch (e) { /* ok */ }
    inp.dispatchEvent(new Event('input', { bubbles: true }));
  }
  function veldCtl(root, velden, macht) {
    var keys = Object.keys(velden || {});
    function isAlg(v) { return !!v && !!velden[v.dataset.k] && velden[v.dataset.k].t === 'alg'; }
    root.addEventListener('focusin', function (ev) {
      var v = ev.target.closest('.veld'); if (!macht || !isAlg(v)) return;
      if (macht.veld !== v) macht.zet(false);
      macht.veld = v;
    });
    root.addEventListener('compositionend', function (ev) {
      var v = ev.target.closest('.veld'); if (!isAlg(v)) return;
      verwerkMacht(v, null, macht); toonAlg(root, v);
    });
    root.addEventListener('input', function (ev) {
      var v = ev.target.closest('.veld'); if (!v) return; v.classList.remove('juist', 'fout');
      if (isAlg(v)) { if (!ev.isComposing) verwerkMacht(v, ev, macht); toonAlg(root, v); }
      var m = root.querySelector('[data-m="' + v.dataset.k + '"]'); if (m) m.textContent = '';
    });
    return {
      controleer: function () {
        var j = 0, leeg = 0, notas = [], opm = '';
        keys.forEach(function (k) { var r = checkVeld(root, k, velden[k]); if (r.ok) j++; if (r.leeg) leeg++; if (r.nota && notas.indexOf(r.nota) < 0) notas.push(r.nota); if (r.opmerking) opm = r.opmerking; });
        if (leeg && leeg < keys.length) notas.push('Je vulde nog niet alles in.');
        return { juist: j, totaal: keys.length, leeg: keys.length > 0 && leeg === keys.length, nota: notas.join(' '), opmerking: opm };
      },
      oplossing: function () { keys.forEach(function (k) { vulVeld(root, k, velden[k]); }); }
    };
  }

  /* ---------- invul en stappen ---------- */
  /* knoppenbalk om machten in te voeren; geeft de toestand terug die veldCtl gebruikt */
  function machtBalk(root, velden) {
    if (!Object.keys(velden || {}).some(function (k) { return velden[k].t === 'alg'; })) return null;
    var balk = el('div', 'machtbalk', '<span class="machtlabel">Macht invoeren:</span>' +
      '<button type="button" class="machtknop" data-exp="²" title="Kwadraat invoegen">x<sup>2</sup></button>' +
      '<button type="button" class="machtknop" data-exp="³" title="Derde macht invoegen">x<sup>3</sup></button>' +
      '<button type="button" class="machtknop" data-modus="1" aria-pressed="false" title="Andere exponent typen">x<sup>n</sup></button>' +
      '<span class="machtstatus" aria-live="polite"></span>');
    balk.setAttribute('role', 'toolbar'); balk.setAttribute('aria-label', 'Macht invoeren');
    root.appendChild(balk);
    var uitleg = 'Zet je cursor achter de letter en klik op een knop.';
    var status = balk.querySelector('.machtstatus'), modusKnop = balk.querySelector('[data-modus]');
    var macht = {
      aan: false, veld: null,
      zet: function (aan) {
        macht.aan = !!aan; modusKnop.classList.toggle('actief', macht.aan); modusKnop.setAttribute('aria-pressed', macht.aan);
        status.textContent = macht.aan ? 'Typ nu de exponent.' : uitleg; status.classList.toggle('actief', macht.aan);
      }
    };
    macht.zet(false);
    function doel() { return macht.veld && root.contains(macht.veld) ? macht.veld : root.querySelector('.algwrap input.veld'); }
    balk.querySelectorAll('.machtknop').forEach(function (b) {
      b.addEventListener('mousedown', function (e) { e.preventDefault(); });     // het invulveld houdt de cursor
      b.addEventListener('click', function () {
        var inp = doel(); if (!inp) return; macht.veld = inp;
        if (b.dataset.exp) { macht.zet(false); voegIn(inp, b.dataset.exp); }
        else { macht.zet(!macht.aan); inp.focus(); }
      });
    });
    return macht;
  }
  VT.invul = function (root, v) {
    var macht = machtBalk(root, v.velden);
    var d = el('div', 'invul', vulSjabloon(v.sjabloon, v.velden)); root.appendChild(d);
    return veldCtl(d, v.velden, macht);
  };
  VT.stappen = function (root, v) {
    var macht = machtBalk(root, v.velden);
    var html = '<ol class="stappen">' + v.stappen.map(function (s) { return '<li>' + vulSjabloon(s, v.velden) + '</li>'; }).join('') + '</ol>';
    var d = el('div', 'invul', html); root.appendChild(d);
    return veldCtl(d, v.velden, macht);
  };

  /* ---------- meerkeuze ---------- */
  VT.mc = function (root, v) {
    var meer = !!v.meerdere, juist = [].concat(v.juist), gekozen = [];
    var volg = v.opties.map(function (_, i) { return i; }); if (!v.vast) volg = schud(volg);
    var lijst = el('div', 'mc' + (v.compact ? ' compact' : '')); lijst.setAttribute('role', meer ? 'group' : 'radiogroup');
    volg.forEach(function (i) {
      var b = el('button', 'optie', '<span class="' + (meer ? 'vink' : 'bol') + '"></span><span class="optietekst">' + fmt(v.opties[i]) + '</span>');
      b.type = 'button'; b.dataset.i = i; b.setAttribute('role', meer ? 'checkbox' : 'radio'); b.setAttribute('aria-checked', 'false');
      b.addEventListener('click', function () {
        var p = gekozen.indexOf(i);
        if (meer) { if (p >= 0) gekozen.splice(p, 1); else gekozen.push(i); } else gekozen = [i];
        ververs();
      });
      lijst.appendChild(b);
    });
    function ververs() {
      lijst.querySelectorAll('.optie').forEach(function (b) {
        var s = gekozen.indexOf(+b.dataset.i) >= 0; b.classList.toggle('gekozen', s); b.setAttribute('aria-checked', s); b.classList.remove('juist', 'fout');
      });
    }
    if (meer) root.appendChild(el('p', 'aanwijzing', 'Er kunnen meerdere antwoorden juist zijn.'));
    root.appendChild(lijst);
    return {
      controleer: function () {
        if (!gekozen.length) return { leeg: true };
        var j = 0, tot = meer ? v.opties.length : 1, nota = '';
        lijst.querySelectorAll('.optie').forEach(function (b) {
          var i = +b.dataset.i, g = gekozen.indexOf(i) >= 0, moet = juist.indexOf(i) >= 0;
          if (meer && g === moet) j++; if (!meer && g && moet) j = 1;
          if (g) b.classList.add(moet ? 'juist' : 'fout');
        });
        if (meer) { var gemist = juist.filter(function (i) { return gekozen.indexOf(i) < 0; }).length; if (gemist) nota = 'Je mist nog ' + gemist + (gemist === 1 ? ' juist antwoord.' : ' juiste antwoorden.'); }
        return { juist: j, totaal: tot, nota: nota };
      },
      oplossing: function () { gekozen = juist.slice(); ververs(); lijst.querySelectorAll('.optie.gekozen').forEach(function (b) { b.classList.add('juist'); }); }
    };
  };

  /* ---------- slepen naar vakken / koppelen ---------- */
  VT.sleep = function (root, v) {
    var koppel = !!v.paren, vakken, items;
    if (koppel) {
      vakken = v.paren.map(function (p) { return p[0]; });
      items = v.paren.map(function (p, i) { return { t: p[1], vak: i }; });
      (v.extra || []).forEach(function (t) { items.push({ t: t, vak: -1 }); });
    } else { vakken = v.vakken; items = v.items.map(function (x) { return { t: x[0], vak: x[1] }; }); }
    var plaats = items.map(function () { return -1; }), gekozen = -1;
    var wrap = el('div', 'sleep' + (koppel ? ' koppel' : ''));
    wrap.appendChild(el('p', 'aanwijzing', 'Sleep elk kaartje naar het juiste vak. Je kunt ook eerst op een kaartje tikken en daarna op het vak.'));
    var bank = el('div', 'bank'); bank.dataset.vak = -1; wrap.appendChild(bank);
    var rooster = el('div', 'vakken'); wrap.appendChild(rooster);
    var vakEls = vakken.map(function (t, i) {
      var d = el('div', 'vak', '<div class="vaktitel">' + fmt(t) + '</div><div class="inhoud"></div>'); d.dataset.vak = i; rooster.appendChild(d); return d;
    });
    var kaarten = [];
    schud(items.map(function (_, i) { return i; })).forEach(function (i) {
      var b = el('button', 'kaart', fmt(items[i].t)); b.type = 'button'; b.draggable = true; b.dataset.i = i; kaarten[i] = b; bank.appendChild(b);
      b.addEventListener('click', function (e) { e.stopPropagation(); gekozen = gekozen === i ? -1 : i; markeer(); });
      b.addEventListener('dragstart', function (e) { gekozen = i; try { e.dataTransfer.setData('text/plain', String(i)); e.dataTransfer.effectAllowed = 'move'; } catch (x) { /* ok */ } markeer(); });
    });
    function markeer() { kaarten.forEach(function (b, i) { b.classList.toggle('gekozen', i === gekozen); }); wrap.classList.toggle('kiest', gekozen >= 0); }
    function zet(i, vak) {
      if (koppel && vak >= 0) plaats.forEach(function (p, j) { if (p === vak && j !== i) { plaats[j] = -1; bank.appendChild(kaarten[j]); } });
      plaats[i] = vak; kaarten[i].classList.remove('juist', 'fout');
      (vak < 0 ? bank : vakEls[vak].querySelector('.inhoud')).appendChild(kaarten[i]);
      gekozen = -1; markeer();
    }
    [bank].concat(vakEls).forEach(function (d) {
      var vak = +d.dataset.vak;
      d.addEventListener('click', function () { if (gekozen >= 0) zet(gekozen, vak); });
      d.addEventListener('dragover', function (e) { e.preventDefault(); d.classList.add('boven'); });
      d.addEventListener('dragleave', function () { d.classList.remove('boven'); });
      d.addEventListener('drop', function (e) { e.preventDefault(); d.classList.remove('boven'); if (gekozen >= 0) zet(gekozen, vak); });
    });
    root.appendChild(wrap);
    return {
      controleer: function () {
        if (plaats.every(function (p) { return p < 0; })) return { leeg: true };
        var j = 0, nietGeplaatst = 0;
        items.forEach(function (it, i) {
          var ok = plaats[i] === it.vak; if (ok) j++;
          kaarten[i].classList.remove('juist', 'fout');
          if (plaats[i] >= 0) kaarten[i].classList.add(ok ? 'juist' : 'fout'); else if (it.vak >= 0) nietGeplaatst++;
        });
        return { juist: j, totaal: items.length, nota: nietGeplaatst ? 'Je plaatste nog niet alle kaartjes.' : '' };
      },
      oplossing: function () { items.forEach(function (it, i) { zet(i, it.vak); if (it.vak >= 0) kaarten[i].classList.add('juist'); }); }
    };
  };

  /* ---------- volgorde ---------- */
  VT.volgorde = function (root, v) {
    var n = v.items.length, orde = schud(v.items.map(function (_, i) { return i; }));
    if (orde.every(function (x, i) { return x === i; })) orde.reverse();
    var wrap = el('div', 'volgorde');
    wrap.appendChild(el('p', 'aanwijzing', 'Zet in de juiste volgorde met de pijltjes' + (v.boven ? ' (' + v.boven + ' bovenaan).' : '.')));
    var ol = el('ol', 'rij'); wrap.appendChild(ol); root.appendChild(wrap);
    function teken(markeer) {
      ol.innerHTML = '';
      orde.forEach(function (idx, pos) {
        var li = el('li', 'rijitem' + (markeer ? (idx === pos ? ' juist' : ' fout') : ''));
        var op = el('button', 'pijl', '▲'), neer = el('button', 'pijl', '▼');
        op.type = neer.type = 'button'; op.setAttribute('aria-label', 'Naar boven'); neer.setAttribute('aria-label', 'Naar beneden');
        op.disabled = pos === 0; neer.disabled = pos === n - 1;
        op.addEventListener('click', function () { wissel(pos, pos - 1, 0); }); neer.addEventListener('click', function () { wissel(pos, pos + 1, 1); });
        var kn = el('span', 'pijlen'); kn.appendChild(op); kn.appendChild(neer);
        li.appendChild(kn); li.appendChild(el('span', 'rijtekst', fmt(v.items[idx]))); ol.appendChild(li);
      });
    }
    function wissel(a, b, welke) {
      var t = orde[a]; orde[a] = orde[b]; orde[b] = t; teken();
      var k = ol.children[b].querySelectorAll('.pijl')[welke]; if (k && !k.disabled) k.focus(); else { var k2 = ol.children[b].querySelectorAll('.pijl')[1 - welke]; if (k2) k2.focus(); }
    }
    teken();
    return {
      controleer: function () { var j = orde.filter(function (x, i) { return x === i; }).length; teken(true); return { juist: j, totaal: n }; },
      oplossing: function () { orde = v.items.map(function (_, i) { return i; }); teken(true); }
    };
  };

  /* ---------- priemfactorisatie ---------- */
  function isPriem(x) { if (x < 2 || x % 1) return false; for (var i = 2; i * i <= x; i++) if (x % i === 0) return false; return true; }
  function factoren(n) { var r = [], p = 2; while (n > 1) { if (n % p === 0) { r.push(p); n /= p; } else p++; } return r; }
  VT.priem = function (root, v) {
    var wrap = el('div', 'priem');
    wrap.appendChild(el('p', 'aanwijzing', 'Typ rechts telkens een priemdeler en links eronder het quotiënt. Ga door tot je links 1 bekomt.'));
    var rij = el('div', 'ladders'); wrap.appendChild(rij);
    var ladders = v.getallen.map(function (N) {
      var tab = el('div', 'ladder'); rij.appendChild(tab);
      var L = { N: N, el: tab, rijen: [] };
      function voegRij(vast) {
        var r = el('div', 'ladderrij'), l = el('input', 'lq'), d = el('input', 'ld');
        [l, d].forEach(function (x) { x.setAttribute('inputmode', 'numeric'); x.setAttribute('autocomplete', 'off'); });
        l.setAttribute('aria-label', 'quotiënt'); d.setAttribute('aria-label', 'priemdeler');
        if (vast != null) { l.value = vast; l.readOnly = true; l.classList.add('vast'); }
        r.appendChild(l); r.appendChild(d); tab.appendChild(r); L.rijen.push({ l: l, d: d, r: r });
        [l, d].forEach(function (x) { x.addEventListener('input', bij); });
      }
      function bij() {
        L.rijen.forEach(function (x) { x.l.classList.remove('juist', 'fout'); x.d.classList.remove('juist', 'fout'); x.d.hidden = x.l.value.trim() === '1'; });
        var laatste = L.rijen[L.rijen.length - 1];
        if (laatste.d.value.trim() !== '' && laatste.l.value.trim() !== '1' && L.rijen.length < 14) voegRij();
      }
      L.voegRij = voegRij; L.bij = bij; voegRij(N);
      return L;
    });
    var ctl = null;
    if (v.slot) { var s = el('div', 'invul slot', vulSjabloon(v.slot, v.velden)); wrap.appendChild(s); ctl = veldCtl(s, v.velden); }
    root.appendChild(wrap);
    function checkLadder(L) {
      var ok = true, huidig = L.N, klaar = false, iets = false;
      L.rijen.forEach(function (x, i) {
        if (klaar) return;
        var lv = i === 0 ? L.N : leesGetal(x.l.value), dv = leesGetal(x.d.value);
        if (i > 0) { if (x.l.value.trim() === '') { ok = false; klaar = true; return; } iets = true; var lok = lv === huidig; x.l.classList.add(lok ? 'juist' : 'fout'); if (!lok) { ok = false; klaar = true; return; } }
        if (lv === 1) { klaar = true; return; }
        if (x.d.value.trim() === '') { ok = false; klaar = true; return; }
        iets = true; var dok = isPriem(dv) && lv % dv === 0; x.d.classList.add(dok ? 'juist' : 'fout');
        if (!dok) { ok = false; klaar = true; return; }
        huidig = lv / dv;
      });
      if (huidig !== 1) ok = false;
      return { ok: ok, iets: iets };
    }
    return {
      controleer: function () {
        var j = 0, iets = false, notas = [];
        ladders.forEach(function (L) { var r = checkLadder(L); if (r.ok) j++; else notas.push('De ontbinding van ' + L.N + ' is nog niet volledig juist.'); if (r.iets) iets = true; });
        var tot = ladders.length, leeg = !iets;
        if (ctl) { var r2 = ctl.controleer(); j += r2.juist; tot += r2.totaal; leeg = leeg && r2.leeg; if (r2.nota) notas.push(r2.nota); }
        return { juist: j, totaal: tot, leeg: leeg, nota: notas.join(' ') };
      },
      oplossing: function () {
        ladders.forEach(function (L) {
          L.el.innerHTML = ''; L.rijen = []; var n = L.N;
          L.voegRij(n); factoren(L.N).forEach(function (p, i) { L.rijen[i].d.value = p; n /= p; L.voegRij(); L.rijen[i + 1].l.value = n; });
          L.bij(); L.rijen.forEach(function (x) { x.l.classList.add('juist'); if (!x.d.hidden) x.d.classList.add('juist'); });
        });
        if (ctl) ctl.oplossing();
      }
    };
  };

  /* ---------- venndiagram: gebieden aanklikken ---------- */
  var vennNr = 0;
  VT.venn = function (root, v) {
    var namen = v.sets, n = namen.length, W = 420, H = n === 3 ? 344 : 240, R = 96, uid = 'venn' + (++vennNr);
    var c = n === 2 ? [[152, 120], [268, 120]] : [[152, 112], [268, 112], [210, 212]];
    var lab = n === 2 ? [[70, 34], [350, 34]] : [[62, 30], [358, 30], [210, 328]];
    var gekozen = [], status = {};
    var alle = []; for (var m = 1; m < (1 << n); m++) { var k = ''; for (var i = 0; i < n; i++) if (m & (1 << i)) k += namen[i]; alle.push(k); }
    var wrap = el('div', 'venn');
    wrap.appendChild(el('p', 'aanwijzing', 'Klik op elk gebied dat bij het antwoord hoort. Klik opnieuw om het weer uit te zetten.'));
    var houder = el('div', 'vennhouder'); wrap.appendChild(houder); root.appendChild(wrap);
    function sleutel(x, y) { var k = ''; c.forEach(function (mp, i) { if (Math.hypot(x - mp[0], y - mp[1]) <= R) k += namen[i]; }); return k; }
    function regio(key, cls) {
      var uit = [], s;
      namen.forEach(function (nm, i) { if (key.indexOf(nm) < 0) uit.push(i); });
      s = '<rect x="0" y="0" width="' + W + '" height="' + H + '" class="' + cls + '"' + (uit.length ? ' mask="url(#' + uid + 'm' + uit.join('') + ')"' : '') + '/>';
      namen.forEach(function (nm, i) { if (key.indexOf(nm) >= 0) s = '<g clip-path="url(#' + uid + 'c' + i + ')">' + s + '</g>'; });
      return s;
    }
    function teken() {
      var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" class="vennsvg" role="img" aria-label="Venndiagram"><defs>';
      c.forEach(function (mp, i) { s += '<clipPath id="' + uid + 'c' + i + '"><circle cx="' + mp[0] + '" cy="' + mp[1] + '" r="' + R + '"/></clipPath>'; });
      for (var m2 = 1; m2 < (1 << n); m2++) {
        var ids = []; for (var i2 = 0; i2 < n; i2++) if (m2 & (1 << i2)) ids.push(i2);
        s += '<mask id="' + uid + 'm' + ids.join('') + '"><rect x="0" y="0" width="' + W + '" height="' + H + '" fill="#fff"/>' + ids.map(function (q) { return '<circle cx="' + c[q][0] + '" cy="' + c[q][1] + '" r="' + R + '" fill="#000"/>'; }).join('') + '</mask>';
      }
      s += '</defs><rect class="vennkader" x="1" y="1" width="' + (W - 2) + '" height="' + (H - 2) + '" rx="10"/>';
      gekozen.forEach(function (k2) { s += regio(k2, 'venngebied ' + (status[k2] || '')); });
      c.forEach(function (mp) { s += '<circle class="venncirkel" cx="' + mp[0] + '" cy="' + mp[1] + '" r="' + R + '"/>'; });
      namen.forEach(function (nm, i) { s += '<text class="vennlabel" x="' + lab[i][0] + '" y="' + lab[i][1] + '">' + esc(nm) + '</text>'; });
      houder.innerHTML = s + '</svg>';
      houder.querySelector('svg').addEventListener('click', function (e) {
        var svg = e.currentTarget, p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY;
        var q = p.matrixTransform(svg.getScreenCTM().inverse()), k3 = sleutel(q.x, q.y);
        if (!k3) return; var pos = gekozen.indexOf(k3); if (pos >= 0) gekozen.splice(pos, 1); else gekozen.push(k3);
        status = {}; teken();
      });
    }
    teken();
    return {
      controleer: function () {
        if (!gekozen.length) return { leeg: true };
        var j = 0; status = {};
        alle.forEach(function (k4) { var g = gekozen.indexOf(k4) >= 0, moet = v.juist.indexOf(k4) >= 0; if (g === moet) j++; if (g) status[k4] = moet ? 'juist' : 'fout'; });
        teken();
        var gemist = v.juist.filter(function (k5) { return gekozen.indexOf(k5) < 0; }).length;
        return { juist: j, totaal: alle.length, nota: gemist ? 'Er ontbreekt nog een gebied.' : '' };
      },
      oplossing: function () { gekozen = v.juist.slice(); status = {}; gekozen.forEach(function (k6) { status[k6] = 'juist'; }); teken(); }
    };
  };

  /* ---------- getallenas ---------- */
  VT.getallenas = function (root, v) {
    var min = v.min, max = v.max, stap = v.stap || 1, W = 760, L = 44, R2 = W - 44;
    var pos = v.punten.map(function () { return null; }), gekozen = 0, status = [];
    var wrap = el('div', 'getallenas');
    wrap.appendChild(el('p', 'aanwijzing', 'Kies een getal en klik daarna op de juiste plaats op de getallenas.'));
    var chips = el('div', 'chips'); wrap.appendChild(chips);
    var baan = el('div', 'asbaan'); wrap.appendChild(baan); root.appendChild(wrap);
    function xv(w) { return L + (w - min) / (max - min) * (R2 - L); }
    function teken() {
      chips.innerHTML = '';
      v.punten.forEach(function (p, i) {
        var b = el('button', 'kaart' + (i === gekozen ? ' gekozen' : '') + (pos[i] != null ? ' geplaatst' : ''), fmt(p.l)); b.type = 'button';
        b.addEventListener('click', function () { gekozen = i; teken(); }); chips.appendChild(b);
      });
      var s = '<svg viewBox="0 0 ' + W + ' 92" class="assvg" role="img" aria-label="Getallenas"><line class="as" x1="14" y1="58" x2="' + (W - 14) + '" y2="58"/><path class="as" d="M' + (W - 24) + ' 52 L' + (W - 14) + ' 58 L' + (W - 24) + ' 64"/>';
      var aantal = Math.round((max - min) / stap);
      for (var k = 0; k <= aantal; k++) {
        var w = min + k * stap, heel = Math.abs(w - Math.round(w)) < 1e-9, x = xv(w);
        s += '<line class="as" x1="' + x + '" y1="' + (heel ? 49 : 54) + '" x2="' + x + '" y2="' + (heel ? 67 : 62) + '"/>';
        if (heel && (v.toon ? v.toon.indexOf(Math.round(w)) >= 0 : true)) s += '<text class="asgetal" x="' + x + '" y="84">' + String(Math.round(w)).replace('-', '−') + '</text>';
      }
      if (v.naam) s += '<text class="asnaam" x="' + (W - 12) + '" y="40">' + esc(v.naam) + '</text>';
      s += '</svg>';
      baan.innerHTML = s;
      v.punten.forEach(function (p, i) {
        if (pos[i] == null) return;
        var m = el('div', 'asmerk ' + (status[i] || ''), '<span class="aslabel">' + fmt(p.l) + '</span><span class="asstip"></span>');
        m.style.left = (xv(pos[i]) / W * 100) + '%'; baan.appendChild(m);
      });
      baan.querySelector('svg').addEventListener('click', function (e) {
        if (gekozen < 0) return;
        var svg = e.currentTarget, pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
        var q = pt.matrixTransform(svg.getScreenCTM().inverse());
        var w = min + (q.x - L) / (R2 - L) * (max - min); w = Math.round(w / stap) * stap; w = Math.max(min, Math.min(max, w));
        pos[gekozen] = Math.round(w * 1000) / 1000; status = [];
        var volgende = pos.indexOf(null); if (volgende >= 0) gekozen = volgende;
        teken();
      });
    }
    teken();
    return {
      controleer: function () {
        if (pos.every(function (p) { return p == null; })) return { leeg: true };
        var j = 0; status = [];
        v.punten.forEach(function (p, i) { if (pos[i] == null) return; var ok = Math.abs(pos[i] - p.w) < stap / 4; if (ok) j++; status[i] = ok ? 'juist' : 'fout'; });
        teken();
        return { juist: j, totaal: v.punten.length, nota: pos.indexOf(null) >= 0 ? 'Je plaatste nog niet alle getallen.' : '' };
      },
      oplossing: function () { v.punten.forEach(function (p, i) { pos[i] = p.w; status[i] = 'juist'; }); teken(); }
    };
  };

  /* ---------- tekenvraag op het meetkundebord ---------- */
  VT.teken = function (root, v) {
    if (v.slot) root.classList.add('metslot');
    var bord = new window.Meetkunde.Bord(root, v.bord, { gereedschap: v.gereedschap || [], nieuw: v.nieuw || [] });
    var ctl = null;
    if (v.slot) { root.classList.add('metslot'); var s = el('div', 'invul slot', vulSjabloon(v.slot, v.velden)); root.appendChild(s); ctl = veldCtl(s, v.velden); }
    return {
      bord: bord,
      controleer: function () {
        var rs = bord.controleer(v.controle), j = rs.filter(function (r) { return r.ok; }).length, tot = rs.length;
        var notas = rs.filter(function (r) { return !r.ok; }).map(function (r) { return r.tekst; });
        var leeg = !bord.gewijzigd;
        if (ctl) { var r2 = ctl.controleer(); j += r2.juist; tot += r2.totaal; leeg = (tot === r2.totaal || leeg) && r2.leeg; if (r2.nota) notas.push(r2.nota); }
        return { juist: j, totaal: tot, leeg: leeg, nota: notas.join(' ') };
      },
      oplossing: function (alsEigen) { bord.toonOplossing(v.controle, alsEigen); if (ctl) ctl.oplossing(); }
    };
  };

  /* figuur bij een vraag (statisch bord of eigen svg/html) */
  function toonFiguur(houder, fig) {
    if (!fig) return;
    var d = el('div', 'figuur'); houder.appendChild(d);
    if (fig.bord) new window.Meetkunde.Bord(d, fig.bord, { leesAlleen: true });
    else d.innerHTML = fig.html || fig.svg || '';
  }

  window.Vragen = { VT: VT, fmt: fmt, esc: esc, el: el, toonFiguur: toonFiguur, G: G, T: T, B: B, K: K, A: A, algParse: algParse, algGelijk: algGelijk, algHerleid: algHerleid, algMooi: algMooi };
})();
