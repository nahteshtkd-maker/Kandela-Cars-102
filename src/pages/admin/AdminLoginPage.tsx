import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, Loader2, ArrowRight } from 'lucide-react';
import { api } from '../../services/api';
import { KandelaLogo } from '../../components/common/KandelaLogo';

interface AdminLoginPageProps {
  onLoginSuccess: () => void;
  onNavigatePublic: (path: string) => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onLoginSuccess,
  onNavigatePublic
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please enter admin email and password');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await api.login(email, password);
      onLoginSuccess();
    } catch (err: any) {
      setError(err.message || 'Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col justify-center items-center p-4 relative overflow-hidden" id="admin-login-page">
      
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-2xl relative z-10 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-block cursor-pointer" onClick={() => onNavigatePublic('/')}>
            <KandelaLogo size="md" variant="full" />
          </div>
          <div className="border-t border-neutral-800 pt-3">
            <span className="text-red-500 text-[10px] font-bold uppercase tracking-widest block">
              MANAGEMENT PORTAL
            </span>
            <h1 className="text-2xl font-black text-white uppercase tracking-tight font-sans">
              STAFF ADMIN LOGIN
            </h1>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-950/80 border border-red-800 text-red-300 text-xs rounded-lg font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@kandelacars.et"
                className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-lg pl-9 pr-4 py-3 text-sm focus:outline-none focus:border-red-600"
                id="admin-login-email"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-lg pl-9 pr-4 py-3 text-sm focus:outline-none focus:border-red-600"
                id="admin-login-password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider py-4 rounded-lg transition-all shadow-xl shadow-red-600/30 flex items-center justify-center space-x-2"
            id="admin-login-submit-btn"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>AUTHENTICATING...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>SIGN IN TO ADMIN PANEL</span>
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-center">
          <button
            onClick={() => onNavigatePublic('/')}
            className="text-xs text-neutral-400 hover:text-white uppercase font-bold tracking-wider inline-flex items-center space-x-1"
          >
            <span>Return to Public Website</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
