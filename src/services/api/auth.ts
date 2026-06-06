import { apiRequest, tokenStorage } from '@/lib/api-client';

export interface AdminLoginPayload {
  email: string;
  password: string;
}

/** Mirrors `AdminRegisterDto` on the backend. */
export interface AdminRegisterPayload {
  // Admin account
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  // Business
  businessName: string;
  businessType?: string;
  businessDescription?: string;
  country?: string;
  currency?: string;
  // First store
  storeName: string;
  storeAddress: string;
  storeCity?: string;
  storeState?: string;
  storePhone?: string;
  storeEmail?: string;
}

export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  role: string;
  avatarUrl?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  admin: AdminUser;
}

export const authService = {
  async login(payload: AdminLoginPayload): Promise<LoginResponse> {
    const result = await apiRequest<LoginResponse>('/auth/admin/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    tokenStorage.setToken(result.accessToken);
    tokenStorage.setRefreshToken(result.refreshToken);
    return result;
  },

  /** Self-signup: creates business + admin + first store, then auto-logs in. */
  async register(payload: AdminRegisterPayload): Promise<LoginResponse> {
    const result = await apiRequest<LoginResponse>('/auth/admin/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    tokenStorage.setToken(result.accessToken);
    tokenStorage.setRefreshToken(result.refreshToken);
    return result;
  },

  async logout(): Promise<void> {
    await apiRequest('/auth/admin/logout', { method: 'POST' }).catch(() => {});
    tokenStorage.clear();
  },

  me(): Promise<AdminUser> {
    return apiRequest<AdminUser>('/auth/admin/me');
  },

  isAuthenticated(): boolean {
    return !!tokenStorage.getToken();
  },
};
