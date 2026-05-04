import { apiRequest } from '@/lib/api-client';

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface Setup2FAResponse {
  secret: string;
  otpauthUrl: string;
  qrCode: string;
}

export const securityApi = {
  changePassword(data: ChangePasswordPayload) {
    return apiRequest<void>('/auth/admin/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  setup2FA() {
    return apiRequest<Setup2FAResponse>('/auth/admin/2fa/setup', { method: 'POST' });
  },
  enable2FA(code: string) {
    return apiRequest<{ backupCodes: string[] }>('/auth/admin/2fa/enable', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
  },
  disable2FA(password: string, code: string) {
    return apiRequest<void>('/auth/admin/2fa/disable', {
      method: 'POST',
      body: JSON.stringify({ password, code }),
    });
  },
};
