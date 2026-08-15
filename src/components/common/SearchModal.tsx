import React, { useState, useEffect } from 'react';
import { Search, X, Loader2, ArrowRight } from 'lucide-react';
import { Vehicle } from '../../types';
import { api } from '../../services/api';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectVehicle: (id: string) => void;
  onNavigateToCars: (query: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectVehicle,
  onNavigateToCars
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const data = await api.getVehicles({ search: query, limit: 6 });
        setResults(data.vehicles);
      } catch (err) {
        console.error('Search error', err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950/85 backdrop-blur-md flex items-start justify-center pt-20 px-4" id="global-search-modal">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4">
        
        {/* Input Header */}
        <div className="flex items-center space-x-3 pb-3 border-b border-neutral-800">
          <Search className="w-5 h-5 text-red-500 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search make, model, year, e.g. Toyota Land Cruiser, BYD Atto 3..."
            className="w-full bg-transparent text-white text-base focus:outline-none placeholder-neutral-500 font-sans"
            id="modal-search-input"
          />
          {loading && <Loader2 className="w-5 h-5 animate-spin text-red-600 shrink-0" />}
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800"
            id="close-search-modal-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Tag Suggestions */}
        {!query && (
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase text-neutral-500 tracking-wider">
              Popular Searches:
            </span>
            <div className="flex flex-wrap gap-2">
              {['Toyota Land Cruiser 300', 'BYD Electric', 'Hyundai Tucson', 'Mercedes G63', 'Lexus LX600', 'Defender 110'].map(tag => (
                <button
                  key={tag}
                  onClick={() => setQuery(tag)}
                  className="text-xs bg-neutral-950 hover:bg-neutral-800 text-neutral-300 px-3 py-1.5 rounded-md border border-neutral-800 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {query && (
          <div className="max-h-[60vh] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {results.length === 0 && !loading ? (
              <div className="text-center py-8 text-neutral-400 text-sm">
                No vehicles matching "<span className="text-white">{query}</span>" found in current inventory.
              </div>
            ) : (
              results.map(v => (
                <div
                  key={v.id}
                  onClick={() => {
                    onSelectVehicle(v.id);
                    onClose();
                  }}
                  className="flex items-center space-x-4 p-3 rounded-xl bg-neutral-950 hover:bg-neutral-800/80 border border-neutral-800/60 hover:border-red-600/50 cursor-pointer transition-all group"
                >
                  <img
                    src={v.primaryImage || v.images?.[0]}
                    alt={`${v.make} ${v.model}`}
                    className="w-16 h-12 object-cover rounded-lg bg-neutral-900"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-red-500 text-[10px] font-bold uppercase tracking-wider block">
                      {v.make} • {v.year}
                    </span>
                    <h4 className="text-white text-sm font-bold truncate group-hover:text-red-400 transition-colors">
                      {v.model}
                    </h4>
                    <span className="text-neutral-400 text-xs">
                      {v.fuelType} | {v.transmission} | {v.mileage.toLocaleString()} KM
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-white text-sm font-black block font-sans text-red-400">
                      ETB {v.price.toLocaleString()}
                    </span>
                    <span className="text-xs text-neutral-400 group-hover:text-white flex items-center justify-end space-x-1">
                      <span>View</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* See all results link */}
        {query && results.length > 0 && (
          <div className="pt-2 border-t border-neutral-800 text-center">
            <button
              onClick={() => {
                onNavigateToCars(query);
                onClose();
              }}
              className="text-xs text-red-500 hover:text-red-400 font-bold uppercase tracking-wider inline-flex items-center space-x-1"
            >
              <span>See all matching results in inventory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
