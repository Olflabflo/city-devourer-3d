# Spezifikation S1 – 30 Landschaften für City Devourer 3D

8. November 2026 · Grundlage: freigegebene Projektanalyse A1  
Ausgangscommit: `1354abd9f31b0ec86b8752f097981ae26453c997`

## Umfang und Entscheidungen

Das Spiel erhält 30 direkt wählbare Karten einschließlich des bisherigen Hafenviertels. Jede Karte bietet den Zeitmodus und den Endlosmodus. Dieselbe Karte bleibt bei einem Neustart ausgewählt. Jede Karte und jeder Modus haben einen eigenen lokalen Rekord.

Die folgenden Namen, Themen und Kennzeichen sind der Vorschlag zur Freigabe. Die Namen erscheinen in der deutschen Oberfläche. Die Kennzeichen beschreiben, was im Spielfeld sichtbar oder sammelbar sein soll. Dekoration ohne Punkte darf die Umgebung ergänzen. Landschaften aus der Geschichte und Geografie sind stilisierte Spielwelten.

| Nr. | Gruppe | Landschaft | Räumliches Kennzeichen und typische Objekte |
| --- | --- | --- | --- |
| 01 | Erde | Hafenviertel | Bestehende Straßenblöcke mit Parks, Fahrzeugen und Hochhäusern |
| 02 | Erde | Alpental | Talroute zwischen Bergflanken mit Hütten und Gipfeln |
| 03 | Erde | Sahara | Dünenkämme um eine Oase mit Krügen, Palmen und Lehmhäusern |
| 04 | Erde | Amazonas | Flussschleife mit Uferpfaden, Baumkronen und Pfahlbauten |
| 05 | Erde | Arktis | Eisschollen und breite Eisrinnen mit Eisblöcken und Polarstation |
| 06 | Erde | Vulkaninsel | Kraterbogen mit Basaltfeldern und einem Vulkankegel |
| 07 | Wasser | Segelflotte | Segler in gestaffelten Reihen zwischen Bojen und Treibgut |
| 08 | Wasser | Containerhafen | Kaikanten und Verladekorridore mit Containern, Kränen und Frachtern |
| 09 | Wasser | Piratenbucht | Geschützte Bucht mit Fässern, Schätzen und Piratenschiffen |
| 10 | Wasser | Korallenriff | Riffbögen mit Muscheln, Korallenkolonien und einem Schiffswrack |
| 11 | Wasser | Kanäle von Venedig | Kanalinseln und Übergänge mit Gondeln, Brücken und Palazzi |
| 12 | Wasser | Eisbrecher-Passage | Schmaler Schifffahrtskorridor mit Packeis, Tonnen und einem Eisbrecher |
| 13 | Geschichte | Ägypten am Nil | Uferstreifen und Prozessionsachsen mit Obelisken und Pyramiden |
| 14 | Geschichte | Römisches Forum | Plätze und Kolonnaden mit Amphoren, Triumphbögen und Arena |
| 15 | Geschichte | Griechische Akropolis | Terrassen mit Säulen, Statuen und einem Tempel |
| 16 | Geschichte | Mittelalterliche Burg | Wehrhof und Zufahrt mit Fässern, Türmen und Bergfried |
| 17 | Geschichte | Wikingerfjord | Langhäuser am Ufer und Langschiffe zwischen Anlegestegen |
| 18 | Geschichte | Seidenstraßen-Basar | Gassen und Markthöfe mit Stoffballen, Ständen und Karawanserei |
| 19 | Miniatur | Ameisenbau | Verzweigte Pfade mit Körnern, Ameisen und einem großen Nesthügel |
| 20 | Miniatur | Regentropfen-Garten | Blattinseln mit Tropfen, Käfern und riesigen Blüten |
| 21 | Miniatur | Picknickdecke | Karomuster und freie Ränder mit Krümeln, Besteck und Picknickkorb |
| 22 | Miniatur | Werkbank | Werkzeugzonen mit Schrauben, Muttern und Schraubstock |
| 23 | Miniatur | Spielzeugzimmer | Bausteingassen mit Figuren, Spielzeugzügen und Klötzchentürmen |
| 24 | Miniatur | Schreibtisch | Papierflächen und Kabelrouten mit Klammern, Stiften und Tastatur |
| 25 | Science-Fiction | Mondbasis | Kraterfelder und Landespuren mit Rovern und Habitatkuppeln |
| 26 | Science-Fiction | Marskolonie | Roter Canyon mit Solarfeldern, Laboren und einer Koloniekuppel |
| 27 | Science-Fiction | Ringraumstation | Ringsegmente und Speichen mit Andockmodulen und Stationskern |
| 28 | Science-Fiction | Neon-Megacity | Leuchtschneisen zwischen Drohnen, Reklamen und gestaffelten Türmen |
| 29 | Science-Fiction | Alien-Kristallwald | Kristalllichtungen mit Sporen und facettierten Kristalltürmen |
| 30 | Science-Fiction | Orbitaler Schrottplatz | Schrottfelder um eine Schleuse mit Satelliten und Schiffsrümpfen |

## Anforderungen und Abnahme

