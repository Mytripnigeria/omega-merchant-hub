import { apiRequest } from "@/lib/api-client";
import type {
  KPITarget,
  KPITargetFilters,
  KpiPerformanceRow,
  CreateKPITargetRequest,
  UpdateKPITargetRequest,
} from "@/types/operations";

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

function buildQs(params?: Record<string, unknown>): string {
  if (!params) return "";
  const usp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === "") continue;
    usp.set(k, String(v));
  }
  const s = usp.toString();
  return s ? `?${s}` : "";
}

export const kpiTargetsApi = {
  list(filters?: KPITargetFilters) {
    return apiRequest<PaginatedResponse<KPITarget>>(
      `/kpi-targets${buildQs(filters as Record<string, unknown>)}`,
    );
  },

  get(id: string) {
    return apiRequest<KPITarget>(`/kpi-targets/${id}`);
  },

  listPerformances(id: string) {
    return apiRequest<KpiPerformanceRow[]>(`/kpi-targets/${id}/performances`);
  },

  recordPerformance(
    id: string,
    data: { staffId: string; value: number; note?: string },
  ) {
    return apiRequest<KpiPerformanceRow[]>(`/kpi-targets/${id}/performances`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  create(data: CreateKPITargetRequest) {
    return apiRequest<KPITarget>("/kpi-targets", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update(id: string, data: UpdateKPITargetRequest) {
    return apiRequest<KPITarget>(`/kpi-targets/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  remove(id: string) {
    return apiRequest<void>(`/kpi-targets/${id}`, { method: "DELETE" });
  },
};
