import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { ALL_FEATURES } from "../src/data/middle-earth.ts";

const OUTPUT_DIR = path.resolve("public/poi/generated");
const WIDTH = 960;
const HEIGHT = 600;
const ORIGIN_X = 480;
const ORIGIN_Y = 350;
const ISO_X = 20;
const ISO_Y = 10;

await mkdir(OUTPUT_DIR, { recursive: true });

for (const feature of ALL_FEATURES) {
  const svg = renderFeature(feature);
  await writeFile(path.join(OUTPUT_DIR, `${feature.id}.svg`), svg, "utf8");
}

function iso(x, y, z = 0) {
  return {
    x: ORIGIN_X + (x - y) * ISO_X,
    y: ORIGIN_Y + (x + y) * ISO_Y - z
  };
}

function pointsToString(points) {
  return points.map((point) => `${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(" ");
}

function polygon(points, fill, extra = "") {
  return `<polygon points="${pointsToString(points)}" fill="${fill}" ${extra} />`;
}

function prism(x, y, width, depth, height, colors) {
  const a = iso(x, y, 0);
  const b = iso(x + width, y, 0);
  const c = iso(x + width, y + depth, 0);
  const d = iso(x, y + depth, 0);
  const at = iso(x, y, height);
  const bt = iso(x + width, y, height);
  const ct = iso(x + width, y + depth, height);
  const dt = iso(x, y + depth, height);

  return [
    polygon([a, d, dt, at], colors.left),
    polygon([a, b, bt, at], colors.right),
    polygon([at, bt, ct, dt], colors.top)
  ].join("");
}

function pyramid(x, y, width, depth, height, colors) {
  const a = iso(x, y, 0);
  const b = iso(x + width, y, 0);
  const c = iso(x + width, y + depth, 0);
  const d = iso(x, y + depth, 0);
  const apex = iso(x + width / 2, y + depth / 2, height);

  return [
    polygon([a, d, apex], colors.left),
    polygon([a, b, apex], colors.right),
    polygon([b, c, apex], colors.front)
  ].join("");
}

function shadow(x, y, width, depth, length = 7, opacity = 0.16) {
  const a = iso(x + width, y, 0);
  const b = iso(x + width + length, y + 1.3, 0);
  const c = iso(x + width + length, y + depth + 1.3, 0);
  const d = iso(x + width, y + depth, 0);
  return polygon([a, b, c, d], `rgba(65,76,90,${opacity})`);
}

function cylinderStack(cx, cy, radius, levels, levelHeight, colors) {
  const parts = [];
  for (let index = 0; index < levels; index += 1) {
    const scale = 1 - index * 0.14;
    const w = radius * scale * 2;
    const d = radius * scale * 1.35;
    const h = levelHeight * (index + 1);
    parts.push(prism(cx - w / 2, cy - d / 2, w, d, h, colors));
  }
  return parts.join("");
}

function treeCluster(startX, startY, count, spacing, variance = 0) {
  const trees = [];
  for (let index = 0; index < count; index += 1) {
    const x = startX + (index % 5) * spacing;
    const y = startY + Math.floor(index / 5) * (spacing - 0.25);
    const height = 60 + ((index * 13 + variance) % 28);
    trees.push(
      prism(x + 0.35, y + 0.2, 0.3, 0.3, 18, {
        top: "#8a8f90",
        left: "#7a7f80",
        right: "#919698"
      }) +
        pyramid(x, y, 1.2, 1.2, height, {
          left: "#a3a7a8",
          right: "#c3c7c8",
          front: "#8b8f90"
        })
    );
  }
  return trees.join("");
}

function titleBlock(feature) {
  return `
    <g>
      <text x="64" y="500" fill="#55606b" font-size="22" font-family="Avenir Next, Arial, sans-serif" letter-spacing="4">GENERATED LANDMARK RENDER</text>
      <text x="64" y="548" fill="#7a838a" font-size="18" font-family="Avenir Next, Arial, sans-serif" letter-spacing="3">${escapeXml(feature.region.toUpperCase())}</text>
      <text x="64" y="582" fill="#8e979c" font-size="42" font-family="Georgia, Baskerville, serif">${escapeXml(feature.name)}</text>
    </g>
  `;
}

function skyAndGround() {
  const ground = [
    { x: 120, y: 445 },
    { x: 840, y: 445 },
    { x: 920, y: 600 },
    { x: 40, y: 600 }
  ];

  return `
    <rect width="${WIDTH}" height="${HEIGHT}" fill="#d9dde0" />
    <polygon points="${pointsToString(ground)}" fill="#c7ccd0" />
    <polygon points="0,0 960,0 960,180 0,230" fill="rgba(255,255,255,0.26)" />
  `;
}

function backdrop(kind) {
  if (kind === "mountain" || kind === "pass") {
    return `
      ${pyramid(6, 2, 10, 8, 230, { left: "#bbc0c3", right: "#d0d4d7", front: "#aab0b4" })}
      ${pyramid(14, 0, 9, 9, 210, { left: "#c2c7ca", right: "#d6dade", front: "#b0b6ba" })}
    `;
  }

  if (kind === "lake" || kind === "river") {
    return `
      ${pyramid(10, 1, 8, 7, 120, { left: "#c4c8cb", right: "#dadde0", front: "#b6bcc0" })}
    `;
  }

  return `
    ${pyramid(8, 1, 7, 6, 150, { left: "#c2c6c8", right: "#d7dbde", front: "#afb5b9" })}
    ${pyramid(15, 1.5, 6.5, 6, 120, { left: "#cbd0d3", right: "#e0e3e5", front: "#b7bdc1" })}
  `;
}

function sceneFor(feature) {
  const id = feature.id;

  if (id === "minas-tirith" || id === "minas-morgul") {
    return shadow(6, 6, 10, 8, 9, 0.18) +
      cylinderStack(10.5, 10.5, 4.8, 4, 22, {
        top: "#dfe2e3",
        left: "#b2b8bc",
        right: "#c5cbcf"
      }) +
      prism(8.7, 8.4, 3.2, 2.2, 165, {
        top: "#d7dbdd",
        left: "#a4abb0",
        right: "#bcc3c7"
      }) +
      prism(5.6, 12, 9.5, 1.6, 32, {
        top: "#d3d8da",
        left: "#aab1b5",
        right: "#bcc2c6"
      });
  }

  if (id === "orthanc" || id === "isengard") {
    return shadow(9, 8, 3.4, 3.4, 10, 0.2) +
      prism(7, 6, 9, 9, 18, {
        top: "#d6dadd",
        left: "#b1b7ba",
        right: "#c4c9cc"
      }) +
      prism(10.25, 9.25, 2.2, 2.2, 220, {
        top: "#d8dcde",
        left: "#8c949a",
        right: "#a6adb3"
      }) +
      prism(9.6, 8.6, 3.5, 3.5, 40, {
        top: "#d0d4d7",
        left: "#9ca4ab",
        right: "#b7bdc1"
      });
  }

  if (id === "moria" || id === "durins-door" || id === "mirrormere" || id === "dimrill-dale") {
    return `
      ${pyramid(7, 2, 7, 9, 220, { left: "#afb5b8", right: "#d3d7da", front: "#9ea5a9" })}
      ${pyramid(14, 1.8, 7, 9, 210, { left: "#b9bec1", right: "#d9dde0", front: "#a9afb3" })}
      <polygon points="318,406 444,380 506,410 378,434" fill="#8f989f" />
      <rect x="406" y="348" width="34" height="48" fill="#dde1e4" />
      <rect x="414" y="356" width="18" height="32" fill="#aab2b7" />
      <ellipse cx="612" cy="430" rx="92" ry="30" fill="#b8c2ca" opacity="0.9" />
    `;
  }

  if (id === "erebor" || id === "longbeard-halls" || id === "longbeard-terrace" || id === "mount-gundabad") {
    return `
      ${pyramid(7, 1, 8, 9, 240, { left: "#afb5b8", right: "#d0d4d7", front: "#9da5a9" })}
      ${pyramid(13.5, 2.2, 7.5, 8.5, 210, { left: "#b5bbbf", right: "#d8dcdf", front: "#a5adb1" })}
      ${prism(11.2, 9.3, 4.6, 1.8, 42, { top: "#d8dcde", left: "#a8afb4", right: "#bec4c8" })}
      ${prism(11.8, 8.6, 3.3, 1.2, 78, { top: "#dfe2e4", left: "#adb4b9", right: "#c6ccd0" })}
      ${prism(10.7, 10.9, 5.6, 0.8, 18, { top: "#ced3d6", left: "#a2a9ae", right: "#b8c0c4" })}
    `;
  }

  if (id === "grey-havens" || feature.kind === "port") {
    return shadow(8, 9, 8, 4, 8, 0.18) +
      prism(7.8, 8.5, 8.8, 2.4, 30, {
        top: "#d7dbde",
        left: "#adb4b8",
        right: "#c3c9cd"
      }) +
      prism(8.4, 8.7, 1.1, 1.1, 96, {
        top: "#d9dddf",
        left: "#8f989f",
        right: "#a8b0b6"
      }) +
      prism(14.8, 9.2, 1.1, 1.1, 86, {
        top: "#d9dddf",
        left: "#939ba2",
        right: "#acb3b9"
      }) +
      `<polygon points="612,404 664,388 710,412 656,428" fill="#b8c7d1" />
       <polygon points="676,392 700,360 714,398" fill="#d6dcdf" />
       <polygon points="702,392 722,362 738,398" fill="#c2c9cd" />`;
  }

  if (id === "tom-bombadils-house" || id === "old-man-willow" || id === "barrow-downs") {
    return treeCluster(8.8, 6.5, 7, 1.9, 3) +
      prism(11.4, 9.4, 2.2, 2.2, 46, {
        top: "#e0d2c0",
        left: "#b89f83",
        right: "#cbb394"
      }) +
      pyramid(11, 9, 3, 3, 34, {
        left: "#8e9397",
        right: "#c3c8cb",
        front: "#767c82"
      }) +
      prism(9.2, 8.8, 0.8, 0.8, 78, {
        top: "#9ea4a8",
        left: "#787f84",
        right: "#b2b7ba"
      });
  }

  if (id === "fangorn") {
    return treeCluster(8, 6.2, 12, 1.8, 11) +
      prism(13.2, 9.4, 0.9, 0.9, 112, {
        top: "#a6abad",
        left: "#7d8388",
        right: "#b3b8ba"
      }) +
      pyramid(12.4, 8.6, 2.4, 2.4, 96, {
        left: "#9fa4a7",
        right: "#c6c9cb",
        front: "#8b9194"
      });
  }

  if (feature.kind === "forest") {
    return treeCluster(8.5, 6.2, 14, 1.8, 7);
  }

  if (feature.kind === "mountain" || feature.kind === "pass") {
    return `
      ${shadow(8, 7, 7, 6, 8, 0.14)}
      ${pyramid(8, 6, 7, 7, 210, { left: "#afb5b8", right: "#d2d7da", front: "#9ea5a9" })}
      ${pyramid(11.4, 7.5, 4, 4.2, 130, { left: "#b8bec1", right: "#dde0e2", front: "#aab1b4" })}
    `;
  }

  if (feature.kind === "lake") {
    return `
      ${pyramid(8, 2, 8, 7, 150, { left: "#bec3c6", right: "#dadde0", front: "#aeb4b8" })}
      <ellipse cx="520" cy="428" rx="160" ry="46" fill="#b3c0ca" />
      <ellipse cx="520" cy="426" rx="112" ry="28" fill="#d5dde2" opacity="0.62" />
    `;
  }

  if (feature.kind === "river") {
    return `
      ${pyramid(8, 2, 9, 6.5, 115, { left: "#c0c5c8", right: "#dadde0", front: "#afb5b8" })}
      <path d="M246 452 C334 430 408 468 494 444 C578 420 660 432 750 404" fill="none" stroke="#aebdca" stroke-width="36" stroke-linecap="round" />
      <path d="M250 452 C338 430 412 468 498 444 C582 420 664 432 754 404" fill="none" stroke="#d6dfe4" stroke-width="16" stroke-linecap="round" opacity="0.7" />
    `;
  }

  if (feature.kind === "road") {
    return `
      ${pyramid(9, 4, 7, 5.5, 90, { left: "#c2c6c9", right: "#dbdee0", front: "#b0b6b9" })}
      <path d="M314 468 C410 448 470 458 572 430 C654 408 702 384 758 348" fill="none" stroke="#8e959b" stroke-width="28" stroke-linecap="round" />
      <path d="M314 468 C410 448 470 458 572 430 C654 408 702 384 758 348" fill="none" stroke="#d8dbde" stroke-width="10" stroke-linecap="round" opacity="0.88" />
    `;
  }

  if (feature.kind === "city" || feature.kind === "fortress" || feature.kind === "ruin") {
    return shadow(8.8, 8.2, 7.8, 6, 8, 0.18) +
      prism(8.4, 8.2, 8.2, 5.8, 24, {
        top: "#d5dadd",
        left: "#adb4b8",
        right: "#c1c8cc"
      }) +
      prism(10.4, 9.1, 4.6, 3.2, feature.kind === "ruin" ? 58 : 92, {
        top: "#dbe0e2",
        left: "#9ca4ab",
        right: "#b8c0c5"
      }) +
      prism(9.4, 10.2, 1.2, 1.2, 58, {
        top: "#d0d6d9",
        left: "#a4abb0",
        right: "#bbc2c6"
      }) +
      prism(14.8, 10.4, 0.8, 0.8, 46, {
        top: "#d0d6d9",
        left: "#9aa2a8",
        right: "#b8bfc3"
      });
  }

  return shadow(9, 9, 6, 5, 6, 0.14) +
    prism(9.2, 8.8, 6, 5, 28, {
      top: "#d7dbde",
      left: "#aeb5b9",
      right: "#c2c8cc"
    }) +
    prism(11.2, 10, 2.3, 2.3, 76, {
      top: "#dfe2e4",
      left: "#a1a8ad",
      right: "#bbc2c6"
    });
}

function renderFeature(feature) {
  const scene = sceneFor(feature);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}" role="img" aria-label="${escapeXml(feature.name)} concept render">
      <defs>
        <filter id="soft-shadow" x="-20%" y="-20%" width="160%" height="160%">
          <feDropShadow dx="0" dy="18" stdDeviation="16" flood-color="#6b737a" flood-opacity="0.18" />
        </filter>
      </defs>
      ${skyAndGround()}
      <g filter="url(#soft-shadow)">
        ${backdrop(feature.kind)}
        ${scene}
      </g>
      ${titleBlock(feature)}
    </svg>
  `;

  return svg.trim();
}

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}
