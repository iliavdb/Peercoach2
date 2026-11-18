# PeerCoach

PeerCoach is de plek waar studenten van Techniek College Rotterdam elkaar helpen en samen verder komen. De applicatie is gebouwd met React, JSX en Vite.

## Lokaal starten

Gebruik de Vite-ontwikkelserver om de applicatie te openen. Open `index.html` niet rechtstreeks en gebruik niet de VS Code Live Server-extensie: die zet JSX niet om naar JavaScript.

```sh
npm install
npm run dev
```

Open daarna de URL die Vite in de terminal toont (standaard `http://localhost:5173/`).

## Controleren en bouwen

```sh
npm run lint
npm run build
```

## Hulpvragen

Studenten kunnen via het portaal een hulpvraag plaatsen en beheren. Hun open
vragen zijn zichtbaar in het peercoach-overzicht op `/hulpvragen`. Totdat er
een backend is aangesloten, worden hulpvragen lokaal in de browser bewaard.
