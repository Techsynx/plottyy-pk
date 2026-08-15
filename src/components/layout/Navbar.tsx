'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Building2, 
  PlusCircle, 
  MapPin, 
  LayoutDashboard, 
  Search, 
  Menu, 
  X, 
  Compass,
  CheckCircle2,
  Users,
  ShieldCheck,
  ChevronDown,
  User,
  LogOut,
  Sparkles
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & City Selector */}
          <div className="flex items-center space-x-6">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center group-hover:bg-[#D97B4F] transition-all">
                <Compass className="w-6 h-6 text-[#FAF8F5]" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold tracking-tight font-sans text-white leading-none">
                  plot<span className="text-[#D97B4F]">tyy</span>
                </span>
                <span className="text-[10px] text-white/70 font-medium tracking-wider uppercase">
                  Pakistan Real Estate
                </span>
              </div>
            </Link>

            {/* City Dropdown Selector */}
            <div className="hidden md:flex items-center bg-black/20 hover:bg-black/30 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white/90">
              <MapPin className="w-3.5 h-3.5 mr-1.5 text-[#D97B4F]" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-transparent text-white font-medium focus:outline-none cursor-pointer pr-1"
              >
                {CITIES_DATA.map((c) => (
                  <option key={c.id} value={c.name} className="text-gray-900">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-white/15 text-white'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Hub */}
          <div className="hidden sm:flex items-center space-x-3">
            
            {/* Agent / User Profile Menu */}
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 bg-black/20 hover:bg-black/30 border border-white/15 px-2.5 py-1.5 rounded-xl transition-all"
                >
                  <img
                    src={user.avatar_url || ''}
                    alt={user.full_name}
                    className="w-7 h-7 rounded-lg object-cover border border-white/40 bg-white"
                  />
                  <div className="text-left hidden xl:block">
                    <p className="text-xs font-bold text-white line-clamp-1 flex items-center space-x-1">
                      <span>{user.full_name}</span>
                      {user.is_verified && <ShieldCheck className="w-3 h-3 text-[#7FA37A]" />}
                    </p>
                    <p className="text-[10px] text-white/70 line-clamp-1">{user.agency_name}</p>
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
                      <span>Switch / Add Agency Account</span>
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
                className="text-xs font-bold bg-white/10 hover:bg-white/20 border border-white/20 px-3.5 py-2 rounded-xl transition-all"
              >
                Agent Sign In
              </button>
            )}

            {/* List Your Property CTA */}
            <Link
              href="/create"
              className="flex items-center space-x-2 bg-[#D97B4F] hover:bg-[#c4683c] text-white font-semibold text-sm px-4 py-2 rounded-xl shadow-sm hover:shadow transition-all transform active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>List Your Property</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              type="button"
              onClick={openAuthModal}
              className="bg-white/10 text-white p-2 rounded-lg text-xs"
            >
              <User className="w-5 h-5" />
            </button>
            <Link
              href="/create"
              className="bg-[#D97B4F] text-white p-2 rounded-lg text-xs font-semibold"
            >
              <PlusCircle className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-white hover:bg-white/10 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0a483e] border-t border-white/10 px-4 pt-3 pb-5 space-y-2">
          <div className="flex items-center justify-between bg-black/20 rounded-lg p-2.5 text-xs mb-3">
            <div className="flex items-center text-white/80">
              <MapPin className="w-4 h-4 mr-2 text-[#D97B4F]" />
              <span>Selected City:</span>
            </div>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
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
              className="block px-3 py-2.5 rounded-lg text-sm font-medium text-white/90 hover:bg-white/10"
            >
              {link.label}
            </Link>
          ))}

          {user && (
            <Link
              href={`/agents/${user.username || user.id}`}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-sm font-medium text-[#FAF8F5] bg-white/10"
            >
              My Agency Profile ({user.agency_name})
            </Link>
          )}

          <div className="pt-2 border-t border-white/10 space-y-2">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                openAuthModal();
              }}
              className="w-full py-2.5 bg-white/10 text-white rounded-lg text-xs font-bold"
            >
              {user ? 'Switch Agent Profile' : 'Agent Sign In with Google'}
            </button>

            <Link
              href="/create"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center space-x-2 w-full bg-[#D97B4F] text-white py-3 rounded-lg font-semibold text-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>List Your Property (Free)</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
