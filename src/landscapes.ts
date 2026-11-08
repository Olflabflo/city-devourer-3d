const entries = [
  ["harbor", "Hafenviertel", "Erde", "Parks, Straßen und Hochhäuser", 0x455667, 0xc8b6a0, 0x9ac5c8, 0xb5ff75, "grid", "crate bench rover cabin tower tower", "Kleinteile|Bänke, Menschen und kleine Bäume|Autos und große Bäume|Lastwagen und kleine Häuser|Mehrstöckige Häuser|Hochhäuser"],
  ["alps", "Alpental", "Erde", "Hütten zwischen schneebedeckten Gipfeln", 0x63945b, 0xb4cc88, 0xc0e0eb, 0xeeeefa, "valley", "stone fir fir cabin ridge peak", "Kiesel|Junge Tannen|Alte Tannen|Almhütten|Felsrücken|Schneegipfel"],
  ["sahara", "Sahara", "Erde", "Dünen rund um eine Oase", 0xd99e58, 0xedc78a, 0xffdfa0, 0x4c9675, "oasis", "jar palm dune cabin dune dune", "Krüge|Palmen|Sandhügel|Lehmhäuser|Dünen|Dünenkämme"],
  ["amazon", "Amazonas", "Erde", "Ein Fluss schlängelt sich zwischen Pfahlbauten", 0x38715a, 0x70a45d, 0xb8dfc1, 0xf3ad54, "river", "seed leaf palm stilt banyan banyan", "Samen|Blätter|Palmen|Pfahlbauten|Baumgruppen|Baumriesen"],
  ["arctic", "Arktis", "Erde", "Eisrinnen führen zur Polarstation", 0x457991, 0xa5cedd, 0xceeff4, 0xf08a4e, "floes", "ice ice iceberg cabin iceberg station", "Eissplitter|Eisblöcke|Kleine Schollen|Polaruhütten|Eisberge|Polarstation"],
  ["volcano", "Vulkaninsel", "Erde", "Basaltfelder und ein leuchtender Krater", 0x4a4148, 0x756269, 0x9d7880, 0xff7b43, "crater", "stone crystal ridge ridge peak volcano", "Lavasteine|Kristalle|Basaltsäulen|Felsrücken|Nebenkegel|Vulkankegel"],
  ["sail", "Segelflotte", "Wasser", "Boote und Großsegler auf offenem Wasser", 0x315f85, 0x508daf, 0xc2dfed, 0xffd780, "fleet", "buoy crate sail sail sail galleon", "Bojen|Treibgut|Jollen|Segelboote|Großsegler|Flaggschiff"],
  ["cargo", "Containerhafen", "Wasser", "Kaikanten, Ladekräne und Frachter", 0x32607b, 0x889e9e, 0xb6d0d5, 0xe97e55, "quays", "crate buoy cargo crane cargo cargo", "Frachtkisten|Bojen|Container|Ladekräne|Kleine Frachter|Containerfrachter"],
  ["pirate", "Piratenbucht", "Wasser", "Schatzkisten und schwarze Segel in einer Bucht", 0x3d8f97, 0xe2b778, 0xf2daa0, 0xb43f4d, "bay", "barrel chest palm sail galleon galleon", "Fässer|Schatztruhen|Palmen|Beiboote|Freibeuter|Piratenschiff"],
  ["reef", "Korallenriff", "Wasser", "Riffbögen um ein untergegangenes Schiff", 0x256675, 0x3e9290, 0x75c4bd, 0xff7f98, "reef", "shell coral coral coral arch wreck", "Muscheln|Korallenstöcke|Korallenfächer|Korallenkolonien|Riffbögen|Schiffswrack"],
  ["venice", "Kanäle von Venedig", "Wasser", "Gondeln zwischen Brücken und Palazzi", 0x347d87, 0xd9b993, 0xf0d0ae, 0xa8494b, "canals", "buoy jar longboat arch palazzo palazzo", "Bojen|Vasen|Gondeln|Brücken|Häuser|Palazzi"],
  ["icebreaker", "Eisbrecher-Passage", "Wasser", "Eine enge Fahrrinne zwischen Packeis", 0x305c7c, 0xb4d7e2, 0xb1d4e7, 0xe76a44, "channel", "ice barrel buoy iceberg cargo breaker", "Eissplitter|Tonnen|Seezeichen|Packeis|Versorger|Eisbrecher"],
  ["egypt", "Ägypten am Nil", "Geschichte", "Uferwege, Obelisken und Pyramiden", 0xcd9d65, 0xeac988, 0xf8dda4, 0x35847c, "river", "jar palm obelisk temple obelisk pyramid", "Krüge|Palmen|Kleine Obelisken|Tempel|Große Obelisken|Pyramide"],
  ["rome", "Römisches Forum", "Geschichte", "Eine gepflasterte Achse führt zur Arena", 0xa88f73, 0xe5d0aa, 0xe7d6b6, 0xaa5346, "forum", "jar column arch temple arch arena", "Amphoren|Säulen|Kleine Bögen|Tempel|Triumphbögen|Arena"],
  ["greece", "Griechische Akropolis", "Geschichte", "Gestaffelte Terrassen mit Säulen und Tempel", 0x958d73, 0xe8dfc4, 0xc5e4eb, 0x47789a, "terraces", "stone jar column statue temple temple", "Steine|Vasen|Säulen|Statuen|Schreine|Tempel"],
  ["castle", "Mittelalterliche Burg", "Geschichte", "Eine Zufahrt führt in den befestigten Wehrhof", 0x5e7859, 0xb2aa87, 0xc7d5b7, 0xb55543, "courtyard", "barrel chest cabin tower tower keep", "Fässer|Truhen|Hütten|Wehrtürme|Torhäuser|Bergfried"],
  ["viking", "Wikingerfjord", "Geschichte", "Langhäuser und Schiffe an steilen Fjordwänden", 0x315e73, 0x668b75, 0xbad3d3, 0xa84b45, "fjord", "barrel shield longboat longhouse longboat longhouse", "Fässer|Schilde|Boote|Langhäuser|Langschiffe|Halle"],
  ["bazaar", "Seidenstraßen-Basar", "Geschichte", "Verwinkelte Gassen zwischen Tuchständen", 0xb98f64, 0xe0ba84, 0xe7c39b, 0xc24a68, "alleys", "jar cloth stall stall arch caravan", "Krüge|Stoffballen|Tische|Marktstände|Markttore|Karawanserei"],
  ["ants", "Ameisenbau", "Miniatur", "Verzweigte Futterpfade rund um einen Nesthügel", 0x6d4739, 0xa77851, 0xc3a17a, 0xe8a653, "branches", "seed ant ant leaf root nest", "Samenkörner|Arbeiterinnen|Soldatenameisen|Blätter|Wurzeln|Nesthügel"],
  ["garden", "Regentropfen-Garten", "Miniatur", "Blattinseln mit Käfern und übergroßen Blüten", 0x416849, 0x8cbc67, 0xc9e3bc, 0xf08bba, "leaves", "drop seed beetle leaf flower flower", "Tropfen|Samen|Käfer|Blätter|Blüten|Riesenblüte"],
  ["picnic", "Picknickdecke", "Miniatur", "Karos, Krümel und ein geflochtener Korb", 0xc8756d, 0xffdcc2, 0xf0c9a1, 0xd7964b, "checks", "seed fruit cutlery cup fruit basket", "Krümel|Beeren|Besteck|Becher|Obststücke|Picknickkorb"],
  ["bench", "Werkbank", "Miniatur", "Holzmaserung und Zonen für Werkzeug", 0x795d4a, 0xb08861, 0xbca28b, 0x9eaebd, "workbench", "screw nut wrench wrench toolbox vise", "Schrauben|Muttern|Schlüssel|Werkzeuge|Werkzeugkisten|Schraubstock"],
  ["toys", "Spielzeugzimmer", "Miniatur", "Zuggleise und Gassen aus bunten Bausteinen", 0x748fa3, 0xc7b581, 0xdedbc5, 0xfa7355, "tracks", "brick toy train brick tower brick", "Klötzchen|Spielfiguren|Waggons|Bausteine|Türme|Bausteinburg"],
  ["desk", "Schreibtisch", "Miniatur", "Papierflächen, Kabel und eine Tastatur", 0x725b50, 0xd8d4bc, 0xc6c4b5, 0x7796d0, "paper", "clip screw pencil cup paper keyboard", "Klammern|Radiergummis|Stifte|Becher|Notizblöcke|Tastatur"],
  ["moon", "Mondbasis", "Science-Fiction", "Landespuren zwischen Kratern und Habitaten", 0x454952, 0x737d89, 0x6e7484, 0xe7af64, "craters", "stone beacon rover solar dome station", "Mondgestein|Leuchtbaken|Rover|Solarfelder|Habitate|Mondbasis"],
  ["mars", "Marskolonie", "Science-Fiction", "Ein roter Canyon führt zur Koloniekuppel", 0x9e503d, 0xcf8064, 0xe0a28a, 0x7dd4db, "canyon", "stone beacon solar rover module dome", "Gestein|Baken|Paneele|Rover|Labore|Koloniekuppel"],
  ["ring", "Ringraumstation", "Science-Fiction", "Ringsegmente und Speichen am Stationskern", 0x28334f, 0x536e89, 0x53687e, 0x76e7db, "ring", "beacon solar drone module module station", "Baken|Paneele|Drohnen|Andockmodule|Ringsektionen|Stationskern"],
  ["neon", "Neon-Megacity", "Science-Fiction", "Leuchtschneisen mit Reklamen und Hochhäusern", 0x292440, 0x443a66, 0x5d477e, 0x58e8f1, "neon", "beacon sign drone sign tower neon", "Leuchtmodule|Schilder|Drohnen|Reklamen|Türme|Neon-Hochhaus"],
  ["alien", "Alien-Kristallwald", "Science-Fiction", "Lichtungen zwischen facettierten Kristallen", 0x4c335b, 0x755081, 0x906a98, 0x6ce5cf, "groves", "seed crystal crystal flower crystal spires", "Sporen|Splitter|Kristalle|Sporenblüten|Kristallgruppen|Kristalltürme"],
  ["orbit", "Orbitaler Schrottplatz", "Science-Fiction", "Trümmerbahnen um eine Andockschleuse", 0x363f52, 0x5a6572, 0x6b7995, 0xf2b764, "debris", "screw panel solar drone wreck airlock", "Schrottstücke|Platten|Satelliten|Drohnen|Schiffsrümpfe|Schleuse"],
] as const;

export const landscapes = entries.map(([id, name, group, description, ground, detail, sky, accent, layout, pieces, goals]) => ({
  id, name, group, description, ground, detail, sky, accent, layout,
  models: pieces.split(' '),
  goals: goals.split('|'),
}));
export type Landscape = (typeof landscapes)[number];
export const harbor = landscapes[0];

export function landscapeById(id: string): Landscape {
  return landscapes.find(world => world.id === id) ?? harbor;
}
