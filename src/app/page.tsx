import { absoluteUrl, siteDescription, siteTitle } from "@/lib/site";
import { MiddleEarthExplorer } from "@/components/middle-earth-explorer";

export default function Page() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteTitle,
    description: siteDescription,
    url: absoluteUrl("/"),
    inLanguage: "en",
    about: [
      "Middle-earth",
      "The Lord of the Rings",
      "J. R. R. Tolkien",
      "Fantasy maps"
    ]
  };

  return (
    <>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        type="application/ld+json"
      />
      <main>
        <section className="srOnly">
          <h1>{siteTitle}</h1>
          <p>{siteDescription}</p>
          <p>
            Search places such as Rivendell, Minas Tirith, Osgiliath, Isengard,
            Barad-dur, the Argonath, and many other landmarks across Tolkien&apos;s
            world using a zoomable, layered reference atlas.
          </p>
        </section>
        <MiddleEarthExplorer />
      </main>
    </>
  );
}
