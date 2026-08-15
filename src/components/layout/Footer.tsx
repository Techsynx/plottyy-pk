import React from 'react';
import Link from 'next/link';
import { Compass, ShieldCheck, MapPin, PhoneCall, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#1F2420] text-[#8A8D89] pt-14 pb-8 border-t border-black/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-lg bg-[#0F6B5C] flex items-center justify-center">
                <Compass className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white font-sans">
                plot<span className="text-[#D97B4F]">tyy</span>
              </span>
            </Link>
            <p className="text-sm text-[#8A8D89] max-w-sm leading-relaxed">
              Pakistan&apos;s modern property and plot search marketplace. Clean discovery, OTP-verified listers, transparent pricing in Lakh & Crore, and direct seller connectivity.
            </p>
            <div className="flex items-center space-x-2 text-xs text-[#7FA37A]">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Phone Verified Listings & Secure Direct Connections</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Popular Plots</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/listings?type=plot&city=Lahore" className="hover:text-white transition-colors">Plots in Lahore</Link></li>
              <li><Link href="/listings?type=plot&city=Islamabad" className="hover:text-white transition-colors">Plots in Islamabad</Link></li>
              <li><Link href="/listings?type=plot&city=Karachi" className="hover:text-white transition-colors">Plots in Karachi</Link></li>
              <li><Link href="/listings?type=plot&city=Rawalpindi" className="hover:text-white transition-colors">Plots in Rawalpindi</Link></li>
              <li><Link href="/listings?type=plot&subtype=commercial_plot" className="hover:text-white transition-colors">Commercial Plots</Link></li>
            </ul>
          </div>

          {/* Top Societies */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Top Societies</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/listings?query=DHA" className="hover:text-white transition-colors">DHA Lahore & Karachi</Link></li>
              <li><Link href="/listings?query=Bahria" className="hover:text-white transition-colors">Bahria Town Projects</Link></li>
              <li><Link href="/listings?query=Gulberg" className="hover:text-white transition-colors">Gulberg Greens & Lahore</Link></li>
              <li><Link href="/listings?query=Lake+City" className="hover:text-white transition-colors">Lake City Lahore</Link></li>
              <li><Link href="/listings?query=B-17" className="hover:text-white transition-colors">B-17 Multi Gardens</Link></li>
            </ul>
          </div>

          {/* Calculators & Info */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Listers & Tools</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/create" className="hover:text-white transition-colors">List Your Property</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Lister Dashboard</Link></li>
              <li><span className="text-xs text-white/50">1 Marla = 225 Sq. Ft</span></li>
              <li><span className="text-xs text-white/50">1 Kanal = 20 Marla (4,500 Sq. Ft)</span></li>
              <li><span className="text-xs text-white/50">1 Sq. Yard = 9 Sq. Ft</span></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8A8D89] space-y-4 sm:space-y-0">
          <p>© {new Date().getFullYear()} plottyy.pk — Pakistan Real Estate Marketplace. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/disclaimer" className="hover:text-white transition-colors">Legal Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
