import React from 'react';
import { ArrowRight, ShieldCheck, Tag, Headphones } from 'lucide-react';
import lc300Image from '../../assets/LC300.png';

interface HeroProps {
  onNavigate: (path: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  return (
    <section className="relative bg-white overflow-hidden" id="hero-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-8 items-center">
          {/* Left: Copy */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="h-[1px] w-12 bg-kandela-red" />
              <span className="text-kandela-red text-xs font-bold tracking-[0.3em] uppercase">
                Est. Addis Ababa, Ethiopia
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[0.95] tracking-tight mb-6 text-kandela-ink font-heading">
              Find Your Next Car.<br />
              <span className="text-kandela-red">Drive With Confidence.</span>
            </h1>

            <p className="text-kandela-muted text-base sm:text-lg max-w-xl leading-relaxed">
              Discover carefully selected luxury SUVs, electric crossovers, and executive vehicles from Kandela Cars, built around quality, confidence and the road ahead.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <button
                onClick={() => onNavigate('/cars')}
                id="hero-explore-cars-btn"
                className="px-8 sm:px-10 py-4 bg-kandela-red text-white font-bold text-xs sm:text-sm tracking-widest uppercase hover:bg-kandela-red-hover transition-colors flex items-center space-x-3 group rounded-full"
              >
                <span>Explore Our Cars</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('/contact')}
                id="hero-contact-btn"
                className="px-8 sm:px-10 py-4 bg-white border border-kandela-ink text-kandela-ink font-bold text-xs sm:text-sm tracking-widest uppercase hover:bg-kandela-surface transition-colors rounded-full"
              >
                Contact Us
              </button>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-6 max-w-md">
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-5 h-5 text-kandela-red shrink-0 mt-0.5" />
                <div>
                  <span className="block text-xs font-bold text-kandela-ink">Verified Cars</span>
                  <span className="block text-[11px] text-kandela-muted">Quality you can trust</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Tag className="w-5 h-5 text-kandela-red shrink-0 mt-0.5" />
                <div>
                  <span className="block text-xs font-bold text-kandela-ink">Best Prices</span>
                  <span className="block text-[11px] text-kandela-muted">Market competitive</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Headphones className="w-5 h-5 text-kandela-red shrink-0 mt-0.5" />
                <div>
                  <span className="block text-xs font-bold text-kandela-ink">24/7 Support</span>
                  <span className="block text-[11px] text-kandela-muted">We're always here</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Vehicle photography — no dark overlay, image stays dominant */}
          <div className="relative">
            <div className="absolute inset-0 bg-kandela-surface rounded-2xl -z-10 scale-95" />
            <img
  src={lc300Image}
  alt="Toyota Land Cruiser 300 - Kandela Cars"
  className="w-full h-[300px] sm:h-[380px] lg:h-[440px] object-cover rounded-2xl shadow-xl"
/>
          </div>
        </div>
      </div>
    </section>
  );
};
