import { apiRequest } from "@/lib/api-client";
import type {
  Checklist,
  ChecklistFilters,
  ChecklistPerformance,
  CreateChecklistRequest,
  UpdateChecklistRequest,
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

export const checklistsApi = {
  list(filters?: ChecklistFilters) {
    return apiRequest<PaginatedResponse<Checklist>>(
      `/checklists${buildQs(filters as Record<string, unknown>)}`,
    );
  },

  get(id: string) {
    return apiRequest<Checklist>(`/checklists/${id}`);
  },

  /**
   * `date` names any day inside the period to report; the backend derives the
   * period from the checklist's own frequency. Omitted = the period in
   * progress, which is what this used to be hard-wired to.
   */
  performances(id: string, date?: string) {
    const qs = date ? `?date=${encodeURIComponent(date)}` : "";
    return apiRequest<ChecklistPerformance[]>(
      `/checklists/${id}/performances${qs}`,
    );
  },

  create(data: CreateChecklistRequest) {
    return apiRequest<Checklist>("/checklists", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update(id: string, data: UpdateChecklistRequest) {
    return apiRequest<Checklist>(`/checklists/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  toggleItem(id: string, itemId: string, isCompleted: boolean) {
    return apiRequest<Checklist>(`/checklists/${id}/items/${itemId}`, {
      method: "PATCH",
      body: JSON.stringify({ isCompleted }),
    });
  },

  remove(id: string) {
    return apiRequest<void>(`/checklists/${id}`, { method: "DELETE" });
  },
};
