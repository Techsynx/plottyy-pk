import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { AuthModal } from "@/components/auth/AuthModal";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0F6B5C",
  width: "device-width",
  initialScale: 1,
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://plotty.unicorn-realtors.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Plot Finder Pakistan | Find Plots in Lahore, Islamabad & Karachi — plottyy",
    template: "%s | plottyy — Pakistan's #1 Plot Finder",
  },
  description: "Plottyy by Unicorn Realtors (Huzaifa Malik @exhuzaifa) is Pakistan's leading plot finder and real estate marketplace. Find 5 Marla, 10 Marla, 1 Kanal residential plots, commercial land, and luxury houses in DHA, Bahria Town, and all major cities with 100% verified prices.",
  keywords: [
    "plot finder",
    "plots in lahore",
    "plots in pakistan",
    "find plots",
    "plotyy",
    "plotty",
    "unicorn realtors",
    "exhuzaifa",
    "huzaifa malik real estate",
    "dha lahore plots for sale",
    "bahria town lahore plots",
    "dha phase 6 plots",
    "dha phase 7 plots",
    "dha phase 9 prism",
    "dha islamabad plots",
    "bahria town islamabad",
    "dha karachi plots for sale",
    "5 marla plot for sale",
    "10 marla plot for sale",
    "1 kanal plot for sale",
    "commercial plots in pakistan",
    "pakistan plot prices 2026",
    "buy plot in lahore",
    "real estate agents pakistan",
    "verified property dealers pakistan",
    "zameen plot finder alternative",
  ],
  authors: [
    { name: "Unicorn Realtors" },
    { name: "Huzaifa Malik (@exhuzaifa)" },
    { name: "Plottyy Pakistan", url: SITE_URL },
  ],
  creator: "Unicorn Realtors & Techsynx",
  publisher: "plottyy.unicorn-realtors.com",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: SITE_URL,
    siteName: "plottyy — Pakistan Plot Finder & Property Portal",
    title: "Plot Finder Pakistan | Find Plots in Lahore, Islamabad & Karachi — plottyy",
    description: "Browse verified residential plots, commercial land, and houses across Pakistan. Verified by Unicorn Realtors & certified property agents.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&h=630&auto=format&fit=crop&q=80",
        width: 1200,
        height: 630,
        alt: "plottyy Pakistan Plot Finder & Real Estate Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Plot Finder Pakistan | Find Plots in Lahore, Islamabad & Karachi — plottyy",
    description: "Browse verified plots for sale in DHA, Bahria Town, and major Pakistani cities. Powered by Unicorn Realtors & @exhuzaifa.",
    images: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&h=630&auto=format&fit=crop&q=80"],
    creator: "@exhuzaifa",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google4ed8a05a3350c9cb",
  },
  category: "real estate",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLdOrg = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": "plottyy by Unicorn Realtors",
    "alternateName": ["Plot Finder Pakistan", "plotyy", "Unicorn Realtors", "Huzaifa Malik Real Estate"],
    "url": SITE_URL,
    "logo": `${SITE_URL}/logo.png`,
    "image": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200",
    "description": "Pakistan's #1 verified plot finder and real estate marketplace for residential plots, commercial land, and luxury houses.",
    "telephone": "+923268282409",
    "founder": {
      "@type": "Person",
      "name": "Huzaifa Malik",
      "alternateName": "@exhuzaifa",
      "jobTitle": "Principal Real Estate Consultant",
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Lahore",
      "addressRegion": "Punjab",
      "addressCountry": "PK",
    },
    "areaServed": [
      { "@type": "City", "name": "Lahore" },
      { "@type": "City", "name": "Islamabad" },
      { "@type": "City", "name": "Rawalpindi" },
      { "@type": "City", "name": "Karachi" },
      { "@type": "City", "name": "Faisalabad" },
      { "@type": "City", "name": "Multan" },
      { "@type": "City", "name": "Peshawar" },
      { "@type": "City", "name": "Gwadar" },
    ],
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${SITE_URL}/listings?query={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en" className={`${manrope.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#FAF8F5] text-[#1F2420] font-sans selection:bg-[#0F6B5C]/20 selection:text-[#0F6B5C]">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <AuthModal />
        </AuthProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
