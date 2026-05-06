import { useQuery } from "@tanstack/react-query";
import {
  reportsService,
  type ReportsRange,
  type SalesReportFilter,
  type TopProductsFilter,
} from "@/services/api/reports";

export const reportsKeys = {
  all: ["reports"] as const,
  sales: (filter?: SalesReportFilter) => [...reportsKeys.all, "sales", filter] as const,
  staff: (filter?: ReportsRange) => [...reportsKeys.all, "staff", filter] as const,
  kitchen: (filter?: ReportsRange) => [...reportsKeys.all, "kitchen", filter] as const,
  delivery: (filter?: ReportsRange) => [...reportsKeys.all, "delivery", filter] as const,
  dashboard: (storeId?: string) => [...reportsKeys.all, "dashboard", storeId] as const,
  topProducts: (filter?: TopProductsFilter) =>
    [...reportsKeys.all, "topProducts", filter] as const,
};

export function useSalesReport(filter: SalesReportFilter = {}) {
  return useQuery({
    queryKey: reportsKeys.sales(filter),
    queryFn: () => reportsService.sales(filter),
    staleTime: 60 * 1000,
  });
}

export function useStaffPerformance(filter: ReportsRange = {}) {
  return useQuery({
    queryKey: reportsKeys.staff(filter),
    queryFn: () => reportsService.staffPerformance(filter),
    staleTime: 60 * 1000,
  });
}

export function useKitchenStats(filter: ReportsRange = {}) {
  return useQuery({
    queryKey: reportsKeys.kitchen(filter),
    queryFn: () => reportsService.kitchen(filter),
    staleTime: 30 * 1000,
  });
}

export function useDeliveryStats(filter: ReportsRange = {}) {
  return useQuery({
    queryKey: reportsKeys.delivery(filter),
    queryFn: () => reportsService.delivery(filter),
    staleTime: 60 * 1000,
  });
}

export function useDashboardSummary(storeId?: string) {
  return useQuery({
    queryKey: reportsKeys.dashboard(storeId),
    queryFn: () => reportsService.dashboard(storeId),
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  });
}

export function useTopProducts(filter: TopProductsFilter = {}) {
  return useQuery({
    queryKey: reportsKeys.topProducts(filter),
    queryFn: () => reportsService.topProducts(filter),
    staleTime: 60 * 1000,
  });
}
