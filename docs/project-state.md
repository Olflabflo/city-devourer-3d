# Projektstand – City Devourer 3D

Stand: 8. November 2026 · Lieferung S1 · Ausgangsrevision `1354abd9f31b0ec86b8752f097981ae26453c997`

City Devourer 3D ist ein statisch ausgeliefertes WebGL-Arcadespiel für Desktop und Smartphone. Die Version mit 30 Landschaften ist auf [Netlify](https://city-devourer-3d.netlify.app/) öffentlich spielbar. Quellcode und Produktionsbranch liegen im [Spielrepository](https://github.com/Olflabflo/city-devourer-3d). Bei der Übernahme waren dort keine offenen Issues oder Pull Requests sichtbar.

- [Roadmap und Arbeitspakete](roadmap.md)
- [Entscheidungen](decisions.md)
- [Freigegebene Analyse A1](sdd/30-landschaften/01-projektanalyse.md)
- [Freigegebene Spezifikation S1](sdd/30-landschaften/02-spezifikation.md)
- [Umsetzungs- und Prüfprotokoll](sdd/30-landschaften/03-umsetzung.md)

```text
✓ Ausgangslage  →  ✓ Analyse  →  ✓ Spezifikation  →  ✓ Umsetzung  →  ✓ Veröffentlichung
```

**Stand:** 5 von 5 Meilensteinen erreicht. S1 ist veröffentlicht. [Commit 20ef8d7](https://github.com/Olflabflo/city-devourer-3d/commit/20ef8d7a769d14949254c67eec99ff20fbd520f3) · [Netlify-Deploy](https://app.netlify.com/projects/city-devourer-3d/deploys/6af0721b427fe11c0c25500a).

## Letzte Nachweise

- `npm test`: sieben erfolgreiche Tests zu Grundregeln, Layouts, Wachstum, Ressourcenfreigabe und Flusskarten.
- `npm run build`: TypeScript und Vite erfolgreich. Vite meldet einen JS-Chunk über 500 kB.
- Chromium: 30 Karten in einer Sitzung geladen und gestartet. Kartenwechsel, Wachstum, Pause, Timer, Neustart, Rekorde und emulierte Touch-Steuerung geprüft. Eine komplette Endlosrunde im Ameisenbau erfasst 100 von 100 Objekten.
- Produktion: Netlify hat den GitHub-Commit für S1 veröffentlicht. Der öffentliche Browsercheck zeigte 30 Karten und startete den Ameisenbau ohne Anmeldung.

## Nächster Meilenstein und Arbeitspaket

**M6 · Geräteabnahme (vorgeschlagen).** Die Desktop- und Mobilprüfung lief in Chromium. Die tatsächliche Touch-Bedienung und Darstellung auf einem Android-Gerät bleiben offen.

**WP-05 · Android-Spielrunde.** Auf einem Android-Smartphone mit Chrome die öffentliche URL öffnen. Im Hochformat den Ameisenbau auswählen, im Zeitmodus per Joystick Stufe 2 erreichen, pausieren und fortsetzen. Nach Ablauf der Runde prüfen, dass der Rekord einen Reload übersteht. Erfolg heißt, dass die Karte lädt, der Joystick ohne Seitenscrollen reagiert und Timer, Pause und Rekord wie beschrieben funktionieren. Gerät, Browser-Version und Auffälligkeiten im Prüfprotokoll festhalten. Voraussetzung ist ein verfügbares Android-Gerät.

## Prüfpaket WP-06 · Spielstart und Deploy Preview

- Gemeldet: Das Menü erscheint, der Klick auf „Spielen“ bleibt ohne Reaktion. Der genaue Ladefehler auf dem betroffenen Gerät ist offen.
- Reproduktion: Wird das Spielmodul im Browser absichtlich blockiert, ließ der bisherige Stand einen aktiven, aber funktionslosen Button stehen. Die Produktions-URL lieferte HTML, JavaScript und CSS im Test jeweils mit HTTP 200.
- Änderung: „Spielen“ ist bis zur Initialisierung deaktiviert. Fehler beim Laden des Spielcodes oder beim Aufbau der WebGL-Szene erhalten eine eigene Meldung.
- Prüfung: Sieben Logiktests und der Build bestanden. Der Browsercheck mit blockiertem Modul sowie der normale Rundenstart mit echter Browserzeit bestanden lokal.
- Freigabe: Der Nutzer hat GitHub-PR und Netlify Deploy Preview beauftragt. Zuerst die Vorschau im betroffenen Browser prüfen. Für die Übernahme nach main und Produktion ist eine separate Freigabe erforderlich.
