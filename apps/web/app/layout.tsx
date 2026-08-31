import type { Metadata } from "next";
import { Playfair_Display, Inter, Fraunces, Space_Grotesk } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AURA WELLNESS - Luxury Spa & Rejuvenation Sanctuary",
  description:
    "Experience serenity at Aura Wellness. Our bespoke wellness rituals are designed to harmonize your body, mind, and spirit in an atmosphere of quiet luxury.",
  keywords: [
    "Luxury Spa",
    "Beverly Hills Spa",
    "Aura Wellness",
    "Massage Therapy",
    "Botanical Skincare",
    "Rejuvenation Sanctuary",
  ],
  authors: [{ name: "Aura Wellness Sanctuary" }],
  openGraph: {
    title: "AURA WELLNESS - Luxury Spa & Rejuvenation Sanctuary",
    description:
      "Experience serenity at Aura Wellness. Our bespoke wellness rituals are designed to harmonize your body, mind, and spirit in an atmosphere of quiet luxury.",
    type: "website",
    locale: "en_US",
    siteName: "Aura Wellness Sanctuary",
  },
  twitter: {
    card: "summary_large_image",
    title: "AURA WELLNESS - Luxury Spa & Rejuvenation Sanctuary",
    description:
      "Experience serenity at Aura Wellness. Our bespoke wellness rituals are designed to harmonize your body, mind, and spirit in an atmosphere of quiet luxury.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "DaySpa",
  name: "Aura Wellness Sanctuary",
  image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef",
  description:
    "A sanctuary for restorative therapies and quiet luxury care, built around bespoke rituals timed, sourced, and held by hand.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "123 Serene Lane, Wellness District",
    addressLocality: "Beverly Hills",
    addressRegion: "CA",
    postalCode: "90210",
    addressCountry: "US",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 34.0736,
    longitude: -118.4004,
  },
  url: "https://aurawellness.com",
  telephone: "+1-310-555-0199",
  priceRange: "$$$",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "09:00",
      closes: "20:00",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} ${fraunces.variable} ${spaceGrotesk.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
