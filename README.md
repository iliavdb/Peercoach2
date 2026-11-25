# PeerCoach

PeerCoach is de plek waar studenten van Techniek College Rotterdam elkaar helpen en samen verder komen. De applicatie is gebouwd met React, JSX en Vite.

## Lokaal starten

Gebruik de Vite-ontwikkelserver om de applicatie te openen. Open `index.html` niet rechtstreeks en gebruik niet de VS Code Live Server-extensie: die zet JSX niet om naar JavaScript.

```sh
npm install
npm run dev
```

Open daarna de URL die Vite in de terminal toont (standaard `http://localhost:5173/`).

## Voorbeeldrollen

Op de inlogpagina kun je een van de voorbeeldaccounts kiezen:

- Student: `noor.bakker@student.zadkine.nl`
- Docent: `marieke.dejong@tcrmbo.nl`

Voor beide voorbeeldaccounts is het wachtwoord `peercoach`. De accounts tonen fictieve, rolgerichte profielen, roosters en meldingen; er is geen echte authenticatie of koppeling met schoolgegevens.
De knop **Start demomodus** op de homepage opent de studentdemo direct. De docentdemo is te openen via de rolkeuze op de inlogpagina.
In het studentportaal kun je een peercoach-afspraak voorbereiden; in het docentportaal kun je studentopvolging afhandelen. Deze voorbeeldacties werken lokaal in de browser.

## Controleren en bouwen

```sh
npm run lint
npm run build
```
