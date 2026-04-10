export type FeatureKind =
  | "city"
  | "port"
  | "fortress"
  | "ruin"
  | "road"
  | "river"
  | "mountain"
  | "forest"
  | "lake"
  | "region"
  | "pass"
  | "landmark";

export type Point = { x: number; y: number };

export type ReferenceMapSource = {
  id: "mapome" | "sketch" | "political";
  name: string;
  href: string;
  description: string;
};

export type MapTileLevel = {
  id: "z0" | "z1" | "z2";
  pixelWidth: number;
  pixelHeight: number;
  tileSize: number;
  path: string;
};

export type SearchableFeature = {
  id: string;
  name: string;
  kind: FeatureKind;
  region: string;
  x: number;
  y: number;
  summary: string;
  details: string[];
  aliases?: string[];
  labelOffset?: Point;
  emphasis?: "major" | "standard";
};

export type AreaFeature = SearchableFeature & {
  path: string;
};

export type LineFeature = SearchableFeature & {
  path: string;
};

export type IconCluster = SearchableFeature & {
  points: Point[];
};

export const MAP_WIDTH = 2200;
export const MAP_HEIGHT = 1500;
export const REFERENCE_MAP_WIDTH = 3200;
export const REFERENCE_MAP_HEIGHT = 2400;

export const MAP_TILE_LEVELS: readonly MapTileLevel[] = [
  {
    id: "z0",
    pixelWidth: 1200,
    pixelHeight: 900,
    tileSize: 512,
    path: "/maps/tiles/base/z0"
  },
  {
    id: "z1",
    pixelWidth: 2400,
    pixelHeight: 1800,
    tileSize: 512,
    path: "/maps/tiles/base/z1"
  },
  {
    id: "z2",
    pixelWidth: 4800,
    pixelHeight: 3600,
    tileSize: 512,
    path: "/maps/tiles/base/z2"
  }
];

export const OVERLAY_CALIBRATION = {
  scaleX: 1.12,
  scaleY: 1.31,
  offsetX: 250,
  offsetY: 355
} as const;

export const SOURCE_NOTES = [
  "The interactive overlay is calibrated to a downloaded high-detail Middle-earth atlas image rather than a hand-drawn landmass.",
  "Search, selection, and lore cards still follow Tolkien's published map tradition, Pauline Baynes' poster map, and the geography described in The Hobbit and The Lord of the Rings.",
  "The sketch and political maps are included as comparison layers so the SVG overlay can be checked against multiple references."
] as const;

export const DOWNLOADED_MAP_SOURCES: ReferenceMapSource[] = [
  {
    id: "mapome",
    name: "Detailed Atlas",
    href: "/maps/tiles/base",
    description:
      "High-detail reference atlas from the open Map of Middle-earth project, served as zoom-aware tiles for the primary calibrated base layer."
  },
  {
    id: "sketch",
    name: "Sketch Reference",
    href: "/maps/sketch-reference.svg",
    description:
      "Sketch-style Middle-earth map used as a secondary comparison overlay."
  },
  {
    id: "political",
    name: "Political Regions",
    href: "/maps/political-reference.svg",
    description:
      "Regional overlay showing countries and realms for cross-checking broad territorial placement."
  }
] as const;

export const FEATURE_COORDINATE_OVERRIDES: Record<string, Point> = {
  "grey-havens": { x: 480, y: 1045 },
  hobbiton: { x: 790, y: 1112 },
  "michel-delving": { x: 710, y: 717 },
  bucklebury: { x: 920, y: 1114 },
  "tom-bombadils-house": { x: 980, y: 1188 },
  "old-man-willow": { x: 958, y: 1164 },
  "barrow-downs": { x: 1036, y: 1160 },
  bree: { x: 601, y: 614 },
  fornost: { x: 958, y: 590 },
  annuminas: { x: 728, y: 920 },
  "amon-sul": { x: 769, y: 622 },
  "last-bridge": { x: 836, y: 614 },
  rivendell: { x: 1502, y: 400 },
  tharbad: { x: 1103, y: 604 },
  moria: { x: 1325, y: 566 },
  "durins-door": { x: 1325, y: 566 },
  mirrormere: { x: 1764, y: 1458 },
  "dimrill-dale": { x: 1449, y: 552 },
  hollin: { x: 1399, y: 662 },
  caradhras: { x: 1760, y: 1336 },
  "caras-galadhon": { x: 1443, y: 723 },
  argonath: { x: 2198, y: 1760 },
  "parth-galen": { x: 2190, y: 1870 },
  "amon-hen": { x: 2236, y: 1852 },
  rauros: { x: 2169, y: 845 },
  isengard: { x: 1050, y: 774 },
  orthanc: { x: 1050, y: 774 },
  "treebeards-hall": { x: 1852, y: 1738 },
  wellinghall: { x: 1890, y: 1718 },
  entmoot: { x: 1822, y: 1796 },
  "helms-deep": { x: 1657, y: 761 },
  edoras: { x: 1696, y: 794 },
  dunharrow: { x: 2140, y: 2052 },
  "minas-tirith": { x: 1299, y: 916 },
  "cair-andros": { x: 2355, y: 1978 },
  osgiliath: { x: 2374, y: 2118 },
  "minas-morgul": { x: 970, y: 1227 },
  "cirith-ungol": { x: 1123, y: 1206 },
  morannon: { x: 2013, y: 1181 },
  "barad-dur": { x: 1851, y: 778 },
  "mount-doom": { x: 1775, y: 1005 },
  "dead-marshes": { x: 2450, y: 1958 },
  pelargir: { x: 1549, y: 1314 },
  "dol-amroth": { x: 1232, y: 1284 },
  erech: { x: 1636, y: 1056 },
  "dol-guldur": { x: 2070, y: 1420 },
  "woodland-realm": { x: 2227, y: 639 },
  "beorns-hall": { x: 1960, y: 976 },
  dale: { x: 2480, y: 812 },
  esgaroth: { x: 2220, y: 484 },
  erebor: { x: 1937, y: 433 },
  "longbeard-halls": { x: 2562, y: 790 },
  "longbeard-terrace": { x: 2516, y: 816 },
  "mount-gundabad": { x: 1745, y: 650 }
};

export const LAND_PATH =
  "M320 86 C520 34 804 42 1068 92 C1302 136 1558 186 1762 290 C1942 382 2076 572 2100 812 C2122 1032 2060 1224 1894 1376 C1740 1516 1504 1578 1260 1550 C1030 1524 800 1442 638 1302 C486 1172 434 1034 384 868 C332 696 272 548 272 376 C272 256 286 154 320 86 Z";

export const OCEAN_PATH =
  "M0 0 L348 0 C314 72 292 146 278 228 C260 336 256 448 258 586 C262 704 288 824 330 940 C364 1036 410 1128 492 1234 C544 1300 598 1366 644 1500 L0 1500 Z";

export const BAY_OF_BELFALAS_PATH =
  "M1358 1250 C1456 1178 1562 1154 1672 1178 C1790 1204 1888 1270 1950 1364 C1980 1412 2000 1458 2010 1500 L1282 1500 C1288 1414 1306 1338 1358 1250 Z";

export const SEA_OF_RHUN_PATH =
  "M1968 318 C2042 292 2116 308 2160 362 C2196 404 2198 470 2166 518 C2128 576 2066 608 1992 590 C1924 572 1876 524 1868 456 C1860 392 1902 338 1968 318 Z";

