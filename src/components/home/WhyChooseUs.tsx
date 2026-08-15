import React from 'react';
import { ShieldCheck, Truck, Banknote, Clock, Award, PhoneCall } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const pillars = [
    {
      icon: ShieldCheck,
      title: 'RIGOROUS INSPECTION',
      description: 'Every vehicle undergoes comprehensive mechanical, battery state-of-health, and structural inspection prior to being published on the site.'
    },
    {
      icon: Truck,
      title: 'IMPORT & CUSTOMS CLEARANCE',
      description: 'Full assistance with Ethiopian Revenue & Customs Authority tariffs, plate registration, and smooth title transfer.'
    },
    {
      icon: Banknote,
      title: 'TRANSPARENT ETB PRICING',
      description: 'No hidden surprise fees. Clear ETB pricing backed by official contracts and flexible bank financing assistance.'
    },
    {
      icon: Award,
      title: 'DEDICATED AFTER-SALES',
      description: 'Continuous customer care, spare parts sourcing advice, and long-term satisfaction guarantee for your investment.'
    }
  ];

  return (
    <section className="py-20 bg-kandela-surface border-y border-kandela-border" id="why-choose-us-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-kandela-red">
            THE KANDELA STANDARD
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-kandela-ink uppercase tracking-tight font-sans">
            WHY KANDELA CARS ETHIOPIA?
          </h2>
          <p className="text-kandela-muted text-sm sm:text-base leading-relaxed">
            We bridge luxury automotive sourcing with local peace of mind, ensuring your car buying experience is smooth, verified, and prestigious.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-kandela-border hover:shadow-lg hover:-translate-y-0.5 rounded-xl p-6 transition-all duration-300 flex flex-col justify-between group shadow-sm"
              >
                <div>
                  <div className="w-12 h-12 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center text-kandela-red mb-6 group-hover:scale-110 group-hover:bg-kandela-red group-hover:text-white transition-all duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-kandela-ink text-base font-bold uppercase tracking-wider mb-2 font-sans">
                    {item.title}
                  </h3>
                  <p className="text-kandela-muted text-xs sm:text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-kandela-border text-kandela-red text-[11px] font-semibold tracking-wider uppercase">
                  Kandela Verified
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
