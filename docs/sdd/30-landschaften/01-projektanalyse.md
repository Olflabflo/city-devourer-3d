# Projektanalyse – 30 Landschaften

Revision A1 · 8. November 2026 · Phase 1 von sdd-exact  
Ausgangscommit auf GitHub: `1354abd9f31b0ec86b8752f097981ae26453c997`

## Ziel und Umfang

Das bestehende WebGL-Arcadespiel City Devourer 3D erhält eine Auswahl aus 30 spielbaren Landschaften. Gewünscht ist eine Mischung aus irdischen Landschaften mit Bergen, Schiffswelten, Antike, Mittelalter, Miniaturwelten mit Ameisen und Science-Fiction. Die Welten sollen sich durch räumlichen Aufbau, markante Objekte und Atmosphäre unterscheiden. Das gemeinsame Spielprinzip aus Bewegung, Verschlucken und Wachstum trägt alle Welten.

Reversible Arbeitsannahme für diese Analyse: 30 Landschaften insgesamt, mit dem bestehenden Hafenviertel als einer davon. Beide Spielmodi und die vorhandene Steuerung gelten als Bestand. Ein Backend, Multiplayer und zusätzliche Spielmodi sind außerhalb des betrachteten Umfangs. Konkrete Weltenliste, Zugangsregeln und Zuordnung der Rekorde werden in der Spezifikationsphase entschieden.

## Technischer Bestand

| Bereich | Beobachtung und Relevanz |
| --- | --- |
| Laufzeit und Build | TypeScript, Three.js und Vite, vollständig im Browser mit WebGL 2. Netlify baut mit `npm run build` nach `dist`. Die Produktionsseite ist öffentlich erreichbar. |
| Welt und Modelle | `src/city.ts` erzeugt eine deterministische 9×9-Stadt. Pro Stadtblock werden Modellteile als InstancedMeshes gebündelt. Bewegliche Objekte, Spawnpositionen, Spatial Grid und Rundenreset liegen im selben Modul. |
| Start, Runde und HUD | `src/main.ts` erstellt genau eine City. Startposition, Spielfeldgrenze und Bezeichnungen sind auf die Stadt zugeschnitten. Das Startmenü in `index.html` hat bereits eine Moduswahl. Weltenwahl, Rundenzustand und HUD sind die wichtigsten Schnittstellen der Erweiterung. |
| Wachstum und Treffer | `src/rules.ts` prüft Freischaltstufe, Objektgrundfläche und Überdeckung. Es definiert sechs Stufen, Punktebereiche, Timer und Spatial Grid. Dieselben Regeln lassen sich auf neue Sammlerstücke anwenden, wenn Modelle und Grundflächen zusammenpassen. |
| Rendering und Eingabe | `src/view.ts` besitzt Kamera, Beleuchtung, Schatten, Auflösung und Partikel. `src/input.ts` verarbeitet Tastatur und Touch. Perspektive, Steuerungsrichtung und Kameraverhalten hängen zusammen. |
| Speicherung | Rekorde werden im Local Storage je Modus abgelegt. Ein bisheriger Rekord gehört faktisch zum Hafenviertel. Eine Erweiterung der Schlüssel braucht einen Kompatibilitätsfall. |

Datenfluss einer Runde: Eingabe → Position → Spatial Grid → Verschluckprüfung und Animation → Punkte und Größe → HUD, Kamera und lokaler Rekord. Ein Weltenwechsel berührt vor allem Szenen- und Rundenzustand. Die Regeln selbst sind weitgehend von der Darstellung getrennt.

## Abhängigkeiten und Risiken

- **Erkennbare Vielfalt.** Eine andere Farbpalette allein unterscheidet Welten kaum. Terrainführung, Silhouetten und Sammelobjekte bestimmen, wie sich eine Karte spielt.
- **Fortschritt pro Karte.** Jede Welt braucht erreichbare Kleinteile in Spawnnähe und ausreichend verschluckbare Objekte auf jeder Stufe. Bei Bergen, Schiffen und Miniaturmodellen muss die Grundfläche zur Lochgröße passen. Der Endlosmodus braucht eine eindeutige Definition der zählenden Objekte.
- **WebGL-Ressourcen und Mobilgeräte.** Viele Welten können Ladezeit und Speicherverbrauch erhöhen. Instancing, Anzahl der gleichzeitig geladenen Szenen und das Freigeben von Ressourcen beim Wechsel sind prüfungsrelevant. Ein emulierter Mobilbrowser kann Bedienung prüfen. Reale Android-Bildraten sind bisher unbekannt.
- **Bestandsschutz.** Das ursprüngliche Hafenviertel, seine Rekorde und die bekannten Rundenabläufe sind die Regressionsreferenz.
- **Auslieferung.** Das Spiel nutzt GitHub und den verbundenen Netlify-Build. Die Skills stammen aus einem privaten Repository und liegen projektlokal. Die öffentliche Auslieferung des Spiels benötigt diese Kopien nicht.

## Baseline

- `npm test` — 4 von 4 Tests bestanden. Abgedeckt sind Freischaltung, Größenprüfung, Spatial Grid und Zeitlimit.
- `npm run build` — TypeScript und Vite erfolgreich. Bekannte Vite-Warnung wegen eines minifizierten JS-Chunks von rund 503 kB.
- Browserprüfung gegen die öffentliche Netlify-URL — Desktop und emulierter Touch-Browser erfolgreich. Geprüft wurden Rundenstart, Steuerung, Wachstum, Pause, Zeitablauf, Neustart und Rekord.

## Freigabe

| Phase | Revision | Status | Nutzernachricht |
| --- | --- | --- | --- |
| Projektanalyse | A1 | Freigegeben | „ja“ |
| Spezifikation | — | Ausstehend | — |

Entscheidung zu A1: Das Hafenviertel zählt zu den 30 Landschaften. Nachtrag zur Baseline: Der bestehende Quellcode erzeugt 7×7 Stadtblöcke (49).


