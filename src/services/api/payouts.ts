import { apiRequest } from "@/lib/api-client";
import type {
  CreatePayoutBankAccountRequest,
  CreatePayoutRequest,
  Payout,
  PayoutBankAccount,
  PayoutFilters,
  PayoutStats,
  UpdatePayoutBankAccountRequest,
} from "@/types/payouts";

export interface PaginatedPayouts {
  data: Payout[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

function buildQuery(filters: PayoutFilters = {}): string {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(filters)) {
    if (v !== undefined && v !== null && v !== "") qs.set(k, String(v));
  }
  return qs.toString();
}

export const payoutsService = {
  // ─── Bank accounts ────────────────────────────────────────────────
  listBankAccounts: (): Promise<PayoutBankAccount[]> =>
    apiRequest<PayoutBankAccount[]>("/payouts/bank-accounts"),

  createBankAccount: (
    payload: CreatePayoutBankAccountRequest,
  ): Promise<PayoutBankAccount> =>
    apiRequest<PayoutBankAccount>("/payouts/bank-accounts", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateBankAccount: (
    id: string,
    payload: UpdatePayoutBankAccountRequest,
  ): Promise<PayoutBankAccount> =>
    apiRequest<PayoutBankAccount>(`/payouts/bank-accounts/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  removeBankAccount: (id: string): Promise<void> =>
    apiRequest<void>(`/payouts/bank-accounts/${id}`, { method: "DELETE" }),

  // ─── Payouts ──────────────────────────────────────────────────────
  list: (filters: PayoutFilters = {}): Promise<PaginatedPayouts> => {
    const qs = buildQuery(filters);
    return apiRequest<PaginatedPayouts>(`/payouts${qs ? `?${qs}` : ""}`);
  },

  stats: (): Promise<PayoutStats> => apiRequest<PayoutStats>("/payouts/stats"),

  findOne: (id: string): Promise<Payout> => apiRequest<Payout>(`/payouts/${id}`),

  create: (payload: CreatePayoutRequest): Promise<Payout> =>
    apiRequest<Payout>("/payouts", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};
