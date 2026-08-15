import React, { useEffect, useState } from 'react';
import { ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import { VehicleCard } from '../cars/VehicleCard';
import { Vehicle } from '../../types';
import { api } from '../../services/api';

interface FeaturedVehiclesProps {
  onSelectVehicle: (id: string) => void;
  onNavigate: (path: string) => void;
}

export const FeaturedVehicles: React.FC<FeaturedVehiclesProps> = ({
  onSelectVehicle,
  onNavigate
}) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        setLoading(true);
        const data = await api.getVehicles({ featured: true, limit: 6 });
        // Fallback if no vehicles are explicitly marked featured
        if (data.vehicles.length === 0) {
          const allData = await api.getVehicles({ limit: 6 });
          setVehicles(allData.vehicles);
        } else {
          setVehicles(data.vehicles);
        }
      } catch (err) {
        console.error('Failed to load featured vehicles', err);
      } finally {
        setLoading(false);
      }
    }
    fetchFeatured();
  }, []);

  return (
    <section className="py-16 sm:py-20 bg-white" id="featured-vehicles-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header matching Bold Typography Theme */}
        <div className="flex items-end justify-between mb-8 pb-4 border-b border-kandela-border">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tighter uppercase text-kandela-ink font-heading">
              Featured Inventory
            </h2>
            <div className="w-12 h-1 bg-kandela-red mt-1" />
          </div>

          <button
            onClick={() => onNavigate('/cars')}
            className="text-xs font-bold text-kandela-red tracking-widest uppercase hover:underline flex items-center space-x-1"
            id="view-all-featured-btn"
          >
            <span>View All Marketplace →</span>
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-kandela-muted space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-kandela-red" />
            <p className="text-xs tracking-widest uppercase font-bold">Loading available inventory...</p>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="bg-kandela-surface border border-kandela-border p-12 text-center text-kandela-muted rounded-xl">
            <p className="text-sm font-semibold uppercase tracking-wider">No featured vehicles currently available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {vehicles.map(v => (
              <VehicleCard key={v.id} vehicle={v} onSelect={onSelectVehicle} />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
