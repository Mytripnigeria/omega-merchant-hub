import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { expensesService, type ExpenseFilters } from "@/services/api/expenses";

export const expensesKeys = {
  all: ["expenses"] as const,
  list: (filters?: ExpenseFilters) => [...expensesKeys.all, "list", filters] as const,
  one: (id: string) => [...expensesKeys.all, id] as const,
};

export function useExpensesList(filters: ExpenseFilters = {}) {
  return useQuery({
    queryKey: expensesKeys.list(filters),
    queryFn: () => expensesService.list(filters),
    staleTime: 30 * 1000,
  });
}

export function useApproveExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) =>
      expensesService.approve(id, notes),
    onSuccess: () => qc.invalidateQueries({ queryKey: expensesKeys.all }),
  });
}

export function useRejectExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) =>
      expensesService.reject(id, notes),
    onSuccess: () => qc.invalidateQueries({ queryKey: expensesKeys.all }),
  });
}

export function useMarkExpensePaid() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, paymentMethodId }: { id: string; paymentMethodId?: string }) =>
      expensesService.markPaid(id, paymentMethodId),
    onSuccess: () => qc.invalidateQueries({ queryKey: expensesKeys.all }),
  });
}
