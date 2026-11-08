# Projektstand – City Devourer 3D

Stand: 8. November 2026 · Lieferung S1 · Ausgangsrevision `1354abd9f31b0ec86b8752f097981ae26453c997`

City Devourer 3D ist ein statisch ausgeliefertes WebGL-Arcadespiel für Desktop und Smartphone. Die Ausgangsversion mit dem Hafenviertel ist auf [Netlify](https://city-devourer-3d.netlify.app/) öffentlich verfügbar. Quellcode und Produktionsbranch liegen im [Spielrepository](https://github.com/Olflabflo/city-devourer-3d). Bei der Übernahme waren dort keine offenen Issues oder Pull Requests sichtbar.

- [Roadmap und Arbeitspakete](roadmap.md)
- [Entscheidungen](decisions.md)
- [Freigegebene Analyse A1](sdd/30-landschaften/01-projektanalyse.md)
- [Freigegebene Spezifikation S1](sdd/30-landschaften/02-spezifikation.md)
- [Umsetzungs- und Prüfprotokoll](sdd/30-landschaften/03-umsetzung.md)

```text
✓ Ausgangslage  →  ✓ Analyse  →  ✓ Spezifikation  →  ✓ Umsetzung  →  ● Veröffentlichung
```

**Stand:** 4 von 5 Meilensteinen erreicht. **Aktuell:** Veröffentlichung M5. Die 30 Karten sind im Entwicklungsstand spielbar. Der Produktionsnachweis wird für die ausgelieferte Revision geführt.

## Letzte Nachweise

- `npm test`: sieben erfolgreiche Tests zu Grundregeln, Layouts, Wachstum, Ressourcenfreigabe und Flusskarten.
- `npm run build`: TypeScript und Vite erfolgreich. Vite meldet einen JS-Chunk über 500 kB.
- Chromium: 30 Karten in einer Sitzung geladen und gestartet. Kartenwechsel, Wachstum, Pause, Timer, Neustart, Rekorde und emulierte Touch-Steuerung geprüft. Eine komplette Endlosrunde im Ameisenbau erfasst 100 von 100 Objekten.
- Offener Nachweis für den Release: Netlify-Commit abgleichen und neue Karten öffentlich ohne Anmeldung starten.

## Nächster Meilenstein und Arbeitspaket

M5 · Veröffentlichung. WP-04 prüft den Produktionsbuild nach dem Push. Erfolgreich ist das Paket, wenn Netlify den GitHub-Commit ausliefert und die öffentliche URL ohne Anmeldung eine neue Karte startet. Zuständig: Codex. Abhängigkeit: verbundener Netlify-Build.

Nach der Veröffentlichung bietet sich als nächster Prüfschritt eine Geräteabnahme an. Eine reale Android-Testrunde ist offen, weil die bisherige Touch-Prüfung in der Emulation lief.

