#!/usr/bin/env python3
"""
Download Middle-earth reference images into per-location folders under public/poi.

Requirements:
    Python 3.10+
    pip install -U ddgs requests

Output:
    ./
        grey-havens/
        hobbiton/
        ...
        metadata.json
"""

from __future__ import annotations

import hashlib
import json
import mimetypes
import re
import sys
import time
from pathlib import Path
from typing import Dict, List

import requests
from ddgs import DDGS


# ---------- CONFIG ----------

OUTPUT_DIR = Path(__file__).resolve().parent
IMAGES_PER_LOCATION = 8          # final files saved per landmark
SEARCH_MULTIPLIER = 4            # fetch extra results to survive bad links/dupes
REQUEST_TIMEOUT = 30
PAUSE_BETWEEN_DOWNLOADS = 0.5
PAUSE_BETWEEN_LOCATIONS = 1.0

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/124.0 Safari/537.36"
    )
}

# Full landmark list from your prompt.
LANDMARK_QUERIES: Dict[str, str] = {
    "argonath": "Argonath king statues Tolkien art harbor elven ships",
    "grey-havens": "Grey Havens Mithlond Tolkien art harbor elven ships",
    "hobbiton": "Hobbiton The Shire Tolkien art hobbit holes hills",
    "michel-delving": "Michel Delving Shire Tolkien art Mathom House",
    "bucklebury": "Bucklebury Buckland Brandywine Tolkien art ferry",
    "tom-bombadils-house": "Tom Bombadil house Tolkien art Old Forest Goldberry",
    "old-man-willow": "Old Man Willow Tolkien art Old Forest tree",
    "barrow-downs": "Barrow-downs Tolkien art burial mounds fog",
    "bree": "Bree Tolkien art Prancing Pony hill town",
    "fornost": "Fornost Tolkien art ruins Arnor",
    "annuminas": "Annuminas Tolkien art Lake Evendim ruins",
    "amon-sul": "Amon Sul Weathertop Tolkien art ruins hill",
    "last-bridge": "Last Bridge Trollshaws Tolkien art stone bridge",
    "rivendell": "Rivendell Tolkien art hidden valley waterfalls terraces",
    "tharbad": "Tharbad Tolkien art ruins Greyflood swamp bridge",
    "moria": "Moria Khazad-dum Tolkien art dwarven halls pillars",
    "durins-door": "Durin's Door West-gate Moria Tolkien art",
    "mirrormere": "Mirrormere Kheled-zaram Tolkien art lake reflection",
    "dimrill-dale": "Dimrill Dale Tolkien art waterfall valley",
    "hollin": "Hollin Eregion Tolkien art ruins holly trees",
    "caradhras": "Caradhras Redhorn Tolkien art snowy pass",
    "caras-galadhon": "Caras Galadhon Tolkien art Lothlorien tree city",
    "parth-galen": "Parth Galen Tolkien art Anduin river clearing",
    "amon-hen": "Amon Hen Tolkien art seat of seeing hill",
    "rauros": "Rauros Tolkien art Anduin great falls",
    "isengard": "Isengard Tolkien art ring wall Orthanc",
    "orthanc": "Orthanc Tolkien art black tower Isengard",
    "treebeards-hall": "Treebeard hall Fangorn Tolkien art ents dwelling forest house",
    "wellinghall": "Wellinghall Fangorn Tolkien art Treebeard house ents dwelling",
    "entmoot": "Entmoot Derndingle Fangorn Tolkien art ents gathering",
    "helms-deep": "Helm's Deep Hornburg Tolkien art fortress wall",
    "edoras": "Edoras Meduseld Tolkien art hill city Rohan",
    "dunharrow": "Dunharrow Tolkien art mountain refuge Paths of the Dead",
    "minas-tirith": "Minas Tirith Tolkien art white city tiers",
    "cair-andros": "Cair Andros Tolkien art island fortress Anduin",
    "osgiliath": "Osgiliath Tolkien art ruined bridges Gondor",
    "minas-morgul": "Minas Morgul Tolkien art cursed city green glow",
    "cirith-ungol": "Cirith Ungol Tolkien art tower pass Mordor",
    "morannon": "Morannon Black Gate Tolkien art Mordor gate",
    "barad-dur": "Barad-dur Tolkien art dark tower Mordor",
    "mount-doom": "Mount Doom Orodruin Tolkien art volcano Mordor",
    "dead-marshes": "Dead Marshes Tolkien art swamp lights Mordor",
    "pelargir": "Pelargir Tolkien art Gondor harbor ships",
    "dol-amroth": "Dol Amroth Tolkien art swan city cliff harbor",
    "erech": "Stone of Erech Tolkien art black stone hill",
    "dol-guldur": "Dol Guldur Tolkien art dark fortress Mirkwood",
    "woodland-realm": "Woodland Realm Thranduil halls Tolkien art",
    "beorns-hall": "Beorn's Hall Tolkien art house Carrock",
    "dale": "Dale Tolkien art city under Erebor",
    "esgaroth": "Esgaroth Lake-town Tolkien art wooden stilt town",
    "erebor": "Erebor Lonely Mountain Tolkien art front gate",
    "longbeard-halls": "Erebor dwarven halls Tolkien art interior columns",
    "longbeard-terrace": "Erebor terrace Tolkien art dwarven terrace mountain city",
    "mount-gundabad": "Mount Gundabad Tolkien art orc fortress mountain",
}


