'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Lock, User, Building, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/lib/auth-store';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, initialize, authError } = useAuthStore();

  const [pno, setPno] = useState('SP-MH-0091');
  const [password, setPassword] = useState('Super@SP2026#');
  const [stationCode, setStationCode] = useState('MUM-AND-04');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState('');

  // Check existing session on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  // If already authenticated, forward to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!pno.trim() || !password) {
      setLocalError('Please enter your Officer ID and password.');
      return;
    }

    setSubmitting(true);
    const result = await login({
      pno: pno.trim(),
      password,
      stationCode: stationCode.trim() || 'MUM-AND-04',
      otp: '847291'
    });

    setSubmitting(false);
    if (result.success) {
      router.push('/dashboard');
    } else {
      setLocalError(result.error || 'Authentication failed. Please verify your credentials.');
    }
  };

  const selectDemoRole = (rolePno, rolePw) => {
    setPno(rolePno);
    setPassword(rolePw);
    setStationCode('MUM-AND-04');
    setLocalError('');
  };

  return (
    <div className="min-h-screen bg-[#090D16] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle radial glow */}
      <div className="absolute w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-3xl pointer-events-none -top-40 left-1/2 -translate-x-1/2" />

      <div className="w-full max-w-md bg-[#111827] border border-slate-800/80 rounded-2xl shadow-2xl p-8 relative z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4 shadow-inner">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-semibold text-slate-100 tracking-tight">Nexus Intelligence</h1>
          <p className="text-sm text-slate-400 mt-1">Criminal Investigation & Network Analysis</p>
        </div>

        {/* Quick Role Switcher for Evaluation */}
        <div className="mb-6">
          <div className="text-xs font-medium text-slate-400 mb-2">Select Profile</div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => selectDemoRole('SP-MH-0091', 'Super@SP2026#')}
              className={`py-2 px-3 text-xs font-medium rounded-lg border transition-all ${
                pno === 'SP-MH-0091'
                  ? 'bg-blue-600/15 border-blue-500 text-blue-300 font-semibold'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              Supervisor
            </button>
            <button
              type="button"
              onClick={() => selectDemoRole('CA-MH-4412', 'Cyber@Analyst2026#')}
              className={`py-2 px-3 text-xs font-medium rounded-lg border transition-all ${
                pno === 'CA-MH-4412'
                  ? 'bg-blue-600/15 border-blue-500 text-blue-300 font-semibold'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              Analyst
            </button>
            <button
              type="button"
              onClick={() => selectDemoRole('IO-MH-7723', 'Investigate@2026#')}
              className={`py-2 px-3 text-xs font-medium rounded-lg border transition-all ${
                pno === 'IO-MH-7723'
                  ? 'bg-blue-600/15 border-blue-500 text-blue-300 font-semibold'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              Investigator
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {(localError || authError) && (
          <div className="mb-6 p-3 rounded-lg bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <span>{localError || authError}</span>
          </div>
        )}

        {/* Sign In Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Officer ID / PNO</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              <input
                type="text"
                value={pno}
                onChange={(e) => setPno(e.target.value.toUpperCase())}
                placeholder="e.g. SP-MH-0091"
                required
                className="w-full bg-[#0B101B] border border-slate-800 rounded-lg pl-9 pr-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                className="w-full bg-[#0B101B] border border-slate-800 rounded-lg pl-9 pr-10 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Station Jurisdiction</label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              <input
                type="text"
                value={stationCode}
                onChange={(e) => setStationCode(e.target.value.toUpperCase())}
                placeholder="e.g. MUM-AND-04"
                className="w-full bg-[#0B101B] border border-slate-800 rounded-lg pl-9 pr-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50 text-white font-medium text-sm py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-center text-xs text-slate-500">
          <span>Protected by Section 63 BSA Blockchain Chain of Custody</span>
        </div>
      </div>
    </div>
  );
}
