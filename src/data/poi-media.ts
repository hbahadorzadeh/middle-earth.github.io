export type StoredPoiSlide = {
  type: "stored";
  src: string;
  title: string;
  caption: string;
  sourceHref: string;
  attribution: string;
  license: string;
};

type MediaGroup = readonly StoredPoiSlide[];

const SHIRE_SLIDES: MediaGroup = [
  {
    type: "stored",
    src: "/poi/shire/hobbiton-lanes.jpg",
    title: "Hobbiton lanes",
    caption: "A spring view across the Hobbiton set in Matamata, often used as a real-world visual shorthand for the Shire.",
    sourceHref:
      "https://commons.wikimedia.org/wiki/File:Hobbiton_Movie_Set,_Matamata,_New_Zealand_2016_(50796595363).jpg",
    attribution: "Joe Ross / Wikimedia Commons",
    license: "CC BY-SA 2.0"
  },
  {
    type: "stored",
    src: "/poi/shire/hobbit-hole-hillside.jpg",
    title: "Hobbit-hole hillside",
    caption: "A wider Hobbiton hillside scene with multiple smials and pasture lines.",
    sourceHref:
      "https://commons.wikimedia.org/wiki/File:Hobbiton_Movie_Set,_Matamata,_New_Zealand_2016_(50796549863).jpg",
    attribution: "Joe Ross / Wikimedia Commons",
    license: "CC BY-SA 2.0"
  },
  {
    type: "stored",
    src: "/poi/shire/shire-detail.jpg",
    title: "Shire detail",
    caption: "A closer look at the Hobbiton movie set used as a texture reference for Shire-adjacent locations.",
    sourceHref:
      "https://commons.wikimedia.org/wiki/File:At_Hobbiton_(38)_(25985235343).jpg",
    attribution: "Kristina D.C. Hoeppner / Wikimedia Commons",
    license: "CC BY-SA 2.0"
  }
];

const RIVENDELL_SLIDES: MediaGroup = [
  {
    type: "stored",
    src: "/poi/rivendell/rivendell-archway.jpg",
    title: "Rivendell archway",
    caption: "The Kaitoke Regional Park Rivendell archway installed near the filming site.",
    sourceHref: "https://commons.wikimedia.org/wiki/File:Rivendell_(2).jpg",
    attribution: "Kigsz / Wikimedia Commons",
    license: "CC BY-SA 4.0"
  },
  {
    type: "stored",
    src: "/poi/rivendell/valley-entrance.jpg",
    title: "Valley entrance",
    caption: "Another Rivendell filming-site marker used as a visual cue for the hidden valley.",
    sourceHref: "https://commons.wikimedia.org/wiki/File:Rivendell_(3).jpg",
    attribution: "Kigsz / Wikimedia Commons",
    license: "CC BY-SA 4.0"
  }
];

const GREY_HAVENS_SLIDES: MediaGroup = [
  {
    type: "stored",
    src: "/poi/grey-havens/mapa-de-lindon.jpg",
    title: "Lindon and the western havens",
    caption: "A Lindon-focused map image used here to ground the Grey Havens within the western coastal realm.",
    sourceHref: "https://commons.wikimedia.org/wiki/File:Mapa_de_Lindon.jpg",
    attribution: "Wikimedia Commons contributor",
    license: "Commons free license"
  }
];

const GONDOR_SLIDES: MediaGroup = [
  {
    type: "stored",
    src: "/poi/gondor/minas-tirith-rendering.jpg",
    title: "Minas Tirith rendering",
    caption: "A fan-made 3D rendering of Minas Tirith, used here as a white-city visual reference.",
    sourceHref: "https://commons.wikimedia.org/wiki/File:Minas_Tirith.jpg",
    attribution: "Johnbuchta / Wikimedia Commons",
    license: "CC BY-SA 3.0"
  },
  {
    type: "stored",
    src: "/poi/gondor/seven-walls-concept.jpg",
    title: "Seven walls concept",
    caption: "Another free-licensed model image of Minas Tirith emphasizing the tiered structure and citadel.",
    sourceHref: "https://commons.wikimedia.org/wiki/File:Minas_Tirith_wiki0000.jpg",
    attribution: "BigSharkX / Wikimedia Commons",
    license: "CC BY-SA 3.0"
  }
];

