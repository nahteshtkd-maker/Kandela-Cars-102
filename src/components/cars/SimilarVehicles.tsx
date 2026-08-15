import React, { useEffect, useState } from 'react';
import { Vehicle } from '../../types';
import { api } from '../../services/api';
import { VehicleCard } from './VehicleCard';

interface SimilarVehiclesProps {
  vehicle: Vehicle;
  onSelectVehicle: (id: string) => void;
}

/** Higher score = more similar. Purely additive so it's easy to reason about
 *  and tune — no single factor dominates unless it's genuinely a strong match. */
function similarityScore(a: Vehicle, b: Vehicle): number {
  let score = 0;
  if (a.make === b.make) score += 3;
  if (a.bodyType === b.bodyType) score += 3;
  if (a.fuelType === b.fuelType) score += 1;
  if (a.condition === b.condition) score += 1;

  const priceDiff = Math.abs(a.price - b.price) / Math.max(a.price, 1);
  if (priceDiff <= 0.15) score += 3;
  else if (priceDiff <= 0.3) score += 1.5;
  else if (priceDiff <= 0.5) score += 0.5;

  const yearDiff = Math.abs(a.year - b.year);
  if (yearDiff <= 1) score += 2;
  else if (yearDiff <= 3) score += 1;

  return score;
}

export const SimilarVehicles: React.FC<SimilarVehiclesProps> = ({ vehicle, onSelectVehicle }) => {
  const [similar, setSimilar] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        // Cast a reasonably wide net (same body type, same make, and a nearby
        // price band), then rank the combined candidate pool by how similar
        // each one actually is rather than trusting any single filter alone.
        const priceMin = Math.max(0, Math.round(vehicle.price * 0.6));
        const priceMax = Math.round(vehicle.price * 1.4);

        const [byBodyType, byMake, byPrice] = await Promise.all([
          api.getVehicles({ bodyType: vehicle.bodyType, limit: 12 }),
          api.getVehicles({ make: vehicle.make, limit: 12 }),
          api.getVehicles({ priceMin, priceMax, limit: 12 })
        ]);

        const seen = new Set<string>([vehicle.id]);
        const candidates: Vehicle[] = [];
        for (const v of [...byBodyType.vehicles, ...byMake.vehicles, ...byPrice.vehicles]) {
          if (seen.has(v.id)) continue;
          seen.add(v.id);
          candidates.push(v);
        }

        // Only keep genuinely relevant matches — a nonzero score means at
        // least one real similarity factor (brand, body type, price, or year
        // band) matched, so we never fall back to showing unrelated cars.
        const ranked = candidates
          .map(v => ({ vehicle: v, score: similarityScore(vehicle, v) }))
          .filter(r => r.score > 0)
          .sort((a, b) => b.score - a.score)
          .slice(0, 4)
          .map(r => r.vehicle);

        if (!cancelled) setSimilar(ranked);
      } catch {
        if (!cancelled) setSimilar([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [vehicle.id, vehicle.bodyType, vehicle.make, vehicle.price, vehicle.year]);

  // Gracefully disappears rather than padding with unrelated inventory.
  if (!loading && similar.length === 0) return null;

  return (
    <div className="space-y-4 pt-6 border-t border-neutral-800" id="similar-vehicles-section">
      <h3 className="text-white text-lg font-bold uppercase tracking-wider font-sans flex items-center space-x-2">
        <span className="w-2 h-2 rounded-full bg-red-600" />
        <span>SIMILAR VEHICLES</span>
      </h3>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-52 bg-neutral-900 border border-neutral-800 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {similar.map(v => (
            <VehicleCard key={v.id} vehicle={v} onSelect={onSelectVehicle} />
          ))}
        </div>
      )}
    </div>
  );
};
