// Products API Hook — delegates to real API
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productApi, categoryApi } from "@/services/api/stock";
import type {
  Product,
  ProductFilters,
  CreateProductRequest,
  UpdateProductRequest,
  Category,
} from "@/types/products";

export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (filters?: ProductFilters) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  stats: (storeId?: string) => [...productKeys.all, "stats", storeId] as const,
  categories: (storeId?: string) => [...productKeys.all, "categories", storeId] as const,
};

export function useProducts(filters?: ProductFilters & { page?: number; limit?: number }) {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: async (): Promise<Product[]> => {
      const res = await productApi.list(
        filters as Record<string, string | number | boolean | undefined>,
      );
      // The backend may return either a paginated envelope or a bare array.
      // `useProducts` normalizes both to a plain Product[] for callers.
      if (Array.isArray(res)) return res as Product[];
      return (res as { data?: Product[] }).data ?? [];
    },
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productApi.get(id),
    enabled: !!id,
  });
}

export function useProductStats(storeId?: string) {
  return useQuery({
    queryKey: productKeys.stats(storeId),
    queryFn: () => productApi.stats(storeId),
  });
}

export function useCategories(storeId?: string) {
  return useQuery({
    queryKey: productKeys.categories(storeId),
    queryFn: async () => {
      const res = await categoryApi.list(storeId ? { storeId } : undefined);
      return res.data ?? res;
    },
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProductRequest) => productApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.stats() });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductRequest }) =>
      productApi.update(id, data),
    onSuccess: (updatedProduct) => {
      if (updatedProduct && 'id' in updatedProduct) {
        queryClient.setQueryData(productKeys.detail(updatedProduct.id), updatedProduct);
      }
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => productApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.stats() });
    },
  });
}

export function useToggleProductStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: boolean }) =>
      productApi.toggleStatus(id, status),
    onSuccess: (updatedProduct) => {
      if (updatedProduct && 'id' in updatedProduct) {
        queryClient.setQueryData(productKeys.detail(updatedProduct.id), updatedProduct);
      }
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.stats() });
    },
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Category, 'id' | 'productCount'>) =>
      categoryApi.create(data as Parameters<typeof categoryApi.create>[0]),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.categories() });
    },
  });
}

export function useAddProductVariation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, data }: { productId: string; data: object }) =>
      productApi.addVariation(productId, data),
    onSuccess: (_r, { productId }) => {
      queryClient.invalidateQueries({ queryKey: productKeys.detail(productId) });
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}

export function useUpdateProductVariation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, varId, data }: { productId: string; varId: string; data: object }) =>
      productApi.updateVariation(productId, varId, data),
    onSuccess: (_r, { productId }) => {
      queryClient.invalidateQueries({ queryKey: productKeys.detail(productId) });
    },
  });
}

export function useRemoveProductVariation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, varId }: { productId: string; varId: string }) =>
      productApi.removeVariation(productId, varId),
    onSuccess: (_r, { productId }) => {
      queryClient.invalidateQueries({ queryKey: productKeys.detail(productId) });
    },
  });
}

export function useLinkProductIngredient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, data }: { productId: string; data: { ingredientId: string; quantity: number; unit: string } }) =>
      productApi.linkIngredient(productId, data),
    onSuccess: (_r, { productId }) => {
      queryClient.invalidateQueries({ queryKey: productKeys.detail(productId) });
    },
  });
}

export function useUnlinkProductIngredient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, ingredientId }: { productId: string; ingredientId: string }) =>
      productApi.unlinkIngredient(productId, ingredientId),
    onSuccess: (_r, { productId }) => {
      queryClient.invalidateQueries({ queryKey: productKeys.detail(productId) });
    },
  });
}

export function useLinkProductAddonGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, groupId }: { productId: string; groupId: string }) =>
      productApi.linkAddonGroup(productId, groupId),
    onSuccess: (_r, { productId }) => {
      queryClient.invalidateQueries({ queryKey: productKeys.detail(productId) });
    },
  });
}

export function useUnlinkProductAddonGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, groupId }: { productId: string; groupId: string }) =>
      productApi.unlinkAddonGroup(productId, groupId),
    onSuccess: (_r, { productId }) => {
      queryClient.invalidateQueries({ queryKey: productKeys.detail(productId) });
    },
  });
}
