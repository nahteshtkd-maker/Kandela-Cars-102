import React from 'react';
import { ShieldCheck, Award, Users, CheckCircle, ArrowRight } from 'lucide-react';
import { KandelaLogo } from '../components/common/KandelaLogo';

interface AboutPageProps {
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-neutral-950 text-white py-12" id="about-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-red-500 text-xs font-bold uppercase tracking-wider bg-red-950/60 border border-red-800/40 px-3 py-1 rounded-full inline-block">
            ABOUT KANDELA CARS ETHIOPIA
          </span>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight font-sans">
            ETHIOPIA'S PREMIER AUTOMOTIVE BROKER
          </h1>
          <p className="text-neutral-400 text-base sm:text-lg leading-relaxed">
            Kandela Cars is a professional automotive broker and vehicle sourcing service helping customers acquire quality new and used vehicles in Ethiopia with complete transparency and verified inspection.
          </p>
        </div>

        {/* Visual Story Banner */}
        <div className="relative rounded-2xl overflow-hidden border border-neutral-800 aspect-[4/5] sm:aspect-[16/9] lg:aspect-[21/9] bg-neutral-900 shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=2000&q=85"
            alt="Kandela Cars Executive Office"
            className="w-full h-full object-cover filter brightness-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-8 sm:left-8 sm:right-8 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div>
              <div className="hidden sm:block">
                <KandelaLogo size="md" />
              </div>
              <p className="text-neutral-300 text-xs sm:text-sm mt-2 max-w-md">
                Bole Road Office • Addis Ababa, Ethiopia &bull; 24/7 Client Availability
              </p>
            </div>
            <button
              onClick={() => onNavigate('/cars')}
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-md transition-colors shadow-lg shadow-red-600/30 flex items-center space-x-2"
            >
              <span>EXPLORE VEHICLE INVENTORY</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Who We Are & Our Story */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight font-sans text-white">
              WHO WE ARE
            </h2>
            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
              In Ethiopia’s dynamic automotive market, purchasing or importing a vehicle is a major decision. Kandela Cars functions as a trusted automotive broker and sourcing partner, connecting buyers with vetted vehicles across the country and overseas.
            </p>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Whether you are looking for brand new EVs like the BYD Atto 3, executive SUVs like the Toyota Land Cruiser 300 VXR, or high-grade pre-owned vehicles, we manage verification, negotiations, customs support, and handover.
            </p>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 space-y-6">
            <h3 className="text-xl font-bold uppercase tracking-wider text-red-500 font-sans">
              OUR 4 CORE PILLARS
            </h3>
            <ul className="space-y-4 text-sm">
              {[
                { title: 'Verified Quality', desc: 'Multi-point mechanical inspection before client handover.' },
                { title: 'Customs & Sourcing Guidance', desc: 'Full assistance with tariff calculations, bank letters, and customs clearance.' },
                { title: 'Fair Market Value', desc: 'Transparent ETB pricing reflecting real market conditions.' },
                { title: '24/7 Customer Support', desc: 'Continuous communication, vehicle sourcing requests, and post-purchase assistance.' }
              ].map((p, idx) => (
                <li key={idx} className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">{p.title}</span>
                    <span className="text-neutral-400 text-xs">{p.desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 space-y-3">
            <span className="text-red-500 text-xs font-bold uppercase tracking-widest">
              OUR MISSION
            </span>
            <h3 className="text-2xl font-black uppercase text-white font-sans">
              SEAMLESS VEHICLE SOURCING
            </h3>
            <p className="text-neutral-300 text-sm leading-relaxed">
              To connect Ethiopian buyers with reliable new and used vehicles through expert brokerage, transparent pricing, and 24/7 client communication.
            </p>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 space-y-3">
            <span className="text-red-500 text-xs font-bold uppercase tracking-widest">
              OUR VISION
            </span>
            <h3 className="text-2xl font-black uppercase text-white font-sans">
              ETHIOPIA’S MOST TRUSTED BROKER
            </h3>
            <p className="text-neutral-300 text-sm leading-relaxed">
              To set the regional standard for automotive brokerage, electric vehicle sourcing, and client satisfaction.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-red-950/40 via-neutral-900 to-neutral-950 border border-neutral-800 rounded-2xl p-8 text-center space-y-4">
          <h3 className="text-2xl font-black uppercase text-white font-sans">
            READY TO SOURCE YOUR NEXT CAR?
          </h3>
          <p className="text-neutral-400 text-sm max-w-xl mx-auto">
            Explore our curated inventory of new and used vehicles or reach out to our team 24/7.
          </p>
          <button
            onClick={() => onNavigate('/cars')}
            className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-md transition-colors shadow-lg shadow-red-600/30"
          >
            VIEW ALL AVAILABLE VEHICLES
          </button>
        </div>

      </div>
    </div>
  );
};
