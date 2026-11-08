# Roadmap – City Devourer 3D

Die [freigegebene Spezifikation S1](sdd/30-landschaften/02-spezifikation.md) führt die 30 Karten und ihre Abnahmekriterien. Die Roadmap beschreibt die Lieferung und verweist für Tests und Einzelnachweise auf das [Umsetzungsprotokoll](sdd/30-landschaften/03-umsetzung.md).

| Meilenstein | Ergebnis und Abnahme | Abhängigkeit | Zuständig |
| --- | --- | --- | --- |
| M1 · Ausgangslage | Hafenviertel öffentlich spielbar, Baseline in A1 belegt | GitHub und Netlify | Codex |
| M2 · Analyse | 30 Karten insgesamt einschließlich Hafenviertel bestätigt | M1 | Nutzer |
| M3 · Spezifikation | Kartenliste und AC-001 bis AC-008 freigegeben | M2 | Nutzer |
| M4 · Welten spielbar | Alle Karten laden, die Wachstumskette ist erreichbar, Kartenwechsel und Rekorde funktionieren | M3 | Codex |
| M5 · Veröffentlichung | Produktionsbuild veröffentlicht, öffentlicher Start einer neuen Karte geprüft | M4, verbundener Netlify-Build | Codex |

Zeitfenster richten sich nach den Prüfungen und dem Deployment. Ein externer Termin wurde bisher nicht festgelegt. Der aktuelle Meilenstein und die nächste prüfbare Aufgabe stehen im [Projektstand](project-state.md).

## Arbeitspakete für M4 und M5

- WP-01 · Kartenwahl und Generierung. Das Startmenü bietet alle 30 Karten, der Generator erzeugt für jede eine unterscheidbare Anordnung und eine erreichbare Wachstumskette. Nachweis T01 und T02.
- WP-02 · Runden und Rekorde. Kartenwechsel, Neustart und lokale Rekorde respektieren Karten-ID und Modus. Nachweis T03 und T04.
- WP-03 · Browser- und Ressourcenprüfung. Alle Karten in einer Sitzung laden, Szenenfreigabe prüfen, typische Karten visuell und auf Touch prüfen. Nachweis T05 und Browserprotokoll.
- WP-04 · Auslieferung. Getesteten Stand über GitHub bereitstellen, Netlify-Commit abgleichen und ohne Anmeldung spielen. Nachweis T06.

