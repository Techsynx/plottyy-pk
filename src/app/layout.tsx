import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { AuthModal } from "@/components/auth/AuthModal";

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

export const metadata: Metadata = {
  title: "plottyy — Pakistan Verified Plot & Property Marketplace",
  description: "Browse and list verified plots, residential houses, and commercial properties across DHA, Bahria Town, and major Pakistani cities with transparent pricing.",
  keywords: [
    "plot for sale",
    "pakistan real estate",
    "dha lahore plots",
    "bahria town islamabad",
    "dha karachi plots",
    "plot price in lakh crore",
    "marla kanal property calculator"
  ],
  authors: [{ name: "plottyy.pk" }],
  verification: {
    google: "google4ed8a05a3350c9cb",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${manrope.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#FAF8F5] text-[#1F2420] font-sans selection:bg-[#0F6B5C]/20 selection:text-[#0F6B5C]">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <AuthModal />
        </AuthProvider>
      </body>
    </html>
  );
}
