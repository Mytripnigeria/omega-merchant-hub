import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  categoryApi,
  productApi,
  ingredientApi,
  variationGroupApi,
  addonGroupApi,
  comboApi,
} from '@/services/api/stock';
import { storageApi } from '@/services/api/storage';
import type { StoredFile } from '@/services/api/storage';

// ─── Query Key Registry ────────────────────────────────────────────────────

export const stockKeys = {
  categories: {
    all: ['categories'] as const,
    lists: () => [...stockKeys.categories.all, 'list'] as const,
    list: (p?: object) => [...stockKeys.categories.lists(), p] as const,
    detail: (id: string) => [...stockKeys.categories.all, 'detail', id] as const,
    stats: (storeId?: string) => [...stockKeys.categories.all, 'stats', storeId] as const,
  },
  products: {
    all: ['products'] as const,
    lists: () => [...stockKeys.products.all, 'list'] as const,
    list: (f?: object) => [...stockKeys.products.lists(), f] as const,
    detail: (id: string) => [...stockKeys.products.all, 'detail', id] as const,
    stats: (storeId?: string) => [...stockKeys.products.all, 'stats', storeId] as const,
  },
  ingredients: {
    all: ['ingredients'] as const,
    lists: () => [...stockKeys.ingredients.all, 'list'] as const,
    list: (p?: object) => [...stockKeys.ingredients.lists(), p] as const,
    detail: (id: string) => [...stockKeys.ingredients.all, 'detail', id] as const,
    stats: (storeId?: string) => [...stockKeys.ingredients.all, 'stats', storeId] as const,
  },
  variationGroups: {
    all: ['variation-groups'] as const,
    lists: () => [...stockKeys.variationGroups.all, 'list'] as const,
    list: (p?: object) => [...stockKeys.variationGroups.lists(), p] as const,
    detail: (id: string) => [...stockKeys.variationGroups.all, 'detail', id] as const,
    stats: (storeId?: string) => [...stockKeys.variationGroups.all, 'stats', storeId] as const,
  },
  addonGroups: {
    all: ['addon-groups'] as const,
    lists: () => [...stockKeys.addonGroups.all, 'list'] as const,
    list: (p?: object) => [...stockKeys.addonGroups.lists(), p] as const,
    detail: (id: string) => [...stockKeys.addonGroups.all, 'detail', id] as const,
    stats: (storeId?: string) => [...stockKeys.addonGroups.all, 'stats', storeId] as const,
  },
  combos: {
    all: ['combos'] as const,
    lists: () => [...stockKeys.combos.all, 'list'] as const,
    list: (p?: object) => [...stockKeys.combos.lists(), p] as const,
    detail: (id: string) => [...stockKeys.combos.all, 'detail', id] as const,
    stats: (storeId?: string) => [...stockKeys.combos.all, 'stats', storeId] as const,
  },
};

// ─── Categories ────────────────────────────────────────────────────────────

export function useCategories(params?: Record<string, string | number | boolean | undefined>) {
  return useQuery({
    queryKey: stockKeys.categories.list(params),
    queryFn: () => categoryApi.list(params),
  });
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: stockKeys.categories.detail(id),
    queryFn: () => categoryApi.get(id),
    enabled: !!id,
  });
}

export function useCategoryStats(_storeId?: string) {
  // Categories are business-scoped on the backend; storeId is accepted for
  // call-site compatibility but ignored.
  void _storeId;
  return useQuery({
    queryKey: stockKeys.categories.stats(),
    queryFn: () => categoryApi.stats(),
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: categoryApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: stockKeys.categories.lists() });
      qc.invalidateQueries({ queryKey: stockKeys.categories.stats() });
    },
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: object }) => categoryApi.update(id, data),
    onSuccess: (updated) => {
      if (updated && 'id' in updated) qc.setQueryData(stockKeys.categories.detail(updated.id), updated);
      qc.invalidateQueries({ queryKey: stockKeys.categories.lists() });
    },
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: categoryApi.remove,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: stockKeys.categories.all });
    },
  });
}

export function useReorderCategories() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (items: { id: string; order: number }[]) => categoryApi.reorder(items),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: stockKeys.categories.lists() });
    },
  });
}

// Products hooks live in `use-products.ts` (re-exported via the barrel) to avoid duplicate exports.

// ─── Ingredients ───────────────────────────────────────────────────────────

