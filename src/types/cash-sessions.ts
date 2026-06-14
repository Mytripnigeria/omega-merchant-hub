// CashSession types — aligned to backend cash-sessions module.

export type CashSessionStatus = "open" | "closed" | "reviewed";
export type ReconciliationStatus = "balanced" | "short" | "over";

export interface CashSession {
  id: string;
  businessId: string;
  storeId: string;
  staffId: string;
  staffName: string;
  counterName: string | null;
  staffsJoined: string[] | null;
  shiftId: string | null;
  status: CashSessionStatus;
  openedAt: string;
  closedAt: string | null;
  reviewedAt: string | null;
  openingFloat: number;
  expectedCash: number;
  expectedCard: number;
  expectedMobile: number;
  expectedTotal: number;
  actualCash: number;
  actualCard: number;
  actualMobile: number;
  actualTotal: number;
  difference: number;
  reconciliationStatus: ReconciliationStatus | null;
  reviewedById: string | null;
  reviewedByName: string | null;
  reviewNotes: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CashSessionFilters {
  storeId?: string;
  staffId?: string;
  status?: CashSessionStatus;
  reconciliationStatus?: ReconciliationStatus;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export interface CashSessionStats {
  openCount: number;
  closedCount: number;
  reviewedCount: number;
  balancedCount: number;
  shortCount: number;
  overCount: number;
  totalShortAmount: number;
  totalOverAmount: number;
}

export interface OpenCashSessionRequest {
  openingFloat: number;
  shiftId?: string;
  notes?: string;
}

export interface CloseCashSessionRequest {
  actualCash: number;
  actualCard: number;
  actualMobile: number;
  notes?: string;
}

export interface ReviewCashSessionRequest {
  reviewNotes?: string;
}
