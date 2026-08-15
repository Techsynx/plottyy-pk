'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Building2, 
  PlusCircle, 
  MapPin, 
  LayoutDashboard, 
  Menu, 
  X, 
  Compass,
  ShieldCheck, 
  ChevronDown, 
  User, 
  LogOut, 
  Sparkles,
  LogIn
} from 'lucide-react';
import { CITIES_DATA } from '@/lib/data/mock-db';
import { useAuth } from '@/context/AuthContext';

export function Navbar() {
  const pathname = usePathname();
  const { user, openAuthModal, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState('Lahore');

  const navLinks = [
    { label: 'Explore Plots', href: '/listings?type=plot&purpose=sale' },
    { label: 'Houses', href: '/listings?type=house&purpose=sale' },
    { label: 'Commercial', href: '/listings?type=commercial&purpose=sale' },
    { label: 'Agencies & Agents', href: '/agents' },
    { label: 'Dashboard', href: '/dashboard' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0F6B5C] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          
          {/* Brand Logo & City Selector */}
          <div className="flex items-center space-x-3 sm:space-x-4 flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center group-hover:bg-[#D97B4F] transition-all">
                <Compass className="w-5 h-5 sm:w-6 sm:h-6 text-[#FAF8F5]" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-black tracking-tight font-sans text-white leading-none">
                  plot<span className="text-[#D97B4F]">tyy</span>
                </span>
                <span className="text-[9px] sm:text-[10px] text-white/70 font-bold tracking-wider uppercase">
                  Pakistan Real Estate
                </span>
              </div>
            </Link>

            {/* City Dropdown Selector (Compact on intermediate screens) */}
            <div className="hidden md:flex items-center bg-black/20 hover:bg-black/30 border border-white/15 rounded-xl px-2 py-1.5 text-xs text-white/90">
              <MapPin className="w-3.5 h-3.5 mr-1 text-[#D97B4F] flex-shrink-0" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                aria-label="Select City"
                className="bg-transparent text-white font-bold focus:outline-none cursor-pointer text-xs"
              >
                {CITIES_DATA.map((c) => (
                  <option key={c.id} value={c.name} className="text-gray-900 font-medium">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Desktop Nav Links (Only on wide screens to prevent overflow) */}
          <nav className="hidden xl:flex items-center space-x-1 flex-shrink-0">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-white/20 text-white shadow-xs'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Hub */}
          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            
            {/* Authenticated Agent / Public User Profile Menu */}
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 bg-black/20 hover:bg-black/30 border border-white/15 px-2 py-1.5 rounded-xl transition-all"
                >
                  <img
                    src={user.avatar_url || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100'}
                    alt={user.full_name}
                    className="w-7 h-7 rounded-lg object-cover border border-white/40 bg-white"
                  />
                  <div className="text-left hidden md:block max-w-[110px] xl:max-w-[140px]">
                    <p className="text-xs font-bold text-white truncate flex items-center space-x-1">
                      <span className="truncate">{user.full_name}</span>
                      {user.is_verified && <ShieldCheck className="w-3 h-3 text-[#7FA37A] flex-shrink-0" />}
                    </p>
                    <p className="text-[10px] text-white/70 truncate">{user.agency_name || `@${user.username}`}</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-white/70" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div 
                    onClick={() => setUserDropdownOpen(false)}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-[#E8E3DC] shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150 text-[#1F2420]"
                  >
                    <div className="px-4 py-2 border-b border-[#E8E3DC]">
                      <p className="text-xs font-bold text-[#1F2420]">{user.full_name}</p>
                      <p className="text-[11px] text-[#0F6B5C] font-semibold">{user.agency_name}</p>
                      <p className="text-[10px] text-[#8A8D89] font-mono mt-0.5">{user.phone_number}</p>
                    </div>

                    <Link
                      href="/dashboard"
                      className="flex items-center space-x-2 px-4 py-2.5 text-xs font-bold text-[#1F2420] hover:bg-[#FAF8F5]"
                    >
                      <LayoutDashboard className="w-4 h-4 text-[#0F6B5C]" />
                      <span>Lister Dashboard</span>
                    </Link>

                    <Link
                      href={`/agents/${user.username || user.id}`}
                      className="flex items-center space-x-2 px-4 py-2.5 text-xs font-bold text-[#1F2420] hover:bg-[#FAF8F5]"
                    >
                      <User className="w-4 h-4 text-[#0F6B5C]" />
                      <span>My Public Agency Page</span>
                    </Link>

                    <button
                      type="button"
                      onClick={openAuthModal}
                      className="w-full flex items-center space-x-2 px-4 py-2.5 text-xs font-bold text-[#1F2420] hover:bg-[#FAF8F5] text-left border-t border-[#E8E3DC]"
                    >
                      <Sparkles className="w-4 h-4 text-[#D97B4F]" />
                      <span>Add / Register Agency</span>
                    </button>

                    <button
                      type="button"
                      onClick={logout}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={openAuthModal}
                className="flex items-center space-x-1.5 text-xs font-bold bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-2 rounded-xl transition-all"
              >
                <LogIn className="w-3.5 h-3.5 text-[#D97B4F]" />
                <span className="hidden sm:inline">Agent Sign In</span>
                <span className="sm:hidden">Login</span>
              </button>
            )}

            {/* List Your Property CTA */}
            <Link
              href="/create"
              className="flex items-center space-x-1.5 bg-[#D97B4F] hover:bg-[#c4683c] text-white font-bold text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-xl shadow-xs hover:shadow transition-all transform active:scale-95 flex-shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">List Your Property</span>
              <span className="sm:hidden">List</span>
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl text-white hover:bg-white/10 focus:outline-none transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile / Tablet Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#0a483e] border-t border-white/10 px-4 pt-3 pb-5 space-y-2 animate-in slide-in-from-top-2 duration-150">
          
          <div className="flex items-center justify-between bg-black/20 rounded-xl p-2.5 text-xs mb-2">
            <div className="flex items-center text-white/80">
              <MapPin className="w-4 h-4 mr-2 text-[#D97B4F]" />
              <span>Selected City:</span>
            </div>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              aria-label="Mobile City Selector"
              className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
            >
              {CITIES_DATA.map((c) => (
                <option key={c.id} value={c.name} className="text-gray-900">
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-sm font-bold text-white/90 hover:bg-white/10"
            >
              {link.label}
            </Link>
          ))}

          {user && (
            <Link
              href={`/agents/${user.username || user.id}`}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-sm font-bold text-[#FAF8F5] bg-white/10"
            >
              My Public Profile (@{user.username})
            </Link>
          )}

          <div className="pt-2 border-t border-white/10 space-y-2">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                openAuthModal();
              }}
              className="w-full py-2.5 bg-white/10 text-white rounded-xl text-xs font-bold"
            >
              {user ? 'Add / Register Another Agency' : 'Agent Sign In with Google / Email'}
            </button>

            <Link
              href="/create"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center space-x-2 w-full bg-[#D97B4F] text-white py-3 rounded-xl font-bold text-sm shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>List Your Property (100% Free)</span>
            </Link>
          </div>

        </div>
      )}
    </header>
  );
}
