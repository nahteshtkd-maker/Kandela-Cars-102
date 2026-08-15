import React from 'react';
import { LayoutDashboard, Car, PlusCircle, MessageSquare, Settings, LogOut, Eye, X, HandCoins, Award } from 'lucide-react';
import { KandelaLogo } from '../common/KandelaLogo';

interface AdminSidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onNavigatePublic: (path: string) => void;
  onLogout: () => void;
  unreadCount?: number;
  financeInquiryCount?: number;
  canViewCommissions?: boolean;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentTab,
  onSelectTab,
  onNavigatePublic,
  onLogout,
  unreadCount = 0,
  financeInquiryCount = 0,
  canViewCommissions = true,
  mobileOpen = false,
  onCloseMobile
}) => {
  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'vehicles', label: 'Vehicles Inventory', icon: Car },
    { id: 'add-vehicle', label: 'Add New Vehicle', icon: PlusCircle },
    { id: 'messages', label: 'Inquiries Inbox', icon: MessageSquare, badge: unreadCount },
    { id: 'finance-inquiries', label: 'Finance Inquiries', icon: HandCoins, badge: financeInquiryCount },
    ...(canViewCommissions ? [{ id: 'commission-goals', label: 'Commission & Goals', icon: Award }] : []),
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const content = (
    <div className="flex flex-col h-full bg-neutral-950 border-r border-neutral-900 w-64 p-4 text-sm" id="admin-sidebar">
      
      {/* Top Logo & Branding */}
      <div className="flex items-center justify-between pb-6 border-b border-neutral-900 px-2 pt-2">
        <div className="cursor-pointer" onClick={() => onNavigatePublic('/')}>
          <KandelaLogo size="sm" variant="full" />
        </div>
        {onCloseMobile && (
          <button onClick={onCloseMobile} className="md:hidden text-neutral-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="py-2 text-[10px] font-bold uppercase tracking-wider text-neutral-500 px-3 mt-4">
        ADMIN DASHBOARD MANAGEMENT
      </div>

      {/* Nav links */}
      <div className="flex-1 space-y-1 py-2">
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onSelectTab(item.id);
                if (onCloseMobile) onCloseMobile();
              }}
              id={`admin-tab-${item.id}`}
              className={`w-full flex items-center justify-between px-3 py-3 rounded-xl font-medium transition-all ${
                isActive
                  ? 'bg-red-600/10 text-red-500 border border-red-600/30'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-5 h-5 ${isActive ? 'text-red-500' : 'text-neutral-500'}`} />
                <span className="text-xs font-bold uppercase tracking-wider">{item.label}</span>
              </div>
              {item.badge && item.badge > 0 ? (
                <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Footer Controls */}
      <div className="pt-4 border-t border-neutral-900 space-y-2">
        <button
          onClick={() => onNavigatePublic('/')}
          className="w-full text-left px-3 py-2.5 rounded-lg text-xs font-bold uppercase text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors flex items-center space-x-2.5"
          id="admin-public-view-btn"
        >
          <Eye className="w-4 h-4 text-neutral-500" />
          <span>View Public Website</span>
        </button>

        <button
          onClick={onLogout}
          className="w-full text-left px-3 py-2.5 rounded-lg text-xs font-bold uppercase text-red-400 hover:text-red-300 hover:bg-red-950/40 transition-colors flex items-center space-x-2.5"
          id="admin-logout-btn"
        >
          <LogOut className="w-4 h-4 text-red-500" />
          <span>Sign Out Admin</span>
        </button>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden md:block h-screen sticky top-0 shrink-0">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur-md md:hidden" id="admin-mobile-sidebar-modal">
          <div className="w-64 h-full bg-neutral-950">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
