import React from 'react';
import { Hero } from '../components/home/Hero';
import { QuickSearch } from '../components/home/QuickSearch';
import { FeaturedVehicles } from '../components/home/FeaturedVehicles';
import { WhyChooseUs } from '../components/home/WhyChooseUs';
import { ContactCTASection } from '../components/home/ContactCTASection';
import { SearchFilters } from '../types';

interface HomePageProps {
  onNavigate: (path: string, params?: SearchFilters) => void;
  onSelectVehicle: (id: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onSelectVehicle }) => {
  const handleQuickSearch = (filters: SearchFilters) => {
    onNavigate('/cars', filters);
  };

  return (
    <div className="min-h-screen bg-white text-kandela-ink" id="home-page-container">
      <Hero onNavigate={onNavigate} />
      <QuickSearch onSearch={handleQuickSearch} />
      <FeaturedVehicles onSelectVehicle={onSelectVehicle} onNavigate={onNavigate} />
      <WhyChooseUs />
      <ContactCTASection onNavigate={onNavigate} />
    </div>
  );
};
