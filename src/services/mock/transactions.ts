// Transactions Mock Service
import type {
  Transaction,
  AccountBalance,
  TransactionFilters,
  AccountBalanceFilters,
  CreateTransactionRequest,
  UpdateTransactionRequest,
  CreateAccountBalanceRequest,
  UpdateAccountBalanceRequest,
  CloseAccountBalanceRequest,
  TransactionStats,
} from "@/types/transactions";

// Mock data
const mockTransactions: Transaction[] = [
  {
    id: "txn-001",
    storeId: "store-1",
    type: "sale",
    orderId: "ord-001",
    orderNumber: "ORD-001",
    amount: 15500,
    currency: "NGN",
    paymentMethod: "card",
    paymentProvider: "Paystack",
    reference: "PSK-2024-001",
    status: "completed",
    customerId: "cust-001",
    customerName: "Adebayo Johnson",
    staffId: "staff-002",
    staffName: "Amina Bello",
    description: "Order payment",
    createdAt: "2024-01-20T12:30:00Z",
    updatedAt: "2024-01-20T12:30:00Z",
  },
  {
    id: "txn-002",
    storeId: "store-1",
    type: "sale",
    orderId: "ord-002",
    orderNumber: "ORD-002",
    amount: 8200,
    currency: "NGN",
    paymentMethod: "cash",
    status: "completed",
    customerId: "cust-003",
    customerName: "Ngozi Okafor",
    staffId: "staff-002",
    staffName: "Amina Bello",
    createdAt: "2024-01-20T13:15:00Z",
    updatedAt: "2024-01-20T13:15:00Z",
  },
  {
    id: "txn-003",
    storeId: "store-1",
    type: "refund",
    orderId: "ord-003",
    orderNumber: "ORD-003",
    amount: -3500,
    currency: "NGN",
    paymentMethod: "card",
    reference: "REF-2024-001",
    status: "completed",
    customerName: "Tunde Bakare",
    description: "Partial refund for incorrect order",
    createdAt: "2024-01-20T14:00:00Z",
    updatedAt: "2024-01-20T14:00:00Z",
  },
  {
    id: "txn-004",
    storeId: "store-1",
    type: "expense",
    expenseId: "exp-001",
    amount: -45000,
    currency: "NGN",
    paymentMethod: "bank-transfer",
    status: "completed",
    description: "Cleaning supplies purchase",
    createdAt: "2024-01-18T10:00:00Z",
    updatedAt: "2024-01-18T10:00:00Z",
  },
  {
    id: "txn-005",
    storeId: "store-1",
    type: "tip",
    orderId: "ord-001",
    amount: 500,
    currency: "NGN",
    paymentMethod: "cash",
    status: "completed",
    staffId: "staff-002",
    staffName: "Amina Bello",
    createdAt: "2024-01-20T12:35:00Z",
    updatedAt: "2024-01-20T12:35:00Z",
  },
];

