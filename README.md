# Middle-earth Atlas

A Next.js app that behaves like a fantasy Google Maps interface for Tolkien's world:

- Tiled reference atlas artwork with a calibrated SVG interaction layer
- Search across places, terrain, rivers, and named roads
- Clickable points of interest with lore-rich detail cards
- Comparison overlays for sketch and political reference maps
- Pan by drag, zoom with the wheel or on-map buttons, and rotate with a compass reset

## Run

```bash
npm install
npm run dev
```

## Docker

Build and run the production image:

```bash
docker build --load -t middle-earth-atlas .
docker run --rm -p 3000:3000 middle-earth-atlas
```

Or use Compose:

```bash
docker compose up --build
```

## Reference Basis

This atlas now uses downloaded reference maps inside the app and calibrates the SVG interaction layer against them.

Included assets:

- `public/maps/mapome.png` and generated tiles in `public/maps/tiles/base`
- `public/maps/mapome-slim.svg`
- `public/maps/sketch-reference.svg`
- `public/maps/political-reference.svg`

To regenerate the atlas tile pyramid from the full source image:

```bash
./scripts/generate-map-tiles.sh
```

Reference lineage:

- Christopher Tolkien's published Middle-earth maps
- Pauline Baynes' poster map and Tolkien's annotated additions
- Geographic relationships described in `The Hobbit` and `The Lord of the Rings`