export function useIngredients(params?: Record<string, string | number | undefined>) {
  return useQuery({
    queryKey: stockKeys.ingredients.list(params),
    queryFn: () => ingredientApi.list(params),
  });
}

export function useIngredient(id: string) {
  return useQuery({
    queryKey: stockKeys.ingredients.detail(id),
    queryFn: () => ingredientApi.get(id),
    enabled: !!id,
  });
}

export function useIngredientStats(storeId?: string) {
  return useQuery({
    queryKey: stockKeys.ingredients.stats(storeId),
    queryFn: () => ingredientApi.stats(storeId),
  });
}

export function useCreateIngredient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ingredientApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: stockKeys.ingredients.all });
    },
  });
}

export function useUpdateIngredient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: object }) => ingredientApi.update(id, data),
    onSuccess: (updated) => {
      if (updated && 'id' in updated) qc.setQueryData(stockKeys.ingredients.detail(updated.id), updated);
      qc.invalidateQueries({ queryKey: stockKeys.ingredients.lists() });
    },
  });
}

export function useDeleteIngredient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ingredientApi.remove,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: stockKeys.ingredients.all });
    },
  });
}

export function useAdjustStock() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, adjustment, reason }: { id: string; adjustment: number; reason?: string }) =>
      ingredientApi.adjustStock(id, adjustment, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: stockKeys.ingredients.all });
    },
  });
}

// ─── Variation Groups ──────────────────────────────────────────────────────

export function useVariationGroups(params?: Record<string, string | number | undefined>) {
  return useQuery({
    queryKey: stockKeys.variationGroups.list(params),
    queryFn: () => variationGroupApi.list(params),
  });
}

export function useVariationGroup(id: string) {
  return useQuery({
    queryKey: stockKeys.variationGroups.detail(id),
    queryFn: () => variationGroupApi.get(id),
    enabled: !!id,
  });
}

export function useVariationGroupStats(_storeId?: string) {
  void _storeId;
  return useQuery({
    queryKey: stockKeys.variationGroups.stats(),
    queryFn: () => variationGroupApi.stats(),
  });
}

export function useCreateVariationGroup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: variationGroupApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: stockKeys.variationGroups.all });
    },
  });
}

export function useUpdateVariationGroup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: object }) => variationGroupApi.update(id, data),
    onSuccess: (updated) => {
      if (updated && 'id' in updated) qc.setQueryData(stockKeys.variationGroups.detail(updated.id), updated);
      qc.invalidateQueries({ queryKey: stockKeys.variationGroups.lists() });
    },
  });
}

export function useDeleteVariationGroup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: variationGroupApi.remove,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: stockKeys.variationGroups.all });
    },
  });
}

// ─── Add-on Groups ─────────────────────────────────────────────────────────

export function useAddonGroups(params?: Record<string, string | number | undefined>) {
  return useQuery({
    queryKey: stockKeys.addonGroups.list(params),
    queryFn: () => addonGroupApi.list(params),
  });
}

export function useAddonGroup(id: string) {
  return useQuery({
    queryKey: stockKeys.addonGroups.detail(id),
    queryFn: () => addonGroupApi.get(id),
    enabled: !!id,
  });
}

export function useAddonGroupStats(_storeId?: string) {
  void _storeId;
  return useQuery({
    queryKey: stockKeys.addonGroups.stats(),
    queryFn: () => addonGroupApi.stats(),
  });
}

export function useCreateAddonGroup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: addonGroupApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: stockKeys.addonGroups.all });
    },
  });
}

export function useUpdateAddonGroup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: object }) => addonGroupApi.update(id, data),
    onSuccess: (updated) => {
      if (updated && 'id' in updated) qc.setQueryData(stockKeys.addonGroups.detail(updated.id), updated);
      qc.invalidateQueries({ queryKey: stockKeys.addonGroups.lists() });
    },
  });
}

export function useDeleteAddonGroup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: addonGroupApi.remove,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: stockKeys.addonGroups.all });
    },
  });
}

export function useAddAddon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ groupId, data }: { groupId: string; data: { name: string; price?: number } }) =>
      addonGroupApi.addAddon(groupId, data),
    onSuccess: (_r, { groupId }) => {
      qc.invalidateQueries({ queryKey: stockKeys.addonGroups.detail(groupId) });
    },
  });
}

export function useUpdateAddon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ groupId, addonId, data }: { groupId: string; addonId: string; data: object }) =>
      addonGroupApi.updateAddon(groupId, addonId, data),
    onSuccess: (_r, { groupId }) => {
      qc.invalidateQueries({ queryKey: stockKeys.addonGroups.detail(groupId) });
    },
  });
}

