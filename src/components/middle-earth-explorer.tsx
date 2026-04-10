"use client";

import { type CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import {
  ALL_FEATURES,
  DOWNLOADED_MAP_SOURCES,
  FEATURE_COORDINATE_OVERRIDES,
  MAP_TILE_LEVELS,
  OVERLAY_CALIBRATION,
  POINTS,
  REFERENCE_MAP_HEIGHT,
  REFERENCE_MAP_WIDTH,
  type MapTileLevel,
  type ReferenceMapSource,
  type SearchableFeature
} from "@/data/middle-earth";
import { POI_FOLDER_MEDIA } from "@/data/poi-folder-media";
import { withBasePath } from "@/lib/base-path";

type ComparisonId = Exclude<ReferenceMapSource["id"], "mapome">;

type ViewBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type ProjectedFeature = SearchableFeature & {
  mapX: number;
  mapY: number;
};

type MeasureSelection = [string | null, string | null];

type ContainerSize = {
  width: number;
  height: number;
};

type VisibleTile = {
  key: string;
  href: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

type LocalPoiSlide = {
  type: "local";
  src: string;
  title: string;
  caption: string;
  attribution: string;
  license: string;
  sourceLabel: string;
  objectPosition: string;
  presentation: "crop" | "render";
};

const INITIAL_VIEW: ViewBox = {
  x: 80,
  y: 60,
  width: 3040,
  height: 2280
};

const MIN_WIDTH = 520;
const MAX_WIDTH = REFERENCE_MAP_WIDTH;
const MAP_CENTER_X = REFERENCE_MAP_WIDTH / 2;
const MAP_CENTER_Y = REFERENCE_MAP_HEIGHT / 2;
const TILE_BUFFER = 2;
const MILES_PER_MAP_UNIT = 200 / (589.5 - 164.9);
const SCREEN_FIT_MAP_UNITS_PER_PIXEL = REFERENCE_MAP_WIDTH / MAP_TILE_LEVELS[2].pixelWidth;
const MAP_BOUNDS = {
  x: 360,
  y: 120,
  width: 2580,
  height: 2140
} as const;
const INITIAL_FOCUS = {
  x: 1680,
  y: 1320
};
const DETAILED_MARKER_OFFSET_Y = -34;

const COMPARISON_LAYOUTS: Record<
  ComparisonId,
  { x: number; y: number; width: number; aspectRatio: number }
> = {
  sketch: {
    x: -24,
    y: 74,
    width: 3172,
    aspectRatio: 208.27499 / 164.45357
  },
  political: {
    x: 474,
    y: 118,
    width: 2254,
    aspectRatio: 460.77039 / 511.45511
  }
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function clampViewBox(view: ViewBox): ViewBox {
  const width = clamp(view.width, MIN_WIDTH, Math.min(MAX_WIDTH, MAP_BOUNDS.width));
  const height = (width * INITIAL_VIEW.height) / INITIAL_VIEW.width;
  return {
    width,
    height,
    x: clamp(view.x, MAP_BOUNDS.x, MAP_BOUNDS.x + MAP_BOUNDS.width - width),
    y: clamp(view.y, MAP_BOUNDS.y, MAP_BOUNDS.y + MAP_BOUNDS.height - height)
  };
}

function markerFill(kind: SearchableFeature["kind"]) {
  switch (kind) {
    case "city":
      return "#c34d29";
    case "port":
      return "#1c6f8c";
    case "fortress":
      return "#7a2626";
    case "ruin":
      return "#85755c";
    case "mountain":
      return "#4b514d";
    case "forest":
      return "#376d41";
    case "lake":
      return "#2b789b";
    case "river":
      return "#2d7a9a";
    case "road":
      return "#9d6a28";
    case "pass":
      return "#875135";
    case "region":
      return "#606e4e";
    default:
      return "#a67c37";
  }
}

function getKindLabel(kind: SearchableFeature["kind"]) {
  switch (kind) {
    case "city":
      return "City";
    case "port":
      return "Port";
    case "fortress":
      return "Fortress";
    case "ruin":
      return "Ruin";
    case "road":
      return "Road";
    case "river":
      return "River";
    case "mountain":
      return "Mountain";
    case "forest":
      return "Forest";
    case "lake":
      return "Lake";
    case "region":
      return "Region";
    case "pass":
      return "Pass";
    default:
      return "Landmark";
  }
}

function projectFeature(
  feature: SearchableFeature,
  mode: "detailed" | "sketch"
): ProjectedFeature {
  const override = FEATURE_COORDINATE_OVERRIDES[feature.id];

  if (mode === "detailed" && override) {
    return {
      ...feature,
      mapX: override.x,
      mapY: override.y + DETAILED_MARKER_OFFSET_Y
    };
  }

  return {
    ...feature,
    mapX: feature.x * OVERLAY_CALIBRATION.scaleX + OVERLAY_CALIBRATION.offsetX,
    mapY: feature.y * OVERLAY_CALIBRATION.scaleY + OVERLAY_CALIBRATION.offsetY
  };
}

function comparisonButtonClass(isActive: boolean) {
  return isActive ? "sourceButton sourceButtonActive" : "sourceButton";
}

function pointRadius(feature: SearchableFeature) {
  if (feature.emphasis === "major") {
    return 14;
  }

  switch (feature.kind) {
    case "fortress":
      return 11;
    case "port":
      return 10;
    case "ruin":
      return 9;
    default:
      return 8;
  }
}

function niceMiles(rawMiles: number) {
  if (rawMiles <= 0) {
    return 0;
  }

  const exponent = 10 ** Math.floor(Math.log10(rawMiles));
  const fractions = [1, 2, 2.5, 5, 10];
  let best = exponent;

  for (const fraction of fractions) {
    const candidate = fraction * exponent;
    if (candidate <= rawMiles) {
      best = candidate;
    }
  }

  return best;
}

function formatMiles(distance: number) {
  if (distance >= 100) {
    return `${Math.round(distance)} mi`;
  }

  if (distance >= 10) {
    return `${distance.toFixed(1)} mi`;
  }

  return `${distance.toFixed(2)} mi`;
}

function formatKilometers(distanceInMiles: number) {
  const kilometers = distanceInMiles * 1.60934;
  if (kilometers >= 100) {
    return `${Math.round(kilometers)} km`;
  }

  if (kilometers >= 10) {
    return `${kilometers.toFixed(1)} km`;
  }

  return `${kilometers.toFixed(2)} km`;
}

function normalizeRotation(rotationDeg: number) {
  const normalized = rotationDeg % 180;
  return normalized < 0 ? normalized + 180 : normalized;
}

function expandedRenderBounds(view: ViewBox, rotationDeg: number) {
  const radians = (normalizeRotation(rotationDeg) * Math.PI) / 180;
  const acute = radians > Math.PI / 2 ? Math.PI - radians : radians;
  const cos = Math.abs(Math.cos(acute));
  const sin = Math.abs(Math.sin(acute));
  const paddedWidth = view.width * cos + view.height * sin;
  const paddedHeight = view.width * sin + view.height * cos;
  const padX = Math.max(0, (paddedWidth - view.width) / 2);
  const padY = Math.max(0, (paddedHeight - view.height) / 2);
  const x = Math.max(0, view.x - padX);
  const y = Math.max(0, view.y - padY);
  const right = Math.min(REFERENCE_MAP_WIDTH, view.x + view.width + padX);
  const bottom = Math.min(REFERENCE_MAP_HEIGHT, view.y + view.height + padY);

  return {
    x,
    y,
    width: right - x,
    height: bottom - y
  };
}

function chooseTileLevel(levels: readonly MapTileLevel[], screenWidth: number, viewWidth: number) {
  if (screenWidth <= 0) {
    return levels[1] ?? levels[0];
  }

  const screenPixelsPerMapUnit = screenWidth / viewWidth;
  return (
    levels.find(
      (level) => level.pixelWidth / REFERENCE_MAP_WIDTH >= screenPixelsPerMapUnit * 0.9
    ) ?? levels[levels.length - 1]
  );
}

function buildVisibleTiles(level: MapTileLevel, bounds: ViewBox): VisibleTile[] {
  const tileMapWidth = (level.tileSize / level.pixelWidth) * REFERENCE_MAP_WIDTH;
  const tileMapHeight = (level.tileSize / level.pixelHeight) * REFERENCE_MAP_HEIGHT;
  const columns = Math.ceil(level.pixelWidth / level.tileSize);
  const rows = Math.ceil(level.pixelHeight / level.tileSize);
  const startColumn = Math.max(0, Math.floor(bounds.x / tileMapWidth) - TILE_BUFFER);
  const endColumn = Math.min(
    columns - 1,
    Math.ceil((bounds.x + bounds.width) / tileMapWidth) + TILE_BUFFER
  );
  const startRow = Math.max(0, Math.floor(bounds.y / tileMapHeight) - TILE_BUFFER);
  const endRow = Math.min(
    rows - 1,
    Math.ceil((bounds.y + bounds.height) / tileMapHeight) + TILE_BUFFER
  );
  const tiles: VisibleTile[] = [];

  for (let row = startRow; row <= endRow; row += 1) {
    for (let column = startColumn; column <= endColumn; column += 1) {
      const x = column * tileMapWidth;
      const y = row * tileMapHeight;
      const width = Math.min(tileMapWidth, REFERENCE_MAP_WIDTH - x);
      const height = Math.min(tileMapHeight, REFERENCE_MAP_HEIGHT - y);

      tiles.push({
        key: `${level.id}-${row}-${column}`,
        href: withBasePath(`${level.path}/${row}-${column}.jpg`),
        x,
        y,
        width,
        height
      });
    }
  }

  return tiles;
}

function isMapControlTarget(target: EventTarget | null) {
  return target instanceof Element && target.closest("[data-map-control='true']") !== null;
}

function featureObjectPosition(feature: ProjectedFeature) {
  const x = clamp((feature.mapX / REFERENCE_MAP_WIDTH) * 100, 8, 92);
  const y = clamp((feature.mapY / REFERENCE_MAP_HEIGHT) * 100, 10, 90);
  return `${x}% ${y}%`;
}

function buildFallbackSlides(feature: ProjectedFeature): LocalPoiSlide[] {
  const objectPosition = featureObjectPosition(feature);

  return [
    {
      type: "local",
      src: withBasePath(`/poi/generated/${feature.id}.svg`),
      title: `${feature.name} concept render`,
      caption:
        "A locally generated 3D-style landmark concept render created for the atlas in the spirit of the Minas Tirith reference image.",
      attribution: "Generated locally for this project",
      license: "Project-generated SVG render",
      sourceLabel: "Generated Landmark Render",
      objectPosition: "50% 50%",
      presentation: "render"
    },
    {
      type: "local",
      src: withBasePath("/maps/mapome.png"),
      title: `${feature.name} on the calibrated atlas`,
      caption:
        "A focused crop from the primary detailed atlas, centered on the selected point of interest.",
      attribution: "Local project reference crop",
      license: "Derived from the detailed Middle-earth atlas source",
      sourceLabel: "Detailed Atlas",
      objectPosition,
      presentation: "crop"
    },
    {
      type: "local",
      src: withBasePath("/maps/sketch-reference.svg"),
      title: `${feature.name} on the sketch reference`,
      caption:
        "A secondary crop from the sketch-style comparison map to cross-check placement against Tolkien-era map traditions.",
      attribution: "Local project reference crop",
      license: "Derived from the sketch comparison source",
      sourceLabel: "Sketch Reference",
      objectPosition,
      presentation: "crop"
    },
    {
      type: "local",
      src: withBasePath("/maps/political-reference.svg"),
      title: `${feature.name} within the realms`,
      caption:
        "A regional crop from the political comparison layer, useful for seeing the place in its wider kingdom or territory.",
      attribution: "Local project reference crop",
      license: "Derived from the political comparison source",
      sourceLabel: "Political Regions",
      objectPosition,
      presentation: "crop"
    }
  ];
}

function buildFolderSlides(feature: ProjectedFeature): LocalPoiSlide[] {
  const folderSlides = POI_FOLDER_MEDIA[feature.id] ?? [];

  return folderSlides.map((slide) => ({
    type: "local",
    src: withBasePath(slide.src),
    title: slide.title,
    caption: `Local reference image for ${feature.name}.`,
    attribution: "Local project asset",
    license: "Stored in public/poi",
    sourceLabel: "POI Image",
    objectPosition: "50% 50%",
    presentation: "render"
  }));
}

export function MiddleEarthExplorer() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hasInitializedViewRef = useRef(false);
  const hasUserAdjustedViewRef = useRef(false);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    view: ViewBox;
  } | null>(null);

  const [containerSize, setContainerSize] = useState<ContainerSize>({
    width: 0,
    height: 0
  });
  const [devicePixelRatio, setDevicePixelRatio] = useState(1);
  const [search, setSearch] = useState("");
  const [viewBox, setViewBox] = useState(INITIAL_VIEW);
  const [selectedId, setSelectedId] = useState("minas-tirith");
  const [comparisonMapId, setComparisonMapId] = useState<"none" | ComparisonId>(
    "sketch"
  );
  const [comparisonOpacity, setComparisonOpacity] = useState(0.24);
  const [markerOpacity, setMarkerOpacity] = useState(0.84);
  const [rotationDeg, setRotationDeg] = useState(0);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [panelMode, setPanelMode] = useState<"browse" | "detail">("browse");
  const [measureMode, setMeasureMode] = useState(false);
  const [measureSelection, setMeasureSelection] = useState<MeasureSelection>([
    null,
    null
  ]);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isLayersOpen, setIsLayersOpen] = useState(false);

  const projectionMode = comparisonMapId === "sketch" ? "sketch" : "detailed";

  const projectedFeatures = useMemo(
    () => ALL_FEATURES.map((feature) => projectFeature(feature, projectionMode)),
    [projectionMode]
  );
  const projectedPoints = useMemo(
    () => POINTS.map((feature) => projectFeature(feature, projectionMode)),
    [projectionMode]
  );

  useEffect(() => {
    const node = containerRef.current;
    if (!node) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) {
        return;
      }

      setContainerSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height
      });
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setDevicePixelRatio(window.devicePixelRatio || 1);
  }, []);

  useEffect(() => {
    setIsSidebarCollapsed(window.matchMedia("(max-width: 720px)").matches);
  }, []);

  useEffect(() => {
    if (!containerSize.width) {
      return;
    }

    if (hasInitializedViewRef.current && hasUserAdjustedViewRef.current) {
      return;
    }

    const preferredWidth = clamp(
      containerSize.width * SCREEN_FIT_MAP_UNITS_PER_PIXEL,
      760,
      1160
    );
    const preferredHeight = (preferredWidth * INITIAL_VIEW.height) / INITIAL_VIEW.width;

    setViewBox(
      clampViewBox({
        x: INITIAL_FOCUS.x - preferredWidth / 2,
        y: INITIAL_FOCUS.y - preferredHeight / 2,
        width: preferredWidth,
        height: preferredHeight
      })
    );

    hasInitializedViewRef.current = true;
  }, [containerSize.width]);

  const selectedFeature =
    projectedFeatures.find((feature) => feature.id === selectedId) ??
    projectedPoints[0];

  const poiSlides = useMemo<LocalPoiSlide[]>(() => {
    const folderSlides = buildFolderSlides(selectedFeature);
    const fallbackSlides = buildFallbackSlides(selectedFeature);

    if (folderSlides.length > 0) {
      return [...folderSlides, ...fallbackSlides.slice(1)];
    }

    return fallbackSlides;
  }, [selectedFeature]);

  const activeSlide = poiSlides[activeSlideIndex] ?? poiSlides[0] ?? buildFallbackSlides(selectedFeature)[0];

  const searchResults = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    if (!normalized) {
      return projectedFeatures
        .filter((feature) => feature.emphasis === "major")
        .slice(0, 10);
    }

    return projectedFeatures
      .filter((feature) => {
        const haystack = [
          feature.name,
          feature.region,
          feature.summary,
          ...(feature.aliases ?? [])
        ]
          .join(" ")
          .toLowerCase();

        return haystack.includes(normalized);
      })
      .sort((left, right) => {
        const leftStarts = left.name.toLowerCase().startsWith(normalized);
        const rightStarts = right.name.toLowerCase().startsWith(normalized);
        if (leftStarts !== rightStarts) {
          return leftStarts ? -1 : 1;
        }
        return left.name.localeCompare(right.name);
      })
      .slice(0, 10);
  }, [projectedFeatures, search]);

  const renderedPointFeatures = useMemo(() => {
    const points = [...projectedPoints];

    if (!points.some((feature) => feature.id === selectedFeature.id)) {
      points.push(selectedFeature);
    }

    return points;
  }, [projectedPoints, selectedFeature]);

  const activeComparisonMap =
    comparisonMapId === "none"
      ? null
      : (() => {
          const source =
            DOWNLOADED_MAP_SOURCES.find((item) => item.id === comparisonMapId) ?? null;
          const layout = COMPARISON_LAYOUTS[comparisonMapId];
          return source
            ? {
                source,
                layout: {
                  x: layout.x,
                  y: layout.y,
                  width: layout.width,
                  height: layout.width / layout.aspectRatio
                }
              }
            : null;
        })();

  const measurementFeatures = useMemo(() => {
    const [fromId, toId] = measureSelection;
    return [
      projectedFeatures.find((feature) => feature.id === fromId) ?? null,
      projectedFeatures.find((feature) => feature.id === toId) ?? null
    ] as const;
  }, [measureSelection, projectedFeatures]);

  const measuredDistanceMiles = useMemo(() => {
    const [fromFeature, toFeature] = measurementFeatures;
    if (!fromFeature || !toFeature) {
      return null;
    }

    const deltaX = toFeature.mapX - fromFeature.mapX;
    const deltaY = toFeature.mapY - fromFeature.mapY;
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY) * MILES_PER_MAP_UNIT;
  }, [measurementFeatures]);

  const renderBounds = useMemo(
    () => expandedRenderBounds(viewBox, rotationDeg),
    [rotationDeg, viewBox]
  );

  const activeTileLevel = useMemo(
    () => chooseTileLevel(MAP_TILE_LEVELS, containerSize.width * devicePixelRatio, viewBox.width),
    [containerSize.width, devicePixelRatio, viewBox.width]
  );

  const visibleTiles = useMemo(
    () => buildVisibleTiles(activeTileLevel, renderBounds),
    [activeTileLevel, renderBounds]
  );

  const scaleBar = useMemo(() => {
    const targetMiles = viewBox.width * 0.18 * MILES_PER_MAP_UNIT;
    const miles = niceMiles(targetMiles);
    const widthInMapUnits = miles / MILES_PER_MAP_UNIT;
    const widthInPixels =
      containerSize.width > 0 ? (widthInMapUnits / viewBox.width) * containerSize.width : 0;

    return {
      miles,
      widthInPixels
    };
  }, [containerSize.width, viewBox.width]);

  useEffect(() => {
    setActiveSlideIndex(0);
    setIsLightboxOpen(false);
  }, [selectedFeature.id]);

  function updateMeasureSelection(feature: ProjectedFeature) {
    setMeasureSelection((current) => {
      const [fromId, toId] = current;

      if (!fromId || (fromId && toId)) {
        return [feature.id, null];
      }

      if (fromId === feature.id) {
        return current;
      }

      return [fromId, feature.id];
    });
  }

  function focusFeature(feature: ProjectedFeature) {
    hasUserAdjustedViewRef.current = true;
    setIsLayersOpen(false);
    setIsSidebarCollapsed(false);
    setPanelMode("detail");
    setSelectedId(feature.id);
    setSearch(feature.name);
    setViewBox((current) =>
      clampViewBox({
        ...current,
        x: feature.mapX - current.width / 2,
        y: feature.mapY - current.height / 2
      })
    );

    if (measureMode) {
      updateMeasureSelection(feature);
    }
  }

  function zoomAt(factor: number, originX = 0.5, originY = 0.5) {
    hasUserAdjustedViewRef.current = true;
    setViewBox((current) => {
      const nextWidth = clamp(current.width * factor, MIN_WIDTH, MAX_WIDTH);
      const nextHeight = (nextWidth * INITIAL_VIEW.height) / INITIAL_VIEW.width;
      const focusX = current.x + current.width * originX;
      const focusY = current.y + current.height * originY;

      return clampViewBox({
        x: focusX - nextWidth * originX,
        y: focusY - nextHeight * originY,
        width: nextWidth,
        height: nextHeight
      });
    });
  }

  return (
    <main className={`atlasShell ${isSidebarCollapsed ? "atlasShellSidebarCollapsed" : ""}`}>
      <aside className="atlasRail" data-map-control="true">
        <button
          className={`railButton ${panelMode === "browse" ? "railButtonActive" : ""}`}
          onClick={() => {
            setIsSidebarCollapsed(false);
            setPanelMode("browse");
          }}
          onPointerDown={(event) => event.stopPropagation()}
          type="button"
        >
          <span className="railGlyph">≡</span>
          <span>Explore</span>
        </button>
        <button
          className={`railButton ${panelMode === "detail" ? "railButtonActive" : ""}`}
          onClick={() => {
            setIsSidebarCollapsed(false);
            setPanelMode("detail");
          }}
          onPointerDown={(event) => event.stopPropagation()}
          type="button"
        >
          <span className="railGlyph">◎</span>
          <span>Place</span>
        </button>
        <button
          className="railButton"
          onClick={() => {
            setIsSidebarCollapsed(false);
            setPanelMode("browse");
            setViewBox(INITIAL_VIEW);
          }}
          onPointerDown={(event) => event.stopPropagation()}
          type="button"
        >
          <span className="railGlyph">⌂</span>
          <span>Reset</span>
        </button>
        <div className="atlasRailSpacer" />
        <a
          className="railButton railLinkButton"
          data-map-control="true"
          href="https://github.com/hbahadorzadeh/middle-earth-map"
          onPointerDown={(event) => event.stopPropagation()}
          rel="noreferrer"
          target="_blank"
        >
          <span className="railGlyph railGlyphIcon" aria-hidden="true">
            <svg fill="currentColor" height="20" viewBox="0 0 24 24" width="20">
              <path d="M12 1.25a10.75 10.75 0 0 0-3.4 20.95c.54.1.74-.23.74-.52v-1.82c-3.02.66-3.66-1.29-3.66-1.29-.5-1.24-1.21-1.57-1.21-1.57-.99-.68.08-.66.08-.66 1.1.08 1.67 1.12 1.67 1.12.97 1.66 2.55 1.18 3.17.9.1-.71.39-1.18.7-1.46-2.41-.27-4.95-1.2-4.95-5.34 0-1.18.42-2.15 1.12-2.9-.11-.27-.49-1.38.11-2.88 0 0 .91-.29 2.98 1.11a10.4 10.4 0 0 1 5.42 0c2.07-1.4 2.98-1.11 2.98-1.11.6 1.5.22 2.61.11 2.88.7.75 1.12 1.72 1.12 2.9 0 4.15-2.54 5.07-4.96 5.34.4.34.75 1 .75 2.03v3.01c0 .29.19.63.75.52A10.75 10.75 0 0 0 12 1.25Z" />
            </svg>
          </span>
          <span>GitHub</span>
        </a>
      </aside>

      <section
        className={`atlasSidebar ${panelMode === "detail" ? "atlasSidebarDetail" : "atlasSidebarBrowse"}`}
        data-map-control="true"
      >
        <div className={`sidebarPanel ${panelMode === "detail" ? "sidebarPanelDetail" : "sidebarPanelBrowse"}`}>
          <div className="sidebarSearchShell">
            {panelMode === "detail" ? (
              <button
                aria-label="Back to explore"
                className="sidebarBackButton"
                onClick={() => setPanelMode("browse")}
                onPointerDown={(event) => event.stopPropagation()}
                type="button"
              >
                ←
              </button>
            ) : null}
            <input
              className="sidebarSearchInput"
              id="atlas-search"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search Middle-earth"
              value={search}
            />
            <button
              aria-label="Collapse sidebar"
              className="sidebarToggleButton"
              onClick={() => setIsSidebarCollapsed(true)}
              onPointerDown={(event) => event.stopPropagation()}
              type="button"
            >
              ×
            </button>
          </div>

          {panelMode === "browse" ? (
            <>
              <div className="sidebarBrowseSheet">
                <div className="sidebarCard heroCard">
                  <p className="eyebrow">Middle-earth Atlas</p>
                  <h2 className="browseTitle">Search, compare, and explore the map</h2>
                  <p className="heroCopy">
                    Browse major settlements, roads, rivers, and strongholds, then pick a place to open its lore sheet.
                  </p>
                </div>

                <div className="sidebarCard">
                  <p className="eyebrow">Popular Searches</p>
                  <div className="searchResults">
                    {searchResults.map((feature) => (
                      <button
                        className="resultButton"
                        key={feature.id}
                        onClick={() => focusFeature(feature)}
                        type="button"
                      >
                        <span>
                          <strong>{feature.name}</strong>
                          <small>
                            {getKindLabel(feature.kind)} in {feature.region}
                          </small>
                        </span>
                        <span className="resultIcon" style={{ color: markerFill(feature.kind) }}>
                          ●
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </>
          ) : (
            <div className="sidebarDetailSheet">
              <div
                className="detailHero"
                style={
                  {
                    "--detail-accent": markerFill(selectedFeature.kind)
                  } as CSSProperties
                }
              >
                <div className="detailHeroLabelRow">
                  <span className="detailHeroBadge">{getKindLabel(selectedFeature.kind)}</span>
                  <span className="detailHeroRegion">{selectedFeature.region}</span>
                </div>
                <h2>{selectedFeature.name}</h2>
                <p>{selectedFeature.summary}</p>
              </div>

              <div className="sidebarCard detailCard detailCardPrimary">
                <div className="detailHeader">
                  <div>
                    <p className="eyebrow">Overview</p>
                    <h2>{selectedFeature.name}</h2>
                  </div>
                  <span
                    className="kindBadge"
                    style={{ backgroundColor: markerFill(selectedFeature.kind) }}
                  >
                    {getKindLabel(selectedFeature.kind)}
                  </span>
                </div>
                <p className="detailRegion">{selectedFeature.region}</p>
                <div className="detailList">
                  {selectedFeature.details.map((detail) => (
                    <p key={detail}>{detail}</p>
                  ))}
                </div>
                {selectedFeature.aliases?.length ? (
                  <p className="detailAliases">
                    Also known as: {selectedFeature.aliases.join(", ")}
                  </p>
                ) : null}
              </div>

              <div className="sidebarCard detailImagesCard">
                <div className="detailImagesHeader">
                  <div>
                    <p className="eyebrow">Images</p>
                    <strong>{selectedFeature.name}</strong>
                  </div>
                  <span>{poiSlides.length} images</span>
                </div>
                {poiSlides.length ? (
                  <div className="detailThumbGrid">
                    {poiSlides.map((slide, index) => (
                      <button
                        aria-label={`Open image ${index + 1}: ${slide.title}`}
                        className={`detailThumbButton ${
                          index === activeSlideIndex ? "detailThumbButtonActive" : ""
                        }`}
                        key={`${selectedFeature.id}-${slide.src}-${index}`}
                        onClick={() => {
                          setActiveSlideIndex(index);
                          setIsLightboxOpen(true);
                        }}
                        type="button"
                      >
                        <img
                          alt={slide.title}
                          className="detailThumbImage"
                          loading="lazy"
                          src={slide.src}
                          style={{ objectPosition: slide.objectPosition }}
                        />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="detailMediaEmpty">
                    <p>No images are available for this place yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="atlasStage">
        <div
          className="mapFrame mapFrameReference"
          onPointerDown={(event) => {
            if (isMapControlTarget(event.target)) {
              return;
            }

            dragRef.current = {
              pointerId: event.pointerId,
              startX: event.clientX,
              startY: event.clientY,
              view: viewBox
            };
            event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onPointerMove={(event) => {
            const drag = dragRef.current;
            const rect = containerRef.current?.getBoundingClientRect();
            if (!drag || !rect || drag.pointerId !== event.pointerId) {
              return;
            }

            const scaleX = drag.view.width / rect.width;
            const scaleY = drag.view.height / rect.height;
            const deltaX = (event.clientX - drag.startX) * scaleX;
            const deltaY = (event.clientY - drag.startY) * scaleY;

            setViewBox(
              clampViewBox({
                ...drag.view,
                x: drag.view.x - deltaX,
                y: drag.view.y - deltaY
              })
            );
            hasUserAdjustedViewRef.current = true;
          }}
          onPointerLeave={() => {
            dragRef.current = null;
          }}
          onPointerUp={() => {
            dragRef.current = null;
          }}
          onWheel={(event) => {
            if (isMapControlTarget(event.target)) {
              return;
            }

            event.preventDefault();
            const rect = containerRef.current?.getBoundingClientRect();
            if (!rect) {
              return;
            }

            const originX = (event.clientX - rect.left) / rect.width;
            const originY = (event.clientY - rect.top) / rect.height;
            const factor = clamp(Math.exp(event.deltaY * 0.0012), 0.8, 1.24);
            zoomAt(factor, originX, originY);
          }}
          ref={containerRef}
        >
          <button
            aria-label="Expand sidebar"
            className="sidebarRevealButton mapHudFade"
            data-map-control="true"
            onClick={(event) => {
              event.stopPropagation();
              setIsSidebarCollapsed(false);
            }}
            onPointerDown={(event) => event.stopPropagation()}
            type="button"
          >
            Atlas
          </button>

          <div
            className="layersDock mapHudFade"
            data-map-control="true"
            onPointerDown={(event) => event.stopPropagation()}
          >
            {isLayersOpen ? (
              <div className="layersPanel">
                <div className="layersPanelHeader">
                  <strong>Layers</strong>
                  <button
                    aria-label="Close layers panel"
                    className="layersCloseButton"
                    onClick={() => setIsLayersOpen(false)}
                    type="button"
                  >
                    ×
                  </button>
                </div>
                <div className="layersOptions">
                  {[
                    {
                      id: "none" as const,
                      title: "None",
                      subtitle: "Hide overlays",
                      previewClass: "layersPreviewNone"
                    },
                    {
                      id: "sketch" as const,
                      title: "Sketch",
                      subtitle: "Hand map",
                      previewClass: "layersPreviewSketch"
                    },
                    {
                      id: "political" as const,
                      title: "Realms",
                      subtitle: "Regions",
                      previewClass: "layersPreviewPolitical"
                    }
                  ].map((option) => {
                    const isActive = comparisonMapId === option.id;
                    return (
                      <button
                        className={`layersOptionCard ${isActive ? "layersOptionCardActive" : ""}`}
                        key={option.id}
                        onClick={() => {
                          setComparisonMapId(option.id);
                          setIsLayersOpen(false);
                        }}
                        type="button"
                      >
                        <span className={`layersPreview ${option.previewClass}`} />
                        <span className="layersOptionText">
                          <strong>{option.title}</strong>
                          <small>{option.subtitle}</small>
                        </span>
                      </button>
                    );
                  })}
                </div>
                {comparisonMapId !== "none" ? (
                  <>
                    <label className="rangeLabelUi layersRangeLabel" htmlFor="comparison-opacity">
                      Overlay Opacity
                    </label>
                    <input
                      id="comparison-opacity"
                      max="0.7"
                      min="0"
                      onChange={(event) => setComparisonOpacity(Number(event.target.value))}
                      step="0.02"
                      type="range"
                      value={comparisonOpacity}
                    />
                  </>
                ) : null}
              </div>
            ) : (
              <button
                aria-label="Open layers panel"
                className="layersButton"
                onClick={() => setIsLayersOpen(true)}
                type="button"
              >
                <span className="layersButtonPreview" />
                <span className="layersButtonText">
                  <strong>Layers</strong>
                  <small>{comparisonMapId === "none" ? "Off" : comparisonMapId === "sketch" ? "Sketch" : "Realms"}</small>
                </span>
              </button>
            )}
          </div>

          <svg
            aria-label="Middle-earth reference atlas"
            className="mapSvg"
            preserveAspectRatio="xMidYMid meet"
            viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
          >
            <defs>
              <filter id="map-shadow" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow
                  dx="0"
                  dy="18"
                  floodColor="#0f1316"
                  floodOpacity="0.18"
                  stdDeviation="18"
                />
              </filter>
              <linearGradient id="marker-glow" x1="0%" x2="100%" y1="0%" y2="100%">
                <stop offset="0%" stopColor="#fff7d7" />
                <stop offset="100%" stopColor="#ffd06f" />
              </linearGradient>
            </defs>

            <g transform={`rotate(${rotationDeg} ${MAP_CENTER_X} ${MAP_CENTER_Y})`}>
              <rect
                fill="#f5f0e4"
                height={REFERENCE_MAP_HEIGHT}
                width={REFERENCE_MAP_WIDTH}
                x={0}
                y={0}
              />

              <g filter="url(#map-shadow)">
                {visibleTiles.map((tile) => (
                  <image
                    height={tile.height}
                    href={tile.href}
                    key={tile.key}
                    preserveAspectRatio="xMinYMin slice"
                    width={tile.width}
                    x={tile.x}
                    y={tile.y}
                  />
                ))}
              </g>

              {activeComparisonMap?.source ? (
                <image
                  height={activeComparisonMap.layout.height}
                  href={withBasePath(activeComparisonMap.source.href)}
                  opacity={comparisonOpacity}
                  preserveAspectRatio="xMinYMin meet"
                  width={activeComparisonMap.layout.width}
                  x={activeComparisonMap.layout.x}
                  y={activeComparisonMap.layout.y}
                />
              ) : null}

              {measurementFeatures[0] && measurementFeatures[1] ? (
                <g className="measurementLine">
                  <line
                    stroke="#ffe18d"
                    strokeDasharray="20 12"
                    strokeLinecap="round"
                    strokeWidth="7"
                    x1={measurementFeatures[0].mapX}
                    x2={measurementFeatures[1].mapX}
                    y1={measurementFeatures[0].mapY}
                    y2={measurementFeatures[1].mapY}
                  />
                  <circle
                    cx={measurementFeatures[0].mapX}
                    cy={measurementFeatures[0].mapY}
                    fill="#ffe18d"
                    r="10"
                  />
                  <circle
                    cx={measurementFeatures[1].mapX}
                    cy={measurementFeatures[1].mapY}
                    fill="#ffe18d"
                    r="10"
                  />
                </g>
              ) : null}

              <g opacity={markerOpacity}>
                {renderedPointFeatures.map((feature) => {
                  const isSelected = feature.id === selectedFeature.id;
                  const isMeasureAnchor =
                    feature.id === measurementFeatures[0]?.id ||
                    feature.id === measurementFeatures[1]?.id;
                  const radius = pointRadius(feature);
                  const showLabel =
                    isSelected ||
                    isMeasureAnchor ||
                    (feature.emphasis === "major" && viewBox.width < 2500);

                  return (
                    <g key={feature.id}>
                      <circle
                        cx={feature.mapX}
                        cy={feature.mapY}
                        cursor="pointer"
                        fill={isMeasureAnchor ? "#ffe18d" : markerFill(feature.kind)}
                        onClick={(event) => {
                          event.stopPropagation();
                          focusFeature(feature);
                        }}
                        onPointerDown={(event) => event.stopPropagation()}
                        r={radius}
                        stroke={isSelected ? "url(#marker-glow)" : "#f8f4e6"}
                        strokeWidth={isSelected ? 6 : 3}
                      />
                      <circle
                        cx={feature.mapX}
                        cy={feature.mapY}
                        cursor="pointer"
                        fill="none"
                        opacity={isSelected || isMeasureAnchor ? 0.9 : 0.28}
                        onClick={(event) => {
                          event.stopPropagation();
                          focusFeature(feature);
                        }}
                        onPointerDown={(event) => event.stopPropagation()}
                        r={radius + (isSelected || isMeasureAnchor ? 22 : 12)}
                        stroke={
                          isSelected
                            ? "#f5cb6f"
                            : isMeasureAnchor
                              ? "#ffe18d"
                              : markerFill(feature.kind)
                        }
                        strokeWidth={isSelected || isMeasureAnchor ? 4 : 2}
                      />
                      {showLabel ? (
                        <text
                          className={`poiLabel ${isSelected ? "poiLabelSelected" : ""}`}
                          x={feature.mapX + 18}
                          y={feature.mapY - 18}
                        >
                          {feature.name}
                        </text>
                      ) : null}
                    </g>
                  );
                })}
              </g>
            </g>
          </svg>

          <div
            className="mapScaleOverlay mapHudFade"
            data-map-control="true"
            onPointerDown={(event) => event.stopPropagation()}
          >
            <span className="mapScaleTitle">Scale</span>
            <div className="mapScaleGraphic" style={{ width: scaleBar.widthInPixels }}>
              {Array.from({ length: 4 }).map((_, index) => (
                <span
                  className={`mapScaleSegment ${
                    index % 2 === 0 ? "mapScaleSegmentLight" : "mapScaleSegmentDark"
                  }`}
                  key={index}
                />
              ))}
            </div>
            <div className="mapScaleLabels">
              <span>0</span>
              <span>{Math.round(scaleBar.miles)} miles</span>
            </div>
          </div>

          <div
            className="mapControlDock mapHudFade"
            data-map-control="true"
            onPointerDown={(event) => event.stopPropagation()}
          >
            <div className="mapRotateRow">
              <button
                className="mapRotateButton"
                onClick={(event) => {
                  event.stopPropagation();
                  setRotationDeg((current) => current - 15);
                }}
                onPointerDown={(event) => event.stopPropagation()}
                type="button"
              >
                ↺
              </button>
              <button
                aria-label="Reset north"
                className="compassButton"
                onClick={(event) => {
                  event.stopPropagation();
                  setRotationDeg(0);
                }}
                onPointerDown={(event) => event.stopPropagation()}
                type="button"
              >
                <span
                  className="compassNeedle"
                  style={{ transform: `translate(-50%, -100%) rotate(${-rotationDeg}deg)` }}
                />
                <span className="compassNorth">N</span>
              </button>
              <button
                className="mapRotateButton"
                onClick={(event) => {
                  event.stopPropagation();
                  setRotationDeg((current) => current + 15);
                }}
                onPointerDown={(event) => event.stopPropagation()}
                type="button"
              >
                ↻
              </button>
            </div>

            <div className="mapZoomRow">
              <button
                aria-label="Zoom in"
                className="mapZoomButton"
                onClick={(event) => {
                  event.stopPropagation();
                  zoomAt(0.84);
                }}
                onPointerDown={(event) => event.stopPropagation()}
                type="button"
              >
                +
              </button>
              <button
                aria-label="Zoom out"
                className="mapZoomButton"
                onClick={(event) => {
                  event.stopPropagation();
                  zoomAt(1.18);
                }}
                onPointerDown={(event) => event.stopPropagation()}
                type="button"
              >
                -
              </button>
            </div>
          </div>
        </div>
      </section>

      {isLightboxOpen && activeSlide ? (
        <div
          className="lightboxOverlay"
          data-map-control="true"
          onClick={() => setIsLightboxOpen(false)}
          onPointerDown={(event) => event.stopPropagation()}
        >
          <button
            aria-label="Close image viewer"
            className="lightboxCloseButton"
            onClick={() => setIsLightboxOpen(false)}
            type="button"
          >
            ×
          </button>
          {poiSlides.length > 1 ? (
            <button
              aria-label="Previous image"
              className="lightboxNavButton lightboxNavButtonPrev"
              onClick={(event) => {
                event.stopPropagation();
                setActiveSlideIndex(
                  (current) => (current - 1 + poiSlides.length) % poiSlides.length
                );
              }}
              type="button"
            >
              ‹
            </button>
          ) : null}
          <div
            className="lightboxDialog"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              alt={activeSlide.title}
              className="lightboxImage"
              src={activeSlide.src}
              style={{ objectPosition: activeSlide.objectPosition }}
            />
            <div className="lightboxMeta">
              <strong>{activeSlide.title}</strong>
              <span>
                {activeSlideIndex + 1} / {poiSlides.length}
              </span>
            </div>
          </div>
          {poiSlides.length > 1 ? (
            <button
              aria-label="Next image"
              className="lightboxNavButton lightboxNavButtonNext"
              onClick={(event) => {
                event.stopPropagation();
                setActiveSlideIndex((current) => (current + 1) % poiSlides.length);
              }}
              type="button"
            >
              ›
            </button>
          ) : null}
        </div>
      ) : null}
    </main>
  );
}
