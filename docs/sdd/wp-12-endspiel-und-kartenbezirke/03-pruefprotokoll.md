# Prüfprotokoll WP-12

Spezifikation S1 wurde mit „go“ freigegeben. Ausgangspunkt war der Preview-Commit `7e6591b`.

| Abnahme | Beispiel und Prüfverfahren | Ergebnis |
| --- | --- | --- |
| AC-1201 | Bei 239 Punkten bleibt Stufe 1 aktiv. Bei 15.499 Punkten liegt der Radius unter dem Maximum, bei 15.500 erreicht der Zielradius 14,4. Die Zeitrunde endet nach 120 Sekunden. | Regeltest grün. Der gezielte Test war vor der Änderung rot, weil Stufe 2 schon bei 239 Punkten erreicht war. |
| AC-1202 | In jeder Karte werden die passenden Objekte rechnerisch nach Grundfläche eingesammelt. Drei Endlosrunden wurden anschließend über die Spielschleife mit aufgezeichneten Punkten und Zeiten vollständig durchgespielt. | Alle Karten erreichen den Maximalradius und besitzen mindestens ein spätes Ziel. Der automatisierte Fahrer wählt stets das nächste passende Objekt. Seine Zeiten sind keine Messung typischer menschlicher Spielzeit. |
| AC-1203 | In Alpental und Burg zählen Bergflanken und Mauerabschnitte zum Sammelbestand. Gebäude werden in den Browserläufen eingesammelt. | Alpental, Burg und Containerhafen endeten jeweils mit vollständigem Sammelzähler. |
| AC-1204 | Eine übergroße Mauer wird am Maximum ausgelöst. Nach fünf Teilen gelten genau ein erledigtes Objekt und der ursprüngliche Punktwert. Wiederholte Abrechnung eines Teils liefert null. | Integrationstest grün. Der Browser erzeugte Bruchstücke in Alpental und Burg. Der erneute Rundenstart setzte den Punktestand zurück. |
| AC-1205 | Jede Landschaft hat eine Pflanzfläche. Im Hafenviertel liegen die Pflanzen in den Parkblöcken. Auf den übrigen Karten prüft der Katalogtest Pflanzobjekte um die jeweilige Grünfläche. | Katalogtest grün. Land- und Wasserrouten wurden mitgeprüft. |
| AC-1206 | Alle 30 Kartenprofile besitzen drei jeweils platzierte Bezirke. Mars verwendet radiale Wege, der Containerhafen Inseln mit Brücken und die Burg einen Mauerring mit zwei Öffnungen. | Eindeutigkeit der Profile und historischer Verkehr geprüft. Die 30 Karten wurden im Browser geladen. Der Vergleich der Gestaltung bleibt Teil der Preview-Abnahme. |
| AC-1207 | Die Grundfläche von Langhäusern und Fässern ändert sich nicht mit ihrem Platzierungswert. Ein Haus ist deutlich größer als ein Fass. | Der gezielte Test fand vorher drei Größen desselben Langhauses. Nach der Modellskalierung wurde er grün. |
| AC-1208 | Lokal: `npm test`, `npm run build`, Browserstart aller Karten und automatisierte Endlosrunden. | Zwanzig Tests und Build erfolgreich. [PR #1](https://github.com/Olflabflo/city-devourer-3d/pull/1) und [Netlify Deploy Preview](https://deploy-preview-1--city-devourer-3d.netlify.app/). |

## Aufgezeichnete Referenzläufe

Die Browser-Testuhr treibt die unveränderte Spiellogik in 50-ms-Schritten an. Die Routenauswahl ist automatisiert, damit sich der Lauf reproduzieren lässt. Die angegebenen Zeiten sind Spielzeit.

| Karte | Stufe 2 | Stufe 3 | Stufe 4 | Stufe 5 | Stufe 6 | Maximum | Runde komplett |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Alpental | 0:18 | 0:54 | 1:40 | 2:34 | 3:22 | 4:08 | 5:42 |
| Mittelalterliche Burg | 0:20 | 0:49 | 1:49 | 3:01 | 3:53 | 4:39 | 6:02 |
| Containerhafen | 0:23 | 0:52 | 1:50 | 2:55 | 4:03 | 4:44 | 5:57 |

Das Balanceziel von 8 bis 15 Minuten für das Erreichen des Maximums wurde in den automatisierten Läufen unterschritten. Das Spielgefühl bei manueller Erkundung bleibt offen.


