import React from 'react';
import { Phone, Mail, MapPin, Clock, ArrowRight, MessageCircle } from 'lucide-react';
import { KandelaLogo } from '../common/KandelaLogo';
import {
  PHONE_PRIMARY_DISPLAY,
  PHONE_SECONDARY_DISPLAY,
  PHONE_PRIMARY_TEL,
  buildWhatsAppLink,
  SOCIAL_LINKS
} from '../../constants/contact';

interface FooterProps {
  onNavigate: (path: string) => void;
}

const TikTokIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 11-5.2-1.74 2.89 2.89 0 012.31-1.18V9.28a6.34 6.34 0 00-3.45 1.01 6.33 6.33 0 1010.51 4.63V8.69a8.3 8.3 0 004.85 1.56V6.8a4.85 4.85 0 01-1.8-.11z"/>
  </svg>
);

const TelegramIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
  </svg>
);

const InstagramIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const FacebookIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-kandela-surface text-kandela-muted border-t border-kandela-border pt-12 pb-8" id="main-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-kandela-border">
          
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="cursor-pointer" onClick={() => onNavigate('/')}>
              <KandelaLogo size="sm" />
            </div>
            <p className="text-xs text-kandela-muted leading-relaxed font-sans">
              Kandela Cars is an automotive broker helping customers find quality new and used vehicles in Ethiopia.
            </p>

            {/* Social Media Links */}
            <div className="pt-2">
              <span className="text-[10px] text-kandela-muted font-bold uppercase tracking-wider block mb-2">
                Connect With Us
              </span>
              <div className="flex items-center space-x-2">
                <a
                  href={SOCIAL_LINKS.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded bg-white border border-kandela-border flex items-center justify-center text-kandela-ink hover:text-kandela-red hover:border-kandela-red transition-all duration-200 shadow-sm"
                  title="TikTok"
                >
                  <TikTokIcon className="w-3.5 h-3.5" />
                </a>
                <a
                  href={SOCIAL_LINKS.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded bg-white border border-kandela-border flex items-center justify-center text-kandela-ink hover:text-kandela-red hover:border-kandela-red transition-all duration-200 shadow-sm"
                  title="Telegram"
                >
                  <TelegramIcon className="w-3.5 h-3.5" />
                </a>
                <a
                  href={SOCIAL_LINKS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded bg-white border border-kandela-border flex items-center justify-center text-kandela-ink hover:text-kandela-red hover:border-kandela-red transition-all duration-200 shadow-sm"
                  title="Instagram"
                >
                  <InstagramIcon className="w-3.5 h-3.5" />
                </a>
                <a
                  href={SOCIAL_LINKS.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded bg-white border border-kandela-border flex items-center justify-center text-kandela-ink hover:text-kandela-red hover:border-kandela-red transition-all duration-200 shadow-sm"
                  title="Facebook"
                >
                  <FacebookIcon className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-kandela-ink text-xs font-bold uppercase tracking-wider mb-4 flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-kandela-red" />
              <span>Navigation</span>
            </h4>
            <ul className="space-y-2 text-xs">
              {[
                { label: 'Marketplace Home', path: '/' },
                { label: 'New & Used Inventory', path: '/cars' },
                { label: 'About Kandela Cars', path: '/about' },
                { label: 'Sourcing & Services', path: '/services' },
                { label: 'Contact Us', path: '/contact' }
              ].map(link => (
                <li key={link.path}>
                  <button
                    onClick={() => {
                      onNavigate(link.path);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-kandela-red transition-colors flex items-center space-x-1.5 text-kandela-muted"
                  >
                    <ArrowRight className="w-3 h-3 text-kandela-red" />
                    <span>{link.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Vehicle Categories */}
          <div>
            <h4 className="text-kandela-ink text-xs font-bold uppercase tracking-wider mb-4 flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-kandela-red" />
              <span>Vehicle Selection</span>
            </h4>
            <ul className="space-y-2 text-xs">
              {['New Vehicles', 'Used Vehicles', 'Toyota Land Cruiser', 'BYD Electric Series', 'Hyundai SUVs', 'Mercedes-Benz Executive'].map(item => (
                <li key={item}>
                  <button
                    onClick={() => {
                      onNavigate('/cars');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-kandela-red transition-colors flex items-center space-x-1.5 text-kandela-muted"
                  >
                    <span className="text-kandela-red font-bold">•</span>
                    <span>{item}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & 24/7 Availability */}
          <div className="space-y-3">
            <h4 className="text-kandela-ink text-xs font-bold uppercase tracking-wider mb-3 flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-kandela-red" />
              <span>CONTACT KANDELA CARS</span>
            </h4>
            
            <div className="bg-white border border-kandela-border p-2.5 rounded-md text-[11px] mb-2 shadow-sm">
              <span className="bg-red-50 text-kandela-red border border-red-200 text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded inline-block mb-1">
                AVAILABLE 24/7
              </span>
              <p className="text-kandela-muted font-medium text-[11px]">
                Call or message us anytime for vehicle inquiries & sourcing.
              </p>
            </div>

            <ul className="space-y-2 text-xs">
              <li className="flex items-start space-x-2">
                <MapPin className="w-3.5 h-3.5 text-kandela-red shrink-0 mt-0.5" />
                <span className="text-kandela-muted">Bole Road, Addis Ababa, Ethiopia</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-kandela-red shrink-0" />
                <a href={`tel:${PHONE_PRIMARY_TEL}`} className="text-kandela-ink font-semibold tracking-normal font-sans hover:text-kandela-red transition-colors">
                  {PHONE_PRIMARY_DISPLAY} / {PHONE_SECONDARY_DISPLAY}
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <a
                  href={buildWhatsAppLink('Hello Kandela Cars, I want to inquire about a vehicle.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:underline font-medium"
                >
                  WhatsApp: {PHONE_PRIMARY_DISPLAY}
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-kandela-red shrink-0" />
                <span className="text-kandela-muted">info@kandelacars.et</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright & Status Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[10px] font-bold tracking-wider uppercase text-kandela-muted gap-3 border-t border-kandela-border mt-6">
          <div>&copy; 2026 KANDELA CARS &mdash; AUTOMOTIVE BROKER & VEHICLE SOURCING</div>
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-kandela-red">NEW & USED VEHICLES</span>
            <span className="text-kandela-muted">24/7 CLIENT SUPPORT</span>
            <span>ADDIS ABABA, ETHIOPIA</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

