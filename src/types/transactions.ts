// Transactions Types — aligned to the backend financial-transactions ledger.

export type TransactionType = "credit" | "debit";

export type TransactionPurpose =
  | "order_payment"
  | "order_refund"
  | "wallet_credit"
  | "wallet_debit"
  | "expense_payment"
  | "payout"
  | "manual_adjustment";

export type TransactionMethod =
  | "cash"
  | "card"
  | "wallet"
  | "points"
  | "paystack"
  | "transfer"
  | "other";

export type TransactionLinkedType = "order" | "wallet_tx" | "expense" | null;

export interface FinancialTransaction {
  id: string;
  businessId: string;
  storeId: string | null;
  type: TransactionType;
  purpose: TransactionPurpose;
  amount: number;
  method: TransactionMethod | null;
  currency: string;
  reference: string | null;
  description: string;
  linkedType: TransactionLinkedType;
  linkedId: string | null;
  customerId: string | null;
  customerName: string | null;
  staffId: string | null;
  staffName: string | null;
  createdAt: string;
}

export interface TransactionFilters {
  storeId?: string;
  type?: TransactionType;
  purpose?: string; // comma-separated
  method?: string; // comma-separated
  customerId?: string;
  linkedId?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export interface TransactionStats {
  totalIn: number;
  totalOut: number;
  pending: number;
  byMethod: Record<string, number>;
  byPurpose: Record<string, number>;
}
