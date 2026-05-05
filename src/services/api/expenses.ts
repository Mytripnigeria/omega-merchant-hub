import { apiRequest } from "@/lib/api-client";

export type ExpenseStatus = "pending" | "approved" | "rejected" | "paid";

export type ExpenseCategory =
  | "supplies"
  | "utilities"
  | "maintenance"
  | "transport"
  | "salaries"
  | "other";

export interface Expense {
  id: string;
  businessId: string;
  storeId: string;
  requestedById: string;
  requestedByName: string;
  category: ExpenseCategory;
  amount: number;
  currency: string;
  description: string;
  receiptFileId: string | null;
  receiptUrl: string | null;
  status: ExpenseStatus;
  reviewedById: string | null;
  reviewedByName: string | null;
  reviewedAt: string | null;
  reviewNotes: string | null;
  paidAt: string | null;
  paymentMethodId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedExpenses {
  data: Expense[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ExpenseFilters {
  storeId?: string;
  requestedById?: string;
  status?: string;
  category?: ExpenseCategory;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  page?: number;
  limit?: number;
}

function buildQuery(filters: ExpenseFilters): string {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(filters)) {
    if (v !== undefined && v !== null && v !== "") qs.set(k, String(v));
  }
  return qs.toString();
}

export const expensesService = {
  list: (filters: ExpenseFilters = {}): Promise<PaginatedExpenses> => {
    const qs = buildQuery(filters);
    return apiRequest<PaginatedExpenses>(`/expenses${qs ? `?${qs}` : ""}`);
  },

  findOne: (id: string): Promise<Expense> => apiRequest<Expense>(`/expenses/${id}`),

  approve: (id: string, notes?: string): Promise<Expense> =>
    apiRequest<Expense>(`/expenses/${id}/approve`, {
      method: "POST",
      body: JSON.stringify({ notes }),
    }),

  reject: (id: string, notes?: string): Promise<Expense> =>
    apiRequest<Expense>(`/expenses/${id}/reject`, {
      method: "POST",
      body: JSON.stringify({ notes }),
    }),

  markPaid: (id: string, paymentMethodId?: string): Promise<Expense> =>
    apiRequest<Expense>(`/expenses/${id}/mark-paid`, {
      method: "POST",
      body: JSON.stringify({ paymentMethodId }),
    }),
};
