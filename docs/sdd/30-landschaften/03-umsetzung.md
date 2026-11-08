# Umsetzung – 30 Landschaften

Grundlage: S1. Freigabe der Projektanalyse A1: „ja“. Freigabe der Spezifikation S1 nach Vorlage von Kartenliste und acht Abnahmekriterien: „ja“.

| Abnahme | Regel und Beispiel | Prüfung |
| --- | --- | --- |
| AC-001 | RULE-001 / EX-001. Beim ersten Menüaufruf sind 30 verschiedene Karten verfügbar und das Hafenviertel ist vorausgewählt. | T01 Browserauswahl |
| AC-002 | RULE-002 / EX-002. Zwei Karten derselben Gruppe zeigen unterschiedliche Wege und Wahrzeichen, auch ohne Farbcodierung. | T02 Weltenkatalog und Sichtprüfung |
| AC-003 | RULE-003 / EX-003. Nach Aufnahme der erreichbaren Objekte der aktuellen und früheren Stufen ist die nächste Stufe freigeschaltet. Ein zu großes Objekt bleibt stehen. | T02 Weltgenerierung und bestehende Regeln |
| AC-004 | RULE-004 / EX-004. Ein Neustart setzt Punkte und Welt zurück. Der Wechsel zum Ameisenbau setzt eine zuvor pausierte Runde im Hafenviertel nicht fort. | T03 Browserzustand und bestehender Timer-Test |
| AC-005 | RULE-005 / EX-005. Ein Hafenrekord bleibt lesbar. Ein Rekord in der neuen Karte gilt nur dort und nur im gewählten Modus. | T04 Speicherung und Reload |
| AC-006 | RULE-006 / EX-006. Mit Pfeiltasten oder Touch-Joystick erreicht man nahe Kleinteile. | T03 und vorhandener Desktop-/Touch-Test |
| AC-007 | RULE-007 / EX-007. Nach mehrfacher Kartenauswahl gibt es nur eine Kartenszene und der Browser meldet keine WebGL-Fehler. | T05 Freigabe der Szene und Browserdurchlauf aller Karten, TypeScript und Build |
| AC-008 | RULE-008 / EX-008. Die Produktionsseite öffnet sich ohne Anmeldung und kann eine neue Runde starten. | T06 öffentlicher Produktionscheck |

Bei ungespeichertem oder ungültigem Kartenwert dient das Hafenviertel als Rückfall. Dekorationen nehmen nicht an der Verschluckprüfung teil. Bei blockierter Speicherung bleibt die Runde bedienbar.

## Zyklen


| Test | RED | GREEN und REFACTOR |
| --- | --- | --- |
| T01 · Startmenü | Browser: 0 statt 30 Einträge, Exitcode 1 | 30 eindeutige Karten, Hafen vorausgewählt. Browser und Bestandsregression bestanden. |
| T02 · Weltgenerierung | Node: Das Alpental hatte das Layout des Hafenviertels, Exitcode 1 | Eigene Layouts, gültige Objektgrundflächen und erreichbare Wachstumsstufen für alle Karten, Exitcode 0. |
| T03 · Runde | Browser: Nach Wahl des Ameisenbaus zeigte das HUD weiterhin die Ziele des Hafenviertels, Exitcode 1 | Thematisches Ziel, Wachstum, Pause, Timer, Neustart und Kartenwechsel in zwei Läufen bestanden. |
| T04 · Rekorde | Browser: Ameisenbau zeigte Hafenrekord, Exitcode 1 | Getrennte Karten- und Modusrekorde, Reload und alte Hafenschlüssel in zwei Läufen bestanden. |
| T05 · Ressourcen | Node: Die alte Szene blieb verbunden, Exitcode 1 | Szene entfernt, Instanzdaten freigegeben, zwei Läufe mit sechs erfolgreichen Tests. |
| T07 · Flussprofil | Node: Im Amazonas fehlte ein sichtbarer Wasserlauf, Exitcode 1 | Nil und Amazonas mit durchgehendem Wasserlauf, zwei Läufe mit sieben erfolgreichen Tests. |

## Verifikation

- `npm test`: 7/7. `npm run build`: TypeScript und Vite erfolgreich. Bekannte Größenwarnung bleibt bestehen.
- Browser: 30 Kartenszenen geladen, gestartet und visuell als Galerie verglichen. Die Renderprüfung meldete keine Fehler. Touch-Steuerung im emulierten Mobilbrowser erreicht Stufe 2 auf einer neuen Karte. Die vorhandene Browserregression deckt das Hafenviertel ab.
- Ende-zu-Ende: Im Ameisenbau wurden über simulierte Tastaturereignisse 100 von 100 Objekten verschluckt. Der Ergebnisbildschirm zeigte Stufe 6 und 2.910 Punkte.
- Review: gemeinsame Regeln weiterverwendet, alte Rekordschlüssel erhalten, Szenen getrennt und freigegeben. Kartenspezifische Modelle nutzen gemeinsame Geometrien, die über Kartenwechsel hinweg weiterverwendet werden. Farbunterschiede werden durch Layout und modellierte Wahrzeichen ergänzt.
- T06: Produktionsprüfung erfolgt nach Bereitstellung. Die Bildrate auf einem echten Android-Gerät wurde nicht gemessen.
