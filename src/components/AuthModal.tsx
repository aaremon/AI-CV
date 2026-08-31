import React, { useState } from 'react';
import { User, Mail, Phone, Lock, X, AlertTriangle, Sparkles, Shield, ShieldCheck, KeyRound, ArrowRight } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthModalProps {
  onClose: () => void;
  onAuthSuccess: (user: any) => void;
  onAdminAuthSuccess?: (adminUser?: any) => void;
  initialMode?: 'user' | 'admin';
}

export default function AuthModal({ onClose, onAuthSuccess, onAdminAuthSuccess, initialMode = 'user' }: AuthModalProps) {
  const [authRole, setAuthRole] = useState<'user' | 'admin'>(initialMode);
  const [isLogin, setIsLogin] = useState(true);
  
  // User auth state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  
  // Admin auth state
  const [adminUsername, setAdminUsername] = useState('thapakaji@gmail.com');
  const [adminPassword, setAdminPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSupabaseConfigured() && supabase) {
        if (isLogin) {
          const { data, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password
          });
          if (authError) throw authError;
          if (data?.user) {
            const userObj = {
              id: data.user.id,
              email: data.user.email,
              name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || "User",
              phone: data.user.user_metadata?.phone || "",
              created_at: data.user.created_at,
              isSupabase: true
            };
            onAuthSuccess(userObj);
          }
        } else {
          const { data, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                name: name.trim(),
                phone: phone.trim()
              }
            }
          });
          if (authError) throw authError;
          if (data?.user) {
            try {
              await supabase.from('profiles').upsert({
                id: data.user.id,
                email: data.user.email,
                name: name.trim(),
                phone: phone.trim()
              });
            } catch (pErr) {
              console.warn("Profile table bypass/unavailable:", pErr);
            }

            const userObj = {
              id: data.user.id,
              email: data.user.email,
              name: name.trim(),
              phone: phone.trim(),
              created_at: data.user.created_at,
              isSupabase: true
            };
            onAuthSuccess(userObj);
          }
        }
      } else {
        // Local database fallback
        const url = isLogin ? '/api/auth/login' : '/api/auth/signup';
        const body = isLogin 
          ? { email, password }
          : { email, password, name, phone };

        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        });

        const result = await res.json();
        if (!res.ok) {
          throw new Error(result.error || "Authentication failure.");
        }

        if (result.success && result.user) {
          if (result.user.role === 'admin' && onAdminAuthSuccess) {
            onAdminAuthSuccess(result.user);
          } else {
            onAuthSuccess(result.user);
          }
        }
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during account login.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: adminUsername, password: adminPassword })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        const adminObj = {
          id: 999,
          email: adminUsername,
          name: "Platform Administrator",
          role: "admin",
          created_at: new Date().toISOString()
        };
        if (onAdminAuthSuccess) {
          onAdminAuthSuccess(adminObj);
        } else {
          onAuthSuccess(adminObj);
        }
      } else {
        setError(data.error || "Invalid administrator credentials. Please verify your email/username and password.");
      }
    } catch (err: any) {
      setError("Unable to connect to administrator authentication service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#111726] rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-200/90 dark:border-slate-800 relative animate-fade-in animate-duration-150">
        
        {/* Top Color Accent Bar */}
        <div className={`h-2 transition-all ${
          authRole === 'admin'
            ? 'bg-gradient-to-r from-slate-900 via-indigo-600 to-slate-900'
            : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500'
        }`}></div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 bg-slate-100/80 dark:bg-slate-800 rounded-full transition-colors cursor-pointer"
          title="Close Modal"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-7 sm:p-8 space-y-5">
          {/* Role / Option Switcher: User vs Admin (Only shown on Login or when Admin is active) */}
          {(isLogin || authRole === 'admin') && (
            <div className="flex p-1 bg-slate-100 dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setAuthRole('user');
                  setError(null);
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  authRole === 'user'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>User / Applicant</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthRole('admin');
                  setError(null);
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  authRole === 'admin'
                    ? 'bg-slate-900 text-white dark:bg-indigo-600 dark:text-white shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin Access</span>
              </button>
            </div>
          )}

          {/* Header Title */}
          <div className="space-y-1">
            <h3 className="text-2xl font-bold font-display tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              {authRole === 'admin' ? (
                <>
                  <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <span>Admin Control Center</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-indigo-500" />
                  <span>{isLogin ? "Sign In to Resumé AI" : "Create Career Account"}</span>
                </>
              )}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
              {authRole === 'admin'
                ? "Elevated administrator access to oversee system records, user accounts, and AI diagnostics."
                : isLogin 
                ? "Gain credentials sync, resume parsing history, metrics analysis, and personalized suggestions." 
                : "Unlock multi-resume tracking, dashboard score improvements, and comparative tools."
              }
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/80 border border-rose-100 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs rounded-xl flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* User Form */}
          {authRole === 'user' && (
            <form onSubmit={handleUserSubmit} className="space-y-3.5">
              {!isLogin && (
                <>
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 block mb-1 uppercase tracking-wide">
                      Full Name
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                        <User className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="block w-full pl-9 pr-3 py-2.5 border border-slate-300 dark:border-slate-700 dark:bg-slate-900 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 block mb-1 uppercase tracking-wide">
                      Phone / Contact
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                        <Phone className="w-4 h-4" />
                      </span>
                      <input
                        type="tel"
                        required
                        placeholder="+61 400 000 000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="block w-full pl-9 pr-3 py-2.5 border border-slate-300 dark:border-slate-700 dark:bg-slate-900 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 block mb-1 uppercase tracking-wide">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="name@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-9 pr-3 py-2.5 border border-slate-300 dark:border-slate-700 dark:bg-slate-900 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 block mb-1 uppercase tracking-wide">
                  Secure Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-9 pr-3 py-2.5 border border-slate-300 dark:border-slate-700 dark:bg-slate-900 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400/80 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all h-10 flex items-center justify-center cursor-pointer shadow-sm"
              >
                {loading ? "Verifying Account Access..." : isLogin ? "Sign In Now" : "Register Account"}
              </button>
            </form>
          )}

          {/* Admin Form */}
          {authRole === 'admin' && (
            <form onSubmit={handleAdminSubmit} className="space-y-3.5">
              <div>
                <label className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 block mb-1 uppercase tracking-wide">
                  Admin Email / Username
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="thapakaji@gmail.com"
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    className="block w-full pl-9 pr-3 py-2.5 border border-slate-300 dark:border-slate-700 dark:bg-slate-900 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-mono placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 block mb-1 uppercase tracking-wide">
                  Admin Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="block w-full pl-9 pr-3 py-2.5 border border-slate-300 dark:border-slate-700 dark:bg-slate-900 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-950 hover:bg-slate-900 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all h-10 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>{loading ? "Authenticating Session..." : "Authenticate Admin Session"}</span>
              </button>

              <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed text-center">
                Default: <strong className="text-slate-900 dark:text-slate-200 font-mono">thapakaji@gmail.com</strong> / Password: <strong className="text-slate-900 dark:text-slate-200 font-mono">password</strong>
              </div>
            </form>
          )}

          {/* Bottom Switcher */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-center space-y-2">
            {authRole === 'user' ? (
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError(null);
                  }}
                  className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline cursor-pointer"
                >
                  {isLogin ? "New to Resumé AI? Create a free account" : "Already registered? Sign in here"}
                </button>
                {isLogin && (
                  <button
                    type="button"
                    onClick={() => {
                      setAuthRole('admin');
                      setError(null);
                    }}
                    className="text-[11px] text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium inline-flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    <Shield className="w-3 h-3 text-slate-400" />
                    <span>Looking for Administrator console? Switch to Admin</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </button>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setAuthRole('user');
                  setError(null);
                }}
                className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline cursor-pointer"
              >
                ← Back to standard User / Applicant Login
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
