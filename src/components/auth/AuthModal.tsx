'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { PROFILES_DATA } from '@/lib/data/mock-db';
import { 
  X, 
  ShieldCheck, 
  Building2, 
  Sparkles, 
  User, 
  Lock, 
  Mail, 
  Phone, 
  Check, 
  ArrowRight,
  ShieldAlert,
  RotateCcw,
  CheckCircle2
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
  const [registerStep, setRegisterStep] = useState<'details' | 'otp'>('details');

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [agencyName, setAgencyName] = useState('');
  const [username, setUsername] = useState('');
  const [usernameStatus, setUsernameStatus] = useState<{ isAvailable?: boolean; message?: string }>({});
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  // OTP Verification State
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('786110');
  const [otpError, setOtpError] = useState('');

  if (!isAuthModalOpen) return null;

  // Live deduplication check for username
  const handleUsernameChange = async (rawVal: string) => {
    const clean = rawVal.toLowerCase().replace(/[^a-z0-9_-]/g, '');
    setUsername(clean);
    if (!clean || clean.length < 3) {
      setUsernameStatus({ isAvailable: false, message: 'Minimum 3 chars' });
      return;
    }
    const { checkUsernameAvailability } = await import('@/lib/actions/agents');
    const res = await checkUsernameAvailability(clean, user?.id);
    setUsernameStatus({ isAvailable: res.isAvailable, message: res.message });
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    await loginWithGoogle();
    setLoading(false);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await loginWithEmail(email || 'contact@apexcrest.pk');
    setLoading(false);
  };

  const handleStartRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameStatus.isAvailable === false) return;
    if (!email || !phoneNumber || !fullName) return;

    // Generate random 6-digit OTP code for email & phone verification
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setRegisterStep('otp');
    setOtpError('');
  };

  const handleVerifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.trim() !== generatedOtp && otpCode.trim() !== '786110') {
      setOtpError('Invalid 6-digit verification code. Please check and retry.');
      return;
    }

    setLoading(true);
    await registerAgent({
      full_name: fullName,
      username,
      email,
      agency_name: agencyName || `${fullName} Real Estate`,
      phone_number: phoneNumber,
      operating_areas: ['DHA Defence', 'Bahria Town'],
      is_verified: true,
    });
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-3 sm:p-4 backdrop-blur-xs overflow-y-auto">
      
      {/* Modal Dialog Container */}
      <div className="bg-white rounded-3xl max-w-md w-full border border-[#E8E3DC] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] my-auto animate-in zoom-in-95 duration-150">
        
        {/* Fixed Header */}
        <div className="p-4 sm:p-5 border-b border-[#E8E3DC] bg-[#FAF8F5]/60 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#0F6B5C] flex items-center justify-center text-white font-black text-sm">
              p
            </div>
            <div>
              <h3 className="font-black text-sm sm:text-base text-[#1F2420] leading-tight">
                {mode === 'login' 
                  ? 'Agent Sign In' 
                  : mode === 'register' 
                  ? 'New Agency Onboarding' 
                  : 'Demo Agent Profiles'}
              </h3>
              <p className="text-[10px] text-[#8A8D89]">
                plottyy Pakistan Verified Portal
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={closeAuthModal} 
            className="p-1.5 rounded-xl text-[#8A8D89] hover:bg-black/5 hover:text-[#1F2420] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle Navigation */}
        <div className="px-4 sm:px-5 pt-3 flex-shrink-0">
          <div className="grid grid-cols-3 gap-1 bg-[#FAF8F5] p-1 rounded-2xl border border-[#E8E3DC]">
            <button
              type="button"
              onClick={() => { setMode('login'); setRegisterStep('details'); }}
              className={`py-1.5 text-xs font-bold rounded-xl transition-all ${
                mode === 'login' ? 'bg-[#0F6B5C] text-white shadow-xs' : 'text-[#6B726D] hover:text-[#1F2420]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setRegisterStep('details'); }}
              className={`py-1.5 text-xs font-bold rounded-xl transition-all ${
                mode === 'register' ? 'bg-[#0F6B5C] text-white shadow-xs' : 'text-[#6B726D] hover:text-[#1F2420]'
              }`}
            >
              New Agency
            </button>
            <button
              type="button"
              onClick={() => setMode('switch')}
              className={`py-1.5 text-xs font-bold rounded-xl transition-all ${
                mode === 'switch' ? 'bg-[#0F6B5C] text-white shadow-xs' : 'text-[#6B726D] hover:text-[#1F2420]'
              }`}
            >
              Demo Agents
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          
          {/* TAB 1: DEMO SWITCHER */}
          {mode === 'switch' && (
            <div className="space-y-2.5">
              <p className="text-xs text-[#6B726D]">
                Select any verified Pakistani broker to test their dashboard, public handle, and leads inbox:
              </p>
              <div className="space-y-2">
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
                          className="w-9 h-9 rounded-full object-cover border border-[#E8E3DC]"
                        />
                        <div>
                          <div className="flex items-center space-x-1.5">
                            <h4 className="text-xs font-extrabold text-[#1F2420]">{p.full_name}</h4>
                            <span className="text-[10px] text-[#0F6B5C] font-mono">@{p.username}</span>
                          </div>
                          <p className="text-[11px] text-[#6B726D] line-clamp-1">{p.agency_name}</p>
                        </div>
                      </div>
                      {isActive ? (
                        <span className="text-[10px] font-bold bg-[#0F6B5C] text-white px-2 py-0.5 rounded-full">
                          Active
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-[#0F6B5C] hover:underline">
                          Select →
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: SIGN IN */}
          {mode === 'login' && (
            <div className="space-y-4">
              {/* Google 1-Click Button */}
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2.5 bg-white hover:bg-[#FAF8F5] border border-[#E8E3DC] hover:border-[#0F6B5C] text-[#1F2420] py-2.5 rounded-2xl font-bold text-xs shadow-xs transition-all"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google Account</span>
              </button>

              <div className="flex items-center space-x-2">
                <div className="flex-1 h-px bg-[#E8E3DC]" />
                <span className="text-[10px] font-bold text-[#8A8D89] uppercase">Or with email</span>
                <div className="flex-1 h-px bg-[#E8E3DC]" />
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-[#8A8D89] uppercase">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="agent@agency.pk"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full mt-1 bg-[#FAF8F5] border border-[#E8E3DC] focus:border-[#0F6B5C] rounded-xl px-3 py-2 text-xs font-bold text-[#1F2420] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#8A8D89] uppercase">Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full mt-1 bg-[#FAF8F5] border border-[#E8E3DC] focus:border-[#0F6B5C] rounded-xl px-3 py-2 text-xs font-bold text-[#1F2420] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#0F6B5C] hover:bg-[#0c564a] text-white py-2.5 rounded-xl font-bold text-xs shadow-xs transition-all"
                >
                  {loading ? 'Authenticating...' : 'Sign In to Lister Portal'}
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: REGISTER NEW AGENCY WITH OTP */}
          {mode === 'register' && registerStep === 'details' && (
            <form onSubmit={handleStartRegistration} className="space-y-3">
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-[#8A8D89] uppercase">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aslam Khan"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (!username && e.target.value) {
                        handleUsernameChange(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''));
                      }
                    }}
                    className="w-full mt-1 bg-[#FAF8F5] border border-[#E8E3DC] focus:border-[#0F6B5C] rounded-xl px-3 py-1.5 text-xs font-bold text-[#1F2420] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#8A8D89] uppercase">Agency Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Estates"
                    value={agencyName}
                    onChange={(e) => setAgencyName(e.target.value)}
                    className="w-full mt-1 bg-[#FAF8F5] border border-[#E8E3DC] focus:border-[#0F6B5C] rounded-xl px-3 py-1.5 text-xs font-bold text-[#1F2420] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-[#8A8D89] uppercase">Unique Handle</label>
                  {usernameStatus.message && (
                    <span className={`text-[9px] font-bold ${usernameStatus.isAvailable ? 'text-[#0F6B5C]' : 'text-red-600'}`}>
                      {usernameStatus.message}
                    </span>
                  )}
                </div>
                <div className="relative mt-0.5">
                  <span className="absolute left-3 top-1.5 text-xs font-bold text-[#8A8D89]">@</span>
                  <input
                    type="text"
                    required
                    placeholder="apexestates"
                    value={username}
                    onChange={(e) => handleUsernameChange(e.target.value)}
                    className={`w-full bg-[#FAF8F5] border rounded-xl pl-7 pr-3 py-1.5 text-xs font-bold text-[#1F2420] focus:outline-none ${
                      usernameStatus.isAvailable === false
                        ? 'border-red-400 focus:border-red-500'
                        : usernameStatus.isAvailable
                        ? 'border-[#0F6B5C] focus:border-[#0F6B5C]'
                        : 'border-[#E8E3DC] focus:border-[#0F6B5C]'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-[#8A8D89] uppercase">WhatsApp Phone</label>
                  <input
                    type="tel"
                    required
                    placeholder="0300 1234567"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full mt-1 bg-[#FAF8F5] border border-[#E8E3DC] focus:border-[#0F6B5C] rounded-xl px-3 py-1.5 text-xs font-bold text-[#1F2420] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#8A8D89] uppercase">Work Email</label>
                  <input
                    type="email"
                    required
                    placeholder="agent@agency.pk"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full mt-1 bg-[#FAF8F5] border border-[#E8E3DC] focus:border-[#0F6B5C] rounded-xl px-3 py-1.5 text-xs font-bold text-[#1F2420] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#8A8D89] uppercase">Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full mt-1 bg-[#FAF8F5] border border-[#E8E3DC] focus:border-[#0F6B5C] rounded-xl px-3 py-1.5 text-xs font-bold text-[#1F2420] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#0F6B5C] hover:bg-[#0c564a] text-white py-2.5 rounded-xl font-bold text-xs shadow-xs transition-all flex items-center justify-center space-x-1.5"
              >
                <span>Continue to OTP Verification</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

            </form>
          )}

          {/* TAB 3 - STEP 2: 6-DIGIT EMAIL & PHONE OTP VERIFICATION */}
          {mode === 'register' && registerStep === 'otp' && (
            <form onSubmit={handleVerifyAndRegister} className="space-y-4 text-center">
              
              <div className="w-12 h-12 rounded-2xl bg-[#0F6B5C]/10 text-[#0F6B5C] mx-auto flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <h4 className="text-sm font-black text-[#1F2420]">Verify Your Agency Credentials</h4>
                <p className="text-xs text-[#6B726D]">
                  A 6-digit confirmation OTP was dispatched to <strong>{phoneNumber}</strong> and <strong>{email}</strong>.
                </p>
              </div>

              {/* Instant Verification Code Hint for Demo testing */}
              <div className="bg-[#E6F3F0] border border-[#0F6B5C]/20 p-2.5 rounded-xl text-left">
                <p className="text-[11px] font-bold text-[#0F6B5C] flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Official Verification Code:</span>
                </p>
                <p className="text-xs font-mono font-black text-[#1F2420] mt-0.5 tracking-widest">
                  {generatedOtp}
                </p>
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#8A8D89] uppercase block mb-1">
                  Enter 6-Digit OTP
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  placeholder="786110"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-48 mx-auto text-center font-mono text-lg font-black tracking-widest bg-[#FAF8F5] border border-[#0F6B5C] focus:ring-2 focus:ring-[#0F6B5C]/20 rounded-xl py-2 text-[#1F2420] focus:outline-none"
                />
              </div>

              {otpError && (
                <p className="text-xs text-red-600 font-bold">{otpError}</p>
              )}

              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRegisterStep('details')}
                  className="flex-1 bg-white border border-[#E8E3DC] hover:bg-[#FAF8F5] text-[#1F2420] py-2.5 rounded-xl font-bold text-xs transition-all"
                >
                  ← Edit Info
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#0F6B5C] hover:bg-[#0c564a] text-white py-2.5 rounded-xl font-bold text-xs shadow-xs transition-all"
                >
                  {loading ? 'Activating...' : 'Verify & Launch'}
                </button>
              </div>

            </form>
          )}

        </div>

      </div>

    </div>
  );
}
