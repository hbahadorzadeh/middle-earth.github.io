import type { Metadata } from "next";
import type { ReactNode } from "react";
import { absoluteUrl, siteDescription, siteKeywords, siteName, siteTitle, siteUrl } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: `%s | ${siteName}`
  },
  description: siteDescription,
  keywords: [...siteKeywords],
  alternates: {
    canonical: "/"
  },
  category: "reference",
  openGraph: {
    type: "website",
    url: "/",
    siteName,
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: absoluteUrl("/maps/mapome.png"),
        width: 3200,
        height: 2400,
        alt: "Detailed Middle-earth atlas map"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [absoluteUrl("/maps/mapome.png")]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
