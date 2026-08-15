import React, { useEffect, useState } from 'react';
import { Heart, MessageSquare, User, Settings, Loader2, ChevronRight, LogOut } from 'lucide-react';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { customerApi } from '../services/customerApi';
import { Vehicle, InquiryMessage } from '../types';

interface AccountPageProps {
  onSelectVehicle: (id: string) => void;
  onNavigate: (path: string) => void;
}

type Tab = 'profile' | 'saved' | 'inquiries' | 'settings';

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export const AccountPage: React.FC<AccountPageProps> = ({ onSelectVehicle }) => {
  const { user, loading, logout, openLoginModal } = useCustomerAuth();
  const [tab, setTab] = useState<Tab>(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('tab');
    return t === 'saved' || t === 'inquiries' || t === 'settings' ? t : 'profile';
  });

  const [savedVehicles, setSavedVehicles] = useState<Vehicle[]>([]);
  const [inquiries, setInquiries] = useState<InquiryMessage[]>([]);
  const [tabLoading, setTabLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    setTabLoading(true);
    const load = async () => {
      try {
        if (tab === 'saved') {
          const vehicles = await customerApi.getFavorites();
          if (!cancelled) setSavedVehicles(vehicles);
        } else if (tab === 'inquiries') {
          const messages = await customerApi.getMyInquiries();
          if (!cancelled) setInquiries(messages);
        }
      } finally {
        if (!cancelled) setTabLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [tab, user]);

  const switchTab = (t: Tab) => {
    setTab(t);
    const url = t === 'profile' ? '/account' : `/account?tab=${t}`;
    window.history.replaceState({}, '', url);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-red-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-2xl font-black text-white uppercase tracking-tight mb-2">Sign in to view your account</h1>
        <p className="text-neutral-500 text-sm mb-6 max-w-sm">
          Log in to save favorite vehicles and track your inquiries with Kandela Cars.
        </p>
        <button
          onClick={openLoginModal}
          className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-md transition-colors"
        >
          Login / Sign Up
        </button>
      </div>
    );
  }

  const navItems: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'saved', label: 'Saved Cars', icon: Heart },
    { id: 'inquiries', label: 'My Inquiries', icon: MessageSquare },
    { id: 'settings', label: 'Account Settings', icon: Settings }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="md:w-56 shrink-0">
          <div className="flex items-center gap-3 mb-6">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="w-11 h-11 rounded-full object-cover border border-neutral-800" />
            ) : (
              <div className="w-11 h-11 bg-red-600/20 rounded-full flex items-center justify-center border border-red-800/50 text-red-400 text-sm font-bold">
                {initialsOf(user.name)}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-white text-sm font-bold truncate">{user.name}</p>
              <p className="text-neutral-500 text-xs truncate">{user.email || user.phone}</p>
            </div>
          </div>

          <nav className="flex md:flex-col gap-1.5 overflow-x-auto">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => switchTab(item.id)}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
                  tab === item.id ? 'bg-red-600 text-white' : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
                }`}
              >
                <item.icon className="w-3.5 h-3.5 shrink-0" />
                {item.label}
              </button>
            ))}
            <button
              onClick={logout}
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider text-red-400 hover:bg-red-950/40 transition-colors mt-2 md:mt-4 md:border-t md:border-neutral-900 md:pt-4"
            >
              <LogOut className="w-3.5 h-3.5" /> Log Out
            </button>
          </nav>
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {tab === 'profile' && (
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
              <h2 className="text-lg font-black text-white uppercase tracking-tight mb-4">My Profile</h2>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-neutral-800 pb-3">
                  <dt className="text-neutral-500">Name</dt>
                  <dd className="text-white font-semibold">{user.name}</dd>
                </div>
                {user.email && (
                  <div className="flex justify-between border-b border-neutral-800 pb-3">
                    <dt className="text-neutral-500">Email</dt>
                    <dd className="text-white font-semibold">{user.email}</dd>
                  </div>
                )}
                {user.phone && (
                  <div className="flex justify-between border-b border-neutral-800 pb-3">
                    <dt className="text-neutral-500">Phone</dt>
                    <dd className="text-white font-semibold">{user.phone}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-neutral-500">Signed in with</dt>
                  <dd className="text-white font-semibold capitalize">{user.authProvider}</dd>
                </div>
              </dl>
            </div>
          )}

          {tab === 'saved' && (
            <div>
              <h2 className="text-lg font-black text-white uppercase tracking-tight mb-4">Saved Cars</h2>
              {tabLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-red-500" />
              ) : savedVehicles.length === 0 ? (
                <p className="text-neutral-500 text-sm">
                  You haven't saved any vehicles yet. Tap the heart icon on any listing to save it here.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {savedVehicles.map(v => (
                    <button
                      key={v.id}
                      onClick={() => onSelectVehicle(v.id)}
                      className="flex items-center gap-3 bg-neutral-900 border border-neutral-800 hover:border-red-600/60 rounded-lg p-3 text-left transition-colors"
                    >
                      <img src={v.primaryImage} alt={`${v.make} ${v.model}`} className="w-16 h-12 object-cover rounded-md shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-white text-sm font-bold truncate">{v.make} {v.model}</p>
                        <p className="text-red-500 text-xs font-bold">{v.currency} {v.price.toLocaleString()}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-neutral-600 shrink-0" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === 'inquiries' && (
            <div>
              <h2 className="text-lg font-black text-white uppercase tracking-tight mb-4">My Inquiries</h2>
              {tabLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-red-500" />
              ) : inquiries.length === 0 ? (
                <p className="text-neutral-500 text-sm">
                  You haven't sent any inquiries yet. Find a vehicle you like and reach out — we'll keep the conversation here.
                </p>
              ) : (
                <div className="space-y-3">
                  {inquiries.map(msg => (
                    <div key={msg.id} className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-white text-sm font-bold">{msg.vehicleTitle || 'General Inquiry'}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">{msg.status}</span>
                      </div>
                      <p className="text-neutral-400 text-xs leading-relaxed">{msg.message}</p>
                      <p className="text-neutral-600 text-[10px] mt-2">{new Date(msg.createdAt).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === 'settings' && (
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
              <h2 className="text-lg font-black text-white uppercase tracking-tight mb-2">Account Settings</h2>
              <p className="text-neutral-500 text-sm">
                Profile editing and password changes are coming soon. For now, contact us if you need to update your account details.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
