/* TWEEDE JAAR - MODULE 2 - Algebraïsche uitdrukkingen (Nando 2, getallenleer & algebra) */
(function () {
  'use strict';
  var V = window.Vragen, G = V.G, T = V.T, K = V.K, A = V.A;
  function rijen(a) { return '<div class="rijen">' + a.map(function (x) { return '<div>' + x + '</div>'; }).join('') + '</div>'; }
  var LG = ['y', 'ab', 'xy²', 'p', 'p³', 'k²m'];
  var PM = ['+', '−'];
  var DEEL = ['de coëfficiënt', 'de variabele', 'de constante', 'de termen'];

  /* oppervlaktemodel: rechthoek met hoogte 4 en breedte 2x + 3 */
  var MODEL = '<svg class="vrij" viewBox="0 0 430 190" width="430" height="190" role="img" aria-label="Rechthoek met hoogte 4, verdeeld in een deel met breedte 2x en een deel met breedte 3">' +
    '<rect x="60" y="40" width="220" height="120" fill="rgba(61,183,181,.28)" stroke="#177A78" stroke-width="2.5"/><rect x="280" y="40" width="120" height="120" fill="rgba(250,176,1,.32)" stroke="#B67E00" stroke-width="2.5"/>' +
    '<g font-family="Poppins, sans-serif" font-size="19" font-weight="600" fill="#2B2B2B" text-anchor="middle"><text x="170" y="28">2x</text><text x="340" y="28">3</text><text x="36" y="107">4</text><text x="170" y="107" fill="#177A78">A</text><text x="340" y="107" fill="#8A5F00">B</text></g></svg>';
  /* turnmat: breedte x, lengte 2 + x */
  var MAT = '<svg class="vrij" viewBox="0 0 400 200" width="400" height="200" role="img" aria-label="Turnmat met breedte x, bestaande uit een deel met lengte 2 en een deel met lengte x">' +
    '<rect x="50" y="40" width="110" height="130" fill="rgba(61,183,181,.28)" stroke="#177A78" stroke-width="2.5"/><rect x="160" y="40" width="130" height="130" fill="rgba(250,176,1,.32)" stroke="#B67E00" stroke-width="2.5"/>' +
    '<g font-family="Poppins, sans-serif" font-size="19" font-weight="600" fill="#2B2B2B" text-anchor="middle"><text x="105" y="28">2</text><text x="225" y="28">x</text><text x="30" y="111">x</text></g></svg>';

  window.registreerModule({
    id: 'm02', nummer: 2, titel: 'Algebraïsche uitdrukkingen', domein: 'Getallenleer en algebra', standaardActief: true,

    theorie: {
      typen: {
        titel: 'Zo typ je een lettervorm', html:
          '<ul><li>Typ gewoon de letters en cijfers achter elkaar: <b>6x + 5y</b></li><li>Een macht typ je met een dakje of met het cijfer vlak achter de letter: <b>x^2</b> of <b>x2</b> wordt x².</li><li>Een kommagetal typ je met een komma: <b>1,2x + 2,2</b></li><li>Het minteken is het gewone streepje op je toetsenbord.</li><li>Onder het invulvak zie je hoe je antwoord gelezen wordt. Staat er "nog niet leesbaar", kijk dan na of er een teken ontbreekt.</li></ul>' +
          '<p>Je antwoord moet volledig herleid zijn: zonder haakjes en met de gelijksoortige eentermen samengenomen. Rangschik volgens dalende machten.</p>'
      },
      letters: {
        titel: 'Letters in wiskunde', html:
          '<p>Je gebruikt letters om een patroon te veralgemenen, in formules, in vergelijkingen en om eigenschappen kort te noteren.</p>' +
          '<div class="vb">Het aantal stippen is drie keer het nummer van de figuur vermeerderd met één: s = 3 · n + 1</div>' +
          '<div class="vb">Sem is x jaar. Nanne is 3 jaar ouder: x + 3. Samen zijn ze x + (x + 3) = 2x + 3 jaar.</div>'
      },
      eenterm: {
        titel: 'Eentermen', html:
          '<div class="def">Een <b>eenterm</b> is een product van een coëfficiënt en letterfactoren met positieve exponenten.</div>' +
          '<p>In −2ab is −2 de <b>coëfficiënt</b> (of het getalgedeelte) en ab het <b>lettergedeelte</b>.</p><p><b>Afspraken</b></p>' +
          '<ol><li>De coëfficiënt staat vooraan: x · 2 wordt 2x.</li><li>Het maalteken tussen coëfficiënt en lettergedeelte laat je weg: 4 · a · b wordt 4ab.</li><li>De letterfactoren rangschik je alfabetisch: ba wordt ab.</li><li>De coëfficiënten 1 en −1 schrijf je niet: 1ab wordt ab en −1ab wordt −ab.</li></ol>'
      },
      gelijksoortig: {
        titel: 'Gelijksoortige eentermen', html:
          '<div class="def"><b>Gelijksoortige eentermen</b> zijn eentermen die hetzelfde lettergedeelte hebben.</div>' +
          '<div class="vb">3x en x zijn gelijksoortig (lettergedeelte x). ab en 5ab zijn gelijksoortig (lettergedeelte ab).</div><div class="vb">7x en 4x² zijn niet gelijksoortig: x en x² zijn verschillende lettergedeelten.</div>'
      },
      veelterm: {
        titel: 'Veeltermen en graad', html:
          '<div class="def">Een <b>veelterm</b> is een som van eentermen.</div>' +
          '<p>In de veelterm 2n + 3 zijn 2n en 3 de <b>termen</b>. 2 is de coëfficiënt, n is de variabele en 3 is de constante.</p>' +
          '<div class="def">De <b>graad</b> van een veelterm in één letter is de grootste exponent waarmee die letter in de herleide veelterm voorkomt.</div>' +
          '<div class="vb">4n − 7 is van de eerste graad in n. 0,75x² + 0,1x − 0,2 is van de tweede graad in x.</div><p>Let op: herleid eerst. x³ + 8x − x³ = 8x is van de eerste graad.</p>'
      },
      herleiden: {
        titel: 'Herleiden', html:
          '<p>Gelijksoortige eentermen kun je optellen of aftrekken. Je telt de coëfficiënten op en behoudt het lettergedeelte. Dat noem je <b>herleiden</b>.</p>' +
          '<div class="vb">9x + 5x = (9 + 5)x = 14x</div><div class="vb">−17y + 6y = (−17 + 6)y = −11y</div><div class="vb">0,25z − 1,75z + 0,5z = −1z = −z</div>' +
          '<p>Eentermen die niet gelijksoortig zijn, kun je niet samennemen: 9p + 2q blijft 9p + 2q.</p><div class="vb">2k + 5k² − 9k = 5k² − 7k</div><p>Tip: rangschik het eindresultaat volgens dalende machten.</p>'
      },
      getalwaarde: {
        titel: 'Getalwaarde', html:
          '<div class="def">Je bepaalt de <b>getalwaarde</b> van een eenterm of veelterm door de letters te vervangen door getallen en de opgave uit te rekenen.</div>' +
          '<div class="vb">3t + 2 voor t = 10: 3 · 10 + 2 = 32</div><div class="vb">2x² − 4x + 1 voor x = −1: 2 · (−1)² − 4 · (−1) + 1 = 2 + 4 + 1 = 7</div>' +
          '<p>Zet een negatief getal altijd tussen haakjes. Reken eerst de machten uit, dan de vermenigvuldigingen en pas daarna de optellingen en aftrekkingen.</p><p>Let op: −x² voor x = 3 is −(3²) = −9.</p>'
      },
      som: {
        titel: 'Som van veeltermen', html:
          '<ol><li>Laat de haakjes weg.</li><li>Tel de gelijksoortige eentermen bij elkaar op.</li></ol>' +
          '<div class="vb">(2a + 5) + (4a + 10) = 2a + 5 + 4a + 10 = 6a + 15</div><div class="vb">(x² − 3x + 8) + (7x − 11) = x² − 3x + 8 + 7x − 11 = x² + 4x − 3</div>'
      },
      verschil: {
        titel: 'Verschil van veeltermen', html:
          '<ol><li>Tel bij de eerste veelterm het tegengestelde van de tweede veelterm op.</li><li>Werk de haakjes weg.</li><li>Tel de gelijksoortige eentermen bij elkaar op.</li></ol>' +
          '<div class="vb">(x + 5) − (3x − 8) = x + 5 − 3x + 8 = −2x + 13</div><div class="vb">(6y − 5) − (−4y + 7) = 6y − 5 + 4y − 7 = 10y − 12</div>' +
          '<div class="def">Staat er een + voor de haakjes, dan mag je de haakjes gewoon weglaten. Staat er een − voor de haakjes, dan verander je alle termen tussen de haakjes van teken en laat je de haakjes weg.</div>'
      },
      product: {
        titel: 'Vermenigvuldigen bij letterrekenen', html:
          '<p>Vermenigvuldig de getallen met elkaar en de letters met elkaar.</p><div class="vb">3 · (5x) = (3 · 5)x = 15x</div><div class="vb">−4 · (7y) = −28y</div><div class="vb">x · (3x) = 3x²</div>'
      },
      distributiviteit: {
        titel: 'De distributiviteit', html:
          '<div class="def">Het vermenigvuldigen is distributief ten opzichte van de optelling en de aftrekking: a · (b + c) = a · b + a · c</div>' +
          '<p>Je vermenigvuldigt de factor voor de haakjes met <b>elke</b> term tussen de haakjes.</p>' +
          '<div class="vb">4 · (2x + 3) = 4 · 2x + 4 · 3 = 8x + 12</div><div class="vb">−0,5 · (12x² + 8x) = −6x² − 4x</div><div class="vb">3x · (x − 5) = 3x · x + 3x · (−5) = 3x² − 15x</div>' +
          '<p>Je kunt dit voorstellen met de oppervlakte van een rechthoek: een rechthoek van 4 bij (2x + 3) bestaat uit een deel van 4 bij 2x en een deel van 4 bij 3.</p>'
      }
    },

    delen: [
      /* ============ 1 ALGEBRAÏSCHE UITDRUKKINGEN GEBRUIKEN ============ */
      {
        id: 'd1', nr: '1', titel: 'Algebraïsche uitdrukkingen gebruiken', hulp: ['eenterm', 'gelijksoortig', 'veelterm'], vragen: [
          { id: 'v01', titel: 'Potloden in een etui', type: 'mc', hulp: ['letters'], vraag: 'In een etui zitten p potloden. Naast het etui liggen nog 2 potloden. Welke algebraïsche uitdrukking geeft het totaal aantal potloden?',
            opties: ['p + 2', '2 · p', 'p − 2', '3 · p'], juist: 0, uitleg: 'Je telt de 2 losse potloden bij de p potloden in het etui: p + 2.' },
          { id: 'v02', titel: 'Coëfficiënt en lettergedeelte', type: 'invul', hulp: ['eenterm'], vraag: 'Vervolledig de tabel.',
            sjabloon: '<table><tr><th>eenterm</th><th>coëfficiënt</th><th>lettergedeelte</th></tr><tr><td>−9y</td><td>[[a1]]</td><td>[[a2]]</td></tr><tr><td>2ab</td><td>[[b1]]</td><td>[[b2]]</td></tr><tr><td>−xy²</td><td>[[c1]]</td><td>[[c2]]</td></tr><tr><td>p³</td><td>[[d1]]</td><td>[[d2]]</td></tr><tr><td>3,33p</td><td>[[e1]]</td><td>[[e2]]</td></tr><tr><td>0,5k²m</td><td>[[f1]]</td><td>[[f2]]</td></tr></table>',
            velden: { a1: G(-9, { w: 4 }), a2: K(LG, 'y'), b1: G(2, { w: 4 }), b2: K(LG, 'ab'), c1: G(-1, { w: 4 }), c2: K(LG, 'xy²'), d1: G(1, { w: 4 }), d2: K(LG, 'p³'), e1: G(3.33, { w: 4 }), e2: K(LG, 'p'), f1: G(0.5, { w: 4 }), f2: K(LG, 'k²m') },
            tip: 'Staat er geen getal voor de letters, dan is de coëfficiënt 1 of −1.', uitleg: 'De coëfficiënt is het getalgedeelte, met zijn teken. Bij −xy² is de coëfficiënt −1 en bij p³ is hij 1: die schrijf je niet.' },
          { id: 'v03', titel: 'Gelijksoortige eentermen', type: 'sleep', hulp: ['gelijksoortig'], vraag: 'Sorteer de eentermen volgens hun lettergedeelte.',
            vakken: ['lettergedeelte p', 'lettergedeelte p²', 'lettergedeelte pq', 'lettergedeelte p²q'], items: [['4p', 0], ['−p', 0], ['15p', 0], ['−9p²', 1], ['0,3p²', 1], ['6p²', 1], ['4pq', 2], ['7pq', 2], ['4p²q', 3], ['−2,5p²q', 3]],
            uitleg: 'Gelijksoortige eentermen hebben precies hetzelfde lettergedeelte. p en p² zijn verschillende lettergedeelten, net als pq en p²q.' },
          { id: 'v04', titel: 'Eenterm herkennen', type: 'mc', meerdere: true, hulp: ['eenterm', 'veelterm'], vraag: 'Welke uitdrukkingen zijn eentermen?',
            opties: ['4z', '{1/2}bh', '6z²', '2n + 3', 'x² + 4x − 1', '−2ab'], juist: [0, 1, 2, 5],
            uitleg: 'Een eenterm is één product van een coëfficiënt en letters. 2n + 3 en x² + 4x − 1 zijn sommen van eentermen: dat zijn veeltermen.' },
          { id: 'v05', titel: 'Afspraken toepassen', type: 'invul', hulp: ['eenterm'], vraag: 'Noteer elke eenterm volgens de afspraken.',
            sjabloon: rijen(['x · 2 = [[a]]', '4 · a · b = [[b]]', 'ba = [[c]]', '1ab = [[d]]', '−1xy = [[e]]', 'y · 3 · x = [[f]]']),
            velden: { a: T('2x'), b: T('4ab'), c: T('ab'), d: T('ab'), e: T('−xy', '-xy'), f: T('3xy') },
            uitleg: 'De coëfficiënt staat vooraan, het maalteken laat je weg, de letters staan alfabetisch en de coëfficiënten 1 en −1 schrijf je niet.' },
          { id: 'v06', titel: 'Patroon met tafels', type: 'invul', hulp: ['letters', 'typen'], vraag: 'Tafels worden tegen elkaar geschoven. Bij 1 tafel horen 5 stoelen, bij 2 tafels 8 stoelen en bij 3 tafels 11 stoelen. Het patroon zet zich zo verder.',
            sjabloon: 'Bij 4 tafels horen [[a]] stoelen.<br>Bij 5 tafels horen [[b]] stoelen.<br>Lettervorm voor het aantal stoelen s bij t tafels: s = [[c]]',
            velden: { a: G(14, { w: 3 }), b: G(17, { w: 3 }), c: A('3t + 2') }, tip: 'Hoeveel stoelen komen er telkens bij? Wat blijft er over als je dat van 5 aftrekt?',
            uitleg: 'Per tafel komen er 3 stoelen bij. Het aantal stoelen is 3 maal het aantal tafels plus 2: s = 3t + 2.' },
          { id: 'v07', titel: 'Graad van een veelterm', type: 'invul', hulp: ['veelterm'], vraag: 'Bepaal telkens de graad in x.',
            sjabloon: rijen(['−3x⁴ → graad [[a]]', 'x → graad [[b]]', '12x² → graad [[c]]', 'x² + 4x − 1 → graad [[d]]', 'x⁶ − x⁴ → graad [[e]]', 'x³ + 8x − x³ → graad [[f]]']),
            velden: { a: G(4, { w: 2 }), b: G(1, { w: 2 }), c: G(2, { w: 2 }), d: G(2, { w: 2 }), e: G(6, { w: 2 }), f: G(1, { w: 2 }) },
            tip: 'Herleid eerst voor je de graad bepaalt.', uitleg: 'De graad is de grootste exponent van x in de herleide veelterm. x = x¹ heeft graad 1. x³ + 8x − x³ = 8x heeft graad 1.' },
          { id: 'v08', titel: 'Wat is een veelterm?', type: 'mc', hulp: ['veelterm'], vraag: 'Wat is een veelterm?',
            opties: ['Een som van eentermen.', 'Een product van eentermen.', 'Een eenterm met veel letters.', 'Een getal zonder letters.'], juist: 0, uitleg: 'Een veelterm is een som van eentermen, bijvoorbeeld 2n + 3 of x² + 4x − 1.' },
          { id: 'v09', titel: 'Onderdelen van een veelterm', type: 'invul', hulp: ['veelterm'], vraag: 'Bekijk de veelterm 2n + 3. Vul aan.',
            sjabloon: '2 is [[a]]<br>n is [[b]]<br>3 is [[c]]<br>2n en 3 zijn [[d]]',
            velden: { a: K(DEEL, 'de coëfficiënt'), b: K(DEEL, 'de variabele'), c: K(DEEL, 'de constante'), d: K(DEEL, 'de termen') },
            uitleg: 'De veelterm 2n + 3 heeft twee termen. In de term 2n is 2 de coëfficiënt en n de variabele. De term 3 bevat geen letter: dat is de constante.' },
          { id: 'v10', titel: 'Leeftijden', type: 'invul', hulp: ['letters', 'typen'], vraag: 'Sem is x jaar. Zijn zus Nanne is 3 jaar ouder. Noteer met een algebraïsche uitdrukking.',
            sjabloon: 'De leeftijd van Nanne: [[a]]<br>De leeftijd van Sem en Nanne samen: [[b]]', velden: { a: A('x + 3'), b: A('2x + 3') },
            uitleg: 'Nanne is x + 3 jaar. Samen: x + (x + 3) = 2x + 3.' },
          { id: 'v11', titel: 'Eenterm of veelterm', type: 'sleep', hulp: ['eenterm', 'veelterm'], vraag: 'Is de uitdrukking een eenterm of een veelterm met meer dan één term?',
            vakken: ['Eenterm', 'Veelterm met meerdere termen'], items: [['5x', 0], ['−ab', 0], ['6z²', 0], ['2n + 3', 1], ['x² + 4x − 1', 1], ['3a − b', 1]],
            uitleg: 'Zie je een plus- of minteken tussen twee termen, dan is het een veelterm met meerdere termen.' },
          { id: 'v12', titel: 'Wanneer gelijksoortig?', type: 'mc', hulp: ['gelijksoortig'], vraag: 'Wanneer zijn twee eentermen gelijksoortig?',
            opties: ['Als ze hetzelfde lettergedeelte hebben.', 'Als ze dezelfde coëfficiënt hebben.', 'Als ze evenveel letters hebben.', 'Als ze hetzelfde teken hebben.'], juist: 0,
            uitleg: 'Alleen het lettergedeelte telt. 3x en −7x zijn gelijksoortig. 3x en 3y zijn dat niet, ook al hebben ze dezelfde coëfficiënt.' }
        ]
      },

      /* ============ 2 HERLEIDEN ============ */
      {
        id: 'd2', nr: '2', titel: 'Herleiden', hulp: ['herleiden', 'typen'], vragen: [
          { id: 'v01', titel: 'Gelijksoortige eentermen samennemen', type: 'invul', vraag: 'Herleid.',
            sjabloon: rijen(['9x + 3x = [[a]]', '12y + y = [[b]]', '−4z² + 12z² = [[c]]', '8a³ − 16a³ = [[d]]', '4xy + 2xy − 5xy = [[e]]', '−9a − 2a + 4a = [[f]]']),
            velden: { a: A('12x', { w: 7 }), b: A('13y', { w: 7 }), c: A('8z²', { w: 7 }), d: A('−8a³', { w: 7 }), e: A('xy', { w: 7 }), f: A('−7a', { w: 7 }) },
            uitleg: 'Tel de coëfficiënten op en behoud het lettergedeelte. y heeft coëfficiënt 1, dus 12y + y = 13y. 4 + 2 − 5 = 1, dus het resultaat is 1xy = xy.' },
          { id: 'v02', titel: 'Kan het herleid worden?', type: 'sleep', vraag: 'Kun je de som herleiden tot één eenterm?',
            vakken: ['Ja', 'Neen'], items: [['9x + 3x', 0], ['5ab − ab', 0], ['2k² − 4k²', 0], ['7b² + 3b', 1], ['−4 + 4a²', 1], ['9p + 2q', 1]],
            uitleg: 'Alleen een som van gelijksoortige eentermen kun je herleiden tot één eenterm. b² en b, 4 en a², p en q zijn niet gelijksoortig.' },
          { id: 'v03', titel: 'Herleiden in stappen', type: 'stappen', vraag: 'Herleid −17y + 6y.',
            stappen: ['Tel de coëfficiënten op: −17y + 6y = ( [[a]] + [[b]] ) y', 'Het resultaat is [[c]]'], velden: { a: G(-17, { w: 3 }), b: G(6, { w: 3 }), c: A('−11y', { w: 7 }) },
            uitleg: '−17y + 6y = (−17 + 6)y = −11y' },
          { id: 'v04', titel: 'Twee soorten eentermen', type: 'invul', vraag: 'Herleid.',
            sjabloon: '8x + 6y − 3x + 2y = [[a]]<br>−5x + 7x + 2y + 4x + 3y = [[b]]', velden: { a: A('5x + 8y'), b: A('6x + 5y') },
            tip: 'Neem eerst de eentermen met x samen en daarna die met y.', uitleg: '8x − 3x = 5x en 6y + 2y = 8y. In de tweede opgave: −5x + 7x + 4x = 6x en 2y + 3y = 5y.' },
          { id: 'v05', titel: 'Met machten', type: 'invul', vraag: 'Herleid en rangschik volgens dalende machten.',
            sjabloon: '−2x² + 4x² + 9x + 11x − 2x² = [[a]]<br>2k + 5k² − 9k = [[b]]', velden: { a: A('20x'), b: A('5k² − 7k') },
            uitleg: '−2x² + 4x² − 2x² = 0 en 9x + 11x = 20x. In de tweede opgave: 2k − 9k = −7k. De term 5k² heeft de hoogste macht en komt eerst.' },
          { id: 'v06', titel: 'Waarom lukt het niet?', type: 'mc', vraag: 'Waarom kun je 9p + 2q niet verder herleiden?',
            opties: ['Omdat 9p en 2q niet gelijksoortig zijn.', 'Omdat de coëfficiënten verschillend zijn.', 'Omdat er een plusteken staat.', 'Omdat 9 en 2 geen gemeenschappelijke deler hebben.'], juist: 0,
            uitleg: '9p en 2q hebben een verschillend lettergedeelte. Je kunt ze dus niet samennemen.' },
          { id: 'v07', titel: 'Kommagetallen en een context', type: 'invul', vraag: 'Herleid.',
            sjabloon: '0,25z − 1,75z + 0,5z = [[a]]<br>Er liggen 3 doosjes met x paaseitjes, 2 doosjes met y paaseitjes, nog 1 doosje met x paaseitjes en 6 losse paaseitjes.<br>3x + 2y + x + 6 = [[b]]',
            velden: { a: A('−z', { w: 7 }), b: A('4x + 2y + 6') }, uitleg: '0,25 − 1,75 + 0,5 = −1, dus −1z = −z. In de context kun je alleen 3x en x samennemen: 4x + 2y + 6.' },
          { id: 'v08', titel: 'Uitdaging met twee letters', type: 'invul', vraag: 'Herleid.',
            sjabloon: 'ab − ab² − 2a²b + 2ab² + 3a²b − 3ab = [[a]]', velden: { a: A('a²b + ab² − 2ab', { w: 18 }) },
            tip: 'Er zijn drie soorten eentermen: met ab, met ab² en met a²b.', uitleg: 'ab − 3ab = −2ab; −ab² + 2ab² = ab²; −2a²b + 3a²b = a²b. Samen: a²b + ab² − 2ab.' },
          { id: 'v09', titel: 'De fout van Lio', type: 'mc', vraag: 'Lio herleidt 3a + 4a tot 7a². Wat is het juiste resultaat?',
            opties: ['7a', '7a²', '12a', '12a²'], juist: 0, uitleg: 'Bij het optellen tel je alleen de coëfficiënten op. Het lettergedeelte blijft hetzelfde: 3a + 4a = 7a.' },
          { id: 'v10', titel: 'Opgave en resultaat', type: 'sleep', vraag: 'Koppel elke opgave aan het herleide resultaat.',
            paren: [['5x + 2x', '7x'], ['5x − 2x', '3x'], ['−5x + 2x', '−3x'], ['−5x − 2x', '−7x'], ['5x² + 2x²', '7x²']], extra: ['10x', '7x⁴'],
            uitleg: 'Let goed op de tekens van de coëfficiënten. Bij 5x² + 2x² blijft het lettergedeelte x²: het resultaat is 7x², niet 7x⁴.' }
        ]
      },

      /* ============ 3 GETALWAARDE ============ */
      {
        id: 'd3', nr: '3', titel: 'Getalwaarde', hulp: ['getalwaarde'], vragen: [
          { id: 'v01', titel: 'Getalwaarde van 3t + 2', type: 'invul', vraag: 'De lettervorm 3t + 2 geeft het aantal stoelen bij t tafels. Bereken de getalwaarde.',
            sjabloon: rijen(['voor t = 10: [[a]]', 'voor t = 4: [[b]]', 'voor t = 0: [[c]]']), velden: { a: G(32), b: G(14), c: G(2) },
            uitleg: '3 · 10 + 2 = 32; 3 · 4 + 2 = 14; 3 · 0 + 2 = 2.' },
          { id: 'v02', titel: 'Getalwaarde in stappen', type: 'stappen', vraag: 'Bereken de getalwaarde van 2x² − 4x + 1 voor x = −1.',
            stappen: ['2 · (−1)² = [[a]]', '−4 · (−1) = [[b]]', 'De getalwaarde is [[a2]] + [[b2]] + 1 = [[c]]'], velden: { a: G(2, { w: 3 }), b: G(4, { w: 3 }), a2: G(2, { w: 3 }), b2: G(4, { w: 3 }), c: G(7, { w: 3 }) },
            uitleg: '(−1)² = 1, dus 2 · 1 = 2. Min maal min is plus: −4 · (−1) = 4. Samen: 2 + 4 + 1 = 7.' },
          { id: 'v03', titel: 'Drie getalwaarden', type: 'invul', vraag: 'Bereken de getalwaarde.',
            sjabloon: '3t − 2 voor t = 0,5: [[a]]<br>x³ − 4x² voor x = −1: [[b]]<br>−x² + 2x − 1 voor x = −2: [[c]]', velden: { a: G(-0.5), b: G(-5), c: G(-9) },
            tip: 'Zet een negatief getal tussen haakjes en reken eerst de machten uit.', uitleg: '3 · 0,5 − 2 = −0,5. (−1)³ − 4 · (−1)² = −1 − 4 = −5. −(−2)² + 2 · (−2) − 1 = −4 − 4 − 1 = −9.' },
          { id: 'v04', titel: 'Eierdozen', type: 'invul', vraag: 'Er zijn drie soorten eierdozen: voor a eitjes, voor b eitjes en voor c eitjes. Bereken het aantal eitjes voor a = 12, b = 10 en c = 6.',
            sjabloon: rijen(['3a = [[x]]', 'b + c = [[y]]', '2b + 5c = [[z]]']), velden: { x: G(36), y: G(16), z: G(50) },
            uitleg: '3 · 12 = 36; 10 + 6 = 16; 2 · 10 + 5 · 6 = 20 + 30 = 50.' },
          { id: 'v05', titel: 'Opletten met het minteken', type: 'mc', vast: true, vraag: 'Wat is de getalwaarde van −x² voor x = 3?',
            opties: ['−9', '9', '−6', '6'], juist: 0, uitleg: 'Je rekent eerst de macht uit: 3² = 9. Daarna komt het minteken ervoor: −9. Alleen bij (−3)² is het resultaat 9.' },
          { id: 'v06', titel: 'Tabel met getalwaarden', type: 'invul', vraag: 'Vul de tabel aan.',
            sjabloon: '<table><tr><th>x</th><th>2x + 1</th><th>x²</th></tr><tr><td>−2</td><td>[[a]]</td><td>[[b]]</td></tr><tr><td>0</td><td>[[c]]</td><td>[[d]]</td></tr><tr><td>3</td><td>[[e]]</td><td>[[f]]</td></tr></table>',
            velden: { a: G(-3, { w: 3 }), b: G(4, { w: 3 }), c: G(1, { w: 3 }), d: G(0, { w: 3 }), e: G(7, { w: 3 }), f: G(9, { w: 3 }) },
            uitleg: '2 · (−2) + 1 = −3 en (−2)² = 4. Voor x = 0: 1 en 0. Voor x = 3: 7 en 9.' },
          { id: 'v07', titel: 'Formules gebruiken', type: 'invul', vraag: 'Bereken met de formule.',
            sjabloon: 'De oppervlakte van een driehoek is {b · h/2}. Voor b = 14 cm en h = 18 cm is de oppervlakte [[a]] cm²<br>De som van de eerste n natuurlijke getallen (zonder nul) is {n · (n + 1)/2}.<br>Voor n = 8 is de som [[b]]<br>Voor n = 100 is de som [[c]]',
            velden: { a: G(126), b: G(36), c: G(5050) }, uitleg: '14 · 18 : 2 = 126. 8 · 9 : 2 = 36. 100 · 101 : 2 = 5050.' },
          { id: 'v08', titel: 'Vogels in formatie', type: 'invul', vraag: 'Vogels vliegen in een V-formatie. Het aantal vogels in formatie n is 2n + 3.',
            sjabloon: 'In formatie 4 vliegen [[a]] vogels.<br>In formatie 10 vliegen [[b]] vogels.<br>In formatie 50 vliegen [[c]] vogels.', velden: { a: G(11, { w: 3 }), b: G(23, { w: 3 }), c: G(103, { w: 3 }) },
            uitleg: '2 · 4 + 3 = 11; 2 · 10 + 3 = 23; 2 · 50 + 3 = 103.' },
          { id: 'v09', titel: 'Twee letters', type: 'invul', vraag: 'Bereken de getalwaarde voor a = −2 en b = 3.',
            sjabloon: rijen(['4ab = [[x]]', 'a²b = [[y]]', 'a − b = [[z]]']), velden: { x: G(-24), y: G(12), z: G(-5) },
            uitleg: '4 · (−2) · 3 = −24. (−2)² · 3 = 4 · 3 = 12. −2 − 3 = −5.' },
          { id: 'v10', titel: 'Wat is de getalwaarde?', type: 'mc', vraag: 'Hoe bepaal je de getalwaarde van een veelterm?',
            opties: ['Je vervangt de letters door de gegeven getallen en rekent de opgave uit.', 'Je telt alle coëfficiënten bij elkaar op.', 'Je zoekt de grootste exponent.', 'Je neemt de gelijksoortige eentermen samen.'], juist: 0,
            uitleg: 'Bij de getalwaarde vervang je elke letter door het gegeven getal. De coëfficiënten optellen is herleiden, de grootste exponent zoeken is de graad bepalen.' }
        ]
      },

      /* ============ 4 SOM EN VERSCHIL VAN VEELTERMEN ============ */
      {
        id: 'd4', nr: '4', titel: 'Som en verschil van veeltermen', hulp: ['som', 'verschil', 'typen'], vragen: [
          { id: 'v01', titel: 'Som in stappen', type: 'stappen', hulp: ['som', 'typen'], vraag: 'Bereken (x² − 3x + 8) + (7x − 11).',
            stappen: ['Laat de haakjes weg: x² − 3x + 8 [[a]] 7x [[b]] 11', 'Neem de gelijksoortige eentermen samen: [[c]]'], velden: { a: K(PM, '+'), b: K(PM, '−'), c: A('x² + 4x − 3') },
            uitleg: 'Er staat een + voor de haakjes, dus de tekens blijven: x² − 3x + 8 + 7x − 11 = x² + 4x − 3.' },
          { id: 'v02', titel: 'Veeltermen optellen', type: 'invul', hulp: ['som', 'typen'], vraag: 'Bereken.',
            sjabloon: '(2a + 5) + (4a + 10) = [[a]]<br>(6 − 2x) + (9x + 1) = [[b]]<br>(4x² − x) + (7x² − 3x) = [[c]]<br>(13x² − 10) + (8x + 2) = [[d]]',
            velden: { a: A('6a + 15'), b: A('7x + 7'), c: A('11x² − 4x'), d: A('13x² + 8x − 8') },
            uitleg: 'Laat de haakjes weg en neem de gelijksoortige eentermen samen. Bijvoorbeeld: 6 − 2x + 9x + 1 = 7x + 7.' },
          { id: 'v03', titel: 'Het tegengestelde', type: 'mc', hulp: ['verschil'], vraag: 'Wat is het tegengestelde van de veelterm 3x − 8?',
            opties: ['−3x + 8', '−3x − 8', '3x + 8', '8x − 3'], juist: 0, uitleg: 'Bij het tegengestelde verander je elke term van teken: 3x wordt −3x en −8 wordt +8.' },
          { id: 'v04', titel: 'Verschil in stappen', type: 'stappen', hulp: ['verschil', 'typen'], vraag: 'Bereken (x + 5) − (3x − 8).',
            stappen: ['Werk de haakjes weg: x + 5 [[a]] 3x [[b]] 8', 'Neem de gelijksoortige eentermen samen: [[c]]'], velden: { a: K(PM, '−'), b: K(PM, '+'), c: A('−2x + 13') },
            uitleg: 'Er staat een − voor de haakjes, dus elke term tussen de haakjes verandert van teken: x + 5 − 3x + 8 = −2x + 13.' },
          { id: 'v05', titel: 'Veeltermen aftrekken', type: 'invul', hulp: ['verschil', 'typen'], vraag: 'Bereken.',
            sjabloon: '(5x − 7) − (3x + 2) = [[a]]<br>(−3x + 9) − (−2x + 5) = [[b]]<br>(6y − 5) − (−4y + 7) = [[c]]', velden: { a: A('2x − 9'), b: A('−x + 4'), c: A('10y − 12') },
            uitleg: '5x − 7 − 3x − 2 = 2x − 9. −3x + 9 + 2x − 5 = −x + 4. 6y − 5 + 4y − 7 = 10y − 12.' },
          { id: 'v06', titel: 'De regel voor haakjes', type: 'invul', hulp: ['verschil'], vraag: 'Vul de regel aan.',
            sjabloon: 'Staat er een + voor de haakjes, dan [[a]]<br>Staat er een − voor de haakjes, dan [[b]]',
            velden: { a: K(['blijven alle tekens tussen de haakjes gelijk', 'veranderen alle termen tussen de haakjes van teken', 'verandert alleen de eerste term van teken'], 'blijven alle tekens tussen de haakjes gelijk'), b: K(['blijven alle tekens tussen de haakjes gelijk', 'veranderen alle termen tussen de haakjes van teken', 'verandert alleen de eerste term van teken'], 'veranderen alle termen tussen de haakjes van teken') },
            uitleg: 'Bij een + mag je de haakjes gewoon weglaten. Bij een − verander je alle termen tussen de haakjes van teken, niet alleen de eerste.' },
          { id: 'v07', titel: 'Met kommagetallen', type: 'invul', hulp: ['som', 'verschil', 'typen'], vraag: 'Bereken.',
            sjabloon: '(0,4x − 1) + (1,2x + 0,8) + (−0,4x + 2,4) = [[a]]<br>(4,25x − 1) − (−0,75x + 0,25) = [[b]]', velden: { a: A('1,2x + 2,2'), b: A('5x − 1,25') },
            uitleg: '0,4x + 1,2x − 0,4x = 1,2x en −1 + 0,8 + 2,4 = 2,2. In de tweede opgave: 4,25x + 0,75x = 5x en −1 − 0,25 = −1,25.' },
          { id: 'v08', titel: 'Drie veeltermen', type: 'invul', hulp: ['verschil', 'typen'], vraag: 'Bereken.',
            sjabloon: '(4x² − 15x + 10) − (−15x + 3) − (x² − 7x) = [[a]]', velden: { a: A('3x² + 7x + 7', { w: 16 }) },
            tip: 'Werk eerst alle haakjes weg. Let op bij elk minteken voor een haakje.', uitleg: '4x² − 15x + 10 + 15x − 3 − x² + 7x = 3x² + 7x + 7' },
          { id: 'v09', titel: 'Knikkers', type: 'invul', hulp: ['som', 'verschil', 'typen'], vraag: 'In zak A zitten 3x + 4 knikkers. In zak B zitten 2x − 1 knikkers.',
            sjabloon: 'Samen zitten er [[a]] knikkers in de zakken.<br>In zak A zitten er [[b]] knikkers meer dan in zak B.', velden: { a: A('5x + 3'), b: A('x + 5') },
            uitleg: 'Samen: (3x + 4) + (2x − 1) = 5x + 3. Verschil: (3x + 4) − (2x − 1) = 3x + 4 − 2x + 1 = x + 5.' },
          { id: 'v10', titel: 'Opgave en resultaat', type: 'sleep', hulp: ['som', 'verschil'], vraag: 'Koppel elke opgave aan het juiste resultaat.',
            paren: [['(x + 5) + (3x − 8)', '4x − 3'], ['(x + 5) − (3x − 8)', '−2x + 13'], ['(x − 5) + (3x + 8)', '4x + 3'], ['(x − 5) − (3x + 8)', '−2x − 13']], extra: ['−2x − 3'],
            uitleg: 'Bij een som blijven de tekens gelijk. Bij een verschil veranderen alle termen van de tweede veelterm van teken.' },
          { id: 'v11', titel: 'Zoek de fout', type: 'mc', hulp: ['verschil'], vraag: 'Yara rekent: (5x − 7) − (3x + 2) = 5x − 7 − 3x + 2 = 2x − 5. Wat is het juiste resultaat?',
            opties: ['2x − 9', '2x − 5', '8x − 9', '2x + 9'], juist: 0, uitleg: 'Yara veranderde alleen de eerste term van teken. Het moet zijn: 5x − 7 − 3x − 2 = 2x − 9.' }
        ]
      },

      /* ============ 5 DISTRIBUTIVITEIT ============ */
      {
        id: 'd5', nr: '5', titel: 'De distributiviteit van de vermenigvuldiging t.o.v. de optelling', hulp: ['product', 'distributiviteit', 'typen'], vragen: [
          { id: 'v01', titel: 'Een eenterm vermenigvuldigen', type: 'invul', hulp: ['product', 'typen'], vraag: 'Bereken.',
            sjabloon: rijen(['3 · (5x) = [[a]]', '−4 · (7y) = [[b]]', 'x · (3x) = [[c]]', '5 · (9x²) = [[d]]', '0,25 · (−24y) = [[e]]', '−3 · (0,7z) = [[f]]']),
            velden: { a: A('15x', { w: 7 }), b: A('−28y', { w: 7 }), c: A('3x²', { w: 7 }), d: A('45x²', { w: 7 }), e: A('−6y', { w: 7 }), f: A('−2,1z', { w: 7 }) },
            uitleg: 'Vermenigvuldig de getallen met elkaar en de letters met elkaar. x · 3x = 3x², want x · x = x².' },
          { id: 'v02', titel: 'Distributiviteit in stappen', type: 'stappen', hulp: ['distributiviteit', 'typen'], vraag: 'Bereken 4 · (2x + 3).',
            stappen: ['Vermenigvuldig 4 met elke term: 4 · (2x + 3) = 4 · [[a]] + 4 · [[b]]', 'Werk uit: [[c]]'], velden: { a: A('2x', { w: 5 }), b: G(3, { w: 3 }), c: A('8x + 12') },
            uitleg: '4 · (2x + 3) = 4 · 2x + 4 · 3 = 8x + 12' },
          { id: 'v03', titel: 'Oppervlakte van een rechthoek', type: 'invul', hulp: ['distributiviteit', 'typen'], vraag: 'De rechthoek heeft hoogte 4 en breedte 2x + 3. Noteer de oppervlakte.',
            figuur: { html: MODEL }, sjabloon: 'Oppervlakte van deel A: [[a]]<br>Oppervlakte van deel B: [[b]]<br>Oppervlakte van de hele rechthoek: 4 · (2x + 3) = [[c]]',
            velden: { a: A('8x', { w: 7 }), b: G(12, { w: 4 }), c: A('8x + 12') }, uitleg: 'Deel A: 4 · 2x = 8x. Deel B: 4 · 3 = 12. Samen: 4 · (2x + 3) = 8x + 12.' },
          { id: 'v04', titel: 'Haakjes uitwerken', type: 'invul', hulp: ['distributiviteit', 'typen'], vraag: 'Bereken.',
            sjabloon: '8 · (5x − 4) = [[a]]<br>−2 · (−1,6x + 1,3) = [[b]]<br>x · (−3x + 7) = [[c]]<br>3x · (x − 5) = [[d]]',
            velden: { a: A('40x − 32'), b: A('3,2x − 2,6'), c: A('−3x² + 7x'), d: A('3x² − 15x') },
            tip: 'Vermenigvuldig met elke term en let op de tekens.', uitleg: '8 · 5x − 8 · 4 = 40x − 32. −2 · (−1,6x) = 3,2x en −2 · 1,3 = −2,6. x · (−3x) = −3x² en x · 7 = 7x. 3x · x = 3x² en 3x · (−5) = −15x.' },
          { id: 'v05', titel: 'Met kommagetal en breuk', type: 'invul', hulp: ['distributiviteit', 'typen'], vraag: 'Bereken.',
            sjabloon: '−0,5 · (12x² + 8x) = [[a]]<br>{2/3}x · (9x + 6) = [[b]]', velden: { a: A('−6x² − 4x'), b: A('6x² + 4x') },
            uitleg: '−0,5 · 12x² = −6x² en −0,5 · 8x = −4x. {2/3}x · 9x = 6x² en {2/3}x · 6 = 4x.' },
          { id: 'v06', titel: 'Zoek de fout', type: 'mc', hulp: ['distributiviteit'], vraag: 'Milan rekent: 3 · (x + 2) = 3x + 2. Wat is het juiste resultaat?',
            opties: ['3x + 6', '3x + 2', '3x + 5', '6x'], juist: 0, uitleg: 'Je moet 3 met elke term tussen de haakjes vermenigvuldigen: 3 · x + 3 · 2 = 3x + 6.' },
          { id: 'v07', titel: 'Opgave en resultaat', type: 'sleep', hulp: ['distributiviteit'], vraag: 'Koppel elke opgave aan het juiste resultaat.',
            paren: [['2 · (x + 3)', '2x + 6'], ['2 · (x − 3)', '2x − 6'], ['−2 · (x + 3)', '−2x − 6'], ['−2 · (x − 3)', '−2x + 6'], ['x · (x + 3)', 'x² + 3x']], extra: ['2x + 3'],
            uitleg: 'Let op de tekens: min maal plus is min en min maal min is plus. x · x = x².' },
          { id: 'v08', titel: 'Kaarsen en tanks', type: 'invul', hulp: ['distributiviteit', 'typen'], vraag: 'Noteer een herleide algebraïsche uitdrukking.',
            sjabloon: 'Een geurkaars kost x euro. Koop je er 5, dan krijg je 1 euro korting per kaars.<br>De prijs voor 5 kaarsen: 5 · (x − 1) = [[a]]<br>In een tank zit b liter benzine. Met 5 liter erbij is de tank vol.<br>De inhoud van 8 volle tanks: 8 · (b + 5) = [[b]]',
            velden: { a: A('5x − 5'), b: A('8b + 40') }, uitleg: '5 · x − 5 · 1 = 5x − 5 en 8 · b + 8 · 5 = 8b + 40.' },
          { id: 'v09', titel: 'De turnmat', type: 'invul', hulp: ['distributiviteit', 'typen'], vraag: 'Een turnmat is x breed. De lengte bestaat uit een deel van 2 en een deel van x.',
            figuur: { html: MAT }, sjabloon: 'De lengte van de turnmat: [[a]]<br>De oppervlakte van de turnmat: x · (x + 2) = [[b]]<br>De omtrek van de turnmat: [[c]]',
            velden: { a: A('x + 2', { w: 7 }), b: A('x² + 2x'), c: A('4x + 4') },
            tip: 'De omtrek is twee keer de lengte plus twee keer de breedte.', uitleg: 'Lengte: x + 2. Oppervlakte: x · x + x · 2 = x² + 2x. Omtrek: 2 · (x + 2) + 2 · x = 2x + 4 + 2x = 4x + 4.' },
          { id: 'v10', titel: 'Uitwerken en herleiden', type: 'stappen', hulp: ['distributiviteit', 'herleiden', 'typen'], vraag: 'Bereken 3 · (x + 2) + 2 · (x − 1).',
            stappen: ['3 · (x + 2) = [[a]]', '2 · (x − 1) = [[b]]', 'Tel beide resultaten op en herleid: [[c]]'], velden: { a: A('3x + 6', { w: 8 }), b: A('2x − 2', { w: 8 }), c: A('5x + 4', { w: 8 }) },
            uitleg: '3x + 6 + 2x − 2 = 5x + 4' },
          { id: 'v11', titel: 'Letterkoekjes', type: 'invul', hulp: ['distributiviteit', 'getalwaarde', 'typen'], vraag: 'Fleur en Pablo krijgen elk een doos met k koekjes en elk 5 koekjes extra. Dat gebeurt 5 dagen na elkaar.',
            sjabloon: 'Het totaal aantal koekjes in een week: 5 · 2 · (k + 5) = [[a]]<br>Voor k = 20 zijn dat [[b]] koekjes.', velden: { a: A('10k + 50'), b: G(250, { w: 4 }) },
            uitleg: '5 · 2 = 10 en 10 · (k + 5) = 10k + 50. Voor k = 20: 10 · 20 + 50 = 250.' }
        ]
      }
    ]
  });
})();
