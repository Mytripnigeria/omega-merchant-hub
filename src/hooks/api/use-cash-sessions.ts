import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cashSessionsService } from "@/services/api/cash-sessions";
import type {
  CashSessionFilters,
  CloseCashSessionRequest,
  OpenCashSessionRequest,
  ReviewCashSessionRequest,
} from "@/types/cash-sessions";

export const cashSessionKeys = {
  all: ["cash-sessions"] as const,
  lists: () => [...cashSessionKeys.all, "list"] as const,
  list: (filters?: CashSessionFilters) =>
    [...cashSessionKeys.lists(), filters] as const,
  details: () => [...cashSessionKeys.all, "detail"] as const,
  detail: (id: string) => [...cashSessionKeys.details(), id] as const,
  stats: (filters?: CashSessionFilters) =>
    [...cashSessionKeys.all, "stats", filters] as const,
  active: () => [...cashSessionKeys.all, "me", "active"] as const,
};

export function useCashSessions(filters?: CashSessionFilters) {
  return useQuery({
    queryKey: cashSessionKeys.list(filters),
    queryFn: () => cashSessionsService.list(filters),
    staleTime: 10 * 1000,
  });
}

export function useCashSession(id: string) {
  return useQuery({
    queryKey: cashSessionKeys.detail(id),
    queryFn: () => cashSessionsService.findOne(id),
    enabled: !!id,
  });
}

export function useCashSessionStats(filters?: CashSessionFilters) {
  return useQuery({
    queryKey: cashSessionKeys.stats(filters),
    queryFn: () => cashSessionsService.stats(filters),
    staleTime: 30 * 1000,
  });
}

export function useMyActiveCashSession() {
  return useQuery({
    queryKey: cashSessionKeys.active(),
    queryFn: () => cashSessionsService.myActive(),
  });
}

export function useOpenCashSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: OpenCashSessionRequest) =>
      cashSessionsService.open(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: cashSessionKeys.all }),
  });
}

export function useCloseCashSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: CloseCashSessionRequest;
    }) => cashSessionsService.close(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: cashSessionKeys.all }),
  });
}

export function useReviewCashSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: ReviewCashSessionRequest;
    }) => cashSessionsService.review(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: cashSessionKeys.all }),
  });
}
