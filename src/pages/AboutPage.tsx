import React from 'react';
import { CheckCircle, ArrowRight, ShieldCheck, Award, Users } from 'lucide-react';
import { KandelaLogo } from '../components/common/KandelaLogo';
import leopardImage from '../assets/Leopard 08.png';

interface AboutPageProps {
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div
      className="min-h-screen bg-white text-neutral-900 py-12"
      id="about-page"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

        {/* =========================================================
            HERO SECTION
        ========================================================== */}
        <section className="text-center max-w-4xl mx-auto space-y-5">

          <span className="inline-flex items-center text-red-600 text-xs font-bold uppercase tracking-wider bg-red-50 border border-red-100 px-4 py-2 rounded-full">
            ABOUT KANDELA CARS ETHIOPIA
          </span>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-[0.95] text-neutral-950 font-sans">
            ETHIOPIA'S PREMIER
            <br />
            <span className="text-red-600">
              AUTOMOTIVE BROKER
            </span>
          </h1>

          <p className="text-neutral-600 text-base sm:text-lg leading-relaxed max-w-3xl mx-auto">
            Kandela Cars is a professional automotive broker and vehicle
            sourcing service helping customers acquire quality new and used
            vehicles in Ethiopia with complete transparency and verified
            inspection.
          </p>

        </section>


        {/* =========================================================
            VISUAL STORY BANNER
        ========================================================== */}
        <section className="relative rounded-3xl overflow-hidden border border-neutral-200 aspect-[21/9] bg-neutral-100 shadow-sm">

          <img
  src={leopardImage}
  alt="Kandela Cars - Leopard 8"
  className="w-full h-full object-cover"
/>

