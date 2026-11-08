# Projektanalyse WP-12 – Endspiel und geplante Kartenbezirke

Revision A2 · 8. November 2026 · Ausgangspunkt: Preview-Stand `7e6591b` aus WP-11. Die Analyse liegt im lokalen Projektordner. A2 erfasst die nachgereichten Anforderungen an Kartenunterschiede, Größenverhältnisse und Pflanzflächen.

## Ziel

Das Loch wächst deutlich langsamer und erreicht erst spät eine klar erkennbare Maximalgröße. Bis dorthin wechseln die lohnenden Ziele von Kleinteilen über Bepflanzung und Gebäude hin zu großen Bauwerken und Felsformationen. Alle Bauwerke, Mauern und Bergobjekte im begehbaren Kartenbereich können am Ende vollständig eingesammelt werden. Überdimensionierte Objekte zerfallen in einsammelbare Teile. Jede der 30 Landschaften bekommt eine eigene räumliche Struktur, passend gestaltete Grüninseln oder Felder und zusammenhängende Bezirke. Kartenwechsel sollen spürbar andere Entscheidungen über Route und Sammelreihenfolge auslösen.

## Befund

- **Wachstum.** Stufe 6 beginnt derzeit bei 3.000 Punkten mit Radius 10,2. Der Radius nähert sich danach 16,2 an. Das größte sammelbare Objekt benötigt heute höchstens Radius 7,25. Damit kann das Loch sämtliche aktuellen Objektgrößen schon deutlich vor seiner theoretischen Obergrenze aufnehmen.
- **Balance.** Die 30 bestehenden Karten enthalten insgesamt je 21.738 bis 28.507 Punkte. Bereits zur Startgröße passende Objekte liefern je nach Karte zusammengerechnet 12.816 bis 13.630 Punkte. Eine reine Anhebung der Schwellen verlängert das Sammeln, führt aber zu wenigen neuen Entscheidungen unterwegs. Zwischenziele und die Verteilung der Punkte müssen zum längeren Verlauf passen.
- **Kulisse und Sammelobjekte.** Die Spiellogik unterscheidet einzelne Sammelobjekte von fest gerenderter Kulisse. Burgmauern und Bergflanken liegen teilweise in der Kulisse. Einige Bergflanken stehen außerdem außerhalb der begehbaren Spielfläche. Für echte Endspielziele brauchen ihre Teile einzeln erreichbare Positionen und eine eindeutige Erfassung beim Sammeln.
- **Zerfallen.** Gebäude haben bereits eine Einsturzanimation. Sie komprimiert die sichtbaren Bauteile während des Einsammelns. Einzelne Bruchstücke bleiben bislang nicht als eigenständige Sammelobjekte liegen.
- **Kartenaufbau.** Die Karten haben feste 7 × 7 Bereiche, Themenpools und Routen mit Land-/Wasserprüfung. Viele kleinere Objekte werden weiterhin über seitliche Streifen entlang der Routen verteilt. Erkennbare Nutzungen wie Markt, Park, Hafenbetrieb oder Industrie brauchen dafür eigene Flächen und zusammengehörige Gruppen.
- **Spielerlebnis pro Karte.** Die Karten unterscheiden sich bereits durch Themen und Routengeometrien. Die gemeinsame Verteilung entlang von Routen kann das Sammeln trotzdem ähnlich wirken lassen. Für jede Karte sind eigene Wege, Abzweige, Bezirksgrenzen und eine erkennbare Abfolge von Sammelzielen zu entwerfen.
- **Zugang zu Bezirken.** Die Bewegung des Lochs ist derzeit vor allem durch die Kartenkante begrenzt. Damit etwa Tore oder Brücken eine spielerische Entscheidung darstellen, muss die Spezifikation pro Karte unterscheiden, welche Übergänge echte Zugangsregeln brauchen und welche durch Objektgruppen und Sammelreihenfolge führen.

## Arbeitsannahmen zur Freigabe

