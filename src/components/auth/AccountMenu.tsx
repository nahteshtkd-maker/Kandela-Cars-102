import React, { useState, useRef, useEffect } from 'react';
import { User, ChevronDown, Heart, MessageSquare, Settings, LogOut } from 'lucide-react';
import { useCustomerAuth } from '../../context/CustomerAuthContext';

interface AccountMenuProps {
  onNavigateAccount?: (tab?: string) => void;
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export const AccountMenu: React.FC<AccountMenuProps> = ({ onNavigateAccount }) => {
  const { user, loading, logout, openLoginModal } = useCustomerAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const go = (tab?: string) => {
    setDropdownOpen(false);
    if (onNavigateAccount) onNavigateAccount(tab);
    else window.location.href = tab ? `/account?tab=${tab}` : '/account';
  };

  if (loading) {
    return <div className="w-8 h-8 rounded-full bg-kandela-surface border border-kandela-border animate-pulse" />;
  }

  if (!user) {
    return (
      <button
        onClick={openLoginModal}
        className="flex items-center space-x-2 group"
        id="navbar-login-btn"
        title="Login / Account"
      >
        <div className="w-8 h-8 bg-kandela-surface rounded-full flex items-center justify-center border border-kandela-border group-hover:border-kandela-red transition-colors">
          <User className="w-4 h-4 text-kandela-muted group-hover:text-kandela-red" />
        </div>
        <span className="text-[10px] font-bold tracking-wider text-kandela-muted group-hover:text-kandela-ink">
          LOGIN
        </span>
      </button>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setDropdownOpen(o => !o)}
        className="flex items-center space-x-2 group"
        id="navbar-account-btn"
      >
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-8 h-8 rounded-full object-cover border border-kandela-border group-hover:border-kandela-red transition-colors"
          />
        ) : (
          <div className="w-8 h-8 bg-red-50 rounded-full flex items-center justify-center border border-red-200 text-kandela-red text-[11px] font-bold">
            {initialsOf(user.name)}
          </div>
        )}
        <span className="text-[10px] font-bold tracking-wider text-kandela-muted group-hover:text-kandela-ink max-w-[90px] truncate">
          {user.name.split(' ')[0]}
        </span>
        <ChevronDown className={`w-3 h-3 text-kandela-muted transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
      </button>

      {dropdownOpen && (
        <div
          className="absolute right-0 mt-3 w-52 bg-white border border-kandela-border rounded-xl shadow-xl overflow-hidden z-50"
          id="account-dropdown"
        >
          <div className="px-4 py-3 border-b border-kandela-border">
            <p className="text-kandela-ink text-xs font-bold truncate">{user.name}</p>
            <p className="text-kandela-muted text-[11px] truncate">{user.email || user.phone}</p>
          </div>
          <button onClick={() => go()} className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-kandela-ink hover:bg-kandela-surface transition-colors">
            <User className="w-3.5 h-3.5" /> My Profile
          </button>
          <button onClick={() => go('saved')} className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-kandela-ink hover:bg-kandela-surface transition-colors">
            <Heart className="w-3.5 h-3.5" /> Saved Cars
          </button>
          <button onClick={() => go('inquiries')} className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-kandela-ink hover:bg-kandela-surface transition-colors">
            <MessageSquare className="w-3.5 h-3.5" /> My Inquiries
          </button>
          <button onClick={() => go('settings')} className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-kandela-ink hover:bg-kandela-surface transition-colors">
            <Settings className="w-3.5 h-3.5" /> Account Settings
          </button>
          <button
            onClick={() => { setDropdownOpen(false); logout(); }}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-kandela-red hover:bg-red-50 transition-colors border-t border-kandela-border"
          >
            <LogOut className="w-3.5 h-3.5" /> Log Out
          </button>
        </div>
      )}
    </div>
  );
};
