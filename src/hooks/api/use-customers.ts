// Customers API Hook
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { customerService } from "@/services/mock/customers";
import type { 
  Customer, 
  CustomerFilters, 
  CreateCustomerRequest, 
  UpdateCustomerRequest 
} from "@/types/customers";

// Query keys
export const customerKeys = {
  all: ["customers"] as const,
  lists: () => [...customerKeys.all, "list"] as const,
  list: (filters?: CustomerFilters) => [...customerKeys.lists(), filters] as const,
  details: () => [...customerKeys.all, "detail"] as const,
  detail: (id: string) => [...customerKeys.details(), id] as const,
  stats: () => [...customerKeys.all, "stats"] as const,
  wallet: (customerId: string) => [...customerKeys.all, "wallet", customerId] as const,
  points: (customerId: string) => [...customerKeys.all, "points", customerId] as const,
};

// Get customers list
export function useCustomers(filters?: CustomerFilters) {
  return useQuery({
    queryKey: customerKeys.list(filters),
    queryFn: () => customerService.getCustomers(filters),
  });
}

// Get single customer
export function useCustomer(id: string) {
  return useQuery({
    queryKey: customerKeys.detail(id),
    queryFn: () => customerService.getCustomer(id),
    enabled: !!id,
  });
}

// Get customer stats
export function useCustomerStats() {
  return useQuery({
    queryKey: customerKeys.stats(),
    queryFn: () => customerService.getStats(),
  });
}

// Get wallet transactions
export function useWalletTransactions(customerId: string) {
  return useQuery({
    queryKey: customerKeys.wallet(customerId),
    queryFn: () => customerService.getWalletTransactions(customerId),
    enabled: !!customerId,
  });
}

// Get points transactions
export function usePointsTransactions(customerId: string) {
  return useQuery({
    queryKey: customerKeys.points(customerId),
    queryFn: () => customerService.getPointsTransactions(customerId),
    enabled: !!customerId,
  });
}

// Create customer mutation
export function useCreateCustomer() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateCustomerRequest) => customerService.createCustomer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      queryClient.invalidateQueries({ queryKey: customerKeys.stats() });
    },
  });
}

// Update customer mutation
export function useUpdateCustomer() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCustomerRequest }) => 
      customerService.updateCustomer(id, data),
    onSuccess: (updatedCustomer) => {
      if (updatedCustomer) {
        queryClient.setQueryData(customerKeys.detail(updatedCustomer.id), updatedCustomer);
      }
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
    },
  });
}

// Delete customer mutation
export function useDeleteCustomer() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => customerService.deleteCustomer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      queryClient.invalidateQueries({ queryKey: customerKeys.stats() });
    },
  });
}

// Wallet credit mutation
export function useCreditWallet() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ customerId, amount, description }: { 
      customerId: string; 
      amount: number; 
      description: string 
    }) => customerService.creditWallet(customerId, amount, description),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.detail(variables.customerId) });
      queryClient.invalidateQueries({ queryKey: customerKeys.wallet(variables.customerId) });
    },
  });
}

// Wallet debit mutation
export function useDebitWallet() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ customerId, amount, description, reference }: { 
      customerId: string; 
      amount: number; 
      description: string;
      reference?: string;
    }) => customerService.debitWallet(customerId, amount, description, reference),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.detail(variables.customerId) });
      queryClient.invalidateQueries({ queryKey: customerKeys.wallet(variables.customerId) });
    },
  });
}

// Add points mutation
export function useAddPoints() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ customerId, points, description, orderId }: { 
      customerId: string; 
      points: number; 
      description: string;
      orderId?: string;
    }) => customerService.addPoints(customerId, points, description, orderId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.detail(variables.customerId) });
      queryClient.invalidateQueries({ queryKey: customerKeys.points(variables.customerId) });
    },
  });
}

// Redeem points mutation
export function useRedeemPoints() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ customerId, points, description }: { 
      customerId: string; 
      points: number; 
      description: string;
    }) => customerService.redeemPoints(customerId, points, description),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.detail(variables.customerId) });
      queryClient.invalidateQueries({ queryKey: customerKeys.points(variables.customerId) });
    },
  });
}
