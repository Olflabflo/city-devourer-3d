# Spezifikation S1 – Endspiel und geplante Kartenbezirke

Revision S1 · 8. November 2026 · WP-12 · Ausgangspunkt Preview-Stand `7e6591b`

Freigabe der Projektanalyse A1 durch den Nutzer: „A1 freigegeben“. Die folgenden ausdrücklich gewünschten Ergänzungen fließen in die Spezifikation ein: 30 spürbar unterschiedliche Landschaften, vier Kartenmockups, plausiblere Größenverhältnisse und bepflanzte Felder als mögliche Grünfläche.

## Anforderungen und Abnahmekriterien

| Anforderung | Beobachtbares Verhalten | Abnahme |
| --- | --- | --- |
| REQ-1201 · Langsames Wachstum | Sieben Stufen beginnen bei 0, 240, 850, 2.250, 5.100, 9.800 und 15.500 Punkten. Die Zielradien an diesen Schwellen sind 1,28, 1,68, 2,4, 3,7, 5,65, 8,8 und 14,4. Dazwischen wächst der Radius stetig. | AC-1201 · Jede Schwelle ist exakt geprüft. Das Loch bleibt bei gleichem Punktestand kleiner als in WP-11. Ab 15.500 Punkten bleibt der Zielradius konstant. Der Zeitmodus läuft 120 Sekunden. Das Endspiel bleibt im Endlosmodus ohne Zeitlimit erreichbar. |
| REQ-1202 · Ziele über die gesamte Runde | Jede Welt bietet pro Größenbereich sichtbare Ziele. Im Endspiel warten Bauwerke oder Geländeobjekte, die vorher zu groß waren. Die Punkte sind zwischen Objektgruppen und Bezirken verteilt. | AC-1202 · Eine iterative Erreichbarkeitsprüfung je Karte bestätigt, dass der Radius allein aus erreichbaren Zielen bis zum Maximum wachsen kann. Jede Karte besitzt mindestens ein Ziel, das erst im letzten Größenbereich erreichbar wird. Ein aufgezeichneter Spielpfad in drei unterschiedlichen Karten dokumentiert das Tempo. 8 bis 15 Minuten dienen als Balanceziel für diese Referenzläufe. |
| REQ-1203 · Sammelbare Bauwerke und Berge | Gebäude, Mauern und Bergobjekte auf dem Spielfeld gehören zum Sammelbestand. Sobald ein Objekt passt und sich im Sog befindet, lässt es sich einsammeln. Straßen- und Wasserflächen tragen weiterhin die Karte. | AC-1203 · Mindestens je ein Gebäude, ein Mauerabschnitt und ein Bergobjekt lassen sich im Browser sammeln. Ein automatisierter Katalogtest findet keine unerreichbaren Bauwerke oder Bergobjekte im Spielbereich. Beim Neustart sind alle wieder vorhanden. |
| REQ-1204 · Zerfall großer Ziele | Ein Objekt, dessen Grundfläche selbst am Maximum zu groß ist, zerfällt beim Einziehen auf Stufe 7 in eine begrenzte Zahl sichtbarer Bruchstücke. Die Teile landen in Reichweite und lassen sich einzeln sammeln. | AC-1204 · Vor Stufe 7 bleibt ein übergroßes Objekt stehen. Am Maximum löst die Interaktion einmalig den Zerfall aus. Jedes Teil passt ins maximale Loch. Punkte werden je Teil genau einmal vergeben und ergeben zusammen den Wert des Ursprungsobjekts. Der Kartenfortschritt zählt das Ursprungsobjekt nach dem letzten Teil als gesammelt. Reset und Weltwechsel entfernen alle losen Teile und setzen den Ausgangszustand zurück. |
| REQ-1205 · Grüninseln und Felder | Auf jeder Karte gibt es mindestens eine gestaltete zusammenhängende Pflanzfläche. Dazu können Parks, Höfe, Uferbeete, Felder, Seegras oder Gewächshäuser gehören. Pflanzen erscheinen in zusammengehörigen Gruppen und zählen als Sammelobjekte. | AC-1205 · Alle 30 Karten besitzen mindestens eine zur Welt passende Grünzone mit erreichbaren Pflanzengruppen. Bei Feldern sind Reihen, Parzellen und Wege erkennbar. Wasser- und Landrouten werden weiterhin getrennt geprüft. |
| REQ-1206 · Eigenständige Bezirke | Jede Karte hat einen erkennbaren Start, eine eigene Anordnung von mindestens drei Bereichen, einen charakteristischen Übergang und ein thematisches Endspielziel. Objektgruppen folgen dem Zweck des Bezirks, beispielsweise Verladegut am Kai, Sitzgelegenheiten im Park und Werkstücke im Werkhof. | AC-1206 · Der Kartengenerator weist alle 30 Kartenprofile einzeln nach. Eine visuelle Vergleichsprüfung zeigt unterscheidbare Geländeformen, Bezirke und Sammelwege. Jede Karte bietet mindestens eine erkennbare Entscheidung zwischen zwei lohnenden Sammelrouten oder eine eigene Abfolge über markante Übergänge. Historische und räumliche Modellregeln bestehen weiterhin. |
| REQ-1207 · Stimmige Objektgrößen | Die Maße hängen von Objekttyp und Maßstab der Welt ab. Variationen bleiben plausibel. Die Sammelstufe ergibt sich aus der Größe und dient nicht als Modellskalierung. | AC-1207 · Für repräsentative Gegenstände, Figuren, Fahrzeuge, Bäume, Häuser und Großobjekte stimmen die geordneten Größenverhältnisse innerhalb einer Karte. Vergleichbare Modelle behalten in derselben Welt erkennbare Proportionen. Miniaturwelten nutzen einen gemeinsamen eigenen Maßstab. Die Verschluckgrenze folgt der dargestellten Grundfläche. |
| REQ-1208 · Veröffentlichung im Preview | Das Paket wird in der GitHub-Vorschau bereitgestellt. | AC-1208 · Tests und Produktionsbuild sind erfolgreich. Der Browser öffnet alle 30 Karten. An drei Karten sind Wachstum, Zerfall oder Wiederherstellung und Kartenzuschnitt nachvollziehbar. GitHub-Commit und Netlify Deploy Preview werden verlinkt. |

