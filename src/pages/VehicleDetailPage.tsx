import React, { useState, useEffect } from 'react';
import {
  Phone,
  MessageCircle,
  Calendar,
  MapPin,
  CheckCircle2,
  Gauge,
  Fuel,
  Car,
  Shield,
  Loader2,
  ArrowLeft,
  Share2
} from 'lucide-react';
import { FinanceSection } from '../components/cars/FinanceSection';
import { PHONE_PRIMARY_DISPLAY, PHONE_PRIMARY_TEL, buildWhatsAppLink } from '../constants/contact';
import { Vehicle } from '../types';
import { api } from '../services/api';
import { VehicleGallery } from '../components/cars/VehicleGallery';
import { InquiryModal } from '../components/cars/InquiryModal';
import { StickyMobileContact } from '../components/cars/StickyMobileContact';
import { SimilarVehicles } from '../components/cars/SimilarVehicles';

interface VehicleDetailPageProps {
  vehicleId: string;
  onNavigate: (path: string) => void;
  onSelectVehicle: (id: string) => void;
}

export const VehicleDetailPage: React.FC<VehicleDetailPageProps> = ({
  vehicleId,
  onNavigate,
  onSelectVehicle
}) => {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  useEffect(() => {
    async function fetchVehicle() {
      try {
        setLoading(true);
        setError(null);
        const data = await api.getVehicleById(vehicleId);
        setVehicle(data);
      } catch (err: any) {
        setError(err.message || 'Vehicle not found');
      } finally {
        setLoading(false);
      }
    }

    fetchVehicle();
  }, [vehicleId]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    } catch {
      setCopiedShare(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center text-neutral-500 space-y-3">
        <Loader2 className="w-10 h-10 animate-spin text-red-600" />
        <p className="text-sm font-medium">
          Loading vehicle specification...
        </p>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen bg-white text-neutral-900 flex flex-col items-center justify-center p-4">
        <div className="bg-white border border-neutral-200 rounded-2xl p-10 max-w-md text-center space-y-4 shadow-xl">
          <h2 className="text-2xl font-black text-neutral-900 uppercase">
            VEHICLE NOT FOUND
          </h2>

          <p className="text-neutral-500 text-sm leading-relaxed">
            The requested vehicle listing may have been sold or removed from
            our available inventory.
          </p>

          <button
            onClick={() => onNavigate('/cars')}
            className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-md transition-colors"
          >
            RETURN TO INVENTORY
          </button>
        </div>
      </div>
    );
  }

  const formatPrice = (val: number, curr = 'ETB') => {
    return `${curr} ${val.toLocaleString('en-US')}`;
  };

  return (
    <div
      className="min-h-screen bg-white text-neutral-900 py-8 pb-24 sm:pb-16"
      id="vehicle-detail-page"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Back Button & Share */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => onNavigate('/cars')}
            className="text-neutral-500 hover:text-neutral-900 text-xs font-bold uppercase tracking-wider flex items-center space-x-2 transition-colors"
            id="back-to-inventory-btn"
          >
            <ArrowLeft className="w-4 h-4 text-red-600" />
            <span>BACK TO INVENTORY</span>
          </button>

          <button
            onClick={handleShare}
            className="bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-200 text-xs font-bold px-3 py-1.5 rounded-md transition-colors flex items-center space-x-1.5 shadow-sm"
            id="share-vehicle-btn"
          >
            <Share2 className="w-3.5 h-3.5 text-red-600" />
            <span>{copiedShare ? 'LINK COPIED!' : 'SHARE'}</span>
          </button>
        </div>

        {/* Vehicle Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-neutral-200 pb-6 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <span className="h-[1px] w-8 bg-red-600"></span>

              <span className="text-red-600 text-xs font-bold tracking-wider uppercase font-sans">
                {vehicle.make} &bull;{' '}
                <span className="tracking-normal font-sans">
                  {vehicle.year}
                </span>
              </span>

              {vehicle.condition?.toLowerCase().includes('new') ? (
                <span className="bg-red-600 text-white text-[10px] font-extrabold tracking-wider px-2.5 py-0.5 uppercase shadow-sm">
                  NEW VEHICLE
                </span>
              ) : (
                <span className="bg-neutral-100 border border-neutral-200 text-neutral-700 text-[10px] font-extrabold tracking-wider px-2.5 py-0.5 uppercase">
                  USED VEHICLE
                </span>
              )}

              {vehicle.status === 'Sold' && (
                <span className="bg-neutral-100 text-neutral-500 border border-neutral-200 text-[10px] font-bold tracking-wider px-2 py-0.5 uppercase">
                  SOLD
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-neutral-950 uppercase tracking-tight font-sans">
              {vehicle.model}
            </h1>

            <p className="text-neutral-500 text-xs sm:text-sm mt-2 flex items-center space-x-2">
              <Shield className="w-4 h-4 text-red-600" />
              <span>Condition: {vehicle.condition}</span>

              {vehicle.importedFrom && (
                <span>
                  • Imported from {vehicle.importedFrom}
                </span>
              )}
            </p>
          </div>

          <div className="md:text-right">
            <span className="text-[10px] text-neutral-400 uppercase tracking-widest block font-bold">
              {vehicle.priceType === 'ContactForPrice'
                ? 'Price'
                : 'Asking Price'}
            </span>

            {vehicle.priceType === 'ContactForPrice' ? (
              <span className="text-3xl sm:text-4xl font-bold text-red-600 tracking-normal font-sans">
                CONTACT FOR PRICE
              </span>
            ) : (
              <span className="flex md:justify-end items-center gap-2 flex-wrap">
                <span className="text-3xl sm:text-4xl font-bold text-red-600 tracking-normal font-sans">
                  {formatPrice(vehicle.price, vehicle.currency)}
                </span>

                {vehicle.priceType === 'Negotiable' && (
                  <span className="bg-neutral-100 border border-neutral-200 text-neutral-700 text-[10px] font-black tracking-wider px-2 py-1 uppercase rounded">
                    Negotiable
                  </span>
                )}
              </span>
            )}
          </div>
        </div>

        {/* Finance */}
        {vehicle.financingAvailable && (
          <FinanceSection vehicle={vehicle} />
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-10">

            {/* Gallery */}
            <VehicleGallery
              images={vehicle.images}
              title={`${vehicle.make} ${vehicle.model}`}
            />

            {/* Quick Specs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-xl bg-white border border-neutral-200 shadow-sm">
              <div className="flex items-center space-x-3">
                <Gauge className="w-6 h-6 text-red-600 shrink-0" />

                <div>
                  <span className="text-[10px] text-neutral-400 uppercase font-bold block">
                    Mileage
                  </span>

                  <span className="text-neutral-900 text-sm font-bold">
                    {vehicle.mileage.toLocaleString()} KM
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Fuel className="w-6 h-6 text-red-600 shrink-0" />

                <div>
                  <span className="text-[10px] text-neutral-400 uppercase font-bold block">
                    Fuel Type
                  </span>

                  <span className="text-neutral-900 text-sm font-bold">
                    {vehicle.fuelType}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Car className="w-6 h-6 text-red-600 shrink-0" />

                <div>
                  <span className="text-[10px] text-neutral-400 uppercase font-bold block">
                    Transmission
                  </span>

                  <span className="text-neutral-900 text-sm font-bold">
                    {vehicle.transmission}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Shield className="w-6 h-6 text-red-600 shrink-0" />

                <div>
                  <span className="text-[10px] text-neutral-400 uppercase font-bold block">
                    Drive Train
                  </span>

                  <span className="text-neutral-900 text-sm font-bold">
                    {vehicle.driveType}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3 bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
              <h3 className="text-neutral-950 text-lg font-bold uppercase tracking-wider font-sans flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-red-600" />
                <span>VEHICLE DESCRIPTION</span>
              </h3>

              <p className="text-neutral-600 text-sm leading-relaxed whitespace-pre-line">
                {vehicle.description ||
                  'No detailed description specified by admin.'}
              </p>
            </div>

            {/* Technical Specifications */}
            <div className="space-y-4">
              <h3 className="text-neutral-950 text-lg font-bold uppercase tracking-wider font-sans flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-red-600" />
                <span>TECHNICAL SPECIFICATIONS</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-neutral-200 rounded-xl overflow-hidden border border-neutral-200 text-xs">
                {[
                  { label: 'Make', val: vehicle.make },
                  { label: 'Model', val: vehicle.model },
                  { label: 'Year', val: vehicle.year },
                  { label: 'Engine', val: vehicle.engine },
                  { label: 'Fuel Type', val: vehicle.fuelType },
                  { label: 'Transmission', val: vehicle.transmission },
                  { label: 'Drive Type', val: vehicle.driveType },
                  { label: 'Body Style', val: vehicle.bodyType },
                  { label: 'Condition', val: vehicle.condition },
                  { label: 'Exterior Color', val: vehicle.exteriorColor },
                  { label: 'Interior Color', val: vehicle.interiorColor },
                  {
                    label: 'Imported From',
                    val: vehicle.importedFrom || 'Local Sourcing'
                  },
                  {
                    label: 'Plate Status',
                    val: vehicle.plateNumber || 'Unregistered Code 3'
                  }
                ].map((spec, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-3.5 flex items-center justify-between"
                  >
                    <span className="text-neutral-500 font-semibold">
                      {spec.label}
                    </span>

                    <span className="text-neutral-950 font-bold text-right">
                      {spec.val || 'N/A'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Premium Features */}
            {vehicle.features && vehicle.features.length > 0 && (
              <div className="space-y-4 pt-2">
                <h3 className="text-neutral-950 text-lg font-bold uppercase tracking-wider font-sans flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-red-600" />
                  <span>PREMIUM FEATURES & OPTIONS</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {vehicle.features.map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-center space-x-2.5 bg-white p-3 rounded-lg border border-neutral-200 shadow-sm"
                    >
                      <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0" />

                      <span className="text-neutral-700 text-xs font-semibold">
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Similar Vehicles */}
            <SimilarVehicles
              vehicle={vehicle}
              onSelectVehicle={onSelectVehicle}
            />
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-6 sticky top-24 shadow-xl">

              <div className="border-b border-neutral-200 pb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-red-600 text-[10px] font-bold uppercase tracking-widest block">
                    AUTOMOTIVE BROKER CONTACT
                  </span>

                  <span className="bg-red-50 text-red-600 border border-red-200 text-[9px] font-bold px-2 py-0.5 uppercase rounded">
                    24/7 AVAILABLE
                  </span>
                </div>

                <h3 className="text-xl font-black text-neutral-950 uppercase tracking-tight font-sans">
                  INTERESTED IN THIS VEHICLE?
                </h3>

                <p className="text-neutral-500 text-xs mt-1">
                  Connect directly with our Addis Ababa vehicle sourcing
                  specialists.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <a
                  href={`tel:${PHONE_PRIMARY_TEL}`}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs tracking-wider uppercase py-3.5 rounded-lg transition-all duration-200 shadow-md shadow-red-600/20 flex items-center justify-center space-x-2"
                  id="detail-call-btn"
                >
                  <Phone className="w-4 h-4" />
                  <span>CALL {PHONE_PRIMARY_DISPLAY}</span>
                </a>

                <a
                  href={buildWhatsAppLink(
                    `Hello Kandela Cars, I am interested in inquiring about the ${vehicle.make} ${vehicle.model} (${vehicle.year})`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs tracking-wider uppercase py-3.5 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-md shadow-emerald-600/20"
                  id="detail-whatsapp-btn"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WHATSAPP INQUIRY</span>
                </a>

                <button
                  onClick={() => setInquiryOpen(true)}
                  className="w-full bg-white hover:bg-neutral-50 text-neutral-800 font-bold text-xs tracking-wider uppercase py-3.5 rounded-lg transition-colors border border-neutral-300 flex items-center justify-center space-x-2"
                  id="detail-request-info-btn"
                >
                  <Calendar className="w-4 h-4 text-red-600" />
                  <span>REQUEST INFORMATION</span>
                </button>
              </div>

              {/* Office Location */}
              <div className="pt-4 border-t border-neutral-200 space-y-2">
                <span className="text-neutral-500 text-xs font-bold uppercase tracking-wider block">
                  OFFICE LOCATION
                </span>

                <div className="flex items-start space-x-2.5 text-xs text-neutral-600">
                  <MapPin className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />

                  <span>
                    Bole Road, Addis Ababa, Ethiopia
                  </span>
                </div>
              </div>

              {/* Availability */}
              <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200 text-[11px] text-neutral-500 space-y-1">
                <div className="flex items-center justify-between text-neutral-700">
                  <span>Client Availability:</span>

                  <span className="font-bold text-emerald-600">
                    24/7 Messaging & Phone
                  </span>
                </div>

                <p className="text-[10px] text-neutral-400">
                  Customs & bank loan document processing support included.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inquiry Modal */}
      <InquiryModal
        isOpen={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        vehicleId={vehicle.id}
        vehicleTitle={`${vehicle.make} ${vehicle.model} (${vehicle.year})`}
      />

      {/* Mobile Sticky Bar */}
      <StickyMobileContact
        whatsappMessage={`Hello Kandela Cars, I am interested in inquiring about the ${vehicle.make} ${vehicle.model} (${vehicle.year}).`}
        onOpenInquiry={() => setInquiryOpen(true)}
      />
    </div>
  );
};