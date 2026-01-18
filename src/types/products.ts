// Product Domain Types

export interface ProductVariation {
  id: string;
  name: string;
  sku: string;
  price: number;
  sellingPrice: number;
  stock?: number;
}

export interface ProductIngredient {
  id: string;
  ingredientId: string;
  name: string;
  unit: string;
  quantity: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  productCode: string;
  category: string;
  categoryId: string;
  price: number;
  sellingPrice: number;
  sku: string;
  stock: number;
  status: boolean;
  supplierId?: string;
  supplier?: string;
  prepTime: number;
  taxOption: string;
  discountOption: string;
  visibility: ProductVisibility[];
  ingredients: ProductIngredient[];
  variations: ProductVariation[];
  addons: string[];
  image?: string;
  storeId: string;
  createdAt: string;
  updatedAt: string;
}

export type ProductVisibility = "pos" | "storefront" | "ubereats" | "glovo" | "chowdeck";

export interface Category {
  id: string;
  name: string;
  emoji?: string;
  description?: string;
  productCount: number;
  isActive: boolean;
  storeId: string;
}

export interface AddOn {
  id: string;
  name: string;
  price: number;
  isAvailable: boolean;
  storeId: string;
}

export interface AddOnGroup {
  id: string;
  name: string;
  addOns: AddOn[];
  minSelection: number;
  maxSelection: number;
  storeId: string;
}

export interface Ingredient {
  id: string;
  name: string;
  unit: string;
  currentStock: number;
  minStock: number;
  costPerUnit: number;
  supplierId?: string;
  storeId: string;
}

export interface Combo {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  products: { productId: string; quantity: number }[];
  image?: string;
  isActive: boolean;
  storeId: string;
}

// API Request/Response Types
export interface CreateProductRequest {
  name: string;
  description: string;
  categoryId: string;
  price: number;
  sellingPrice: number;
  sku?: string;
  stock?: number;
  supplierId?: string;
  prepTime?: number;
  taxOption?: string;
  visibility?: ProductVisibility[];
  ingredients?: Omit<ProductIngredient, 'id'>[];
  variations?: Omit<ProductVariation, 'id'>[];
  addons?: string[];
  storeId: string;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  categoryId?: string;
  price?: number;
  sellingPrice?: number;
  stock?: number;
  status?: boolean;
  prepTime?: number;
  visibility?: ProductVisibility[];
  ingredients?: ProductIngredient[];
  variations?: ProductVariation[];
}

export interface ProductFilters {
  categoryId?: string;
  status?: boolean;
  visibility?: ProductVisibility;
  storeId?: string;
  search?: string;
  inStock?: boolean;
}

export interface ProductStats {
  total: number;
  active: number;
  outOfStock: number;
  categories: number;
}
