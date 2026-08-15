'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { PROFILES_DATA } from '@/lib/data/mock-db';
import { 
  Building2, 
  ShieldCheck, 
  Mail, 
  Lock, 
  Phone, 
  User, 
  CheckCircle2, 
  X, 
  ArrowRight,
  Sparkles,
  MapPin
} from 'lucide-react';

export function AuthModal() {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    loginWithGoogle, 
    loginWithEmail, 
    registerAgent, 
    switchAgentAccount,
    user 
  } = useAuth();

  const [mode, setMode] = useState<'login' | 'register' | 'switch'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [agencyName, setAgencyName] = useState('');
  const [username, setUsername] = useState('');
  const [usernameStatus, setUsernameStatus] = useState<{ isAvailable?: boolean; message?: string; checking?: boolean }>({});
  const [phoneNumber, setPhoneNumber] = useState('');
  const [operatingCity, setOperatingCity] = useState('Lahore');
  const [loading, setLoading] = useState(false);

  // Live deduplication check for username
  const handleUsernameChange = async (rawVal: string) => {
    const clean = rawVal.toLowerCase().replace(/[^a-z0-9_-]/g, '');
    setUsername(clean);
    if (!clean || clean.length < 3) {
      setUsernameStatus({ isAvailable: false, message: 'Minimum 3 characters required' });
      return;
    }
    setUsernameStatus({ checking: true });
    const { checkUsernameAvailability } = await import('@/lib/actions/agents');
    const res = await checkUsernameAvailability(clean, user?.id);
    setUsernameStatus({ isAvailable: res.isAvailable, message: res.message });
  };

  if (!isAuthModalOpen) return null;

  const handleGoogleAuth = async () => {
    setLoading(true);
    await loginWithGoogle();
    setLoading(false);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'register' && usernameStatus.isAvailable === false) {
      return;
    }
    setLoading(true);
    if (mode === 'login') {
      await loginWithEmail(email || 'malik.tariq@alrehmanestates.pk');
    } else {
      await registerAgent({
        full_name: fullName,
        username,
        email,
        agency_name: agencyName,
        phone_number: phoneNumber,
        operating_areas: [operatingCity],
      });
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 border border-[#E8E3DC] shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#E8E3DC]">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#0F6B5C] flex items-center justify-center text-white font-black text-sm">
              p
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-[#1F2420]">
                {mode === 'login' ? 'Agent & Lister Sign In' : mode === 'register' ? 'Register Estate Agency' : 'Switch Agent Account'}
              </h3>
              <p className="text-[11px] text-[#8A8D89]">
                plottyy Pakistan Verified Real Estate Marketplace
              </p>
            </div>
          </div>
          <button 
            onClick={closeAuthModal} 
            className="p-1.5 rounded-xl text-[#8A8D89] hover:bg-[#FAF8F5] hover:text-[#1F2420] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="grid grid-cols-3 gap-1 bg-[#FAF8F5] p-1 rounded-2xl border border-[#E8E3DC]">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'login' ? 'bg-[#0F6B5C] text-white shadow-xs' : 'text-[#6B726D] hover:text-[#1F2420]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'register' ? 'bg-[#0F6B5C] text-white shadow-xs' : 'text-[#6B726D] hover:text-[#1F2420]'
            }`}
          >
            New Agency
          </button>
          <button
            type="button"
            onClick={() => setMode('switch')}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'switch' ? 'bg-[#0F6B5C] text-white shadow-xs' : 'text-[#6B726D] hover:text-[#1F2420]'
            }`}
          >
            Demo Agents
          </button>
        </div>

        {/* FAST SWITCHER FOR DEMO / EVALUATION */}
        {mode === 'switch' && (
          <div className="space-y-3">
            <p className="text-xs text-[#6B726D]">
              Select any pre-configured top Pakistani real estate agency profile to experience their personal dashboard and leads:
            </p>
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {PROFILES_DATA.map((p) => {
                const isActive = user?.id === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      switchAgentAccount(p.id);
                      closeAuthModal();
                    }}
                    className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                      isActive 
                        ? 'border-[#0F6B5C] bg-[#E6F3F0]/60 ring-2 ring-[#0F6B5C]/20'
                        : 'border-[#E8E3DC] hover:border-[#0F6B5C] hover:bg-[#FAF8F5]'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <img 
                        src={p.avatar_url || ''} 
                        alt={p.full_name} 
                        className="w-10 h-10 rounded-full object-cover border border-[#E8E3DC]"
                      />
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <h4 className="text-xs font-extrabold text-[#1F2420]">{p.full_name}</h4>
                          {p.is_verified && <ShieldCheck className="w-3.5 h-3.5 text-[#0F6B5C]" />}
                        </div>
                        <p className="text-[11px] text-[#6B726D]">{p.agency_name}</p>
                        <p className="text-[10px] text-[#8A8D89]">{p.phone_number}</p>
                      </div>
                    </div>
                    {isActive ? (
                      <span className="text-[10px] font-bold bg-[#0F6B5C] text-white px-2.5 py-1 rounded-full">
                        Active
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-[#0F6B5C] hover:underline">
                        Switch
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* LOGIN / REGISTER WITH GOOGLE & EMAIL */}
        {mode !== 'switch' && (
          <div className="space-y-4">
            
            {/* Google Sign In Button */}
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={loading}
              className="w-full flex items-center justify-center space-x-3 bg-white hover:bg-[#FAF8F5] border border-[#E8E3DC] text-[#1F2420] py-3 rounded-2xl font-bold text-xs shadow-xs transition-all hover:border-[#0F6B5C]"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google Account</span>
            </button>

            <div className="flex items-center space-x-2">
              <div className="flex-1 h-px bg-[#E8E3DC]" />
              <span className="text-[10px] font-bold text-[#8A8D89] uppercase tracking-wider">
                Or with business credentials
              </span>
              <div className="flex-1 h-px bg-[#E8E3DC]" />
            </div>

            {/* Email Form */}
            <form onSubmit={handleEmailSubmit} className="space-y-3">
              
              {mode === 'register' && (
                <>
                  <div>
                    <label className="text-[11px] font-bold text-[#8A8D89] uppercase tracking-wider">
                      Agent Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Chaudhry Aslam"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        if (!username && e.target.value) {
                          handleUsernameChange(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''));
                        }
                      }}
                      className="w-full mt-1 bg-[#FAF8F5] border border-[#E8E3DC] focus:border-[#0F6B5C] rounded-xl px-3.5 py-2 text-xs font-bold text-[#1F2420] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#8A8D89] uppercase tracking-wider">
                      Agency / Company Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Royal Estate DHA Lahore"
                      value={agencyName}
                      onChange={(e) => setAgencyName(e.target.value)}
                      className="w-full mt-1 bg-[#FAF8F5] border border-[#E8E3DC] focus:border-[#0F6B5C] rounded-xl px-3.5 py-2 text-xs font-bold text-[#1F2420] focus:outline-none"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-[#8A8D89] uppercase tracking-wider">
                        Unique Agency Handle / Username
                      </label>
                      {usernameStatus.message && (
                        <span className={`text-[10px] font-bold ${usernameStatus.isAvailable ? 'text-[#0F6B5C]' : 'text-red-600'}`}>
                          {usernameStatus.message}
                        </span>
                      )}
                    </div>
                    <div className="relative mt-1">
                      <span className="absolute left-3.5 top-2 text-xs font-bold text-[#8A8D89]">@</span>
                      <input
                        type="text"
                        required
                        placeholder="royalestate"
                        value={username}
                        onChange={(e) => handleUsernameChange(e.target.value)}
                        className={`w-full bg-[#FAF8F5] border rounded-xl pl-8 pr-3.5 py-2 text-xs font-bold text-[#1F2420] focus:outline-none ${
                          usernameStatus.isAvailable === false
                            ? 'border-red-400 focus:border-red-500'
                            : usernameStatus.isAvailable
                            ? 'border-[#0F6B5C] focus:border-[#0F6B5C]'
                            : 'border-[#E8E3DC] focus:border-[#0F6B5C]'
                        }`}
                      />
                    </div>
                    <p className="text-[10px] text-[#8A8D89] mt-0.5">
                      Your public showcase URL: <strong className="text-[#0F6B5C]">plottyy.pk/agents/{username || 'yourhandle'}</strong>
                    </p>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#8A8D89] uppercase tracking-wider">
                      WhatsApp / Calling Number
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="0300 1234567"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full mt-1 bg-[#FAF8F5] border border-[#E8E3DC] focus:border-[#0F6B5C] rounded-xl px-3.5 py-2 text-xs font-bold text-[#1F2420] focus:outline-none"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="text-[11px] font-bold text-[#8A8D89] uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="agent@agency.pk"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full mt-1 bg-[#FAF8F5] border border-[#E8E3DC] focus:border-[#0F6B5C] rounded-xl px-3.5 py-2 text-xs font-bold text-[#1F2420] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#8A8D89] uppercase tracking-wider">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full mt-1 bg-[#FAF8F5] border border-[#E8E3DC] focus:border-[#0F6B5C] rounded-xl px-3.5 py-2 text-xs font-bold text-[#1F2420] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0F6B5C] hover:bg-[#0c564a] text-white py-3 rounded-2xl font-bold text-xs shadow-sm transition-all flex items-center justify-center space-x-1.5"
              >
                <span>{loading ? 'Authenticating...' : mode === 'login' ? 'Sign In to Lister Portal' : 'Register & Start Listing'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

            </form>

          </div>
        )}

      </div>
    </div>
  );
}
