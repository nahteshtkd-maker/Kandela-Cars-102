import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { api } from './services/api';

// This is a separate Vite entry (admin.html) from the public site (index.html),
// so none of this code — or the admin API surface it talks to — ships inside
// the public bundle that regular site visitors download.
export function AdminApp() {
  const [checkingSession, setCheckingSession] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    api.checkAdminSession().then(user => {
      if (!cancelled) {
        setIsAuthenticated(Boolean(user));
        setCheckingSession(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const goPublic = (path: string) => {
    window.location.href = path;
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-red-500" />
      </div>
    );
  }

  return isAuthenticated ? (
    <AdminDashboardPage
      onLogout={() => setIsAuthenticated(false)}
      onNavigatePublic={goPublic}
    />
  ) : (
    <AdminLoginPage
      onLoginSuccess={() => setIsAuthenticated(true)}
      onNavigatePublic={goPublic}
    />
  );
}

export default AdminApp;
