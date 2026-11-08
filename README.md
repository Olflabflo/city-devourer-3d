# City Devourer 3D

Ein clientseitiges 3D-Arcadespiel in einem prozeduralen Hafenviertel. Sammle Kleinteile, bis der Riss groß genug für Autos, Häuser und schließlich Hochhäuser ist.

## Lokal starten

Voraussetzung ist Node.js ab 22.18 mit npm sowie ein Browser mit WebGL 2.

```sh
npm ci
npm run dev
```

Öffne die von Vite angezeigte Adresse. Für den Produktionsbuild und die Vorschau:

```sh
npm test
npm run build
npm run preview
```

## Spielen

- WASD oder Pfeiltasten bewegen das Loch relativ zur Bildschirmansicht. Auf Touch-Geräten den Joystick links unten ziehen.
- Mit Pause, P oder Escape pausieren und fortsetzen.
- Im Zeitmodus bleiben 120 Sekunden für einen möglichst hohen Score. Im Endlosmodus endet die Partie, sobald alle Sammelobjekte verschluckt wurden.
- Die Stufe und der Durchmesser begrenzen, welche Objekte ins Loch passen. Das HUD zeigt das nächste Ziel.
- Highscores werden pro Modus auf dem jeweiligen Browser gespeichert. Der Ton lässt sich jederzeit umschalten.

## Aufbau

`main.ts` verwaltet Runde, Simulation und HUD. `rules.ts` enthält Wachstum, Verschluckregeln, Zeitlimit und Spatial Grid. `city.ts` baut 49 Stadtblöcke aus geometrischen Modellen und fasst gleichartige Teile pro Block in InstancedMeshes zusammen. `view.ts` enthält Kamera, Loch-Shader und Partikelpool. Auf Touch-Geräten verwendet die Darstellung ein niedrigeres Auflösungslimit und deaktiviert dynamische Schatten. Bilder, 3D-Modelle und Sound kommen ohne externe Asset-Dateien aus.

## GitHub und Netlify

Falls die Veröffentlichung noch aussteht, lege in GitHub ein leeres Repository namens `city-devourer-3d` an und pushe das Projekt auf `main`. Wähle anschließend in Netlify **Add new project → Import an existing project → GitHub** und das Repository aus. `netlify.toml` setzt den Build-Befehl auf `npm run build` und den Publish-Ordner auf `dist`. Umgebungsvariablen für das Spiel sind nicht nötig. Öffne nach dem erfolgreichen Deployment die Produktions-URL und starte je eine Runde in beiden Modi.

Für einen manuellen Upload kann der gebaute Ordner `dist` direkt als statisches Netlify-Deployment hochgeladen werden. Dieses Verfahren richtet keine automatischen Deployments aus GitHub ein.