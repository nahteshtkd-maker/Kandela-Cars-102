import React from 'react';
import { Phone, MessageCircle, MapPin, ArrowRight } from 'lucide-react';
import { PHONE_PRIMARY_DISPLAY, PHONE_PRIMARY_TEL, buildWhatsAppLink } from '../../constants/contact';

interface ContactCTASectionProps {
  onNavigate: (path: string) => void;
}

export const ContactCTASection: React.FC<ContactCTASectionProps> = ({ onNavigate }) => {
  return (
    <section className="py-20 bg-kandela-surface relative overflow-hidden" id="contact-cta-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-white border border-kandela-border rounded-2xl p-8 sm:p-12 shadow-md flex flex-col lg:flex-row items-center justify-between gap-8">
          
          <div className="space-y-4 max-w-2xl text-center lg:text-left">
            <span className="text-kandela-red text-xs font-bold uppercase tracking-widest bg-red-50 border border-red-200 px-3 py-1 rounded-full inline-block">
              READY TO DRIVE YOUR DREAM CAR?
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-kandela-ink uppercase tracking-tight font-sans">
              SPEAK WITH A KANDELA CARS SPECIALIST TODAY
            </h2>
            <p className="text-kandela-muted text-sm sm:text-base leading-relaxed">
              Visit our Bole, Addis Ababa office or connect directly via WhatsApp/Phone for instant vehicle availability and test drive scheduling.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto shrink-0">
            <a
              href={`tel:${PHONE_PRIMARY_TEL}`}
              className="w-full sm:w-auto bg-kandela-red hover:bg-kandela-red-hover text-white font-bold text-xs tracking-wider uppercase px-6 py-4 rounded-full transition-all duration-200 flex items-center justify-center space-x-2.5 shadow-md"
              id="cta-call-btn"
            >
              <Phone className="w-4 h-4" />
              <span>CALL {PHONE_PRIMARY_DISPLAY}</span>
            </a>

            <a
              href={buildWhatsAppLink('Hello Kandela Cars, I am interested in inquiring about a vehicle.')}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs tracking-wider uppercase px-6 py-4 rounded-full transition-all duration-200 flex items-center justify-center space-x-2.5 shadow-md"
              id="cta-whatsapp-btn"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WHATSAPP US</span>
            </a>

            <button
              onClick={() => onNavigate('/contact')}
              className="w-full sm:w-auto bg-white hover:bg-kandela-surface text-kandela-ink font-bold text-xs tracking-wider uppercase px-6 py-4 rounded-full transition-all duration-200 border border-kandela-border flex items-center justify-center space-x-2"
              id="cta-contact-page-btn"
            >
              <span>OFFICE LOCATION</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};
