import { apiRequest } from '@/lib/api-client';

export type SslStatus = 'pending' | 'active' | 'failed';

export interface DnsRecord {
  type: string;
  name: string;
  value: string;
}

export interface Domain {
  id: string;
  businessId: string;
  hostname: string;
  isPrimary: boolean;
  verifiedAt: string | null;
  verificationToken: string;
  dnsRecords: DnsRecord[] | null;
  sslStatus: SslStatus;
  createdAt: string;
  updatedAt: string;
}

export const domainsApi = {
  list() {
    return apiRequest<Domain[]>('/domains');
  },
  create(data: { hostname: string; isPrimary?: boolean }) {
    return apiRequest<Domain>('/domains', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  remove(id: string) {
    return apiRequest<void>(`/domains/${id}`, { method: 'DELETE' });
  },
  verify(id: string) {
    return apiRequest<Domain>(`/domains/${id}/verify`, { method: 'POST' });
  },
  setPrimary(id: string) {
    return apiRequest<Domain>(`/domains/${id}/set-primary`, { method: 'POST' });
  },
};
