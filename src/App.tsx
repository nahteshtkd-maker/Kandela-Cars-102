import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { SearchModal } from './components/common/SearchModal';
import { CustomerAuthProvider } from './context/CustomerAuthContext';
import { LoginModal } from './components/auth/LoginModal';

import { HomePage } from './pages/HomePage';
import { InventoryPage } from './pages/InventoryPage';
import { VehicleDetailPage } from './pages/VehicleDetailPage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { ContactPage } from './pages/ContactPage';
import { AccountPage } from './pages/AccountPage';

// Admin lives in a separate bundle now (admin.html / AdminApp.tsx) — this
// public app has no knowledge of admin routes, components, or API calls, so
// none of that code ships to regular site visitors.

export function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  const [routeParams, setRouteParams] = useState<any>({});
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPath]);

  const navigate = (path: string, params?: any) => {
    if (params) setRouteParams(params);
    else setRouteParams({});

    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  const handleSelectVehicle = (id: string) => {
    navigate(`/cars/${id}`);
  };

  // Parse path for vehicle details e.g. /cars/car-101
  const isVehicleDetailRoute = currentPath.startsWith('/cars/') && currentPath !== '/cars';
  const vehicleDetailId = isVehicleDetailRoute ? currentPath.split('/cars/')[1] : null;

  return (
    <CustomerAuthProvider>
      <div className="min-h-screen bg-neutral-950 text-white font-sans flex flex-col selection:bg-red-600 selection:text-white">

        <Navbar
          currentPath={currentPath}
          onNavigate={navigate}
          onOpenSearch={() => setSearchModalOpen(true)}
        />

        <main className="flex-1">
          {currentPath === '/' && (
            <HomePage onNavigate={navigate} onSelectVehicle={handleSelectVehicle} />
          )}

          {currentPath === '/cars' && (
            <InventoryPage
              initialFilters={routeParams}
              onSelectVehicle={handleSelectVehicle}
            />
          )}

          {isVehicleDetailRoute && vehicleDetailId && (
            <VehicleDetailPage
              vehicleId={vehicleDetailId}
              onNavigate={navigate}
              onSelectVehicle={handleSelectVehicle}
            />
          )}

          {currentPath === '/about' && (
            <AboutPage onNavigate={navigate} />
          )}

          {currentPath === '/services' && (
            <ServicesPage onNavigate={navigate} />
          )}

          {currentPath === '/contact' && (
            <ContactPage />
          )}

          {currentPath === '/account' && (
            <AccountPage onSelectVehicle={handleSelectVehicle} onNavigate={navigate} />
          )}
        </main>

        <Footer onNavigate={navigate} />

        <SearchModal
          isOpen={searchModalOpen}
          onClose={() => setSearchModalOpen(false)}
          onSelectVehicle={handleSelectVehicle}
          onNavigateToCars={q => navigate('/cars', { search: q })}
        />

        <LoginModal />

      </div>
    </CustomerAuthProvider>
  );
}

export default App;
