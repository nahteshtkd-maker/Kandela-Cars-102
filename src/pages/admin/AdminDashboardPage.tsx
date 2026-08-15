import React, { useState, useEffect } from 'react';
import { Loader2, ShieldCheck, Key, RefreshCw } from 'lucide-react';
import { Vehicle, InquiryMessage, DashboardStats, AdminUser, VehicleStatus, FinanceInquiry, CommissionRecord, CommissionSummary } from '../../types';
import { api } from '../../services/api';

import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { DashboardOverview } from '../../components/admin/DashboardOverview';
import { VehicleTable } from '../../components/admin/VehicleTable';
import { VehicleForm } from '../../components/admin/VehicleForm';
import { MessagesInbox } from '../../components/admin/MessagesInbox';
import { FinanceInquiriesInbox } from '../../components/admin/FinanceInquiriesInbox';
import { CommissionGoalsPanel } from '../../components/admin/CommissionGoalsPanel';

interface AdminDashboardPageProps {
  onLogout: () => void;
  onNavigatePublic: (path: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  onLogout,
  onNavigatePublic
}) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [currentTab, setCurrentTab] = useState<string>('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [stats, setStats] = useState<DashboardStats>({
    totalVehicles: 0,
    availableVehicles: 0,
    soldVehicles: 0,
    featuredVehicles: 0,
    draftVehicles: 0,
    newMessages: 0,
    totalInquiries: 0
  });

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [messages, setMessages] = useState<InquiryMessage[]>([]);
  const [financeInquiries, setFinanceInquiries] = useState<FinanceInquiry[]>([]);
  const [commissions, setCommissions] = useState<CommissionRecord[]>([]);
  const [commissionSummary, setCommissionSummary] = useState<CommissionSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadAllData = async () => {
    try {
      setLoading(true);
      const currentUser = await api.getMe();
      setUser(currentUser);

      const [dashStats, vRes, mRes, fRes] = await Promise.all([
        api.getDashboardStats(),
        api.getAdminVehicles({ limit: 100 }),
        api.getInquiries(),
        api.getFinanceInquiries()
      ]);

      setStats(dashStats);
      setVehicles(vRes.vehicles);
      setMessages(mRes);
      setFinanceInquiries(fRes);

      // Commission data is restricted to super_admin/admin on the backend;
      // fetch separately so an editor/viewer account doesn't break the rest
      // of the dashboard load on a 403.
      const canViewCommissions = currentUser?.role === 'super_admin' || currentUser?.role === 'admin';
      if (canViewCommissions) {
        try {
          const [commRecords, commSummary] = await Promise.all([
            api.getCommissions(),
            api.getCommissionSummary()
          ]);
          setCommissions(commRecords);
          setCommissionSummary(commSummary);
        } catch (err) {
          console.error('Failed to load commission data', err);
        }
      }
    } catch (err: any) {
      console.error('Failed to load admin dashboard data', err);
      // If token invalid, trigger logout
      if (err.message && err.message.toLowerCase().includes('token')) {
        api.logout();
        onLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleCreateVehicle = async (data: Partial<Vehicle>) => {
    await api.createVehicle(data);
    showToast('Vehicle listing created successfully!');
    setEditingVehicle(null);
    setCurrentTab('vehicles');
    loadAllData();
  };

  const handleUpdateVehicle = async (data: Partial<Vehicle>) => {
    if (!editingVehicle) return;
    await api.updateVehicle(editingVehicle.id, data);
    showToast('Vehicle details updated!');
    setEditingVehicle(null);
    setCurrentTab('vehicles');
    loadAllData();
  };

  const handleDeleteVehicle = async (id: string) => {
    await api.deleteVehicle(id);
    showToast('Vehicle removed from inventory.');
    loadAllData();
  };

  const handleStatusChange = async (id: string, newStatus: VehicleStatus) => {
    await api.updateVehicle(id, { status: newStatus });
    showToast(`Vehicle status changed to ${newStatus}`);
    loadAllData();
  };

  const handleFeaturedToggle = async (id: string, featured: boolean) => {
    await api.updateVehicle(id, { featured });
    showToast(featured ? 'Vehicle added to featured' : 'Vehicle removed from featured');
    loadAllData();
  };

  const handleMessageStatusChange = async (id: string, newStatus: 'New' | 'Contacted' | 'Closed') => {
    await api.updateInquiryStatus(id, newStatus);
    showToast(`Inquiry marked as ${newStatus}`);
    loadAllData();
  };

  const handleDeleteMessage = async (id: string) => {
    await api.deleteInquiry(id);
    showToast('Inquiry deleted.');
    loadAllData();
  };

  const handleFinanceInquiryStatusChange = async (id: string, newStatus: FinanceInquiry['status']) => {
    await api.updateFinanceInquiryStatus(id, newStatus);
    showToast(`Financing inquiry marked as ${newStatus}`);
    loadAllData();
  };

  const handleSaveCommissionGoals = async (goals: { weekly: number; monthly: number; annual: number }) => {
    await api.updateCommissionGoals(goals);
    showToast('Sales goals updated');
    loadAllData();
  };

  const handleUpdateCommission = async (id: string, updates: { commissionAmount?: number; notes?: string }) => {
    await api.updateCommission(id, updates);
    showToast('Commission updated');
    loadAllData();
  };

  const startEditingVehicle = (v: Vehicle) => {
    setEditingVehicle(v);
    setCurrentTab('edit-vehicle');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-neutral-400 space-y-3">
        <Loader2 className="w-10 h-10 animate-spin text-red-600" />
        <p className="text-sm font-bold uppercase tracking-wider text-white">AUTHENTICATING ADMIN PANEL...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex" id="admin-dashboard-container">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-red-600 text-white px-5 py-3 rounded-xl shadow-2xl font-bold text-xs uppercase tracking-wider animate-fadeIn flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sidebar */}
      <AdminSidebar
        currentTab={currentTab}
        onSelectTab={tab => {
          if (tab === 'add-vehicle') {
            setEditingVehicle(null);
          }
          setCurrentTab(tab);
        }}
        onNavigatePublic={onNavigatePublic}
        onLogout={() => {
          api.logout();
          onLogout();
        }}
        unreadCount={stats.newMessages}
        financeInquiryCount={financeInquiries.filter(f => f.status === 'New').length}
        canViewCommissions={user?.role === 'super_admin' || user?.role === 'admin'}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        <AdminHeader
          user={user}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          onQuickAdd={() => {
            setEditingVehicle(null);
            setCurrentTab('add-vehicle');
          }}
          onNavigatePublic={onNavigatePublic}
        />

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-8">
          
          {currentTab === 'overview' && (
            <DashboardOverview
              stats={stats}
              recentVehicles={vehicles}
              recentMessages={messages}
              onSelectTab={tab => {
                if (tab === 'add-vehicle') setEditingVehicle(null);
                setCurrentTab(tab);
              }}
              onEditVehicle={startEditingVehicle}
            />
          )}

          {currentTab === 'vehicles' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                <h1 className="text-3xl font-black text-white uppercase font-sans">
                  INVENTORY MANAGEMENT
                </h1>
                <button
                  onClick={() => {
                    setEditingVehicle(null);
                    setCurrentTab('add-vehicle');
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase px-4 py-2.5 rounded-lg shadow-md"
                >
                  + Add New Car
                </button>
              </div>

              <VehicleTable
                vehicles={vehicles}
                onEdit={startEditingVehicle}
                onDelete={handleDeleteVehicle}
                onStatusChange={handleStatusChange}
                onFeaturedToggle={handleFeaturedToggle}
                onViewPublic={id => onNavigatePublic(`/cars/${id}`)}
              />
            </div>
          )}

          {currentTab === 'add-vehicle' && (
            <VehicleForm
              initialVehicle={null}
              onSave={handleCreateVehicle}
              onCancel={() => setCurrentTab('vehicles')}
            />
          )}

          {currentTab === 'edit-vehicle' && (
            <VehicleForm
              initialVehicle={editingVehicle}
              onSave={handleUpdateVehicle}
              onCancel={() => {
                setEditingVehicle(null);
                setCurrentTab('vehicles');
              }}
            />
          )}

          {currentTab === 'messages' && (
            <MessagesInbox
              messages={messages}
              onStatusChange={handleMessageStatusChange}
              onDelete={handleDeleteMessage}
              onViewVehicle={vId => onNavigatePublic(`/cars/${vId}`)}
            />
          )}

          {currentTab === 'finance-inquiries' && (
            <FinanceInquiriesInbox
              inquiries={financeInquiries}
              onStatusChange={handleFinanceInquiryStatusChange}
            />
          )}

          {currentTab === 'commission-goals' && commissionSummary && (
            <CommissionGoalsPanel
              summary={commissionSummary}
              records={commissions}
              onSaveGoals={handleSaveCommissionGoals}
              onUpdateCommission={handleUpdateCommission}
            />
          )}

          {currentTab === 'settings' && (
            <div className="space-y-6 max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8">
              <h2 className="text-2xl font-black uppercase text-white font-sans border-b border-neutral-800 pb-4">
                ADMIN SETTINGS & CONTROL
              </h2>

              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-neutral-500 font-bold uppercase block">Authenticated Admin:</span>
                  <span className="text-white text-sm font-bold">{user?.name} ({user?.email})</span>
                </div>

                <div>
                  <span className="text-neutral-500 font-bold uppercase block">Role & Permissions:</span>
                  <span className="text-red-400 font-bold">Super Admin • Inventory Manager</span>
                </div>

                <div className="pt-4 border-t border-neutral-800 flex items-center space-x-3">
                  <button
                    onClick={loadAllData}
                    className="bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold uppercase px-4 py-2.5 rounded-lg border border-neutral-700 flex items-center space-x-1.5"
                  >
                    <RefreshCw className="w-4 h-4 text-red-500" />
                    <span>Refresh Database Cache</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

    </div>
  );
};
