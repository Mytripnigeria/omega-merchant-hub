import { apiRequest } from '@/lib/api-client';

export interface NotificationChannels {
  email: boolean;
  sms: boolean;
  push: boolean;
  doNotDisturb: boolean;
}

export interface NotificationEventToggles {
  newOrder: boolean;
  newCustomer: boolean;
  lowStock: boolean;
  dailyReport: boolean;
  paymentReceived: boolean;
  shiftReminder: boolean;
}

export interface NotificationPreferences {
  adminId: string;
  channels: NotificationChannels;
  events: NotificationEventToggles;
}

export const notificationsApi = {
  getPreferences() {
    return apiRequest<NotificationPreferences>('/notifications/preferences');
  },
  updatePreferences(data: {
    channels?: Partial<NotificationChannels>;
    events?: Partial<NotificationEventToggles>;
  }) {
    return apiRequest<NotificationPreferences>('/notifications/preferences', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
};
