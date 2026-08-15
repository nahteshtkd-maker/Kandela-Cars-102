import React, { useState, useEffect } from 'react';
import { Search, Menu, X, Phone, ShieldCheck, User } from 'lucide-react';
import { KandelaLogo } from '../common/KandelaLogo';
import { AccountMenu } from '../auth/AccountMenu';
import { PHONE_NUMBERS_DISPLAY } from '../../constants/contact';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string, params?: any) => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate, onOpenSearch }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Cars', path: '/cars' },
    { label: 'About Us', path: '/about' },
    { label: 'Services', path: '/services' },
    { label: 'Contact', path: '/contact' }
  ];

  const handleNavClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>

      {/* Main Sticky Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-200 bg-white border-b border-kandela-border ${
          isScrolled ? 'py-3 shadow-md bg-white/95 backdrop-blur-md' : 'py-4'
        }`}
        id="main-navbar"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <button
              onClick={() => handleNavClick('/')}
              className="flex items-center focus:outline-none group text-left"
              id="nav-logo-btn"
            >
              <KandelaLogo size={isScrolled ? 'sm' : 'md'} />
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8 text-xs font-bold tracking-widest uppercase text-kandela-muted">
              {navItems.map(item => {
                const isActive =
                  item.path === '/'
                    ? currentPath === '/'
                    : currentPath.startsWith(item.path);
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavClick(item.path)}
                    id={`nav-link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                    className={`py-1 transition-colors relative ${
                      isActive
                        ? 'text-kandela-red border-b-2 border-kandela-red'
                        : 'hover:text-kandela-ink'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* Right Action Controls */}
            <div className="hidden md:flex items-center space-x-6">
              <button
                onClick={onOpenSearch}
                id="search-trigger-btn"
                className="text-kandela-muted hover:text-kandela-ink p-2 transition-colors"
                title="Search Vehicles"
              >
                <Search className="w-5 h-5" />
              </button>

              <button
                onClick={() => handleNavClick('/cars')}
                id="browse-cars-cta-btn"
                className="bg-kandela-red hover:bg-kandela-red-hover text-white px-6 py-2.5 text-xs font-bold tracking-widest uppercase transition-colors rounded-full"
              >
                Browse Cars
              </button>

              <div className="flex items-center space-x-2 pl-4 border-l border-kandela-border">
                <AccountMenu />
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="flex md:hidden items-center space-x-3">
              <button
                onClick={onOpenSearch}
                className="p-2 text-kandela-muted hover:text-kandela-ink"
                id="mobile-search-btn"
              >
                <Search className="w-5 h-5" />
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                id="mobile-hamburger-btn"
                className="p-2 text-kandela-ink hover:text-kandela-red focus:outline-none"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6 text-kandela-red" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-kandela-border px-4 pt-4 pb-6 animate-fadeIn" id="mobile-menu-drawer">
            <div className="flex flex-col space-y-3 mb-6">
              {navItems.map(item => {
                const isActive =
                  item.path === '/'
                    ? currentPath === '/'
                    : currentPath.startsWith(item.path);
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavClick(item.path)}
                    id={`mobile-nav-link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                    className={`text-left px-4 py-2.5 text-xs font-bold tracking-widest uppercase transition-colors flex items-center justify-between ${
                      isActive
                        ? 'text-kandela-red border-l-4 border-kandela-red pl-3 bg-kandela-surface'
                        : 'text-kandela-muted hover:text-kandela-ink'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && <span className="w-1.5 h-1.5 bg-kandela-red rounded-full" />}
                  </button>
                );
              })}
            </div>

            <div className="pt-4 border-t border-kandela-border flex flex-col space-y-3">
              <button
                onClick={() => handleNavClick('/cars')}
                className="w-full bg-kandela-red hover:bg-kandela-red-hover text-white font-bold text-xs tracking-widest uppercase py-3 transition-colors text-center rounded-full"
                id="mobile-browse-cars-btn"
              >
                Browse Cars
              </button>

              <button
                onClick={() => { setMobileMenuOpen(false); onNavigate('/account'); }}
                className="w-full bg-white hover:bg-kandela-surface text-kandela-ink font-bold text-xs tracking-widest uppercase py-2.5 transition-colors text-center border border-kandela-border rounded-full flex items-center justify-center space-x-2"
                id="mobile-account-btn"
              >
                <User className="w-4 h-4 text-kandela-red" />
                <span>My Account</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
