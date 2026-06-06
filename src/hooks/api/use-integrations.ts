import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  integrationsApi,
  type IntegrationProvider,
  type UpdateIntegrationPayload,
} from '@/services/api/integrations';

const integrationsKey = ['settings', 'integrations'] as const;

export function useIntegrations() {
  return useQuery({
    queryKey: integrationsKey,
    queryFn: () => integrationsApi.list(),
  });
}

export function useUpdateIntegration() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      provider,
      data,
    }: {
      provider: IntegrationProvider;
      data: UpdateIntegrationPayload;
    }) => integrationsApi.update(provider, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: integrationsKey }),
  });
}
