import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { customersApi } from "@/services/api/customers";
import { ordersService } from "@/services/api/orders";
import type {
  Customer,
  CustomerFilters,
  CreateCustomerRequest,
  UpdateCustomerRequest,
} from "@/types/customers";

export const customerKeys = {
  all: ["customers"] as const,
  lists: () => [...customerKeys.all, "list"] as const,
  list: (filters?: CustomerFilters) => [...customerKeys.lists(), filters] as const,
  details: () => [...customerKeys.all, "detail"] as const,
  detail: (id: string) => [...customerKeys.details(), id] as const,
  stats: () => [...customerKeys.all, "stats"] as const,
  wallet: (id: string) => [...customerKeys.all, "wallet", id] as const,
  points: (id: string) => [...customerKeys.all, "points", id] as const,
  orders: (id: string) => [...customerKeys.all, "orders", id] as const,
};

export function useCustomers(filters?: CustomerFilters) {
  return useQuery({
    queryKey: customerKeys.list(filters),
    queryFn: () => customersApi.list(filters),
  });
}

export function useCustomer(id: string) {
  return useQuery({
    queryKey: customerKeys.detail(id),
    queryFn: () => customersApi.get(id),
    enabled: !!id,
  });
}

export function useCustomerStats() {
  return useQuery({
    queryKey: customerKeys.stats(),
    queryFn: () => customersApi.stats(),
  });
}

export function useCustomerOrders(customerId: string) {
  return useQuery({
    queryKey: customerKeys.orders(customerId),
    queryFn: () => ordersService.list({ customerId, limit: 50 }),
    enabled: !!customerId,
  });
}

export function useWalletTransactions(customerId: string) {
  return useQuery({
    queryKey: customerKeys.wallet(customerId),
    queryFn: () => customersApi.walletTxs(customerId),
    enabled: !!customerId,
  });
}

export function usePointsTransactions(customerId: string) {
  return useQuery({
    queryKey: customerKeys.points(customerId),
    queryFn: () => customersApi.pointsTxs(customerId),
    enabled: !!customerId,
  });
}

export function useCreateCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCustomerRequest) => customersApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: customerKeys.lists() });
      qc.invalidateQueries({ queryKey: customerKeys.stats() });
    },
  });
}

export function useUpdateCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCustomerRequest }) =>
      customersApi.update(id, data),
    onSuccess: (updated: Customer) => {
      qc.setQueryData(customerKeys.detail(updated.id), updated);
      qc.invalidateQueries({ queryKey: customerKeys.lists() });
    },
  });
}

export function useDeleteCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => customersApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: customerKeys.lists() });
      qc.invalidateQueries({ queryKey: customerKeys.stats() });
    },
  });
}

export function useCreditWallet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      customerId,
      ...payload
    }: {
      customerId: string;
      amount: number;
      description: string;
      reference?: string;
    }) => customersApi.creditWallet(customerId, payload),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: customerKeys.detail(vars.customerId) });
      qc.invalidateQueries({ queryKey: customerKeys.wallet(vars.customerId) });
    },
  });
}

export function useDebitWallet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      customerId,
      ...payload
    }: {
      customerId: string;
      amount: number;
      description: string;
      reference?: string;
    }) => customersApi.debitWallet(customerId, payload),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: customerKeys.detail(vars.customerId) });
      qc.invalidateQueries({ queryKey: customerKeys.wallet(vars.customerId) });
    },
  });
}

export function useAddPoints() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      customerId,
      ...payload
    }: {
      customerId: string;
      points: number;
      description: string;
      orderId?: string;
    }) => customersApi.addPoints(customerId, payload),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: customerKeys.detail(vars.customerId) });
      qc.invalidateQueries({ queryKey: customerKeys.points(vars.customerId) });
    },
  });
}

export function useRedeemPoints() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      customerId,
      ...payload
    }: {
      customerId: string;
      points: number;
      description: string;
    }) => customersApi.redeemPoints(customerId, payload),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: customerKeys.detail(vars.customerId) });
      qc.invalidateQueries({ queryKey: customerKeys.points(vars.customerId) });
    },
  });
}
