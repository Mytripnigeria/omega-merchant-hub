// Payouts Mock Service
import type {
  Payout,
  PayoutFilters,
  CreatePayoutRequest,
  UpdatePayoutRequest,
  PayoutStats,
} from "@/types/payouts";

// Mock data
const mockPayouts: Payout[] = [
  {
    id: "payout-001",
    storeId: "store-1",
    period: "2024-01-W2",
    periodStart: "2024-01-08",
    periodEnd: "2024-01-14",
    grossAmount: 2500000,
    fees: [
      { id: "fee-001", name: "Platform Fee", type: "platform", amount: 62500, percentage: 2.5 },
      { id: "fee-002", name: "Processing Fee", type: "processing", amount: 25000, percentage: 1 },
    ],
    totalFees: 87500,
    commissions: [
      { id: "comm-001", name: "Delivery Commission", type: "delivery", amount: 75000, ordersCount: 150 },
    ],
    totalCommissions: 75000,
    taxes: [
      { id: "tax-001", name: "VAT", type: "vat", amount: 187500, rate: 7.5 },
    ],
    totalTaxes: 187500,
    netAmount: 2150000,
    status: "completed",
    paymentMethod: "bank-transfer",
    bankName: "GTBank",
    bankAccount: "0123456789",
    scheduledDate: "2024-01-16",
    paidDate: "2024-01-16",
    transactionRef: "PAY-2024-001",
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-01-16T10:00:00Z",
  },
  {
    id: "payout-002",
    storeId: "store-1",
    period: "2024-01-W3",
    periodStart: "2024-01-15",
    periodEnd: "2024-01-21",
    grossAmount: 2800000,
    fees: [
      { id: "fee-003", name: "Platform Fee", type: "platform", amount: 70000, percentage: 2.5 },
      { id: "fee-004", name: "Processing Fee", type: "processing", amount: 28000, percentage: 1 },
    ],
    totalFees: 98000,
    commissions: [
      { id: "comm-002", name: "Delivery Commission", type: "delivery", amount: 84000, ordersCount: 168 },
    ],
    totalCommissions: 84000,
    taxes: [
      { id: "tax-002", name: "VAT", type: "vat", amount: 210000, rate: 7.5 },
    ],
    totalTaxes: 210000,
    netAmount: 2408000,
    status: "pending",
    paymentMethod: "bank-transfer",
    bankName: "GTBank",
    bankAccount: "0123456789",
    scheduledDate: "2024-01-23",
    createdAt: "2024-01-22T00:00:00Z",
    updatedAt: "2024-01-22T00:00:00Z",
  },
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const payoutService = {
  async getPayouts(filters?: PayoutFilters): Promise<{ data: Payout[]; total: number }> {
    await delay(300);
    let result = [...mockPayouts];
    
    if (filters?.storeId) result = result.filter(p => p.storeId === filters.storeId);
    if (filters?.status) result = result.filter(p => p.status === filters.status);
    
    const total = result.length;
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    result = result.slice((page - 1) * limit, page * limit);
    
    return { data: result, total };
  },

  async getPayout(id: string): Promise<Payout | null> {
    await delay(200);
    return mockPayouts.find(p => p.id === id) || null;
  },

  async createPayout(data: CreatePayoutRequest): Promise<Payout> {
    await delay(400);
    const fees = (data.fees || []).map((f, i) => ({ ...f, id: `fee-${Date.now()}-${i}` }));
    const commissions = (data.commissions || []).map((c, i) => ({ ...c, id: `comm-${Date.now()}-${i}` }));
    const taxes = (data.taxes || []).map((t, i) => ({ ...t, id: `tax-${Date.now()}-${i}` }));
    
    const totalFees = fees.reduce((sum, f) => sum + f.amount, 0);
    const totalCommissions = commissions.reduce((sum, c) => sum + c.amount, 0);
    const totalTaxes = taxes.reduce((sum, t) => sum + t.amount, 0);
    const netAmount = data.grossAmount - totalFees - totalCommissions - totalTaxes;
    
    const newPayout: Payout = {
      ...data,
      id: `payout-${Date.now()}`,
      fees,
      commissions,
      taxes,
      totalFees,
      totalCommissions,
      totalTaxes,
      netAmount,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockPayouts.push(newPayout);
    return newPayout;
  },

  async updatePayout(id: string, data: UpdatePayoutRequest): Promise<Payout | null> {
    await delay(300);
    const index = mockPayouts.findIndex(p => p.id === id);
    if (index === -1) return null;
    mockPayouts[index] = { ...mockPayouts[index], ...data, updatedAt: new Date().toISOString() };
    return mockPayouts[index];
  },

  async deletePayout(id: string): Promise<boolean> {
    await delay(300);
    const index = mockPayouts.findIndex(p => p.id === id);
    if (index === -1) return false;
    mockPayouts.splice(index, 1);
    return true;
  },

  async getStats(storeId?: string): Promise<PayoutStats> {
    await delay(200);
    const payouts = storeId ? mockPayouts.filter(p => p.storeId === storeId) : mockPayouts;
    const completed = payouts.filter(p => p.status === 'completed');
    
    return {
      totalPayouts: payouts.length,
      pendingPayouts: payouts.filter(p => p.status === 'pending').length,
      completedPayouts: completed.length,
      totalPaidAmount: completed.reduce((sum, p) => sum + p.netAmount, 0),
      totalFees: payouts.reduce((sum, p) => sum + p.totalFees, 0),
      totalCommissions: payouts.reduce((sum, p) => sum + p.totalCommissions, 0),
      averagePayoutAmount: completed.length > 0 
        ? completed.reduce((sum, p) => sum + p.netAmount, 0) / completed.length 
        : 0,
    };
  },
};
