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
  name?: string;
  unit: string;
  quantity: number;
  ingredient?: {
    id: string;
    name: string;
    unit: string;
  };
}

export interface ProductAddonGroupSummary {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  productCode?: string;
  category?: string;
  categoryId?: string;
  price: number;
  sellingPrice: number;
  sku?: string;
  stock: number;
  status: boolean;
  supplierId?: string;
  supplier?: string;
  prepTime?: string | number;
  taxOption?: string;
  discountOption?: string;
  visibility?: ProductVisibility[];
  productIngredients?: ProductIngredient[];
  ingredients?: ProductIngredient[];
  variations?: ProductVariation[];
  addonGroups?: ProductAddonGroupSummary[];
  addons?: string[];
  imageUrl?: string | null;
  imageFileId?: string | null;
  image?: string;
  storeId: string;
  createdAt?: string;
  updatedAt?: string;
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

export interface ComboItem {
  id: string;
  comboId: string;
  productId: string;
  quantity: number;
  product?: {
    id: string;
    name: string;
    price: number;
    sellingPrice: number;
    imageUrl?: string;
  };
}

export interface Combo {
  id: string;
  name: string;
  description?: string;
  price: number;
  originalPrice: number;
  items: ComboItem[];
  imageUrl?: string;
  isActive: boolean;
  sales: number;
  storeId: string;
  createdAt?: string;
  updatedAt?: string;
}

// API Request/Response Types
export interface CreateProductRequest {
  name: string;
  description?: string;
  productCode?: string;
  categoryId?: string;
  price?: number;
  sellingPrice?: number;
  sku?: string;
  stock?: number;
  status?: boolean;
  supplierId?: string;
  prepTime?: string;
  taxOption?: string;
  discountOption?: string;
  visibility?: ProductVisibility[];
  imageUrl?: string | null;
  imageFileId?: string | null;
  ingredients?: { ingredientId: string; quantity: number; unit: string }[];
  variations?: { name: string; sku?: string; price?: number; sellingPrice?: number; stock?: number }[];
  addonGroupIds?: string[];
  storeId: string;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  productCode?: string;
  categoryId?: string;
  price?: number;
  sellingPrice?: number;
  sku?: string;
  stock?: number;
  status?: boolean;
  supplierId?: string;
  prepTime?: string;
  taxOption?: string;
  discountOption?: string;
  visibility?: ProductVisibility[];
  imageUrl?: string | null;
  imageFileId?: string | null;
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
