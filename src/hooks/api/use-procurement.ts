// Procurement API Hooks — wired to the real backend
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  inventoryLocationsApi,
  stockTransfersApi,
  equipmentApi,
  type InventoryLocation,
  type CreateInventoryLocationRequest,
  type InventoryLocationType,
  type StockTransfer,
  type StockTransferStatus,
  type CreateStockTransferRequest,
  type Equipment,
  type EquipmentCategory,
  type EquipmentStatus,
  type CreateEquipmentRequest,
  type MaintenanceType,
} from "@/services/api/procurement";

// ─── Inventory Locations ───────────────────────────────────────────────

export const locationKeys = {
  all: ["inventoryLocations"] as const,
  lists: () => [...locationKeys.all, "list"] as const,
  list: (filters?: object) => [...locationKeys.lists(), filters] as const,
  detail: (id: string) => [...locationKeys.all, "detail", id] as const,
};

export function useInventoryLocations(filters?: {
  storeId?: string;
  type?: InventoryLocationType;
  search?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: locationKeys.list(filters),
    queryFn: () => inventoryLocationsApi.list(filters),
  });
}

export function useInventoryLocation(id: string) {
  return useQuery({
    queryKey: locationKeys.detail(id),
    queryFn: () => inventoryLocationsApi.get(id),
    enabled: !!id,
  });
}

export function useCreateInventoryLocation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateInventoryLocationRequest) =>
      inventoryLocationsApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: locationKeys.lists() }),
  });
}

export function useUpdateInventoryLocation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Omit<CreateInventoryLocationRequest, "storeId">>;
    }) => inventoryLocationsApi.update(id, data),
    onSuccess: (updated: InventoryLocation) => {
      qc.setQueryData(locationKeys.detail(updated.id), updated);
      qc.invalidateQueries({ queryKey: locationKeys.lists() });
    },
  });
}

export function useDeleteInventoryLocation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => inventoryLocationsApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: locationKeys.lists() }),
  });
}

// ─── Stock Transfers ───────────────────────────────────────────────────

export const stockTransferKeys = {
  all: ["stockTransfers"] as const,
  lists: () => [...stockTransferKeys.all, "list"] as const,
  list: (filters?: object) => [...stockTransferKeys.lists(), filters] as const,
  detail: (id: string) => [...stockTransferKeys.all, "detail", id] as const,
};

export function useStockTransfers(filters?: {
  storeId?: string;
  status?: StockTransferStatus;
  fromLocationId?: string;
  toLocationId?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: stockTransferKeys.list(filters),
    queryFn: () => stockTransfersApi.list(filters),
  });
}

export function useStockTransfer(id: string) {
  return useQuery({
    queryKey: stockTransferKeys.detail(id),
    queryFn: () => stockTransfersApi.get(id),
    enabled: !!id,
  });
}

export function useCreateStockTransfer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateStockTransferRequest) =>
      stockTransfersApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: stockTransferKeys.lists() }),
  });
}

export function useApproveStockTransfer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => stockTransfersApi.approve(id),
    onSuccess: (updated: StockTransfer) => {
      qc.setQueryData(stockTransferKeys.detail(updated.id), updated);
      qc.invalidateQueries({ queryKey: stockTransferKeys.lists() });
    },
  });
}

export function useReceiveStockTransfer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      items,
    }: {
      id: string;
      items: { itemId: string; receivedQuantity: number }[];
    }) => stockTransfersApi.receive(id, items),
    onSuccess: (updated: StockTransfer) => {
      qc.setQueryData(stockTransferKeys.detail(updated.id), updated);
      qc.invalidateQueries({ queryKey: stockTransferKeys.lists() });
    },
  });
}

export function useCancelStockTransfer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => stockTransfersApi.cancel(id),
    onSuccess: (updated: StockTransfer) => {
      qc.setQueryData(stockTransferKeys.detail(updated.id), updated);
      qc.invalidateQueries({ queryKey: stockTransferKeys.lists() });
    },
  });
}

export function useDeleteStockTransfer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => stockTransfersApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: stockTransferKeys.lists() }),
  });
}

// ─── Equipment ─────────────────────────────────────────────────────────

export const equipmentKeys = {
  all: ["equipment"] as const,
  lists: () => [...equipmentKeys.all, "list"] as const,
  list: (filters?: object) => [...equipmentKeys.lists(), filters] as const,
  detail: (id: string) => [...equipmentKeys.all, "detail", id] as const,
  maintenance: (id: string) =>
    [...equipmentKeys.all, "maintenance", id] as const,
};

export function useEquipmentList(filters?: {
  storeId?: string;
  locationId?: string;
  category?: EquipmentCategory;
  status?: EquipmentStatus;
  search?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: equipmentKeys.list(filters),
    queryFn: () => equipmentApi.list(filters),
  });
}

export function useEquipment(id: string) {
  return useQuery({
    queryKey: equipmentKeys.detail(id),
    queryFn: () => equipmentApi.get(id),
    enabled: !!id,
  });
}

export function useCreateEquipment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateEquipmentRequest) => equipmentApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: equipmentKeys.lists() }),
  });
}

export function useUpdateEquipment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Omit<CreateEquipmentRequest, "storeId">>;
    }) => equipmentApi.update(id, data),
    onSuccess: (updated: Equipment) => {
      qc.setQueryData(equipmentKeys.detail(updated.id), updated);
      qc.invalidateQueries({ queryKey: equipmentKeys.lists() });
    },
  });
}

export function useDeleteEquipment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => equipmentApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: equipmentKeys.lists() }),
  });
}

export function useMaintenanceLogs(equipmentId: string) {
  return useQuery({
    queryKey: equipmentKeys.maintenance(equipmentId),
    queryFn: () => equipmentApi.maintenanceLogs(equipmentId),
    enabled: !!equipmentId,
  });
}

export function useLogMaintenance() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      equipmentId,
      ...payload
    }: {
      equipmentId: string;
      type: MaintenanceType;
      performedOn: string;
      performedBy?: string;
      cost?: number;
      description: string;
    }) => equipmentApi.logMaintenance(equipmentId, payload),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({
        queryKey: equipmentKeys.maintenance(vars.equipmentId),
      });
      qc.invalidateQueries({ queryKey: equipmentKeys.detail(vars.equipmentId) });
      qc.invalidateQueries({ queryKey: equipmentKeys.lists() });
    },
  });
}
