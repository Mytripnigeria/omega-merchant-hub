// Operations, Suppliers, Transactions API Hooks (Payouts live in use-payouts.ts)
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { operationsService } from "@/services/mock/operations";
import { checklistsApi } from "@/services/api/checklists";
import { kpiTargetsApi } from "@/services/api/kpi-targets";
import { supplierService } from "@/services/mock/suppliers";
import { transactionService } from "@/services/mock/transactions";
import type { ChecklistFilters, CreateChecklistRequest, UpdateChecklistRequest, ExpenseFilters, CreateExpenseRequest, UpdateExpenseRequest, WasteLogFilters, CreateWasteLogRequest, UpdateWasteLogRequest, KPITargetFilters, CreateKPITargetRequest, UpdateKPITargetRequest, SalesTargetFilters, CreateSalesTargetRequest, UpdateSalesTargetRequest } from "@/types/operations";
import type { SupplierFilters, CreateSupplierRequest, UpdateSupplierRequest, PurchaseOrderFilters, CreatePurchaseOrderRequest, UpdatePurchaseOrderRequest } from "@/types/suppliers";
import type { TransactionFilters, CreateTransactionRequest, UpdateTransactionRequest, AccountBalanceFilters, CreateAccountBalanceRequest, UpdateAccountBalanceRequest, CloseAccountBalanceRequest } from "@/types/transactions";

