import React, { useState, useEffect } from 'react';
import { Filter, X, RotateCcw } from 'lucide-react';
import { SearchFilters } from '../../types';
import { api } from '../../services/api';

interface VehicleFiltersProps {
  filters: SearchFilters;
  onChange: (filters: SearchFilters) => void;
  onCloseMobile?: () => void;
}

export const VehicleFilters: React.FC<VehicleFiltersProps> = ({
  filters,
  onChange,
  onCloseMobile
}) => {
  const [makes, setMakes] = useState<string[]>([]);
  const [modelsByMake, setModelsByMake] = useState<Record<string, string[]>>({});

  useEffect(() => {
    async function loadMakes() {
      try {
        const data = await api.getMakesAndModels();
        setMakes(data.makes);
        setModelsByMake(data.modelsByMake);
      } catch (err) {
        console.error('Failed to load makes', err);
      }
    }
    loadMakes();
  }, []);

  const handleChange = (key: keyof SearchFilters, value: any) => {
    const updated = { ...filters, [key]: value, page: 1 };
    if (key === 'make') {
      updated.model = 'All';
    }
    onChange(updated);
  };

  const handleReset = () => {
    onChange({
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
      page: 1
    });
  };

  const availableModels =
    filters.make && filters.make !== 'All' && modelsByMake[filters.make]
      ? modelsByMake[filters.make]
      : [];

  return (
    <div className="bg-white border border-kandela-border rounded-xl p-5 space-y-6 text-sm shadow-sm">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-kandela-border">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-kandela-red" />
          <h3 className="text-kandela-ink font-bold uppercase tracking-wider text-sm font-sans">
            FILTER VEHICLES
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleReset}
            className="text-xs text-kandela-muted hover:text-kandela-red transition-colors flex items-center space-x-1"
            title="Reset Filters"
            id="reset-filters-btn"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden text-kandela-muted hover:text-kandela-ink p-1"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Make */}
      <div>
        <label className="block text-xs font-bold uppercase text-kandela-muted mb-1.5">
          Make / Brand
        </label>
        <select
          value={filters.make || 'All'}
          onChange={e => handleChange('make', e.target.value)}
          className="w-full bg-white border border-kandela-border text-kandela-ink rounded-md px-3 py-2 text-sm focus:outline-none focus:border-kandela-red"
          id="filter-make-select"
        >
          <option value="All">All Makes</option>
          {makes.map(m => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      {/* Model */}
      <div>
        <label className="block text-xs font-bold uppercase text-kandela-muted mb-1.5">
          Model
        </label>
        <select
          value={filters.model || 'All'}
          onChange={e => handleChange('model', e.target.value)}
          disabled={!filters.make || filters.make === 'All' || availableModels.length === 0}
          className="w-full bg-white border border-kandela-border text-kandela-ink rounded-md px-3 py-2 text-sm focus:outline-none focus:border-kandela-red disabled:opacity-40"
          id="filter-model-select"
        >
          <option value="All">All Models</option>
          {availableModels.map(m => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range (ETB) */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase text-kandela-muted">
          Max Price (ETB)
        </label>
        <select
          value={filters.priceMax || ''}
          onChange={e => handleChange('priceMax', e.target.value ? Number(e.target.value) : undefined)}
          className="w-full bg-white border border-kandela-border text-kandela-ink rounded-md px-3 py-2 text-sm focus:outline-none focus:border-kandela-red"
          id="filter-pricemax-select"
        >
          <option value="">Any Price</option>
          <option value="10000000">10,000,000 ETB</option>
          <option value="15000000">15,000,000 ETB</option>
          <option value="25000000">25,000,000 ETB</option>
          <option value="35000000">35,000,000 ETB</option>
          <option value="50000000">50,000,000 ETB</option>
        </select>
      </div>

      {/* Fuel Type */}
      <div>
        <label className="block text-xs font-bold uppercase text-kandela-muted mb-1.5">
          Fuel Type
        </label>
        <select
          value={filters.fuelType || 'All'}
          onChange={e => handleChange('fuelType', e.target.value)}
          className="w-full bg-white border border-kandela-border text-kandela-ink rounded-md px-3 py-2 text-sm focus:outline-none focus:border-kandela-red"
          id="filter-fuel-select"
        >
          <option value="All">All Fuels</option>
          <option value="Petrol">Petrol</option>
          <option value="Electric">Electric</option>
          <option value="Hybrid">Hybrid</option>
          <option value="Diesel">Diesel</option>
        </select>
      </div>

      {/* Transmission */}
      <div>
        <label className="block text-xs font-bold uppercase text-kandela-muted mb-1.5">
          Transmission
        </label>
        <select
          value={filters.transmission || 'All'}
          onChange={e => handleChange('transmission', e.target.value)}
          className="w-full bg-white border border-kandela-border text-kandela-ink rounded-md px-3 py-2 text-sm focus:outline-none focus:border-kandela-red"
          id="filter-transmission-select"
        >
          <option value="All">All Transmissions</option>
          <option value="Automatic">Automatic</option>
          <option value="Manual">Manual</option>
          <option value="Tiptronic">Tiptronic</option>
        </select>
      </div>

      {/* Body Type */}
      <div>
        <label className="block text-xs font-bold uppercase text-kandela-muted mb-1.5">
          Body Style
        </label>
        <select
          value={filters.bodyType || 'All'}
          onChange={e => handleChange('bodyType', e.target.value)}
          className="w-full bg-white border border-kandela-border text-kandela-ink rounded-md px-3 py-2 text-sm focus:outline-none focus:border-kandela-red"
          id="filter-bodytype-select"
        >
          <option value="All">All Body Types</option>
          <option value="SUV">SUV</option>
          <option value="Sedan">Sedan</option>
          <option value="Crossover">Crossover</option>
          <option value="Pickup">Pickup</option>
          <option value="Hatchback">Hatchback</option>
        </select>
      </div>

      {/* Condition */}
      <div>
        <label className="block text-xs font-bold uppercase text-kandela-muted mb-1.5">
          Condition
        </label>
        <select
          value={filters.condition || 'All'}
          onChange={e => handleChange('condition', e.target.value)}
          className="w-full bg-white border border-kandela-border text-kandela-ink rounded-md px-3 py-2 text-sm focus:outline-none focus:border-kandela-red"
          id="filter-condition-select"
        >
          <option value="All">All Conditions</option>
          <option value="New">New Cars</option>
          <option value="Used">Used Cars</option>
          <option value="Brand New">Brand New Only</option>
          <option value="Slightly Used">Slightly Used</option>
          <option value="Ethiopian Used">Ethiopian Used</option>
          <option value="Imported / Unregistered">Imported / Unregistered</option>
        </select>
      </div>

      {/* Availability Status */}
      <div>
        <label className="block text-xs font-bold uppercase text-kandela-muted mb-1.5">
          Status
        </label>
        <select
          value={filters.status || 'All'}
          onChange={e => handleChange('status', e.target.value)}
          className="w-full bg-white border border-kandela-border text-kandela-ink rounded-md px-3 py-2 text-sm focus:outline-none focus:border-kandela-red"
          id="filter-status-select"
        >
          <option value="All">All Vehicles</option>
          <option value="Available">Available</option>
          <option value="Reserved">Reserved</option>
          <option value="Sold">Sold</option>
        </select>
      </div>

      {/* Featured / Bank Loan Checkboxes */}
      <div className="pt-2 border-t border-kandela-border space-y-2.5">
        <label className="flex items-center space-x-2 text-xs font-medium text-kandela-ink cursor-pointer">
          <input
            type="checkbox"
            checked={Boolean(filters.featured)}
            onChange={e => handleChange('featured', e.target.checked)}
            className="rounded bg-white border-kandela-border text-kandela-red focus:ring-kandela-red"
            id="filter-featured-checkbox"
          />
          <span>Featured Listings Only</span>
        </label>

        <label className="flex items-center space-x-2 text-xs font-medium text-kandela-ink cursor-pointer">
          <input
            type="checkbox"
            checked={Boolean(filters.bankLoan)}
            onChange={e => handleChange('bankLoan', e.target.checked)}
            className="rounded bg-white border-kandela-border text-kandela-red focus:ring-kandela-red"
            id="filter-bankloan-checkbox"
          />
          <span>Bank Loan Available</span>
        </label>
      </div>

    </div>
  );
};
