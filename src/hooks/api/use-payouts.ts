import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { merchantWalletService } from "@/services/api/merchant-wallet";
import { payoutsService } from "@/services/api/payouts";
import type {
  CreatePayoutBankAccountRequest,
  CreatePayoutRequest,
  PayoutFilters,
  UpdatePayoutBankAccountRequest,
} from "@/types/payouts";
import type { MerchantWalletTxFilters } from "@/types/merchant-wallet";

export const merchantWalletKeys = {
  all: ["merchant-wallet"] as const,
  wallet: () => [...merchantWalletKeys.all, "wallet"] as const,
  transactions: (filters?: MerchantWalletTxFilters) =>
    [...merchantWalletKeys.all, "transactions", filters] as const,
};

export const payoutKeys = {
  all: ["payouts"] as const,
  list: (filters?: PayoutFilters) =>
    [...payoutKeys.all, "list", filters] as const,
  detail: (id: string) => [...payoutKeys.all, "detail", id] as const,
  stats: () => [...payoutKeys.all, "stats"] as const,
  bankAccounts: () => [...payoutKeys.all, "bank-accounts"] as const,
};

export function useMerchantWallet() {
  return useQuery({
    queryKey: merchantWalletKeys.wallet(),
    queryFn: () => merchantWalletService.get(),
  });
}

export function useMerchantWalletTransactions(filters?: MerchantWalletTxFilters) {
  return useQuery({
    queryKey: merchantWalletKeys.transactions(filters),
    queryFn: () => merchantWalletService.listTransactions(filters),
  });
}

export function usePayouts(filters?: PayoutFilters) {
  return useQuery({
    queryKey: payoutKeys.list(filters),
    queryFn: () => payoutsService.list(filters),
  });
}

export function usePayout(id: string | undefined) {
  return useQuery({
    queryKey: payoutKeys.detail(id ?? ""),
    queryFn: () => payoutsService.findOne(id as string),
    enabled: !!id,
  });
}

export function usePayoutStats() {
  return useQuery({
    queryKey: payoutKeys.stats(),
    queryFn: () => payoutsService.stats(),
  });
}

export function useCreatePayout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePayoutRequest) => payoutsService.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: payoutKeys.all });
      qc.invalidateQueries({ queryKey: merchantWalletKeys.all });
    },
  });
}

export function useBankAccounts() {
  return useQuery({
    queryKey: payoutKeys.bankAccounts(),
    queryFn: () => payoutsService.listBankAccounts(),
  });
}

export function useCreateBankAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePayoutBankAccountRequest) =>
      payoutsService.createBankAccount(payload),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: payoutKeys.bankAccounts() }),
  });
}

export function useUpdateBankAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdatePayoutBankAccountRequest;
    }) => payoutsService.updateBankAccount(id, payload),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: payoutKeys.bankAccounts() }),
  });
}

export function useRemoveBankAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => payoutsService.removeBankAccount(id),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: payoutKeys.bankAccounts() }),
  });
}
