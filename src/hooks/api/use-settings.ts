import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { businessApi, type Business, type BusinessSettings } from '@/services/api/business';
import { storesApi, type CreateStorePayload, type UpdateStorePayload } from '@/services/api/stores';
import { taxRatesApi, type CreateTaxRatePayload } from '@/services/api/tax-rates';
import { paymentMethodsApi, type CreatePaymentMethodPayload } from '@/services/api/payment-methods';
import { printersApi, type CreatePrinterPayload } from '@/services/api/printers';
import { webhooksApi, type CreateWebhookPayload } from '@/services/api/webhooks';
import { domainsApi } from '@/services/api/domains';
import { notificationsApi, type NotificationChannels, type NotificationEventToggles } from '@/services/api/notifications';
import { securityApi } from '@/services/api/security';

export const settingsKeys = {
  business: ['settings', 'business'] as const,
  businessSettings: ['settings', 'business-settings'] as const,
  stores: ['settings', 'stores'] as const,
  taxRates: ['settings', 'tax-rates'] as const,
  paymentMethods: ['settings', 'payment-methods'] as const,
  printers: (storeId?: string) => ['settings', 'printers', storeId ?? 'all'] as const,
  webhooks: ['settings', 'webhooks'] as const,
  domains: ['settings', 'domains'] as const,
  notifications: ['settings', 'notifications'] as const,
};

// ─── Business ──────────────────────────────────────────────────────────────
export function useBusiness() {
  return useQuery({ queryKey: settingsKeys.business, queryFn: () => businessApi.get() });
}

export function useUpdateBusiness() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Business> & { logoFileId?: string | null }) =>
      businessApi.update(data),
    onSuccess: (data) => {
      qc.setQueryData(settingsKeys.business, data);
    },
  });
}

export function useBusinessSettings() {
  return useQuery({
    queryKey: settingsKeys.businessSettings,
    queryFn: () => businessApi.getSettings(),
  });
}

export function useUpdateBusinessSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<BusinessSettings>) => businessApi.updateSettings(data),
    onSuccess: (data) => {
      qc.setQueryData(settingsKeys.businessSettings, data);
    },
  });
}

// ─── Stores ────────────────────────────────────────────────────────────────
export function useStores() {
  return useQuery({
    queryKey: settingsKeys.stores,
    queryFn: () => storesApi.list({ limit: 100 }),
  });
}

export function useCreateStore() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateStorePayload) => storesApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: settingsKeys.stores }),
  });
}

export function useUpdateStore() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStorePayload }) =>
      storesApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: settingsKeys.stores }),
  });
}

export function useDeleteStore() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => storesApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: settingsKeys.stores }),
  });
}

// ─── Tax rates ─────────────────────────────────────────────────────────────
export function useTaxRates() {
  return useQuery({ queryKey: settingsKeys.taxRates, queryFn: () => taxRatesApi.list() });
}

export function useCreateTaxRate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTaxRatePayload) => taxRatesApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: settingsKeys.taxRates }),
  });
}

export function useUpdateTaxRate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateTaxRatePayload> }) =>
      taxRatesApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: settingsKeys.taxRates }),
  });
}

export function useDeleteTaxRate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => taxRatesApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: settingsKeys.taxRates }),
  });
}

// ─── Payment methods ───────────────────────────────────────────────────────
export function usePaymentMethods() {
  return useQuery({
    queryKey: settingsKeys.paymentMethods,
    queryFn: () => paymentMethodsApi.list(),
  });
}

export function useCreatePaymentMethod() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePaymentMethodPayload) => paymentMethodsApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: settingsKeys.paymentMethods }),
  });
}

export function useUpdatePaymentMethod() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreatePaymentMethodPayload> }) =>
      paymentMethodsApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: settingsKeys.paymentMethods }),
  });
}

export function useDeletePaymentMethod() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => paymentMethodsApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: settingsKeys.paymentMethods }),
  });
}

// ─── Printers ──────────────────────────────────────────────────────────────
export function usePrinters(storeId?: string) {
  return useQuery({
    queryKey: settingsKeys.printers(storeId),
    queryFn: () => printersApi.list(storeId),
  });
}

export function useCreatePrinter() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePrinterPayload) => printersApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['settings', 'printers'] }),
  });
}

export function useUpdatePrinter() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Omit<CreatePrinterPayload, 'storeId'>>;
    }) => printersApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['settings', 'printers'] }),
  });
}

export function useDeletePrinter() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => printersApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['settings', 'printers'] }),
  });
}

// ─── Webhooks ──────────────────────────────────────────────────────────────
export function useWebhooks() {
  return useQuery({ queryKey: settingsKeys.webhooks, queryFn: () => webhooksApi.list() });
}

export function useCreateWebhook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateWebhookPayload) => webhooksApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: settingsKeys.webhooks }),
  });
}

export function useUpdateWebhook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateWebhookPayload> }) =>
      webhooksApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: settingsKeys.webhooks }),
  });
}

export function useDeleteWebhook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => webhooksApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: settingsKeys.webhooks }),
  });
}

export function useRotateWebhookSecret() {
  return useMutation({ mutationFn: (id: string) => webhooksApi.rotateSecret(id) });
}

export function useTestWebhook() {
  return useMutation({ mutationFn: (id: string) => webhooksApi.test(id) });
}

// ─── Domains ───────────────────────────────────────────────────────────────
export function useDomains() {
  return useQuery({ queryKey: settingsKeys.domains, queryFn: () => domainsApi.list() });
}

export function useCreateDomain() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { hostname: string; isPrimary?: boolean }) => domainsApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: settingsKeys.domains }),
  });
}

export function useDeleteDomain() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => domainsApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: settingsKeys.domains }),
  });
}

export function useVerifyDomain() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => domainsApi.verify(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: settingsKeys.domains }),
  });
}

export function useSetPrimaryDomain() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => domainsApi.setPrimary(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: settingsKeys.domains }),
  });
}

// ─── Notifications ─────────────────────────────────────────────────────────
export function useNotificationPreferences() {
  return useQuery({
    queryKey: settingsKeys.notifications,
    queryFn: () => notificationsApi.getPreferences(),
  });
}

export function useUpdateNotificationPreferences() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      channels?: Partial<NotificationChannels>;
      events?: Partial<NotificationEventToggles>;
    }) => notificationsApi.updatePreferences(data),
    onSuccess: (data) => qc.setQueryData(settingsKeys.notifications, data),
  });
}

// ─── Security ──────────────────────────────────────────────────────────────
export function useChangePassword() {
  return useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      securityApi.changePassword(data),
  });
}

export function useSetup2FA() {
  return useMutation({ mutationFn: () => securityApi.setup2FA() });
}

export function useEnable2FA() {
  return useMutation({ mutationFn: (code: string) => securityApi.enable2FA(code) });
}

export function useDisable2FA() {
  return useMutation({
    mutationFn: ({ password, code }: { password: string; code: string }) =>
      securityApi.disable2FA(password, code),
  });
}
