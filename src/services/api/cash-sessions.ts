import { apiRequest, tokenStorage } from "@/lib/api-client";
import type {
  CashSession,
  CashSessionFilters,
  CashSessionStats,
  CloseCashSessionRequest,
  OpenCashSessionRequest,
  ReviewCashSessionRequest,
} from "@/types/cash-sessions";

export interface PaginatedCashSessions {
  data: CashSession[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

function buildQuery(filters: CashSessionFilters = {}): string {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(filters)) {
    if (v !== undefined && v !== null && v !== "") qs.set(k, String(v));
  }
  return qs.toString();
}

export const cashSessionsService = {
  list: (filters: CashSessionFilters = {}): Promise<PaginatedCashSessions> => {
    const qs = buildQuery(filters);
    return apiRequest<PaginatedCashSessions>(
      `/cash-sessions${qs ? `?${qs}` : ""}`,
    );
  },

  findOne: (id: string): Promise<CashSession> =>
    apiRequest<CashSession>(`/cash-sessions/${id}`),

  stats: (filters: CashSessionFilters = {}): Promise<CashSessionStats> => {
    const qs = buildQuery(filters);
    return apiRequest<CashSessionStats>(
      `/cash-sessions/stats${qs ? `?${qs}` : ""}`,
    );
  },

  myActive: (): Promise<CashSession | null> =>
    apiRequest<CashSession | null>(`/cash-sessions/me/active`),

  open: (payload: OpenCashSessionRequest): Promise<CashSession> =>
    apiRequest<CashSession>(`/cash-sessions/open`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  close: (id: string, payload: CloseCashSessionRequest): Promise<CashSession> =>
    apiRequest<CashSession>(`/cash-sessions/${id}/close`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  review: (
    id: string,
    payload: ReviewCashSessionRequest,
  ): Promise<CashSession> =>
    apiRequest<CashSession>(`/cash-sessions/${id}/review`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  remove: (id: string): Promise<void> =>
    apiRequest<void>(`/cash-sessions/${id}`, { method: "DELETE" }),

  /** Fetches the Register Report PDF as a Blob (auth header included). */
  downloadReport: async (id: string): Promise<Blob> => {
    const base = (import.meta.env.VITE_API_URL as string) ?? "";
    const res = await fetch(`${base}/cash-sessions/${id}/report.pdf`, {
      headers: { Authorization: `Bearer ${tokenStorage.getToken() ?? ""}` },
    });
    if (!res.ok) throw new Error("Failed to download register report");
    return res.blob();
  },
};
