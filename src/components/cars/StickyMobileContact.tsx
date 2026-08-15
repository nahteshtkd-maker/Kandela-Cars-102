import React from 'react';
import { Phone, MessageCircle, Calendar } from 'lucide-react';
import { PHONE_PRIMARY_TEL } from '../../constants/contact';

interface StickyMobileContactProps {
  phone?: string;
  whatsappMessage?: string;
  onOpenInquiry: () => void;
}

export const StickyMobileContact: React.FC<StickyMobileContactProps> = ({
  phone = PHONE_PRIMARY_TEL,
  whatsappMessage = 'Hello Kandela Cars, I am interested in inquiring about a vehicle.',
  onOpenInquiry
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-neutral-950/95 backdrop-blur-md border-t border-neutral-800 p-3 sm:hidden shadow-2xl" id="sticky-mobile-contact-bar">
      <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
        
        {/* Call Button */}
        <a
          href={`tel:${phone}`}
          className="bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider py-2.5 px-2 rounded-lg flex flex-col items-center justify-center space-y-0.5 shadow-md shadow-red-600/30"
          id="sticky-call-btn"
        >
          <Phone className="w-4 h-4" />
          <span>CALL US</span>
        </a>

        {/* WhatsApp Button */}
        <a
          href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappMessage)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider py-2.5 px-2 rounded-lg flex flex-col items-center justify-center space-y-0.5 shadow-md shadow-emerald-600/20"
          id="sticky-whatsapp-btn"
        >
          <MessageCircle className="w-4 h-4" />
          <span>WHATSAPP</span>
        </a>

        {/* Request Info Modal Button */}
        <button
          onClick={onOpenInquiry}
          className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 font-bold text-xs uppercase tracking-wider py-2.5 px-2 rounded-lg flex flex-col items-center justify-center space-y-0.5"
          id="sticky-inquiry-btn"
        >
          <Calendar className="w-4 h-4 text-red-500" />
          <span>INQUIRE</span>
        </button>

      </div>
    </div>
  );
};
