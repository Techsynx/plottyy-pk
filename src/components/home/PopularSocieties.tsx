import React from 'react';
import Link from 'next/link';
import { MapPin, ArrowRight, Layers, ShieldCheck } from 'lucide-react';

const SOCIETIES = [
  {
    name: 'DHA Defence Phase 6',
    city: 'Lahore',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=80',
    availablePlots: '48+ Plots',
    priceRange: 'PKR 1.8 Cr - 8.5 Cr',
    slug: '/listings?city=Lahore&query=DHA+Phase+6',
  },
  {
    name: 'Bahria Town Sector C',
    city: 'Lahore',
    image: 'https://images.unsplash.com/photo-1524813686514-a57563d77d61?w=600&auto=format&fit=crop&q=80',
    availablePlots: '32+ Plots',
    priceRange: 'PKR 95 Lakh - 3.2 Cr',
    slug: '/listings?city=Lahore&query=Bahria+Sector+C',
  },
  {
    name: 'Gulberg Greens Agro Farms',
    city: 'Islamabad',
    image: 'https://images.unsplash.com/photo-1500076656116-558758c991c1?w=600&auto=format&fit=crop&q=80',
    availablePlots: '19+ Plots',
    priceRange: 'PKR 4.5 Cr - 18 Cr',
    slug: '/listings?city=Islamabad&query=Gulberg+Greens',
  },
  {
    name: 'DHA Phase 8 Beach Avenue',
    city: 'Karachi',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80',
    availablePlots: '27+ Plots',
    priceRange: 'PKR 6.5 Cr - 25 Cr',
    slug: '/listings?city=Karachi&query=DHA+Phase+8',
  },
];

export function PopularSocieties() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-[#0F6B5C] uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5" />
            <span>High Demand Pakistani Hubs</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F2420] tracking-tight mt-1">
            Top Housing Societies for Plots & Homes
          </h2>
        </div>
        <Link
          href="/listings?type=plot"
          className="text-xs font-bold text-[#0F6B5C] hover:text-[#0c564a] flex items-center space-x-1"
        >
          <span>Explore all societies</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {SOCIETIES.map((soc) => (
          <Link
            key={soc.name}
            href={soc.slug}
            className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-black/40 property-card-shadow block"
          >
            <img
              src={soc.image}
              alt={soc.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"></div>

            <div className="absolute top-3 right-3 bg-white/20 backdrop-blur text-white text-[10px] font-bold px-2 py-0.5 rounded">
              {soc.availablePlots}
            </div>

            <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
              <span className="text-[11px] text-[#7FA37A] font-bold uppercase tracking-wider block">
                {soc.city}
              </span>
              <h3 className="font-extrabold text-base text-white group-hover:text-[#D97B4F] transition-colors leading-tight">
                {soc.name}
              </h3>
              <p className="text-[11px] text-white/80 font-medium">
                {soc.priceRange}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