const ISENGARD_SLIDES: MediaGroup = [
  {
    type: "stored",
    src: "/poi/isengard/orthanc.svg",
    title: "Orthanc silhouette",
    caption: "A clean vector rendering of Orthanc, the tower at the heart of Isengard.",
    sourceHref: "https://commons.wikimedia.org/wiki/File:Orthanc.svg",
    attribution: "Wikimedia Commons contributor",
    license: "Commons free license"
  },
  {
    type: "stored",
    src: "/poi/isengard/gandalf-rescued-from-orthanc.jpg",
    title: "Gandalf's escape from Orthanc",
    caption: "A free-licensed illustration of Gwaihir carrying Gandalf from Orthanc.",
    sourceHref:
      "https://commons.wikimedia.org/wiki/File:Gwaihir_the_Eagle_rescues_Gandalf_from_Orthanc_by_Alexander_Korotich.jpg",
    attribution: "Alexander Korotich / Wikimedia Commons",
    license: "CC BY-SA 3.0"
  }
];

const MORIA_SLIDES: MediaGroup = [
  {
    type: "stored",
    src: "/poi/moria/fellowship-in-moria.jpg",
    title: "The Fellowship in Moria",
    caption: "A free-licensed illustration of the Fellowship moving through the halls of Khazad-dûm.",
    sourceHref:
      "https://commons.wikimedia.org/wiki/File:The_Fellowship_of_the_Ring_in_Moria_by_Alexander_Korotich.jpg",
    attribution: "Alexander Korotich / Wikimedia Commons",
    license: "CC BY-SA 3.0"
  },
  {
    type: "stored",
    src: "/poi/moria/gandalf-balrog-bridge.jpg",
    title: "Bridge of Khazad-dûm",
    caption: "A free-licensed image of Gandalf confronting the Balrog on the bridge of Khazad-dûm.",
    sourceHref:
      "https://commons.wikimedia.org/wiki/File:Gandalf_fighting_the_Balrog_on_the_bridge_of_Khazad-d%C3%BBm.jpg",
    attribution: "Wikimedia Commons contributor",
    license: "Commons free license"
  }
];

const LORIEN_SLIDES: MediaGroup = [
  {
    type: "stored",
    src: "/poi/lorien/lothlorien.jpg",
    title: "Lothlórien woodland",
    caption: "A free-licensed image of Lothlórien used here as a reference for the Golden Wood and Caras Galadhon.",
    sourceHref: "https://commons.wikimedia.org/wiki/File:Lothlorien.jpg",
    attribution: "Wikimedia Commons contributor",
    license: "Commons free license"
  }
];

const FANGORN_SLIDES: MediaGroup = [
  {
    type: "stored",
    src: "/poi/fangorn/beardtree-in-fangorn.jpeg",
    title: "Fangorn atmosphere",
    caption: "A Fangorn-themed image used to give the Entwood a distinct visual mood in the selected-place gallery.",
    sourceHref: "https://commons.wikimedia.org/wiki/File:Beardtree_In_Fangorn_(19169349).jpeg",
    attribution: "Wikimedia Commons contributor",
    license: "Commons free license"
  }
];

const MIRKWOOD_SLIDES: MediaGroup = [
  {
    type: "stored",
    src: "/poi/mirkwood/mirkwood-entrance.jpg",
    title: "Mirkwood entrance",
    caption: "A free-licensed Mirkwood image used for the forest, the Woodland Realm, and nearby northern forest POIs.",
    sourceHref: "https://commons.wikimedia.org/wiki/File:Mirkwood_-_entrance.jpg",
    attribution: "Wikimedia Commons contributor",
    license: "Commons free license"
  }
];

const EREBOR_SLIDES: MediaGroup = [
  {
    type: "stored",
    src: "/poi/erebor/lonely-mountain.jpg",
    title: "Lonely Mountain",
    caption: "A free-licensed image of the Lonely Mountain used for Erebor and the nearby Long Lake world.",
    sourceHref: "https://commons.wikimedia.org/wiki/File:LonelyMountain.jpg",
    attribution: "Wikimedia Commons contributor",
    license: "Commons free license"
  }
];

const BOMBADIL_SLIDES: MediaGroup = [
  {
    type: "stored",
    src: "/poi/bombadil/tom-bombadil-old-man-willow.jpg",
    title: "Tom Bombadil and Old Man Willow",
    caption: "A free-licensed illustration of Tom Bombadil rescuing the hobbits from Old Man Willow.",
    sourceHref:
      "https://commons.wikimedia.org/wiki/File:Tom_Bombadil_frees_the_Hobbits_from_Old_Man_Willow.jpg",
    attribution: "Wikimedia Commons contributor",
    license: "Commons free license"
  }
];

const EDORAS_SLIDES: MediaGroup = [
  {
    type: "stored",
    src: "/poi/rohan/edoras-outlook.jpg",
    title: "Edoras outlook",
    caption: "The view from Mount Sunday, used as the cinematic setting for Edoras.",
    sourceHref:
      "https://commons.wikimedia.org/wiki/File:View_from_the_Mt_Edoras_in_LOTR_(5755748035).jpg",
    attribution: "lifacolor / Wikimedia Commons",
    license: "CC BY 2.0"
  }
];

