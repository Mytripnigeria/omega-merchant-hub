// Orders API Hook
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService } from "@/services/mock/orders";
import type { 
  Order, 
  OrderFilters, 
  CreateOrderRequest, 
  UpdateOrderRequest 
} from "@/types/orders";

// Query keys
export const orderKeys = {
  all: ["orders"] as const,
  lists: () => [...orderKeys.all, "list"] as const,
  list: (filters?: OrderFilters) => [...orderKeys.lists(), filters] as const,
  details: () => [...orderKeys.all, "detail"] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
  stats: (storeId?: string) => [...orderKeys.all, "stats", storeId] as const,
};

// Get orders list
export function useOrders(filters?: OrderFilters) {
  return useQuery({
    queryKey: orderKeys.list(filters),
    queryFn: () => orderService.getOrders(filters),
  });
}

// Get single order
export function useOrder(id: string) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => orderService.getOrder(id),
    enabled: !!id,
  });
}

// Get order stats
export function useOrderStats(storeId?: string) {
  return useQuery({
    queryKey: orderKeys.stats(storeId),
    queryFn: () => orderService.getStats(storeId),
  });
}

// Create order mutation
export function useCreateOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateOrderRequest) => orderService.createOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: orderKeys.stats() });
    },
  });
}

// Update order mutation
export function useUpdateOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOrderRequest }) => 
      orderService.updateOrder(id, data),
    onSuccess: (updatedOrder) => {
      if (updatedOrder) {
        queryClient.setQueryData(orderKeys.detail(updatedOrder.id), updatedOrder);
      }
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: orderKeys.stats() });
    },
  });
}

// Delete order mutation
export function useDeleteOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => orderService.deleteOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: orderKeys.stats() });
    },
  });
}

// Update order status (convenience hook)
export function useUpdateOrderStatus() {
  const updateOrder = useUpdateOrder();
  
  return {
    ...updateOrder,
    mutate: (id: string, status: Order["status"]) => 
      updateOrder.mutate({ id, data: { status } }),
    mutateAsync: (id: string, status: Order["status"]) => 
      updateOrder.mutateAsync({ id, data: { status } }),
  };
}