| Anforderung | Beobachtbares Verhalten | Abnahmekriterium |
| --- | --- | --- |
| REQ-001 · Kartenwahl | Das Hauptmenü zeigt die 30 namentlich bezeichneten Karten nach Themen gruppiert. Ab dem ersten Aufruf sind alle direkt wählbar. Das Hafenviertel ist die Vorauswahl. | AC-001 · Die Auswahl enthält 30 eindeutige, startbare Einträge inklusive Hafenviertel. Auswahl und Start funktionieren per Tastatur und Touch. Ein unbekannter Kartenbezeichner darf keinen Absturz auslösen. |
| REQ-002 · Eigenständige Welten | Jede Karte hat ein zum Thema passendes Layout und mindestens ein erkennbares Wahrzeichen sowie eine zum Thema passende Auswahl an Sammelobjekten. | AC-002 · Eine Sichtprüfung jeder Karte bestätigt ihr räumliches Kennzeichen und ein unterscheidbares Wahrzeichen. Modelle und Aufbau tragen den Unterschied auch unabhängig von der Farbpalette. |
| REQ-003 · Verschlucken und Wachstum | Die sechs bestehenden Stufen und die Verschluckregeln gelten auf allen Karten. Kleine Gegenstände sind in Spawnnähe erreichbar. Das HUD nennt passende Ziele für die nächste Stufe. | AC-003 · Auf jeder Karte ist die zum Freischalten jeder Folgestufe nötige Punktzahl mit erreichbaren Objekten der bereits freigeschalteten Stufen verfügbar. Die Objektgrundflächen passen zur vorgesehenen Lochgröße. Ein zu großes oder gesperrtes Objekt bleibt stehen, ein passendes Objekt gibt beim Verschlucken Punkte. |
| REQ-004 · Runden und Kartenwechsel | Der Zeitmodus endet nach 120 aktiven Sekunden. Der Endlosmodus endet, wenn alle als sammelbar ausgewiesenen Objekte aufgenommen sind. Neustart setzt Punkte, Größe und Objekte der gewählten Karte zurück. Eine andere Karte beginnt mit frischem Rundenzustand. | AC-004 · Start, Pause, Fortsetzen, Zeitablauf, Neustart, Wechsel zwischen zwei Karten und Abschlussbedingung des Endlosmodus liefern jeweils den erwarteten Zustand. Dekoration zählt beim Abschluss nicht mit. |
| REQ-005 · Rekorde | Rekorde werden pro Karten-ID und Spielmodus lokal gespeichert. Bestehende Hafenviertel-Rekorde bleiben verfügbar. | AC-005 · Ein Rekord in Karte A ändert den von Karte B oder des anderen Modus nicht. Nach einem Reload ist der Rekord verfügbar. Bestehende Hafenviertel-Daten werden weiterhin gelesen. Fehlender Local Storage verhindert keine Runde. |
| REQ-006 · Bedienung und Bestand | WASD, Pfeiltasten, Touch-Joystick, Soundumschaltung und beide Spielmodi bleiben nutzbar. Das Hafenviertel bleibt als bestehende Karte spielbar. | AC-006 · Die vorhandenen Logiktests sind grün. Desktop- und Touch-Browser starten das Hafenviertel sowie mindestens eine neue Karte und prüfen die jeweilige Steuerung. Auswahl und HUD bleiben in einer schmalen Smartphone-Ansicht bedienbar. |
| REQ-007 · Laufzeit | Das Spiel läuft clientseitig mit prozedural erzeugten Assets. Nur die aktive Karte bleibt als Spielszene geladen. Beim Wechsel werden ihre kartenspezifischen Renderressourcen freigegeben. | AC-007 · Der Produktionsbuild ist erfolgreich. Alle Karten lassen sich in einer Browsersitzung laden. Mehrfacher Wechsel verursacht keine WebGL-Fehler oder Ansammlung alter Kartenszenen. Eine feste Bildrate auf echten Mobilgeräten ist kein Abnahmekriterium. |
| REQ-008 · Bereitstellung | Der bestehende GitHub-/Netlify-Auslieferungsweg liefert die Erweiterung als statische App. Die Projektkopien der privaten Skills bleiben lokal. | AC-008 · Der veröffentlichte Build enthält die Erweiterung. Die öffentliche URL öffnet das Hauptmenü ohne Login und startet eine neue Karte. Deploy- und Commit-Nachweis sind dokumentiert. |

## Grenzen und Fertigstellung

Keine zusätzlichen Spielmodi, kein Mehrspieler, keine globale Rangliste, keine Anmeldung und keine frei erkundbare 3D-Welt mit komplexer Geländephysik. Karten dürfen Modellfamilien und Layoutbausteine teilen, sofern sie AC-002 erfüllen. Die Erweiterung ist abgenommen, sobald AC-001 bis AC-008 mit Nachweisen abgeglichen sind und die Prüfung des vollständigen Diffs abgeschlossen ist.

## Freigaben

| Phase | Revision | Umfang | Tatsächliche Nutzernachricht | Status |
| --- | --- | --- | --- | --- |
| Projektanalyse | A1 | 30 Landschaften inklusive Hafenviertel | „ja“ | Freigegeben |
| Spezifikation | S1 | Kartenliste und REQ-001 bis REQ-008 | „ja“ | Freigegeben |


