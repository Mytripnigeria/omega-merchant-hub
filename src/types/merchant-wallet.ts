export interface MerchantWallet {
  id: string;
  businessId: string;
  balance: number;
  reservedBalance: number;
  availableBalance: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export type MerchantWalletTxType = "credit" | "debit";

export type MerchantWalletTxReason =
  | "order_payment"
  | "order_refund"
  | "payout_reserved"
  | "payout_released"
  | "payout_settled"
  | "adjustment";

export interface MerchantWalletTransaction {
  id: string;
  businessId: string;
  walletId: string;
  type: MerchantWalletTxType;
  reason: MerchantWalletTxReason;
  amount: number;
  balanceAfter: number;
  description: string;
  linkedType: "order" | "payout" | null;
  linkedId: string | null;
  storeId: string | null;
  createdAt: string;
}

export interface MerchantWalletTxFilters {
  type?: MerchantWalletTxType;
  reason?: MerchantWalletTxReason;
  linkedId?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}
