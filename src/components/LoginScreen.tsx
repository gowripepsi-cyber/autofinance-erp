import React, { useState } from 'react';
import { Lock, User, ShieldAlert, CheckCircle, Database, PlusCircle, ArrowLeft } from 'lucide-react';

interface LoginScreenProps {
  onVerifyCredentials: (username: string, password: string) => Promise<{
    success: boolean;
    user?: { username: string; fullName: string; role?: 'admin' | 'user' | 'demo' | null };
    message?: string;
  }>;
  onRegisterUser: (newUser: {
    id: string;
    username: string;
    email: string;
    password: string;
    fullName: string;
    businessName: string;
    address: string;
    mobileNumber: string;
    role?: 'admin' | 'user' | 'demo' | null;
    status: 'Pending';
  }) => Promise<{ success: boolean; message: string }>;
}

export default function LoginScreen({ onVerifyCredentials, onRegisterUser }: LoginScreenProps) {
  // Navigation between Login and Sign Up
  const [isSignUpMode, setIsSignUpMode] = useState(false);

  // Form Fields (Login & Registration)
  const [username, setUsername] = useState(''); // Email or Username for Login
  const [password, setPassword] = useState('');
  
  // Registration Fields
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [address, setAddress] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');

  // UI States
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const isDbConfigured = supabaseUrl && supabaseUrl !== 'YOUR_SUPABASE_URL' && supabaseUrl.startsWith('http');

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMessage("Please enter both username and password.");
      triggerShake();
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await onVerifyCredentials(username.trim().toLowerCase(), password.trim());
      if (res.success) {
        // Authentication completed successfully
      } else {
        triggerShake();
        setErrorMessage(res.message || "Invalid credentials.");
      }
    } catch (err) {
      console.error(err);
      triggerShake();
      setErrorMessage("System credentials check failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !businessName.trim() || !address.trim() || !mobileNumber.trim() || !email.trim() || !password.trim()) {
      setErrorMessage("Please fill in all registration fields.");
      triggerShake();
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const generatedId = `USR-${Math.floor(100 + Math.random() * 900)}`;

    try {
      const res = await onRegisterUser({
        id: generatedId,
        username: email.trim().toLowerCase(), // We use email as the username for login
        email: email.trim().toLowerCase(),
        password: password.trim(),
        fullName: fullName.trim(),
        businessName: businessName.trim(),
        address: address.trim(),
        mobileNumber: mobileNumber.trim(),
        role: null,
        status: 'Pending'
      });

      if (res.success) {
        setSuccessMessage(res.message);
        // Reset fields and go back to login screen
        setUsername(email.trim().toLowerCase());
        setFullName('');
        setBusinessName('');
        setAddress('');
        setMobileNumber('');
        setEmail('');
        setPassword('');
        setIsSignUpMode(false);
      } else {
        triggerShake();
        setErrorMessage(res.message);
      }
    } catch (err) {
      console.error(err);
      triggerShake();
      setErrorMessage("Registration process failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-screen flex items-center justify-center bg-[#091426] overflow-hidden select-none font-sans">
      {/* Self-contained CSS for shake animation */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-6px); }
          20%, 40%, 60%, 80% { transform: translateX(6px); }
        }
        .shake-animation {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>

      {/* Decorative blurred background shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-[45vw] h-[45vw] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-[30%] right-[20%] w-[25vw] h-[25vw] rounded-full bg-[#645efb]/80 opacity-[0.06] blur-[90px] pointer-events-none" />

      {/* Main Container Card */}
      <div className="w-full max-w-[430px] p-6 relative z-10 flex flex-col gap-6">
        {/* Connection status tag */}
        <div className="mx-auto">
          {isDbConfigured ? (
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Supabase Cloud Connected</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-wider">
              <Database className="w-3.5 h-3.5" />
              <span>Offline Fallback Mode Active</span>
            </div>
          )}
        </div>

        {/* Card Body */}
        <div 
          className={`bg-white/[0.03] backdrop-blur-xl border border-white/[0.07] rounded-3xl p-8 shadow-2xl flex flex-col transition-all duration-300 ${
            isShaking ? 'shake-animation border-red-500/30' : ''
          }`}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex w-12 h-12 bg-[#645efb] rounded-2xl items-center justify-center text-white shadow-lg shadow-[#645efb]/25 mb-4">
              <Lock className="w-5.5 h-5.5" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight leading-tight">AutoFinance ERP</h1>
            <p className="text-xs text-slate-400 mt-1.5">
              {isSignUpMode 
                ? "Register a new user account" 
                : "Sign in to access corporate ledger operations"
              }
            </p>
          </div>

          {/* Success Notification */}
          {successMessage && (
            <div className="flex items-start gap-2.5 p-3 mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold leading-normal animate-pulse">
              <CheckCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="flex items-start gap-2.5 p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold leading-normal">
              <ShieldAlert className="w-4.5 h-4.5 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Forms switcher */}
          {!isSignUpMode ? (
            /* LOGIN FORM */
            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
              {/* Email / Username Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email ID / Username</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isLoading}
                    placeholder="Enter email or username"
                    className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-[#645efb] focus:bg-white/[0.06] rounded-xl pl-11 pr-4 py-3 font-sans text-sm text-white placeholder-slate-500 outline-none transition-all duration-150"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    placeholder="Enter access code"
                    className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-[#645efb] focus:bg-white/[0.06] rounded-xl pl-11 pr-4 py-3 font-sans text-sm text-white placeholder-slate-500 outline-none transition-all duration-150"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#645efb] text-white py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#524be3] active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 disabled:pointer-events-none transition-all cursor-pointer shadow-lg shadow-[#645efb]/15 mt-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <span>Access Dashboard</span>
                )}
              </button>

              <div className="text-center mt-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUpMode(true);
                    setErrorMessage(null);
                    setSuccessMessage(null);
                    setFullName('');
                    setPassword('');
                  }}
                  className="inline-flex items-center gap-1.5 text-xs text-[#645efb] font-semibold hover:underline cursor-pointer border-none bg-transparent"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Register new User Account</span>
                </button>
              </div>
            </form>
          ) : (
            /* SIGN UP FORM */
            <form onSubmit={handleSignUpSubmit} className="flex flex-col gap-4">
              {/* Name Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={isLoading}
                  placeholder="Enter full name"
                  className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-[#645efb] focus:bg-white/[0.06] rounded-xl px-4 py-2.5 font-sans text-sm text-white placeholder-slate-500 outline-none transition-all duration-150"
                />
              </div>

              {/* Business Name Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Business Name</label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  disabled={isLoading}
                  placeholder="Enter business entity name"
                  className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-[#645efb] focus:bg-white/[0.06] rounded-xl px-4 py-2.5 font-sans text-sm text-white placeholder-slate-500 outline-none transition-all duration-150"
                />
              </div>

              {/* Address Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  disabled={isLoading}
                  placeholder="Enter office / company address"
                  className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-[#645efb] focus:bg-white/[0.06] rounded-xl px-4 py-2.5 font-sans text-sm text-white placeholder-slate-500 outline-none transition-all duration-150"
                />
              </div>

              {/* Mobile Number Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mobile Number</label>
                <input
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  disabled={isLoading}
                  placeholder="Enter mobile contact number"
                  className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-[#645efb] focus:bg-white/[0.06] rounded-xl px-4 py-2.5 font-sans text-sm text-white placeholder-slate-500 outline-none transition-all duration-150"
                />
              </div>

              {/* Email ID Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email ID</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  placeholder="Enter corporate email ID"
                  className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-[#645efb] focus:bg-white/[0.06] rounded-xl px-4 py-2.5 font-sans text-sm text-white placeholder-slate-500 outline-none transition-all duration-150"
                />
              </div>

              {/* Password Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    placeholder="Create access code"
                    className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-[#645efb] focus:bg-white/[0.06] rounded-xl pl-11 pr-4 py-3 font-sans text-sm text-white placeholder-slate-500 outline-none transition-all duration-150"
                  />
                </div>
              </div>

              {/* Role selection removed for client SaaS flow */}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#645efb] text-white py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#524be3] active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 disabled:pointer-events-none transition-all cursor-pointer shadow-lg shadow-[#645efb]/15 mt-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>Registering Account...</span>
                  </>
                ) : (
                  <span>Request Account</span>
                )}
              </button>

              <div className="text-center mt-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUpMode(false);
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white cursor-pointer border-none bg-transparent"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Demo Accounts Panel */}
        <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-4 text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Default Admin Credentials</p>
          <div className="flex justify-center gap-6 text-[11px] text-slate-400 font-mono">
            <div>
              <span className="text-white font-semibold">admin</span> / <span>admin123</span>
              <p className="text-[9px] text-[#645efb] mt-0.5 uppercase tracking-wide font-bold">Admin</p>
            </div>
            <div className="w-[1px] bg-white/10" />
            <div>
              <span className="text-white font-semibold">staff</span> / <span>staff123</span>
              <p className="text-[9px] text-[#645efb] mt-0.5 uppercase tracking-wide font-bold">User</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
