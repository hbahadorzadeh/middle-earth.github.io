const fallbackSiteUrl = "https://hbahadorzadeh.github.io/middle-earth-map";

export const siteName = "Middle-earth Atlas";
export const siteTitle = "Interactive Middle-earth Map, Atlas, and Landmark Explorer";
export const siteDescription =
  "Explore an interactive Middle-earth map with searchable landmarks, cities, rivers, fortresses, and lore-rich points of interest from Tolkien's world.";
export const siteKeywords = [
  "Middle-earth map",
  "interactive Middle-earth map",
  "Lord of the Rings map",
  "Tolkien map",
  "Middle-earth atlas",
  "Middle-earth landmarks",
  "LOTR geography",
  "Rivendell map",
  "Mordor map",
  "Gondor map"
] as const;

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? fallbackSiteUrl).replace(/\/$/, "");

export function absoluteUrl(path = "/") {
  if (!path.startsWith("/")) {
    return `${siteUrl}/${path}`;
  }

  return `${siteUrl}${path}`;
}
