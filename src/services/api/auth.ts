import { apiRequest, tokenStorage } from '@/lib/api-client';

export interface AdminLoginPayload {
  email: string;
  password: string;
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

  async logout(): Promise<void> {
    await apiRequest('/auth/admin/logout', { method: 'POST' }).catch(() => {});
    tokenStorage.clear();
  },

  isAuthenticated(): boolean {
    return !!tokenStorage.getToken();
  },
};