          {/* Light overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

          <div className="absolute bottom-8 left-8 right-8 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-5">

            <div>
              <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 inline-block">
                <KandelaLogo size="md" />
              </div>

              <p className="text-white text-xs sm:text-sm mt-3 max-w-md font-medium">
                Bole Road Office • Addis Ababa, Ethiopia • 24/7 Client
                Availability
              </p>
            </div>

            <button
              onClick={() => onNavigate('/cars')}
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-lg transition-all shadow-lg shadow-red-600/30 flex items-center space-x-2"
            >
              <span>EXPLORE VEHICLE INVENTORY</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </div>
        </section>


        {/* =========================================================
            TRUST STATS
        ========================================================== */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          <div className="bg-white border border-neutral-200 rounded-2xl p-6 flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-red-600" />
            </div>

            <div>
              <p className="text-2xl font-black text-neutral-950">
                VERIFIED
              </p>
              <p className="text-xs text-neutral-500 uppercase tracking-wide font-semibold">
                Vehicle Quality
              </p>
            </div>
          </div>


          <div className="bg-white border border-neutral-200 rounded-2xl p-6 flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center">
              <Award className="w-6 h-6 text-red-600" />
            </div>

            <div>
              <p className="text-2xl font-black text-neutral-950">
                PREMIUM
              </p>
              <p className="text-xs text-neutral-500 uppercase tracking-wide font-semibold">
                Brokerage Service
              </p>
            </div>
          </div>


          <div className="bg-white border border-neutral-200 rounded-2xl p-6 flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center">
              <Users className="w-6 h-6 text-red-600" />
            </div>

            <div>
              <p className="text-2xl font-black text-neutral-950">
                24/7
              </p>
              <p className="text-xs text-neutral-500 uppercase tracking-wide font-semibold">
                Client Support
              </p>
            </div>
          </div>

        </section>


        {/* =========================================================
            WHO WE ARE
        ========================================================== */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          <div className="space-y-5">

            <span className="text-red-600 text-xs font-bold uppercase tracking-widest">
              WHO WE ARE
            </span>

            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-neutral-950 font-sans">
              MAKING CAR BUYING
              <br />
              <span className="text-red-600">
                SIMPLE & TRUSTED
              </span>
            </h2>

            <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
              In Ethiopia’s dynamic automotive market, purchasing or importing
              a vehicle is a major decision. Kandela Cars functions as a
              trusted automotive broker and sourcing partner, connecting
              buyers with vetted vehicles across the country and overseas.
            </p>

            <p className="text-neutral-500 text-sm leading-relaxed">
              Whether you are looking for brand new EVs like the BYD Atto 3,
              executive SUVs like the Toyota Land Cruiser 300 VXR, or
              high-grade pre-owned vehicles, we manage verification,
              negotiations, customs support, and handover.
            </p>

          </div>


          {/* Core Pillars */}
          <div className="bg-neutral-50 border border-neutral-200 rounded-3xl p-8 space-y-6">

            <div>
              <span className="text-red-600 text-xs font-bold uppercase tracking-widest">
                OUR 4 CORE PILLARS
              </span>

              <h3 className="text-2xl font-black uppercase text-neutral-950 mt-2">
                WHY KANDELA
              </h3>
            </div>

            <ul className="space-y-5">

              {[
                {
                  title: 'Verified Quality',
                  desc: 'Multi-point mechanical inspection before client handover.'
                },
                {
                  title: 'Customs & Sourcing Guidance',
                  desc: 'Full assistance with tariff calculations, bank letters, and customs clearance.'
                },
                {
                  title: 'Fair Market Value',
                  desc: 'Transparent ETB pricing reflecting real market conditions.'
                },
                {
                  title: '24/7 Customer Support',
                  desc: 'Continuous communication, vehicle sourcing requests, and post-purchase assistance.'
                }
              ].map((pillar, idx) => (

                <li
                  key={idx}
                  className="flex items-start gap-3"
                >

                  <div className="mt-0.5 shrink-0">
                    <CheckCircle className="w-5 h-5 text-red-600" />
                  </div>

                  <div>
                    <span className="font-bold text-neutral-950 block text-sm">
                      {pillar.title}
                    </span>

                    <span className="text-neutral-500 text-xs leading-relaxed">
                      {pillar.desc}
                    </span>
                  </div>

                </li>

              ))}

            </ul>

          </div>

        </section>


        {/* =========================================================
            MISSION & VISION
        ========================================================== */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Mission */}
          <div className="bg-neutral-950 text-white rounded-3xl p-8 sm:p-10 space-y-4">

            <span className="text-red-500 text-xs font-bold uppercase tracking-widest">
              OUR MISSION
            </span>

            <h3 className="text-2xl sm:text-3xl font-black uppercase font-sans">
              SEAMLESS VEHICLE
              <br />
              SOURCING
            </h3>

            <p className="text-neutral-400 text-sm leading-relaxed">
              To connect Ethiopian buyers with reliable new and used vehicles
              through expert brokerage, transparent pricing, and 24/7 client
              communication.
            </p>

          </div>


          {/* Vision */}
          <div className="bg-red-600 text-white rounded-3xl p-8 sm:p-10 space-y-4">

            <span className="text-red-100 text-xs font-bold uppercase tracking-widest">
              OUR VISION
            </span>

            <h3 className="text-2xl sm:text-3xl font-black uppercase font-sans">
              ETHIOPIA'S MOST
              <br />
              TRUSTED BROKER
            </h3>

            <p className="text-red-100 text-sm leading-relaxed">
              To set the regional standard for automotive brokerage, electric
              vehicle sourcing, and client satisfaction.
            </p>

          </div>

        </section>


        {/* =========================================================
            HOW WE WORK
        ========================================================== */}
        <section className="space-y-8">

          <div className="text-center max-w-2xl mx-auto">

            <span className="text-red-600 text-xs font-bold uppercase tracking-widest">
              THE KANDELA PROCESS
            </span>

            <h2 className="text-3xl sm:text-4xl font-black uppercase text-neutral-950 mt-2">
              FROM SEARCH TO
              <span className="text-red-600"> HANDOVER</span>
            </h2>

            <p className="text-neutral-500 text-sm mt-3">
              We make the vehicle sourcing journey straightforward,
              transparent, and professionally managed.
            </p>

          </div>


          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

            {[
              {
                number: '01',
                title: 'DISCOVER',
                desc: 'Tell us the vehicle, specification, and budget you are looking for.'
              },
              {
                number: '02',
                title: 'SOURCE',
                desc: 'We locate suitable vehicles through our sourcing network.'
              },
              {
                number: '03',
                title: 'VERIFY',
                desc: 'Vehicle condition, documentation, pricing, and details are carefully reviewed.'
              },
              {
                number: '04',
                title: 'DELIVER',
                desc: 'We coordinate the final process through documentation and handover.'
              }
            ].map((step) => (

              <div
                key={step.number}
                className="bg-white border border-neutral-200 rounded-2xl p-6 hover:border-red-200 hover:shadow-md transition-all"
              >

                <span className="text-red-600 text-sm font-black">
                  {step.number}
                </span>

                <h3 className="text-lg font-black text-neutral-950 mt-3">
                  {step.title}
                </h3>

                <p className="text-neutral-500 text-xs leading-relaxed mt-2">
                  {step.desc}
                </p>

              </div>

            ))}

          </div>

        </section>


        {/* =========================================================
            FINAL CTA
        ========================================================== */}
        <section className="bg-neutral-50 border border-neutral-200 rounded-3xl p-8 sm:p-12 text-center space-y-5">

          <span className="text-red-600 text-xs font-bold uppercase tracking-widest">
            START YOUR SEARCH
          </span>

          <h3 className="text-3xl sm:text-4xl font-black uppercase text-neutral-950 font-sans">
            READY TO SOURCE
            <br />
            <span className="text-red-600">
              YOUR NEXT CAR?
            </span>
          </h3>

          <p className="text-neutral-500 text-sm max-w-xl mx-auto">
            Explore our curated inventory of new and used vehicles or reach
            out to our team for a personalized vehicle sourcing request.
          </p>

          <button
            onClick={() => onNavigate('/cars')}
            className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-lg transition-all shadow-lg shadow-red-600/20 inline-flex items-center gap-2"
          >
            <span>VIEW ALL AVAILABLE VEHICLES</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </section>

      </div>
    </div>
  );
};