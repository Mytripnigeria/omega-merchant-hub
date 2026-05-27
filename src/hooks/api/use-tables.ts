import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  tablesApi,
  type CreateTableRequest,
  type TableFilter,
  type TableStatus,
  type UpdateTableRequest,
} from "@/services/api/tables";

export const tableKeys = {
  all: ["tables"] as const,
  list: (filter?: TableFilter) => [...tableKeys.all, "list", filter] as const,
};

export function useTables(filter: TableFilter = {}) {
  return useQuery({
    queryKey: tableKeys.list(filter),
    queryFn: () => tablesApi.list(filter),
    enabled: !!filter.storeId,
    staleTime: 60 * 1000,
  });
}

export function useCreateTable() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTableRequest) => tablesApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: tableKeys.all }),
  });
}

export function useUpdateTable() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTableRequest }) =>
      tablesApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: tableKeys.all }),
  });
}

export function useUpdateTableStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: TableStatus }) =>
      tablesApi.updateStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: tableKeys.all }),
  });
}

export function useDeleteTable() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => tablesApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: tableKeys.all }),
  });
}
