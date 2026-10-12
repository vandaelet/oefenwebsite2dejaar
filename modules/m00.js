/* TWEEDE JAAR - DIAGNOSTISCHE MODULE - Leerstof eerste jaar (Nando 2) */
(function () {
  'use strict';
  var V = window.Vragen, G = V.G, B = V.B, K = V.K;
  var OX = 8, OY = 5;                        // oorsprong op een bord van 16 bij 10
  function rijen(a) { return '<div class="rijen">' + a.map(function (x) { return '<div>' + x + '</div>'; }).join('') + '</div>'; }
  function as(n, x, y, extra) { return Object.assign({ n: n, x: x + OX, y: y + OY }, extra || {}); }
  function assenbord(extra) { return Object.assign({ b: 16, h: 10, rooster: 1, assen: { x: OX, y: OY } }, extra || {}); }
  var ELT = ['∈', '∉'], DEEL = ['⊂', '⊄'], ALLES = ['∈', '∉', '⊂', '⊄', '='], JN = ['ja', 'neen'], PM = ['+', '−'], VGL = ['<', '>', '='];
  var KW = ['eerste kwadrant', 'tweede kwadrant', 'derde kwadrant', 'vierde kwadrant', 'op een as'];
  var F = 'font-family="Poppins, sans-serif"';

  /* ---------- figuren ---------- */
  function svg(w, h, inhoud, label) { return '<svg class="vrij" viewBox="0 0 ' + w + ' ' + h + '" width="' + w + '" height="' + h + '" role="img" aria-label="' + label + '">' + inhoud + '</svg>'; }
  function tekst(x, y, t, extra) {
    extra = extra || '';
    var std = { 'font-size': '16', 'fill': '#2B2B2B', 'text-anchor': 'middle' };
    Object.keys(std).forEach(function (k) { if (extra.indexOf(k + '=') < 0) extra += ' ' + k + '="' + std[k] + '"'; });
    return '<text x="' + x + '" y="' + y + '" ' + F + ' paint-order="stroke" stroke="#fff" stroke-width="4" stroke-linejoin="round" ' + extra + '>' + t + '</text>';
  }

  var VLINDER = svg(380, 220,
    '<rect x="2" y="2" width="376" height="216" rx="10" fill="#FAFCFC" stroke="#D3DCDC" stroke-width="2"/>' +
    '<ellipse cx="140" cy="115" rx="100" ry="80" fill="rgba(61,183,181,.18)" stroke="#2B2B2B" stroke-width="2.5"/>' +
    '<ellipse cx="240" cy="115" rx="100" ry="80" fill="rgba(250,176,1,.20)" stroke="#2B2B2B" stroke-width="2.5"/>' +
    tekst(50, 30, 'A', 'font-weight="700" font-size="20"') + tekst(330, 30, 'B', 'font-weight="700" font-size="20"') +
    tekst(95, 85, '• T') + tekst(120, 125, '• R') + tekst(90, 160, '• E') + tekst(190, 118, '• M') + tekst(270, 90, '• S') + tekst(285, 145, '• O'),
    'Vlinderdiagram: in A alleen T, R en E; in A en B samen M; in B alleen S en O');

  function staafdiagram() {
    var d = [['appel', 6], ['banaan', 4], ['peer', 3], ['aardbei', 5], ['kiwi', 2]], s = '', x0 = 50, y0 = 200, sch = 25, bw = 46, gap = 22;
    for (var i = 0; i <= 7; i++) s += '<line x1="' + x0 + '" y1="' + (y0 - i * sch) + '" x2="' + (x0 + 5 * (bw + gap) + gap) + '" y2="' + (y0 - i * sch) + '" stroke="#E7EDED"/>' + tekst(x0 - 14, y0 - i * sch + 5, i, 'font-size="13"');
    d.forEach(function (r, i) {
      var x = x0 + gap + i * (bw + gap);
      s += '<rect x="' + x + '" y="' + (y0 - r[1] * sch) + '" width="' + bw + '" height="' + (r[1] * sch) + '" fill="#3DB7B5" stroke="#177A78" stroke-width="1.5"/>' + tekst(x + bw / 2, y0 + 20, r[0], 'font-size="13"');
    });
    s += '<line x1="' + x0 + '" y1="' + y0 + '" x2="' + x0 + '" y2="20" stroke="#2B2B2B" stroke-width="2"/><line x1="' + x0 + '" y1="' + y0 + '" x2="' + (x0 + 5 * (bw + gap) + gap) + '" y2="' + y0 + '" stroke="#2B2B2B" stroke-width="2"/>';
    s += tekst(x0 + 8, 14, 'aantal leerlingen', 'font-size="13" text-anchor="start"');
    return svg(420, 230, s, 'Staafdiagram van het favoriete fruit: appel 6, banaan 4, peer 3, aardbei 5, kiwi 2');
  }
  function dotplot() {
    var tel = { 0: 5, 5: 2, 8: 3, 10: 6, 12: 3, 15: 1 }, s = '', x0 = 30, y0 = 170, st = 30;
    s += '<line x1="' + x0 + '" y1="' + y0 + '" x2="' + (x0 + 15 * st + 10) + '" y2="' + y0 + '" stroke="#2B2B2B" stroke-width="2"/>';
    for (var i = 0; i <= 15; i++) s += '<line x1="' + (x0 + i * st) + '" y1="' + y0 + '" x2="' + (x0 + i * st) + '" y2="' + (y0 + 6) + '" stroke="#2B2B2B" stroke-width="1.5"/>' + tekst(x0 + i * st, y0 + 24, i, 'font-size="13"');
    Object.keys(tel).forEach(function (k) { for (var j = 0; j < tel[k]; j++) s += '<circle cx="' + (x0 + k * st) + '" cy="' + (y0 - 14 - j * 22) + '" r="8.5" fill="#3DB7B5" stroke="#177A78" stroke-width="1.5"/>'; });
    s += tekst(x0 + 7.5 * st, y0 + 46, 'aantal minuten aan de ontbijttafel', 'font-size="13"');
    return svg(510, 225, s, 'Dotplot: 0 minuten 5 keer, 5 minuten 2 keer, 8 minuten 3 keer, 10 minuten 6 keer, 12 minuten 3 keer, 15 minuten 1 keer');
  }
  function vlakkeFiguren() {
    var s = '', st = 'fill="rgba(61,183,181,.25)" stroke="#177A78" stroke-width="2.4"', hl = 'stroke="#2B2B2B" stroke-width="1.5" stroke-dasharray="5 4"', kl = 'font-size="14"';
    // a driehoek: basis 8, hoogte 5
    s += '<polygon points="20,150 180,150 120,50" ' + st + '/><line x1="120" y1="50" x2="120" y2="150" ' + hl + '/>' + tekst(100, 172, '8 cm', kl) + tekst(114, 108, '5 cm', kl + ' text-anchor="end"') + tekst(100, 205, 'a) driehoek', 'font-weight="600"');
    // b parallellogram: basis 6, hoogte 4
    s += '<polygon points="230,150 350,150 390,70 270,70" ' + st + '/><line x1="270" y1="70" x2="270" y2="150" ' + hl + '/>' + tekst(290, 172, '6 cm', kl) + tekst(292, 115, '4 cm', kl) + tekst(310, 205, 'b) parallellogram', 'font-weight="600"');
    // c trapezium: B 9, b 5, h 4
    s += '<polygon points="430,150 610,150 570,70 470,70" ' + st + '/><line x1="470" y1="70" x2="470" y2="150" ' + hl + '/>' + tekst(520, 172, '9 cm', kl) + tekst(520, 62, '5 cm', kl) + tekst(492, 115, '4 cm', kl) + tekst(520, 205, 'c) trapezium', 'font-weight="600"');
    // d ruit: diagonalen 8 en 6
    s += '<polygon points="730,40 790,110 730,180 670,110" ' + st + '/><line x1="730" y1="40" x2="730" y2="180" ' + hl + '/><line x1="670" y1="110" x2="790" y2="110" ' + hl + '/>' + tekst(746, 80, '8 cm', kl + ' text-anchor="start"') + tekst(700, 103, '6 cm', kl) + tekst(730, 205, 'd) ruit', 'font-weight="600"');
    return svg(810, 215, s, 'a) driehoek met basis 8 cm en hoogte 5 cm, b) parallellogram met basis 6 cm en hoogte 4 cm, c) trapezium met basissen 9 cm en 5 cm en hoogte 4 cm, d) ruit met diagonalen 8 cm en 6 cm');
  }
  function balk(l, b, h, lab, label) {
    var dx = 40, dy = 28, x0 = 30, y0 = 40 + dy, W = l, H = h, s = '', st = 'stroke="#177A78" stroke-width="2.2"';
    s += '<polygon points="' + x0 + ',' + y0 + ' ' + (x0 + W) + ',' + y0 + ' ' + (x0 + W) + ',' + (y0 + H) + ' ' + x0 + ',' + (y0 + H) + '" fill="rgba(61,183,181,.25)" ' + st + '/>';
    s += '<polygon points="' + x0 + ',' + y0 + ' ' + (x0 + dx) + ',' + (y0 - dy) + ' ' + (x0 + W + dx) + ',' + (y0 - dy) + ' ' + (x0 + W) + ',' + y0 + '" fill="rgba(61,183,181,.12)" ' + st + '/>';
    s += '<polygon points="' + (x0 + W) + ',' + y0 + ' ' + (x0 + W + dx) + ',' + (y0 - dy) + ' ' + (x0 + W + dx) + ',' + (y0 - dy + H) + ' ' + (x0 + W) + ',' + (y0 + H) + '" fill="rgba(61,183,181,.38)" ' + st + '/>';
    s += '<polyline points="' + x0 + ',' + (y0 + H) + ' ' + (x0 + dx) + ',' + (y0 - dy + H) + ' ' + (x0 + W + dx) + ',' + (y0 - dy + H) + '" fill="none" stroke="#177A78" stroke-width="1.4" stroke-dasharray="5 4"/><line x1="' + (x0 + dx) + '" y1="' + (y0 - dy) + '" x2="' + (x0 + dx) + '" y2="' + (y0 - dy + H) + '" stroke="#177A78" stroke-width="1.4" stroke-dasharray="5 4"/>';
    s += tekst(x0 + W / 2, y0 + H + 22, lab[0], 'font-size="14"') + tekst(x0 + W + dx / 2 + 8, y0 + H - dy / 2 + 16, lab[1], 'font-size="14" text-anchor="start"') + tekst(x0 + W + dx + 8, y0 - dy + H / 2 + 5, lab[2], 'font-size="14" text-anchor="start"');
    return svg(x0 + W + dx + 90, y0 + H + 36, s, label);
  }
  var CILINDER = svg(260, 250,
    '<path d="M60 50 L60 200 A70 20 0 0 0 200 200 L200 50" fill="rgba(61,183,181,.28)" stroke="#177A78" stroke-width="2.2"/>' +
    '<ellipse cx="130" cy="50" rx="70" ry="20" fill="rgba(61,183,181,.14)" stroke="#177A78" stroke-width="2.2"/>' +
    '<path d="M60 200 A70 20 0 0 1 200 200" fill="none" stroke="#177A78" stroke-width="1.4" stroke-dasharray="5 4"/>' +
    '<line x1="130" y1="50" x2="200" y2="50" stroke="#2B2B2B" stroke-width="1.6"/><circle cx="130" cy="50" r="3" fill="#2B2B2B"/>' +
    tekst(165, 42, '10 cm', 'font-size="14"') + '<line x1="225" y1="50" x2="225" y2="200" stroke="#2B2B2B" stroke-width="1.4"/>' + tekst(236, 130, '30 cm', 'font-size="14" text-anchor="start" transform="rotate(90 236 130)"'),
    'Cilinder met straal 10 cm en hoogte 30 cm');

  window.registreerModule({
    id: 'm00', nummer: 0, label: 'Diagnostische module', titel: 'Leerstof eerste jaar', domein: 'Herhaling van het eerste jaar', standaardActief: true,
    intro: 'Oefen op leerstof van het eerste jaar die je vlot moet beheersen. Kies zelf de onderdelen waarop je wil oefenen, of de onderdelen die je leerkracht opgeeft.',

    theorie: {
      symbolen: {
        titel: 'Symbolen bij verzamelingen', html:
          '<table><tr><th>symbool</th><th>lees je als</th><th>voorbeeld</th></tr><tr><td>∈</td><td>… is een element van …</td><td>−3 ∈ ℤ</td></tr><tr><td>∉</td><td>… is geen element van …</td><td>−3 ∉ ℕ</td></tr><tr><td>⊂</td><td>… is een deelverzameling van …</td><td>ℕ ⊂ ℤ</td></tr><tr><td>⊄</td><td>… is geen deelverzameling van …</td><td>ℚ ⊄ ℤ</td></tr></table>' +
          '<p>∈ en ∉ gebruik je tussen een <b>element</b> (een getal, een punt) en een verzameling. ⊂ en ⊄ gebruik je tussen twee <b>verzamelingen</b>.</p>' +
          '<p>ℕ = {0, 1, 2, 3, …}, ℤ = {…, −2, −1, 0, 1, 2, …} en ℚ bevat alle getallen die je als breuk kunt schrijven. Er geldt: ℕ ⊂ ℤ ⊂ ℚ. ℕ₀ is ℕ zonder 0.</p>' +
          '<p>Reken een getal eerst uit: −{12/4} = −3 is een geheel getal en √⟨16⟩ = 4 is een natuurlijk getal.</p>'
      },
      meetkundetaal: {
        titel: 'Symbolen in de meetkunde', html:
          '<p>Een punt is een element van een rechte, halfrechte of lijnstuk: A ∈ a. Een lijnstuk of halfrechte is een deelverzameling van een rechte: [AB] ⊂ a.</p>' +
          '<p>Liggen A en B op de rechte a, dan is de rechte AB dezelfde rechte als a: AB = a.</p>'
      },
      implicatie: {
        titel: 'De implicatiepijl en een tegenvoorbeeld', html:
          '<div class="def">a ⇒ b lees je als "als a, dan b". Uit de eerste uitspraak volgt altijd de tweede.</div>' +
          '<p>Volgt de tweede uitspraak niet altijd, dan geef je een <b>tegenvoorbeeld</b>: een geval dat aan de eerste uitspraak voldoet, maar niet aan de tweede.</p>' +
          '<div class="vb">"Als a een deler is van 8, dan is a een deler van 4" is niet waar. Tegenvoorbeeld: 8 is een deler van 8, maar geen deler van 4.</div>'
      },
      coordinaten: {
        titel: 'Coördinaten in een assenstelsel', html:
          '<p>Een punt noteer je met zijn coördinaat (x, y). Eerst lees je het <b>eerste coördinaatgetal</b> af op de x-as (horizontaal), daarna het <b>tweede coördinaatgetal</b> op de y-as (verticaal).</p>' +
          '<div class="vb">A(4, 2): 4 naar rechts en 2 naar boven. B(0, −3): niet naar links of rechts en 3 naar beneden.</div>' +
          '<table><tr><th>kwadrant</th><th>x</th><th>y</th></tr><tr><td>eerste</td><td>positief</td><td>positief</td></tr><tr><td>tweede</td><td>negatief</td><td>positief</td></tr><tr><td>derde</td><td>negatief</td><td>negatief</td></tr><tr><td>vierde</td><td>positief</td><td>negatief</td></tr></table>' +
          '<p>Ligt een coördinaatgetal op 0, dan ligt het punt op een as en in geen enkel kwadrant.</p><p>Bij een parallellogram ABCD verschuif je van B naar A op dezelfde manier als van C naar D.</p>'
      },
      optellen: {
        titel: 'Optellen en aftrekken van gehele getallen', html:
          '<ul><li><b>Zelfde teken:</b> tel de getallen zonder teken op en behoud het teken. −7 + (−3) = −10</li><li><b>Verschillend teken:</b> trek het kleinste getal zonder teken af van het grootste en neem het teken van het grootste. −11 + 5 = −6</li>' +
          '<li><b>Aftrekken</b> is optellen met het tegengestelde. 6 − (−2) = 6 + 2 = 8</li></ul>' +
          '<p>Bij een gedurige som schrijf je eerst alles zonder haakjes: + (−5) wordt − 5 en − (−5) wordt + 5. Daarna reken je van links naar rechts.</p>'
      },
      vermenigvuldigen: {
        titel: 'Vermenigvuldigen en delen van gehele getallen', html:
          '<table><tr><th>tekens</th><th>resultaat</th></tr><tr><td>+ · + en − · −</td><td>positief</td></tr><tr><td>+ · − en − · +</td><td>negatief</td></tr></table><p>Voor delen gelden dezelfde tekenregels.</p>' +
          '<p>Bij een gedurige product tel je de negatieve factoren: een <b>even</b> aantal geeft een positief product, een <b>oneven</b> aantal een negatief product.</p>' +
          '<div class="vb">2 · 3 · (−1) · (−2): twee mintekens, dus positief: 12</div>'
      },
      breukenplus: {
        titel: 'Optellen en aftrekken van rationale getallen', html:
          '<ol><li>Vereenvoudig de breuken als dat kan.</li><li>Maak de breuken gelijknamig met het kgv van de noemers.</li><li>Tel de tellers op of trek ze af. Behoud de noemer.</li><li>Vereenvoudig het resultaat.</li></ol>' +
          '<div class="vb">{2/3} − {1/4} = {8/12} − {3/12} = {5/12}</div><p>Een geheel getal schrijf je als breuk: 2 = {12/6}. Een kommagetal kun je ook als breuk schrijven: 2,4 = {12/5}.</p>' +
          '<p>Een negatieve breuk noteer je met het minteken in de teller: {−7/6}.</p>'
      },
      breukenmaal: {
        titel: 'Vermenigvuldigen en delen van rationale getallen', html:
          '<p><b>Vermenigvuldigen:</b> teller maal teller en noemer maal noemer. Vereenvoudig liefst vooraf.</p><div class="vb">{2/3} · {−9/4} = {−18/12} = {−3/2}</div>' +
          '<p><b>Delen</b> door een getal is vermenigvuldigen met het <b>omgekeerde</b> van dat getal. Het omgekeerde van {10/3} is {3/10}.</p><div class="vb">{−5/6} : {10/3} = {−5/6} · {3/10} = {−1/4}</div>' +
          '<p>"{1/3} van" betekent "{1/3} maal".</p>'
      },
      machten: {
        titel: 'Machten en vierkantswortels', html:
          '<p>In 2⁴ is 2 het <b>grondtal</b> en 4 de <b>exponent</b>: 2⁴ = 2 · 2 · 2 · 2 = 16.</p>' +
          '<ul><li>Een negatief grondtal met een <b>even</b> exponent geeft een positief resultaat: (−2)⁴ = 16.</li><li>Een negatief grondtal met een <b>oneven</b> exponent geeft een negatief resultaat: (−4)³ = −64.</li>' +
          '<li>Let op de haakjes: −1⁶ = −(1⁶) = −1, maar (−1)⁶ = 1.</li></ul>' +
          '<p>Een breuk tot een macht: teller en noemer allebei: ({−5/4})² = {25/16}.</p>' +
          '<div class="def">De <b>vierkantswortel</b> van een positief getal a is het positieve getal dat in het kwadraat a geeft: √⟨64⟩ = 8, want 8² = 64.</div><p>√⟨{81/49}⟩ = {9/7} en √⟨0,36⟩ = 0,6. De vierkantswortel van een negatief getal bestaat niet.</p>'
      },
      volgorde: {
        titel: 'Volgorde van bewerkingen', html:
          '<ol><li>Bewerkingen tussen haakjes</li><li>Machten en vierkantswortels</li><li>Vermenigvuldigen en delen, van links naar rechts</li><li>Optellen en aftrekken, van links naar rechts</li></ol>' +
          '<div class="vb">−4 + 24 : (−8) = −4 + (−3) = −7</div><div class="vb">4² − 2 · √⟨64⟩ − 2³ = 16 − 2 · 8 − 8 = 16 − 16 − 8 = −8</div>' +
          '<p>Let op het verschil: (−2)² · 3 = 4 · 3 = 12, maar −2² · 3 = −4 · 3 = −12.</p>'
      },
      vergelijkingen: {
        titel: 'Vergelijkingen oplossen', html:
          '<ul><li>Een term mag naar het andere lid als je hem van teken verandert: x + 7 = 3 wordt x = 3 − 7.</li><li>Een factor mag naar het andere lid als deler: 3x = −12 wordt x = −12 : 3.</li><li>Een deler mag naar het andere lid als factor: {x/4} = −2 wordt x = −2 · 4.</li></ul>' +
          '<div class="vb">5x + 3 = 2x − 9<br>5x − 2x = −9 − 3<br>3x = −12<br>x = −4</div><p>Controleer: vul de oplossing in in beide leden.</p>'
      },
      vraagstukken: {
        titel: 'Vraagstukken oplossen met een vergelijking', html:
          '<ol><li>Lees het vraagstuk goed. Wat zoek je? Noem dat x.</li><li>Schrijf de andere gegevens met x.</li><li>Stel een vergelijking op en los ze op.</li><li>Controleer en formuleer een antwoordzin.</li></ol>' +
          '<div class="vb">Twee kinderen krijgen elk 10 euro korting en betalen samen 110 euro. x is de normale prijs per kind: 2 · (x − 10) = 110, dus x − 10 = 55 en x = 65.</div>'
      },
      verzamelingen: {
        titel: 'Bewerkingen met verzamelingen', html:
          '<table><tr><th>symbool</th><th>naam</th><th>betekenis</th></tr><tr><td>A ∪ B</td><td>unie</td><td>in A <b>of</b> in B (of in allebei)</td></tr><tr><td>A ∩ B</td><td>doorsnede</td><td>in A <b>en</b> in B</td></tr><tr><td>A \\ B</td><td>verschil</td><td>in A <b>maar niet</b> in B</td></tr></table>' +
          '<div class="vb">A = {2, 4, 6, 8} en B = {1, 4, 9}<br>A ∩ B = {4}, B \\ A = {1, 9}, A ∪ B = {1, 2, 4, 6, 8, 9}</div>'
      },
      procenten: {
        titel: 'Procenten', html:
          '<p>Procent betekent per honderd. 20 % van 180 = 0,20 · 180 = 36.</p>' +
          '<ul><li>Een <b>stijging</b> met 20 %: de nieuwe waarde is 120 % van de oude, dus maal 1,20.</li><li>Een <b>korting</b> van 20 %: je betaalt 80 %, dus maal 0,80.</li><li>Het <b>percentage</b> zoeken: deel en vermenigvuldig met 100. 15 van de 24 is 15 : 24 = 0,625 = 62,5 %.</li><li>Het <b>geheel</b> zoeken: 6 % van x is 9, dus 0,06 · x = 9 en x = 150.</li></ul>' +
          '<p>Twee kortingen na elkaar tel je niet zomaar op: de tweede korting wordt berekend op de prijs die al verminderd is.</p>'
      },
      data: {
        titel: 'Data interpreteren', html:
          '<table><tr><th>begrip</th><th>betekenis</th></tr><tr><td>rekenkundig gemiddelde</td><td>de som van alle waarden gedeeld door het aantal waarden</td></tr><tr><td>mediaan</td><td>de middelste waarde als je de waarden rangschikt (bij een even aantal: het gemiddelde van de twee middelste)</td></tr><tr><td>modus</td><td>de waarde die het vaakst voorkomt</td></tr><tr><td>variatiebreedte</td><td>de grootste waarde min de kleinste waarde</td></tr></table>' +
          '<div class="vb">4, 7, 7, 9, 13: gemiddelde (4 + 7 + 7 + 9 + 13) : 5 = 8, mediaan 7, modus 7, variatiebreedte 13 − 4 = 9</div><p>De mediaan verandert weinig door een uitschieter, het gemiddelde wel.</p>'
      },
      metriek: {
        titel: 'Het metriek stelsel', html:
          '<p><b>Lengte:</b> km, hm, dam, m, dm, cm, mm. Elke stap is maal of gedeeld door 10.</p>' +
          '<p><b>Oppervlakte:</b> km², hm², dam², m², dm², cm², mm². Elke stap is maal of gedeeld door 100. 1 hm² = 1 ha en 1 dam² = 1 a.</p>' +
          '<p><b>Volume:</b> m³, dm³, cm³, mm³. Elke stap is maal of gedeeld door 1000.</p>' +
          '<p><b>Inhoud:</b> kl, hl, dal, l, dl, cl, ml. Elke stap is maal of gedeeld door 10. 1 dm³ = 1 l en 1 cm³ = 1 ml.</p>' +
          '<p><b>Massa:</b> kg, hg, dag, g, dg, cg, mg. 1 kg = 1000 g en 1 g = 1000 mg.</p>'
      },
      vlak: {
        titel: 'Omtrek en oppervlakte van vlakke figuren', html:
          '<table><tr><th>figuur</th><th>oppervlakte</th></tr><tr><td>rechthoek</td><td>A = l · b</td></tr><tr><td>vierkant</td><td>A = z · z = z²</td></tr><tr><td>driehoek</td><td>A = {b · h/2}</td></tr><tr><td>parallellogram</td><td>A = b · h</td></tr><tr><td>trapezium</td><td>A = {(B + b) · h/2}</td></tr><tr><td>ruit</td><td>A = {D · d/2}</td></tr><tr><td>cirkel</td><td>A = π · r²</td></tr></table>' +
          '<p>De <b>omtrek</b> is de lengte van de rand: de som van alle zijden. De omtrek van een cirkel is p = 2 · π · r.</p><p>Vergeet de eenheid niet: een omtrek in cm, een oppervlakte in cm².</p>'
      },
      ruimte: {
        titel: 'Oppervlakte en volume van ruimtefiguren', html:
          '<table><tr><th>ruimtefiguur</th><th>totale oppervlakte</th><th>volume</th></tr><tr><td>kubus</td><td>A<sub>t</sub> = 6 · z²</td><td>V = z³</td></tr><tr><td>balk</td><td>A<sub>t</sub> = 2 · (l · b + l · h + b · h)</td><td>V = l · b · h</td></tr><tr><td>cilinder</td><td></td><td>V = π · r² · h</td></tr></table>' +
          '<p>De totale oppervlakte is de som van de oppervlakten van alle zijvlakken. Een volume druk je uit in cm³, dm³ of m³. 1 dm³ = 1 liter.</p>'
      }
    },

    delen: [
      /* ============ 1 WISKUNDETAAL ============ */
      {
        id: 'd1', nr: '1', titel: 'Wiskundetaal', info: 'Deze voorkennis heb je nodig vanaf module 1.', hulp: ['symbolen', 'implicatie'], vragen: [
          { id: 'v01', titel: 'Symbolen en hun betekenis', type: 'sleep', vraag: 'Koppel elk symbool aan de juiste betekenis.',
            paren: [['∈', '… is een element van …'], ['∉', '… is geen element van …'], ['⊂', '… is een deelverzameling van …'], ['⊄', '… is geen deelverzameling van …'], ['⇒', 'als … dan …']],
            uitleg: '∈ en ∉ gaan over elementen, ⊂ en ⊄ over deelverzamelingen. De pijl ⇒ lees je als "als … dan …".' },
          { id: 'v02', titel: 'Element of niet', type: 'invul', hulp: ['symbolen'], vraag: 'Vul in met ∈ of ∉.',
            sjabloon: rijen(['−3 [[a]] ℕ', '−3 [[b]] ℤ', '{2/3} [[c]] ℤ', '{2/3} [[d]] ℚ', '−{12/4} [[e]] ℤ', '0,75 [[f]] ℚ', '0 [[g]] ℕ₀', '√⟨16⟩ [[h]] ℕ']),
            velden: { a: K(ELT, '∉'), b: K(ELT, '∈'), c: K(ELT, '∉'), d: K(ELT, '∈'), e: K(ELT, '∈'), f: K(ELT, '∈'), g: K(ELT, '∉'), h: K(ELT, '∈') },
            tip: 'Reken eerst uit welk getal er staat.', uitleg: '−{12/4} = −3 is een geheel getal en √⟨16⟩ = 4 is een natuurlijk getal. ℕ₀ bevat 0 niet.' },
          { id: 'v03', titel: 'Deelverzameling of niet', type: 'invul', hulp: ['symbolen'], vraag: 'Vul in met ⊂ of ⊄.',
            sjabloon: rijen(['ℕ [[a]] ℤ', 'ℚ [[b]] ℤ', '{2, 4, 6, 8, …} [[c]] ℕ', '{−1, 0, 1} [[d]] ℕ', 'ℤ⁻ [[e]] ℚ', 'ℕ₀ [[f]] ℕ']),
            velden: { a: K(DEEL, '⊂'), b: K(DEEL, '⊄'), c: K(DEEL, '⊂'), d: K(DEEL, '⊄'), e: K(DEEL, '⊂'), f: K(DEEL, '⊂') },
            uitleg: 'ℕ ⊂ ℤ ⊂ ℚ. ℚ ⊄ ℤ, want {1/2} ∉ ℤ. {−1, 0, 1} ⊄ ℕ, want −1 ∉ ℕ.' },
          { id: 'v04', titel: 'Symbolen in een figuur', type: 'invul', hulp: ['meetkundetaal', 'symbolen'], vraag: 'Bekijk de figuur. Vul in met ∈, ∉, ⊂, ⊄ of =.',
            figuur: { bord: { b: 11, h: 5, punten: [{ n: 'A', x: 2, y: 1.5, lp: [-0.1, 0.45] }, { n: 'B', x: 5, y: 2.5, lp: [-0.1, 0.45] }, { n: 'C', x: 8, y: 3.5, lp: [-0.1, 0.45] }, { n: 'D', x: 7, y: 1.2 }], lijnen: [{ t: 'rechte', p: ['A', 'C'], n: 'a' }] } },
            sjabloon: rijen(['A [[a]] a', 'D [[b]] a', '[AB] [[c]] a', '[AD] [[d]] a', 'AB [[e]] a', 'C [[f]] [AB]']),
            velden: { a: K(ALLES, '∈'), b: K(ALLES, '∉'), c: K(ALLES, '⊂'), d: K(ALLES, '⊄'), e: K(ALLES, '='), f: K(ALLES, '∉') },
            uitleg: 'A ligt op a, D niet. [AB] ligt helemaal op a, [AD] niet. De rechte AB is dezelfde rechte als a. C ligt op a, maar buiten het lijnstuk [AB].' },
          { id: 'v05', titel: 'Volgt het ene uit het andere?', type: 'invul', hulp: ['implicatie'], vraag: 'Volgt uitspraak II altijd uit uitspraak I?',
            sjabloon: '<table><tr><th>uitspraak I</th><th>uitspraak II</th><th>volgt II uit I?</th></tr><tr><td>a is een veelvoud van 9.</td><td>a is een veelvoud van 3.</td><td>[[a]]</td></tr><tr><td>a is een deler van 8.</td><td>a is een deler van 4.</td><td>[[b]]</td></tr><tr><td>a is een even priemgetal.</td><td>a = 2</td><td>[[c]]</td></tr><tr><td>a ⫽ b en b ⫽ c</td><td>a ⫽ c</td><td>[[d]]</td></tr><tr><td>A ligt even ver van B als van C.</td><td>A is het midden van [BC].</td><td>[[e]]</td></tr></table>',
            velden: { a: K(JN, 'ja'), b: K(JN, 'neen'), c: K(JN, 'ja'), d: K(JN, 'ja'), e: K(JN, 'neen') },
            uitleg: 'Elk negenvoud is een drievoud. 8 is een deler van 8 maar niet van 4. Het enige even priemgetal is 2. A kan op de middelloodlijn van [BC] liggen zonder op [BC] te liggen.' },
          { id: 'v06', titel: 'Een tegenvoorbeeld zoeken', type: 'mc', hulp: ['implicatie'], vraag: '"Als a een deler is van 8, dan is a een deler van 4." Welk getal is een tegenvoorbeeld?',
            opties: ['8', '4', '2', '1'], juist: 0, vast: true, uitleg: '8 is een deler van 8, maar geen deler van 4. 1, 2 en 4 zijn delers van 8 én van 4: dat zijn geen tegenvoorbeelden.' },
          { id: 'v07', titel: 'Tegenvoorbeeld in de meetkunde', type: 'mc', hulp: ['implicatie'], vraag: '"Als A even ver ligt van B als van C, dan is A het midden van [BC]." Welke situatie is een tegenvoorbeeld?',
            opties: ['A ligt boven [BC], even ver van B als van C.', 'A ligt op [BC], dichter bij B dan bij C.', 'A valt samen met het midden van [BC].', 'A ligt op de rechte BC, voorbij C.'], juist: 0,
            uitleg: 'Een tegenvoorbeeld voldoet aan de eerste uitspraak (even ver van B als van C) maar niet aan de tweede (A ligt niet op [BC]). Dat is zo voor elk punt op de middelloodlijn van [BC], behalve het midden zelf.' }
        ]
      },

      /* ============ 2 COÖRDINATEN ============ */
      {
        id: 'd2', nr: '2', titel: 'Coördinaten', info: 'Deze voorkennis heb je nodig vanaf module 1.', hulp: ['coordinaten'], vragen: [
          { id: 'v01', titel: 'Coördinaten aflezen', type: 'invul', vraag: 'Noteer de coördinaat van elk punt.',
            figuur: { bord: assenbord({ punten: [as('A', 4, 2), as('B', 0, -3), as('C', -4, -2), as('D', -1, 4), as('E', -2, 0, { lp: [0.3, 0.4] }), as('F', 3, -2)] }) },
            sjabloon: rijen(['A( [[a1]] , [[a2]] )', 'B( [[b1]] , [[b2]] )', 'C( [[c1]] , [[c2]] )', 'D( [[d1]] , [[d2]] )', 'E( [[e1]] , [[e2]] )', 'F( [[f1]] , [[f2]] )']),
            velden: { a1: G(4, { w: 2 }), a2: G(2, { w: 2 }), b1: G(0, { w: 2 }), b2: G(-3, { w: 2 }), c1: G(-4, { w: 2 }), c2: G(-2, { w: 2 }), d1: G(-1, { w: 2 }), d2: G(4, { w: 2 }), e1: G(-2, { w: 2 }), e2: G(0, { w: 2 }), f1: G(3, { w: 2 }), f2: G(-2, { w: 2 }) },
            tip: 'Eerst x (horizontaal), dan y (verticaal).', uitleg: 'Het eerste coördinaatgetal lees je af op de x-as, het tweede op de y-as. B ligt op de y-as, dus x = 0. E ligt op de x-as, dus y = 0.' },
          { id: 'v02', titel: 'Punten plaatsen', type: 'teken', vraag: 'Plaats de punten A(−4, 2), B(3, 0) en C(4, −3) in het assenstelsel.',
            bord: assenbord(), gereedschap: ['punt'], nieuw: ['A', 'B', 'C'],
            controle: [{ c: 'punt', n: 'A', bij: [OX - 4, OY + 2] }, { c: 'punt', n: 'B', bij: [OX + 3, OY] }, { c: 'punt', n: 'C', bij: [OX + 4, OY - 3] }],
            tip: 'Kies Punt en klik op het juiste roosterpunt. De punten krijgen de namen A, B en C in die volgorde.', uitleg: 'A: 4 naar links en 2 naar boven. B: 3 naar rechts, op de x-as. C: 4 naar rechts en 3 naar beneden.' },
          { id: 'v03', titel: 'Welke driehoek?', type: 'mc', vraag: 'Geef de best passende naam voor de driehoek ABC met A(−4, 2), B(3, 0) en C(4, −3).',
            figuur: { bord: assenbord({ punten: [as('A', -4, 2), as('B', 3, 0, { lp: [0.35, 0.35] }), as('C', 4, -3)], veelhoeken: [{ p: ['A', 'B', 'C'], kl: 'blauw' }] }) },
            opties: ['stomphoekige driehoek', 'rechthoekige driehoek', 'scherphoekige driehoek', 'gelijkzijdige driehoek'], juist: 0, vast: true,
            uitleg: 'De hoek bij B is groter dan 90°. Een driehoek met een stompe hoek is een stomphoekige driehoek.' },
          { id: 'v04', titel: 'Een parallellogram afwerken', type: 'teken', vraag: 'Plaats een punt D zodat ABCD een parallellogram is.',
            bord: assenbord({ punten: [as('A', -4, 2), as('B', 3, 0, { lp: [0.35, 0.35] }), as('C', 4, -3)], lijnen: [{ t: 'lijnstuk', p: ['A', 'B'] }, { t: 'lijnstuk', p: ['B', 'C'] }] }),
            gereedschap: ['punt', 'lijnstuk'], nieuw: ['D'], controle: [{ c: 'punt', n: 'D', bij: [OX - 3, OY - 1] }],
            tip: 'Tel hoe je van B naar A gaat. Ga vanuit C op dezelfde manier.', uitleg: 'Van B naar A ga je 7 naar links en 2 naar boven. Vanuit C(4, −3) kom je zo in D(−3, −1).' },
          { id: 'v05', titel: 'In welk kwadrant?', type: 'invul', vraag: 'Waar ligt elk punt?',
            sjabloon: rijen(['(−3, 2) ligt in het [[a]]', '(4, −1) ligt in het [[b]]', '(−2, −5) ligt in het [[c]]', '(0, 3) ligt [[d]]', '(5, 5) ligt in het [[e]]']),
            velden: { a: K(KW, 'tweede kwadrant'), b: K(KW, 'vierde kwadrant'), c: K(KW, 'derde kwadrant'), d: K(KW, 'op een as'), e: K(KW, 'eerste kwadrant') },
            uitleg: 'Eerste kwadrant (+, +), tweede (−, +), derde (−, −), vierde (+, −). Is een coördinaatgetal 0, dan ligt het punt op een as.' },
          { id: 'v06', titel: 'Eerste coördinaatgetal 3', type: 'teken', vraag: 'Teken vier roosterpunten waarvan het eerste coördinaatgetal 3 is.',
            bord: assenbord(), gereedschap: ['punt'], controle: [{ c: 'punten', min: 4, voorwaarde: function (x) { return x === 3; }, opl: [[3, -2], [3, -1], [3, 1], [3, 2]] }],
            uitleg: 'Alle punten met eerste coördinaatgetal 3 liggen op een verticale rechte, 3 eenheden rechts van de y-as.' },
          { id: 'v07', titel: 'Tegengestelde coördinaatgetallen', type: 'teken', vraag: 'Teken vijf roosterpunten waarvan de twee coördinaatgetallen tegengesteld zijn.',
            bord: assenbord(), gereedschap: ['punt'], controle: [{ c: 'punten', min: 5, voorwaarde: function (x, y) { return x === -y; }, opl: [[-2, 2], [-1, 1], [0, 0], [1, -1], [2, -2]] }],
            tip: 'Tegengestelde getallen zijn bijvoorbeeld 3 en −3.', uitleg: 'Bijvoorbeeld (−2, 2), (1, −1) en (0, 0). Al die punten liggen op één schuine rechte door de oorsprong.' },
          { id: 'v08', titel: 'Derde kwadrant', type: 'teken', vraag: 'Teken alle roosterpunten van dit rooster die in het derde kwadrant liggen en waarvan het tweede coördinaatgetal −2 is.',
            bord: assenbord(), gereedschap: ['punt'], controle: [{ c: 'punten', min: 7, voorwaarde: function (x, y) { return x < 0 && y === -2; }, opl: [[-7, -2], [-6, -2], [-5, -2], [-4, -2], [-3, -2], [-2, -2], [-1, -2]] }],
            tip: 'In het derde kwadrant zijn beide coördinaatgetallen negatief.', uitleg: 'Het zijn de punten (−1, −2), (−2, −2), … tot (−7, −2): zeven punten op dit rooster. (0, −2) ligt op de y-as en hoort er niet bij.' }
        ]
      },

      /* ============ 3 OPTELLEN EN AFTREKKEN VAN GEHELE GETALLEN ============ */
      {
        id: 'd3', nr: '3', titel: 'Optellen en aftrekken van gehele getallen', info: 'Deze voorkennis heb je nodig vanaf module 2.', hulp: ['optellen'], vragen: [
          { id: 'v01', titel: 'Optellen', type: 'invul', vraag: 'Bereken.',
            sjabloon: rijen(['−7 + (−3) = [[a]]', '24 + (−16) = [[b]]', '−11 + 5 = [[c]]', '−18 + (−9) = [[d]]']), velden: { a: G(-10), b: G(8), c: G(-6), d: G(-27) },
            uitleg: 'Zelfde teken: optellen en het teken behouden. Verschillend teken: aftrekken en het teken van het grootste getal nemen.' },
          { id: 'v02', titel: 'Aftrekken', type: 'invul', vraag: 'Bereken.',
            sjabloon: rijen(['6 − (−2) = [[a]]', '−9 − 13 = [[b]]', '18 − (−12) = [[c]]', '−4 − (−9) = [[d]]']), velden: { a: G(8), b: G(-22), c: G(30), d: G(5) },
            tip: 'Aftrekken is optellen met het tegengestelde.', uitleg: '6 + 2 = 8; −9 + (−13) = −22; 18 + 12 = 30; −4 + 9 = 5.' },
          { id: 'v03', titel: 'Gedurige som', type: 'stappen', vraag: 'Bereken 10 − 3 − (−5) + (−2).',
            stappen: ['Schrijf zonder haakjes: 10 − 3 [[a]] 5 [[b]] 2', 'Reken uit: [[c]]'], velden: { a: K(PM, '+'), b: K(PM, '−'), c: G(10) },
            uitleg: '− (−5) wordt + 5 en + (−2) wordt − 2. Dan: 10 − 3 + 5 − 2 = 10.' },
          { id: 'v04', titel: 'Langere gedurige som', type: 'invul', vraag: 'Bereken.',
            sjabloon: '−8 + (−3) − (−2) − 11 − 1 = [[a]]<br>3 + 5 − 7 + (−4) = [[b]]<br>10 − (−2) + (−4) + (−6) − (−8) = [[c]]', velden: { a: G(-21), b: G(-3), c: G(10) },
            uitleg: '−8 − 3 + 2 − 11 − 1 = −21. 3 + 5 − 7 − 4 = −3. 10 + 2 − 4 − 6 + 8 = 10.' },
          { id: 'v05', titel: 'Welk getal werd afgetrokken?', type: 'stappen', vraag: 'Welk getal werd van −12 afgetrokken als het verschil 4 is?',
            stappen: ['−12 − x = 4, dus x = −12 − [[a]]', 'x = [[b]]'], velden: { a: G(4, { w: 3 }), b: G(-16) },
            uitleg: '−12 − (−16) = −12 + 16 = 4. Het getal is −16.' },
          { id: 'v06', titel: 'Bewerkingen noteren', type: 'invul', vraag: 'Bereken.',
            sjabloon: 'De som met termen 9 en −3 is [[a]]<br>Het verschil met aftrektal −12 en aftrekker −4 is [[b]]<br>Finn heeft 15 euro. Hij komt 9 euro tekort om een T-shirt te kopen. Het T-shirt kost [[c]] euro.', velden: { a: G(6), b: G(-8), c: G(24) },
            uitleg: '9 + (−3) = 6. −12 − (−4) = −12 + 4 = −8. Het T-shirt kost 15 + 9 = 24 euro.' },
          { id: 'v07', titel: 'Positief, negatief of nul', type: 'sleep', vraag: 'Is het resultaat positief, negatief of nul?',
            vakken: ['positief', 'negatief', 'nul'], items: [['−5 + 8', 0], ['4 − (−3)', 0], ['3 − 7', 1], ['−2 − 9', 1], ['−6 − (−6)', 2], ['−10 + 10', 2]],
            uitleg: '−5 + 8 = 3 en 4 − (−3) = 7. 3 − 7 = −4 en −2 − 9 = −11. −6 − (−6) = 0 en −10 + 10 = 0.' },
          { id: 'v08', titel: 'Temperaturen', type: 'invul', vraag: 'Om 6 uur is het −4 °C.',
            sjabloon: 'Om 14 uur is het 7 graden warmer: [[a]] °C<br>In de nacht daalt de temperatuur van 3 °C met 9 graden: [[b]] °C', velden: { a: G(3), b: G(-6) },
            uitleg: '−4 + 7 = 3 en 3 − 9 = −6.' }
        ]
      },

      /* ============ 4 VERMENIGVULDIGEN EN DELEN VAN GEHELE GETALLEN ============ */
      {
        id: 'd4', nr: '4', titel: 'Vermenigvuldigen en delen van gehele getallen', info: 'Deze voorkennis heb je nodig vanaf module 2.', hulp: ['vermenigvuldigen'], vragen: [
          { id: 'v01', titel: 'Vermenigvuldigen en delen', type: 'invul', vraag: 'Bereken.',
            sjabloon: rijen(['−6 · (−7) = [[a]]', '−4 · 8 = [[b]]', '5 · (−3) = [[c]]', '−42 : 3 = [[d]]', '−30 : (−5) = [[e]]', '−17 · (−2) = [[f]]']),
            velden: { a: G(42), b: G(-32), c: G(-15), d: G(-14), e: G(6), f: G(34) },
            uitleg: 'Zelfde tekens geven een positief resultaat, verschillende tekens een negatief resultaat.' },
          { id: 'v02', titel: 'Gedurige product in stappen', type: 'stappen', vraag: 'Bereken 2 · 3 · (−1) · (−2).',
            stappen: ['Aantal negatieve factoren: [[a]]', 'Het product is dus [[b]]', 'Het product is [[c]]'], velden: { a: G(2, { w: 2 }), b: K(['positief', 'negatief'], 'positief'), c: G(12) },
            uitleg: 'Twee negatieve factoren is een even aantal, dus het product is positief: 2 · 3 · 1 · 2 = 12.' },
          { id: 'v03', titel: 'Gedurige producten', type: 'invul', vraag: 'Bereken.',
            sjabloon: '3 · (−1) · (−5) · 2 · 2 = [[a]]<br>−2 · 3 · 5 · (−1) · (−1) = [[b]]<br>(−1) · (−2) · (−3) · (−4) · (−5) = [[c]]', velden: { a: G(60), b: G(-30), c: G(-120) },
            uitleg: 'Tel de negatieve factoren: 2 (positief), 3 (negatief) en 5 (negatief).' },
          { id: 'v04', titel: 'Teken van een product', type: 'mc', vraag: 'Een product heeft vijf factoren. Drie daarvan zijn negatief, geen enkele is nul. Het product is …',
            opties: ['negatief', 'positief', 'nul', 'dat kun je niet weten'], juist: 0, vast: true, uitleg: 'Drie negatieve factoren is een oneven aantal. Het product is dus negatief.' },
          { id: 'v05', titel: 'Vergelijken', type: 'invul', vraag: 'Vul in met &lt;, &gt; of =.',
            sjabloon: rijen(['−3 · (−6) [[a]] 2 · (−9)', '4 · (−5) [[b]] −20', '−2 · 7 [[c]] −6 · (−6)', '−56 : 7 [[d]] −2 · 4']),
            velden: { a: K(VGL, '>'), b: K(VGL, '='), c: K(VGL, '<'), d: K(VGL, '=') },
            uitleg: '18 &gt; −18; −20 = −20; −14 &lt; 36; −8 = −8.' },
          { id: 'v06', titel: 'Ontbrekende getallen', type: 'invul', vraag: 'Vul aan.',
            sjabloon: 'Het product van de factoren −4 en −8 is [[a]]<br>Het quotiënt met deeltal −54 en deler −9 is [[b]]<br>−8 · [[c]] = 56<br>[[d]] : (−6) = 7', velden: { a: G(32), b: G(6), c: G(-7), d: G(-42) },
            uitleg: '−4 · (−8) = 32. −54 : (−9) = 6. −8 · (−7) = 56. −42 : (−6) = 7.' },
          { id: 'v07', titel: 'In context', type: 'invul', vraag: 'Bereken.',
            sjabloon: 'Laurien eet in september 13 keer een warme maaltijd op school en betaalt 65 euro. Eén maaltijd kost [[a]] euro.<br>De temperatuur daalt 5 uur lang met 3 graden per uur. De temperatuur verandert in totaal met [[b]] graden.', velden: { a: G(5), b: G(-15) },
            uitleg: '65 : 13 = 5. Een daling noteer je negatief: 5 · (−3) = −15.' }
        ]
      },

      /* ============ 5 OPTELLEN EN AFTREKKEN VAN RATIONALE GETALLEN ============ */
      {
        id: 'd5', nr: '5', titel: 'Optellen en aftrekken van rationale getallen', info: 'Deze voorkennis heb je nodig vanaf module 2.', hulp: ['breukenplus'], vragen: [
          { id: 'v01', titel: 'Gelijknamig maken', type: 'stappen', vraag: 'Bereken {2/3} − {1/4}.',
            stappen: ['kgv (3, 4) = [[k]]', 'Maak gelijknamig: [[a]] − [[b]]', 'Het verschil is [[c]]'], velden: { k: G(12, { w: 3 }), a: B(8, 12), b: B(3, 12), c: B(5, 12) },
            uitleg: '{2/3} − {1/4} = {8/12} − {3/12} = {5/12}' },
          { id: 'v02', titel: 'Som en verschil', type: 'invul', vraag: 'Bereken. Noteer je antwoord als een onvereenvoudigbare breuk.',
            sjabloon: rijen(['2 + ({−5/6}) = [[a]]', '{35/15} − {21/14} = [[b]]', '−4 − ({−17/6}) = [[c]]', '{13/5} − 2,4 = [[d]]']), velden: { a: B(7, 6), b: B(5, 6), c: B(-7, 6), d: B(1, 5) },
            tip: 'Een negatieve breuk noteer je met het minteken in de teller.', uitleg: '{12/6} − {5/6} = {7/6}. {7/3} − {3/2} = {14/6} − {9/6} = {5/6}. {−24/6} + {17/6} = {−7/6}. {13/5} − {12/5} = {1/5}.' },
          { id: 'v03', titel: 'Meer sommen', type: 'invul', vraag: 'Bereken.',
            sjabloon: rijen(['−0,75 + 2,25 = [[a]]', '{−5/6} + {7/6} = [[b]]', '−{1/2} − {1/3} = [[c]]', '{3/4} − ({−5/6}) = [[d]]']), velden: { a: G(1.5), b: B(1, 3), c: B(-5, 6), d: B(19, 12) },
            uitleg: '−0,75 + 2,25 = 1,5. {2/6} = {1/3}. {−3/6} − {2/6} = {−5/6}. {9/12} + {10/12} = {19/12}.' },
          { id: 'v04', titel: 'Sportdag', type: 'invul', vraag: 'Op een sportdag kiezen de leerlingen uit watersporten, zaalsporten en survival. {2/7} van de leerlingen kiest watersporten en {1/3} kiest zaalsporten.',
            sjabloon: 'Het deel van de leerlingen dat survival kiest: [[a]]', velden: { a: B(8, 21) },
            tip: 'Alle leerlingen samen is 1 geheel.', uitleg: '1 − {2/7} − {1/3} = {21/21} − {6/21} − {7/21} = {8/21}' },
          { id: 'v05', titel: 'Zoek de breuk', type: 'invul', vraag: 'Bereken.',
            sjabloon: 'Welke breuk is {2/3} minder dan {1/4}? [[a]]<br>Welke breuk moet je bij {−3/5} optellen om {2/3} te krijgen? [[b]]', velden: { a: B(-5, 12), b: B(19, 15) },
            uitleg: '{1/4} − {2/3} = {3/12} − {8/12} = {−5/12}. {2/3} − ({−3/5}) = {10/15} + {9/15} = {19/15}.' },
          { id: 'v06', titel: 'Een cocktail', type: 'invul', vraag: 'Een alcoholvrije cocktail bestaat voor {1/3} uit sinaasappelsap, voor {1/4} uit water, voor {1/6} uit siroop en de rest is bruiswater.',
            sjabloon: 'Het deel bruiswater: [[a]]', velden: { a: B(1, 4) }, uitleg: '1 − {1/3} − {1/4} − {1/6} = {12/12} − {4/12} − {3/12} − {2/12} = {3/12} = {1/4}' },
          { id: 'v07', titel: 'Rangschikken', type: 'volgorde', vraag: 'Rangschik van klein naar groot.', boven: 'het kleinste',
            items: ['−{3/4}', '−0,7', '−{2/3}', '{1/2}', '{5/8}'], uitleg: '−0,75 &lt; −0,7 &lt; −0,666… &lt; 0,5 &lt; 0,625' },
          { id: 'v08', titel: 'Op de getallenas', type: 'getallenas', vraag: 'Plaats de getallen op de getallenas. Elk streepje is een kwart.',
            min: -2, max: 2, stap: 0.25, naam: 'ℚ', punten: [{ l: '−{3/2}', w: -1.5 }, { l: '{3/4}', w: 0.75 }, { l: '−0,25', w: -0.25 }, { l: '{5/4}', w: 1.25 }],
            uitleg: '−{3/2} = −1,5; {3/4} = 0,75; {5/4} = 1,25.' }
        ]
      },

      /* ============ 6 VERMENIGVULDIGEN EN DELEN VAN RATIONALE GETALLEN ============ */
      {
        id: 'd6', nr: '6', titel: 'Vermenigvuldigen en delen van rationale getallen', info: 'Deze voorkennis heb je nodig vanaf module 2.', hulp: ['breukenmaal'], vragen: [
          { id: 'v01', titel: 'Vermenigvuldigen', type: 'invul', vraag: 'Bereken. Noteer je antwoord als een onvereenvoudigbare breuk of als een kommagetal.',
            sjabloon: rijen(['{2/3} · {−9/4} = [[a]]', '({−3/8}) · ({−4/9}) = [[b]]', '0,2 · (−0,4) = [[c]]', '{4/5} : 2 = [[d]]']), velden: { a: B(-3, 2), b: B(1, 6), c: G(-0.08), d: B(2, 5) },
            uitleg: '{−18/12} = {−3/2}. {12/72} = {1/6}. 0,2 · (−0,4) = −0,08. {4/5} · {1/2} = {2/5}.' },
          { id: 'v02', titel: 'Delen door een breuk', type: 'stappen', vraag: 'Bereken {−5/6} : {10/3}.',
            stappen: ['Vermenigvuldig met het omgekeerde: {−5/6} · [[a]]', 'Het quotiënt is [[b]]'], velden: { a: B(3, 10), b: B(-1, 4) },
            uitleg: '{−5/6} · {3/10} = {−15/60} = {−1/4}' },
          { id: 'v03', titel: 'Het omgekeerde', type: 'invul', vraag: 'Vul aan.',
            sjabloon: rijen(['Het omgekeerde van {−3/7} is [[a]]', 'Het omgekeerde van 4 is [[b]]', 'Delen door {2/5} is vermenigvuldigen met [[c]]']), velden: { a: B(-7, 3), b: B(1, 4), c: B(5, 2) },
            uitleg: 'Bij het omgekeerde wissel je teller en noemer. Het teken blijft hetzelfde.' },
          { id: 'v04', titel: 'Delen met een kommagetal', type: 'invul', vraag: 'Bereken.', sjabloon: '1,5 : {3/4} = [[a]]', velden: { a: G(2) },
            uitleg: '1,5 = {3/2} en {3/2} · {4/3} = 2.' },
          { id: 'v05', titel: 'De lift', type: 'stappen', vraag: 'Een lift kan 410 kg dragen. Thomas laadt dozen van 45 kg in de lift. Hoeveel dozen kan de lift maximaal dragen?',
            stappen: ['410 : 45 = 9,11…', 'Je rondt af naar [[a]]', 'De lift kan maximaal [[b]] dozen dragen.'], velden: { a: K(['beneden', 'boven'], 'beneden'), b: G(9, { w: 3 }) },
            uitleg: 'Met 10 dozen zou de lift te zwaar beladen zijn. Je rondt dus af naar beneden: 9 dozen.' },
          { id: 'v06', titel: 'Breuk van een hoeveelheid', type: 'invul', vraag: 'Bereken.',
            sjabloon: 'Een dokter raadt aan om {1/3} van een dag te slapen. Dat is [[a]] uur.<br>Een doos koekjes is nog {3/4} vol. Ben eet {1/3} van de koekjes in de doos op. De doos is nu nog [[b]] vol.',
            velden: { a: G(8), b: B(1, 2) }, tip: '"{1/3} van" betekent "{1/3} maal".', uitleg: '{1/3} · 24 = 8. Er blijft {2/3} van de koekjes over: {2/3} · {3/4} = {1/2}.' },
          { id: 'v07', titel: 'Een nieuwe smartphone', type: 'invul', vraag: 'Het geheugen van Sara haar smartphone is {3/4} vol. Ze koopt een smartphone met dubbel zoveel geheugen en zet al haar bestanden over.',
            sjabloon: 'De nieuwe smartphone is [[a]] vol.', velden: { a: B(3, 8) }, uitleg: 'Dezelfde bestanden in dubbel zoveel geheugen: {3/4} : 2 = {3/8}.' }
        ]
      },

      /* ============ 7 MACHTEN EN VIERKANTSWORTELS ============ */
      {
        id: 'd7', nr: '7', titel: 'Machten en vierkantswortels', info: 'Deze voorkennis heb je nodig vanaf module 2.', hulp: ['machten'], vragen: [
          { id: 'v01', titel: 'Machten en wortels', type: 'invul', vraag: 'Bereken.',
            sjabloon: rijen(['9² = [[a]]', '(−2)⁴ = [[b]]', '√⟨64⟩ = [[c]]', '−1⁶ = [[d]]', '−√⟨25⟩ = [[e]]', '(−4)³ = [[f]]']), velden: { a: G(81), b: G(16), c: G(8), d: G(-1), e: G(-5), f: G(-64) },
            uitleg: '(−2)⁴ is positief (even exponent), (−4)³ negatief (oneven exponent). Bij −1⁶ staat het minteken niet in de macht: −1⁶ = −1.' },
          { id: 'v02', titel: 'Met breuken en kommagetallen', type: 'invul', vraag: 'Bereken.',
            sjabloon: rijen(['({−5/4})² = [[a]]', '({−1/3})³ = [[b]]', '0,2³ = [[c]]', '√⟨0,36⟩ = [[d]]', '−√⟨{81/49}⟩ = [[e]]']), velden: { a: B(25, 16), b: B(-1, 27), c: G(0.008), d: G(0.6), e: B(-9, 7) },
            uitleg: 'Teller en noemer allebei tot de macht. 0,2 · 0,2 · 0,2 = 0,008. 0,6² = 0,36. √⟨{81/49}⟩ = {9/7}.' },
          { id: 'v03', titel: 'Let op de haakjes', type: 'mc', vraag: 'Hoeveel is −3²?', opties: ['−9', '9', '−6', '6'], juist: 0, vast: true,
            uitleg: 'Het minteken staat niet in de macht: −3² = −(3 · 3) = −9. Alleen (−3)² = 9.' },
          { id: 'v04', titel: 'Positief of negatief', type: 'sleep', vraag: 'Is het resultaat positief of negatief?',
            vakken: ['positief', 'negatief'], items: [['(−2)⁶', 0], ['(−5)²', 0], ['(−1)¹⁰⁰', 0], ['(−2)⁵', 1], ['−2⁴', 1], ['−(−3)²', 1]],
            uitleg: 'Een negatief grondtal met even exponent geeft een positief resultaat, met oneven exponent een negatief. Staat het minteken buiten de macht, dan is het resultaat negatief.' },
          { id: 'v05', titel: 'Grondtal en exponent', type: 'invul', vraag: 'Bereken.',
            sjabloon: 'De macht met grondtal −2 en exponent 6: [[a]]<br>De macht met grondtal 5 en exponent 3: [[b]]<br>De macht met grondtal {2/3} en exponent 2: [[c]]<br>De vierkantswortel van 144: [[d]]', velden: { a: G(64), b: G(125), c: B(4, 9), d: G(12) },
            uitleg: '(−2)⁶ = 64; 5³ = 125; ({2/3})² = {4/9}; √⟨144⟩ = 12.' },
          { id: 'v06', titel: 'Wortel van een negatief getal', type: 'mc', vraag: 'Waarom bestaat √⟨−16⟩ niet?',
            opties: ['Geen enkel getal geeft in het kwadraat een negatief getal.', 'Omdat −16 geen kwadraat is van een natuurlijk getal.', 'Omdat de wortel altijd kleiner is dan het getal.', 'Hij bestaat wel: √⟨−16⟩ = −4.'], juist: 0,
            uitleg: '4² = 16 en (−4)² = 16. Een kwadraat is nooit negatief, dus geen enkel getal heeft −16 als kwadraat.' },
          { id: 'v07', titel: 'Twee getallen', type: 'invul', vraag: 'Welke getallen geven in het kwadraat 49?',
            sjabloon: 'Een positief getal: [[a]] en een negatief getal: [[b]]', velden: { a: G(7, { w: 3 }), b: G(-7, { w: 3 }) },
            uitleg: '7² = 49 en (−7)² = 49. De vierkantswortel √⟨49⟩ is alleen het positieve getal 7.' }
        ]
      },

      /* ============ 8 VOLGORDE VAN BEWERKINGEN ============ */
      {
        id: 'd8', nr: '8', titel: 'Volgorde van bewerkingen', info: 'Deze voorkennis heb je nodig vanaf module 2.', hulp: ['volgorde'], vragen: [
          { id: 'v01', titel: 'De afspraken', type: 'volgorde', vraag: 'Zet de bewerkingen in de juiste volgorde.', boven: 'wat je eerst doet',
            items: ['bewerkingen tussen haakjes', 'machten en vierkantswortels', 'vermenigvuldigen en delen, van links naar rechts', 'optellen en aftrekken, van links naar rechts'],
            uitleg: 'Eerst haakjes, dan machten en wortels, dan vermenigvuldigen en delen, en tot slot optellen en aftrekken.' },
          { id: 'v02', titel: 'Delen voor optellen', type: 'stappen', vraag: 'Bereken −4 + 24 : (−8).',
            stappen: ['−4 + [[a]]', '= [[b]]'], velden: { a: G(-3), b: G(-7) }, uitleg: 'Eerst delen: 24 : (−8) = −3. Dan −4 + (−3) = −7.' },
          { id: 'v03', titel: 'Met machten en een wortel', type: 'stappen', vraag: 'Bereken 4² − 2 · √⟨64⟩ − 2³.',
            stappen: ['Machten en wortel: [[a]] − 2 · [[b]] − [[c]]', 'Vermenigvuldigen: 16 − [[d]] − 8', 'Resultaat: [[e]]'], velden: { a: G(16), b: G(8), c: G(8), d: G(16), e: G(-8) },
            uitleg: '4² = 16, √⟨64⟩ = 8 en 2³ = 8. Dan 16 − 16 − 8 = −8.' },
          { id: 'v04', titel: 'Stap voor stap', type: 'stappen', vraag: 'Bereken √⟨81⟩ − 3 · (2² − √⟨4⟩) : 2 · 3.',
            stappen: ['Tussen de haakjes: 2² − √⟨4⟩ = [[a]]', '√⟨81⟩ = [[b]]', 'Van links naar rechts: 3 · 2 = 6, 6 : 2 = [[c]], 3 · 3 = [[d]]', 'Resultaat: 9 − 9 = [[e]]'],
            velden: { a: G(2), b: G(9), c: G(3), d: G(9), e: G(0) }, uitleg: '9 − 3 · 2 : 2 · 3 = 9 − 6 : 2 · 3 = 9 − 3 · 3 = 9 − 9 = 0.' },
          { id: 'v05', titel: 'Reken uit', type: 'invul', vraag: 'Bereken.',
            sjabloon: rijen(['[2² + (−9)] : [−10 − (−5)] · (−2) = [[a]]', '(−5 + 3) · 4 = [[b]]', '−6 · 5 − (−3)² = [[c]]', '2 · (−3)² = [[d]]']), velden: { a: G(-2), b: G(-8), c: G(-39), d: G(18) },
            uitleg: '(−5) : (−5) · (−2) = −2. (−2) · 4 = −8. −30 − 9 = −39. 2 · 9 = 18.' },
          { id: 'v06', titel: 'Zoek de fout', type: 'mc', vraag: 'Ilias rekent 6 − 2 · 3 = 4 · 3 = 12. Wat is het juiste resultaat?',
            opties: ['0', '12', '−12', '24'], juist: 0, vast: true, uitleg: 'Vermenigvuldigen gaat voor aftrekken: 6 − 2 · 3 = 6 − 6 = 0.' },
          { id: 'v07', titel: 'Met breuken', type: 'invul', vraag: 'Bereken. Noteer je antwoord als een onvereenvoudigbare breuk.',
            sjabloon: rijen(['5 · ({2/5})² − {1/2} = [[a]]', '({1/2} − {3/4}) : {5/8} = [[b]]']), velden: { a: B(3, 10), b: B(-2, 5) },
            uitleg: '5 · {4/25} − {1/2} = {4/5} − {1/2} = {3/10}. {−1/4} · {8/5} = {−2/5}.' },
          { id: 'v08', titel: 'Haakjes maken het verschil', type: 'sleep', vraag: 'Koppel elke opgave aan het juiste resultaat.',
            paren: [['(−2)² · 3', '12'], ['−2² · 3', '−12'], ['(−2 · 3)²', '36'], ['−2 · 3²', '−18']], extra: ['18', '−36'],
            uitleg: '(−2)² = 4, maar −2² = −4. (−2 · 3)² = (−6)² = 36 en −2 · 3² = −2 · 9 = −18.' }
        ]
      },

      /* ============ 9 VERGELIJKINGEN EN VRAAGSTUKKEN ============ */
      {
        id: 'd9', nr: '9', titel: 'Vergelijkingen en vraagstukken', info: 'Deze voorkennis heb je nodig vanaf module 2.', hulp: ['vergelijkingen', 'vraagstukken'], vragen: [
          { id: 'v01', titel: 'Eenvoudige vergelijkingen', type: 'invul', hulp: ['vergelijkingen'], vraag: 'Los op in ℚ.',
            sjabloon: rijen(['x + 7 = 3 → x = [[a]]', 'x − 5 = −2 → x = [[b]]', '3x = −12 → x = [[c]]', '{x/4} = −2 → x = [[d]]', '−x = 6 → x = [[e]]', '2x + 3 = 11 → x = [[f]]']),
            velden: { a: G(-4), b: G(3), c: G(-4), d: G(-8), e: G(-6), f: G(4) },
            uitleg: 'x = 3 − 7 = −4; x = −2 + 5 = 3; x = −12 : 3 = −4; x = −2 · 4 = −8; x = −6; 2x = 8, dus x = 4.' },
          { id: 'v02', titel: 'Onbekende in beide leden', type: 'stappen', hulp: ['vergelijkingen'], vraag: 'Los op: 5x + 3 = 2x − 9.',
            stappen: ['Breng de termen met x naar links en de getallen naar rechts: 5x − 2x = −9 − [[a]]', '[[b]] x = [[c]]', 'x = [[d]]'], velden: { a: G(3, { w: 3 }), b: G(3, { w: 3 }), c: G(-12), d: G(-4) },
            uitleg: '3x = −12, dus x = −4. Controle: 5 · (−4) + 3 = −17 en 2 · (−4) − 9 = −17.' },
          { id: 'v03', titel: 'Met breuken', type: 'invul', hulp: ['vergelijkingen'], vraag: 'Los op in ℚ.',
            sjabloon: rijen(['{2/3} · x = 8 → x = [[a]]', '{x/5} − 1 = 3 → x = [[b]]']), velden: { a: G(12), b: G(20) },
            uitleg: 'x = 8 : {2/3} = 8 · {3/2} = 12. {x/5} = 4, dus x = 20.' },
          { id: 'v04', titel: 'Fietstocht', type: 'stappen', hulp: ['vraagstukken'], vraag: 'Sander fietste al {2/5} van zijn fietstocht. Dat is 24 km. Hoe lang is de hele fietstocht?',
            stappen: ['x is de lengte van de fietstocht. De vergelijking is [[a]]', 'x = [[b]] km'], velden: { a: K(['{2/5} · x = 24', 'x + {2/5} = 24', 'x = {2/5} · 24'], '{2/5} · x = 24'), b: G(60) },
            uitleg: '{2/5} · x = 24, dus x = 24 · {5/2} = 60. De fietstocht is 60 km lang.' },
          { id: 'v05', titel: 'Sportclub', type: 'stappen', hulp: ['vraagstukken'], vraag: 'Len en Nina krijgen elk 10 euro korting op het inschrijvingsgeld van een sportclub. Samen betalen ze 110 euro. Hoeveel is het normale inschrijvingsgeld?',
            stappen: ['x is het normale inschrijvingsgeld. De vergelijking is [[a]]', 'x = [[b]] euro'], velden: { a: K(['2 · (x − 10) = 110', '2x − 10 = 110', '2 · (x + 10) = 110'], '2 · (x − 10) = 110'), b: G(65) },
            uitleg: 'Per kind betaal je x − 10, voor twee kinderen 2 · (x − 10) = 110. Dan x − 10 = 55 en x = 65.' },
          { id: 'v06', titel: 'Portefeuille', type: 'invul', hulp: ['vraagstukken'], vraag: 'Als er in de portefeuille van Maité dubbel zoveel geld zou zitten, dan kwam ze nog 6 euro tekort voor een kleedje van 30 euro. Hoeveel geld zit er in haar portefeuille?',
            sjabloon: 'Vergelijking: 2x + 6 = 30. Er zit [[a]] euro in de portefeuille.', velden: { a: G(12) }, uitleg: '2x = 24, dus x = 12.' },
          { id: 'v07', titel: 'Een fles water', type: 'invul', hulp: ['vraagstukken'], vraag: 'Als je 50 cl uit een volle fles water schenkt, is de fles nog voor een derde gevuld. Hoeveel water kan er in een volle fles?',
            sjabloon: 'Vergelijking: x − 50 = {1/3}x. Er kan [[a]] cl in een volle fles.', velden: { a: G(75) }, uitleg: '{2/3}x = 50, dus x = 50 · {3/2} = 75.' },
          { id: 'v08', titel: 'Loopschema', type: 'stappen', hulp: ['vraagstukken'], vraag: 'Maud loopt bij elke training 2 minuten langer dan de vorige keer. Bij de tiende training loopt ze drie keer zo lang als bij de eerste. x is het aantal minuten van de eerste training.',
            stappen: ['Bij de tiende training loopt ze x + [[a]] minuten.', 'x + 18 = 3x, dus x = [[b]]'], velden: { a: G(18, { w: 3 }), b: G(9, { w: 3 }) },
            uitleg: 'Van de eerste tot de tiende training komen er 9 keer 2 minuten bij: x + 18. Dan 18 = 2x en x = 9 minuten.' },
          { id: 'v09', titel: 'Is het een oplossing?', type: 'invul', hulp: ['vergelijkingen'], vraag: 'Is het getal een oplossing van de vergelijking?',
            sjabloon: 'x = −2 bij 3x + 4 = −2: [[a]]<br>x = 2 bij 2x − 1 = 5: [[b]]<br>x = −3 bij x² = 9: [[c]]', velden: { a: K(JN, 'ja'), b: K(JN, 'neen'), c: K(JN, 'ja') },
            uitleg: '3 · (−2) + 4 = −2 klopt. 2 · 2 − 1 = 3 en niet 5. (−3)² = 9 klopt.' }
        ]
      },

      /* ============ 10 BEWERKINGEN MET VERZAMELINGEN ============ */
      {
        id: 'd10', nr: '10', titel: 'Bewerkingen met verzamelingen', info: 'Deze voorkennis heb je nodig vanaf module 5.', hulp: ['verzamelingen', 'symbolen'], vragen: [
          { id: 'v01', titel: 'Vlinderdiagram lezen', type: 'invul', vraag: 'Bekijk het vlinderdiagram. Vul in.',
            figuur: { html: VLINDER },
            sjabloon: rijen(['T [[a]] A', 'S [[b]] A', 'M [[c]] A ∩ B', 'O [[d]] A \\ B', 'E [[e]] B \\ A', '{T, E, R} [[f]] A']),
            velden: { a: K(ALLES, '∈'), b: K(ALLES, '∉'), c: K(ALLES, '∈'), d: K(ALLES, '∉'), e: K(ALLES, '∉'), f: K(ALLES, '⊂') },
            uitleg: 'A = {T, R, E, M} en B = {M, S, O}. M ligt in beide. O ligt alleen in B, E alleen in A. {T, E, R} is een deel van A.' },
          { id: 'v02', titel: 'Elementen plaatsen', type: 'sleep', vraag: 'A = {2, 4, 6, 8} en B = {1, 4, 9}. Waar hoort elk element in het venndiagram?',
            vakken: ['alleen in A', 'in A ∩ B', 'alleen in B'], items: [['2', 0], ['6', 0], ['8', 0], ['4', 1], ['1', 2], ['9', 2]],
            uitleg: '4 zit in beide verzamelingen. 2, 6 en 8 zitten alleen in A, 1 en 9 alleen in B.' },
          { id: 'v03', titel: 'Unie', type: 'mc', meerdere: true, vast: true, compact: true, vraag: 'A = {2, 4, 6, 8} en B = {1, 4, 9}. Duid alle elementen van A ∪ B aan.',
            opties: ['1', '2', '3', '4', '5', '6', '7', '8', '9'], juist: [0, 1, 3, 5, 7, 8], uitleg: 'A ∪ B = {1, 2, 4, 6, 8, 9}: alles wat in A of in B zit.' },
          { id: 'v04', titel: 'Verschil', type: 'mc', meerdere: true, vast: true, compact: true, vraag: 'A = {2, 4, 6, 8} en B = {1, 4, 9}. Duid alle elementen van B \\ A aan.',
            opties: ['1', '2', '4', '6', '8', '9'], juist: [0, 5], uitleg: 'B \\ A = {1, 9}: de elementen van B die niet in A zitten.' },
          { id: 'v05', titel: 'Betekenis in een context', type: 'sleep', vraag: 'M is de verzameling van de meisjes uit de klas en P de verzameling van de leerlingen die padellen. Koppel elke notatie aan de betekenis.',
            paren: [['M ∩ P', 'de meisjes die padellen'], ['P \\ M', 'de leerlingen die padellen en geen meisje zijn'], ['M ∪ P', 'alle meisjes en alle leerlingen die padellen'], ['M \\ P', 'de meisjes die niet padellen']],
            uitleg: '∩ betekent "en", ∪ betekent "of" en \\ betekent "maar niet".' },
          { id: 'v06', titel: 'Gebied aanduiden', type: 'venn', vraag: 'Duid het gebied aan van de leerlingen die padellen, maar geen meisje zijn.', sets: ['M', 'P'], juist: ['P'],
            uitleg: 'Dat is P \\ M: het deel van P buiten M.' },
          { id: 'v07', titel: 'Drie verzamelingen', type: 'venn', vraag: 'Duid het gebied (A ∩ B) \\ C aan.', sets: ['A', 'B', 'C'], juist: ['AB'],
            uitleg: 'Neem het gebied waar A en B overlappen en laat het deel weg dat ook in C ligt.' },
          { id: 'v08', titel: 'Doorsnede door opsomming', type: 'mc', meerdere: true, vast: true, compact: true, vraag: 'A is de verzameling van de oneven getallen kleiner dan 10. B is de verzameling van de priemgetallen kleiner dan 10. Duid alle elementen van A ∩ B aan.',
            opties: ['1', '2', '3', '4', '5', '6', '7', '8', '9'], juist: [2, 4, 6], uitleg: 'A = {1, 3, 5, 7, 9} en B = {2, 3, 5, 7}. A ∩ B = {3, 5, 7}. 1 is geen priemgetal en 9 = 3 · 3.' }
        ]
      },

      /* ============ 11 PROCENTEN ============ */
      {
        id: 'd11', nr: '11', titel: 'Procenten', info: 'Deze voorkennis heb je nodig vanaf module 5.', hulp: ['procenten'], vragen: [
          { id: 'v01', titel: 'Procent van een getal', type: 'invul', vraag: 'Bereken.',
            sjabloon: rijen(['20 % van 180 = [[a]]', '150 % van 450 = [[b]]', '10 % van 95 = [[c]]', '75 % van 64 = [[d]]', '6 % van 500 = [[e]]', '200 % van 108 = [[f]]']),
            velden: { a: G(36), b: G(675), c: G(9.5), d: G(48), e: G(30), f: G(216) }, uitleg: 'Vermenigvuldig met het percentage gedeeld door 100: 0,20 · 180 = 36; 1,5 · 450 = 675; enzovoort.' },
          { id: 'v02', titel: 'Wat ontbreekt?', type: 'invul', vraag: 'Vul aan.',
            sjabloon: rijen(['[[a]] % van 900 is 360.', '50 % van [[b]] is 210.', '6 % van [[c]] is 9.', '[[d]] % van 250 is 225.']), velden: { a: G(40, { w: 4 }), b: G(420), c: G(150), d: G(90, { w: 4 }) },
            uitleg: '360 : 900 = 0,4 = 40 %. 210 : 0,5 = 420. 9 : 0,06 = 150. 225 : 250 = 0,9 = 90 %.' },
          { id: 'v03', titel: 'Prijsstijging', type: 'stappen', vraag: 'Een chocoladecake kost 5 euro. Volgende maand stijgt de prijs met 20 %.',
            stappen: ['De nieuwe prijs is [[a]] % van de oude prijs.', 'De nieuwe prijs is [[b]] euro.'], velden: { a: G(120, { w: 4 }), b: G(6) },
            uitleg: '100 % + 20 % = 120 %. 1,20 · 5 = 6 euro.' },
          { id: 'v04', titel: 'Meisjes in de klas', type: 'stappen', vraag: 'In een klas van 24 leerlingen zijn er 9 jongens. Hoeveel procent van de klas zijn meisjes?',
            stappen: ['Aantal meisjes: [[a]]', 'Percentage meisjes: [[b]] %'], velden: { a: G(15, { w: 3 }), b: G(62.5) }, uitleg: '24 − 9 = 15 meisjes. 15 : 24 = 0,625 = 62,5 %.' },
          { id: 'v05', titel: 'Geannuleerde reis', type: 'invul', vraag: 'Rohan betaalde 420 euro voor een reis. Hij moet annuleren en krijgt 80 % van het bedrag terug.',
            sjabloon: 'Rohan verliest [[a]] euro.', velden: { a: G(84) }, uitleg: 'Hij verliest 20 %: 0,20 · 420 = 84 euro.' },
          { id: 'v06', titel: 'Twee kortingen', type: 'stappen', vraag: 'Naomi krijgt 70 % korting op een jas. Met een kraslot krijgt ze op die promoprijs nog eens 10 % korting. Hoeveel procent korting kreeg ze in totaal? Neem een jas van 100 euro.',
            stappen: ['Na 70 % korting kost de jas [[a]] euro.', 'Na nog eens 10 % korting kost de jas [[b]] euro.', 'De totale korting is [[c]] %.'], velden: { a: G(30), b: G(27), c: G(73, { w: 4 }) },
            uitleg: 'Van 100 euro naar 30 euro, en 10 % van 30 euro is 3 euro. Ze betaalt 27 euro: dat is 73 % korting, niet 80 %.' },
          { id: 'v07', titel: 'Kortingen optellen?', type: 'mc', vraag: 'Is 70 % korting gevolgd door 10 % extra korting hetzelfde als 80 % korting?',
            opties: ['Neen, het is minder korting, want de tweede korting wordt berekend op een kleiner bedrag.', 'Ja, je mag de kortingen optellen.', 'Neen, het is meer korting.', 'Dat hangt af van de prijs.'], juist: 0,
            uitleg: 'De 10 % wordt berekend op de prijs die al verminderd is. In totaal is dat 73 % korting, voor elke prijs.' },
          { id: 'v08', titel: 'Boodschappen', type: 'stappen', vraag: 'Cor koopt 2 flessen afwasmiddel van € 2,99, 12 flessen water van € 0,75 en 2 kg appels van € 2,30 per kg. Op al zijn aankopen krijgt hij 3 % korting.',
            stappen: ['Totaal zonder korting: € [[a]]', 'Totaal met korting, afgerond op de cent: € [[b]]'], velden: { a: G(19.58), b: G(18.99, { tol: 0.006 }) },
            uitleg: '2 · 2,99 + 12 · 0,75 + 2 · 2,30 = 19,58. Hij betaalt 97 %: 0,97 · 19,58 = 18,99.' }
        ]
      },

      /* ============ 12 DATA INTERPRETEREN ============ */
      {
        id: 'd12', nr: '12', titel: 'Data interpreteren', info: 'Deze voorkennis heb je nodig vanaf module 7.', hulp: ['data'], vragen: [
          { id: 'v01', titel: 'Favoriet fruit', type: 'invul', vraag: 'Bekijk de voorkeur voor fruit in een klas.', figuur: { html: staafdiagram() },
            sjabloon: 'Deze voorstelling is een [[a]]<br>Aantal leerlingen dat een keuze maakte: [[b]]<br>Aantal leerlingen met peer als favoriet: [[c]]<br>Percentage leerlingen met appel als favoriet: [[d]] %',
            velden: { a: K(['staafdiagram', 'cirkeldiagram', 'lijndiagram', 'dotplot'], 'staafdiagram'), b: G(20, { w: 3 }), c: G(3, { w: 3 }), d: G(30, { w: 3 }) },
            uitleg: '6 + 4 + 3 + 5 + 2 = 20 leerlingen. 6 van de 20 is 30 %.' },
          { id: 'v02', titel: 'Begrippen', type: 'sleep', vraag: 'Koppel elk begrip aan de betekenis.',
            paren: [['de som van alle waarden gedeeld door het aantal waarden', 'gemiddelde'], ['de middelste waarde als je de waarden rangschikt', 'mediaan'], ['de waarde die het vaakst voorkomt', 'modus'], ['de grootste waarde min de kleinste waarde', 'variatiebreedte']],
            uitleg: 'Gemiddelde, mediaan en modus zeggen iets over het midden. De variatiebreedte zegt hoe ver de waarden uit elkaar liggen.' },
          { id: 'v03', titel: 'Vijf getallen', type: 'invul', vraag: 'Bekijk de data: 4, 7, 7, 9, 13.',
            sjabloon: rijen(['gemiddelde: [[a]]', 'mediaan: [[b]]', 'modus: [[c]]', 'variatiebreedte: [[d]]']), velden: { a: G(8), b: G(7), c: G(7), d: G(9) },
            uitleg: '40 : 5 = 8. De middelste van vijf waarden is 7. 7 komt twee keer voor. 13 − 4 = 9.' },
          { id: 'v04', titel: 'Calorieën', type: 'invul', vraag: 'Een jongere noteert een week lang hoeveel kcal hij per dag opneemt: 2430, 2970, 2580, 2670, 3130, 2280, 2910.',
            sjabloon: 'Gemiddelde: [[a]] kcal<br>Mediaan: [[b]] kcal<br>Er is geen modus, want [[c]]', velden: { a: G(2710), b: G(2670), c: K(['elke waarde maar één keer voorkomt', 'er te weinig waarden zijn', 'de waarden te groot zijn'], 'elke waarde maar één keer voorkomt') },
            tip: 'Rangschik de waarden eerst om de mediaan te vinden.', uitleg: 'De som is 18 970 en 18 970 : 7 = 2710. Gerangschikt is 2670 de middelste van de zeven waarden.' },
          { id: 'v05', titel: 'Dotplot', type: 'invul', vraag: 'De dotplot toont hoeveel minuten 20 mensen aan de ontbijttafel zitten.', figuur: { html: dotplot() },
            sjabloon: rijen(['modus: [[a]] min', 'gemiddelde: [[b]] min', 'mediaan: [[c]] min', 'variatiebreedte: [[d]] min']), velden: { a: G(10), b: G(7.25), c: G(9), d: G(15) },
            uitleg: 'Bij 10 minuten staan de meeste stippen. Som: 0 + 10 + 24 + 60 + 36 + 15 = 145 en 145 : 20 = 7,25. De 10de en 11de waarde zijn 8 en 10, dus de mediaan is 9. 15 − 0 = 15.' },
          { id: 'v06', titel: 'Boekentassen', type: 'invul', vraag: 'De massa van 24 boekentassen (in kg): 4,2 · 5,9 · 5,5 · 8,4 · 5,6 · 8,6 · 6,2 · 5,1 · 4,2 · 5,4 · 5,2 · 4,8 · 6,8 · 4,1 · 4,2 · 5,5 · 6,2 · 6,5 · 8 · 5,2 · 4,5 · 4,2 · 4,7 · 5,4',
            sjabloon: rijen(['variatiebreedte: [[a]] kg', 'gemiddelde: [[b]] kg', 'mediaan: [[c]] kg', 'modus: [[d]] kg']), velden: { a: G(4.5), b: G(5.6, { tol: 0.05 }), c: G(5.4), d: G(4.2) },
            tip: 'Gebruik je rekenmachine en rangschik de waarden.', uitleg: '8,6 − 4,1 = 4,5. De som is 134,4 en 134,4 : 24 = 5,6. De 12de en 13de waarde zijn allebei 5,4. 4,2 komt vier keer voor.' },
          { id: 'v07', titel: 'Uitschieter', type: 'mc', vraag: 'Aan een reeks waarden wordt één heel grote waarde toegevoegd. Welke maat verandert daardoor het minst?',
            opties: ['de mediaan', 'het gemiddelde', 'de variatiebreedte', 'ze veranderen allemaal evenveel'], juist: 0,
            uitleg: 'De mediaan schuift hoogstens een halve plaats op. Het gemiddelde en de variatiebreedte stijgen sterk door een uitschieter.' }
        ]
      },

      /* ============ 13 HET METRIEK STELSEL ============ */
      {
        id: 'd13', nr: '13', titel: 'Het metriek stelsel', info: 'Deze voorkennis heb je nodig vanaf module 16.', hulp: ['metriek'], vragen: [
          { id: 'v01', titel: 'Lengtematen', type: 'invul', vraag: 'Herleid.',
            sjabloon: rijen(['478 mm = [[a]] cm', '80 cm = [[b]] m', '2,25 km = [[c]] m', '7,3 m = [[d]] cm', '650 m = [[e]] km', '0,5 cm = [[f]] mm']),
            velden: { a: G(47.8, { w: 6 }), b: G(0.8, { w: 6 }), c: G(2250, { w: 6 }), d: G(730, { w: 6 }), e: G(0.65, { w: 6 }), f: G(5, { w: 6 }) },
            uitleg: 'Bij lengtematen is elke stap maal of gedeeld door 10.' },
          { id: 'v02', titel: 'Oppervlaktematen', type: 'invul', vraag: 'Herleid.',
            sjabloon: rijen(['257 mm² = [[a]] cm²', '600 cm² = [[b]] m²', '1,75 hm² = [[c]] m²', '0,5 m² = [[d]] cm²', '4,5 m² = [[e]] dm²', '900 dm² = [[f]] m²']),
            velden: { a: G(2.57, { w: 6 }), b: G(0.06, { w: 6 }), c: G(17500, { w: 6 }), d: G(5000, { w: 6 }), e: G(450, { w: 6 }), f: G(9, { w: 6 }) },
            tip: 'Bij oppervlaktematen is elke stap maal of gedeeld door 100.', uitleg: 'Van mm² naar cm² deel je door 100. Van hm² naar m² zijn er twee stappen: maal 10 000.' },
          { id: 'v03', titel: 'Volume en inhoud', type: 'invul', vraag: 'Herleid.',
            sjabloon: rijen(['47,8 l = [[a]] cl', '73 dm³ = [[b]] l', '8,3 dm³ = [[c]] cl', '80 cm³ = [[d]] dm³', '6,5 m³ = [[e]] dm³', '0,2 dm³ = [[f]] ml']),
            velden: { a: G(4780, { w: 6 }), b: G(73, { w: 6 }), c: G(830, { w: 6 }), d: G(0.08, { w: 6 }), e: G(6500, { w: 6 }), f: G(200, { w: 6 }) },
            tip: '1 dm³ = 1 l en 1 cm³ = 1 ml.', uitleg: 'Bij volumematen is elke stap maal of gedeeld door 1000. 8,3 dm³ = 8,3 l = 830 cl.' },
          { id: 'v04', titel: 'Gelijke hoeveelheden', type: 'sleep', vraag: 'Koppel wat even groot is.',
            paren: [['1 l', '1 dm³'], ['1 ml', '1 cm³'], ['1 m³', '1000 l'], ['1 ha', '1 hm²'], ['1 kg', '1000 g']], extra: ['100 l', '10 dm³'],
            uitleg: '1 dm³ = 1 l, 1 cm³ = 1 ml en 1 m³ = 1000 dm³ = 1000 l. 1 ha = 1 hm².' },
          { id: 'v05', titel: 'Vitamine C', type: 'stappen', vraag: 'Een potje bevat 120 tabletten met elk 1000 mg vitamine C. Vicky neemt elke dag één tablet.',
            stappen: ['1 kg = [[a]] mg', 'Na [[b]] dagen heeft ze 1 kg vitamine C genomen.', 'Daarvoor heeft ze [[c]] potjes nodig.'], velden: { a: G(1000000, { w: 8 }), b: G(1000), c: G(9, { w: 3 }) },
            uitleg: '1 kg = 1000 g = 1 000 000 mg. Eén tablet is 1 g, dus 1000 tabletten. 1000 : 120 = 8,33…, dus 9 potjes.' },
          { id: 'v06', titel: 'Aquarium', type: 'stappen', vraag: 'In een kubusvormig aquarium kan 27 liter water. Een balkvormig aquarium is 35 cm lang, 25 cm breed en 30 cm hoog.',
            stappen: ['Afmetingen in dm: 3,5 dm · 2,5 dm · [[a]] dm', 'Volume van de balk: [[b]] dm³ = [[c]] l', 'In het balkvormig aquarium kan [[d]] water.'], velden: { a: G(3, { w: 3 }), b: G(26.25), c: G(26.25), d: K(['meer', 'minder', 'evenveel'], 'minder') },
            uitleg: '3,5 · 2,5 · 3 = 26,25 dm³ = 26,25 l. Dat is minder dan 27 l.' },
          { id: 'v07', titel: 'Massa', type: 'invul', vraag: 'Herleid.',
            sjabloon: rijen(['2500 g = [[a]] kg', '0,3 kg = [[b]] g', '750 mg = [[c]] g']), velden: { a: G(2.5, { w: 6 }), b: G(300, { w: 6 }), c: G(0.75, { w: 6 }) },
            uitleg: '1 kg = 1000 g en 1 g = 1000 mg.' }
        ]
      },

      /* ============ 14 OMTREK EN OPPERVLAKTE VAN VLAKKE FIGUREN ============ */
      {
        id: 'd14', nr: '14', titel: 'Omtrek en oppervlakte van vlakke figuren', info: 'Deze voorkennis heb je nodig vanaf module 16.', hulp: ['vlak'], vragen: [
          { id: 'v01', titel: 'Een muur schilderen', type: 'invul', vraag: 'Gareth schildert een rechthoekige muur van 4 m breed en 2,5 m hoog.',
            sjabloon: 'Hoeveel schilderstape heeft hij minstens nodig om de randen af te plakken? [[a]] m<br>Hoe groot is de oppervlakte van de muur? [[b]] m²', velden: { a: G(13), b: G(10) },
            uitleg: 'Omtrek: 4 + 2,5 + 4 + 2,5 = 13 m. Oppervlakte: 4 · 2,5 = 10 m².' },
          { id: 'v02', titel: 'Oppervlakte van vlakke figuren', type: 'invul', vraag: 'Bereken de oppervlakte van elke figuur.', figuur: { html: vlakkeFiguren() },
            sjabloon: rijen(['a) [[a]] cm²', 'b) [[b]] cm²', 'c) [[c]] cm²', 'd) [[d]] cm²']), velden: { a: G(20), b: G(24), c: G(28), d: G(24) },
            uitleg: 'a) {8 · 5/2} = 20. b) 6 · 4 = 24. c) {(9 + 5) · 4/2} = 28. d) {8 · 6/2} = 24.' },
          { id: 'v03', titel: 'Formules', type: 'sleep', vraag: 'Koppel elke figuur aan de formule voor de oppervlakte.',
            paren: [['rechthoek', 'l · b'], ['driehoek', '{b · h/2}'], ['parallellogram', 'b · h'], ['trapezium', '{(B + b) · h/2}'], ['ruit', '{D · d/2}'], ['cirkel', 'π · r²']], extra: ['2 · π · r'],
            uitleg: '2 · π · r is de omtrek van een cirkel, geen oppervlakte.' },
          { id: 'v04', titel: 'Cirkel en rechthoek', type: 'invul', vraag: 'Vul aan. Rond af op 0,1.',
            sjabloon: '<table><tr><th>figuur</th><th>gegeven</th><th>omtrek</th><th>oppervlakte</th></tr><tr><td>cirkel</td><td>r = 2,5 cm</td><td>[[a]] cm</td><td>[[b]] cm²</td></tr><tr><td>rechthoek</td><td>b = 3 cm, l = [[c]] cm</td><td>30 cm</td><td>[[d]] cm²</td></tr></table>',
            velden: { a: G(15.7, { tol: 0.06 }), b: G(19.6, { tol: 0.06 }), c: G(12), d: G(36) },
            uitleg: 'p = 2 · π · 2,5 ≈ 15,7 cm en A = π · 2,5² ≈ 19,6 cm². Bij de rechthoek: (30 − 3 − 3) : 2 = 12 cm en 12 · 3 = 36 cm².' },
          { id: 'v05', titel: 'Van oppervlakte naar omtrek', type: 'stappen', vraag: 'Een vierkant heeft een oppervlakte van 25 cm². Bepaal de omtrek.',
            stappen: ['z² = 25 cm², dus z = [[a]] cm', 'p = 4 · z = [[b]] cm'], velden: { a: G(5), b: G(20) }, uitleg: '5 · 5 = 25, dus de zijde is 5 cm. De omtrek is 4 · 5 = 20 cm.' },
          { id: 'v06', titel: 'Vierkant en ruit', type: 'stappen', vraag: 'Een vierkant heeft dezelfde omtrek als een ruit met omtrek 36 cm. Hoe groot is de oppervlakte van het vierkant?',
            stappen: ['zijde van het vierkant: [[a]] cm', 'oppervlakte van het vierkant: [[b]] cm²'], velden: { a: G(9), b: G(81) }, uitleg: '36 : 4 = 9 cm en 9 · 9 = 81 cm².' },
          { id: 'v07', titel: 'Reclamebord', type: 'invul', vraag: 'Een rechthoekig reclamebord is 6 m breed en 3 m hoog.',
            sjabloon: 'Hoeveel meter neonverlichting is er minstens nodig voor de hele rand? [[a]] m<br>Hoe groot moet de poster zijn om het hele bord te bedekken? [[b]] m²', velden: { a: G(18), b: G(18) },
            uitleg: 'Omtrek: 2 · 6 + 2 · 3 = 18 m. Oppervlakte: 6 · 3 = 18 m². Het getal is hetzelfde, maar de eenheid niet.' }
        ]
      },

      /* ============ 15 OPPERVLAKTE EN VOLUME VAN 3D-OBJECTEN ============ */
      {
        id: 'd15', nr: '15', titel: 'Oppervlakte en volume van 3D-objecten', info: 'Deze voorkennis heb je nodig vanaf module 16.', hulp: ['ruimte'], vragen: [
          { id: 'v01', titel: 'Volume van een cilinder', type: 'stappen', vraag: 'Bereken het volume van de cilinder. Rond af op 0,1 cm³.', figuur: { html: CILINDER },
            stappen: ['V = π · r² · h met r² = [[a]] cm²', 'V ≈ [[b]] cm³'], velden: { a: G(100), b: G(9424.8, { tol: 0.2 }) },
            uitleg: 'V = π · 10² · 30 = 3000 · π ≈ 9424,8 cm³.' },
          { id: 'v02', titel: 'Zitbank bekleden', type: 'invul', vraag: 'Een balkvormige zitbank is 78 cm lang, 38 cm breed en 38 cm hoog. Ze wordt volledig bekleed met stof.',
            figuur: { html: balk(156, 76, 76, ['78 cm', '38 cm', '38 cm'], 'Balk van 78 cm lang, 38 cm breed en 38 cm hoog') },
            sjabloon: 'Er is minstens [[a]] cm² stof nodig.', velden: { a: G(14744) },
            uitleg: '2 · 78 · 38 + 2 · 78 · 38 + 2 · 38 · 38 = 5928 + 5928 + 2888 = 14 744 cm².' },
          { id: 'v03', titel: 'Kubus', type: 'invul', vraag: 'Een kubus heeft een ribbe van 7 cm.',
            sjabloon: 'Totale oppervlakte: [[a]] cm²<br>Volume: [[b]] cm³', velden: { a: G(294), b: G(343) }, uitleg: '6 · 7² = 6 · 49 = 294 cm² en 7³ = 343 cm³.' },
          { id: 'v04', titel: 'Kubusvormige zitbank', type: 'invul', vraag: 'Een kubusvormige zitbank heeft een ribbe van 40 cm.',
            sjabloon: 'Volume: [[a]] cm³ = [[b]] dm³', velden: { a: G(64000), b: G(64) }, uitleg: '40³ = 64 000 cm³. Delen door 1000 geeft 64 dm³.' },
          { id: 'v05', titel: 'Stoelkussen', type: 'invul', vraag: 'Een vierkant stoelkussen is 40 cm lang, 40 cm breed en een halve dm dik. Hoeveel stof is er minstens nodig?',
            figuur: { html: balk(160, 60, 20, ['40 cm', '40 cm', '5 cm'], 'Plat kussen van 40 cm bij 40 cm en 5 cm dik') },
            sjabloon: 'Er is minstens [[a]] cm² stof nodig.', velden: { a: G(4000) }, tip: 'Een halve dm is 5 cm.', uitleg: 'Boven- en onderkant: 2 · 40 · 40 = 3200 cm². Vier zijkanten: 4 · 40 · 5 = 800 cm². Samen 4000 cm².' },
          { id: 'v06', titel: 'Bijzettafels', type: 'stappen', vraag: 'Twee bijzettafels hebben de vorm van een kubus. De grote heeft een ribbe van 50 cm, de kleine van 45 cm. Hoeveel minder volume neemt de kleine in?',
            stappen: ['Volume groot: [[a]] cm³', 'Volume klein: [[b]] cm³', 'Verschil: [[c]] cm³'], velden: { a: G(125000), b: G(91125), c: G(33875) }, uitleg: '50³ = 125 000 en 45³ = 91 125. Het verschil is 33 875 cm³.' },
          { id: 'v07', titel: 'Formules', type: 'sleep', vraag: 'Koppel elke grootheid aan de juiste formule.',
            paren: [['volume van een kubus', 'z³'], ['volume van een balk', 'l · b · h'], ['volume van een cilinder', 'π · r² · h'], ['totale oppervlakte van een kubus', '6 · z²']], extra: ['4 · z', 'π · r²'],
            uitleg: 'Een volume heeft drie afmetingen, een oppervlakte twee. π · r² is de oppervlakte van het grondvlak van een cilinder.' },
          { id: 'v08', titel: 'Liter in een balk', type: 'mc', vraag: 'Hoeveel liter water kan er in een balkvormige bak van 5 dm lang, 4 dm breed en 3 dm hoog?',
            opties: ['60 l', '6 l', '600 l', '12 l'], juist: 0, vast: true, uitleg: '5 · 4 · 3 = 60 dm³ en 1 dm³ = 1 l, dus 60 l.' },
          { id: 'v09', titel: 'Ribbe zoeken', type: 'invul', vraag: 'Een kubus heeft een volume van 64 cm³.', sjabloon: 'De ribbe is [[a]] cm lang.', velden: { a: G(4) },
            uitleg: '4 · 4 · 4 = 64, dus de ribbe is 4 cm.' }
        ]
      }
    ]
  });
})();