const HELMS_DEEP_SLIDES: MediaGroup = [
  {
    type: "stored",
    src: "/poi/helms-deep/battle-of-helms-deep.svg",
    title: "Battle illustration",
    caption: "A modern free-licensed diagram of the Battle of Helm's Deep.",
    sourceHref: "https://commons.wikimedia.org/wiki/File:Battle_of_Helm%27s_Deep.svg",
    attribution: "Chiswick Chap / Wikimedia Commons",
    license: "CC BY-SA 4.0"
  }
];

const MORDOR_SLIDES: MediaGroup = [
  {
    type: "stored",
    src: "/poi/mordor/barad-dur-illustration.svg",
    title: "Barad-dûr illustration",
    caption: "A free-licensed vector illustration of the Dark Tower.",
    sourceHref: "https://commons.wikimedia.org/wiki/File:Barad-d%C3%BBr.svg",
    attribution: "Rondador / Wikimedia Commons",
    license: "CC BY 3.0"
  },
  {
    type: "stored",
    src: "/poi/mordor/dark-tower-rendering.jpg",
    title: "Dark Tower rendering",
    caption: "A second Barad-dûr rendering often used in fan encyclopedias and commons pages.",
    sourceHref: "https://commons.wikimedia.org/wiki/File:Barad_dur.jpg",
    attribution: "Sophocle / Wikimedia Commons",
    license: "CC BY-SA 3.0"
  },
  {
    type: "stored",
    src: "/poi/mordor/mount-doom-landscape.jpg",
    title: "Mount Doom landscape",
    caption: "Mount Ngauruhoe, the real-world volcanic landmark associated with cinematic Mount Doom.",
    sourceHref: "https://commons.wikimedia.org/wiki/File:Mount_Doom_(52299850350).jpg",
    attribution: "Geoff McKay / Wikimedia Commons",
    license: "CC BY 2.0"
  }
];

const WEATHERTOP_SLIDES: MediaGroup = [
  {
    type: "stored",
    src: "/poi/weathertop/amon-sul-illustration.png",
    title: "Amon Sûl illustration",
    caption: "A simple free-licensed illustration of the ruins of Amon Sûl used as a visual stand-in for Weathertop.",
    sourceHref: "https://commons.wikimedia.org/wiki/File:Amon_S%C3%BBl.png",
    attribution: "Wikimedia Commons contributor",
    license: "Commons free license"
  }
];

export const FEATURE_MEDIA_GROUPS: Record<string, MediaGroup> = {
  hobbiton: SHIRE_SLIDES,
  "michel-delving": SHIRE_SLIDES,
  bucklebury: SHIRE_SLIDES,
  "grey-havens": GREY_HAVENS_SLIDES,
  "tom-bombadils-house": BOMBADIL_SLIDES,
  "old-man-willow": BOMBADIL_SLIDES,
  "barrow-downs": BOMBADIL_SLIDES,
  "old-forest": BOMBADIL_SLIDES,
  rivendell: RIVENDELL_SLIDES,
  moria: MORIA_SLIDES,
  "durins-door": MORIA_SLIDES,
  mirrormere: MORIA_SLIDES,
  "dimrill-dale": MORIA_SLIDES,
  lorien: LORIEN_SLIDES,
  "caras-galadhon": LORIEN_SLIDES,
  fangorn: FANGORN_SLIDES,
  isengard: ISENGARD_SLIDES,
  orthanc: ISENGARD_SLIDES,
  "minas-tirith": GONDOR_SLIDES,
  osgiliath: GONDOR_SLIDES,
  "cair-andros": GONDOR_SLIDES,
  pelargir: GONDOR_SLIDES,
  erech: GONDOR_SLIDES,
  edoras: EDORAS_SLIDES,
  dunharrow: EDORAS_SLIDES,
  "helms-deep": HELMS_DEEP_SLIDES,
  mirkwood: MIRKWOOD_SLIDES,
  "woodland-realm": MIRKWOOD_SLIDES,
  "dol-guldur": MIRKWOOD_SLIDES,
  "long-lake": EREBOR_SLIDES,
  esgaroth: EREBOR_SLIDES,
  dale: EREBOR_SLIDES,
  erebor: EREBOR_SLIDES,
  "longbeard-halls": EREBOR_SLIDES,
  "longbeard-terrace": EREBOR_SLIDES,
  "mount-gundabad": EREBOR_SLIDES,
  "barad-dur": MORDOR_SLIDES,
  "mount-doom": MORDOR_SLIDES,
  "minas-morgul": MORDOR_SLIDES,
  "cirith-ungol": MORDOR_SLIDES,
  morannon: MORDOR_SLIDES,
  "dead-marshes": MORDOR_SLIDES,
  "amon-sul": WEATHERTOP_SLIDES
};