1. **Endlosmodus als längerer Fortschrittsbogen.** Die höchste Größe ist ein Ziel für mehrere Minuten im Endlosmodus. Der Zeitmodus bleibt eine Runde von 120 Sekunden. Konkrete Schwellen und ein reproduzierbares Balanceszenario gehören in die Spezifikation.
2. **Abbaubare Ziele innerhalb der Karte.** Häuser, Anlagen, Mauern und Berge zählen zum sammelbaren Bestand, sofern sie auf dem Spielfeld stehen. Ein Objekt, das auch für das maximale Loch zu groß wäre, kann in der späten Spielphase kontrolliert in passende Teile zerfallen. Boden, Wasserfläche und Hintergrund bilden weiterhin die Spielfläche. Ein Bruch zählt das ursprüngliche Objekt genau einmal, sobald seine Teile gesammelt sind.
3. **Grüninseln mit Funktion und Thema.** Jede Karte erhält gestaltete Pflanzengruppen, etwa Parkinseln, Innenhöfe, Uferbeete oder Gewächshaus- und Hydroponikbereiche im Weltraum. Industrie gehört dorthin, wo sie zum Thema passt. Historische Karten bekommen Werkhöfe oder Lagerplätze, Wasserwelten Kais oder bepflanzte Inseln. Bestehende Land- und Wasserrouten gelten weiter.
4. **Endspielziele je Thema.** Beispiele sind eine Festungsmauer mit Bergfried, eine große Bergflanke, ein Hafenkran mit Verladeanlage oder ein Stationssegment. Die Spezifikation legt fest, welche Größen und Ziele wann erreichbar sind.
5. **30 erkennbare Kartenprofile.** Jede Karte hat eine eigene Gelände- und Bezirksanordnung, einen erkennbaren Startbereich, mindestens eine relevante Routenentscheidung und ein passendes großes Ziel. Ein Tal kann sich schrittweise erschließen, ein Inselhafen mehrere getrennte Sammelräume anbieten. Eine Burgstadt führt durch Tore ins Zentrum. Eine Marskolonie bietet vom Knotenpunkt aus mehrere Sektoren. Steuerung und Sammelprinzip geben allen Karten denselben Einstieg.

6. **Plausible Größenverhältnisse.** Der Objekttyp und der Maßstab der Welt bestimmen die Maße. Ein Fass bleibt kleiner als ein Karren und ein Karren kleiner als ein Haus. Miniaturkarten nutzen einen eigenen einheitlichen Maßstab.

## Vier Kartenmockups

Die Entwürfe machen vier verschiedene Kartenstrukturen für die Analyse sichtbar. Sie zeigen die angestrebte Aufteilung und sind Bildentwürfe.

| Landschaft | Räumlicher Aufbau | Erwartetes Spielgefühl |
| --- | --- | --- |
| Alpental | Ein langes Tal mit Serpentinen, gestaffelten Dörfern und einem Felsmassiv am Ende | Einer Route bergauf folgen und sich schrittweise größere Ziele erschließen |
| Burgstadt | Äußere Gärten, zwei Tore, Ringmauer, Markt und Bergfried | Vom Umland durch die Tore in immer dichtere Innenbereiche gelangen |
| Industriehafen | Drei Inseln mit Kais, Lagerflächen, Grünstreifen und Brücken | Inseln und Übergänge wählen und zwischen Fracht-, Grün- und Wasserbereichen wechseln |
| Marskolonie | Radiale Wege vom zentralen Habitat zu Laboren, Landeflächen und Hydroponik | Die Reihenfolge der Sektoren wählen und zur Mitte zurückkehren |

## Prüfrisiken und Ausgangsnachweis

- Der langsamere Verlauf muss auf jeder Karte genügend Punkte aus bereits passenden Objekten bieten. Das Maximum und alle Bruchstücke müssen erreichbar sein, auch wenn sich der Spieler bei der Sammelreihenfolge frei entscheidet.
- Beim Zerfall dürfen Punkte und Objektzähler weder doppelt zählen noch hängen bleiben. Ein Neustart muss Bauwerk, Teile, Wegführung und Sammelzähler reproduzierbar zurücksetzen.
- Geplante Viertel und Pflanzengruppen sollen visuell lesbar bleiben, ohne Land- und Wasserverkehr zu vermischen. Die zusätzliche Geometrie und die Zahl gleichzeitig animierter Teile sind im Browser zu prüfen.
- Ein Kartenvergleich muss Unterschiede in Wegen, Objektgruppen und Abfolge der Ziele belegen. In der Spezifikation erhält jede der 30 Karten ein eigenes Profil als Grundlage für diese Abnahme.
- Baseline lokal am 8. November 2026: 16 von 16 Tests bestanden. TypeScript und Vite bauen erfolgreich. Vite meldet die bereits bekannte Warnung zum JS-Chunk über 500 kB.

**Status:** A1 ausdrücklich freigegeben mit „A1 freigegeben“. Die nachgereichten Anforderungen sind in A2 erfasst und in Spezifikation S1 übernommen. S1 wartet auf Freigabe.


