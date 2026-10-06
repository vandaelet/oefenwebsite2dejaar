/* Meetkundebord (SVG). Coördinaten in de configuratie zijn in cm, oorsprong linksonder. */
(function () {
  'use strict';
  var S = 40;            // pixels per cm in de viewBox
  var TP = 0.17;         // tolerantie "punt valt samen" (cm)
  var TL = 0.13;         // tolerantie "punt ligt op lijn" (cm)
  var teller = 0;

  function rad(d) { return d * Math.PI / 180; }
  function deg(r) { return r * 180 / Math.PI; }
  function afst(p, q) { return Math.hypot(p.x - q.x, p.y - q.y); }
  function richt(p, q) { return deg(Math.atan2(q.y - p.y, q.x - p.x)); }
  function hv(a, b) { var x = Math.abs(a - b) % 360; return x > 180 ? 360 - x : x; }
  function ccw(a, b) { return ((b - a) % 360 + 360) % 360; }
  function f(n) { return Math.round(n * 100) / 100; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function komma(n) { return String(n).replace('.', ','); }

  function opDomein(u, t) { return t === 'rechte' || (t === 'halfrechte' ? u >= -1e-6 : (u >= -1e-6 && u <= 1 + 1e-6)); }
  function proj(p, A, B, t) {
    var dx = B.x - A.x, dy = B.y - A.y, L2 = dx * dx + dy * dy;
    if (L2 < 1e-9) return { x: A.x, y: A.y, d: afst(p, A), u: 0 };
    var u = ((p.x - A.x) * dx + (p.y - A.y) * dy) / L2;
    if (t === 'lijnstuk' || t === 'vector') u = Math.max(0, Math.min(1, u)); else if (t === 'halfrechte') u = Math.max(0, u);
    var q = { x: A.x + u * dx, y: A.y + u * dy, u: u };
    q.d = afst(p, q); return q;
  }
  function snijLL(A, B, t1, C, D, t2) {
    var d1x = B.x - A.x, d1y = B.y - A.y, d2x = D.x - C.x, d2y = D.y - C.y;
    var den = d1x * d2y - d1y * d2x;
    if (Math.abs(den) < 1e-9) return [];
    var u = ((C.x - A.x) * d2y - (C.y - A.y) * d2x) / den;
    var v = ((C.x - A.x) * d1y - (C.y - A.y) * d1x) / den;
    if (!opDomein(u, t1) || !opDomein(v, t2)) return [];
    return [{ x: A.x + u * d1x, y: A.y + u * d1y }];
  }
  function snijLC(A, B, t, M, r) {
    var dx = B.x - A.x, dy = B.y - A.y, fx = A.x - M.x, fy = A.y - M.y;
    var a = dx * dx + dy * dy, b = 2 * (fx * dx + fy * dy), c = fx * fx + fy * fy - r * r;
    var D = b * b - 4 * a * c; if (D < 0 || a < 1e-9) return [];
    var s = Math.sqrt(D), res = [];
    [(-b - s) / (2 * a), (-b + s) / (2 * a)].forEach(function (u) { if (opDomein(u, t)) res.push({ x: A.x + u * dx, y: A.y + u * dy }); });
    return res;
  }
  function snijCC(M1, r1, M2, r2) {
    var d = afst(M1, M2);
    if (d < 1e-9 || d > r1 + r2 || d < Math.abs(r1 - r2)) return [];
    var a = (r1 * r1 - r2 * r2 + d * d) / (2 * d), h = Math.sqrt(Math.max(0, r1 * r1 - a * a));
    var px = M1.x + a * (M2.x - M1.x) / d, py = M1.y + a * (M2.y - M1.y) / d;
    var ox = h * (M2.y - M1.y) / d, oy = h * (M2.x - M1.x) / d;
    return [{ x: px + ox, y: py - oy }, { x: px - ox, y: py + oy }];
  }

  var NAAM = { kies: 'Verplaats', punt: 'Punt', lijnstuk: 'Lijnstuk', halfrechte: 'Halfrechte', rechte: 'Rechte', passer: 'Passer', gom: 'Gom' };
  var HINT = {
    kies: 'Sleep een punt of de geodriehoek. Draai de geodriehoek met het ronde handvat bovenaan.',
    punt: 'Klik op de plaats waar het punt moet komen.',
    lijnstuk: 'Klik op het eerste grenspunt en daarna op het tweede grenspunt.',
    halfrechte: 'Klik eerst op het grenspunt en daarna op een tweede punt van de halfrechte.',
    rechte: 'Klik op twee punten van de rechte.',
    passer: 'Klik op twee punten om de afstand in je passer te nemen. Klik daarna op het middelpunt van de cirkel.',
    gom: 'Klik op iets dat je zelf tekende om het te wissen.'
  };
  function ic(inhoud) { return '<svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + inhoud + '</svg>'; }
  var ICON = {
    kies: ic('<path d="M10 2v16M2 10h16M10 2l-2.5 2.5M10 2l2.5 2.5M10 18l-2.5-2.5M10 18l2.5-2.5M2 10l2.5-2.5M2 10l2.5 2.5M18 10l-2.5-2.5M18 10l-2.5 2.5"/>'),
    punt: ic('<circle cx="10" cy="10" r="3.2" fill="currentColor"/>'),
    lijnstuk: ic('<path d="M4 15L16 5"/><circle cx="4" cy="15" r="2" fill="currentColor"/><circle cx="16" cy="5" r="2" fill="currentColor"/>'),
    halfrechte: ic('<path d="M4 15L19 2.5"/><circle cx="4" cy="15" r="2" fill="currentColor"/>'),
    rechte: ic('<path d="M1 17.5L19 2.5"/><circle cx="7" cy="12.5" r="1.6" fill="currentColor"/><circle cx="13" cy="7.5" r="1.6" fill="currentColor"/>'),
    passer: ic('<path d="M10 3L5 17M10 3l5 14"/><circle cx="10" cy="3" r="1.6" fill="currentColor"/><path d="M6.5 13.5q3.5 2 7 0"/>'),
    gom: ic('<path d="M7 16l-4-4 8-8 6 6-6 6zM7 16h10M7.5 7.5l6 6"/>'),
    wis: ic('<path d="M4 6h12M8 6V4h4v2M6 6l1 11h6l1-11"/>'),
    geo: ic('<path d="M2 16h16L10 5z"/><path d="M6.5 16a3.5 3.5 0 017 0"/>')
  };

  function Bord(houder, cfg, opt) {
    var z = this; opt = opt || {}; cfg = cfg || {};
    z.cfg = cfg; z.b = cfg.b || 18; z.h = cfg.h || 10; z.lees = !!opt.leesAlleen;
    z.gereedschap = (opt.gereedschap || []).slice(); z.nieuw = (opt.nieuw || []).slice();
    z.punten = []; z.lijnen = []; z.cirkels = []; z.gewijzigd = false; z.nr = 0; z.uid = 'bord' + (++teller);
    (cfg.punten || []).forEach(function (p) {
      z.punten.push({ id: ++z.nr, n: p.n, x: p.x, y: p.y, lp: p.lp, verberg: !!p.verberg, sleep: !!p.sleep && !z.lees, baan: p.baan, f: p.f, eigen: false });
    });
    (cfg.lijnen || []).forEach(function (l) {
      z.lijnen.push({ id: ++z.nr, t: l.t, a: z.pt(l.p[0]).id, b: z.pt(l.p[1]).id, n: l.n, zij: l.zij, stippel: !!l.stippel, eigen: false });
    });
    z.heeftGeo = !z.lees && z.gereedschap.indexOf('geo') >= 0;
    z.tekenTools = z.lees ? [] : z.gereedschap.filter(function (t) { return t !== 'geo'; });
    z.heeftSleep = z.punten.some(function (p) { return p.sleep; });
    z.geo = Object.assign({ x: z.b / 2, y: 0.5, rot: 0, aan: false }, cfg.geo || {});
    z.tool = 'kies'; z.start = null; z.passer = null; z.sleepObj = null; z.voor = null;
    z.bouw(houder); z.teken(); z.kiesTool(z.tekenTools.length && !z.heeftSleep ? z.tekenTools[0] : 'kies');
  }

  Bord.prototype.pt = function (naam) { return this.punten.find(function (p) { return p.n === naam; }); };
  Bord.prototype.pid = function (id) { return this.punten.find(function (p) { return p.id === id; }); };

  Bord.prototype.bouw = function (houder) {
    var z = this, W = z.b * S, H = z.h * S, html = '';
    var wrap = document.createElement('div'); wrap.className = 'bord' + (z.lees ? ' lees' : '');
    wrap.style.setProperty('--ar', (z.b / z.h).toFixed(3));
    if (z.lees) wrap.style.setProperty('--mw', Math.min(860, Math.round(z.b * 46)) + 'px');
    if (z.tekenTools.length || z.heeftGeo) {
      html += '<div class="werkbalk" role="toolbar" aria-label="Tekengereedschap">';
      var tools = ['kies'].concat(z.tekenTools); if (z.tekenTools.length) tools.push('gom');
      tools.forEach(function (t) { html += '<button type="button" class="tool" data-tool="' + t + '" aria-pressed="false">' + ICON[t] + '<span>' + NAAM[t] + '</span></button>'; });
      if (z.tekenTools.length) html += '<button type="button" class="tool" data-actie="wis">' + ICON.wis + '<span>Wis alles</span></button>';
      if (z.heeftGeo) {
        html += '<span class="scheiding"></span><button type="button" class="tool geoknop" data-actie="geo" aria-pressed="false">' + ICON.geo + '<span>Geodriehoek</span></button>' +
          '<button type="button" class="tool klein" data-actie="links" title="Draai de geodriehoek 1 graad naar links" hidden>↺ 1°</button>' +
          '<button type="button" class="tool klein" data-actie="rechts" title="Draai de geodriehoek 1 graad naar rechts" hidden>↻ 1°</button>';
      }
      html += '</div><div class="bordhint" aria-live="polite"></div>';
    } else if (z.heeftSleep) {
      html += '<div class="bordhint">' + (z.punten.filter(function (p) { return p.sleep; }).length > 1 ? 'Sleep de oranje punten naar de juiste plaats.' : 'Sleep het oranje punt.') + '</div>';
    }
    html += '<svg class="bordsvg" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Tekenblad">' +
      '<rect class="blad" x="0" y="0" width="' + W + '" height="' + H + '"/><g class="raster"></g><g class="obj"></g><g class="geolaag" style="display:none"></g></svg>';
    wrap.innerHTML = html; houder.appendChild(wrap);
    z.wrap = wrap; z.svg = wrap.querySelector('svg.bordsvg'); z.objLaag = wrap.querySelector('.obj'); z.geoLaag = wrap.querySelector('.geolaag');
    z.hintEl = wrap.querySelector('.bordhint');
    z.bouwRaster(wrap.querySelector('.raster'));
    if (z.lees) return;
    wrap.querySelectorAll('[data-tool]').forEach(function (b) { b.addEventListener('click', function () { z.kiesTool(b.dataset.tool); }); });
    wrap.querySelectorAll('[data-actie]').forEach(function (b) {
      b.addEventListener('click', function () {
        var a = b.dataset.actie;
        if (a === 'wis') z.wisAlles();
        else if (a === 'geo') z.toonGeo(!z.geo.aan);
        else if (a === 'links') { z.geo.rot += 1; z.plaatsGeo(); }
        else if (a === 'rechts') { z.geo.rot -= 1; z.plaatsGeo(); }
      });
    });
    if (z.heeftGeo) z.bouwGeo();
    z.svg.addEventListener('pointerdown', function (e) { z.omlaag(e); });
    z.svg.addEventListener('pointermove', function (e) { z.beweeg(e); });
    z.svg.addEventListener('pointerup', function (e) { z.omhoog(e); });
    z.svg.addEventListener('pointercancel', function (e) { z.omhoog(e); });
    z.svg.addEventListener('pointerleave', function () { if (z.voor && !z.sleepObj) { z.voor = null; z.teken(); } });
  };

  /* ruitjes en assenstelsel (cfg.rooster = stapgrootte, cfg.assen = {x, y} = plaats van de oorsprong) */
  Bord.prototype.bouwRaster = function (laag) {
    var z = this, c = z.cfg, s = '', W = z.b * S, H = z.h * S, i;
    if (c.rooster) {
      for (i = 0; i <= z.b; i++) s += '<line class="rasterlijn" x1="' + i * S + '" y1="0" x2="' + i * S + '" y2="' + H + '"/>';
      for (i = 0; i <= z.h; i++) s += '<line class="rasterlijn" x1="0" y1="' + i * S + '" x2="' + W + '" y2="' + i * S + '"/>';
    }
    if (c.assen) {
      var ox = c.assen.x, oy = c.assen.y, X0 = ox * S, Y0 = (z.h - oy) * S;
      s += '<line class="aslijn" x1="0" y1="' + Y0 + '" x2="' + (W - 4) + '" y2="' + Y0 + '"/><path class="aspijl" d="M' + (W - 13) + ' ' + (Y0 - 5) + ' L' + (W - 3) + ' ' + Y0 + ' L' + (W - 13) + ' ' + (Y0 + 5) + '"/>';
      s += '<line class="aslijn" x1="' + X0 + '" y1="' + H + '" x2="' + X0 + '" y2="4"/><path class="aspijl" d="M' + (X0 - 5) + ' 13 L' + X0 + ' 3 L' + (X0 + 5) + ' 13"/>';
      s += '<text class="astekst" x="' + (W - 12) + '" y="' + (Y0 - 12) + '">x</text><text class="astekst" x="' + (X0 + 14) + '" y="14">y</text><text class="astekst" x="' + (X0 - 12) + '" y="' + (Y0 + 15) + '">O</text>';
      for (i = 1; i < z.b; i++) if (i !== ox) s += '<text class="asgetalk" x="' + i * S + '" y="' + (Y0 + 15) + '">' + String(i - ox).replace('-', '−') + '</text>';
      for (i = 1; i < z.h; i++) if (i !== oy) s += '<text class="asgetalk" x="' + (X0 - 12) + '" y="' + ((z.h - i) * S) + '">' + String(i - oy).replace('-', '−') + '</text>';
    }
    laag.innerHTML = s;
  };

  Bord.prototype.naarCm = function (e) {
    var p = this.svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY;
    var q = p.matrixTransform(this.svg.getScreenCTM().inverse());
    return { x: q.x / S, y: this.h - q.y / S };
  };

  Bord.prototype.kiesTool = function (t) {
    var z = this; z.tool = t; z.start = null; z.passer = null; z.voor = null;
    if (z.wrap) {
      z.wrap.querySelectorAll('[data-tool]').forEach(function (b) { var aan = b.dataset.tool === t; b.classList.toggle('actief', aan); b.setAttribute('aria-pressed', aan); });
      z.svg.classList.toggle('tekenmodus', t !== 'kies');
    }
    z.zetHint(); z.teken();
  };

  Bord.prototype.zetHint = function (tekst) {
    var z = this; if (!z.hintEl || (!z.tekenTools.length && !z.heeftGeo)) return;
    var h = tekst || HINT[z.tool] || '';
    if (!tekst && z.tool !== 'kies' && z.tool !== 'gom') { var l = z.volgendLabel(); if (l) h += ' Een nieuw punt krijgt de naam ' + l + '.'; }
    z.hintEl.textContent = h;
  };

  Bord.prototype.volgendLabel = function () {
    var z = this;
    for (var i = 0; i < z.nieuw.length; i++) if (!z.pt(z.nieuw[i])) return z.nieuw[i];
    return '';
  };

  Bord.prototype.voegPunt = function (x, y) {
    var z = this, p = { id: ++z.nr, n: z.volgendLabel(), x: x, y: y, eigen: true };
    z.punten.push(p); z.gewijzigd = true; return p;
  };

  /* dichtstbijzijnde zinvolle plaats: bestaand punt, snijpunt, punt op een lijn */
  Bord.prototype.snap = function (p, zonderId) {
    var z = this, beste = null, bd = 0.3;
    z.punten.forEach(function (q) { if (q.verberg || q.opl || q.id === zonderId) return; var d = afst(p, q); if (d < bd) { bd = d; beste = q; } });
    if (beste) return { x: beste.x, y: beste.y, punt: beste };
    var krommen = [];
    z.lijnen.forEach(function (l) { if (l.opl || l.a === zonderId || l.b === zonderId) return; krommen.push({ k: 'l', A: z.pid(l.a), B: z.pid(l.b), t: l.t }); });
    z.cirkels.forEach(function (c) { if (c.m === zonderId) return; krommen.push({ k: 'c', M: z.pid(c.m), r: c.r }); });
    var bp = null; bd = 0.28;
    for (var i = 0; i < krommen.length; i++) for (var j = i + 1; j < krommen.length; j++) {
      var a = krommen[i], b = krommen[j], pts;
      if (a.k === 'l' && b.k === 'l') pts = snijLL(a.A, a.B, a.t, b.A, b.B, b.t);
      else if (a.k === 'l') pts = snijLC(a.A, a.B, a.t, b.M, b.r);
      else if (b.k === 'l') pts = snijLC(b.A, b.B, b.t, a.M, a.r);
      else pts = snijCC(a.M, a.r, b.M, b.r);
      pts.forEach(function (q) { var d = afst(p, q); if (d < bd) { bd = d; bp = q; } });
    }
    if (bp) return { x: bp.x, y: bp.y };
    if (z.cfg.rooster) {
      var st = z.cfg.rooster, gx = Math.round(p.x / st) * st, gy = Math.round(p.y / st) * st;
      if (Math.hypot(gx - p.x, gy - p.y) < 0.36) return { x: gx, y: gy };
    }
    bd = 0.2;
    krommen.forEach(function (k) {
      var q;
      if (k.k === 'l') q = proj(p, k.A, k.B, k.t);
      else { var d = afst(p, k.M); if (d < 1e-6) return; q = { x: k.M.x + (p.x - k.M.x) * k.r / d, y: k.M.y + (p.y - k.M.y) * k.r / d, d: Math.abs(d - k.r) }; }
      if (q.d < bd) { bd = q.d; bp = q; }
    });
    if (bp) return { x: bp.x, y: bp.y };
    return { x: p.x, y: p.y };
  };

  Bord.prototype.kiesPunt = function (p) {
    var q = this.snap(p);
    return q.punt ? q.punt : this.voegPunt(q.x, q.y);
  };

  Bord.prototype.geoLokaal = function (p) {
    var g = this.geo, dx = p.x - g.x, dy = p.y - g.y, c = Math.cos(rad(g.rot)), s = Math.sin(rad(g.rot));
    return { u: dx * c + dy * s, w: -dx * s + dy * c };
  };

  Bord.prototype.omlaag = function (e) {
    var z = this, p = z.naarCm(e);
    if (z.tool === 'kies') {
      var doel = null, bd = 0.5;
      z.punten.forEach(function (q) { if (q.verberg || q.opl || !(q.sleep || q.eigen)) return; var d = afst(p, q); if (d < bd) { bd = d; doel = q; } });
      if (doel) z.sleepObj = { soort: 'punt', p: doel };
      else if (z.geo.aan) {
        var l = z.geoLokaal(p);
        if (Math.hypot(l.u, l.w - 6.9) < 0.6) z.sleepObj = { soort: 'draai' };
        else if (l.w >= -0.25 && l.w <= 8.2 - Math.abs(l.u)) z.sleepObj = { soort: 'geo', dx: p.x - z.geo.x, dy: p.y - z.geo.y };
      }
      if (z.sleepObj) { try { z.svg.setPointerCapture(e.pointerId); } catch (x) { /* niet erg */ } e.preventDefault(); }
      return;
    }
    e.preventDefault();
    if (z.tool === 'punt') {
      var q = z.snap(p);
      if (!q.punt) z.voegPunt(q.x, q.y);
    } else if (z.tool === 'lijnstuk' || z.tool === 'halfrechte' || z.tool === 'rechte') {
      var pt = z.kiesPunt(p);
      if (z.start == null) z.start = pt.id;
      else if (pt.id !== z.start) { z.lijnen.push({ id: ++z.nr, t: z.tool, a: z.start, b: pt.id, eigen: true }); z.start = null; z.voor = null; z.gewijzigd = true; }
    } else if (z.tool === 'passer') {
      var pp = z.kiesPunt(p);
      if (!z.passer) z.passer = [pp.id];
      else if (z.passer.length === 1) {
        if (pp.id !== z.passer[0]) { z.passer.push(pp.id); z.zetHint('De afstand zit in je passer. Klik nu op het middelpunt van de cirkel.'); z.teken(); return; }
      } else {
        var r = afst(z.pid(z.passer[0]), z.pid(z.passer[1]));
        z.cirkels.push({ id: ++z.nr, m: pp.id, r: r, eigen: true }); z.passer = null; z.voor = null; z.gewijzigd = true;
      }
    } else if (z.tool === 'gom') {
      z.gom(p);
    }
    z.zetHint(); z.teken();
  };

  Bord.prototype.beweeg = function (e) {
    var z = this, p = z.naarCm(e), s = z.sleepObj;
    if (s) {
      if (s.soort === 'punt') {
        var q = s.p, x = Math.max(0.2, Math.min(z.b - 0.2, p.x)), y = Math.max(0.2, Math.min(z.h - 0.2, p.y));
        if (q.baan) {
          var M = z.pt(q.baan.m), d = afst(M, { x: x, y: y }) || 1;
          x = M.x + (x - M.x) * q.baan.r / d; y = M.y + (y - M.y) * q.baan.r / d;
        } else if (q.eigen) { var sn = z.snap({ x: x, y: y }, q.id); if (!sn.punt) { x = sn.x; y = sn.y; } }
        else if (z.cfg.rooster) { var stp = z.cfg.rooster; x = Math.round(x / stp) * stp; y = Math.round(y / stp) * stp; }
        q.x = x; q.y = y; z.gewijzigd = true; z.teken();
      } else if (s.soort === 'geo') {
        var nx = p.x - s.dx, ny = p.y - s.dy, best = null, bd = 0.3;
        z.punten.forEach(function (k) { if (k.verberg) return; var dd = afst(k, { x: nx, y: ny }); if (dd < bd) { bd = dd; best = k; } });
        if (best) { nx = best.x; ny = best.y; }
        z.geo.x = nx; z.geo.y = ny; z.plaatsGeo();
      } else if (s.soort === 'draai') {
        var rot = richt(z.geo, p) - 90, kandidaten = [];
        z.punten.forEach(function (k) { if (!k.verberg && afst(k, z.geo) > 0.5) kandidaten.push(richt(z.geo, k)); });
        z.lijnen.forEach(function (l) {
          if (l.opl) return; var A = z.pid(l.a), B = z.pid(l.b);
          if (afst(A, B) > 0.3 && proj(z.geo, A, B, 'rechte').d < 0.12) kandidaten.push(richt(A, B));
        });
        kandidaten.forEach(function (a) { if (hv(rot, a) < 1.5) rot = a; else if (hv(rot, a + 180) < 1.5) rot = a + 180; });
        z.geo.rot = rot; z.plaatsGeo();
      }
      return;
    }
    if (z.start != null || (z.passer && z.passer.length === 2)) { z.voor = z.snap(p); z.teken(); }
  };

  Bord.prototype.omhoog = function () { this.sleepObj = null; };

  Bord.prototype.gom = function (p) {
    var z = this, doel = null, bd = 0.3;
    z.punten.forEach(function (q) { if (!q.eigen || q.opl) return; var d = afst(p, q); if (d < bd) { bd = d; doel = { soort: 'p', o: q }; } });
    if (!doel) {
      bd = 0.25;
      z.lijnen.forEach(function (l) { if (!l.eigen || l.opl) return; var d = proj(p, z.pid(l.a), z.pid(l.b), l.t).d; if (d < bd) { bd = d; doel = { soort: 'l', o: l }; } });
      z.cirkels.forEach(function (c) { if (!c.eigen) return; var d = Math.abs(afst(p, z.pid(c.m)) - c.r); if (d < bd) { bd = d; doel = { soort: 'c', o: c }; } });
    }
    if (!doel) return;
    if (doel.soort === 'p') {
      var id = doel.o.id;
      z.lijnen = z.lijnen.filter(function (l) { return l.a !== id && l.b !== id; });
      z.cirkels = z.cirkels.filter(function (c) { return c.m !== id; });
      z.punten = z.punten.filter(function (q) { return q.id !== id; });
    } else if (doel.soort === 'l') z.lijnen = z.lijnen.filter(function (l) { return l !== doel.o; });
    else z.cirkels = z.cirkels.filter(function (c) { return c !== doel.o; });
  };

  Bord.prototype.wisAlles = function () {
    var z = this;
    z.lijnen = z.lijnen.filter(function (l) { return !l.eigen; });
    z.cirkels = z.cirkels.filter(function (c) { return !c.eigen; });
    z.punten = z.punten.filter(function (p) { return !p.eigen; });
    z.start = null; z.passer = null; z.voor = null; z.zetHint(); z.teken();
  };

  /* ---------- geodriehoek ---------- */
  Bord.prototype.bouwGeo = function () {
    var s = '', R = 5.6 * S, d, c, sn, len, i, x;
    s += '<path class="geo-vorm" d="M' + (-8 * S) + ' 0 L' + (8 * S) + ' 0 L0 ' + (-8 * S) + ' Z"/>';
    s += '<path class="geo-band" d="M' + (-4.15 * S) + ' 0 A' + (4.15 * S) + ' ' + (4.15 * S) + ' 0 0 1 ' + (4.15 * S) + ' 0"/>';
    for (d = 0; d <= 180; d++) {
      c = Math.cos(rad(d)); sn = Math.sin(rad(d));
      len = d % 10 === 0 ? 0.44 : d % 5 === 0 ? 0.32 : 0.2;
      s += '<line class="geo-streep' + (d % 10 === 0 ? ' dik' : '') + '" x1="' + f(c * R) + '" y1="' + f(-sn * R) + '" x2="' + f(c * (R - len * S)) + '" y2="' + f(-sn * (R - len * S)) + '"/>';
      if (d % 10 === 0 && d > 0 && d < 180) {
        s += '<text class="geo-getal" transform="translate(' + f(c * (R - 0.78 * S)) + ' ' + f(-sn * (R - 0.78 * S)) + ') rotate(' + (90 - d) + ')">' + d + '</text>';
        if (d > 10 && d < 170) s += '<text class="geo-getal binnen" transform="translate(' + f(c * (R - 1.45 * S)) + ' ' + f(-sn * (R - 1.45 * S)) + ') rotate(' + (90 - d) + ')">' + (180 - d) + '</text>';
      }
    }
    s += '<line class="geo-hulplijn" x1="0" y1="0" x2="0" y2="' + (-R) + '"/>';
    for (i = -70; i <= 70; i++) {
      x = i / 10 * S; len = i % 10 === 0 ? 0.32 : i % 5 === 0 ? 0.22 : 0.13;
      s += '<line class="geo-streep" x1="' + f(x) + '" y1="0" x2="' + f(x) + '" y2="' + f(-len * S) + '"/>';
      if (i % 10 === 0) s += '<text class="geo-getal cm" x="' + f(x) + '" y="' + f(-0.6 * S) + '">' + Math.abs(i / 10) + '</text>';
    }
    s += '<g class="geo-handvat"><circle cx="0" cy="' + (-6.9 * S) + '" r="14"/><path d="M-6 ' + (-6.9 * S - 1) + ' a6 6 0 1 1 3 5.2 M-6 ' + (-6.9 * S - 1) + ' l-3 -3 M-6 ' + (-6.9 * S - 1) + ' l4 -1.5"/></g>';
    s += '<circle class="geo-nul" cx="0" cy="0" r="3.2"/>';
    this.geoLaag.innerHTML = s; this.plaatsGeo();
  };
  Bord.prototype.plaatsGeo = function () {
    var g = this.geo;
    this.geoLaag.setAttribute('transform', 'translate(' + f(g.x * S) + ' ' + f((this.h - g.y) * S) + ') rotate(' + f(-g.rot) + ')');
  };
  Bord.prototype.toonGeo = function (aan) {
    var z = this; z.geo.aan = aan; z.geoLaag.style.display = aan ? '' : 'none';
    var k = z.wrap.querySelector('[data-actie="geo"]'); k.classList.toggle('actief', aan); k.setAttribute('aria-pressed', aan);
    z.wrap.querySelectorAll('[data-actie="links"],[data-actie="rechts"]').forEach(function (b) { b.hidden = !aan; });
    if (aan) z.kiesTool('kies');
  };

  /* ---------- tekenen ---------- */
  Bord.prototype.teken = function () {
    var z = this, s = '';
    function X(x) { return f(x * S); } function Y(y) { return f((z.h - y) * S); }
    var haal = function (n) { return z.pt(n); };
    z.punten.forEach(function (p) { if (p.f) { var r0 = p.f(haal); p.x = r0.x; p.y = r0.y; } });
    (z.cfg.veelhoeken || []).forEach(function (v) {
      var pts = v.p.map(haal); if (pts.some(function (q) { return !q; })) return;
      s += '<polygon class="veelhoek ' + (v.kl || 'blauw') + (v.stippel ? ' stippel' : '') + '" points="' + pts.map(function (q) { return X(q.x) + ',' + Y(q.y); }).join(' ') + '"/>';
    });
    (z.cfg.hoeken || []).forEach(function (k) {
      var H = z.pt(k.h), A = z.pt(k.van), B = z.pt(k.naar); if (!H || !A || !B) return;
      var a1 = richt(H, A), d = ccw(a1, richt(H, B)), r = k.r || 0.9;
      var u1 = { x: Math.cos(rad(a1)), y: Math.sin(rad(a1)) }, u2 = { x: Math.cos(rad(a1 + d)), y: Math.sin(rad(a1 + d)) };
      if (k.recht) {
        var q = 0.38;
        s += '<path class="hoekboog" d="M' + X(H.x + u1.x * q) + ' ' + Y(H.y + u1.y * q) + ' L' + X(H.x + (u1.x + u2.x) * q) + ' ' + Y(H.y + (u1.y + u2.y) * q) + ' L' + X(H.x + u2.x * q) + ' ' + Y(H.y + u2.y * q) + '"/>';
      } else if (d > 0.5 && d < 359.5) {
        s += '<path class="hoekboog" d="M' + X(H.x + u1.x * r) + ' ' + Y(H.y + u1.y * r) + ' A' + f(r * S) + ' ' + f(r * S) + ' 0 ' + (d > 180 ? 1 : 0) + ' 0 ' + X(H.x + u2.x * r) + ' ' + Y(H.y + u2.y * r) + '"/>';
      }
      var lab = k.n || ''; if (k.waarde) lab += (lab ? ' = ' : '') + Math.round(d) + '°';
      if (lab) {
        var m = rad(a1 + d / 2), lr = k.lr != null ? k.lr : r + 0.4 + (lab.length > 3 ? 0.45 : 0);
        s += '<text class="hoeklabel" x="' + X(H.x + lr * Math.cos(m)) + '" y="' + Y(H.y + lr * Math.sin(m)) + '">' + esc(lab) + '</text>';
      }
    });
    z.lijnen.forEach(function (l) {
      var A = z.pid(l.a), B = z.pid(l.b); if (!A || !B) return;
      var dx = B.x - A.x, dy = B.y - A.y, L = Math.hypot(dx, dy); if (L < 1e-6) return;
      var ux = dx / L, uy = dy / L, ver = 60, p = A, q = B;
      if (l.t === 'rechte') { p = { x: A.x - ux * ver, y: A.y - uy * ver }; q = { x: A.x + ux * ver, y: A.y + uy * ver }; }
      else if (l.t === 'halfrechte') q = { x: A.x + ux * ver, y: A.y + uy * ver };
      s += '<line class="lijn ' + (l.opl ? 'opl' : l.eigen ? 'eigen' : 'gegeven') + (l.stippel ? ' stippel' : '') + (l.t === 'vector' ? ' vector' : '') + '" x1="' + X(p.x) + '" y1="' + Y(p.y) + '" x2="' + X(q.x) + '" y2="' + Y(q.y) + '"/>';
      if (l.t === 'vector') {
        var pl = 0.42, pb = 0.17;
        s += '<path class="pijlpunt" d="M' + X(B.x) + ' ' + Y(B.y) + ' L' + X(B.x - ux * pl - uy * pb) + ' ' + Y(B.y - uy * pl + ux * pb) + ' L' + X(B.x - ux * pl + uy * pb) + ' ' + Y(B.y - uy * pl - ux * pb) + ' Z"/>';
      }
      if (l.n) {
        var t = L / 2, zij = l.zij || 1;
        if (l.t !== 'lijnstuk' && l.t !== 'vector') {
          var tx = ux > 1e-6 ? (z.b - 0.5 - A.x) / ux : ux < -1e-6 ? (0.5 - A.x) / ux : 1e9;
          var ty = uy > 1e-6 ? (z.h - 0.5 - A.y) / uy : uy < -1e-6 ? (0.5 - A.y) / uy : 1e9;
          t = Math.max(L + 0.4, Math.min(tx, ty) - 0.25);
        }
        s += '<text class="lijnlabel" x="' + X(A.x + ux * t - uy * 0.32 * zij) + '" y="' + Y(A.y + uy * t + ux * 0.32 * zij) + '">' + esc(l.n) + '</text>';
      }
    });
    z.cirkels.forEach(function (c) { var M = z.pid(c.m); if (M) s += '<circle class="cirkel" cx="' + X(M.x) + '" cy="' + Y(M.y) + '" r="' + f(c.r * S) + '"/>'; });
    if (z.start != null && z.voor) { var A0 = z.pid(z.start); s += '<line class="lijn voorbeeld" x1="' + X(A0.x) + '" y1="' + Y(A0.y) + '" x2="' + X(z.voor.x) + '" y2="' + Y(z.voor.y) + '"/>'; }
    if (z.passer && z.passer.length === 2 && z.voor) { s += '<circle class="cirkel voorbeeld" cx="' + X(z.voor.x) + '" cy="' + Y(z.voor.y) + '" r="' + f(afst(z.pid(z.passer[0]), z.pid(z.passer[1])) * S) + '"/>'; }
    z.punten.forEach(function (p) {
      if (p.verberg) return;
      var cls = 'punt ' + (p.opl ? 'opl' : p.eigen ? 'eigen' : p.sleep ? 'sleep' : p.f ? 'beeld' : 'gegeven');
      if (z.start === p.id || (z.passer && z.passer.indexOf(p.id) >= 0)) cls += ' actief';
      s += '<circle class="' + cls + '" cx="' + X(p.x) + '" cy="' + Y(p.y) + '" r="' + (p.sleep ? 9 : 4.6) + '"/>';
      if (p.n) { var lp = p.lp || [0.3, 0.36]; s += '<text class="puntlabel' + (p.eigen ? ' eigen' : p.opl ? ' opl' : '') + '" x="' + X(p.x + lp[0]) + '" y="' + Y(p.y + lp[1]) + '">' + esc(p.n) + '</text>'; }
    });
    (z.cfg.tekst || []).forEach(function (t) { s += '<text class="bordtekst" x="' + X(t.x) + '" y="' + Y(t.y) + '">' + esc(t.t) + '</text>'; });
    z.objLaag.innerHTML = s;
  };

  /* ---------- controleren ---------- */
  Bord.prototype.richtingenVanaf = function (H) {
    var z = this, r = [];
    z.lijnen.forEach(function (l) {
      if (!l.eigen || l.opl) return; var A = z.pid(l.a), B = z.pid(l.b); if (afst(A, B) < 0.3) return;
      if (l.t === 'halfrechte') { if (afst(A, H) < TP) r.push({ d: richt(A, B), l: l }); }
      else if (l.t === 'lijnstuk') { if (afst(A, H) < TP) r.push({ d: richt(A, B), l: l }); else if (afst(B, H) < TP) r.push({ d: richt(B, A), l: l }); }
      else if (proj(H, A, B, 'rechte').d < TL) { var d = richt(A, B); r.push({ d: d, l: l }); r.push({ d: d + 180, l: l }); }
    });
    return r;
  };
  function notatie(t, a, b) { return t === 'rechte' ? a + b : t === 'halfrechte' ? '[' + a + b : '[' + a + b + ']'; }

  Bord.prototype.check = function (c) {
    var z = this, eigenL = z.lijnen.filter(function (l) { return l.eigen && !l.opl; });
    var eigenP = z.punten.filter(function (p) { return p.eigen && !p.opl; });
    var P, Q, ok = false, tekst = '', tol;
    switch (c.c) {
      case 'lijn':
        P = z.pt(c.door[0]); Q = z.pt(c.door[1]);
        ok = !!P && !!Q && eigenL.some(function (l) {
          if (l.t !== c.t) return false; var A = z.pid(l.a), B = z.pid(l.b);
          if (c.t === 'lijnstuk') return (afst(A, P) < TP && afst(B, Q) < TP) || (afst(A, Q) < TP && afst(B, P) < TP);
          if (c.t === 'halfrechte') return afst(A, P) < TP && proj(Q, A, B, 'halfrechte').d < TL && proj(Q, A, B, 'rechte').u > 0;
          return proj(P, A, B, 'rechte').d < TL && proj(Q, A, B, 'rechte').d < TL;
        });
        tekst = 'De ' + c.t + ' ' + notatie(c.t, c.door[0], c.door[1]) + ' ontbreekt of is niet juist getekend.';
        break;
      case 'punt':
        ok = eigenP.some(function (p) {
          if (c.n && p.n !== c.n) return false;
          if (c.niet && c.niet.some(function (n) { var q = z.pt(n); return q && afst(p, q) < 0.3; })) return false;
          if (c.op) { if (proj(p, z.pt(c.op[0]), z.pt(c.op[1]), c.soort || 'rechte').d > TL) return false; }
          if (c.bij && afst(p, { x: c.bij[0], y: c.bij[1] }) > (c.tol || 0.18)) return false;
          if (c.midden) { var A = z.pt(c.midden[0]), B = z.pt(c.midden[1]); if (afst(p, { x: (A.x + B.x) / 2, y: (A.y + B.y) / 2 }) > 0.15) return false; }
          if (c.snijpunt) { var sp = snijLL(z.pt(c.snijpunt[0][0]), z.pt(c.snijpunt[0][1]), 'rechte', z.pt(c.snijpunt[1][0]), z.pt(c.snijpunt[1][1]), 'rechte'); if (!sp.length || afst(p, sp[0]) > 0.18) return false; }
          return true;
        });
        tekst = 'Het punt ' + (c.n || '') + ' ontbreekt of ligt niet op de juiste plaats.';
        break;
      case 'hoek':
        P = z.pt(c.h); Q = z.pt(c.van); tol = c.tol || 2;
        var doel = c.graden <= 180 ? c.graden : 360 - c.graden, basis = richt(P, Q);
        ok = z.richtingenVanaf(P).some(function (r) { return Math.abs(hv(basis, r.d) - doel) <= tol; });
        tekst = 'Er is nog geen been getekend dat vanuit ' + c.h + ' een hoek van ' + c.graden + '° vormt (je mag ' + tol + '° afwijken).';
        break;
      case 'bissectrice':
        P = z.pt(c.h); tol = c.tol || 2;
        var a1 = richt(P, z.pt(c.p1)), bis = a1 + ccw(a1, richt(P, z.pt(c.p2))) / 2;
        ok = z.richtingenVanaf(P).some(function (r) { return hv(bis, r.d) <= tol || (r.l.t === 'rechte' && hv(bis + 180, r.d) <= tol); });
        tekst = 'De bissectrice ontbreekt of verdeelt de hoek niet in twee even grote hoeken.';
        break;
      case 'lengte': case 'lengteGelijk':
        var cm = c.c === 'lengte' ? c.cm : afst(z.pt(c.als[0]), z.pt(c.als[1])); tol = c.tol || 0.15;
        P = c.van ? z.pt(c.van) : null;
        ok = eigenL.some(function (l) {
          if (l.t !== 'lijnstuk') return false; var A = z.pid(l.a), B = z.pid(l.b);
          if (P && afst(A, P) > TP && afst(B, P) > TP) return false;
          if (c.nietZelf && ((afst(A, z.pt(c.als[0])) < TP && afst(B, z.pt(c.als[1])) < TP) || (afst(B, z.pt(c.als[0])) < TP && afst(A, z.pt(c.als[1])) < TP))) return false;
          return Math.abs(afst(A, B) - cm) <= tol;
        });
        tekst = c.c === 'lengte' ? 'Er is nog geen lijnstuk van ' + komma(c.cm) + ' cm getekend' + (c.van ? ' vanuit ' + c.van : '') + '.'
          : 'Er is nog geen lijnstuk' + (c.van ? ' vanuit ' + c.van : '') + ' getekend dat even lang is als [' + c.als[0] + c.als[1] + '].';
        break;
      case 'rechtenDoor':
        P = z.pt(c.p); var rs = [];
        eigenL.forEach(function (l) {
          if (l.t !== 'rechte') return; var A = z.pid(l.a), B = z.pid(l.b);
          if (proj(P, A, B, 'rechte').d > TL) return; var d = ((richt(A, B) % 180) + 180) % 180;
          if (!rs.some(function (x) { var v = Math.abs(x - d); return Math.min(v, 180 - v) < 4; })) rs.push(d);
        });
        ok = rs.length >= c.min;
        tekst = 'Er gaan nog geen ' + c.min + ' verschillende rechten door ' + c.p + ' (nu: ' + rs.length + ').';
        break;
      case 'hoekGrootte':
        P = z.pt(c.h); var g = Math.round(ccw(richt(P, z.pt(c.van)), richt(P, z.pt(c.naar))));
        ok = g >= c.min && g <= c.max;
        tekst = c.fout || 'De hoek heeft nog niet de gevraagde grootte.';
        break;
      case 'tegengesteld':
        P = z.pt(c.h);
        ok = z.richtingenVanaf(P).some(function (r) { return c.van.some(function (n) { return hv(richt(P, z.pt(n)) + 180, r.d) <= (c.tol || 2); }); });
        tekst = 'Er is nog geen been getekend dat in het verlengde van een been van de hoek ligt.';
        break;
      case 'positie':
        P = z.pt(c.n);
        if (c.lijn) ok = !!P && proj(P, { x: c.lijn[0][0], y: c.lijn[0][1] }, { x: c.lijn[1][0], y: c.lijn[1][1] }, 'rechte').d < TL && afst(P, { x: c.lijn[0][0], y: c.lijn[0][1] }) > 0.4;
        else ok = !!P && afst(P, { x: c.x, y: c.y }) <= (c.tol || 0.15);
        tekst = 'Het punt ' + c.n + ' staat nog niet op de juiste plaats.';
        break;
      case 'as':
        P = { x: c.xy[0][0], y: c.xy[0][1] }; Q = { x: c.xy[1][0], y: c.xy[1][1] };
        ok = eigenL.some(function (l) { var A = z.pid(l.a), B = z.pid(l.b); return l.t === 'rechte' && afst(A, B) > 0.3 && proj(P, A, B, 'rechte').d < TL && proj(Q, A, B, 'rechte').d < TL; });
        tekst = 'Er ontbreekt nog een rechte of een rechte ligt niet juist.';
        break;
      case 'aantalRechten':
        var uniek = [];
        eigenL.forEach(function (l) {
          if (l.t !== 'rechte') return; var A = z.pid(l.a), B = z.pid(l.b); if (afst(A, B) < 0.3) return;
          if (!uniek.some(function (u) { return proj(A, u[0], u[1], 'rechte').d < TL && proj(B, u[0], u[1], 'rechte').d < TL; })) uniek.push([A, B]);
        });
        ok = uniek.length === c.n;
        tekst = uniek.length > c.n ? 'Je tekende te veel rechten. Wis wat er niet bij hoort.' : 'Je tekende nog niet alle rechten.';
        break;
      default: tekst = 'Onbekende controle.';
    }
    return { ok: ok, tekst: c.fout || tekst };
  };

  Bord.prototype.controleer = function (lijst) { var z = this; return (lijst || []).map(function (c) { return z.check(c); }); };

  /* ---------- oplossing tonen ---------- */
  Bord.prototype.toonOplossing = function (lijst, alsEigen) {
    var z = this;
    z.lijnen = z.lijnen.filter(function (l) { return !l.opl; }); z.punten = z.punten.filter(function (p) { return !p.opl; });
    function punt(x, y, n) { var p = { id: ++z.nr, n: n || '', x: x, y: y, eigen: !!alsEigen, opl: !alsEigen, verberg: !n && !alsEigen }; z.punten.push(p); return p; }
    function lijn(t, a, b) { z.lijnen.push({ id: ++z.nr, t: t, a: a.id, b: b.id, eigen: !!alsEigen, opl: !alsEigen }); }
    function straal(H, graden, t) { var p = punt(H.x + 3 * Math.cos(rad(graden)), H.y + 3 * Math.sin(rad(graden))); lijn(t || 'halfrechte', H, p); }
    (lijst || []).forEach(function (c) {
      var P, Q, a;
      switch (c.c) {
        case 'lijn': lijn(c.t, z.pt(c.door[0]), z.pt(c.door[1])); break;
        case 'punt':
          if (c.midden) { P = z.pt(c.midden[0]); Q = z.pt(c.midden[1]); punt((P.x + Q.x) / 2, (P.y + Q.y) / 2, c.n); }
          else if (c.snijpunt) { var sp = snijLL(z.pt(c.snijpunt[0][0]), z.pt(c.snijpunt[0][1]), 'rechte', z.pt(c.snijpunt[1][0]), z.pt(c.snijpunt[1][1]), 'rechte')[0]; if (sp) punt(sp.x, sp.y, c.n); }
          else if (c.bij) punt(c.bij[0], c.bij[1], c.n);
          else if (c.op) { P = z.pt(c.op[0]); Q = z.pt(c.op[1]); var k = c.opl != null ? c.opl : 0.4; punt(P.x + (Q.x - P.x) * k, P.y + (Q.y - P.y) * k, c.n); }
          break;
        case 'hoek': P = z.pt(c.h); straal(P, richt(P, z.pt(c.van)) + (c.wijzers ? -c.graden : c.graden)); break;
        case 'bissectrice': P = z.pt(c.h); a = richt(P, z.pt(c.p1)); straal(P, a + ccw(a, richt(P, z.pt(c.p2))) / 2, 'rechte'); break;
        case 'lengte': case 'lengteGelijk':
          if (c.van) { P = z.pt(c.van); var cm = c.c === 'lengte' ? c.cm : afst(z.pt(c.als[0]), z.pt(c.als[1])); a = c.oplHoek || 0; lijn('lijnstuk', P, punt(P.x + cm * Math.cos(rad(a)), P.y + cm * Math.sin(rad(a)), z.volgendLabel())); }
          break;
        case 'rechtenDoor': P = z.pt(c.p); for (var i = 0; i < c.min; i++) straal(P, 15 + i * 180 / c.min, 'rechte'); break;
        case 'hoekGrootte':
          P = z.pt(c.h); Q = z.pt(c.naar); a = richt(P, z.pt(c.van)) + (c.min + c.max) / 2; var r = afst(P, Q);
          Q.x = P.x + r * Math.cos(rad(a)); Q.y = P.y + r * Math.sin(rad(a)); z.gewijzigd = true; break;
        case 'tegengesteld': P = z.pt(c.h); straal(P, richt(P, z.pt(c.van[0])) + 180); break;
        case 'positie':
          P = z.pt(c.n);
          if (P) { if (c.lijn) { P.x = c.lijn[1][0]; P.y = c.lijn[1][1]; } else { P.x = c.x; P.y = c.y; } z.gewijzigd = true; }
          break;
        case 'as': lijn('rechte', punt(c.xy[0][0], c.xy[0][1]), punt(c.xy[1][0], c.xy[1][1])); break;
      }
    });
    if (alsEigen) z.gewijzigd = true;
    z.teken();
  };

  window.Meetkunde = { Bord: Bord };
})();
