import React, { useState } from 'react';
import { X, Mail, Lock, Loader2, ShieldCheck } from 'lucide-react';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { customerApi } from '../../services/customerApi';
import { GoogleSignInButton } from './GoogleSignInButton';

type Tab = 'signin' | 'signup';

export const LoginModal: React.FC = () => {
  const { isLoginModalOpen, closeLoginModal, onAuthSuccess } = useCustomerAuth();
  const [tab, setTab] = useState<Tab>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isLoginModalOpen) return null;

  const reset = () => {
    setTab('signin');
    setName('');
    setEmail('');
    setPassword('');
    setError(null);
    setLoading(false);
  };

  const handleClose = () => {
    reset();
    closeLoginModal();
  };

  const handleGoogleCredential = async (idToken: string) => {
    setLoading(true);
    setError(null);
    try {
      const user = await customerApi.loginWithGoogle(idToken);
      onAuthSuccess(user);
      reset();
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const user = tab === 'signup'
        ? await customerApi.signup(name, email, password)
        : await customerApi.login(email, password);
      onAuthSuccess(user);
      reset();
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={handleClose}
      id="login-modal-overlay"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="bg-white border border-kandela-border rounded-2xl w-full max-w-md p-7 sm:p-8 relative shadow-2xl"
        id="login-modal-panel"
      >
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 text-kandela-muted hover:text-kandela-ink transition-colors"
          id="login-modal-close-btn"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <span className="inline-flex items-center gap-1.5 text-kandela-red text-[11px] font-bold uppercase tracking-widest bg-red-50 border border-red-200 px-3 py-1 rounded-full mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            Kandela Customer Portal
          </span>
          <h2 className="text-2xl font-black tracking-tight text-kandela-ink font-heading">
            Welcome Back
          </h2>
          <p className="text-kandela-muted text-sm mt-1.5 leading-relaxed">
            Save favorite vehicles, track inquiry status, and receive personalized vehicle alerts.
          </p>
        </div>

        {/* Sign In / Sign Up pill tabs — no Phone OTP tab (disabled until SMS is funded) */}
        <div className="flex bg-kandela-surface p-1 rounded-full mb-6" id="login-tab-switcher">
          <button
            onClick={() => { setTab('signin'); setError(null); }}
            className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-full transition-colors ${
              tab === 'signin' ? 'bg-kandela-red text-white shadow-sm' : 'text-kandela-muted hover:text-kandela-ink'
            }`}
            id="login-tab-signin"
          >
            Sign In
          </button>
          <button
            onClick={() => { setTab('signup'); setError(null); }}
            className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-full transition-colors ${
              tab === 'signup' ? 'bg-kandela-red text-white shadow-sm' : 'text-kandela-muted hover:text-kandela-ink'
            }`}
            id="login-tab-signup"
          >
            Sign Up
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg px-3 py-2.5 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === 'signup' && (
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-kandela-muted block mb-1.5">Full Name</label>
              <input
                type="text"
                required
                placeholder="Your name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-white border border-kandela-border rounded-lg px-3.5 py-3 text-sm text-kandela-ink placeholder-kandela-muted focus:outline-none focus:border-kandela-red transition-colors"
              />
            </div>
          )}

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-kandela-muted block mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-kandela-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="your.email@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-white border border-kandela-border rounded-lg pl-10 pr-3.5 py-3 text-sm text-kandela-ink placeholder-kandela-muted focus:outline-none focus:border-kandela-red transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-kandela-muted">Password</label>
              {tab === 'signin' && (
                <button type="button" className="text-[11px] font-bold text-kandela-red hover:underline">
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-kandela-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={8}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-white border border-kandela-border rounded-lg pl-10 pr-3.5 py-3 text-sm text-kandela-ink placeholder-kandela-muted focus:outline-none focus:border-kandela-red transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-kandela-red hover:bg-kandela-red-hover disabled:opacity-60 text-white font-bold text-sm uppercase tracking-wider py-3.5 rounded-full transition-colors flex items-center justify-center gap-2"
            id="login-submit-btn"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {tab === 'signup' ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-kandela-border" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-kandela-muted">Or continue with OAuth</span>
          <div className="flex-1 h-px bg-kandela-border" />
        </div>

        <GoogleSignInButton onCredential={handleGoogleCredential} />
      </div>
    </div>
  );
};
