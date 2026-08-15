import React from 'react';
import { Menu, PlusCircle, ShieldCheck, User, ExternalLink } from 'lucide-react';
import { AdminUser } from '../../types';

interface AdminHeaderProps {
  user: AdminUser | null;
  onOpenMobileSidebar: () => void;
  onQuickAdd: () => void;
  onNavigatePublic: (path: string) => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  user,
  onOpenMobileSidebar,
  onQuickAdd,
  onNavigatePublic
}) => {
  return (
    <header className="bg-neutral-950 border-b border-neutral-900 py-3.5 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30" id="admin-header">
      
      <div className="flex items-center space-x-3">
        <button
          onClick={onOpenMobileSidebar}
          className="md:hidden p-2 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-lg"
          id="admin-mobile-menu-trigger"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-red-500 hidden sm:block" />
          <h2 className="text-white font-black text-sm uppercase tracking-wider font-sans">
            KANDELA CARS <span className="text-red-500">ADMIN CONTROL</span>
          </h2>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        
        {/* Quick Add CTA */}
        <button
          onClick={onQuickAdd}
          className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider px-3.5 py-2 rounded-lg transition-all shadow-md shadow-red-600/20 flex items-center space-x-1.5"
          id="admin-quick-add-btn"
        >
          <PlusCircle className="w-4 h-4" />
          <span className="hidden sm:inline">ADD VEHICLE</span>
        </button>

        {/* Public view */}
        <button
          onClick={() => onNavigatePublic('/')}
          className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-lg text-xs font-semibold flex items-center space-x-1 border border-neutral-800"
          title="Open Public Site"
          id="admin-open-public-btn"
        >
          <ExternalLink className="w-4 h-4 text-neutral-400" />
          <span className="hidden lg:inline">Website</span>
        </button>

        {/* User Badge */}
        <div className="flex items-center space-x-2 bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-lg text-xs">
          <User className="w-4 h-4 text-red-500" />
          <span className="text-neutral-200 font-bold hidden sm:inline">{user?.name || 'Admin'}</span>
        </div>

      </div>

    </header>
  );
};
