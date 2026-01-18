// Transactions Types

export interface Transaction {
  id: string;
  storeId: string;
  type: "sale" | "refund" | "payout" | "expense" | "adjustment" | "tip";
  orderId?: string;
  orderNumber?: string;
  payoutId?: string;
  expenseId?: string;
  amount: number;
  currency: string;
  paymentMethod: "cash" | "card" | "bank-transfer" | "mobile-money" | "wallet" | "credit" | "other";
  paymentProvider?: string;
  reference?: string;
  status: "pending" | "completed" | "failed" | "refunded" | "cancelled";
  customerId?: string;
  customerName?: string;
  staffId?: string;
  staffName?: string;
  description?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface AccountBalance {
  id: string;
  storeId: string;
  date: string;
  openingCash: number;
  closingCash: number;
  expectedCash: number;
  actualCash: number;
  variance: number;
  cardTransactions: number;
  cardTotal: number;
  bankTransfers: number;
  bankTotal: number;
  mobilePayments: number;
  mobileTotal: number;
  totalSales: number;
  totalRefunds: number;
  totalExpenses: number;
  netAmount: number;
  status: "open" | "closed" | "balanced" | "discrepancy";
  balancedBy?: string;
  balancedByName?: string;
  balancedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Filters
export interface TransactionFilters {
  storeId?: string;
  type?: Transaction["type"];
  paymentMethod?: Transaction["paymentMethod"];
  status?: Transaction["status"];
  orderId?: string;
  customerId?: string;
  staffId?: string;
  dateFrom?: string;
  dateTo?: string;
  amountMin?: number;
  amountMax?: number;
  search?: string;
  page?: number;
  limit?: number;
}

export interface AccountBalanceFilters {
  storeId?: string;
  status?: AccountBalance["status"];
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

// Request types
export interface CreateTransactionRequest {
  storeId: string;
  type: Transaction["type"];
  orderId?: string;
  payoutId?: string;
  expenseId?: string;
  amount: number;
  paymentMethod: Transaction["paymentMethod"];
  paymentProvider?: string;
  reference?: string;
  customerId?: string;
  description?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateTransactionRequest {
  status?: Transaction["status"];
  reference?: string;
  description?: string;
  metadata?: Record<string, unknown>;
}

export interface CreateAccountBalanceRequest {
  storeId: string;
  date: string;
  openingCash: number;
}

export interface UpdateAccountBalanceRequest {
  closingCash?: number;
  actualCash?: number;
  status?: AccountBalance["status"];
  notes?: string;
}

export interface CloseAccountBalanceRequest {
  actualCash: number;
  notes?: string;
}

// Stats
export interface TransactionStats {
  totalTransactions: number;
  totalSales: number;
  totalRefunds: number;
  totalExpenses: number;
  netRevenue: number;
  cashTotal: number;
  cardTotal: number;
  otherPaymentsTotal: number;
  pendingTransactions: number;
  failedTransactions: number;
}
