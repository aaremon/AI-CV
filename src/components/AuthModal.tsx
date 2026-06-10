import React, { useState } from 'react';
import { User, Mail, Phone, Lock, X, AlertTriangle, Sparkles } from 'lucide-react';

interface AuthModalProps {
  onClose: () => void;
  onAuthSuccess: (user: any) => void;
}

export default function AuthModal({ onClose, onAuthSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const url = isLogin ? '/api/auth/login' : '/api/auth/signup';
    const body = isLogin 
      ? { email, password }
      : { email, password, name, phone };

    try {
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
        onAuthSuccess(result.user);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during account login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-100 relative animate-fade-in animate-duration-150">
        
        {/* Color Accent Bar */}
        <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500"></div>

        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-8 space-y-6">
          <div className="space-y-1">
            <h3 className="text-2xl font-bold font-display tracking-tight text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              <span>{isLogin ? "Sign In to Resumé AI" : "Create Career Account"}</span>
            </h3>
            <p className="text-xs text-slate-500 leading-normal">
              {isLogin 
                ? "Gain credentials sync, resume parsing history, metrics analysis, and personalized suggestions." 
                : "Unlock multi-resume tracking, dashboard score improvements, and comparative tools."
              }
            </p>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-100 text-rose-700 text-xs rounded-xl flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className="text-[10px] font-extrabold text-slate-500 block mb-1 uppercase tracking-wide">
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
                      className="block w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-450"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-extrabold text-slate-500 block mb-1 uppercase tracking-wide">
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
                      className="block w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-450"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="text-[10px] font-extrabold text-slate-500 block mb-1 uppercase tracking-wide">
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
                  className="block w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-450"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-extrabold text-slate-500 block mb-1 uppercase tracking-wide">
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
                  className="block w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-450"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400/80 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all h-10 flex items-center justify-center cursor-pointer"
            >
              {loading ? "Verifying Account Access..." : isLogin ? "Sign In Now" : "Register Account"}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
              }}
              className="text-xs text-indigo-500 font-semibold hover:underline"
            >
              {isLogin ? "New to Resumé AI? Create a free account" : "Already registered? Sign in here"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
