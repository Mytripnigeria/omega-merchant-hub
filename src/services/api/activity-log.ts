import { apiRequest } from '@/lib/api-client';

export type ActorType = 'admin' | 'staff' | 'system';

export interface ActivityEntry {
  id: string;
  actorType: ActorType;
  actorId: string | null;
  actorName: string;
  action: string;
  resourceType: string | null;
  resourceId: string | null;
  metadata: Record<string, unknown> | null;
  businessId: string;
  storeId: string | null;
  createdAt: string;
}

export interface PaginatedActivityLog {
  data: ActivityEntry[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ActivityLogFilters {
  resourceType?: string;
  resourceId?: string;
  actorId?: string;
  actorType?: ActorType;
  action?: string;
  storeId?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

function buildQuery(filters: ActivityLogFilters): string {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(filters)) {
    if (v !== undefined && v !== null && v !== '') qs.set(k, String(v));
  }
  return qs.toString();
}

export const activityLogService = {
  list: (filters: ActivityLogFilters = {}): Promise<PaginatedActivityLog> => {
    const qs = buildQuery(filters);
    return apiRequest<PaginatedActivityLog>(`/activity-log${qs ? `?${qs}` : ''}`);
  },
};
