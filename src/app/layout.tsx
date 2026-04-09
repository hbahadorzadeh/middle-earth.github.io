import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Middle-earth Atlas",
  description:
    "A vector-based Middle-earth explorer with search, layered terrain, pan and zoom controls, and detailed lore cards."
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
