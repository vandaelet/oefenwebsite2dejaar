# Oefensite wiskunde 2de jaar: handleiding

Oefensite voor het tweede jaar van Campus Lievegem, met GitHub Pages (de website) en Firebase (aanmelden en resultaten bewaren). Dit is een aparte site naast die van het eerste jaar, met dezelfde lay-out en dezelfde niveaugroepen.

- **Leerlingen:** `index.html`
- **Leerkrachten:** `leerkracht.html`

## 1. Eerst bekijken zonder iets in te stellen

Pak de zip uit en dubbelklik op `index.html`. De site start in **demomodus**: er is geen echte login en de resultaten blijven alleen in je eigen browser. Zo kun je alle vragen uitproberen. Open ook `leerkracht.html` om de opvolging te zien met een paar voorbeeldleerlingen.

De demomodus stopt vanzelf zodra je in stap 2 je Firebase-gegevens invult.

## 2. Firebase instellen

Je kunt **hetzelfde Firebase-project als de site van het eerste jaar** gebruiken of een nieuw project maken. Deze site bewaart alles in collecties die met `oef2_` beginnen. De site van het eerste jaar gebruikt `oef_`. De twee sites zitten elkaar dus niet in de weg, ook niet in hetzelfde project.

1. **Authentication > Sign-in method:** schakel **Google** in.
2. **Authentication > Instellingen > Geautoriseerde domeinen:** voeg je GitHub-adres toe, bijvoorbeeld `jouwnaam.github.io`.
3. **Firestore Database:** maak een database aan als die er nog niet is. Kies een Europese locatie.
4. **Firestore Database > Regels:** plak de inhoud van `firestore.rules` en klik op Publiceren. Dit bestand bevat de regels voor beide sites (eerste en tweede jaar). Gebruik je hetzelfde project, dan vervangt het dus gewoon de regels die je voor het eerste jaar plakte.
5. **Projectinstellingen > Je apps > web-app > SDK-configuratie:** kopieer de waarden en plak ze in `js/config.js` op de plaats van de voorbeeldwaarden. Gebruik je hetzelfde project als het eerste jaar, dan zijn dat exact dezelfde waarden.

In `js/config.js` kun je ook het domein (`svsl.be`) en de lijst van niveaugroepen aanpassen. Verander je het domein, pas het dan ook aan in `firestore.rules`. Het voorvoegsel `oef2` laat je best staan.

## 3. Jezelf als eerste leerkracht toevoegen

Dit doe je één keer met de hand. Daarna voeg je collega's toe op de leerkrachtenpagina zelf. De lijst van leerkrachten staat los van die van het eerste jaar: je voegt jezelf dus ook hier toe.

1. Ga in de Firebase-console naar **Firestore Database > Gegevens**.
2. Klik op **Verzameling starten** en geef als naam `oef2_leerkrachten`.
3. Geef als **document-ID** je eigen e-mailadres in kleine letters, bijvoorbeeld `voornaam.naam@svsl.be`.
4. Voeg één veld toe, bijvoorbeeld `rol` met de waarde `leerkracht`, en bewaar.

## 4. Op GitHub zetten

1. Maak een **nieuwe repository** voor het tweede jaar (bijvoorbeeld `wiskunde2`) en upload **alle** bestanden en mappen uit deze zip. Behoud de mappenstructuur.
2. Ga naar **Settings > Pages**, kies bij Source de branch `main` en de map `/ (root)`.
3. Na een minuut staat de site op `https://jouwnaam.github.io/naam-van-de-repository/`.

De link voor leerkrachten is hetzelfde adres met `leerkracht.html` erachter.

## 5. Controleren

- Meld je als leerling aan met een svsl.be-account, kies een niveaugroep en maak een vraag.
- Open `leerkracht.html` en kijk of het resultaat verschijnt. Klik op **Vernieuw** als je de pagina al open had.
- Probeer aan te melden met een account van buiten svsl.be: dat moet geweigerd worden.

## 6. Modules aan- en afvinken

Op de leerkrachtenpagina, tabblad **Modules**, vink je aan welke modules de leerlingen zien. Een wijziging is meteen actief.

## 7. Een nieuwe module toevoegen

1. Zet het nieuwe bestand (bijvoorbeeld `m03.js`) in de map `modules` van deze site.
2. Open `modules/lijst.js` en voeg de bestandsnaam toe aan de lijst.
3. Vink de module aan op de leerkrachtenpagina.

Een modulebestand heeft dezelfde opbouw als `m01.js` en `m02.js`: een stuk `theorie` (voor de hulpknop) en `delen` (de tussentitels) met elk hun `vragen`. Staat in het bestand `standaardActief: false`, dan blijft de module verborgen tot je ze aanvinkt.

Belangrijk: geef elke vraag een eigen `id` en verander die later niet meer. De resultaten van de leerlingen zijn aan dat `id` gekoppeld.

### Beschikbare vraagtypes

| type | wat de leerling doet |
|---|---|
| `mc` | meerkeuze, met `meerdere: true` voor meerdere juiste antwoorden |
| `invul` | invullen in een zin of tabel: getal, tekst, breuk of keuzelijst |
| `stappen` | rekenvraag in genummerde tussenstappen |
| `sleep` | kaartjes naar vakken slepen, of koppelen met `paren` |
| `volgorde` | in de juiste volgorde zetten |
| `priem` | ontbinden in priemfactoren, eventueel met ggd of kgv |
| `venn` | gebieden van een venndiagram aanklikken |
| `getallenas` | getallen op een getallenas plaatsen |
| `teken` | tekenen, meten of slepen op het meetkundebord, ook op een rooster met assenstelsel |

Nieuw in deze site: bij `invul` en `stappen` bestaat ook een veld voor **lettervormen** (zoals `x² + 4x − 3`). De site leest wat de leerling typt, aanvaardt elke volgorde van de termen en gaat na of het antwoord volledig herleid is.

In teksten schrijf je een breuk als `{3/4}`: de site toont dan een breukstreep met de teller boven en de noemer onder. Een hoek met dakje schrijf je als `^A`.

## 8. Wat wordt er bewaard?

- Per leerling: naam, e-mailadres, niveaugroep en het tijdstip van de laatste aanmelding.
- Per vraag: de status (juist bij de eerste poging, juist na meerdere pogingen, nog niet juist, oplossing bekeken), het aantal pogingen en het tijdstip.

De antwoorden zelf worden niet bewaard. Alleen leerkrachten op de lijst kunnen de resultaten van alle leerlingen lezen.

## 9. Goed om te weten

- In het overzicht staan alleen leerlingen die zich al eens aanmeldden.
- Leerlingen kiezen hun niveaugroep zelf en kunnen die bovenaan wijzigen.
- De opgaven en oplossingen staan in de modulebestanden op GitHub. Wie technisch handig is, kan ze daar terugvinden. De site is bedoeld om te oefenen, niet om punten te geven.
- Nieuw schooljaar? Verwijder in de Firebase-console de collecties `oef2_resultaten` en `oef2_leerlingen`.
- De meetkundevragen werken het best op een laptop of Chromebook met muis of touchpad.
- Een macht typen leerlingen als `x^2` of `x2`. Onder het invulvak zien ze meteen hoe hun antwoord gelezen wordt.
- Staan beide sites op hetzelfde GitHub-account en in hetzelfde Firebase-project, dan blijft een leerling aangemeld als hij van de ene naar de andere site gaat.
