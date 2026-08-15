import React from 'react';
import {
  Car,
  Search,
  Globe,
  RefreshCw,
  Headphones,
  ShieldCheck,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

interface ServicesPageProps {
  onNavigate: (path: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onNavigate }) => {
  const services = [
    {
      icon: Car,
      number: '01',
      title: 'VEHICLE SALES',
      desc: 'Browse carefully selected luxury SUVs, electric vehicles, family cars, and premium used vehicles available through Kandela Cars.'
    },
    {
      icon: Search,
      number: '02',
      title: 'CUSTOM VEHICLE SOURCING',
      desc: 'Looking for a specific model, trim, color, or specification? Our sourcing service helps locate vehicles that match your exact requirements.'
    },
    {
      icon: Globe,
      number: '03',
      title: 'IMPORTATION & CUSTOMS',
      desc: 'We provide guidance throughout the vehicle importation process, including documentation, customs coordination, and logistics.'
    },
    {
      icon: RefreshCw,
      number: '04',
      title: 'TRADE-IN & EXCHANGE',
      desc: 'Upgrade your vehicle with a professional market evaluation and explore options for applying your existing vehicle toward your next purchase.'
    },
    {
      icon: ShieldCheck,
      number: '05',
      title: 'PRE-PURCHASE INSPECTION',
      desc: 'Vehicle condition matters. We assist with technical verification including mechanical condition, diagnostics, chassis checks, and EV battery assessment.'
    },
    {
      icon: Headphones,
      number: '06',
      title: 'AFTER-SALES SUPPORT',
      desc: 'Our relationship continues after delivery with service guidance, spare-parts sourcing assistance, insurance coordination, and customer support.'
    }
  ];

  return (
    <div
      className="min-h-screen bg-white text-neutral-900 py-10 sm:py-14"
      id="services-page"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* HEADER */}
        <section className="max-w-4xl mx-auto text-center mb-16 sm:mb-20">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 border border-red-100 text-red-600 text-[11px] font-bold uppercase tracking-[0.18em] mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
            KANDELA SERVICES
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-[0.95] text-neutral-950">
            EVERYTHING YOU NEED
            <span className="block text-red-600">TO MOVE FORWARD.</span>
          </h1>

          <p className="mt-6 text-neutral-500 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            From finding your next vehicle to sourcing, inspection,
            importation, and after-sales support, Kandela Cars provides a
            complete automotive brokerage experience.
          </p>

        </section>

        {/* SERVICE GRID */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-20">

          {services.map((service) => {
            const Icon = service.icon;

            return (
              <div
                key={service.number}
                className="group bg-white border border-neutral-200 rounded-2xl p-7 sm:p-8 hover:border-red-200 hover:shadow-xl hover:shadow-neutral-200/50 transition-all duration-300 flex flex-col"
              >

                <div className="flex items-start justify-between mb-8">
                  <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
                    <Icon className="w-6 h-6" />
                  </div>

                  <span className="text-[11px] font-black text-neutral-300 tracking-widest">
                    {service.number}
                  </span>
                </div>

                <h3 className="text-xl font-black uppercase tracking-tight text-neutral-950">
                  {service.title}
                </h3>

                <p className="mt-3 text-sm text-neutral-500 leading-relaxed flex-1">
                  {service.desc}
                </p>

                <div className="mt-7 pt-5 border-t border-neutral-100 flex items-center justify-between">
                  <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">
                    Kandela Cars
                  </span>

                  <ArrowRight className="w-4 h-4 text-red-600 group-hover:translate-x-1 transition-transform" />
                </div>

              </div>
            );
          })}

        </section>

        {/* HOW IT WORKS */}
        <section className="mb-20">

          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-red-600 text-xs font-bold uppercase tracking-[0.18em]">
              SIMPLE PROCESS
            </span>

            <h2 className="mt-2 text-3xl sm:text-4xl font-black uppercase tracking-tight text-neutral-950">
              FROM REQUEST TO ROAD
            </h2>

            <p className="mt-3 text-neutral-500 text-sm leading-relaxed">
              Our process is designed to remove unnecessary friction from
              buying or sourcing a vehicle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            {[
              {
                step: '01',
                title: 'TELL US WHAT YOU NEED',
                text: 'Tell us the model, budget, specifications, and preferences you have in mind.'
              },
              {
                step: '02',
                title: 'WE SOURCE & VERIFY',
                text: 'Our team searches for suitable options and helps evaluate the vehicle before you commit.'
              },
              {
                step: '03',
                title: 'DRIVE WITH CONFIDENCE',
                text: 'We assist through negotiation, documentation, delivery, and post-purchase support.'
              }
            ].map((item) => (
              <div
                key={item.step}
                className="relative bg-neutral-50 border border-neutral-200 rounded-2xl p-7"
              >
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-full bg-red-600 text-white flex items-center justify-center text-xs font-black">
                    {item.step}
                  </span>

                  <h3 className="text-sm font-black text-neutral-950">
                    {item.title}
                  </h3>
                </div>

                <p className="mt-5 text-sm text-neutral-500 leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}

          </div>

        </section>

        {/* WHY KANDELA */}
        <section className="bg-neutral-950 rounded-3xl p-8 sm:p-12 text-white mb-20">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

            <div>
              <span className="text-red-500 text-xs font-bold uppercase tracking-[0.18em]">
                WHY KANDELA
              </span>

              <h2 className="mt-3 text-3xl sm:text-4xl font-black uppercase tracking-tight">
                A BROKERAGE BUILT AROUND THE CUSTOMER.
              </h2>

              <p className="mt-4 text-neutral-400 text-sm leading-relaxed max-w-xl">
                We are not simply putting cars on a website. Our job is to
                make the process of finding, evaluating, purchasing, and
                sourcing a vehicle easier for you.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {[
                'Professional vehicle sourcing',
                'Transparent communication',
                'Vehicle verification support',
                'Importation assistance',
                'Custom vehicle requests',
                '24/7 customer availability'
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2.5 text-sm text-neutral-200"
                >
                  <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}

            </div>

          </div>

        </section>

        {/* CTA */}
        <section className="bg-red-600 rounded-3xl p-8 sm:p-12 text-white text-center">

          <span className="text-white/70 text-xs font-bold uppercase tracking-[0.18em]">
            READY WHEN YOU ARE
          </span>

          <h2 className="mt-3 text-3xl sm:text-4xl font-black uppercase tracking-tight">
            LOOKING FOR A SPECIFIC VEHICLE?
          </h2>

          <p className="mt-3 max-w-xl mx-auto text-white/80 text-sm leading-relaxed">
            Tell Kandela Cars what you are looking for and our team can help
            you find the right vehicle.
          </p>

          <div className="mt-7 flex flex-col sm:flex-row justify-center gap-3">

            <button
              onClick={() => onNavigate('/contact')}
              className="bg-white hover:bg-neutral-100 text-neutral-950 font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-lg transition-all inline-flex items-center justify-center gap-2"
            >
              CONTACT OUR TEAM
              <ArrowRight className="w-4 h-4 text-red-600" />
            </button>

            <button
              onClick={() => onNavigate('/cars')}
              className="bg-red-700 hover:bg-red-800 text-white border border-red-500 font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-lg transition-all"
            >
              BROWSE VEHICLES
            </button>

          </div>

        </section>

      </div>
    </div>
  );
};