Die genannten Punkte- und Radiuswerte sind ein Vorschlag zur Freigabe. Bei 6 Punkten je typischem Kleinteil liegt Stufe 2 bei 40 solchen Objekten. Die Spezifikation verwendet stimmige relative Maße innerhalb der kompakten Spielwelt. Landschaftsobjekte wie Berge behalten eine deutlich größere Silhouette, während das Spielfeld spielbar bleibt.

## Kartenprofile

| Karte | Aufbau und Sammelweg | Grünfläche | Spätes Ziel |
| --- | --- | --- | --- |
| Hafenviertel | Straßenraster zwischen Wohnblöcken, Parkachse und Werftstraßen | Straßenbäume und Parkinseln | Hochhaus am Werftplatz |
| Alpental | Langes Tal mit Serpentinen, zwei Dorfstufen und Steinbruch | Terrassenwiesen und Obstfelder | Felsmassiv |
| Sahara | Oasenring mit Karawanenhof und Dünenkorridoren | Dattelgarten und bewässerte Beete | Dünenmassiv |
| Amazonas | Flussschleife mit verzweigten Uferwegen und Pfahlbaudörfern | Uferpflanzen und Baumkronen | Riesiger Baumverbund |
| Arktis | Eisrinnen zwischen Schollen, Forschungspfad und Versorgungsplatz | Gewächshaus und geschütztes Moosbeet | Polarforschungsanlage |
| Vulkaninsel | Schleifenweg am Krater mit Siedlung und Basaltflächen | Hangbeete und Vulkanflora | Basaltflanke |
| Segelflotte | Weite Wasserfläche mit gestaffelten Schiffsreihen und Ankerinsel | Bepflanzte Ankerinsel | Großsegler |
| Containerhafen | Drei Sammelinseln mit Kais, Lagergleisen und Brücken | Grünstreifen und Parkinsel | Kran- und Verladeanlage |
| Piratenbucht | Bucht mit Strandsaum, Stegen und verstecktem Lager | Palmenhaine und Küstenbeete | Piratenfestung |
| Korallenriff | Riffbögen um Sandkanäle und Wrackfeld | Seegraswiesen | Großes Schiffswrack |
| Kanäle von Venedig | Versetzte Inselgassen, Plätze, Brücken und Kanäle | Höfe mit Pflanzbeeten | Palazzo-Komplex |
| Eisbrecher-Passage | Enger Wasserweg mit Packeis und zwei Versorgungspunkten | Geschützte Anzucht am Versorgungspunkt | Eisberggruppe |
| Ägypten am Nil | Uferfelder und Landestellen entlang einer Prozessionsachse | Bewässerte Felder | Pyramidenanlage |
| Römisches Forum | Breite Platzachse mit Arkaden, Markt und Arena | Ziergärten und Innenhöfe | Arenasegment |
| Griechische Akropolis | Abfolge aus Terrassen und Rampen mit Werkhöfen | Olivenhaine auf Terrassen | Tempelbezirk |
| Mittelalterliche Burg | Äußere Felder, Mauerring mit Toren, Markt und Bergfried | Obstwiesen und Hofgärten | Bergfried und Mauerabschnitte |
| Wikingerfjord | Uferband zwischen Fjordwänden mit Stegen und Langhäusern | Nutzgärten und Gerstenfelder | Versammlungshalle |
| Seidenstraßen-Basar | Versetzte Marktgassen mit Höfen und Werkstätten | Bewässerte Hofgärten | Karawanserei |
| Ameisenbau | Verzweigte Futterwege zwischen Nest, Wurzeln und Samendepots | Moos- und Kleeflächen | Nesthügel |
| Regentropfen-Garten | Blattinseln und schmale Wege zwischen Regentropfen | Dichte Pflanzinseln | Riesenblüte |
| Picknickdecke | Karoflächen mit Obst, Besteck und getrennten Vorratsgruppen | Grasinseln und Kräuter am Rand | Picknickkorb |
| Werkbank | Arbeitsstreifen mit Werkzeug, Werkstücken und Materiallagern | Anzuchttopf am Fenster | Schraubstock |
| Spielzeugzimmer | Gleisschleife, Bausteinbezirke und Spielfläche | Miniaturgarten am Gleis | Bausteinburg |
| Schreibtisch | Papierflächen mit Kabelwegen und Ablagezonen | Zimmerpflanzen und Ableger | Tastatur |
| Mondbasis | Krater umgehen und zwischen Landefläche, Solarpark und Basis wechseln | Druckgewächshaus | Basiskomplex |
| Marskolonie | Vom zentralen Habitat führen radiale Wege zu Laboren, Solarfeld und Landeflächen | Hydroponikfelder | Koloniekuppel |
| Ringraumstation | Ringsektoren mit Speichen, Andockbuchten und Stationskern | Bepflanzte Lebenserhaltungszone | Stationssegment |
| Neon-Megacity | Dichte Blöcke, Leuchtschneisen und zwei Hochhausknoten | Stadtgärten und bepflanzte Innenhöfe | Hochhauskomplex |
| Alien-Kristallwald | Unregelmäßige Kristalllichtungen und schmale Verbindungskorridore | Sporenbeete und alienartige Pflanzenfelder | Kristallrücken |
| Orbitaler Schrottplatz | Getrennte Materialfelder an Bergungsschleuse und Logistikwegen | Hydroponikmodul am Wartungsbereich | Großes Schiffswrack |

## Entwurfsnachweise und Freigaben

Vier Kartenmockups zeigen Talroute, Burgstadt mit Mauerring, Industriehafen mit Inseln und Marskolonie mit radialen Sektoren. Sie dienen als Entwurf für Bezirke, Größenverhältnisse und grüne Flächen.

| Phase | Revision | Tatsächliche Nutzernachricht | Status |
| --- | --- | --- | --- |
| Projektanalyse | A1 | „A1 freigegeben“ | Freigegeben |
| Spezifikation | S1 | „go“ | Freigegeben |

Die Spezifikation umfasst den vorhandenen Spielablauf mit langsamerem Wachstum, einzeln erfassbaren Bruchstücken, gezielter Kartenplanung und plausiblen Maßen. Freigaben für Produktion folgen dem Projektworkflow.


