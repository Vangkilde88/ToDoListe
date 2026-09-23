# VangkildeToDo – fodboldklubber

Videreudvikling af det eksisterende statiske HTML-projekt. Ingen build, npm-installation eller ny database kræves. Firebase-projekt, anonym login, `todo/state`, PWA-manifest, ikoner og PIN er bevaret. Den gamle fælles tabel er erstattet med børnevalg og mobilvenlige rutiner; belønningsbjerget er erstattet med klubspillet.

## Første version

- Arthur, Bertil og Vester, hver med rutiner, konto, klubidentitet, køb, opsparingsmål, historik og streak.
- 8 morgenopgaver og 5 aftenopgaver. Timer starter med knappen eller første afkrydsning, fortsætter efter 10 minutter og overlever genindlæsning.
- 5 grundstjerner; kumulative bonusser ved strengt under 10/7/5 minutter. Op til 20 rutine-stjerner/dag; sponsorbonus er ekstra og gives kun én gang.
- 48 valgfrie køb i fire uafhængige grene, afhængigheder og visuelt SVG-klubområde med et særskilt element for hvert køb. Klubfarver anvendes på bygninger og badge; spilledragter vises foreløbig som ikoner.
- Begge rutiner på samme danske kalenderdag tæller til streak. 3/7/14/30/50/100-dages præmier beholdes efter afbrudt streak.
- Forældrekontor: PIN, stjernejustering med begrundelse, nulstilling af individuel rutine og download af komplet backup.
- Navn, farver og logo kan ændres; mobilnavigation og reduceret bevægelse understøttes.

## State, migration og persistens

`game.mjs` er den rene datamodel. `store.mjs` er Firebase-adapteren. `app.mjs` er UI. `world.mjs` tegner klubben. Prislisten er i [ECONOMY.md](ECONOMY.md); regler og priser ændres i `game.mjs`.

Firebase `todo/state` er fortsat den autoritative datakilde; localStorage `familieTodoV3` er fortsat backup. Første v4-transaktion bevarer hele det gamle dokument i `legacyBackupV3` inden migration. Ukendte felter og tidligere børneposter bevares som arkivdata, men kun de tre aktive børn vises. Eksisterende stars konverteres 1:1. Gamle belønningsdatoer spærrer for dobbelt belønning på migrationsdagen. Afkrydsning for kram flyttes fra indeks 6 til 7 om morgenen og 3 til 4 om aftenen. Migration er idempotent.

Alle mutationer læser seneste cloud-dokument i en Firebase-transaktion, validerer køb og belønningshistorik, og skriver atomisk. Transaktionsresultater vises først efter commit. Nulstilling bevarer dagens belønningshistorik. Offline vises sidst gemte data; køb og belønninger kræver netforbindelse. Der er ingen automatisk lokal fallback, der kan overskrive cloud-data.

**Ved overgang:** Luk/genindlæs gamle åbne appfaner på familiens enheder, før I bruger den nye version. Den gamle klient skriver hele dokumentet og kender ikke v4-felterne. Migrationen beskytter mod datatab i den nye klient, men kan ikke forhindre en gammel klient i at skrive sit gamle skema. Gendan ikke den gamle appversion som rollback efter nye køb; bevar v4-data og brug en rettelse fremad.

PIN er samme klientbaserede familiespærre som tidligere, ikke en ny sikkerhedsgrænse. Firestore-regler er ikke ændret eller verificeret. Forældrestyring af opgavelister/priser/tidsgrænser er ikke et UI i denne version; de ligger centralt i datamodellen. Stabil opgave-ID-migration bør tilføjes, før fri opgaveredigering aktiveres. Historikken vokser i det eksisterende fælles dokument; før flerårig omfattende brug bør den flyttes til underdokumenter for at undgå Firestores dokumentgrænse.

## Kør og test

```sh
python -m http.server 4173
node --test tests/*.test.mjs
```

Åbn appen med `?demo=1` for isoleret lokal afprøvning. Demoen viser tydeligt DEMO, starter uden familiekode og importerer aldrig Firebase-SDK'et. Den bruger sin egen localStorage-nøgle og starter på nul stjerner. Den normale app bruger fortsat PIN og fælles Firebase.

Enhedstest dækker migrationsfelter, grænsetider, langsom gennemførelse, børneisolation, dobbeltbelønning, nulstilling, dansk midnat, køb, afhængigheder, katalog og streak-præmier.

## Fælles rutiner på iPad

Forsiden har Morgen og Aften for alle tre børn. Hver rutine viser Arthur, Bertil og Vester i hver sin kolonne med egne startknapper, vedvarende timere, afkrydsninger og stjernekonti. Tre kolonner beholdes i både stående og liggende tablet-layout; små telefoner kan rulle vandret.

Belønningen vises inde i den færdige drengs kolonne uden dialog eller konfetti over de andres opgaver. Individuelle klubber åbnes fra knappen nederst i hver kolonne. Gemmehandlinger køres i en kø, så hurtige tryk fra flere børn ikke tabes under en langsom cloud-transaktion. Afkrydsninger gemmer den ønskede værdi frem for at vende værdien igen ved et dobbelttryk.

11 automatiske tests består, herunder samtidige opgaver, separate tidsbonusser og fortsat behandling efter fejl i køen. Visuel test på en rigtig iPad og mod live Firebase mangler fortsat; Vercel-forhåndsvisningen kræver adgang til teamet vangkilde.
