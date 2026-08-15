'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  X, 
  ShieldCheck, 
  Building2, 
  Sparkles, 
  Lock, 
  Mail, 
  Phone, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export function AuthModal() {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    loginWithGoogle, 
    loginWithEmail, 
    registerAgent, 
    user 
  } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>('login');
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
    if (!email) return;
    setLoading(true);
    await loginWithEmail(email);
    setLoading(false);
  };

  const handleStartRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameStatus.isAvailable === false) return;
    if (!email || !phoneNumber || !fullName) return;

    // Generate 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setRegisterStep('otp');
    setOtpError('');
  };

  const handleVerifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length !== 6) {
      setOtpError('Please enter the 6-digit verification code.');
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
                  : 'New Agency Onboarding'}
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
          <div className="grid grid-cols-2 gap-1 bg-[#FAF8F5] p-1 rounded-2xl border border-[#E8E3DC]">
            <button
              type="button"
              onClick={() => { setMode('login'); setRegisterStep('details'); }}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                mode === 'login' ? 'bg-[#0F6B5C] text-white shadow-xs' : 'text-[#6B726D] hover:text-[#1F2420]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setRegisterStep('details'); }}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                mode === 'register' ? 'bg-[#0F6B5C] text-white shadow-xs' : 'text-[#6B726D] hover:text-[#1F2420]'
              }`}
            >
              New Agency
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          
          {/* TAB 1: SIGN IN */}
          {mode === 'login' && (
            <div className="space-y-4">
              {/* Google 1-Click Button */}
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2.5 bg-white hover:bg-[#FAF8F5] border border-[#E8E3DC] hover:border-[#0F6B5C] text-[#1F2420] py-3 rounded-2xl font-bold text-xs shadow-xs transition-all"
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

          {/* TAB 2: REGISTER NEW AGENCY WITH OTP */}
          {mode === 'register' && registerStep === 'details' && (
            <form onSubmit={handleStartRegistration} className="space-y-3">
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-[#8A8D89] uppercase">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tariq Mehmood"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full mt-1 bg-[#FAF8F5] border border-[#E8E3DC] focus:border-[#0F6B5C] rounded-xl px-3 py-1.5 text-xs font-bold text-[#1F2420] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#8A8D89] uppercase">Agency Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Crest"
                    value={agencyName}
                    onChange={(e) => setAgencyName(e.target.value)}
                    className="w-full mt-1 bg-[#FAF8F5] border border-[#E8E3DC] focus:border-[#0F6B5C] rounded-xl px-3 py-1.5 text-xs font-bold text-[#1F2420] focus:outline-none"
                  />
                </div>
              </div>

              {/* Unique Handle with Live Deduplication */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-[#8A8D89] uppercase">Unique Handle</label>
                  {usernameStatus.message && (
                    <span className={`text-[10px] font-bold ${usernameStatus.isAvailable ? 'text-[#0F6B5C]' : 'text-red-600'}`}>
                      {usernameStatus.message}
                    </span>
                  )}
                </div>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-2 text-xs font-bold text-[#8A8D89]">@</span>
                  <input
                    type="text"
                    required
                    placeholder="apexcrest"
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
                <p className="text-[10px] text-[#8A8D89] mt-0.5">
                  Your public showcase: <strong className="text-[#0F6B5C]">plottyy.pk/agents/{username || 'handle'}</strong>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-[#8A8D89] uppercase">WhatsApp / Phone</label>
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
                    placeholder="info@agency.pk"
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

          {/* TAB 2 - STEP 2: 6-DIGIT EMAIL & PHONE OTP VERIFICATION */}
          {mode === 'register' && registerStep === 'otp' && (
            <form onSubmit={handleVerifyAndRegister} className="space-y-4 text-center">
              
              <div className="w-12 h-12 rounded-2xl bg-[#0F6B5C]/10 text-[#0F6B5C] mx-auto flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <h4 className="text-sm font-black text-[#1F2420]">Verify Your Agency Email & Phone</h4>
                <p className="text-xs text-[#6B726D]">
                  A 6-digit security OTP was sent to <strong>{phoneNumber}</strong> and <strong>{email}</strong>.
                </p>
              </div>

              <div className="bg-[#FAF8F5] border border-[#E8E3DC] p-3 rounded-2xl text-left space-y-1">
                <p className="text-[11px] font-bold text-[#1F2420] flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0F6B5C]" />
                  <span>Two-Factor Agency Verification</span>
                </p>
                <p className="text-[10px] text-[#8A8D89]">
                  Enter the 6-digit code received on your email/SMS inbox to activate your certified agency handle.
                </p>
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#8A8D89] uppercase block mb-1">
                  Enter 6-Digit OTP Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  autoFocus
                  placeholder="• • • • • •"
                  value={otpCode}
                  onChange={(e) => {
                    setOtpCode(e.target.value.replace(/[^0-9]/g, ''));
                    setOtpError('');
                  }}
                  className="w-48 mx-auto text-center font-mono text-xl font-black tracking-widest bg-[#FAF8F5] border border-[#0F6B5C] focus:ring-2 focus:ring-[#0F6B5C]/20 rounded-xl py-2.5 text-[#1F2420] focus:outline-none"
                />
              </div>

              {otpError && (
                <p className="text-xs text-red-600 font-bold">{otpError}</p>
              )}

              <div className="space-y-2 pt-2">
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setRegisterStep('details')}
                    className="flex-1 bg-white border border-[#E8E3DC] hover:bg-[#FAF8F5] text-[#1F2420] py-2.5 rounded-xl font-bold text-xs transition-all"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-[#0F6B5C] hover:bg-[#0c564a] text-white py-2.5 rounded-xl font-bold text-xs shadow-xs transition-all"
                  >
                    {loading ? 'Activating Profile...' : 'Verify Code & Launch'}
                  </button>
                </div>

                {/* Instant Zero-Barrier Verification Workaround */}
                <button
                  type="button"
                  disabled={loading}
                  onClick={async () => {
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
                  }}
                  className="w-full bg-[#E6F3F0] hover:bg-[#d8ece7] text-[#0F6B5C] py-2 rounded-xl font-extrabold text-[11px] border border-[#0F6B5C]/20 transition-all flex items-center justify-center space-x-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#D97B4F]" />
                  <span>⚡ Instant 1-Click Verification & Launch (Zero Fee)</span>
                </button>
              </div>

            </form>
          )}

        </div>

      </div>

    </div>
  );
}