// Operations
export const operationsKeys = { all: ["operations"] as const, checklists: () => [...operationsKeys.all, "checklists"] as const, expenses: () => [...operationsKeys.all, "expenses"] as const, waste: () => [...operationsKeys.all, "waste"] as const, kpis: () => [...operationsKeys.all, "kpis"] as const, salesTargets: () => [...operationsKeys.all, "salesTargets"] as const, stats: (storeId?: string) => [...operationsKeys.all, "stats", storeId] as const };
export function useChecklists(filters?: ChecklistFilters) {
  return useQuery({
    queryKey: [...operationsKeys.checklists(), filters],
    queryFn: () => checklistsApi.list(filters),
  });
}
export function useCreateChecklist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateChecklistRequest) => checklistsApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: operationsKeys.checklists() }),
  });
}
export function useUpdateChecklist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateChecklistRequest }) =>
      checklistsApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: operationsKeys.checklists() }),
  });
}
export function useDeleteChecklist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => checklistsApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: operationsKeys.checklists() }),
  });
}
export function useToggleChecklistItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      itemId,
      isCompleted,
    }: {
      id: string;
      itemId: string;
      isCompleted: boolean;
    }) => checklistsApi.toggleItem(id, itemId, isCompleted),
    onSuccess: () => qc.invalidateQueries({ queryKey: operationsKeys.checklists() }),
  });
}
export function useChecklistPerformances(id: string | undefined, date?: string) {
  return useQuery({
    queryKey: [...operationsKeys.checklists(), "performances", id, date ?? "current"],
    queryFn: () => checklistsApi.performances(id!, date),
    enabled: !!id,
  });
}
export function useExpenses(filters?: ExpenseFilters) { return useQuery({ queryKey: [...operationsKeys.expenses(), filters], queryFn: () => operationsService.getExpenses(filters) }); }
export function useCreateExpense() { const qc = useQueryClient(); return useMutation({ mutationFn: (data: CreateExpenseRequest) => operationsService.createExpense(data), onSuccess: () => qc.invalidateQueries({ queryKey: operationsKeys.expenses() }) }); }
export function useUpdateExpense() { const qc = useQueryClient(); return useMutation({ mutationFn: ({ id, data }: { id: string; data: UpdateExpenseRequest }) => operationsService.updateExpense(id, data), onSuccess: () => qc.invalidateQueries({ queryKey: operationsKeys.expenses() }) }); }
export function useDeleteExpense() { const qc = useQueryClient(); return useMutation({ mutationFn: (id: string) => operationsService.deleteExpense(id), onSuccess: () => qc.invalidateQueries({ queryKey: operationsKeys.expenses() }) }); }
export function useWasteLogs(filters?: WasteLogFilters) { return useQuery({ queryKey: [...operationsKeys.waste(), filters], queryFn: () => operationsService.getWasteLogs(filters) }); }
export function useCreateWasteLog() { const qc = useQueryClient(); return useMutation({ mutationFn: (data: CreateWasteLogRequest) => operationsService.createWasteLog(data), onSuccess: () => qc.invalidateQueries({ queryKey: operationsKeys.waste() }) }); }
export function useUpdateWasteLog() { const qc = useQueryClient(); return useMutation({ mutationFn: ({ id, data }: { id: string; data: UpdateWasteLogRequest }) => operationsService.updateWasteLog(id, data), onSuccess: () => qc.invalidateQueries({ queryKey: operationsKeys.waste() }) }); }
export function useDeleteWasteLog() { const qc = useQueryClient(); return useMutation({ mutationFn: (id: string) => operationsService.deleteWasteLog(id), onSuccess: () => qc.invalidateQueries({ queryKey: operationsKeys.waste() }) }); }
export function useKPITargets(filters?: KPITargetFilters) {
  return useQuery({
    queryKey: [...operationsKeys.kpis(), filters],
    queryFn: () => kpiTargetsApi.list(filters),
  });
}
export function useCreateKPITarget() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateKPITargetRequest) => kpiTargetsApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: operationsKeys.kpis() }),
  });
}
export function useUpdateKPITarget() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateKPITargetRequest }) =>
      kpiTargetsApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: operationsKeys.kpis() }),
  });
}
export function useDeleteKPITarget() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => kpiTargetsApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: operationsKeys.kpis() }),
  });
}
export function useKpiPerformances(id: string | undefined) {
  return useQuery({
    queryKey: [...operationsKeys.kpis(), "performances", id],
    queryFn: () => kpiTargetsApi.listPerformances(id!),
    enabled: !!id,
  });
}
export function useRecordKpiPerformance() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { staffId: string; value: number; note?: string };
    }) => kpiTargetsApi.recordPerformance(id, data),
    onSuccess: (_res, vars) => {
      qc.invalidateQueries({ queryKey: operationsKeys.kpis() });
      qc.invalidateQueries({
        queryKey: [...operationsKeys.kpis(), "performances", vars.id],
      });
    },
  });
}
export function useSalesTargets(filters?: SalesTargetFilters) { return useQuery({ queryKey: [...operationsKeys.salesTargets(), filters], queryFn: () => operationsService.getSalesTargets(filters) }); }
export function useCreateSalesTarget() { const qc = useQueryClient(); return useMutation({ mutationFn: (data: CreateSalesTargetRequest) => operationsService.createSalesTarget(data), onSuccess: () => qc.invalidateQueries({ queryKey: operationsKeys.salesTargets() }) }); }
export function useUpdateSalesTarget() { const qc = useQueryClient(); return useMutation({ mutationFn: ({ id, data }: { id: string; data: UpdateSalesTargetRequest }) => operationsService.updateSalesTarget(id, data), onSuccess: () => qc.invalidateQueries({ queryKey: operationsKeys.salesTargets() }) }); }
export function useDeleteSalesTarget() { const qc = useQueryClient(); return useMutation({ mutationFn: (id: string) => operationsService.deleteSalesTarget(id), onSuccess: () => qc.invalidateQueries({ queryKey: operationsKeys.salesTargets() }) }); }
export function useOperationsStats(storeId?: string) { return useQuery({ queryKey: operationsKeys.stats(storeId), queryFn: () => operationsService.getStats(storeId) }); }

