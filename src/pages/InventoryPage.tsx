import React, { useState, useEffect } from 'react';
import { Filter, Search, Loader2, ArrowUpDown, SlidersHorizontal, Car } from 'lucide-react';
import { Vehicle, SearchFilters } from '../types';
import { api } from '../services/api';
import { VehicleCard } from '../components/cars/VehicleCard';
import { VehicleFilters } from '../components/cars/VehicleFilters';

interface InventoryPageProps {
  initialFilters?: SearchFilters;
  onSelectVehicle: (id: string) => void;
}

export const InventoryPage: React.FC<InventoryPageProps> = ({
  initialFilters = {},
  onSelectVehicle
}) => {
  const [filters, setFilters] = useState<SearchFilters>({
    search: '',
    make: 'All',
    model: 'All',
    sort: 'newest',
    page: 1,
    limit: 24,
    ...initialFilters
  });

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    async function loadVehicles() {
      try {
        setLoading(true);
        const data = await api.getVehicles(filters);
        setVehicles(data.vehicles);
        setTotalCount(data.total);
      } catch (err) {
        console.error('Failed to load vehicles inventory', err);
      } finally {
        setLoading(false);
      }
    }
    loadVehicles();
  }, [filters]);

  const handleFilterChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
  };

  const handleSearchTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }));
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, sort: e.target.value as any }));
  };

  const handleClearAll = () => {
    setFilters({
      search: '',
      make: 'All',
      model: 'All',
      yearMin: undefined,
      yearMax: undefined,
      priceMin: undefined,
      priceMax: undefined,
      fuelType: 'All',
      transmission: 'All',
      bodyType: 'All',
      condition: 'All',
      status: 'All',
      featured: false,
      bankLoan: false,
      sort: 'newest',
      page: 1,
      limit: 24
    });
  };

  return (
    <div className="min-h-screen bg-white text-kandela-ink py-10" id="inventory-page-container">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Page Title & Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-kandela-border pb-6 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="h-[1px] w-8 bg-kandela-red"></span>
              <span className="text-kandela-red text-xs font-bold tracking-[0.3em] uppercase">
                Addis Ababa Marketplace
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-kandela-ink uppercase tracking-tighter font-heading">
              AVAILABLE INVENTORY
            </h1>
          </div>

          {/* Result Count Badge & Sort */}
          <div className="flex items-center space-x-4">
            <span className="bg-kandela-surface border border-kandela-border text-kandela-ink text-xs font-bold uppercase tracking-wider px-4 py-2.5 flex items-center space-x-2 rounded-full">
              <Car className="w-4 h-4 text-kandela-red" />
              <span>{totalCount} VEHICLES</span>
            </span>

            {/* Mobile Filter Toggle Button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="md:hidden bg-kandela-red text-white text-xs font-bold tracking-widest uppercase px-4 py-2.5 flex items-center space-x-1.5 rounded-full"
              id="open-mobile-filter-btn"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>FILTERS</span>
            </button>
          </div>
        </div>

        {/* Top Controls: Search Bar & Sort Dropdown */}
        <div className="bg-white border border-kandela-border rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
          {/* Keyword Search Input */}
          <div className="relative w-full md:max-w-md">
            <Search className="w-4 h-4 text-kandela-muted absolute left-3 top-3" />
            <input
              type="text"
              value={filters.search || ''}
              onChange={handleSearchTextChange}
              placeholder="Search make, model, year, engine..."
              className="w-full bg-white border border-kandela-border text-kandela-ink rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-kandela-red"
              id="inventory-search-input"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
            <ArrowUpDown className="w-4 h-4 text-kandela-muted shrink-0" />
            <span className="text-xs font-bold uppercase text-kandela-muted shrink-0">Sort By:</span>
            <select
              value={filters.sort || 'newest'}
              onChange={handleSortChange}
              className="bg-white border border-kandela-border text-kandela-ink rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:border-kandela-red"
              id="inventory-sort-select"
            >
              <option value="newest">Newest Additions</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="mileage-asc">Lowest Mileage</option>
            </select>
          </div>
        </div>

        {/* Main Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Desktop Filter Sidebar */}
          <div className="hidden md:block col-span-1">
            <div className="sticky top-24">
              <VehicleFilters filters={filters} onChange={handleFilterChange} />
            </div>
          </div>

          {/* Vehicle Grid & Loading/Empty States */}
          <div className="col-span-1 md:col-span-3">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 text-kandela-muted space-y-3">
                <Loader2 className="w-10 h-10 animate-spin text-kandela-red" />
                <p className="text-sm">Fetching vehicle inventory...</p>
              </div>
            ) : vehicles.length === 0 ? (
              <div className="bg-kandela-surface border border-kandela-border rounded-2xl p-12 text-center space-y-4" id="empty-inventory-state">
                <div className="w-16 h-16 rounded-full bg-white border border-kandela-border flex items-center justify-center mx-auto text-kandela-muted">
                  <Car className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-kandela-ink uppercase tracking-tight">
                  NO VEHICLES MATCH YOUR SEARCH
                </h3>
                <p className="text-kandela-muted text-sm max-w-md mx-auto">
                  Try adjusting your filter options, clearing max price limits, or searching for broader terms like "Toyota" or "SUV".
                </p>
                <button
                  onClick={handleClearAll}
                  className="bg-kandela-red hover:bg-kandela-red-hover text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-full transition-colors"
                  id="clear-filters-btn"
                >
                  CLEAR ALL FILTERS
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {vehicles.map(v => (
                  <VehicleCard key={v.id} vehicle={v} onSelect={onSelectVehicle} />
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md flex justify-end md:hidden" id="mobile-filters-modal">
          <div className="w-full max-w-xs bg-white h-full p-4 overflow-y-auto">
            <VehicleFilters
              filters={filters}
              onChange={handleFilterChange}
              onCloseMobile={() => setMobileFilterOpen(false)}
            />
          </div>
        </div>
      )}

    </div>
  );
};
