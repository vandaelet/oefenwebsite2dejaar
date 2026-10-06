/* TWEEDE JAAR - MODULE 1 - Transformaties van het vlak en symmetrie (Nando 2, meetkunde) */
(function () {
  'use strict';
  var V = window.Vragen, G = V.G, K = V.K;
  var OX = 8, OY = 5;                 // plaats van de oorsprong op een bord van 16 bij 10
  function rijen(a) { return '<div class="rijen">' + a.map(function (x) { return '<div>' + x + '</div>'; }).join('') + '</div>'; }
  function vec(t) { return '<span class="vec">' + t + '</span>'; }
  var H = { verberg: true };
  function r3(n) { return Math.round(n * 1000) / 1000; }

  /* bord met assenstelsel: coördinaten ten opzichte van de oorsprong O */
  function asP(n, x, y, extra) { return Object.assign({ n: n, x: x + OX, y: y + OY }, extra || {}); }
  function assenbord(extra) { return Object.assign({ b: 16, h: 10, rooster: 1, assen: { x: OX, y: OY } }, extra); }

  /* sleepvraag: het beeld van een veelhoek op de juiste plaats zetten */
  function sleepVraag(o) {
    var punten = o.origineel.map(function (p) { return { n: p[0], x: p[1], y: p[2], lp: p[3] }; })
      .concat(o.beeld.map(function (p, i) { return { n: p[0], x: o.start[i][0], y: o.start[i][1], sleep: true, lp: [0.35, 0.42] }; }))
      .concat(o.punten || []);
    return {
      id: o.id, titel: o.titel, type: 'teken', hulp: o.hulp, vraag: o.vraag, tip: o.tip, uitleg: o.uitleg,
      bord: {
        b: 16, h: 10, rooster: 1, punten: punten, lijnen: o.lijnen || [],
        veelhoeken: [{ p: o.origineel.map(function (p) { return p[0]; }), kl: 'blauw' }, { p: o.beeld.map(function (p) { return p[0]; }), kl: 'oranje' }]
      },
      controle: o.beeld.map(function (p) { return { c: 'positie', n: p[0], x: p[1], y: p[2] }; })
    };
  }

  /* herkenfiguur: driehoek F en drie beelden */
  function herkenBord(beelden) {
    var F = [[1, 1], [4, 1], [1, 3]], punten = [], veel = [], tekst = [{ x: OX + 1.9, y: OY + 1.6, t: 'F' }];
    F.forEach(function (p, i) { punten.push(asP('f' + i, p[0], p[1], H)); });
    veel.push({ p: ['f0', 'f1', 'f2'], kl: 'blauw' });
    beelden.forEach(function (fn, k) {
      var namen = [], sx = 0, sy = 0;
      F.forEach(function (p, i) { var q = fn(p[0], p[1]); punten.push(asP('b' + k + i, q[0], q[1], H)); namen.push('b' + k + i); sx += q[0]; sy += q[1]; });
      veel.push({ p: namen, kl: 'oranje' }); tekst.push({ x: OX + sx / 3, y: OY + sy / 3, t: String(k + 1) });
    });
    return assenbord({ punten: punten, veelhoeken: veel, tekst: tekst });
  }

  var HERKEN1 = ['een spiegeling om de x-as', 'een spiegeling om de y-as', 'een spiegeling om het punt O', 'een translatie over een vector'];
  var HERKEN2 = ['een rotatie r(O, 90°)', 'een rotatie r(O, −90°)', 'een translatie over een vector', 'een spiegeling om de x-as'];

  /* dynamische figuren */
  var driehoek = [[2, 6], [5, 6], [3, 8]];
  function transBord() {
    var punten = [{ n: 'X', x: 2, y: 4, lp: [-0.35, 0.3] }, { n: 'Y', x: 4, y: 4, sleep: true, lp: [0.4, 0.4] }], doel = [], beeld = [];
    driehoek.forEach(function (p, i) {
      punten.push({ n: 'o' + i, x: p[0], y: p[1], verberg: true });
      punten.push({ n: 'd' + i, x: p[0] + 7, y: p[1] - 3, verberg: true }); doel.push('d' + i);
      punten.push({ n: 'i' + i, x: p[0], y: p[1], verberg: true, f: function (pt) { var X = pt('X'), Y = pt('Y'); return { x: p[0] + Y.x - X.x, y: p[1] + Y.y - X.y }; } }); beeld.push('i' + i);
    });
    return { b: 16, h: 10, rooster: 1, punten: punten, lijnen: [{ t: 'vector', p: ['X', 'Y'] }], veelhoeken: [{ p: ['o0', 'o1', 'o2'], kl: 'blauw' }, { p: doel, kl: 'oranje', stippel: true }, { p: beeld, kl: 'groen' }] };
  }
  var vierhoek = [[2, 0], [5, 0], [5, 2], [3, 2]];
  function rotBord() {
    var cx = 8, cy = 2, a0 = 120 * Math.PI / 180;
    var punten = [{ n: 'O', x: cx, y: cy, lp: [0, -0.5] }, { n: 'r', x: cx + 6.5, y: cy, verberg: true }, { n: 'P', x: r3(cx + 6.5 * Math.cos(0.35)), y: r3(cy + 6.5 * Math.sin(0.35)), sleep: true, baan: { m: 'O', r: 6.5 }, lp: [0.45, 0.4] }], doel = [], beeld = [];
    vierhoek.forEach(function (p, i) {
      punten.push({ n: 'o' + i, x: cx + p[0], y: cy + p[1], verberg: true });
      punten.push({ n: 'd' + i, x: r3(cx + p[0] * Math.cos(a0) - p[1] * Math.sin(a0)), y: r3(cy + p[0] * Math.sin(a0) + p[1] * Math.cos(a0)), verberg: true }); doel.push('d' + i);
      punten.push({ n: 'i' + i, x: cx + p[0], y: cy + p[1], verberg: true, f: function (pt) { var P = pt('P'), a = Math.atan2(P.y - cy, P.x - cx); return { x: cx + p[0] * Math.cos(a) - p[1] * Math.sin(a), y: cy + p[0] * Math.sin(a) + p[1] * Math.cos(a) }; } }); beeld.push('i' + i);
    });
    return { b: 16, h: 9.5, punten: punten, lijnen: [{ t: 'lijnstuk', p: ['O', 'r'], stippel: true }, { t: 'lijnstuk', p: ['O', 'P'], stippel: true }], hoeken: [{ h: 'O', van: 'r', naar: 'P', n: 'α', waarde: true, r: 1.1 }], veelhoeken: [{ p: ['o0', 'o1', 'o2', 'o3'], kl: 'blauw' }, { p: doel, kl: 'oranje', stippel: true }, { p: beeld, kl: 'groen' }] };
  }
  var drie2 = [[4, 7], [6, 9], [7, 6]];
  function spiegelBord() {
    var sx = 8, sy = 5;
    var punten = [{ n: 'S', x: sx, y: sy, lp: [-0.4, 0.35] }, { n: 'T', x: 12, y: 5, sleep: true, lp: [0.4, 0.45] }], doel = [], beeld = [];
    drie2.forEach(function (p, i) {
      punten.push({ n: 'o' + i, x: p[0], y: p[1], verberg: true });
      punten.push({ n: 'd' + i, x: sx + (p[1] - sy), y: sy + (p[0] - sx), verberg: true }); doel.push('d' + i);
      punten.push({ n: 'i' + i, x: p[0], y: p[1], verberg: true, f: function (pt) {
        var T = pt('T'), dx = T.x - sx, dy = T.y - sy, L = dx * dx + dy * dy; if (L < 1e-6) return { x: p[0], y: p[1] };
        var t = ((p[0] - sx) * dx + (p[1] - sy) * dy) / L, fx = sx + t * dx, fy = sy + t * dy; return { x: 2 * fx - p[0], y: 2 * fy - p[1] };
      } }); beeld.push('i' + i);
    });
    return { b: 16, h: 10, rooster: 1, punten: punten, lijnen: [{ t: 'rechte', p: ['S', 'T'], n: 'a' }], veelhoeken: [{ p: ['o0', 'o1', 'o2'], kl: 'blauw' }, { p: doel, kl: 'oranje', stippel: true }, { p: beeld, kl: 'groen' }] };
  }

  var TF = ['een spiegeling om een as', 'een translatie over een vector', 'een rotatie rond een centrum', 'een spiegeling om een punt'];

  window.registreerModule({
    id: 'm01', nummer: 1, titel: 'Transformaties van het vlak en symmetrie', domein: 'Meetkunde', standaardActief: true,

    theorie: {
      slepen: {
        titel: 'Zo werk je op het rooster', html:
          '<ul><li>De <b>blauwe</b> figuur is de oorspronkelijke figuur. De <b>oranje</b> punten kun je verslepen. Ze klikken vast op de roosterpunten.</li>' +
          '<li>Tel de hokjes: hoeveel hokjes ligt een punt van de spiegelas, van het centrum of hoeveel hokjes moet het verschuiven?</li>' +
          '<li>Bij tekenvragen kies je <b>Rechte</b> of <b>Punt</b> en klik je op roosterpunten. Met <b>Gom</b> wis je wat fout is.</li></ul>'
      },
      transformatie: {
        titel: 'Transformaties van het vlak', html:
          '<div class="def">Een <b>transformatie van het vlak</b> beeldt elk punt van dat vlak af op juist één ander punt van dat vlak.</div>' +
          '<p>Dit schooljaar bestudeer je vier transformaties: de spiegeling om een as, de translatie over een vector, de rotatie rond een centrum over een hoek en de spiegeling om een punt.</p>' +
          '<p>Het punt A′ (lees: A accent) is het <b>beeld</b> van het punt A. Twee figuren met dezelfde vorm en dezelfde grootte noem je <b>congruente figuren</b>. Bij deze vier transformaties is het beeld altijd congruent met de oorspronkelijke figuur.</p>'
      },
      spiegelingAs: {
        titel: 'Spiegelen om een as', html:
          '<p>Bij een spiegeling om een as a ligt elk punt even ver van de spiegelas als zijn beeld, loodrecht tegenover elkaar.</p>' +
          '<table><tr><th>in symbolen</th><th>lees je als</th></tr><tr><td>s<sub>a</sub>(A) = A′</td><td>A′ is het beeld van het punt A door spiegeling om de as a</td></tr><tr><td>s<sub>a</sub>(ΔBCD) = ΔB′C′D′</td><td>ΔB′C′D′ is het beeld van ΔBCD door spiegeling om de as a</td></tr></table>' +
          '<div class="def">Een punt op de spiegelas heeft zichzelf als beeld. Zo’n punt noem je een <b>dekpunt</b>.</div>' +
          '<p>Op een rooster: tel hoeveel hokjes een punt van de as ligt en tel evenveel hokjes aan de andere kant.</p>'
      },
      translatie: {
        titel: 'Translatie over een vector', html:
          '<p>Een translatie (of verschuiving) verschuift elk punt op dezelfde manier. De <b>vector</b> bepaalt:</p><ul><li>de <b>richting</b> van de translatie (evenwijdig met de drager van de vector),</li><li>de <b>zin</b> van de translatie (volgens de pijl),</li><li>de <b>grootte</b> van de translatie (de afstand).</li></ul>' +
          '<table><tr><th>in symbolen</th><th>lees je als</th></tr><tr><td>t<sub>' + vec('XY') + '</sub>(A) = A′</td><td>A′ is het beeld van het punt A door een translatie over de vector ' + vec('XY') + '</td></tr></table>' +
          '<p>|XY| = |AA′| = |BB′| en XY ⫽ AA′ ⫽ BB′. Op een rooster: gaat de vector 5 hokjes naar rechts en 2 naar beneden, dan doet elk punt dat ook.</p>'
      },
      rotatie: {
        titel: 'Rotatie rond een centrum over een hoek', html:
          '<p>Bij een rotatie draait elk punt rond het <b>centrum</b> O over dezelfde <b>hoek</b>. Een punt en zijn beeld liggen even ver van O.</p>' +
          '<table><tr><th>in symbolen</th><th>lees je als</th></tr><tr><td>r(O, 60°)</td><td>een rotatie rond het centrum O over 60° in tegenwijzerzin (positieve hoek)</td></tr><tr><td>r(O, −150°)</td><td>een rotatie rond het centrum O over 150° in wijzerzin (negatieve hoek)</td></tr><tr><td>r(O, 150°)(P) = P′</td><td>P′ is het beeld van P door een rotatie rond O over 150° in tegenwijzerzin</td></tr></table>' +
          '<p>Een volledige draai is 360°. Daarom is r(O, −210°)(P) = r(O, 150°)(P).</p>' +
          '<p>Op een rooster, rotatie over 90° in tegenwijzerzin rond O: een punt dat 2 hokjes rechts van O ligt, komt 2 hokjes boven O. In een assenstelsel wordt (x, y) dan (−y, x).</p>'
      },
      puntspiegeling: {
        titel: 'Spiegeling om een punt', html:
          '<p>Bij een spiegeling om een punt O ligt O precies in het midden tussen een punt en zijn beeld.</p>' +
          '<table><tr><th>in symbolen</th><th>lees je als</th></tr><tr><td>s<sub>O</sub>(P) = P′</td><td>P′ is het beeld van het punt P door een spiegeling om het punt O</td></tr></table>' +
          '<p>Spiegelen om een punt O is hetzelfde als roteren rond O over 180°. We noemen dit ook een <b>puntspiegeling</b> met centrum O.</p>' +
          '<p>Op een rooster: ligt een punt 3 hokjes links en 1 hokje boven O, dan ligt het beeld 3 hokjes rechts en 1 hokje onder O. In een assenstelsel wordt (x, y) dan (−x, −y).</p>'
      },
      coordinaten: {
        titel: 'Transformaties in een assenstelsel', html:
          '<table><tr><th>transformatie</th><th>beeld van (x, y)</th></tr><tr><td>spiegeling om de x-as</td><td>(x, −y)</td></tr><tr><td>spiegeling om de y-as</td><td>(−x, y)</td></tr><tr><td>spiegeling om de oorsprong O</td><td>(−x, −y)</td></tr><tr><td>rotatie r(O, 90°)</td><td>(−y, x)</td></tr><tr><td>rotatie r(O, −90°)</td><td>(y, −x)</td></tr></table>'
      },
      eigenschappen: {
        titel: 'Eigenschappen van transformaties', html:
          '<p>Een spiegeling om een as, een translatie, een rotatie en een spiegeling om een punt bewaren alle vier:</p>' +
          '<ul><li>de <b>collineariteit</b>: liggen drie punten op één rechte, dan hun beelden ook. Het beeld van een rechte is een rechte.</li><li>de <b>evenwijdigheid</b>: a ⫽ b ⇒ a′ ⫽ b′</li><li>de <b>lengte</b> van een lijnstuk: |AB| = |A′B′|</li><li>de <b>grootte</b> van een hoek, en dus ook de loodrechte stand</li></ul>' +
          '<p>Omdat het beeld congruent is met de oorspronkelijke figuur, blijven ook de omtrek en de oppervlakte behouden.</p>' +
          '<div class="def">Alleen bij een <b>translatie</b> en bij een <b>spiegeling om een punt</b> is het beeld van een rechte altijd evenwijdig met de oorspronkelijke rechte.</div>'
      },
      isometrie: {
        titel: 'Isometrie', html:
          '<div class="def">Een transformatie die afstanden en hoekgroottes behoudt, noem je een <b>isometrie</b>. De vorm en de grootte van de figuur blijven gelijk. Alleen de positie verandert en soms de oriëntatie.</div>' +
          '<p>Bij een spiegeling om een as keert de oriëntatie (de omloopzin) van de figuur om. Niet alle transformaties zijn isometrieën: bij een homothetie is het beeld een schaalmodel.</p>'
      },
      symAs: {
        titel: 'Spiegelsymmetrisch om een as', html:
          '<div class="def">Een vlakke figuur is <b>spiegelsymmetrisch om een as</b> (of lijnsymmetrisch) als ze zichzelf als beeld heeft bij spiegeling om die as. Die as is een <b>symmetrieas</b>.</div>' +
          '<p>Een symmetrieas verdeelt de figuur in twee congruente figuren.</p>' +
          '<table><tr><th>figuur</th><th>aantal symmetrieassen</th></tr><tr><td>ongelijkbenige driehoek</td><td>0</td></tr><tr><td>gelijkbenige driehoek</td><td>1</td></tr><tr><td>gelijkzijdige driehoek</td><td>3</td></tr><tr><td>parallellogram</td><td>0</td></tr><tr><td>ruit</td><td>2 (de diagonalen)</td></tr><tr><td>rechthoek</td><td>2 (door de middens van de zijden)</td></tr><tr><td>vierkant</td><td>4</td></tr></table>' +
          '<p>De symmetrieas van een gelijkbenige driehoek is de hoogtelijn uit de top. Dat is ook de bissectrice van de tophoek, de zwaartelijn uit de top en de middelloodlijn van de basis.</p>'
      },
      symPunt: {
        titel: 'Spiegelsymmetrisch om een punt', html:
          '<div class="def">Een vlakke figuur is <b>spiegelsymmetrisch om een punt</b> (of puntsymmetrisch) als ze zichzelf als beeld heeft bij spiegeling om dat punt. Dat punt is het <b>symmetriemiddelpunt</b>.</div>' +
          '<p>Driehoeken hebben geen symmetriemiddelpunt. Alle parallellogrammen (dus ook ruiten, rechthoeken en vierkanten) zijn puntsymmetrisch. Het symmetriemiddelpunt is het snijpunt van de diagonalen.</p><p>Tip: draai de figuur in gedachten een halve slag. Ziet ze er hetzelfde uit, dan is ze puntsymmetrisch.</p>'
      },
      symRuimte: {
        titel: 'Symmetrie in ruimtefiguren', html:
          '<div class="def">Een ruimtefiguur is <b>spiegelsymmetrisch om een vlak</b> als ze zichzelf als beeld heeft bij spiegeling om dat vlak. Dat vlak is een <b>symmetrievlak</b>.</div>' +
          '<p>Een kubus heeft 9 symmetrievlakken. Een balk met een vierkant grondvlak heeft er 5. Een balk met drie verschillende afmetingen heeft er 3.</p><p>In een kubus en in een balk is het snijpunt van de ruimtediagonalen het symmetriemiddelpunt.</p>'
      }
    },

    delen: [
      /* ============ 1 TRANSFORMATIES VAN HET VLAK ============ */
      {
        id: 'd1', nr: '1', titel: 'Transformaties van het vlak', hulp: ['transformatie'], vragen: [
          { id: 'v01', titel: 'Vier transformaties', type: 'sleep', hulp: ['transformatie', 'spiegelingAs', 'translatie', 'rotatie', 'puntspiegeling'], vraag: 'Koppel elke omschrijving aan de juiste transformatie.',
            paren: [['Elk punt verschuift in dezelfde richting, in dezelfde zin en over dezelfde afstand.', 'translatie'], ['Elk punt draait rond een centrum over dezelfde hoek.', 'rotatie'], ['Elk punt ligt even ver van een rechte als zijn beeld, aan de andere kant.', 'spiegeling om een as'], ['Een centrum O ligt precies in het midden tussen elk punt en zijn beeld.', 'spiegeling om een punt']],
            uitleg: 'Verschuiven is een translatie, draaien is een rotatie. Bij een spiegeling om een as ligt de as in het midden, bij een spiegeling om een punt ligt het centrum in het midden.' },
          { id: 'v02', titel: 'Notatie van een spiegeling', type: 'mc', hulp: ['spiegelingAs'], vraag: 'A′ is het beeld van het punt A door de spiegeling om de as a. Hoe noteer je dat in symbolen?',
            opties: ['s<sub>a</sub>(A) = A′', 's<sub>A</sub>(a) = A′', 't<sub>a</sub>(A) = A′', 'r(a, A) = A′'], juist: 0,
            uitleg: 'De letter s staat voor spiegeling. De as staat als index en het punt dat je spiegelt staat tussen haakjes.' },
          { id: 'v03', titel: 'Afspraken bij een rotatie', type: 'invul', hulp: ['rotatie', 'puntspiegeling'], vraag: 'Vul aan.',
            sjabloon: 'r(O, 60°) is een rotatie rond O over 60° in [[a]]<br>r(O, −105°) is een rotatie rond O over 105° in [[b]]<br>r(O, −210°) geeft hetzelfde beeld als r(O, [[c]]°)<br>Een spiegeling om het punt O is hetzelfde als een rotatie rond O over [[d]]°',
            velden: { a: K(['wijzerzin', 'tegenwijzerzin'], 'tegenwijzerzin'), b: K(['wijzerzin', 'tegenwijzerzin'], 'wijzerzin'), c: G(150, { w: 4 }), d: G([180, -180], { w: 4 }) },
            uitleg: 'Een positieve hoek betekent tegenwijzerzin, een negatieve hoek wijzerzin. 210° in wijzerzin komt op dezelfde plaats uit als 360° − 210° = 150° in tegenwijzerzin.' },
          { id: 'v04', titel: 'Dekpunt', type: 'mc', hulp: ['spiegelingAs'], vraag: 'Wat is een dekpunt bij een spiegeling om de as a?',
            opties: ['Een punt op de spiegelas: het heeft zichzelf als beeld.', 'Het punt dat het verst van de spiegelas ligt.', 'Het beeld van een hoekpunt van de figuur.', 'Het midden van de figuur.'], juist: 0,
            uitleg: 'Een punt dat op de spiegelas ligt, blijft bij het spiegelen op zijn plaats. Het valt samen met zijn beeld.' },
          { id: 'v05', titel: 'Wat bepaalt de vector?', type: 'mc', meerdere: true, hulp: ['translatie'], vraag: 'Wat bepaalt de vector bij een translatie?',
            opties: ['de richting van de translatie', 'de zin van de translatie', 'de grootte van de translatie', 'het centrum van de translatie', 'de spiegelas van de translatie'], juist: [0, 1, 2],
            uitleg: 'Een vector heeft een richting, een zin (de pijl) en een grootte (de lengte). Een translatie heeft geen centrum en geen spiegelas.' },
          { id: 'v06', titel: 'Spiegelingen herkennen', type: 'invul', hulp: ['spiegelingAs', 'puntspiegeling', 'coordinaten'], vraag: 'De blauwe driehoek F wordt afgebeeld op de oranje driehoeken 1, 2 en 3. Door welke transformatie?',
            figuur: { bord: herkenBord([function (x, y) { return [-x, y]; }, function (x, y) { return [-x, -y]; }, function (x, y) { return [x, -y]; }]) },
            sjabloon: 'Driehoek 1 is het beeld van F door [[a]]<br>Driehoek 2 is het beeld van F door [[b]]<br>Driehoek 3 is het beeld van F door [[c]]',
            velden: { a: K(HERKEN1, 'een spiegeling om de y-as'), b: K(HERKEN1, 'een spiegeling om het punt O'), c: K(HERKEN1, 'een spiegeling om de x-as') },
            uitleg: 'Driehoek 1 ligt even ver van de y-as als F. Driehoek 3 ligt even ver van de x-as. Bij driehoek 2 ligt O in het midden tussen elk punt en zijn beeld.' },
          { id: 'v07', titel: 'Rotaties en translatie herkennen', type: 'invul', hulp: ['rotatie', 'translatie', 'coordinaten'], vraag: 'De blauwe driehoek F wordt afgebeeld op de oranje driehoeken 1, 2 en 3. Door welke transformatie?',
            figuur: { bord: herkenBord([function (x, y) { return [-y, x]; }, function (x, y) { return [x - 6, y - 5]; }, function (x, y) { return [y, -x]; }]) },
            sjabloon: 'Driehoek 1 is het beeld van F door [[a]]<br>Driehoek 2 is het beeld van F door [[b]]<br>Driehoek 3 is het beeld van F door [[c]]',
            velden: { a: K(HERKEN2, 'een rotatie r(O, 90°)'), b: K(HERKEN2, 'een translatie over een vector'), c: K(HERKEN2, 'een rotatie r(O, −90°)') },
            tip: 'Bij een translatie blijft de figuur in dezelfde stand staan.', uitleg: 'Driehoek 2 staat in dezelfde stand als F: dat is een translatie. Driehoek 1 is een kwartslag in tegenwijzerzin gedraaid, driehoek 3 een kwartslag in wijzerzin.' },
          sleepVraag({ id: 'v08', titel: 'Spiegelen om een as', hulp: ['slepen', 'spiegelingAs'], vraag: 'Versleep A′, B′ en C′ zodat ΔA′B′C′ het beeld is van ΔABC door de spiegeling om de as a.',
            origineel: [['A', 3, 3], ['B', 6, 2], ['C', 5, 7]], beeld: [['A′', 13, 3], ['B′', 10, 2], ['C′', 11, 7]], start: [[13, 9], [14, 9], [15, 9]],
            punten: [{ n: 's1', x: 8, y: 1, verberg: true }, { n: 's2', x: 8, y: 9, verberg: true }], lijnen: [{ t: 'rechte', p: ['s1', 's2'], n: 'a' }],
            tip: 'Tel voor elk punt hoeveel hokjes het van de as ligt.', uitleg: 'A ligt 5 hokjes links van de as, dus A′ ligt 5 hokjes rechts ervan op dezelfde hoogte. B ligt 2 hokjes van de as en C 3 hokjes.' }),
          sleepVraag({ id: 'v09', titel: 'Translatie over een vector', hulp: ['slepen', 'translatie'], vraag: 'Versleep A′, B′, C′ en D′ zodat A′B′C′D′ het beeld is van ABCD door de translatie over de vector ' + vec('XY') + '.',
            origineel: [['A', 1, 4, [-0.3, -0.4]], ['B', 4, 3, [0.2, -0.45]], ['C', 5, 6], ['D', 2, 7, [-0.3, 0.4]]], beeld: [['A′', 7, 2], ['B′', 10, 1], ['C′', 11, 4], ['D′', 8, 5]], start: [[1, 1], [2, 1], [3, 1], [4, 1]],
            punten: [{ n: 'X', x: 9, y: 9, lp: [-0.35, 0.3] }, { n: 'Y', x: 15, y: 7, lp: [0.35, 0.3] }], lijnen: [{ t: 'vector', p: ['X', 'Y'] }],
            tip: 'Tel hoeveel hokjes de vector naar rechts en naar beneden gaat.', uitleg: 'De vector gaat 6 hokjes naar rechts en 2 hokjes naar beneden. Elk punt van de vierhoek verschuift op dezelfde manier.' }),
          sleepVraag({ id: 'v10', titel: 'Spiegelen om een punt', hulp: ['slepen', 'puntspiegeling'], vraag: 'Versleep A′, B′ en C′ zodat ΔA′B′C′ het beeld is van ΔABC door de spiegeling om het punt O.',
            origineel: [['A', 3, 6], ['B', 6, 8], ['C', 6, 5]], beeld: [['A′', 13, 4], ['B′', 10, 2], ['C′', 10, 5]], start: [[13, 9], [14, 9], [15, 9]],
            punten: [{ n: 'O', x: 8, y: 5, lp: [0, -0.5] }],
            tip: 'O ligt precies in het midden tussen een punt en zijn beeld.', uitleg: 'A ligt 5 hokjes links en 1 hokje boven O, dus A′ ligt 5 hokjes rechts en 1 hokje onder O. Zo doe je dat voor elk punt.' }),
          sleepVraag({ id: 'v11', titel: 'Roteren over 90°', hulp: ['slepen', 'rotatie'], vraag: 'Versleep A′, B′ en C′ zodat ΔA′B′C′ het beeld is van ΔABC door de rotatie r(O, 90°).',
            origineel: [['A', 10, 4, [0, -0.5]], ['B', 13, 4, [0, -0.5]], ['C', 13, 6]], beeld: [['A′', 8, 6], ['B′', 8, 9], ['C′', 6, 9]], start: [[1, 1], [2, 1], [3, 1]],
            punten: [{ n: 'O', x: 8, y: 4, lp: [-0.3, -0.45] }],
            tip: '90° is positief: je draait in tegenwijzerzin. Een punt rechts van O komt boven O terecht.', uitleg: 'A ligt 2 hokjes rechts van O en komt na een kwartslag in tegenwijzerzin 2 hokjes boven O. B komt 5 hokjes boven O. C (5 rechts, 2 boven) komt 2 links en 5 boven O.' }),
          sleepVraag({ id: 'v12', titel: 'Roteren over −90°', hulp: ['slepen', 'rotatie'], vraag: 'Versleep A′, B′ en C′ zodat ΔA′B′C′ het beeld is van ΔABC door de rotatie r(O, −90°).',
            origineel: [['A', 5, 6], ['B', 5, 9], ['C', 7, 6]], beeld: [['A′', 9, 8], ['B′', 12, 8], ['C′', 9, 6]], start: [[12, 1], [13, 1], [14, 1]],
            punten: [{ n: 'O', x: 8, y: 5, lp: [0, -0.5] }],
            tip: 'Een negatieve hoek betekent wijzerzin.', uitleg: 'Je draait een kwartslag in wijzerzin. A ligt 3 links en 1 boven O en komt 1 rechts en 3 boven O. C ligt 1 links en 1 boven O en komt 1 rechts en 1 boven O.' }),
          sleepVraag({ id: 'v13', titel: 'Spiegelen om een schuine as', hulp: ['slepen', 'spiegelingAs'], vraag: 'Versleep A′, B′ en C′ zodat ΔA′B′C′ het beeld is van ΔABC door de spiegeling om de as a.',
            origineel: [['A', 5, 6], ['B', 5, 8], ['C', 8, 9]], beeld: [['A′', 9, 2], ['B′', 11, 2], ['C′', 12, 5]], start: [[13, 9], [14, 9], [15, 9]],
            punten: [{ n: 's1', x: 4, y: 1, verberg: true }, { n: 's2', x: 12, y: 9, verberg: true }], lijnen: [{ t: 'rechte', p: ['s1', 's2'], n: 'a', zij: -1 }],
            tip: 'Ga vanuit een punt schuin over de hokjes loodrecht naar de as en ga even ver verder aan de andere kant.', uitleg: 'De as loopt schuin door de hoekpunten van de hokjes. Vanuit A ga je 2 hokjes schuin naar de as en dan nog 2 hokjes schuin verder: zo kom je in A′.' }),
          { id: 'v14', titel: 'De juiste vector zoeken', type: 'teken', hulp: ['slepen', 'translatie'], vraag: 'Versleep het punt Y zodat de translatie over de vector ' + vec('XY') + ' de blauwe driehoek precies op de oranje driehoek afbeeldt. <span class="extra">De groene driehoek toont het beeld.</span>',
            bord: transBord(), controle: [{ c: 'positie', n: 'Y', x: 9, y: 1 }],
            slot: 'Elk punt verschuift [[a]] hokjes naar rechts en [[b]] hokjes naar beneden.', velden: { a: G(7, { w: 2 }), b: G(3, { w: 2 }) },
            uitleg: 'De vector gaat 7 hokjes naar rechts en 3 hokjes naar beneden. Elk punt van de driehoek verschuift op dezelfde manier.' },
          { id: 'v15', titel: 'De juiste rotatiehoek zoeken', type: 'teken', hulp: ['rotatie'], vraag: 'Versleep het punt P om de blauwe vierhoek rond O te draaien tot het groene beeld precies op de oranje vierhoek ligt. Noteer daarna de rotatie.',
            bord: rotBord(), controle: [{ c: 'hoekGrootte', h: 'O', van: 'r', naar: 'P', min: 119, max: 121, fout: 'Het groene beeld ligt nog niet op de oranje vierhoek.' }],
            slot: 'De rotatie is r(O, [[a]]°)', velden: { a: G([120, -240], { w: 4, tol: 1 }) },
            uitleg: 'Je draait de vierhoek 120° in tegenwijzerzin rond O. De hoek is positief: r(O, 120°).' },
          { id: 'v16', titel: 'De juiste spiegelas zoeken', type: 'teken', hulp: ['slepen', 'spiegelingAs'], vraag: 'De spiegelas a gaat door S en T. Versleep het punt T zodat de spiegeling om a de blauwe driehoek precies op de oranje driehoek afbeeldt.',
            bord: spiegelBord(), controle: [{ c: 'positie', n: 'T', lijn: [[8, 5], [10, 7]] }],
            tip: 'De spiegelas ligt precies in het midden tussen de figuur en haar beeld.', uitleg: 'De as loopt schuin door S, tussen de blauwe en de oranje driehoek. Elk punt en zijn beeld liggen even ver van de as.' },
          { id: 'v17', titel: 'Beelden in een assenstelsel', type: 'invul', hulp: ['coordinaten'], vraag: 'Het punt A heeft als coördinaat (3, 2). Geef de coördinaat van het beeld.',
            sjabloon: 'door de spiegeling om de x-as: ( [[a]] , [[b]] )<br>door de spiegeling om de y-as: ( [[c]] , [[d]] )<br>door de spiegeling om de oorsprong O: ( [[e]] , [[f]] )<br>door de rotatie r(O, 90°): ( [[g]] , [[h]] )',
            velden: { a: G(3, { w: 2 }), b: G(-2, { w: 2 }), c: G(-3, { w: 2 }), d: G(2, { w: 2 }), e: G(-3, { w: 2 }), f: G(-2, { w: 2 }), g: G(-2, { w: 2 }), h: G(3, { w: 2 }) },
            uitleg: 'Spiegelen om de x-as verandert het teken van y. Spiegelen om de y-as verandert het teken van x. Spiegelen om O verandert beide tekens. Bij r(O, 90°) wordt (x, y) het punt (−y, x).' },
          { id: 'v18', titel: 'Draaien aan een ronde tafel', type: 'invul', hulp: ['rotatie'], vraag: 'Aan een ronde tafel zitten personen op gelijke afstand van elkaar. Over welke hoek draai je rond het midden van de tafel?',
            sjabloon: 'Tafel met 8 personen, naar de volgende plaats in tegenwijzerzin: [[a]]°<br>Tafel met 8 personen, 3 plaatsen verder in tegenwijzerzin: [[b]]°<br>Tafel met 5 personen, 2 plaatsen verder in tegenwijzerzin: [[c]]°<br>Tafel met 6 personen, 2 plaatsen verder in wijzerzin: [[d]]°',
            velden: { a: G(45, { w: 4 }), b: G(135, { w: 4 }), c: G(144, { w: 4 }), d: G(-120, { w: 4 }) },
            tip: 'Een volledige draai is 360°. In wijzerzin is de hoek negatief.', uitleg: '360° : 8 = 45° en 3 · 45° = 135°. 360° : 5 = 72° en 2 · 72° = 144°. 360° : 6 = 60°, twee plaatsen in wijzerzin geeft −120°.' }
        ]
      },

      /* ============ 2 EIGENSCHAPPEN VAN TRANSFORMATIES ============ */
      {
        id: 'd2', nr: '2', titel: 'Eigenschappen van transformaties', hulp: ['eigenschappen', 'isometrie'], vragen: [
          { id: 'v01', titel: 'Wat blijft behouden?', type: 'mc', meerdere: true, hulp: ['eigenschappen'], vraag: 'Wat blijft behouden bij elk van de vier transformaties (spiegeling om een as, translatie, rotatie, spiegeling om een punt)?',
            opties: ['de lengte van een lijnstuk', 'de grootte van een hoek', 'de evenwijdigheid van rechten', 'de collineariteit van punten', 'de oppervlakte van een figuur', 'de plaats van de figuur'], juist: [0, 1, 2, 3, 4],
            uitleg: 'Het beeld is congruent met de oorspronkelijke figuur. Lengtes, hoeken, evenwijdigheid, collineariteit en oppervlakte blijven behouden. Alleen de plaats verandert.' },
          { id: 'v02', titel: 'Beeld van een rechte', type: 'sleep', hulp: ['eigenschappen'], vraag: 'Bij welke transformaties is het beeld van een rechte altijd evenwijdig met de oorspronkelijke rechte?',
            vakken: ['Altijd evenwijdig', 'Niet altijd evenwijdig'], items: [['translatie over een vector', 0], ['spiegeling om een punt', 0], ['spiegeling om een as', 1], ['rotatie rond een centrum over een hoek', 1]],
            uitleg: 'Alleen bij een translatie en bij een spiegeling om een punt is het beeld van een rechte altijd evenwijdig met de oorspronkelijke rechte.' },
          { id: 'v03', titel: 'Isometrie', type: 'mc', hulp: ['isometrie'], vraag: 'Wat is een isometrie?',
            opties: ['Een transformatie die afstanden en hoekgroottes behoudt.', 'Een transformatie die de figuur groter of kleiner maakt.', 'Een transformatie waarbij elke figuur op haar plaats blijft.', 'Een figuur met minstens één symmetrieas.'], juist: 0,
            uitleg: 'Bij een isometrie blijven de vorm en de grootte van de figuur gelijk. Spiegelingen, translaties en rotaties zijn isometrieën.' },
          { id: 'v04', titel: 'Eigenschappen toepassen', type: 'invul', hulp: ['eigenschappen'], vraag: 'Een figuur wordt gespiegeld om een as. Vul aan zonder te meten.',
            sjabloon: '|CD| = 3 cm, dus |C′D′| = [[a]] cm<br>^A = 35°, dus ^A′ = [[b]]°<br>De oppervlakte van de figuur is 12 cm², dus de oppervlakte van het beeld is [[c]] cm²<br>De omtrek van de figuur is 18 cm, dus de omtrek van het beeld is [[d]] cm',
            velden: { a: G(3, { w: 3 }), b: G(35, { w: 3 }), c: G(12, { w: 3 }), d: G(18, { w: 3 }) },
            uitleg: 'Een spiegeling bewaart de lengte van een lijnstuk en de grootte van een hoek. Het beeld is congruent, dus ook de oppervlakte en de omtrek blijven gelijk.' },
          { id: 'v05', titel: 'Eigenschap in symbolen', type: 'sleep', hulp: ['eigenschappen'], vraag: 'Koppel elke eigenschap aan de notatie in symbolen.',
            paren: [['De transformatie bewaart de evenwijdigheid.', 'a ⫽ b ⇒ a′ ⫽ b′'], ['De transformatie bewaart de lengte van een lijnstuk.', '|AB| = |A′B′|'], ['De transformatie bewaart de grootte van een hoek.', '^A = ^A′'], ['De transformatie bewaart de collineariteit.', 'E ∈ BC ⇒ E′ ∈ B′C′']],
            uitleg: 'Evenwijdige rechten hebben evenwijdige beelden. Een lijnstuk en zijn beeld zijn even lang. Een hoek en zijn beeld zijn even groot. Ligt E op BC, dan ligt E′ op B′C′.' },
          { id: 'v06', titel: 'Parallellogram spiegelen om een punt', type: 'mc', meerdere: true, hulp: ['eigenschappen', 'puntspiegeling'], vraag: 'ABCD is een parallellogram dat geen ruit en geen rechthoek is. KLMN is het beeld van ABCD door de spiegeling om het punt O, met s<sub>O</sub>(A) = K, s<sub>O</sub>(B) = L, s<sub>O</sub>(C) = M en s<sub>O</sub>(D) = N. Welke uitspraken zijn juist?',
            opties: ['ABCD en KLMN zijn congruent.', 'A, O en K zijn collineair.', 'AC ⫽ KM', '|AO| = |OK|', 'KLMN is een rechthoek.', 'AB ⊥ KL'], juist: [0, 1, 2, 3],
            uitleg: 'O is het midden van [AK], dus A, O en K zijn collineair en |AO| = |OK|. Bij een spiegeling om een punt is het beeld van een rechte evenwijdig met die rechte: AC ⫽ KM en AB ⫽ KL. Het beeld is congruent en blijft dus een parallellogram.' },
          sleepVraag({ id: 'v07', titel: 'Rechthoek verschuiven', hulp: ['slepen', 'translatie', 'eigenschappen'], vraag: 'M is het snijpunt van de diagonalen van de rechthoek ABCD. Een translatie beeldt M af op N. Versleep A′, B′, C′ en D′ naar het beeld van de rechthoek door dezelfde translatie.',
            origineel: [['A', 2, 9, [-0.3, 0.35]], ['B', 8, 9], ['C', 8, 5, [0.3, -0.35]], ['D', 2, 5, [-0.3, -0.35]]], beeld: [['A′', 7, 5], ['B′', 13, 5], ['C′', 13, 1], ['D′', 7, 1]], start: [[1, 1], [2, 1], [3, 1], [4, 1]],
            punten: [{ n: 'M', x: 5, y: 7, lp: [0, 0.45] }, { n: 'N', x: 10, y: 3, lp: [0.35, 0.35] }], lijnen: [{ t: 'vector', p: ['M', 'N'] }],
            tip: 'Tel hoe M verschuift naar N. Elk hoekpunt verschuift op dezelfde manier.', uitleg: 'M verschuift 5 hokjes naar rechts en 4 hokjes naar beneden. Dat doet elk hoekpunt ook. Het beeld is een congruente rechthoek met N als snijpunt van de diagonalen.' }),
          { id: 'v08', titel: 'Collineaire punten roteren', type: 'invul', hulp: ['coordinaten', 'eigenschappen'], vraag: 'Gegeven: A(3, 2), B(−4, 2) en C(0, 2). Bepaal de beelden door de rotatie r(O, 90°).',
            sjabloon: 'A′( [[a]] , [[b]] )<br>B′( [[c]] , [[d]] )<br>C′( [[e]] , [[f]] )<br>A, B en C zijn collineair. De beeldpunten A′, B′ en C′ zijn [[g]]',
            velden: { a: G(-2, { w: 2 }), b: G(3, { w: 2 }), c: G(-2, { w: 2 }), d: G(-4, { w: 2 }), e: G(-2, { w: 2 }), f: G(0, { w: 2 }), g: K(['ook collineair', 'niet collineair'], 'ook collineair') },
            tip: 'Bij r(O, 90°) wordt (x, y) het punt (−y, x).', uitleg: 'A′(−2, 3), B′(−2, −4) en C′(−2, 0) hebben alle drie x = −2 en liggen dus op één rechte. Een rotatie bewaart de collineariteit.' },
          { id: 'v09', titel: 'Oriëntatie', type: 'mc', hulp: ['isometrie'], vraag: 'Bij welke transformatie keert de oriëntatie (de omloopzin) van een figuur om?',
            opties: ['spiegeling om een as', 'translatie over een vector', 'rotatie rond een centrum over een hoek', 'spiegeling om een punt'], juist: 0,
            uitleg: 'Bij een spiegeling om een as krijg je een spiegelbeeld: wat links stond, staat rechts. Bij een translatie, een rotatie en een puntspiegeling (een rotatie over 180°) blijft de omloopzin gelijk.' },
          { id: 'v10', titel: 'Vierkant spiegelen om een punt', type: 'invul', hulp: ['eigenschappen'], vraag: 'Een vierkant met zijde 4 cm wordt gespiegeld om een punt O. Wat weet je over het beeld?',
            sjabloon: 'De zijden van het beeld zijn [[a]] cm lang.<br>De hoeken van het beeld meten [[b]]°<br>De oppervlakte van het beeld is [[c]] cm²<br>Elke zijde van het beeld is [[d]] de overeenkomstige zijde van het vierkant.',
            velden: { a: G(4, { w: 3 }), b: G(90, { w: 3 }), c: G(16, { w: 3 }), d: K(['evenwijdig met', 'loodrecht op'], 'evenwijdig met') },
            uitleg: 'Het beeld is een congruent vierkant: zijde 4 cm, hoeken van 90° en oppervlakte 16 cm². Bij een spiegeling om een punt is het beeld van een rechte evenwijdig met die rechte.' },
          { id: 'v11', titel: 'Loodrechte stand', type: 'mc', hulp: ['eigenschappen'], vraag: 'De rechten a en b staan loodrecht op elkaar. Je roteert beide rechten rond een punt O over 40°. Wat weet je over de beelden a′ en b′?',
            opties: ['a′ en b′ staan loodrecht op elkaar.', 'a′ en b′ zijn evenwijdig.', 'a′ en b′ vormen een hoek van 40°.', 'Daar kun je niets over zeggen.'], juist: 0,
            uitleg: 'Een rotatie bewaart de grootte van een hoek. De hoek van 90° tussen a en b blijft dus 90°.' }
        ]
      },

      /* ============ 3 SYMMETRIE ============ */
      {
        id: 'd3', nr: '3', titel: 'Symmetrie', hulp: ['symAs', 'symPunt'], vragen: [
          { id: 'v01', titel: 'Wat is een symmetrieas?', type: 'mc', hulp: ['symAs'], vraag: 'Wanneer is een rechte een symmetrieas van een vlakke figuur?',
            opties: ['Als de figuur zichzelf als beeld heeft bij spiegeling om die rechte.', 'Als de rechte door een hoekpunt van de figuur gaat.', 'Als de rechte de figuur in twee delen verdeelt.', 'Als de rechte evenwijdig is met een zijde van de figuur.'], juist: 0,
            uitleg: 'Een symmetrieas beeldt de figuur op zichzelf af. Ze verdeelt de figuur in twee congruente delen die elkaars spiegelbeeld zijn. Niet elke rechte die een figuur in twee verdeelt, is een symmetrieas.' },
          { id: 'v02', titel: 'Aantal symmetrieassen', type: 'invul', hulp: ['symAs'], vraag: 'Hoeveel symmetrieassen heeft elke figuur?',
            sjabloon: '<table><tr><th>figuur</th><th>aantal symmetrieassen</th></tr><tr><td>ongelijkbenige driehoek</td><td>[[a]]</td></tr><tr><td>gelijkbenige driehoek (niet gelijkzijdig)</td><td>[[b]]</td></tr><tr><td>gelijkzijdige driehoek</td><td>[[c]]</td></tr><tr><td>parallellogram (geen ruit of rechthoek)</td><td>[[d]]</td></tr><tr><td>ruit (geen vierkant)</td><td>[[e]]</td></tr><tr><td>rechthoek (geen vierkant)</td><td>[[f]]</td></tr><tr><td>vierkant</td><td>[[g]]</td></tr></table>',
            velden: { a: G(0, { w: 2 }), b: G(1, { w: 2 }), c: G(3, { w: 2 }), d: G(0, { w: 2 }), e: G(2, { w: 2 }), f: G(2, { w: 2 }), g: G(4, { w: 2 }) },
            uitleg: 'Driehoeken: 0, 1 of 3. Een parallellogram heeft er geen. Bij een ruit zijn de twee diagonalen symmetrieassen, bij een rechthoek de twee rechten door de middens van de zijden. Een vierkant heeft ze alle vier.' },
          { id: 'v03', titel: 'Puntsymmetrisch of niet', type: 'sleep', hulp: ['symPunt'], vraag: 'Welke figuren zijn spiegelsymmetrisch om een punt?',
            vakken: ['Puntsymmetrisch', 'Niet puntsymmetrisch'], items: [['parallellogram', 0], ['ruit', 0], ['rechthoek', 0], ['vierkant', 0], ['gelijkzijdige driehoek', 1], ['gelijkbenige driehoek', 1], ['gelijkbenig trapezium', 1]],
            uitleg: 'Alle parallellogrammen, dus ook ruiten, rechthoeken en vierkanten, zijn puntsymmetrisch. Het symmetriemiddelpunt is het snijpunt van de diagonalen. Driehoeken hebben geen symmetriemiddelpunt.' },
          { id: 'v04', titel: 'Symmetrieassen van een rechthoek', type: 'teken', hulp: ['slepen', 'symAs'], vraag: 'Teken alle symmetrieassen van de rechthoek.',
            bord: { b: 16, h: 10, rooster: 1, punten: [{ n: 'p0', x: 4, y: 3, verberg: true }, { n: 'p1', x: 12, y: 3, verberg: true }, { n: 'p2', x: 12, y: 7, verberg: true }, { n: 'p3', x: 4, y: 7, verberg: true }], veelhoeken: [{ p: ['p0', 'p1', 'p2', 'p3'], kl: 'blauw' }] },
            gereedschap: ['rechte'], controle: [{ c: 'as', xy: [[8, 0], [8, 10]], fout: 'De verticale symmetrieas ontbreekt of ligt niet juist.' }, { c: 'as', xy: [[0, 5], [16, 5]], fout: 'De horizontale symmetrieas ontbreekt of ligt niet juist.' }, { c: 'aantalRechten', n: 2 }],
            tip: 'Een diagonaal van een rechthoek is geen symmetrieas.', uitleg: 'Een rechthoek heeft 2 symmetrieassen: de rechten door de middens van de overstaande zijden. Als je plooit langs een diagonaal, vallen de twee helften niet op elkaar.' },
          { id: 'v05', titel: 'Symmetrieassen van een vierkant', type: 'teken', hulp: ['slepen', 'symAs'], vraag: 'Teken alle symmetrieassen van het vierkant.',
            bord: { b: 16, h: 10, rooster: 1, punten: [{ n: 'p0', x: 5, y: 2, verberg: true }, { n: 'p1', x: 11, y: 2, verberg: true }, { n: 'p2', x: 11, y: 8, verberg: true }, { n: 'p3', x: 5, y: 8, verberg: true }], veelhoeken: [{ p: ['p0', 'p1', 'p2', 'p3'], kl: 'blauw' }] },
            gereedschap: ['rechte'], controle: [{ c: 'as', xy: [[8, 0], [8, 10]], fout: 'De verticale symmetrieas ontbreekt.' }, { c: 'as', xy: [[0, 5], [16, 5]], fout: 'De horizontale symmetrieas ontbreekt.' }, { c: 'as', xy: [[5, 2], [11, 8]], fout: 'Een diagonaal ontbreekt als symmetrieas.' }, { c: 'as', xy: [[11, 2], [5, 8]], fout: 'Een diagonaal ontbreekt als symmetrieas.' }, { c: 'aantalRechten', n: 4 }],
            uitleg: 'Een vierkant heeft 4 symmetrieassen: de twee diagonalen en de twee rechten door de middens van de overstaande zijden.' },
          { id: 'v06', titel: 'Symmetrieas van een gelijkbenige driehoek', type: 'teken', hulp: ['slepen', 'symAs'], vraag: 'Teken alle symmetrieassen van de gelijkbenige driehoek.',
            bord: { b: 16, h: 10, rooster: 1, punten: [{ n: 'p0', x: 4, y: 2, verberg: true }, { n: 'p1', x: 12, y: 2, verberg: true }, { n: 'p2', x: 8, y: 8, verberg: true }], veelhoeken: [{ p: ['p0', 'p1', 'p2'], kl: 'blauw' }] },
            gereedschap: ['rechte'], controle: [{ c: 'as', xy: [[8, 0], [8, 10]], fout: 'De symmetrieas door de top ontbreekt of ligt niet juist.' }, { c: 'aantalRechten', n: 1 }],
            uitleg: 'Een gelijkbenige driehoek heeft 1 symmetrieas: de hoogtelijn uit de top. Ze gaat door de top en door het midden van de basis.' },
          { id: 'v07', titel: 'Symmetriemiddelpunt aanduiden', type: 'teken', hulp: ['slepen', 'symPunt'], vraag: 'Duid het symmetriemiddelpunt M van het parallellogram aan.',
            bord: { b: 16, h: 10, rooster: 1, punten: [{ n: 'A', x: 3, y: 3, lp: [-0.3, -0.4] }, { n: 'B', x: 10, y: 3, lp: [0.3, -0.4] }, { n: 'C', x: 13, y: 7 }, { n: 'D', x: 6, y: 7, lp: [-0.3, 0.4] }], veelhoeken: [{ p: ['A', 'B', 'C', 'D'], kl: 'blauw' }] },
            gereedschap: ['punt', 'lijnstuk'], nieuw: ['M'], controle: [{ c: 'punt', n: 'M', bij: [8, 5] }],
            tip: 'Teken eventueel eerst de diagonalen [AC] en [BD].', uitleg: 'Het symmetriemiddelpunt van een parallellogram is het snijpunt van de diagonalen.' },
          { id: 'v08', titel: 'Symmetrieassen van een ruit', type: 'mc', meerdere: true, vast: true, compact: true, hulp: ['symAs'], vraag: 'Welke rechten zijn symmetrieassen van de ruit?',
            figuur: { bord: { b: 16, h: 10, punten: [{ n: 'p0', x: 8, y: 1, verberg: true }, { n: 'p1', x: 13, y: 5, verberg: true }, { n: 'p2', x: 8, y: 9, verberg: true }, { n: 'p3', x: 3, y: 5, verberg: true }, { n: 'a1', x: 8, y: 0.3, verberg: true }, { n: 'a2', x: 8, y: 9.4, verberg: true }, { n: 'b1', x: 1, y: 5, verberg: true }, { n: 'b2', x: 15, y: 5, verberg: true }, { n: 'c1', x: 5.5, y: 7, verberg: true }, { n: 'c2', x: 10.5, y: 3, verberg: true }, { n: 'd1', x: 5.5, y: 3, verberg: true }, { n: 'd2', x: 10.5, y: 7, verberg: true }],
              veelhoeken: [{ p: ['p0', 'p1', 'p2', 'p3'], kl: 'blauw' }], lijnen: [{ t: 'rechte', p: ['a1', 'a2'], n: 'a', stippel: true }, { t: 'rechte', p: ['b1', 'b2'], n: 'b', stippel: true }, { t: 'rechte', p: ['c1', 'c2'], n: 'c', stippel: true }, { t: 'rechte', p: ['d1', 'd2'], n: 'd', stippel: true }] } },
            opties: ['a', 'b', 'c', 'd'], juist: [0, 1],
            uitleg: 'Bij een ruit zijn alleen de twee diagonalen symmetrieassen (a en b). De rechten c en d gaan door de middens van de zijden, maar als je daarlangs plooit, vallen de helften niet op elkaar.' },
          { id: 'v09', titel: 'Lijnsymmetrische letters', type: 'mc', meerdere: true, vast: true, compact: true, hulp: ['symAs'], vraag: 'Welke drukletters zijn spiegelsymmetrisch om een as?',
            opties: ['A', 'E', 'H', 'M', 'N', 'S', 'Z'], juist: [0, 1, 2, 3],
            uitleg: 'A en M hebben een verticale symmetrieas, E een horizontale en H heeft er twee. N, S en Z hebben geen symmetrieas.' },
          { id: 'v10', titel: 'Puntsymmetrische letters', type: 'mc', meerdere: true, vast: true, compact: true, hulp: ['symPunt'], vraag: 'Welke drukletters zijn spiegelsymmetrisch om een punt?',
            opties: ['A', 'E', 'H', 'M', 'N', 'S', 'Z'], juist: [2, 4, 5, 6], tip: 'Draai de letter in gedachten een halve slag.',
            uitleg: 'H, N, S en Z zien er na een halve draai hetzelfde uit. A, E en M staan dan ondersteboven.' },
          { id: 'v11', titel: 'Symmetrie in ruimtefiguren', type: 'invul', hulp: ['symRuimte'], vraag: 'Vul aan.',
            sjabloon: 'Een kubus heeft [[a]] symmetrievlakken.<br>Een balk met een vierkant grondvlak (geen kubus) heeft [[b]] symmetrievlakken.<br>Een balk met drie verschillende afmetingen heeft [[c]] symmetrievlakken.<br>Het symmetriemiddelpunt van een kubus is het snijpunt van [[d]]',
            velden: { a: G(9, { w: 2 }), b: G(5, { w: 2 }), c: G(3, { w: 2 }), d: K(['de ruimtediagonalen', 'de ribben', 'de zijvlakken'], 'de ruimtediagonalen') },
            uitleg: 'Een kubus heeft 9 symmetrievlakken, een balk met vierkant grondvlak 5 en een gewone balk 3. Het symmetriemiddelpunt is het snijpunt van de ruimtediagonalen.' },
          { id: 'v12', titel: 'Symmetrieas en merkwaardige lijnen', type: 'mc', meerdere: true, hulp: ['symAs'], vraag: 'De symmetrieas van een gelijkbenige driehoek valt samen met …',
            opties: ['de hoogtelijn uit de top', 'de bissectrice van de tophoek', 'de zwaartelijn uit de top', 'de middelloodlijn van de basis', 'de bissectrice van een basishoek', 'een opstaande zijde'], juist: [0, 1, 2, 3],
            uitleg: 'In een gelijkbenige driehoek vallen de hoogtelijn uit de top, de bissectrice van de tophoek, de zwaartelijn uit de top en de middelloodlijn van de basis samen. Dat is de symmetrieas.' },
          { id: 'v13', titel: 'Begrippen bij symmetrie', type: 'invul', hulp: ['symAs', 'symPunt', 'symRuimte'], vraag: 'Vul aan.',
            sjabloon: 'Een figuur die spiegelsymmetrisch is om een as noem je ook [[a]]<br>Een figuur die spiegelsymmetrisch is om een punt noem je ook [[b]]<br>Een ruimtefiguur kan zichzelf als beeld hebben bij spiegeling om een [[c]]',
            velden: { a: K(['lijnsymmetrisch', 'puntsymmetrisch'], 'lijnsymmetrisch'), b: K(['lijnsymmetrisch', 'puntsymmetrisch'], 'puntsymmetrisch'), c: K(['symmetrievlak', 'symmetrieas', 'vector'], 'symmetrievlak') },
            uitleg: 'Lijnsymmetrisch betekent spiegelsymmetrisch om een as. Puntsymmetrisch betekent spiegelsymmetrisch om een punt. Bij ruimtefiguren spreek je van een symmetrievlak.' }
        ]
      }
    ]
  });
})();