export const LAKES: AreaFeature[] = [
  {
    id: "lake-evendim",
    name: "Lake Evendim",
    kind: "lake",
    region: "Arnor",
    x: 474,
    y: 430,
    summary: "The great northern lake beside Annuminas, called Nenuial in Sindarin.",
    details: [
      "Annúminas was founded on its shores as the royal city of Arnor.",
      "Its waters anchor the north-western geography of Eriador and help define the old Númenórean heartland."
    ],
    path:
      "M404 416 C426 380 480 360 532 376 C582 392 610 434 594 470 C576 510 526 532 474 526 C422 520 382 492 372 456 C364 438 378 432 404 416 Z",
    aliases: ["Nenuial"]
  },
  {
    id: "long-lake",
    name: "Long Lake",
    kind: "lake",
    region: "Rhovanion",
    x: 1642,
    y: 372,
    summary: "The long north-south waterway south of Erebor and Dale, home to Lake-town.",
    details: [
      "Esgaroth stands on pilings over the water near the lake's northern end.",
      "The Running River leaves the south of the lake toward the Sea of Rhûn."
    ],
    path:
      "M1598 286 C1632 262 1698 270 1722 316 C1748 366 1740 448 1698 506 C1662 552 1606 554 1572 512 C1538 470 1538 344 1598 286 Z",
    aliases: ["Lake-town Lake"]
  },
  {
    id: "nen-hithoel",
    name: "Nen Hithoel",
    kind: "lake",
    region: "Anduin Vale",
    x: 1312,
    y: 962,
    summary: "The hill-shadowed lake above Rauros where the Fellowship's river journey ended.",
    details: [
      "Parth Galen lies on the western shore, beneath Amon Hen and Amon Lhaw.",
      "The lake narrows before plunging over Rauros Falls."
    ],
    path:
      "M1264 930 C1294 898 1344 894 1382 916 C1416 936 1428 978 1412 1012 C1394 1048 1346 1068 1302 1058 C1260 1048 1226 1014 1224 976 C1222 956 1234 944 1264 930 Z",
    aliases: ["Hill-shadowed Mere"]
  },
  {
    id: "sea-of-nurnen",
    name: "Sea of Núrnen",
    kind: "lake",
    region: "Mordor",
    x: 1890,
    y: 1340,
    summary: "A fertile inland sea in southern Mordor, sustaining the slave-worked farmlands of Núrn.",
    details: [
      "Though often omitted from simpler maps, it is crucial to Mordor's logistics.",
      "In the Fourth Age, the newly freed peoples of Núrn inherited this land."
    ],
    path:
      "M1782 1270 C1838 1232 1936 1228 2014 1262 C2072 1288 2096 1346 2074 1400 C2048 1458 1974 1490 1888 1478 C1806 1468 1746 1424 1736 1366 C1728 1326 1748 1294 1782 1270 Z",
    aliases: ["Nurnen"]
  },
  {
    id: "sea-of-rhun",
    name: "Sea of Rhûn",
    kind: "lake",
    region: "Rhûn",
    x: 2034,
    y: 446,
    summary: "The broad inland sea east of the great stories' main action, fed by the Running River.",
    details: [
      "Including it widens the map beyond the usual west-of-Middle-earth frame.",
      "It hints at the eastern lands that remain at the edge of the Red Book's horizon."
    ],
    path: SEA_OF_RHUN_PATH,
    aliases: ["Rhun"]
  }
];

export const FORESTS: AreaFeature[] = [
  {
    id: "old-forest",
    name: "Old Forest",
    kind: "forest",
    region: "Eriador",
    x: 476,
    y: 614,
    summary: "A dark remnant woodland east of Buckland, older and stranger than the Shire.",
    details: [
      "It is the first truly uncanny landscape the hobbits cross.",
      "Tom Bombadil's house lies beyond its malicious thickets and winding ways."
    ],
    path:
      "M420 566 C470 540 532 548 568 588 C606 630 602 692 554 716 C506 740 426 720 390 668 C366 632 380 586 420 566 Z",
    aliases: ["Old Forest of Buckland"]
  },
  {
    id: "trollshaws",
    name: "Trollshaws",
    kind: "forest",
    region: "Eriador",
    x: 894,
    y: 618,
    summary: "Broken woodland and heath east of the Last Bridge on the road to Rivendell.",
    details: [
      "This is where Bilbo and Thorin's company encountered trolls in The Hobbit.",
      "It also frames the eastern approach taken by Frodo and Aragorn."
    ],
    path:
      "M808 566 C886 522 982 540 1046 604 C1086 644 1084 708 1036 748 C972 804 856 796 790 724 C754 684 756 612 808 566 Z",
    aliases: ["Troll Shaw"]
  },
  {
    id: "fangorn",
    name: "Fangorn Forest",
    kind: "forest",
    region: "Rohan",
    x: 1186,
    y: 934,
    summary: "The ancient Entwood at the southern end of the Misty Mountains.",
    details: [
      "Treebeard shelters Merry and Pippin here before the Entmoot turns on Isengard.",
      "The forest is shown here as a deep green mass pressing against the Wold."
    ],
    path:
      "M1104 840 C1188 812 1268 820 1328 878 C1376 926 1384 1006 1342 1074 C1296 1142 1204 1160 1122 1122 C1040 1086 992 992 1010 920 C1024 876 1062 854 1104 840 Z",
    aliases: ["Entwood"]
  },
  {
    id: "lorien",
    name: "Lothlórien",
    kind: "forest",
    region: "Anduin Vale",
    x: 1260,
    y: 796,
    summary: "The Golden Wood between the Anduin and the Silverlode.",
    details: [
      "Caras Galadhon rises within its mallorn groves.",
      "Its western edge touches the watercourses that shape the Fellowship's route after Moria."
    ],
    path:
      "M1196 736 C1250 700 1312 702 1360 738 C1408 774 1420 850 1386 898 C1348 952 1264 962 1198 926 C1132 888 1126 784 1196 736 Z",
    aliases: ["Lorien", "The Golden Wood"]
  },
  {
    id: "mirkwood",
    name: "Mirkwood",
    kind: "forest",
    region: "Rhovanion",
    x: 1530,
    y: 574,
    summary: "The great forest east of the Anduin, darkened for long ages by Dol Guldur.",
    details: [
      "The Woodland Realm is hidden in its northern halls, while Dol Guldur brooded in the south.",
      "Its huge footprint helps anchor the north-east of the map."
    ],
    path:
      "M1430 360 C1510 300 1628 300 1714 352 C1800 404 1840 514 1814 620 C1784 750 1696 844 1578 866 C1480 884 1388 842 1334 760 C1274 668 1278 476 1430 360 Z",
    aliases: ["Great Greenwood", "Eryn Lasgalen"]
  },
  {
    id: "druadan",
    name: "Drúadan Forest",
    kind: "forest",
    region: "Anórien",
    x: 1510,
    y: 1046,
    summary: "The forest north-west of Minas Tirith where Ghân-buri-Ghân guides the Rohirrim.",
    details: [
      "Its secret paths let Théoden outflank the watch on the roads.",
      "It adds the tactical geography that matters around the Pelennor Fields."
    ],
    path:
      "M1452 1000 C1492 968 1542 966 1578 994 C1616 1022 1630 1072 1608 1114 C1584 1160 1524 1178 1468 1150 C1416 1122 1404 1040 1452 1000 Z",
    aliases: ["Wild Wood"]
  },
  {
    id: "ithilien",
    name: "Ithilien",
    kind: "forest",
    region: "Gondor",
    x: 1702,
    y: 1140,
    summary: "Gondor's eastern gardenland, still green in broken pockets despite Mordor's shadow.",
    details: [
      "Faramir's rangers use its cover to strike the Southrons and Haradrim.",
      "Its placement softens the harsh frontier between Gondor and Mordor."
    ],
    path:
      "M1638 1082 C1678 1046 1742 1042 1788 1074 C1832 1104 1846 1158 1818 1204 C1786 1256 1710 1278 1642 1240 C1572 1200 1572 1140 1638 1082 Z",
    aliases: ["North Ithilien", "South Ithilien"]
  }
];

