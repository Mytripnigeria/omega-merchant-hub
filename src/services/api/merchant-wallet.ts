import { apiRequest } from "@/lib/api-client";
import type {
  MerchantWallet,
  MerchantWalletTransaction,
  MerchantWalletTxFilters,
} from "@/types/merchant-wallet";

export interface PaginatedWalletTx {
  data: MerchantWalletTransaction[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

function buildQuery(filters: MerchantWalletTxFilters = {}): string {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(filters)) {
    if (v !== undefined && v !== null && v !== "") qs.set(k, String(v));
  }
  return qs.toString();
}

export const merchantWalletService = {
  get: (): Promise<MerchantWallet> =>
    apiRequest<MerchantWallet>("/merchant-wallet"),

  listTransactions: (
    filters: MerchantWalletTxFilters = {},
  ): Promise<PaginatedWalletTx> => {
    const qs = buildQuery(filters);
    return apiRequest<PaginatedWalletTx>(
      `/merchant-wallet/transactions${qs ? `?${qs}` : ""}`,
    );
  },
};
