import React from 'react';
import Link from 'next/link';
import { HeroSearch } from '@/components/home/HeroSearch';
import { PopularSocieties } from '@/components/home/PopularSocieties';
import { ListingCard } from '@/components/listings/ListingCard';
import { getFilteredListings } from '@/lib/actions/listings';
import { 
  ShieldCheck, 
  MapPin, 
  Layers, 
  Sparkles, 
  PhoneCall, 
  MessageCircle, 
  ArrowRight,
  TrendingUp,
  Award,
  CheckCircle2,
  Lock
} from 'lucide-react';

export default async function HomePage() {
  const { listings } = await getFilteredListings();
  const featuredListings = listings.filter((l) => l.is_featured).slice(0, 6);

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      
      {/* 1. Hero Search Banner */}
      <HeroSearch />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* 2. Quick Category Tiles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              title: 'Residential Plots',
              subtitle: '5 Marla, 10 Marla & 1 Kanal',
              href: '/listings?type=plot&subtype=residential_plot',
              icon: Layers,
              count: '1,420+ Available',
              color: 'text-[#0F6B5C]',
              bg: 'bg-[#E6F3F0]',
            },
            {
              title: 'Commercial Land',
              subtitle: 'Plazas, Shops & Boulevards',
              href: '/listings?type=commercial',
              icon: TrendingUp,
              count: '380+ Available',
              color: 'text-[#D97B4F]',
              bg: 'bg-[#FBF0EA]',
            },
            {
              title: 'Houses & Villas',
              subtitle: 'Brand New Ready-to-Move',
              href: '/listings?type=house',
              icon: Award,
              count: '890+ Available',
              color: 'text-[#0F6B5C]',
              bg: 'bg-[#E6F3F0]',
            },
            {
              title: 'Agro Farmhouses',
              subtitle: 'Scenic Islamabad & Lahore Outskirts',
              href: '/listings?type=plot&subtype=farmhouse_plot',
              icon: Sparkles,
              count: '120+ Available',
              color: 'text-[#7FA37A]',
              bg: 'bg-[#EFF6EE]',
            },
          ].map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.title}
                href={cat.href}
                className="bg-white rounded-2xl p-5 border border-[#E8E3DC] hover:border-[#0F6B5C]/40 property-card-shadow transition-all group block"
              >
                <div className={`w-10 h-10 rounded-xl ${cat.bg} ${cat.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-sm sm:text-base text-[#1F2420] group-hover:text-[#0F6B5C] transition-colors">
                  {cat.title}
                </h3>
                <p className="text-xs text-[#6B726D] mt-0.5">{cat.subtitle}</p>
                <span className="text-[11px] font-semibold text-[#8A8D89] block mt-2">
                  {cat.count}
                </span>
              </Link>
            );
          })}
        </div>

        {/* 3. Featured Verified Properties Grid */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold text-[#0F6B5C] uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-[#7FA37A]" />
                <span>Verified by Plottyy</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F2420] tracking-tight mt-1">
                Featured Plots & Luxury Properties
              </h2>
            </div>
            <Link
              href="/listings"
              className="text-xs font-bold text-[#0F6B5C] hover:text-[#0c564a] flex items-center space-x-1"
            >
              <span>View all properties</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredListings.map((item) => (
              <ListingCard key={item.id} listing={item} />
            ))}
          </div>
        </section>

        {/* 4. Popular Societies Showcase */}
        <PopularSocieties />

        {/* 5. Why Plottyy Trust & Features Grid */}
        <section className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E8E3DC] property-card-shadow space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-extrabold text-[#0F6B5C] uppercase tracking-wider bg-[#E6F3F0] px-3 py-1 rounded-full">
              Engineered for the Pakistani Market
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#1F2420] tracking-tight">
              Why Buyers & Dealers Prefer plottyy
            </h2>
            <p className="text-xs sm:text-sm text-[#6B726D]">
              Solving real pain points in Pakistani property transactions with modern technology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#E6F3F0] text-[#0F6B5C] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#1F2420]">
                100% OTP-Verified Listers
              </h3>
              <p className="text-xs text-[#6B726D] leading-relaxed">
                Every lister must authenticate via 6-digit SMS OTP. Eliminates duplicate ghost listings, scraper bots, and fake brokerage advertisements.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FBF0EA] text-[#D97B4F] flex items-center justify-center">
                <PhoneCall className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#1F2420]">
                Protected Direct Contact
              </h3>
              <p className="text-xs text-[#6B726D] leading-relaxed">
                Click-to-reveal phone numbers protect sellers from automated marketing scrapers while providing genuine buyers instant WhatsApp and direct call connectivity.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#EFF6EE] text-[#7FA37A] flex items-center justify-center">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#1F2420]">
                Transparent Pakistani Units
              </h3>
              <p className="text-xs text-[#6B726D] leading-relaxed">
                Native support for Marla, Kanal, Sq. Yards, and Square Feet with automatic price-per-marla calculation and clean Lakh & Crore PKR formatting.
              </p>
            </div>
          </div>
        </section>

        {/* 6. Lister CTA Banner */}
        <section className="bg-gradient-to-r from-[#0F6B5C] to-[#09443a] text-white rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-bold text-[#7FA37A] uppercase tracking-wider">
              Free Property Listing
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Are you an Owner or Authorized Dealer?
            </h2>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
              List your residential plots, commercial properties, or homes today. Receive verified buyer inquiries directly on WhatsApp.
            </p>
          </div>

          <Link
            href="/create"
            className="flex-shrink-0 bg-[#D97B4F] hover:bg-[#c4683c] text-white font-extrabold text-sm px-8 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all transform active:scale-98"
          >
            List Your Property (Free)
          </Link>
        </section>

      </div>

    </div>
  );
}