export const MOUNTAIN_RANGES: IconCluster[] = [
  {
    id: "blue-mountains",
    name: "Blue Mountains",
    kind: "mountain",
    region: "Lindon",
    x: 310,
    y: 482,
    summary: "The Ered Luin, western wall of the map and long-time refuge of the dwarves.",
    details: [
      "They frame the Shire's western horizon beyond the Gulf of Lhûn.",
      "Their placement comes from the traditional Tolkien maps of Eriador."
    ],
    points: [
      { x: 320, y: 300 },
      { x: 344, y: 350 },
      { x: 326, y: 406 },
      { x: 346, y: 458 },
      { x: 330, y: 520 },
      { x: 350, y: 576 },
      { x: 334, y: 640 }
    ],
    aliases: ["Ered Luin"]
  },
  {
    id: "misty-mountains",
    name: "Misty Mountains",
    kind: "mountain",
    region: "Misty Mountains",
    x: 1094,
    y: 644,
    summary: "The Hithaeglir, the great spine between Eriador and Rhovanion.",
    details: [
      "Rivendell, Hollin, Moria, Fangorn, and the upper Anduin all key off this range.",
      "The map uses a long icon ridge so the mountains remain legible at every zoom level."
    ],
    points: [
      { x: 1140, y: 250 },
      { x: 1120, y: 314 },
      { x: 1152, y: 374 },
      { x: 1118, y: 438 },
      { x: 1148, y: 504 },
      { x: 1110, y: 570 },
      { x: 1144, y: 644 },
      { x: 1108, y: 724 },
      { x: 1138, y: 806 },
      { x: 1104, y: 892 },
      { x: 1134, y: 970 },
      { x: 1100, y: 1046 }
    ],
    aliases: ["Hithaeglir"]
  },
  {
    id: "white-mountains",
    name: "White Mountains",
    kind: "mountain",
    region: "Gondor and Rohan",
    x: 1360,
    y: 1110,
    summary: "The Ered Nimrais, dividing Gondor's southern fiefs from Rohan and Anórien.",
    details: [
      "Helm's Deep, Dunharrow, the Paths of the Dead, and Minas Tirith all sit in relation to this chain.",
      "The range is drawn broad and bright in map view, harder and rockier in satellite view."
    ],
    points: [
      { x: 1128, y: 1120 },
      { x: 1188, y: 1098 },
      { x: 1250, y: 1080 },
      { x: 1320, y: 1072 },
      { x: 1394, y: 1078 },
      { x: 1470, y: 1088 },
      { x: 1548, y: 1098 },
      { x: 1622, y: 1110 }
    ],
    aliases: ["Ered Nimrais"]
  },
  {
    id: "grey-mountains",
    name: "Grey Mountains",
    kind: "mountain",
    region: "Northern Wilderland",
    x: 1546,
    y: 214,
    summary: "The Ered Mithrin, northern dragon-haunted ridge above Mirkwood and Erebor.",
    details: [
      "Their long sweep helps anchor the top of the north-eastern map.",
      "The dwarves of Erebor once turned north to settle among these heights."
    ],
    points: [
      { x: 1320, y: 186 },
      { x: 1398, y: 170 },
      { x: 1488, y: 168 },
      { x: 1582, y: 176 },
      { x: 1674, y: 188 },
      { x: 1768, y: 202 }
    ],
    aliases: ["Ered Mithrin"]
  },
  {
    id: "iron-hills",
    name: "Iron Hills",
    kind: "mountain",
    region: "Rhovanion",
    x: 1856,
    y: 276,
    summary: "The eastern dwarf-lands beyond Erebor, home of Dáin before his kingship.",
    details: [
      "They are tied closely to the Dwarf Road between Erebor and the east.",
      "Their ridge extends the map's detail beyond the most common film-era frame."
    ],
    points: [
      { x: 1778, y: 284 },
      { x: 1830, y: 264 },
      { x: 1886, y: 258 },
      { x: 1948, y: 268 }
    ],
    aliases: ["Ironhill"]
  },
  {
    id: "ered-lithui",
    name: "Ash Mountains",
    kind: "mountain",
    region: "Mordor",
    x: 1868,
    y: 932,
    summary: "The Ered Lithui, the northern wall of Mordor.",
    details: [
      "The Morannon is set into their western extent.",
      "They pair with the Mountains of Shadow to define Mordor's basin."
    ],
    points: [
      { x: 1750, y: 926 },
      { x: 1810, y: 906 },
      { x: 1874, y: 894 },
      { x: 1944, y: 894 },
      { x: 2010, y: 904 }
    ],
    aliases: ["Ered Lithui"]
  },
  {
    id: "ephel-duath",
    name: "Mountains of Shadow",
    kind: "mountain",
    region: "Mordor",
    x: 1788,
    y: 1148,
    summary: "The Ephel Dúath, western wall of Mordor and line of passes from Ithilien.",
    details: [
      "Cirith Ungol bites into this range, and Minas Morgul sits beneath its threat.",
      "The ridge turns south toward Núrn and helps frame the approach to Mount Doom."
    ],
    points: [
      { x: 1744, y: 980 },
      { x: 1774, y: 1048 },
      { x: 1804, y: 1120 },
      { x: 1826, y: 1196 },
      { x: 1840, y: 1274 },
      { x: 1852, y: 1348 }
    ],
    aliases: ["Ephel Duath"]
  }
];

