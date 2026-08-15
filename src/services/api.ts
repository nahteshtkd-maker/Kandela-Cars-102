import { Vehicle, InquiryMessage, DashboardStats, SearchFilters, AdminUser, FinanceInquiry, CommissionRecord, CommissionGoals, CommissionSummary } from '../types';

const CSRF_COOKIE = 'kandela_csrf';

function readCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

// Session lives in an HttpOnly cookie set by the server — JS never sees or
// stores the admin token itself. Mutating requests attach the CSRF token
// (a separate, JS-readable cookie) as a header, per the double-submit pattern.
async function adminFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const method = (options.method || 'GET').toUpperCase();
  const headers = new Headers(options.headers || {});
  const isMutation = !['GET', 'HEAD', 'OPTIONS'].includes(method);

  if (isMutation) {
    const csrf = readCookie(CSRF_COOKIE);
    if (csrf) headers.set('x-csrf-token', csrf);
  }

  return fetch(url, { ...options, headers, credentials: 'include' });
}

export const api = {
  // Session state is server-side now; callers should rely on getMe()/checkAdminSession()
  // rather than a synchronous localStorage check.
  isAuthenticated(): boolean {
    return Boolean(readCookie(CSRF_COOKIE));
  },

  async logout(): Promise<void> {
    await adminFetch('/api/admin/logout', { method: 'POST' });
  },

  // Public Vehicle Endpoints
  async getVehicles(filters: SearchFilters = {}): Promise<{ vehicles: Vehicle[]; total: number }> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });

    const res = await fetch(`/api/vehicles?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to load vehicles');
    return res.json();
  },

  async getMakesAndModels(): Promise<{ makes: string[]; modelsByMake: Record<string, string[]> }> {
    const res = await fetch('/api/vehicles/makes-models');
    if (!res.ok) throw new Error('Failed to load vehicle makes');
    return res.json();
  },

  async getVehicleById(id: string): Promise<Vehicle> {
    const res = await fetch(`/api/vehicles/${id}`);
    if (!res.ok) throw new Error('Vehicle not found');
    return res.json();
  },

  async submitInquiry(data: {
    name: string;
    phone: string;
    email: string;
    message: string;
    vehicleId?: string;
    vehicleTitle?: string;
  }): Promise<{ success: boolean; message: InquiryMessage }> {
    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to submit inquiry');
    return result;
  },

  async submitFinanceInquiry(data: {
    vehicleId: string;
    vehicleName: string;
    vehiclePrice: number;
    name: string;
    phone: string;
    email?: string;
    downPayment?: number;
    loanTermMonths?: number;
    financingType?: string;
    message?: string;
  }): Promise<{ success: boolean }> {
    const res = await fetch('/api/finance-inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to submit financing inquiry');
    return result;
  },

  // Admin Auth
  async login(email: string, password: string): Promise<{ user: AdminUser }> {
    return this.loginAdmin(email, password);
  },

  async loginAdmin(email: string, password: string): Promise<{ user: AdminUser }> {
    const res = await adminFetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Authentication failed');
    return result;
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const res = await adminFetch('/api/admin/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to change password');
  },

  async getMe(): Promise<AdminUser | null> {
    return this.checkAdminSession();
  },

  async checkAdminSession(): Promise<AdminUser | null> {
    try {
      const res = await adminFetch('/api/admin/me');
      if (!res.ok) return null;
      const data = await res.json();
      return data.user;
    } catch {
      return null;
    }
  },

  // Protected Admin Vehicle Endpoints
  async getDashboardStats(): Promise<DashboardStats> {
    return this.getAdminStats();
  },

  async getAdminStats(): Promise<DashboardStats> {
    const res = await adminFetch('/api/admin/stats');
    if (!res.ok) throw new Error('Failed to fetch dashboard statistics');
    return res.json();
  },

  async getAdminVehicles(filters: SearchFilters = {}): Promise<{ vehicles: Vehicle[]; total: number }> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });
    const res = await adminFetch(`/api/admin/vehicles?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch vehicles');
    return res.json();
  },

  async getFinanceInquiries(): Promise<FinanceInquiry[]> {
    const res = await adminFetch('/api/admin/finance-inquiries');
    if (!res.ok) throw new Error('Failed to fetch financing inquiries');
    return res.json();
  },

  async updateFinanceInquiryStatus(id: string, status: FinanceInquiry['status']): Promise<FinanceInquiry> {
    const res = await adminFetch(`/api/admin/finance-inquiries/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update financing inquiry');
    return data.inquiry;
  },

  async getCommissions(): Promise<CommissionRecord[]> {
    const res = await adminFetch('/api/admin/commissions');
    if (!res.ok) throw new Error('Failed to fetch commission records');
    return res.json();
  },

  async updateCommission(
    id: string,
    updates: { commissionAmount?: number; commissionRate?: number; notes?: string }
  ): Promise<CommissionRecord> {
    const res = await adminFetch(`/api/admin/commissions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update commission');
    return data.commission;
  },

  async getCommissionGoals(): Promise<CommissionGoals> {
    const res = await adminFetch('/api/admin/commission-goals');
    if (!res.ok) throw new Error('Failed to fetch commission goals');
    return res.json();
  },

  async updateCommissionGoals(goals: { weekly: number; monthly: number; annual: number }): Promise<CommissionGoals> {
    const res = await adminFetch('/api/admin/commission-goals', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(goals)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update commission goals');
    return data.goals;
  },

  async getCommissionSummary(): Promise<CommissionSummary> {
    const res = await adminFetch('/api/admin/commission-summary');
    if (!res.ok) throw new Error('Failed to fetch commission summary');
    return res.json();
  },

  async uploadImages(files: File[]): Promise<string[]> {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));

    const res = await adminFetch('/api/upload', {
      method: 'POST',
      body: formData
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to upload images');
    return data.imagePaths;
  },

  async createVehicle(vehicleData: Partial<Vehicle>): Promise<Vehicle> {
    const res = await adminFetch('/api/vehicles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vehicleData)
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to add vehicle');
    return data.vehicle;
  },

  async updateVehicle(id: string, vehicleData: Partial<Vehicle>): Promise<Vehicle> {
    const res = await adminFetch(`/api/vehicles/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vehicleData)
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update vehicle');
    return data.vehicle;
  },

  async deleteVehicle(id: string): Promise<boolean> {
    const res = await adminFetch(`/api/vehicles/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete vehicle');
    return data.success;
  },

  // Admin Messages
  async getInquiries(): Promise<InquiryMessage[]> {
    return this.getAdminMessages();
  },

  async getAdminMessages(): Promise<InquiryMessage[]> {
    const res = await adminFetch('/api/messages');
    if (!res.ok) throw new Error('Failed to fetch messages');
    return res.json();
  },

  async updateInquiryStatus(id: string, status: InquiryMessage['status']): Promise<InquiryMessage> {
    return this.updateMessageStatus(id, status);
  },

  async updateMessageStatus(id: string, status: InquiryMessage['status']): Promise<InquiryMessage> {
    const res = await adminFetch(`/api/messages/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update message status');
    return data.message;
  },

  async deleteInquiry(id: string): Promise<boolean> {
    return this.deleteMessage(id);
  },

  async deleteMessage(id: string): Promise<boolean> {
    const res = await adminFetch(`/api/messages/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete message');
    return data.success;
  }
};
