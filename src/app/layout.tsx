import type { Metadata, Viewport } from "next";
import { Montserrat, Playfair_Display } from "next/font/google";
import "./globals.css";

/* The client's master typography card allows two families: Playfair Display for
   headings and Montserrat for everything else ("Montserrat font for the other
   text", 13 Sep). Inter, which used to load here as the body face for every page
   but the landing page, is on neither card. */
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-montserrat",
  display: "swap",
});
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Get Your Visibility Score Free | The Visibility Codes",
  description:
    "Take the 3-minute Visibility Assessment to discover your Visibility Score, your primary visibility gap and your personalised next steps.",
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB" className={`${montserrat.variable} ${playfair.variable}`}>
      <body>{children}</body>
    </html>
  );
}