export const RIVERS: LineFeature[] = [
  {
    id: "river-lhun",
    name: "Lhûn",
    kind: "river",
    region: "Lindon",
    x: 246,
    y: 494,
    summary: "The river feeding the Gulf of Lhûn beside the Grey Havens.",
    details: [
      "It helps define the western maritime threshold of Middle-earth.",
      "Its lower reaches are drawn wide to emphasize the havens and tidal coast."
    ],
    path: "M242 246 C246 336 250 430 248 520 C246 626 230 726 212 818",
    aliases: ["Lune"]
  },
  {
    id: "brandywine",
    name: "Brandywine",
    kind: "river",
    region: "The Shire",
    x: 380,
    y: 594,
    summary: "The Baranduin, eastern boundary of the Shire and Buckland.",
    details: [
      "Its crossing at Bucklebury Ferry shapes the hobbits' earliest flight.",
      "The map emphasizes its south-running course to help orient the Shire."
    ],
    path: "M346 324 C360 404 370 480 376 560 C382 644 380 736 360 840",
    aliases: ["Baranduin"]
  },
  {
    id: "greyflood",
    name: "Greyflood",
    kind: "river",
    region: "Enedwaith",
    x: 708,
    y: 816,
    summary: "The Gwathló, broad river of southern Eriador flowing west to the sea.",
    details: [
      "Tharbad stands at one of its key crossings.",
      "Combined with the Glanduin, it marks the southern edge of old Arnor."
    ],
    path: "M928 706 C878 744 826 778 764 800 C694 824 602 838 506 836",
    aliases: ["Gwathlo"]
  },
  {
    id: "hoarwell",
    name: "Hoarwell",
    kind: "river",
    region: "Eriador",
    x: 812,
    y: 522,
    summary: "The Mitheithel flowing south from the northern heights toward the Greyflood.",
    details: [
      "Together with the Bruinen it helps define the angle of the Trollshaws and Rivendell road.",
      "Its old crossing is known as the Last Bridge."
    ],
    path: "M826 248 C826 340 822 440 818 536 C812 640 794 724 764 802",
    aliases: ["Mitheithel"]
  },
  {
    id: "bruinen",
    name: "Bruinen",
    kind: "river",
    region: "Rivendell",
    x: 954,
    y: 604,
    summary: "The Loudwater's eastern sister stream rushing from Rivendell's hidden valley.",
    details: [
      "Elrond's flood rises here against the Black Riders.",
      "It forms one of the most memorable defensive boundaries in The Fellowship of the Ring."
    ],
    path: "M1038 526 C1016 554 994 580 970 604 C946 626 912 646 874 658",
    aliases: ["Ford of Bruinen"]
  },
  {
    id: "glanduin",
    name: "Glanduin",
    kind: "river",
    region: "Eregion",
    x: 988,
    y: 714,
    summary: "A western tributary feeding the Greyflood below Hollin.",
    details: [
      "It shapes the lowlands south of Eregion and north of Tharbad.",
      "Its course ties the Eregion-Moria corridor into the wider west."
    ],
    path: "M1102 620 C1070 664 1040 700 1004 724 C944 766 868 790 764 800"
  },
  {
    id: "anduin",
    name: "Anduin",
    kind: "river",
    region: "Wilderland",
    x: 1386,
    y: 774,
    summary: "The Great River, descending from the north through Wilderland to the sea.",
    details: [
      "It is the single biggest organizing waterway in the map, linking Mirkwood, Lórien, Rohan, Gondor, and Mordor.",
      "The Fellowship floats its central reach from Lórien to Rauros."
    ],
    path:
      "M1424 158 C1414 278 1400 398 1390 514 C1384 616 1378 724 1376 840 C1376 934 1384 1030 1418 1132 C1454 1238 1510 1342 1568 1448",
    aliases: ["Great River"]
  },
  {
    id: "celebrant",
    name: "Silverlode",
    kind: "river",
    region: "Lothlórien",
    x: 1322,
    y: 796,
    summary: "The Celebrant, western boundary stream of Lothlórien.",
    details: [
      "Its bright waters protect the Golden Wood.",
      "It enters the Anduin just south of the forest."
    ],
    path: "M1316 718 C1328 748 1332 774 1328 806 C1324 842 1312 878 1292 920",
    aliases: ["Celebrant"]
  },
  {
    id: "isen",
    name: "Isen",
    kind: "river",
    region: "Rohan",
    x: 968,
    y: 1134,
    summary: "The western river of Rohan, flowing south from Fangorn and Isengard's marches.",
    details: [
      "It marks a hard military frontier during Saruman's war.",
      "The Fords of Isen are implied by the river's broad bend near the Gap."
    ],
    path: "M978 936 C964 1010 954 1080 950 1142 C946 1216 948 1296 966 1382"
  },
  {
    id: "entwash",
    name: "Entwash",
    kind: "river",
    region: "Rohan",
    x: 1260,
    y: 1098,
    summary: "The marsh-making river that drains Fangorn and the east-mark into the Anduin.",
    details: [
      "Its mouth lies south of Rauros and north of Gondor proper.",
      "The Wold and the Eastemnet spread around it."
    ],
    path: "M1256 970 C1248 1016 1242 1060 1242 1100 C1242 1144 1248 1188 1262 1236"
  },
  {
    id: "celduin",
    name: "Running River",
    kind: "river",
    region: "Rhovanion",
    x: 1710,
    y: 520,
    summary: "The Celduin, carrying the Long Lake's waters east toward Rhûn.",
    details: [
      "Dale and Esgaroth live by its northern reaches.",
      "It pulls the map's north-east economy toward the inland sea."
    ],
    path: "M1662 510 C1706 520 1748 526 1796 516 C1866 500 1926 476 1978 448",
    aliases: ["Celduin"]
  }
];

export const ROADS: LineFeature[] = [
  {
    id: "great-east-road",
    name: "Great East Road",
    kind: "road",
    region: "Eriador",
    x: 640,
    y: 568,
    summary: "The west-east road from the Grey Havens through the Shire and Bree toward Rivendell.",
    details: [
      "It is Bilbo's road, Frodo's road, and the strongest connective thread in north-west Eriador.",
      "The route is deliberately emphasized so the app feels immediately map-like and navigable."
    ],
    path:
      "M188 468 C256 492 324 514 396 526 C458 536 520 548 574 570 C640 598 700 598 758 584 C826 568 904 578 980 608",
    aliases: ["East Road", "Road to Rivendell"]
  },
  {
    id: "greenway",
    name: "Greenway",
    kind: "road",
    region: "Arnor",
    x: 566,
    y: 680,
    summary: "The old north-south road from Fornost through Bree toward Tharbad and the south.",
    details: [
      "It is the surviving spine of old Arnor's road network.",
      "Aragorn and the Rangers remain closely tied to this weathered route."
    ],
    path: "M530 468 C548 544 560 616 578 694 C590 748 600 796 622 850",
    aliases: ["North-South Road"]
  },
  {
    id: "redhorn-pass",
    name: "Redhorn Pass",
    kind: "pass",
    region: "Misty Mountains",
    x: 1110,
    y: 724,
    summary: "The perilous high pass over Caradhras attempted by the Fellowship.",
    details: [
      "Snow and malice turn them away before they can clear the ridge.",
      "Its placement helps explain the shift from open road geography into Moria's underworld."
    ],
    path: "M1000 732 C1046 722 1086 714 1128 708 C1154 704 1182 704 1206 712",
    aliases: ["Caradhras Pass"]
  },
  {
    id: "rohan-road",
    name: "Westfold and King's Road",
    kind: "road",
    region: "Rohan and Gondor",
    x: 1338,
    y: 1098,
    summary: "The road line linking Isengard's plain, Edoras, Minas Tirith, and the eastern front.",
    details: [
      "This compresses several named roads into a single legible strategic corridor.",
      "It mirrors how readers often think about Rohan and Gondor as one campaign space."
    ],
    path:
      "M1026 1034 C1080 1044 1154 1070 1210 1100 C1290 1138 1374 1130 1444 1110 C1512 1090 1564 1088 1660 1100",
    aliases: ["King's Road", "Road to Minas Tirith"]
  },
  {
    id: "harad-road",
    name: "Harad Road",
    kind: "road",
    region: "Gondor",
    x: 1562,
    y: 1240,
    summary: "The southern road through Gondor's coastal fiefs toward Pelargir and Dol Amroth.",
    details: [
      "It carries armies, refugees, and supply lines through the lower Anduin basin.",
      "The bay and coastal points read more clearly when this route is present."
    ],
    path: "M1590 1100 C1604 1160 1618 1204 1642 1218 C1598 1242 1532 1288 1454 1312",
    aliases: ["Road to Dol Amroth"]
  },
  {
    id: "mordor-road",
    name: "Morgul and Morannon Roads",
    kind: "road",
    region: "Gondor and Mordor",
    x: 1744,
    y: 1052,
    summary: "The road system from Osgiliath toward Minas Morgul and the Black Gate.",
    details: [
      "This is where Gondor's frontier hardens into Mordor's military geometry.",
      "The route is rendered in a colder tone so the eastern menace reads instantly."
    ],
    path: "M1662 1100 C1692 1098 1710 1092 1724 1086 C1762 1068 1798 1034 1828 998",
    aliases: ["Road to Minas Morgul", "Black Gate Road"]
  },
  {
    id: "dwarf-road",
    name: "Dwarf Road",
    kind: "road",
    region: "Rhovanion",
    x: 1660,
    y: 322,
    summary: "The eastern road between Erebor, Dale, and the Iron Hills.",
    details: [
      "It marks the trade and kinship routes of Durin's folk in the north-east.",
      "The road helps the Erebor cluster read as a coherent civic landscape."
    ],
    path: "M1678 320 C1730 300 1788 286 1842 282 C1888 280 1926 282 1964 286",
    aliases: ["Road to Iron Hills"]
  },
  {
    id: "fellowship-route",
    name: "Fellowship Route",
    kind: "road",
    region: "Eriador to Gondor",
    x: 1040,
    y: 760,
    summary: "A highlighted journey path from the Shire to Rauros, then east toward Mordor.",
    details: [
      "This is not a canonical single road, but a story route layered on top of the geography.",
      "It gives the whole atlas a clear narrative spine for first-time visitors."
    ],
    path:
      "M394 526 C464 540 526 548 574 570 C676 612 806 574 980 608 C1020 646 1054 692 1076 770 C1100 796 1186 810 1262 800 C1290 868 1302 920 1322 972 C1368 1034 1486 1116 1588 1102 C1664 1098 1714 1096 1792 1090",
    aliases: ["Nine Walkers Route"]
  }
];

