// Products API Hook
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "@/services/mock/products";
import type { 
  Product, 
  ProductFilters, 
  CreateProductRequest, 
  UpdateProductRequest,
  Category 
} from "@/types/products";

// Query keys
export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (filters?: ProductFilters) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  stats: (storeId?: string) => [...productKeys.all, "stats", storeId] as const,
  categories: (storeId?: string) => [...productKeys.all, "categories", storeId] as const,
};

// Get products list
export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => productService.getProducts(filters),
  });
}

// Get single product
export function useProduct(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productService.getProduct(id),
    enabled: !!id,
  });
}

// Get product stats
export function useProductStats(storeId?: string) {
  return useQuery({
    queryKey: productKeys.stats(storeId),
    queryFn: () => productService.getStats(storeId),
  });
}

// Get categories
export function useCategories(storeId?: string) {
  return useQuery({
    queryKey: productKeys.categories(storeId),
    queryFn: () => productService.getCategories(storeId),
  });
}

// Create product mutation
export function useCreateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateProductRequest) => productService.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.stats() });
    },
  });
}

// Update product mutation
export function useUpdateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductRequest }) => 
      productService.updateProduct(id, data),
    onSuccess: (updatedProduct) => {
      if (updatedProduct) {
        queryClient.setQueryData(productKeys.detail(updatedProduct.id), updatedProduct);
      }
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}

// Delete product mutation
export function useDeleteProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => productService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.stats() });
    },
  });
}

// Toggle product status mutation
export function useToggleProductStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => productService.toggleStatus(id),
    onSuccess: (updatedProduct) => {
      if (updatedProduct) {
        queryClient.setQueryData(productKeys.detail(updatedProduct.id), updatedProduct);
      }
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.stats() });
    },
  });
}

// Create category mutation
export function useCreateCategory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Omit<Category, 'id' | 'productCount'>) => 
      productService.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.categories() });
    },
  });
}