// Suppliers
export const supplierKeys = { all: ["suppliers"] as const, list: () => [...supplierKeys.all, "list"] as const, orders: () => [...supplierKeys.all, "orders"] as const, stats: (storeId?: string) => [...supplierKeys.all, "stats", storeId] as const };
export function useSuppliers(filters?: SupplierFilters) { return useQuery({ queryKey: [...supplierKeys.list(), filters], queryFn: () => supplierService.getSuppliers(filters) }); }
export function useSupplier(id: string) { return useQuery({ queryKey: [...supplierKeys.all, id], queryFn: () => supplierService.getSupplier(id), enabled: !!id }); }
export function useCreateSupplier() { const qc = useQueryClient(); return useMutation({ mutationFn: (data: CreateSupplierRequest) => supplierService.createSupplier(data), onSuccess: () => qc.invalidateQueries({ queryKey: supplierKeys.list() }) }); }
export function useUpdateSupplier() { const qc = useQueryClient(); return useMutation({ mutationFn: ({ id, data }: { id: string; data: UpdateSupplierRequest }) => supplierService.updateSupplier(id, data), onSuccess: () => qc.invalidateQueries({ queryKey: supplierKeys.list() }) }); }
export function useDeleteSupplier() { const qc = useQueryClient(); return useMutation({ mutationFn: (id: string) => supplierService.deleteSupplier(id), onSuccess: () => qc.invalidateQueries({ queryKey: supplierKeys.list() }) }); }
export function usePurchaseOrders(filters?: PurchaseOrderFilters) { return useQuery({ queryKey: [...supplierKeys.orders(), filters], queryFn: () => supplierService.getPurchaseOrders(filters) }); }
export function usePurchaseOrder(id: string) { return useQuery({ queryKey: [...supplierKeys.orders(), id], queryFn: () => supplierService.getPurchaseOrder(id), enabled: !!id }); }
export function useCreatePurchaseOrder() { const qc = useQueryClient(); return useMutation({ mutationFn: (data: CreatePurchaseOrderRequest) => supplierService.createPurchaseOrder(data), onSuccess: () => qc.invalidateQueries({ queryKey: supplierKeys.orders() }) }); }
export function useUpdatePurchaseOrder() { const qc = useQueryClient(); return useMutation({ mutationFn: ({ id, data }: { id: string; data: UpdatePurchaseOrderRequest }) => supplierService.updatePurchaseOrder(id, data), onSuccess: () => qc.invalidateQueries({ queryKey: supplierKeys.orders() }) }); }
export function useDeletePurchaseOrder() { const qc = useQueryClient(); return useMutation({ mutationFn: (id: string) => supplierService.deletePurchaseOrder(id), onSuccess: () => qc.invalidateQueries({ queryKey: supplierKeys.orders() }) }); }
export function useSupplierStats(storeId?: string) { return useQuery({ queryKey: supplierKeys.stats(storeId), queryFn: () => supplierService.getStats(storeId) }); }

// Transactions
export const transactionKeys = { all: ["transactions"] as const, list: () => [...transactionKeys.all, "list"] as const, balances: () => [...transactionKeys.all, "balances"] as const, stats: (storeId?: string) => [...transactionKeys.all, "stats", storeId] as const };
export function useTransactions(filters?: TransactionFilters) { return useQuery({ queryKey: [...transactionKeys.list(), filters], queryFn: () => transactionService.getTransactions(filters) }); }
export function useTransaction(id: string) { return useQuery({ queryKey: [...transactionKeys.all, id], queryFn: () => transactionService.getTransaction(id), enabled: !!id }); }
export function useCreateTransaction() { const qc = useQueryClient(); return useMutation({ mutationFn: (data: CreateTransactionRequest) => transactionService.createTransaction(data), onSuccess: () => qc.invalidateQueries({ queryKey: transactionKeys.list() }) }); }
export function useUpdateTransaction() { const qc = useQueryClient(); return useMutation({ mutationFn: ({ id, data }: { id: string; data: UpdateTransactionRequest }) => transactionService.updateTransaction(id, data), onSuccess: () => qc.invalidateQueries({ queryKey: transactionKeys.list() }) }); }
export function useAccountBalances(filters?: AccountBalanceFilters) { return useQuery({ queryKey: [...transactionKeys.balances(), filters], queryFn: () => transactionService.getAccountBalances(filters) }); }
export function useAccountBalance(id: string) { return useQuery({ queryKey: [...transactionKeys.balances(), id], queryFn: () => transactionService.getAccountBalance(id), enabled: !!id }); }
export function useTodayBalance(storeId: string) { return useQuery({ queryKey: [...transactionKeys.balances(), "today", storeId], queryFn: () => transactionService.getTodayBalance(storeId) }); }
export function useCreateAccountBalance() { const qc = useQueryClient(); return useMutation({ mutationFn: (data: CreateAccountBalanceRequest) => transactionService.createAccountBalance(data), onSuccess: () => qc.invalidateQueries({ queryKey: transactionKeys.balances() }) }); }
export function useUpdateAccountBalance() { const qc = useQueryClient(); return useMutation({ mutationFn: ({ id, data }: { id: string; data: UpdateAccountBalanceRequest }) => transactionService.updateAccountBalance(id, data), onSuccess: () => qc.invalidateQueries({ queryKey: transactionKeys.balances() }) }); }
export function useCloseAccountBalance() { const qc = useQueryClient(); return useMutation({ mutationFn: ({ id, data }: { id: string; data: CloseAccountBalanceRequest }) => transactionService.closeAccountBalance(id, data), onSuccess: () => qc.invalidateQueries({ queryKey: transactionKeys.balances() }) }); }
export function useTransactionStats(storeId?: string) { return useQuery({ queryKey: transactionKeys.stats(storeId), queryFn: () => transactionService.getStats(storeId) }); }
