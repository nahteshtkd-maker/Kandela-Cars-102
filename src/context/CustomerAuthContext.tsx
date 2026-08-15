import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Customer } from '../types';
import { customerApi } from '../services/customerApi';

interface CustomerAuthContextValue {
  user: Customer | null;
  loading: boolean;
  favoriteIds: Set<string>;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
  toggleFavorite: (vehicleId: string) => Promise<void>;
  onAuthSuccess: (user: Customer) => void;
}

const CustomerAuthContext = createContext<CustomerAuthContextValue | null>(null);

export const CustomerAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);

  const loadFavorites = useCallback(async () => {
    try {
      const vehicles = await customerApi.getFavorites();
      setFavoriteIds(new Set(vehicles.map(v => v.id)));
    } catch {
      setFavoriteIds(new Set());
    }
  }, []);

  const refreshUser = useCallback(async () => {
    const me = await customerApi.getMe();
    setUser(me);
    if (me) await loadFavorites();
    else setFavoriteIds(new Set());
  }, [loadFavorites]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await refreshUser();
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onAuthSuccess = (newUser: Customer) => {
    setUser(newUser);
    setLoginModalOpen(false);
    loadFavorites();
  };

  const logout = async () => {
    await customerApi.logout();
    setUser(null);
    setFavoriteIds(new Set());
  };

  const toggleFavorite = async (vehicleId: string) => {
    if (!user) {
      setLoginModalOpen(true);
      return;
    }
    const isFav = favoriteIds.has(vehicleId);
    // Optimistic update — feels instant, reconciled if the request fails.
    setFavoriteIds(prev => {
      const next = new Set(prev);
      if (isFav) next.delete(vehicleId);
      else next.add(vehicleId);
      return next;
    });
    try {
      if (isFav) await customerApi.removeFavorite(vehicleId);
      else await customerApi.addFavorite(vehicleId);
    } catch {
      // Revert on failure
      setFavoriteIds(prev => {
        const next = new Set(prev);
        if (isFav) next.add(vehicleId);
        else next.delete(vehicleId);
        return next;
      });
    }
  };

  return (
    <CustomerAuthContext.Provider
      value={{
        user,
        loading,
        favoriteIds,
        isLoginModalOpen,
        openLoginModal: () => setLoginModalOpen(true),
        closeLoginModal: () => setLoginModalOpen(false),
        refreshUser,
        logout,
        toggleFavorite,
        onAuthSuccess
      }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
};

export function useCustomerAuth(): CustomerAuthContextValue {
  const ctx = useContext(CustomerAuthContext);
  if (!ctx) throw new Error('useCustomerAuth must be used within CustomerAuthProvider');
  return ctx;
}
