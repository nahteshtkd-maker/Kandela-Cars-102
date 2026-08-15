import React, { useState, useEffect } from 'react';
import { Search, Filter, RefreshCw } from 'lucide-react';
import { api } from '../../services/api';
import { SearchFilters } from '../../types';

interface QuickSearchProps {
  onSearch: (filters: SearchFilters) => void;
}

export const QuickSearch: React.FC<QuickSearchProps> = ({ onSearch }) => {
  const [makes, setMakes] = useState<string[]>([]);
  const [modelsByMake, setModelsByMake] = useState<Record<string, string[]>>({});
  
  const [make, setMake] = useState('All');
  const [model, setModel] = useState('All');
  const [condition, setCondition] = useState('All');
  const [yearMin, setYearMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [transmission, setTransmission] = useState('All');

  useEffect(() => {
    async function loadOptions() {
      try {
        const data = await api.getMakesAndModels();
        setMakes(data.makes);
        setModelsByMake(data.modelsByMake);
      } catch (err) {
        console.error('Failed to load makes/models', err);
      }
    }
    loadOptions();
  }, []);

  const handleMakeChange = (selectedMake: string) => {
    setMake(selectedMake);
    setModel('All');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const filters: SearchFilters = {};
    if (make !== 'All') filters.make = make;
    if (model !== 'All') filters.model = model;
    if (condition !== 'All') filters.condition = condition;
    if (yearMin) filters.yearMin = Number(yearMin);
    if (priceMax) filters.priceMax = Number(priceMax);
    if (transmission !== 'All') filters.transmission = transmission;

    onSearch(filters);
  };

  const availableModels = make !== 'All' && modelsByMake[make] ? modelsByMake[make] : [];

  return (
    <section className="relative z-30 px-4 sm:px-10 -mt-10 max-w-7xl mx-auto" id="quick-search-container">
      <div className="bg-white border border-kandela-border p-6 sm:p-8 shadow-xl rounded-xl">
        
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          
          {/* Make */}
          <div className="space-y-2">
            <label className="text-[10px] text-kandela-muted font-bold uppercase tracking-widest block">
              Make / Brand
            </label>
            <select
              value={make}
              onChange={e => handleMakeChange(e.target.value)}
              className="w-full bg-white border border-kandela-border text-xs py-3 px-4 outline-none text-kandela-ink font-semibold focus:border-kandela-red rounded-md transition-colors"
              id="search-make-select"
            >
              <option value="All">All Brands</option>
              {makes.map(m => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Model */}
          <div className="space-y-2">
            <label className="text-[10px] text-kandela-muted font-bold uppercase tracking-widest block">
              Model
            </label>
            <select
              value={model}
              onChange={e => setModel(e.target.value)}
              disabled={make === 'All' && availableModels.length === 0}
              className="w-full bg-white border border-kandela-border text-xs py-3 px-4 outline-none text-kandela-ink font-semibold focus:border-kandela-red rounded-md transition-colors disabled:opacity-40"
              id="search-model-select"
            >
              <option value="All">Any Model</option>
              {availableModels.map(m => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Condition: New / Used */}
          <div className="space-y-2">
            <label className="text-[10px] text-kandela-muted font-bold uppercase tracking-widest block">
              Condition
            </label>
            <select
              value={condition}
              onChange={e => setCondition(e.target.value)}
              className="w-full bg-white border border-kandela-border text-xs py-3 px-4 outline-none text-kandela-ink font-semibold focus:border-kandela-red rounded-md transition-colors"
              id="search-condition-select"
            >
              <option value="All">All Conditions</option>
              <option value="New">New Cars</option>
              <option value="Used">Used Cars</option>
            </select>
          </div>

          {/* Min Year */}
          <div className="space-y-2">
            <label className="text-[10px] text-kandela-muted font-bold uppercase tracking-widest block">
              Min Year
            </label>
            <select
              value={yearMin}
              onChange={e => setYearMin(e.target.value)}
              className="w-full bg-white border border-kandela-border text-xs py-3 px-4 outline-none text-kandela-ink font-semibold focus:border-kandela-red rounded-md transition-colors"
              id="search-year-select"
            >
              <option value="">Any Year</option>
              {[2025, 2024, 2023, 2022, 2021, 2020, 2018].map(y => (
                <option key={y} value={y}>
                  {y}+
                </option>
              ))}
            </select>
          </div>

          {/* Max Price */}
          <div className="space-y-2">
            <label className="text-[10px] text-kandela-muted font-bold uppercase tracking-widest block">
              Max Price (ETB)
            </label>
            <select
              value={priceMax}
              onChange={e => setPriceMax(e.target.value)}
              className="w-full bg-white border border-kandela-border text-xs py-3 px-4 outline-none text-kandela-ink font-semibold focus:border-kandela-red rounded-md transition-colors"
              id="search-price-select"
            >
              <option value="">Any Price</option>
              <option value="10000000">Up to 10M ETB</option>
              <option value="15000000">Up to 15M ETB</option>
              <option value="25000000">Up to 25M ETB</option>
              <option value="35000000">Up to 35M ETB</option>
              <option value="50000000">Up to 50M ETB</option>
            </select>
          </div>

          {/* Search Button */}
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-kandela-red h-[42px] font-bold text-xs tracking-wider uppercase hover:bg-kandela-red-hover transition-colors text-white flex items-center justify-center space-x-2 rounded-full"
              id="search-vehicles-submit-btn"
            >
              <Search className="w-4 h-4" />
              <span>Search Vehicles</span>
            </button>
          </div>

        </form>
      </div>
    </section>
  );
};