const mockAccountBalances: AccountBalance[] = [
  {
    id: "bal-001",
    storeId: "store-1",
    date: "2024-01-20",
    openingCash: 50000,
    closingCash: 0,
    expectedCash: 58700,
    actualCash: 0,
    variance: 0,
    cardTransactions: 12,
    cardTotal: 156000,
    bankTransfers: 3,
    bankTotal: 45000,
    mobilePayments: 5,
    mobileTotal: 32000,
    totalSales: 291700,
    totalRefunds: 3500,
    totalExpenses: 0,
    netAmount: 288200,
    status: "open",
    createdAt: "2024-01-20T08:00:00Z",
    updatedAt: "2024-01-20T15:00:00Z",
  },
  {
    id: "bal-002",
    storeId: "store-1",
    date: "2024-01-19",
    openingCash: 45000,
    closingCash: 62500,
    expectedCash: 62500,
    actualCash: 62300,
    variance: -200,
    cardTransactions: 15,
    cardTotal: 185000,
    bankTransfers: 2,
    bankTotal: 28000,
    mobilePayments: 8,
    mobileTotal: 48000,
    totalSales: 323500,
    totalRefunds: 5000,
    totalExpenses: 85000,
    netAmount: 233500,
    status: "discrepancy",
    balancedBy: "staff-001",
    balancedByName: "Emeka Okonkwo",
    balancedAt: "2024-01-19T22:30:00Z",
    notes: "Small variance - possible counting error",
    createdAt: "2024-01-19T08:00:00Z",
    updatedAt: "2024-01-19T22:30:00Z",
  },
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const transactionService = {
  // Transactions
  async getTransactions(filters?: TransactionFilters): Promise<{ data: Transaction[]; total: number }> {
    await delay(300);
    let result = [...mockTransactions];
    
    if (filters?.storeId) result = result.filter(t => t.storeId === filters.storeId);
    if (filters?.type) result = result.filter(t => t.type === filters.type);
    if (filters?.paymentMethod) result = result.filter(t => t.paymentMethod === filters.paymentMethod);
    if (filters?.status) result = result.filter(t => t.status === filters.status);
    if (filters?.orderId) result = result.filter(t => t.orderId === filters.orderId);
    if (filters?.customerId) result = result.filter(t => t.customerId === filters.customerId);
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(t => 
        t.reference?.toLowerCase().includes(search) ||
        t.orderNumber?.toLowerCase().includes(search) ||
        t.customerName?.toLowerCase().includes(search)
      );
    }
    
    const total = result.length;
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    result = result.slice((page - 1) * limit, page * limit);
    
    return { data: result, total };
  },

  async getTransaction(id: string): Promise<Transaction | null> {
    await delay(200);
    return mockTransactions.find(t => t.id === id) || null;
  },

  async createTransaction(data: CreateTransactionRequest): Promise<Transaction> {
    await delay(400);
    const newTransaction: Transaction = {
      ...data,
      id: `txn-${Date.now()}`,
      currency: "NGN",
      status: "completed",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockTransactions.push(newTransaction);
    return newTransaction;
  },

  async updateTransaction(id: string, data: UpdateTransactionRequest): Promise<Transaction | null> {
    await delay(300);
    const index = mockTransactions.findIndex(t => t.id === id);
    if (index === -1) return null;
    mockTransactions[index] = { ...mockTransactions[index], ...data, updatedAt: new Date().toISOString() };
    return mockTransactions[index];
  },

  // Account Balances
  async getAccountBalances(filters?: AccountBalanceFilters): Promise<{ data: AccountBalance[]; total: number }> {
    await delay(300);
    let result = [...mockAccountBalances];
    
    if (filters?.storeId) result = result.filter(b => b.storeId === filters.storeId);
    if (filters?.status) result = result.filter(b => b.status === filters.status);
    
    return { data: result, total: result.length };
  },

  async getAccountBalance(id: string): Promise<AccountBalance | null> {
    await delay(200);
    return mockAccountBalances.find(b => b.id === id) || null;
  },

  async getTodayBalance(storeId: string): Promise<AccountBalance | null> {
    await delay(200);
    const today = new Date().toISOString().split('T')[0];
    return mockAccountBalances.find(b => b.storeId === storeId && b.date === today) || null;
  },

  async createAccountBalance(data: CreateAccountBalanceRequest): Promise<AccountBalance> {
    await delay(400);
    const newBalance: AccountBalance = {
      ...data,
      id: `bal-${Date.now()}`,
      closingCash: 0,
      expectedCash: data.openingCash,
      actualCash: 0,
      variance: 0,
      cardTransactions: 0,
      cardTotal: 0,
      bankTransfers: 0,
      bankTotal: 0,
      mobilePayments: 0,
      mobileTotal: 0,
      totalSales: 0,
      totalRefunds: 0,
      totalExpenses: 0,
      netAmount: 0,
      status: "open",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockAccountBalances.push(newBalance);
    return newBalance;
  },

  async updateAccountBalance(id: string, data: UpdateAccountBalanceRequest): Promise<AccountBalance | null> {
    await delay(300);
    const index = mockAccountBalances.findIndex(b => b.id === id);
    if (index === -1) return null;
    mockAccountBalances[index] = { ...mockAccountBalances[index], ...data, updatedAt: new Date().toISOString() };
    return mockAccountBalances[index];
  },

  async closeAccountBalance(id: string, data: CloseAccountBalanceRequest): Promise<AccountBalance | null> {
    await delay(400);
    const index = mockAccountBalances.findIndex(b => b.id === id);
    if (index === -1) return null;
    
    const balance = mockAccountBalances[index];
    const variance = data.actualCash - balance.expectedCash;
    
    mockAccountBalances[index] = {
      ...balance,
      actualCash: data.actualCash,
      closingCash: data.actualCash,
      variance,
      status: variance === 0 ? "balanced" : "discrepancy",
      balancedBy: "current-user",
      balancedByName: "Current User",
      balancedAt: new Date().toISOString(),
      notes: data.notes,
      updatedAt: new Date().toISOString(),
    };
    return mockAccountBalances[index];
  },

  // Stats
  async getStats(storeId?: string): Promise<TransactionStats> {
    await delay(200);
    const transactions = storeId ? mockTransactions.filter(t => t.storeId === storeId) : mockTransactions;
    
    const sales = transactions.filter(t => t.type === 'sale' && t.status === 'completed');
    const refunds = transactions.filter(t => t.type === 'refund' && t.status === 'completed');
    const expenses = transactions.filter(t => t.type === 'expense' && t.status === 'completed');
    
    return {
      totalTransactions: transactions.length,
      totalSales: sales.reduce((sum, t) => sum + t.amount, 0),
      totalRefunds: Math.abs(refunds.reduce((sum, t) => sum + t.amount, 0)),
      totalExpenses: Math.abs(expenses.reduce((sum, t) => sum + t.amount, 0)),
      netRevenue: transactions.filter(t => t.status === 'completed').reduce((sum, t) => sum + t.amount, 0),
      cashTotal: transactions.filter(t => t.paymentMethod === 'cash' && t.status === 'completed').reduce((sum, t) => sum + Math.abs(t.amount), 0),
      cardTotal: transactions.filter(t => t.paymentMethod === 'card' && t.status === 'completed').reduce((sum, t) => sum + Math.abs(t.amount), 0),
      otherPaymentsTotal: transactions.filter(t => !['cash', 'card'].includes(t.paymentMethod) && t.status === 'completed').reduce((sum, t) => sum + Math.abs(t.amount), 0),
      pendingTransactions: transactions.filter(t => t.status === 'pending').length,
      failedTransactions: transactions.filter(t => t.status === 'failed').length,
    };
  },
};
