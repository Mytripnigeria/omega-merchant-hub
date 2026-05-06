import { useQuery } from "@tanstack/react-query";
import { transactionsService } from "@/services/api/transactions";
import type { TransactionFilters } from "@/types/transactions";

export const transactionKeys = {
  all: ["transactions"] as const,
  lists: () => [...transactionKeys.all, "list"] as const,
  list: (filters?: TransactionFilters) =>
    [...transactionKeys.lists(), filters] as const,
  details: () => [...transactionKeys.all, "detail"] as const,
  detail: (id: string) => [...transactionKeys.details(), id] as const,
  stats: (filters?: TransactionFilters) =>
    [...transactionKeys.all, "stats", filters] as const,
};

export function useTransactions(filters?: TransactionFilters) {
  return useQuery({
    queryKey: transactionKeys.list(filters),
    queryFn: () => transactionsService.list(filters),
    staleTime: 10 * 1000,
  });
}

export function useTransaction(id: string) {
  return useQuery({
    queryKey: transactionKeys.detail(id),
    queryFn: () => transactionsService.findOne(id),
    enabled: !!id,
  });
}

export function useTransactionStats(filters?: TransactionFilters) {
  return useQuery({
    queryKey: transactionKeys.stats(filters),
    queryFn: () => transactionsService.stats(filters),
    staleTime: 30 * 1000,
  });
}