export function useDeleteAddon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ groupId, addonId }: { groupId: string; addonId: string }) =>
      addonGroupApi.removeAddon(groupId, addonId),
    onSuccess: (_r, { groupId }) => {
      qc.invalidateQueries({ queryKey: stockKeys.addonGroups.detail(groupId) });
    },
  });
}

export function useToggleAddonAvailability() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ groupId, addonId }: { groupId: string; addonId: string }) =>
      addonGroupApi.toggleAddonAvailability(groupId, addonId),
    onSuccess: (_r, { groupId }) => {
      qc.invalidateQueries({ queryKey: stockKeys.addonGroups.detail(groupId) });
      qc.invalidateQueries({ queryKey: stockKeys.addonGroups.stats() });
    },
  });
}

// ─── Combos ────────────────────────────────────────────────────────────────

export function useCombos(params?: Record<string, string | number | boolean | undefined>) {
  return useQuery({
    queryKey: stockKeys.combos.list(params),
    queryFn: () => comboApi.list(params),
  });
}

export function useCombo(id: string) {
  return useQuery({
    queryKey: stockKeys.combos.detail(id),
    queryFn: () => comboApi.get(id),
    enabled: !!id,
  });
}

export function useComboStats(storeId?: string) {
  return useQuery({
    queryKey: stockKeys.combos.stats(storeId),
    queryFn: () => comboApi.stats(storeId),
  });
}

export function useCreateCombo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: comboApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: stockKeys.combos.all });
    },
  });
}

export function useUpdateCombo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: object }) => comboApi.update(id, data),
    onSuccess: (updated) => {
      if (updated && 'id' in updated) qc.setQueryData(stockKeys.combos.detail(updated.id), updated);
      qc.invalidateQueries({ queryKey: stockKeys.combos.lists() });
    },
  });
}

export function useDeleteCombo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: comboApi.remove,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: stockKeys.combos.all });
    },
  });
}

export function useToggleComboStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      comboApi.toggleStatus(id, isActive),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: stockKeys.combos.lists() });
      qc.invalidateQueries({ queryKey: stockKeys.combos.stats() });
    },
  });
}

export function useAddComboItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ comboId, data }: { comboId: string; data: { productId: string; quantity?: number } }) =>
      comboApi.addItem(comboId, data),
    onSuccess: (_r, { comboId }) => {
      qc.invalidateQueries({ queryKey: stockKeys.combos.detail(comboId) });
      qc.invalidateQueries({ queryKey: stockKeys.combos.lists() });
    },
  });
}

export function useUpdateComboItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ comboId, itemId, data }: { comboId: string; itemId: string; data: { quantity: number } }) =>
      comboApi.updateItem(comboId, itemId, data),
    onSuccess: (_r, { comboId }) => {
      qc.invalidateQueries({ queryKey: stockKeys.combos.detail(comboId) });
      qc.invalidateQueries({ queryKey: stockKeys.combos.lists() });
    },
  });
}

export function useDeleteComboItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ comboId, itemId }: { comboId: string; itemId: string }) =>
      comboApi.removeItem(comboId, itemId),
    onSuccess: (_r, { comboId }) => {
      qc.invalidateQueries({ queryKey: stockKeys.combos.detail(comboId) });
      qc.invalidateQueries({ queryKey: stockKeys.combos.lists() });
    },
  });
}

// ─── Storage ───────────────────────────────────────────────────────────────

export const storageKeys = {
  all: ['files'] as const,
  lists: () => [...storageKeys.all, 'list'] as const,
  list: (p?: object) => [...storageKeys.lists(), p] as const,
  detail: (id: string) => [...storageKeys.all, 'detail', id] as const,
};

export function useUploadImage() {
  return useMutation<StoredFile, Error, { file: File; folder?: string } | File>({
    mutationFn: (input) => {
      if (input instanceof File) return storageApi.upload(input);
      return storageApi.upload(input.file, input.folder);
    },
  });
}

export function useFiles(params?: { folder?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: storageKeys.list(params),
    queryFn: () => storageApi.list(params),
  });
}

export function useFile(id: string) {
  return useQuery({
    queryKey: storageKeys.detail(id),
    queryFn: () => storageApi.get(id),
    enabled: !!id,
  });
}

export function useDeleteFile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => storageApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: storageKeys.lists() });
    },
  });
}
