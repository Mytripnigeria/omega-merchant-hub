import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  suppliersApi,
  type Supplier,
  type SupplierStatus,
  type CreateSupplierRequest,
} from "@/services/api/suppliers";

export const supplierKeys = {
  all: ["suppliers"] as const,
  lists: () => [...supplierKeys.all, "list"] as const,
  list: (filters?: object) => [...supplierKeys.lists(), filters] as const,
  detail: (id: string) => [...supplierKeys.all, "detail", id] as const,
  ingredients: (id: string) =>
    [...supplierKeys.all, "ingredients", id] as const,
  stats: () => [...supplierKeys.all, "stats"] as const,
};

export function useSuppliers(filters?: {
  search?: string;
  status?: SupplierStatus;
  category?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: supplierKeys.list(filters),
    queryFn: () => suppliersApi.list(filters),
  });
}

export function useSupplier(id: string) {
  return useQuery({
    queryKey: supplierKeys.detail(id),
    queryFn: () => suppliersApi.get(id),
    enabled: !!id,
  });
}

export function useSupplierStats() {
  return useQuery({
    queryKey: supplierKeys.stats(),
    queryFn: () => suppliersApi.stats(),
  });
}

export function useSupplierIngredients(id: string) {
  return useQuery({
    queryKey: supplierKeys.ingredients(id),
    queryFn: () => suppliersApi.ingredients(id),
    enabled: !!id,
  });
}

export function useCreateSupplier() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSupplierRequest) => suppliersApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: supplierKeys.lists() });
      qc.invalidateQueries({ queryKey: supplierKeys.stats() });
    },
  });
}

export function useUpdateSupplier() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateSupplierRequest>;
    }) => suppliersApi.update(id, data),
    onSuccess: (updated: Supplier) => {
      qc.setQueryData(supplierKeys.detail(updated.id), updated);
      qc.invalidateQueries({ queryKey: supplierKeys.lists() });
    },
  });
}

export function useDeleteSupplier() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => suppliersApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: supplierKeys.lists() });
      qc.invalidateQueries({ queryKey: supplierKeys.stats() });
    },
  });
}