export const POINTS: SearchableFeature[] = [
  {
    id: "grey-havens",
    name: "Grey Havens",
    kind: "port",
    region: "Lindon",
    x: 188,
    y: 468,
    summary: "Círdan's harbour at Mithlond, the western gate from Middle-earth to the Straight Road.",
    details: [
      "This is the map's emotional west: the last sight of Middle-earth for the Ring-bearers.",
      "It also anchors the Great East Road and the Gulf of Lhûn."
    ],
    aliases: ["Mithlond"],
    emphasis: "major"
  },
  {
    id: "hobbiton",
    name: "Hobbiton",
    kind: "city",
    region: "The Shire",
    x: 394,
    y: 526,
    summary: "A quiet hill-village in the Westfarthing, home to Bilbo and Frodo Baggins.",
    details: [
      "Bag End sits above the smial-dotted lanes of Hobbiton Hill.",
      "Starting the atlas here makes the later sweep toward Mordor feel earned."
    ],
    aliases: ["Bag End"],
    emphasis: "major"
  },
  {
    id: "michel-delving",
    name: "Michel Delving",
    kind: "city",
    region: "The Shire",
    x: 332,
    y: 558,
    summary: "The Shire's chief township and seat of the Mayor.",
    details: [
      "It helps flesh out the Shire as a real civic landscape, not just a single village.",
      "Its label keeps the westlands feeling inhabited even before the wider quest begins."
    ],
    aliases: ["Delving"]
  },
  {
    id: "bucklebury",
    name: "Bucklebury",
    kind: "city",
    region: "The Shire",
    x: 448,
    y: 568,
    summary: "The Buckland settlement beside the Brandywine and the edge of the Old Forest.",
    details: [
      "Frodo's crossing by Bucklebury Ferry turns domestic geography into dangerous geography.",
      "It sits exactly where the Shire gives way to older, stranger lands."
    ],
    aliases: ["Buckland", "Bucklebury Ferry"]
  },
  {
    id: "tom-bombadils-house",
    name: "Tom Bombadil's House",
    kind: "landmark",
    region: "Old Forest",
    x: 472,
    y: 596,
    summary: "The house of Tom Bombadil and Goldberry beyond the tangled heart of the Old Forest.",
    details: [
      "It is the Fellowship's first true refuge after the uncanny dangers of Buckland and the Old Forest.",
      "Adding it gives Bombadil's country a concrete place on the atlas rather than leaving it as a vague story detour."
    ],
    aliases: ["Bombadil's House", "House of Tom Bombadil"]
  },
  {
    id: "old-man-willow",
    name: "Old Man Willow",
    kind: "landmark",
    region: "Old Forest",
    x: 454,
    y: 582,
    summary: "The malign willow in the Old Forest that traps Merry and Pippin before Bombadil intervenes.",
    details: [
      "This point marks the most famous hostile spirit in the Old Forest.",
      "It helps users connect Buckland, Bombadil's rescue, and the wider eerie geography east of the Shire."
    ],
    aliases: ["Old Willow-man"]
  },
  {
    id: "barrow-downs",
    name: "Barrow-downs",
    kind: "region",
    region: "Eriador",
    x: 520,
    y: 586,
    summary: "The haunted downs east of the Old Forest where the hobbits are seized by a barrow-wight.",
    details: [
      "The Barrow-downs are one of the oldest haunted landscapes in the westlands.",
      "They matter because they bridge the Shire-world and the deeper ruins and undead memory of Arnor."
    ],
    aliases: ["Tyrn Gorthad"]
  },
  {
    id: "bree",
    name: "Bree",
    kind: "city",
    region: "Bree-land",
    x: 572,
    y: 570,
    summary: "The mixed town of Men and Hobbits at the crossing of the Greenway and East Road.",
    details: [
      "The Prancing Pony makes it one of the most remembered waystations in the legendarium.",
      "Its map position is essential for route-finding across Eriador."
    ],
    aliases: ["Bree-land"],
    emphasis: "major"
  },
  {
    id: "fornost",
    name: "Fornost",
    kind: "ruin",
    region: "Arnor",
    x: 528,
    y: 468,
    summary: "The ruined hill-capital of Arthedain in the North Downs.",
    details: [
      "Though a ruin in the War of the Ring, it carries the memory of the northern kingdom.",
      "Its relation to Bree and Annúminas helps explain Arnor's old geography."
    ],
    aliases: ["Deadmen's Dike"]
  },
  {
    id: "annuminas",
    name: "Annúminas",
    kind: "ruin",
    region: "Arnor",
    x: 476,
    y: 454,
    summary: "The ancient royal city of Arnor on the shores of Lake Evendim.",
    details: [
      "Its name means 'Tower of the West' and preserves Númenórean memory in the north.",
      "Aragorn later restores its kingship in the Reunited Kingdom."
    ],
    aliases: ["Annuminas"]
  },
  {
    id: "amon-sul",
    name: "Weathertop",
    kind: "landmark",
    region: "Eriador",
    x: 764,
    y: 584,
    summary: "Amon Sûl, the ruined watch-hill east of Bree.",
    details: [
      "The hobbits' camp here becomes the first direct strike of the Nazgûl.",
      "Its tower once linked the seeing-stones of Arnor and Gondor."
    ],
    aliases: ["Amon Sul", "Weathertop Hill"],
    emphasis: "major"
  },
  {
    id: "last-bridge",
    name: "Last Bridge",
    kind: "landmark",
    region: "Eriador",
    x: 858,
    y: 618,
    summary: "The last crossing of the Hoarwell before the wild country to Rivendell.",
    details: [
      "Bilbo's and Frodo's roads both hinge on this bridge.",
      "Its placement helps search users orient the approach to Rivendell."
    ]
  },
  {
    id: "rivendell",
    name: "Rivendell",
    kind: "city",
    region: "Eriador",
    x: 982,
    y: 608,
    summary: "Elrond's hidden valley, refuge of lore, healing, and councils.",
    details: [
      "The Fellowship is formed here, making Rivendell the atlas's intellectual center.",
      "Its sheltered placement against the Bruinen and the mountains is deliberately emphasized."
    ],
    aliases: ["Imladris"],
    emphasis: "major"
  },
  {
    id: "tharbad",
    name: "Tharbad",
    kind: "ruin",
    region: "Enedwaith",
    x: 620,
    y: 838,
    summary: "The decayed bridge-city on the Greyflood at the edge of old kingdoms.",
    details: [
      "It marks the southern fade of Arnor and the northern reach of Gondor's road system.",
      "As a ruin, it enriches the map with deep time rather than only present-day action."
    ]
  },
  {
    id: "moria",
    name: "Khazad-dûm",
    kind: "ruin",
    region: "Misty Mountains",
    x: 1078,
    y: 772,
    summary: "The dwarf-realm of Moria beneath the Misty Mountains.",
    details: [
      "Its West-gate sits off Hollin, while its eastern exit opens near the Dimrill Dale.",
      "The Balrog's return makes it one of the story's sharpest tonal shifts."
    ],
    aliases: ["Moria"]
  },
  {
    id: "durins-door",
    name: "Durin's Door",
    kind: "landmark",
    region: "Hollin Gate",
    x: 1056,
    y: 770,
    summary: "The West-gate of Moria, the hidden elven-dwarf doorway beside the dark water.",
    details: [
      "The Fellowship enters Khazad-dûm through these holly-marked doors after the riddle of 'speak, friend, and enter.'",
      "It is separate from Moria itself because the West-gate is one of the most memorable threshold scenes in the story."
    ],
    aliases: ["West-gate of Moria", "Doors of Durin"]
  },
  {
    id: "mirrormere",
    name: "Mirrormere",
    kind: "lake",
    region: "Dimrill Dale",
    x: 1118,
    y: 774,
    summary: "Kheled-zâram, the still lake east of Moria where stars and Durin's crown were mirrored.",
    details: [
      "The lake turns the eastern side of Moria from pure escape route into a place of memory and dwarven reverence.",
      "It is often omitted from simplified maps even though it sharpens the geography of the Dimrill exit."
    ],
    aliases: ["Kheled-zâram", "Lake of Moria"]
  },
  {
    id: "dimrill-dale",
    name: "Dimrill Dale",
    kind: "region",
    region: "Misty Mountains",
    x: 1136,
    y: 790,
    summary: "The dale east of Moria where the Fellowship emerges beneath the Dimrill Stair and the Silverlode's source.",
    details: [
      "It connects Mirrormere, the East-gate of Moria, and the road toward Lórien.",
      "The dale is a useful map hinge between the terror below ground and the golden refuge beyond."
    ],
    aliases: ["Nanduhirion", "Azanulbizar"]
  },
  {
    id: "hollin",
    name: "Hollin",
    kind: "region",
    region: "Eregion",
    x: 976,
    y: 726,
    summary: "The empty holly-land of Eregion west of Moria.",
    details: [
      "This former elven realm holds the memory of Celebrimbor and the Rings of Power.",
      "It bridges the old road-world of Eriador and the deep pass into Khazad-dûm."
    ],
    aliases: ["Eregion"]
  },
  {
    id: "caradhras",
    name: "Caradhras",
    kind: "mountain",
    region: "Misty Mountains",
    x: 1126,
    y: 714,
    summary: "Redhorn, the cruel peak above the Fellowship's failed crossing.",
    details: [
      "Even on a broad atlas, the pass feels personal because the mountain is story-active.",
      "It stands here as both topography and antagonist."
    ],
    aliases: ["Redhorn"]
  },
  {
    id: "caras-galadhon",
    name: "Caras Galadhon",
    kind: "city",
    region: "Lothlórien",
    x: 1260,
    y: 800,
    summary: "The heart-city of Lothlórien among the mallorn trees.",
    details: [
      "Galadriel and Celeborn receive the Fellowship here after Moria.",
      "Its placement within the forest clarifies that Lórien is both realm and woodland."
    ],
    aliases: ["City of Trees"],
    emphasis: "major"
  },
  {
    id: "argonath",
    name: "Argonath",
    kind: "landmark",
    region: "Anduin Vale",
    x: 1292,
    y: 914,
    summary: "The Pillars of the Kings, twin colossal statues that guard the northern approach to Nen Hithoel.",
    details: [
      "The Fellowship passes between these vast images of Isildur and Anárion as the Anduin narrows into one of its most ceremonial thresholds.",
      "Adding the Argonath gives the atlas a named gateway between Lórien's southern reach and the breaking point at Parth Galen and Amon Hen."
    ],
    aliases: ["Pillars of the Kings", "Gate of Kings"]
  },
  {
    id: "parth-galen",
    name: "Parth Galen",
    kind: "landmark",
    region: "Anduin Vale",
    x: 1270,
    y: 982,
    summary: "The green sward below Amon Hen where the Fellowship breaks.",
    details: [
      "It is the last peaceful stopping place before Rauros and the scattering of the Company.",
      "The atlas treats it as a key story hinge rather than just a campsite."
    ]
  },
  {
    id: "amon-hen",
    name: "Amon Hen",
    kind: "landmark",
    region: "Anduin Vale",
    x: 1322,
    y: 976,
    summary: "The Hill of Seeing on the western bank above Rauros.",
    details: [
      "Frodo sits upon its seat and glimpses war and shadow across the world.",
      "Its counterpart Amon Lhaw is implied east of the lake."
    ],
    aliases: ["Hill of Seeing"]
  },
  {
    id: "rauros",
    name: "Rauros",
    kind: "landmark",
    region: "Anduin Vale",
    x: 1338,
    y: 1036,
    summary: "The great falls of the Anduin below Nen Hithoel.",
    details: [
      "These falls force the Fellowship's river journey to an end.",
      "The map keeps them prominent because they are both hydrological barrier and story breakpoint."
    ],
    aliases: ["Rauros Falls"]
  },
  {
    id: "isengard",
    name: "Isengard",
    kind: "fortress",
    region: "Nan Curunír",
    x: 1028,
    y: 1034,
    summary: "Saruman's ringed stronghold at the Gap of Rohan.",
    details: [
      "Orthanc stands at its core, linking wizard-politics to military geography.",
      "Its position shows why the Gap of Rohan is so strategically charged."
    ],
    aliases: ["Orthanc"],
    emphasis: "major"
  },
  {
    id: "orthanc",
    name: "Orthanc",
    kind: "fortress",
    region: "Isengard",
    x: 1030,
    y: 1030,
    summary: "The black tower at the center of Isengard, seat of Saruman before the Ents break the ring-wall's power.",
    details: [
      "Orthanc deserves its own POI because the tower itself is one of the most iconic vertical landmarks in The Lord of the Rings.",
      "Separating it from Isengard lets the app treat the ringed vale and the tower as distinct places."
    ],
    aliases: ["Tower of Orthanc"]
  },
  {
    id: "treebeards-hall",
    name: "Treebeard's Hall",
    kind: "landmark",
    region: "Fangorn Forest",
    x: 1100,
    y: 944,
    summary: "The western Fangorn dwelling-place associated with Treebeard, near the mountain feet and the Ents' oldest paths.",
    details: [
      "This landmark represents Treebeard's own refuge in the forest, separated from the broader woodland so the atlas can surface Ent geography more precisely.",
      "It sits on the western side of Fangorn, where Merry and Pippin first come under Treebeard's protection."
    ],
    aliases: ["Treebeard's House", "Treebeard Hall"]
  },
  {
    id: "wellinghall",
    name: "Wellinghall",
    kind: "landmark",
    region: "Fangorn Forest",
    x: 1124,
    y: 932,
    summary: "A deep Ent-dwelling in Fangorn, remembered as Treebeard's leafy hall among springs, roots, and living chambers.",
    details: [
      "Wellinghall gives the forest a named interior destination rather than treating Fangorn as a single undifferentiated green mass.",
      "It helps distinguish Treebeard's home country from the Entmoot gathering place farther to the south-west."
    ],
    aliases: ["Treebeard's Wellinghall"]
  },
  {
    id: "entmoot",
    name: "Entmoot",
    kind: "landmark",
    region: "Fangorn Forest",
    x: 1062,
    y: 982,
    summary: "The gathering place of the Ents at Derndingle, where they hold council before marching on Isengard.",
    details: [
      "This is the hosting of the Entmoot that turns Fangorn from old endurance into open action against Saruman.",
      "Keeping it separate from Wellinghall and Treebeard's Hall helps the atlas show that Ent counsel and Ent dwelling are not the same place."
    ],
    aliases: ["Derndingle", "Hosting of the Entmoot"]
  },
  {
    id: "helms-deep",
    name: "Helm's Deep",
    kind: "fortress",
    region: "Westfold",
    x: 1114,
    y: 1112,
    summary: "The Hornburg and Deeping-coomb at the north-western feet of the White Mountains.",
    details: [
      "It is the key fortress-road junction of the Westfold.",
      "The valley geography matters, so it is pinned tightly against the mountains."
    ],
    aliases: ["Hornburg"]
  },
  {
    id: "edoras",
    name: "Edoras",
    kind: "city",
    region: "Rohan",
    x: 1210,
    y: 1100,
    summary: "Capital of Rohan beneath the White Mountains, seat of Meduseld.",
    details: [
      "The city sits by the Snowbourn on a rise above the plains.",
      "Its placement is central to any campaign view of Rohan."
    ],
    aliases: ["Meduseld"],
    emphasis: "major"
  },
  {
    id: "dunharrow",
    name: "Dunharrow",
    kind: "fortress",
    region: "White Mountains",
    x: 1366,
    y: 1124,
    summary: "The mountain refuge above the road to the Paths of the Dead.",
    details: [
      "The Rohirrim muster here before Théoden rides east.",
      "It lets the White Mountains feel traversable rather than simply blocking."
    ],
    aliases: ["Firienholt"]
  },
  {
    id: "minas-tirith",
    name: "Minas Tirith",
    kind: "city",
    region: "Gondor",
    x: 1590,
    y: 1100,
    summary: "The White City of Gondor, guarded by Mindolluin and the Pelennor.",
    details: [
      "This is the app's default focus because it sits at the military and narrative crossroads of the War of the Ring.",
      "The map places it just west of the Anduin and north of Pelargir, matching the campaign geography."
    ],
    aliases: ["The White City"],
    emphasis: "major"
  },
  {
    id: "cair-andros",
    name: "Cair Andros",
    kind: "fortress",
    region: "Gondor",
    x: 1600,
    y: 1036,
    summary: "The island-fort guarding the northward bend of the Anduin.",
    details: [
      "It helps explain Gondor's layered river defenses before the approach to Osgiliath.",
      "Its inclusion adds a military detail often absent from simpler fan maps."
    ]
  },
  {
    id: "osgiliath",
    name: "Osgiliath",
    kind: "ruin",
    region: "Gondor",
    x: 1662,
    y: 1100,
    summary: "The broken bridge-city of Gondor spanning the Anduin.",
    details: [
      "The war for Osgiliath makes the river crossing between Gondor and Mordor concrete.",
      "Its ruined status preserves the long decline beneath Gondor's current resistance."
    ],
    emphasis: "major"
  },
  {
    id: "minas-morgul",
    name: "Minas Morgul",
    kind: "fortress",
    region: "Mordor Borderlands",
    x: 1722,
    y: 1088,
    summary: "The tower of the Nazgûl on the Morgul Vale, once Minas Ithil.",
    details: [
      "It is the most visibly corrupted frontier point on the map.",
      "Its road and pass relationship to Cirith Ungol is essential for Frodo and Sam's approach."
    ],
    aliases: ["Minas Ithil"],
    emphasis: "major"
  },
  {
    id: "cirith-ungol",
    name: "Cirith Ungol",
    kind: "fortress",
    region: "Ephel Dúath",
    x: 1792,
    y: 1082,
    summary: "The tower and pass above Shelob's tunnel on Mordor's western wall.",
    details: [
      "This is the stealth route chosen after the Black Gate proves impossible.",
      "The app places it tightly against the Mountains of Shadow to preserve the sense of a razor-thin breach."
    ],
    aliases: ["Pass of the Spider"]
  },
  {
    id: "morannon",
    name: "Morannon",
    kind: "fortress",
    region: "Mordor",
    x: 1828,
    y: 998,
    summary: "The Black Gate on Mordor's north-western approach.",
    details: [
      "The gap between the Ash Mountains and Ephel Dúath funnels armies here.",
      "It is both a choke point and a symbol of Sauron's military confidence."
    ],
    aliases: ["Black Gate"],
    emphasis: "major"
  },
  {
    id: "barad-dur",
    name: "Barad-dûr",
    kind: "fortress",
    region: "Mordor",
    x: 1886,
    y: 1090,
    summary: "The Dark Tower in the north of Mordor, seat of Sauron's power.",
    details: [
      "Its location east of the Morannon and north of Orodruin preserves the canonical triangle of terror in Mordor.",
      "Selecting it shows how the eastern war-space is organized."
    ],
    aliases: ["Dark Tower"],
    emphasis: "major"
  },
  {
    id: "mount-doom",
    name: "Mount Doom",
    kind: "mountain",
    region: "Mordor",
    x: 1842,
    y: 1182,
    summary: "Orodruin, the volcanic mountain where the One Ring was forged and unmade.",
    details: [
      "This point is the map's narrative east, just as the Grey Havens are its emotional west.",
      "The crater label sits close because the mountain itself is the destination."
    ],
    aliases: ["Orodruin", "Sammath Naur"],
    emphasis: "major"
  },
  {
    id: "dead-marshes",
    name: "Dead Marshes",
    kind: "region",
    region: "Dagorlad",
    x: 1750,
    y: 1032,
    summary: "The corpse-lit wetlands north of Mordor.",
    details: [
      "They preserve the battlefield memory of Dagorlad beneath treacherous water and reeds.",
      "Their inclusion helps the Mordor frontier feel geographically varied, not just mountainous."
    ],
    aliases: ["Dagorlad Marshes"]
  },
  {
    id: "pelargir",
    name: "Pelargir",
    kind: "port",
    region: "Gondor",
    x: 1642,
    y: 1218,
    summary: "The great southern haven of Gondor on the lower Anduin.",
    details: [
      "Aragorn's corsair-taking ride culminates in the fleet arriving from here.",
      "The port ties inland Gondor to the sea-lanes of Belfalas."
    ],
    emphasis: "major"
  },
  {
    id: "dol-amroth",
    name: "Dol Amroth",
    kind: "port",
    region: "Belfalas",
    x: 1454,
    y: 1312,
    summary: "The princely swan-city on the western side of the Bay of Belfalas.",
    details: [
      "It brings maritime Gondor onto the same visual plane as the inland war.",
      "Its placement makes the bay and fief-doms feel geographically meaningful."
    ],
    aliases: ["Swan City"],
    emphasis: "major"
  },
  {
    id: "erech",
    name: "Erech",
    kind: "landmark",
    region: "Blackroot Vale",
    x: 1492,
    y: 1222,
    summary: "The hill of the Black Stone where Aragorn summons the Oathbreakers.",
    details: [
      "It makes the Paths of the Dead legible in the atlas as a real southward arc through the mountains.",
      "Its story significance far exceeds its size, so the label is kept bold."
    ]
  },
  {
    id: "dol-guldur",
    name: "Dol Guldur",
    kind: "fortress",
    region: "Southern Mirkwood",
    x: 1492,
    y: 690,
    summary: "The dark fortress in southern Mirkwood once used by Sauron as the Necromancer.",
    details: [
      "Even after Sauron's return to Mordor, Dol Guldur remains strategically and thematically important.",
      "Its pin keeps southern Mirkwood from feeling empty."
    ],
    aliases: ["Necromancer's Hold"]
  },
  {
    id: "woodland-realm",
    name: "Woodland Realm",
    kind: "city",
    region: "Northern Mirkwood",
    x: 1542,
    y: 496,
    summary: "The underground halls of Thranduil in northern Mirkwood.",
    details: [
      "Bilbo's escape with the barrels begins near here.",
      "The realm balances Dol Guldur on the same forest mass."
    ],
    aliases: ["Thranduil's Halls", "Elvenking's Halls"]
  },
  {
    id: "beorns-hall",
    name: "Beorn's Hall",
    kind: "landmark",
    region: "Vales of Anduin",
    x: 1462,
    y: 438,
    summary: "The Carrock-side homestead of Beorn and later the Beornings.",
    details: [
      "It marks the northward crossing between Mirkwood and the Misty Mountains.",
      "Including it makes the upper Anduin less abstract."
    ],
    aliases: ["Carrock"]
  },
  {
    id: "dale",
    name: "Dale",
    kind: "city",
    region: "Rhovanion",
    x: 1678,
    y: 318,
    summary: "The rebuilt town under Erebor's southern spur.",
    details: [
      "Its trade links with Erebor and Lake-town define the north-east economy.",
      "The city is placed tightly against the mountain to preserve that relationship."
    ],
    emphasis: "major"
  },
  {
    id: "esgaroth",
    name: "Esgaroth",
    kind: "port",
    region: "Long Lake",
    x: 1650,
    y: 372,
    summary: "Lake-town on the Long Lake, built over the water on timber piles.",
    details: [
      "Smaug's destruction and Bard's later leadership both hinge on this place.",
      "It reads as a port-city rather than an inland town because of its water setting."
    ],
    aliases: ["Lake-town"],
    emphasis: "major"
  },
  {
    id: "erebor",
    name: "Erebor",
    kind: "fortress",
    region: "Rhovanion",
    x: 1732,
    y: 284,
    summary: "The Lonely Mountain, dwarf-kingdom of Durin's folk in the north-east.",
    details: [
      "Its singular shape makes it a natural anchor for the far north-east of the map.",
      "The app treats it as both mountain and fortress because the city is within the peak."
    ],
    aliases: ["Lonely Mountain"],
    emphasis: "major"
  },
  {
    id: "longbeard-halls",
    name: "Longbeard Halls",
    kind: "fortress",
    region: "Erebor",
    x: 1738,
    y: 296,
    summary: "The inner royal halls of Durin's folk within Erebor, representing the great dwarf chambers remembered in The Hobbit and its film imagery.",
    details: [
      "This POI marks the inhabited and ceremonial interior of the Lonely Mountain rather than the mountain's outer silhouette alone.",
      "It also gives Erebor a more granular city-fortress structure for search and selection."
    ],
    aliases: ["Longbeard House", "Durin's Halls"]
  },
  {
    id: "longbeard-terrace",
    name: "Longbeard Terrace",
    kind: "landmark",
    region: "Erebor",
    x: 1716,
    y: 312,
    summary: "A terrace landmark for Erebor's stepped outer works and courts, inspired by the mountain kingdom's adaptation-facing architecture.",
    details: [
      "This marker gives the Lonely Mountain more than a single pin by highlighting the visible terraces and approaches shown around the gates and ledges.",
      "It is especially useful when exploring Erebor alongside Dale and Long Lake."
    ],
    aliases: ["Erebor Terrace"]
  },
  {
    id: "mount-gundabad",
    name: "Mount Gundabad",
    kind: "mountain",
    region: "Northern Misty Mountains",
    x: 1294,
    y: 292,
    summary: "An ancient dwarf-holy mountain later held by Orcs in the north.",
    details: [
      "Its inclusion broadens the atlas beyond the immediate War of the Ring campaign.",
      "It also helps articulate the northern head of the Misty Mountains."
    ],
    aliases: ["Gundabad"]
  }
];

export const ALL_FEATURES: SearchableFeature[] = [
  ...LAKES,
  ...FORESTS,
  ...MOUNTAIN_RANGES,
  ...RIVERS,
  ...ROADS,
  ...POINTS
];

export const REGION_LABELS = [
  { name: "Lindon", x: 170, y: 248 },
  { name: "Eriador", x: 640, y: 394 },
  { name: "The Shire", x: 360, y: 490 },
  { name: "Misty Mountains", x: 1200, y: 470 },
  { name: "Rhovanion", x: 1590, y: 240 },
  { name: "Mirkwood", x: 1580, y: 590 },
  { name: "Rohan", x: 1180, y: 1230 },
  { name: "Gondor", x: 1540, y: 1160 },
  { name: "Mordor", x: 1870, y: 1110 },
  { name: "Bay of Belfalas", x: 1616, y: 1380 },
  { name: "Sea of Rhûn", x: 2040, y: 420 }
] as const;
