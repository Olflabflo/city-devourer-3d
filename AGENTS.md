# City Devourer 3D

Beginne bei [docs/project-state.md](docs/project-state.md). Dort stehen der aktuelle Stand sowie die Links zu Roadmap, Entscheidungen und aktiver Spezifikation.

- Nutze die aktuelle Fassung von `project-companion` für Anforderungen, Entwurf, Umsetzung, Tests, Auslieferung und Wartung. Verknüpfe Abnahmekriterien, Umsetzung und Prüfnachweise im Projektstand.
- Wende für neue Features und klar abgegrenzte Fehlerbehebungen den integrierten SDD-Workflow von `project-companion` an. Prüfe vorhandene Freigaben und lege Projektanalyse und Spezifikation getrennt zur Freigabe vor. Führe danach Example Mapping, Testplanung, Red-Green-Refactor und Verifikation eigenständig aus.
- Lege bei neuen oder wesentlich geänderten Oberflächen der Spezifikation ein sichtbares Mockup der wichtigsten Ansichten und Zustände bei.
- Prüfe Änderungen mit `npm test` und `npm run build`. Verwende für Änderungen an Karten, Steuerung und Rundenzustand zusätzlich einen Browser mit WebGL 2.
- Das Hafenviertel ist die Regressionsreferenz für Kartenwahl, Rundenzustand und vorhandene Rekorde. Modelle und Ton werden clientseitig erzeugt.
- Halte private Skill-Installationen und Zugangsdaten aus öffentlichen Commits heraus.

- Stelle Änderungen über einen separaten Branch und einen Pull Request bereit. Prüfe zuerst den zugehörigen Netlify Deploy Preview und verlinke PR und Vorschau in der Übergabe. Merge nach main und Produktionsdeploy erfordern eine separate Freigabe.