# ---------- HELPERS ----------

def sanitize_filename(name: str) -> str:
    return re.sub(r"[^a-zA-Z0-9._-]+", "_", name).strip("_")


def ensure_dir(path: Path) -> None:
    path.mkdir(parents=True, exist_ok=True)


def file_extension_from_response(resp: requests.Response, url: str) -> str:
    content_type = (resp.headers.get("Content-Type") or "").split(";")[0].strip().lower()
    guessed = mimetypes.guess_extension(content_type) if content_type else None

    if guessed in {".jpe", ".jpeg"}:
        return ".jpg"
    if guessed in {".jpg", ".png", ".gif", ".webp", ".bmp", ".tiff"}:
        return guessed

    # Fall back to URL suffix if Content-Type is missing or weird.
    lower_url = url.lower()
    for ext in (".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp", ".tif", ".tiff"):
        if ext in lower_url:
            return ".jpg" if ext == ".jpeg" else ext

    return ".jpg"


def sha1_bytes(data: bytes) -> str:
    return hashlib.sha1(data).hexdigest()


def search_images(query: str, max_results: int) -> List[dict]:
    # Current ddgs docs expose DDGS().images(...), returning image result dicts.
    with DDGS() as ddgs:
        results = ddgs.images(
            query=query,
            region="wt-wt",
            safesearch="off",
            max_results=max_results,
        )
    return results or []


def download_image(session: requests.Session, url: str) -> tuple[bytes, str] | None:
    if not url.startswith(("http://", "https://")):
        return None

    try:
        resp = session.get(url, timeout=REQUEST_TIMEOUT, stream=True)
        resp.raise_for_status()

        content_type = (resp.headers.get("Content-Type") or "").lower()
        if "image" not in content_type and not re.search(r"\.(jpg|jpeg|png|gif|webp|bmp|tif|tiff)(\?|$)", url, re.I):
            return None

        data = resp.content
        if not data:
            return None

        ext = file_extension_from_response(resp, url)
        return data, ext
    except requests.RequestException:
        return None


def save_location_images(location: str, query: str, session: requests.Session) -> dict:
    location_dir = OUTPUT_DIR / location
    ensure_dir(location_dir)

    wanted = IMAGES_PER_LOCATION
    fetched_results = search_images(query, max_results=wanted * SEARCH_MULTIPLIER)

    saved = []
    seen_hashes = set()
    seen_urls = set()

    for idx, item in enumerate(fetched_results, start=1):
        if len(saved) >= wanted:
            break

        image_url = item.get("image")
        page_url = item.get("url")
        title = item.get("title") or f"{location}_{idx}"

        if not image_url or image_url in seen_urls:
            continue
        seen_urls.add(image_url)

        downloaded = download_image(session, image_url)
        if downloaded is None:
            continue

        data, ext = downloaded
        digest = sha1_bytes(data)
        if digest in seen_hashes:
            continue
        seen_hashes.add(digest)

        filename = f"{len(saved)+1:02d}_{sanitize_filename(title)[:80]}{ext}"
        filepath = location_dir / filename

        with open(filepath, "wb") as f:
            f.write(data)

        saved.append(
            {
                "file": str(filepath.as_posix()),
                "title": title,
                "image_url": image_url,
                "page_url": page_url,
                "query": query,
            }
        )

        print(f"[{location}] saved {filepath.name}")
        time.sleep(PAUSE_BETWEEN_DOWNLOADS)

    return {
        "location": location,
        "query": query,
        "saved_count": len(saved),
        "items": saved,
    }


# ---------- MAIN ----------

def main() -> int:
    ensure_dir(OUTPUT_DIR)

    requested_locations = sys.argv[1:]
    if requested_locations:
        unknown = [location for location in requested_locations if location not in LANDMARK_QUERIES]
        if unknown:
          print(f"Unknown location id(s): {', '.join(unknown)}", file=sys.stderr)
          return 1
        locations_to_fetch = {
            location: LANDMARK_QUERIES[location] for location in requested_locations
        }
    else:
        locations_to_fetch = LANDMARK_QUERIES

    session = requests.Session()
    session.headers.update(HEADERS)

    metadata = {
        "output_dir": str(OUTPUT_DIR),
        "images_per_location_target": IMAGES_PER_LOCATION,
        "locations": [],
    }

    total_saved = 0

    for i, (location, query) in enumerate(locations_to_fetch.items(), start=1):
        print(f"\n=== [{i}/{len(locations_to_fetch)}] {location} ===")
        result = save_location_images(location, query, session)
        metadata["locations"].append(result)
        total_saved += result["saved_count"]
        time.sleep(PAUSE_BETWEEN_LOCATIONS)

    metadata_path = OUTPUT_DIR / "metadata.json"
    with open(metadata_path, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2, ensure_ascii=False)


    print("\nDone.")
    print(f"Total images saved: {total_saved}")
    print(f"Metadata: {metadata_path}")

    return 0


if __name__ == "__main__":
    sys.exit(main())
