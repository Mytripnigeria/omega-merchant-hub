import { apiRequest } from "@/lib/api-client";

export interface SalesReportBucket {
  bucket: string;
  orders: number;
  items: number;
  revenue: number;
  byChannel: Record<string, number>;
}

export interface SalesReport {
  totalOrders: number;
  totalItems: number;
  totalRevenue: number;
  averageOrderValue: number;
  buckets: SalesReportBucket[];
  byChannel: Record<string, number>;
}

export interface StaffPerformanceRow {
  staffId: string;
  staffName: string;
  ordersProcessed: number;
  salesAttributed: number;
  hoursWorked: number;
}

export interface StaffPerformance {
  rows: StaffPerformanceRow[];
}

export interface KitchenStats {
  ordersServed: number;
  averagePrepMinutes: number;
  itemsPerHour: number;
  busiestHour: number | null;
  inflightCount: number;
}

export interface DeliveryStats {
  totalDeliveries: number;
  delivered: number;
  failed: number;
  successRate: number;
  averageDeliveryMinutes: number;
  byRider: Array<{
    riderStaffId: string;
    riderName: string | null;
    delivered: number;
    failed: number;
  }>;
}

export interface DashboardSummary {
  todayOrders: number;
  todayRevenue: number;
  yesterdayRevenue: number;
  openOrders: number;
  activeShifts: number;
  lowStockCount: number;
  pendingExpenses: number;
  deliveriesInTransit: number;
  newCustomersToday: number;
  totalCustomers: number;
  loyaltyMembers: number;
  openCashSessions: number;
}

export interface TopProductRow {
  productId: string;
  name: string;
  categoryId: string | null;
  unitsSold: number;
  ordersCount: number;
  revenue: number;
}

export interface TopProductsReport {
  rows: TopProductRow[];
}

export interface TopProductsFilter extends ReportsRange {
  limit?: number;
}

export interface ReportsRange {
  storeId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface SalesReportFilter extends ReportsRange {
  groupBy?: "day" | "week" | "month";
}

function buildQuery(filter: Record<string, unknown>): string {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(filter)) {
    if (v !== undefined && v !== null && v !== "") qs.set(k, String(v));
  }
  return qs.toString();
}

export const reportsService = {
  sales: (filter: SalesReportFilter = {}): Promise<SalesReport> => {
    const qs = buildQuery(filter as Record<string, unknown>);
    return apiRequest<SalesReport>(`/reports/sales${qs ? `?${qs}` : ""}`);
  },
  staffPerformance: (filter: ReportsRange = {}): Promise<StaffPerformance> => {
    const qs = buildQuery(filter as Record<string, unknown>);
    return apiRequest<StaffPerformance>(
      `/reports/staff-performance${qs ? `?${qs}` : ""}`,
    );
  },
  kitchen: (filter: ReportsRange = {}): Promise<KitchenStats> => {
    const qs = buildQuery(filter as Record<string, unknown>);
    return apiRequest<KitchenStats>(`/reports/kitchen${qs ? `?${qs}` : ""}`);
  },
  delivery: (filter: ReportsRange = {}): Promise<DeliveryStats> => {
    const qs = buildQuery(filter as Record<string, unknown>);
    return apiRequest<DeliveryStats>(`/reports/delivery${qs ? `?${qs}` : ""}`);
  },
  dashboard: (storeId?: string): Promise<DashboardSummary> => {
    const qs = storeId ? `?storeId=${encodeURIComponent(storeId)}` : "";
    return apiRequest<DashboardSummary>(`/reports/dashboard${qs}`);
  },
  topProducts: (filter: TopProductsFilter = {}): Promise<TopProductsReport> => {
    const qs = buildQuery(filter as Record<string, unknown>);
    return apiRequest<TopProductsReport>(
      `/reports/top-products${qs ? `?${qs}` : ""}`,
    );
  },
};
