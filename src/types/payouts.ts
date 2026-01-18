// Payouts Types

export interface Payout {
  id: string;
  storeId: string;
  period: string;
  periodStart: string;
  periodEnd: string;
  grossAmount: number;
  fees: PayoutFee[];
  totalFees: number;
  commissions: PayoutCommission[];
  totalCommissions: number;
  taxes: PayoutTax[];
  totalTaxes: number;
  netAmount: number;
  status: "pending" | "processing" | "completed" | "failed" | "on-hold";
  paymentMethod?: "bank-transfer" | "check" | "other";
  bankName?: string;
  bankAccount?: string;
  scheduledDate?: string;
  paidDate?: string;
  transactionRef?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PayoutFee {
  id: string;
  name: string;
  type: "platform" | "processing" | "gateway" | "other";
  amount: number;
  percentage?: number;
}

export interface PayoutCommission {
  id: string;
  name: string;
  type: "sales" | "delivery" | "referral" | "other";
  amount: number;
  percentage?: number;
  ordersCount?: number;
}

export interface PayoutTax {
  id: string;
  name: string;
  type: "vat" | "withholding" | "sales-tax" | "other";
  amount: number;
  rate?: number;
}

// Filters
export interface PayoutFilters {
  storeId?: string;
  status?: Payout["status"];
  periodFrom?: string;
  periodTo?: string;
  page?: number;
  limit?: number;
}

// Request types
export interface CreatePayoutRequest {
  storeId: string;
  period: string;
  periodStart: string;
  periodEnd: string;
  grossAmount: number;
  fees?: Omit<PayoutFee, 'id'>[];
  commissions?: Omit<PayoutCommission, 'id'>[];
  taxes?: Omit<PayoutTax, 'id'>[];
  paymentMethod?: Payout["paymentMethod"];
  scheduledDate?: string;
  notes?: string;
}

export interface UpdatePayoutRequest {
  grossAmount?: number;
  fees?: PayoutFee[];
  commissions?: PayoutCommission[];
  taxes?: PayoutTax[];
  status?: Payout["status"];
  paymentMethod?: Payout["paymentMethod"];
  paidDate?: string;
  transactionRef?: string;
  notes?: string;
}

// Stats
export interface PayoutStats {
  totalPayouts: number;
  pendingPayouts: number;
  completedPayouts: number;
  totalPaidAmount: number;
  totalFees: number;
  totalCommissions: number;
  averagePayoutAmount: number;
}
