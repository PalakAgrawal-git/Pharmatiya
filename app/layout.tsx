import type { Metadata } from "next";
import { Fira_Sans, Fira_Mono } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { site } from "@/lib/site";
import "./globals.css";

/**
 * One family, three roles.
 *
 * The site is set in Fira throughout. Fira Sans carries navigation, body,
 * forms, listings and every heading; the display voice is the same face at
 * 300, set large with the tracking pulled in, so a display line is
 * distinguished by weight and scale rather than by changing typeface; and
 * Fira Mono carries the marks, figure numbers and years.
 *
 * Using one superfamily rather than three unrelated faces means the
 * hierarchy has to be built from scale, weight and space — which is what
 * this design has claimed to do all along. It also drops a webfont: two
 * families load instead of three.
 */
const firaSans = Fira_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-fira-sans",
  display: "swap",
});

const firaMono = Fira_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-fira-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Health economics and real-world evidence`,
    template: `%s — ${site.name}`,
  },
  description:
    "Health economics, outcomes research and real-world evidence for commercial, medical affairs and market access teams. Twenty-five years across payer, provider and claims data.",
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_US",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: `${site.name} — evidence that holds up when it is challenged`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og.png"],
  },
  // The GitHub Pages preview must not be indexed alongside the live site.
  robots:
    process.env.NEXT_PUBLIC_PREVIEW === "true"
      ? { index: false, follow: false }
      : { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const address = {
    "@type": "PostalAddress",
    addressLocality: site.address.locality,
    addressRegion: site.address.region,
    postalCode: site.address.postalCode,
    addressCountry: site.address.country,
  };

  /**
   * One @graph rather than three separate blocks, so the entities reference
   * each other by @id instead of repeating themselves.
   *
   * ProfessionalService is used for the local-business entity: it is a
   * LocalBusiness subtype and an accurate description of a consultancy, where
   * bare LocalBusiness would imply a walk-in premises. No street address and
   * no opening hours are asserted, because neither has been supplied — an
   * invented one would be worse than an absent one, and Google treats a wrong
   * address as a trust problem rather than a missing field.
   */
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${site.url}/#organization`,
        name: site.name,
        legalName: site.legalName,
        url: site.url,
        email: site.email,
        logo: new URL("/icon.svg", site.url).toString(),
        image: new URL("/og.png", site.url).toString(),
        description:
          "Health economics, outcomes research and real-world evidence consultancy.",
        address,
      },
      {
        "@type": "ProfessionalService",
        "@id": `${site.url}/#localbusiness`,
        name: site.name,
        parentOrganization: { "@id": `${site.url}/#organization` },
        url: site.url,
        email: site.email,
        image: new URL("/og.png", site.url).toString(),
        address,
        areaServed: "US",
        knowsAbout: [
          "Health economics and outcomes research",
          "Real-world evidence",
          "Claims and EHR data analytics",
          "Market access and value-based contracting",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        url: site.url,
        name: site.name,
        publisher: { "@id": `${site.url}/#organization` },
      },
    ],
  };

  return (
    <html
      lang="en"
      className={`${firaSans.variable} ${firaMono.variable}`}
    >
      <body className="flex min-h-screen flex-col">

        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-0 focus:top-0 focus:z-50 focus:bg-ink focus:px-5 focus:py-3 focus:text-paper"
        >
          Skip to main content
        </a>

        <Header />
        <Breadcrumbs />

        <main id="main" className="flex-1">
          {children}
        </main>

        <Footer />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </body>
    </html>
  );
}
