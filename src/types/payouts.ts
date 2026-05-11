export type PayoutStatus =
  | "pending"
  | "queued"
  | "processing"
  | "success"
  | "failed"
  | "cancelled";

export interface PayoutBankAccount {
  id: string;
  businessId: string;
  label: string;
  accountNumber: string;
  bankCode: string;
  bankName: string | null;
  accountName: string | null;
  currency: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePayoutBankAccountRequest {
  label: string;
  accountNumber: string;
  bankCode: string;
  isDefault?: boolean;
}

export interface UpdatePayoutBankAccountRequest {
  label?: string;
  isDefault?: boolean;
}

export interface Payout {
  id: string;
  businessId: string;
  reference: string;
  bankAccountId: string;
  amount: number;
  currency: string;
  status: PayoutStatus;
  providerTransferCode: string | null;
  providerStatus: string | null;
  failureReason: string | null;
  requestedById: string | null;
  requestedByName: string | null;
  note: string | null;
  queuedAt: string | null;
  processingAt: string | null;
  settledAt: string | null;
  bankAccount: PayoutBankAccount | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePayoutRequest {
  amount: number;
  bankAccountId: string;
  note?: string;
}

export interface PayoutFilters {
  status?: PayoutStatus;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export interface PayoutStats {
  totalPaidOut: number;
  totalPending: number;
  successCount: number;
  failedCount: number;
  inFlightCount: number;
}
