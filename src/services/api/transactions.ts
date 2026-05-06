import { apiRequest } from "@/lib/api-client";
import type {
  FinancialTransaction,
  TransactionFilters,
  TransactionStats,
} from "@/types/transactions";

export interface PaginatedTransactions {
  data: FinancialTransaction[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

function buildQuery(filters: TransactionFilters = {}): string {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(filters)) {
    if (v !== undefined && v !== null && v !== "") qs.set(k, String(v));
  }
  return qs.toString();
}

export const transactionsService = {
  list: (filters: TransactionFilters = {}): Promise<PaginatedTransactions> => {
    const qs = buildQuery(filters);
    return apiRequest<PaginatedTransactions>(
      `/transactions${qs ? `?${qs}` : ""}`,
    );
  },

  findOne: (id: string): Promise<FinancialTransaction> =>
    apiRequest<FinancialTransaction>(`/transactions/${id}`),

  stats: (filters: TransactionFilters = {}): Promise<TransactionStats> => {
    const qs = buildQuery(filters);
    return apiRequest<TransactionStats>(
      `/transactions/stats${qs ? `?${qs}` : ""}`,
    );
  },
};
