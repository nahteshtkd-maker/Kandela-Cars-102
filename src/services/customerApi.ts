import { Customer, Vehicle, InquiryMessage } from '../types';

const CSRF_COOKIE = 'kandela_csrf';

function readCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

async function customerFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const method = (options.method || 'GET').toUpperCase();
  const headers = new Headers(options.headers || {});
  const isMutation = !['GET', 'HEAD', 'OPTIONS'].includes(method);
  if (isMutation) {
    const csrf = readCookie(CSRF_COOKIE);
    if (csrf) headers.set('x-csrf-token', csrf);
  }
  return fetch(url, { ...options, headers, credentials: 'include' });
}

async function parseOrThrow(res: Response) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const customerApi = {
  async getMe(): Promise<Customer | null> {
    try {
      const res = await customerFetch('/api/auth/me');
      if (!res.ok) return null;
      const data = await res.json();
      return data.user;
    } catch {
      return null;
    }
  },

  async signup(name: string, email: string, password: string): Promise<Customer> {
    const res = await customerFetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await parseOrThrow(res);
    return data.user;
  },

  async login(email: string, password: string): Promise<Customer> {
    const res = await customerFetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await parseOrThrow(res);
    return data.user;
  },

  async loginWithGoogle(idToken: string): Promise<Customer> {
    const res = await customerFetch('/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken })
    });
    const data = await parseOrThrow(res);
    return data.user;
  },

  async requestOtp(phone: string): Promise<void> {
    const res = await customerFetch('/api/auth/otp/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone })
    });
    await parseOrThrow(res);
  },

  async verifyOtp(phone: string, code: string, name?: string): Promise<Customer> {
    const res = await customerFetch('/api/auth/otp/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, code, name })
    });
    const data = await parseOrThrow(res);
    return data.user;
  },

  async logout(): Promise<void> {
    await customerFetch('/api/auth/logout', { method: 'POST' });
  },

  async getFavorites(): Promise<Vehicle[]> {
    const res = await customerFetch('/api/me/favorites');
    const data = await parseOrThrow(res);
    return data.vehicles;
  },

  async addFavorite(vehicleId: string): Promise<void> {
    const res = await customerFetch(`/api/me/favorites/${vehicleId}`, { method: 'POST' });
    await parseOrThrow(res);
  },

  async removeFavorite(vehicleId: string): Promise<void> {
    const res = await customerFetch(`/api/me/favorites/${vehicleId}`, { method: 'DELETE' });
    await parseOrThrow(res);
  },

  async getMyInquiries(): Promise<InquiryMessage[]> {
    const res = await customerFetch('/api/me/inquiries');
    const data = await parseOrThrow(res);
    return data.messages;
  }
};
