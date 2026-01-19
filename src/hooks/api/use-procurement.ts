// Procurement API Hooks
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { procurementService } from "@/services/mock/procurement";
import type {
  InventoryLocation,
  Inventory,
  Equipment,
  StockTransfer,
  InventoryLocationFilters,
  InventoryFilters,
  EquipmentFilters,
  StockTransferFilters,
  CreateInventoryLocationRequest,
  UpdateInventoryLocationRequest,
  CreateInventoryRequest,
  UpdateInventoryRequest,
  CreateEquipmentRequest,
  UpdateEquipmentRequest,
  CreateStockTransferRequest,
  UpdateStockTransferRequest,
} from "@/types/procurement";

// ============= Inventory Locations =============

export const locationKeys = {
  all: ["inventoryLocations"] as const,
  lists: () => [...locationKeys.all, "list"] as const,
  list: (filters?: InventoryLocationFilters) => [...locationKeys.lists(), filters] as const,
  details: () => [...locationKeys.all, "detail"] as const,
  detail: (id: string) => [...locationKeys.details(), id] as const,
};

export function useInventoryLocations(filters?: InventoryLocationFilters) {
  return useQuery({
    queryKey: locationKeys.list(filters),
    queryFn: () => procurementService.getLocations(filters),
  });
}

export function useInventoryLocation(id: string) {
  return useQuery({
    queryKey: locationKeys.detail(id),
    queryFn: () => procurementService.getLocation(id),
    enabled: !!id,
  });
}

export function useCreateInventoryLocation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateInventoryLocationRequest) => procurementService.createLocation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: locationKeys.lists() });
    },
  });
}

export function useUpdateInventoryLocation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateInventoryLocationRequest }) =>
      procurementService.updateLocation(id, data),
    onSuccess: (updatedLocation) => {
      if (updatedLocation) {
        queryClient.setQueryData(locationKeys.detail(updatedLocation.id), updatedLocation);
      }
      queryClient.invalidateQueries({ queryKey: locationKeys.lists() });
    },
  });
}

export function useDeleteInventoryLocation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => procurementService.deleteLocation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: locationKeys.lists() });
    },
  });
}

// ============= Inventories =============

export const inventoryKeys = {
  all: ["inventories"] as const,
  lists: () => [...inventoryKeys.all, "list"] as const,
  list: (filters?: InventoryFilters) => [...inventoryKeys.lists(), filters] as const,
  details: () => [...inventoryKeys.all, "detail"] as const,
  detail: (id: string) => [...inventoryKeys.details(), id] as const,
};

export function useInventories(filters?: InventoryFilters) {
  return useQuery({
    queryKey: inventoryKeys.list(filters),
    queryFn: () => procurementService.getInventory(filters),
  });
}

export function useInventory(id: string) {
  return useQuery({
    queryKey: inventoryKeys.detail(id),
    queryFn: () => procurementService.getInventoryItem(id),
    enabled: !!id,
  });
}

export function useCreateInventory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateInventoryRequest) => procurementService.createInventoryItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.lists() });
    },
  });
}

export function useUpdateInventory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateInventoryRequest }) =>
      procurementService.updateInventoryItem(id, data),
    onSuccess: (updatedItem) => {
      if (updatedItem) {
        queryClient.setQueryData(inventoryKeys.detail(updatedItem.id), updatedItem);
      }
      queryClient.invalidateQueries({ queryKey: inventoryKeys.lists() });
    },
  });
}

export function useDeleteInventory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => procurementService.deleteInventoryItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.lists() });
    },
  });
}

// ============= Equipment =============

export const equipmentKeys = {
  all: ["equipment"] as const,
  lists: () => [...equipmentKeys.all, "list"] as const,
  list: (filters?: EquipmentFilters) => [...equipmentKeys.lists(), filters] as const,
  details: () => [...equipmentKeys.all, "detail"] as const,
  detail: (id: string) => [...equipmentKeys.details(), id] as const,
};

export function useEquipmentList(filters?: EquipmentFilters) {
  return useQuery({
    queryKey: equipmentKeys.list(filters),
    queryFn: () => procurementService.getEquipment(filters),
  });
}

export function useEquipment(id: string) {
  return useQuery({
    queryKey: equipmentKeys.detail(id),
    queryFn: () => procurementService.getEquipmentItem(id),
    enabled: !!id,
  });
}

export function useCreateEquipment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateEquipmentRequest) => procurementService.createEquipment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: equipmentKeys.lists() });
    },
  });
}

export function useUpdateEquipment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEquipmentRequest }) =>
      procurementService.updateEquipment(id, data),
    onSuccess: (updatedEquipment) => {
      if (updatedEquipment) {
        queryClient.setQueryData(equipmentKeys.detail(updatedEquipment.id), updatedEquipment);
      }
      queryClient.invalidateQueries({ queryKey: equipmentKeys.lists() });
    },
  });
}

export function useDeleteEquipment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => procurementService.deleteEquipment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: equipmentKeys.lists() });
    },
  });
}

// ============= Stock Transfers =============

export const stockTransferKeys = {
  all: ["stockTransfers"] as const,
  lists: () => [...stockTransferKeys.all, "list"] as const,
  list: (filters?: StockTransferFilters) => [...stockTransferKeys.lists(), filters] as const,
  details: () => [...stockTransferKeys.all, "detail"] as const,
  detail: (id: string) => [...stockTransferKeys.details(), id] as const,
};

export function useStockTransfers(filters?: StockTransferFilters) {
  return useQuery({
    queryKey: stockTransferKeys.list(filters),
    queryFn: () => procurementService.getStockTransfers(filters),
  });
}

export function useStockTransfer(id: string) {
  return useQuery({
    queryKey: stockTransferKeys.detail(id),
    queryFn: () => procurementService.getStockTransfer(id),
    enabled: !!id,
  });
}

export function useCreateStockTransfer() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateStockTransferRequest) => procurementService.createStockTransfer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: stockTransferKeys.lists() });
    },
  });
}

export function useUpdateStockTransfer() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStockTransferRequest }) =>
      procurementService.updateStockTransfer(id, data),
    onSuccess: (updatedTransfer) => {
      if (updatedTransfer) {
        queryClient.setQueryData(stockTransferKeys.detail(updatedTransfer.id), updatedTransfer);
      }
      queryClient.invalidateQueries({ queryKey: stockTransferKeys.lists() });
    },
  });
}

export function useDeleteStockTransfer() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => procurementService.deleteStockTransfer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: stockTransferKeys.lists() });
    },
  });
}

// ============= Procurement Stats =============

export const procurementStatsKeys = {
  all: ["procurementStats"] as const,
  detail: (storeId?: string) => [...procurementStatsKeys.all, storeId] as const,
};

export function useProcurementStats(storeId?: string) {
  return useQuery({
    queryKey: procurementStatsKeys.detail(storeId),
    queryFn: () => procurementService.getStats(storeId),
  });
}
