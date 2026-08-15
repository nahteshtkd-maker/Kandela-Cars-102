import React from 'react';
import { Heart } from 'lucide-react';
import { Vehicle } from '../../types';
import { useCustomerAuth } from '../../context/CustomerAuthContext';

interface VehicleCardProps {
  vehicle: Vehicle;
  onSelect: (id: string) => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onSelect }) => {
  const { favoriteIds, toggleFavorite } = useCustomerAuth();
  const isFavorited = favoriteIds.has(vehicle.id);

  const formatPrice = (val: number, currency: string = 'ETB') => {
    return `${currency} ${val.toLocaleString('en-US')}`;
  };

  const getStatusBadge = () => {
    if (vehicle.status === 'Sold') {
      return (
        <span className="bg-kandela-ink text-white text-[9px] font-black tracking-wider px-2 py-0.5 uppercase rounded">
          SOLD
        </span>
      );
    }
    if (vehicle.status === 'Reserved') {
      return (
        <span className="bg-amber-100 text-amber-800 border border-amber-300 text-[9px] font-black tracking-wider px-2 py-0.5 uppercase rounded">
          RESERVED
        </span>
      );
    }
    return null;
  };

  const isNewVehicle = Boolean(vehicle.condition && vehicle.condition.toLowerCase().includes('new'));

  return (
    <div
      onClick={() => onSelect(vehicle.id)}
      id={`vehicle-card-${vehicle.id}`}
      className="bg-white border border-kandela-border rounded-xl overflow-hidden flex flex-col group cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
    >
      {/* Vehicle Image Container */}
      <div className="h-36 sm:h-40 bg-kandela-surface overflow-hidden relative">
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between z-10 pointer-events-none">
          <div className="flex flex-col items-start gap-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="bg-kandela-red text-white text-[9px] font-extrabold tracking-wider px-2 py-0.5 uppercase rounded shadow-sm">
                {vehicle.year}
              </span>
              {vehicle.featured && (
                <span className="bg-white/95 border border-kandela-border text-kandela-ink text-[9px] font-extrabold tracking-wider px-2 py-0.5 uppercase rounded shadow-sm backdrop-blur-sm">
                  FEATURED
                </span>
              )}
              {getStatusBadge()}
            </div>
            {vehicle.financingAvailable && (
              <span className="bg-white/95 border border-emerald-300 text-emerald-700 text-[9px] font-black tracking-wider px-1.5 py-0.5 uppercase rounded shadow-sm backdrop-blur-sm">
                FINANCING
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(vehicle.id);
            }}
            id={`favorite-btn-${vehicle.id}`}
            title={isFavorited ? 'Remove from saved cars' : 'Save this car'}
            className="pointer-events-auto w-8 h-8 rounded-full bg-white/95 backdrop-blur-sm border border-kandela-border flex items-center justify-center hover:border-kandela-red transition-colors shrink-0 shadow-sm"
          >
            <Heart className={`w-4 h-4 transition-colors ${isFavorited ? 'fill-kandela-red text-kandela-red' : 'text-kandela-muted'}`} />
          </button>
        </div>
        {vehicle.importedFrom && (
          <span className="absolute bottom-3 right-3 z-10 bg-white/90 text-kandela-muted text-[9px] font-medium px-2 py-0.5 backdrop-blur-sm border border-kandela-border rounded">
            {vehicle.importedFrom}
          </span>
        )}
        <img
          src={vehicle.primaryImage || vehicle.images?.[0]}
          alt={`${vehicle.make} ${vehicle.model}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </div>

      {/* Content Section */}
      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
        <div>
          <div className="flex justify-between items-start mb-1 gap-2">
            <h3 className="text-base font-bold tracking-tight text-kandela-ink group-hover:text-kandela-red transition-colors line-clamp-1 font-sans">
              {vehicle.make} {vehicle.model}
            </h3>
            {!isNewVehicle && (
              <span className="text-kandela-muted text-[9px] font-bold uppercase tracking-wider shrink-0 bg-kandela-surface px-1.5 py-0.5 rounded">
                Used
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-[10px] text-kandela-muted font-semibold uppercase tracking-wider mt-1.5">
            <span>{vehicle.fuelType}</span>
            <span>•</span>
            <span>{vehicle.transmission}</span>
            <span>•</span>
            <span className="tracking-normal font-sans">{vehicle.mileage.toLocaleString()} KM</span>
          </div>
        </div>

        {/* Footer: Price + View Details */}
        <div className="pt-3 border-t border-kandela-border flex items-center justify-between gap-2">
          <div>
            <span className="text-[9px] text-kandela-muted uppercase tracking-wider block font-medium">
              {vehicle.priceType === 'ContactForPrice' ? 'Price' : 'Asking Price'}
            </span>
            {vehicle.priceType === 'ContactForPrice' ? (
              <span className="text-kandela-red font-bold text-sm tracking-normal font-sans">
                CONTACT FOR PRICE
              </span>
            ) : (
              <span className="flex items-center gap-1.5 flex-wrap">
                <span className="text-kandela-red font-bold text-base tracking-normal font-sans">
                  {formatPrice(vehicle.price, vehicle.currency)}
                </span>
                {vehicle.priceType === 'Negotiable' && (
                  <span className="bg-kandela-surface text-kandela-muted text-[8px] font-black tracking-wider px-1.5 py-0.5 uppercase rounded">
                    Negotiable
                  </span>
                )}
              </span>
            )}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(vehicle.id);
            }}
            id={`view-vehicle-btn-${vehicle.id}`}
            className="text-[10px] font-bold uppercase tracking-wider text-kandela-ink border border-kandela-border rounded-full px-3 py-1.5 group-hover:bg-kandela-red group-hover:border-kandela-red group-hover:text-white transition-all shrink-0 whitespace-nowrap"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};
