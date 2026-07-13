import { apiRequest } from '@/lib/api-client';
import type {
  Product,
  ProductFilters,
  ProductStats,
  CreateProductRequest,
  UpdateProductRequest,
  Category,
  Ingredient,
  IngredientLocationStock,
  IngredientMovement,
  IngredientMovementType,
  AddOnGroup,
  Combo,
} from '@/types/products';

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── Categories ────────────────────────────────────────────────────────────
// Categories are business-scoped on the backend (not store-scoped).
// Sending `storeId` would be rejected by `forbidNonWhitelisted` validation.

export const categoryApi = {
  list(params?: Record<string, string | number | boolean | undefined>) {
    const qs = buildQs(stripStoreScope(params));
    return apiRequest<PaginatedResponse<Category>>(`/categories${qs}`);
  },

  get(id: string) {
    return apiRequest<Category>(`/categories/${id}`);
  },

  stats() {
    return apiRequest<{ total: number; active: number; inactive: number }>(
      `/categories/stats`,
    );
  },

  create(data: Partial<Category>) {
    const { storeId: _ignored, ...rest } = data as Partial<Category> & {
      storeId?: string;
    };
    void _ignored;
    return apiRequest<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify(rest),
    });
  },

  update(id: string, data: Partial<Category>) {
    return apiRequest<Category>(`/categories/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
  },

  remove(id: string) {
    return apiRequest<void>(`/categories/${id}`, { method: 'DELETE' });
  },

  reorder(items: { id: string; order: number }[]) {
    return apiRequest<void>('/categories/reorder', { method: 'PATCH', body: JSON.stringify({ items }) });
  },
};

// ─── Products ──────────────────────────────────────────────────────────────

export const productApi = {
  list(filters?: ProductFilters & { page?: number; limit?: number }) {
    const qs = buildQs(filters as Record<string, string | number | boolean | undefined>);
    return apiRequest<PaginatedResponse<Product>>(`/products${qs}`);
  },

  get(id: string) {
    return apiRequest<Product>(`/products/${id}`);
  },

  stats(storeId?: string) {
    return apiRequest<ProductStats>(`/products/stats${storeId ? `?storeId=${storeId}` : ''}`);
  },

  create(data: CreateProductRequest) {
    return apiRequest<Product>('/products', { method: 'POST', body: JSON.stringify(data) });
  },

  update(id: string, data: UpdateProductRequest) {
    return apiRequest<Product>(`/products/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
  },

  remove(id: string) {
    return apiRequest<void>(`/products/${id}`, { method: 'DELETE' });
  },

  toggleStatus(id: string, status: boolean) {
    return apiRequest<Product>(`/products/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
  },

  addVariation(productId: string, data: object) {
    return apiRequest(`/products/${productId}/variations`, { method: 'POST', body: JSON.stringify(data) });
  },

  updateVariation(productId: string, varId: string, data: object) {
    return apiRequest(`/products/${productId}/variations/${varId}`, { method: 'PATCH', body: JSON.stringify(data) });
  },

  removeVariation(productId: string, varId: string) {
    return apiRequest<void>(`/products/${productId}/variations/${varId}`, { method: 'DELETE' });
  },

  linkIngredient(productId: string, data: { ingredientId: string; quantity: number; unit: string }) {
    return apiRequest(`/products/${productId}/ingredients`, { method: 'POST', body: JSON.stringify(data) });
  },

  unlinkIngredient(productId: string, ingredientId: string) {
    return apiRequest<void>(`/products/${productId}/ingredients/${ingredientId}`, { method: 'DELETE' });
  },

  linkAddonGroup(productId: string, groupId: string) {
    return apiRequest(`/products/${productId}/addons`, { method: 'POST', body: JSON.stringify({ groupId }) });
  },

  unlinkAddonGroup(productId: string, groupId: string) {
    return apiRequest<void>(`/products/${productId}/addons/${groupId}`, { method: 'DELETE' });
  },
};

// ─── Ingredients ───────────────────────────────────────────────────────────

/** Initial per-location stock row accepted by the create endpoint. */
export interface IngredientLocationInput {
  locationId: string;
  currentStock?: number;
  minStock?: number;
  expiryDate?: string;
}

export type CreateIngredientInput = Partial<Omit<Ingredient, 'locations'>> & {
  storeId: string;
  locations?: IngredientLocationInput[];
};

export const ingredientApi = {
  list(params?: Record<string, string | number | undefined>) {
    const qs = buildQs(params);
    return apiRequest<PaginatedResponse<Ingredient>>(`/ingredients${qs}`);
  },

  get(id: string) {
    return apiRequest<Ingredient>(`/ingredients/${id}`);
  },

  stats(storeId?: string) {
    return apiRequest<{ total: number; lowStock: number; totalValue: number; supplierCount: number }>(
      `/ingredients/stats${storeId ? `?storeId=${storeId}` : ''}`,
    );
  },

  create(data: CreateIngredientInput) {
    return apiRequest<Ingredient>('/ingredients', { method: 'POST', body: JSON.stringify(data) });
  },

  update(id: string, data: Partial<Ingredient>) {
    return apiRequest<Ingredient>(`/ingredients/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
  },

  remove(id: string) {
    return apiRequest<void>(`/ingredients/${id}`, { method: 'DELETE' });
  },

  adjustStock(
    id: string,
    adjustment: number,
    reason?: string,
    expiryDate?: string,
    locationId?: string,
  ) {
    return apiRequest<Ingredient>(`/ingredients/${id}/adjust-stock`, {
      method: 'POST',
      body: JSON.stringify({ adjustment, reason, expiryDate, locationId }),
    });
  },

  /** Lists ingredients whose best-before is within `days` (default 14). */
  expiring(params: { storeId?: string; days?: number } = {}) {
    const qs = buildQs(params as Record<string, string | number | boolean | undefined>);
    return apiRequest<Ingredient[]>(`/ingredients/expiring${qs}`);
  },

  listLocationStocks(id: string) {
    return apiRequest<IngredientLocationStock[]>(`/ingredients/${id}/locations`);
  },

  setLocationStock(
    id: string,
    locationId: string,
    data: { currentStock?: number; minStock?: number; expiryDate?: string | null },
  ) {
    return apiRequest<IngredientLocationStock>(`/ingredients/${id}/locations/${locationId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  removeLocationStock(id: string, locationId: string) {
    return apiRequest<void>(`/ingredients/${id}/locations/${locationId}`, { method: 'DELETE' });
  },

  /** Paginated movement history (intake, consumption, waste, transfer, correction). */
  listMovements(
    id: string,
    params?: {
      type?: IngredientMovementType;
      dateFrom?: string;
      dateTo?: string;
      page?: number;
      limit?: number;
    },
  ) {
    const qs = buildQs(params as Record<string, string | number | boolean | undefined>);
    return apiRequest<PaginatedResponse<IngredientMovement>>(
      `/ingredients/${id}/movements${qs}`,
    );
  },
};

// ─── Add-on Groups ─────────────────────────────────────────────────────────

export const addonGroupApi = {
  list(params?: Record<string, string | number | undefined>) {
    // Addon groups are business-scoped — drop any storeId callers pass.
    const qs = buildQs(stripStoreScope(params));
    return apiRequest<PaginatedResponse<AddOnGroup>>(`/addon-groups${qs}`);
  },

  get(id: string) {
    return apiRequest<AddOnGroup>(`/addon-groups/${id}`);
  },

  stats() {
    return apiRequest<{ totalGroups: number; totalAddons: number; availableAddons: number }>(
      `/addon-groups/stats`,
    );
  },

  create(data: Record<string, unknown>) {
    const { storeId: _ignored, ...rest } = data;
    void _ignored;
    return apiRequest<AddOnGroup>('/addon-groups', {
      method: 'POST',
      body: JSON.stringify(rest),
    });
  },

  update(id: string, data: object) {
    return apiRequest<AddOnGroup>(`/addon-groups/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
  },

  remove(id: string) {
    return apiRequest<void>(`/addon-groups/${id}`, { method: 'DELETE' });
  },

  addAddon(groupId: string, data: { name: string; price?: number; isAvailable?: boolean }) {
    return apiRequest(`/addon-groups/${groupId}/addons`, { method: 'POST', body: JSON.stringify(data) });
  },

  updateAddon(groupId: string, addonId: string, data: object) {
    return apiRequest(`/addon-groups/${groupId}/addons/${addonId}`, { method: 'PATCH', body: JSON.stringify(data) });
  },

  removeAddon(groupId: string, addonId: string) {
    return apiRequest<void>(`/addon-groups/${groupId}/addons/${addonId}`, { method: 'DELETE' });
  },

  toggleAddonAvailability(groupId: string, addonId: string) {
    return apiRequest(`/addon-groups/${groupId}/addons/${addonId}/availability`, { method: 'PATCH' });
  },
};

// ─── Combos ────────────────────────────────────────────────────────────────

export const comboApi = {
  list(params?: Record<string, string | number | boolean | undefined>) {
    const qs = buildQs(params);
    return apiRequest<PaginatedResponse<Combo>>(`/combos${qs}`);
  },

  get(id: string) {
    return apiRequest<Combo>(`/combos/${id}`);
  },

  stats(storeId?: string) {
    return apiRequest<{ total: number; active: number; totalSales: number; revenue: number }>(
      `/combos/stats${storeId ? `?storeId=${storeId}` : ''}`,
    );
  },

  create(data: {
    name: string;
    description?: string;
    price?: number;
    originalPrice?: number;
    isActive?: boolean;
    imageUrl?: string;
    storeId: string;
    products?: { productId: string; quantity?: number }[];
  }) {
    return apiRequest<Combo>('/combos', { method: 'POST', body: JSON.stringify(data) });
  },

  update(id: string, data: Partial<Combo>) {
    return apiRequest<Combo>(`/combos/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
  },

  remove(id: string) {
    return apiRequest<void>(`/combos/${id}`, { method: 'DELETE' });
  },

  toggleStatus(id: string, isActive: boolean) {
    return apiRequest<Combo>(`/combos/${id}/status`, { method: 'PATCH', body: JSON.stringify({ isActive }) });
  },

  addItem(comboId: string, data: { productId: string; quantity?: number }) {
    return apiRequest(`/combos/${comboId}/items`, { method: 'POST', body: JSON.stringify(data) });
  },

  updateItem(comboId: string, itemId: string, data: { quantity: number }) {
    return apiRequest(`/combos/${comboId}/items/${itemId}`, { method: 'PATCH', body: JSON.stringify(data) });
  },

  removeItem(comboId: string, itemId: string) {
    return apiRequest<void>(`/combos/${comboId}/items/${itemId}`, { method: 'DELETE' });
  },
};

// ─── Helpers ───────────────────────────────────────────────────────────────

function buildQs(params?: Record<string, string | number | boolean | undefined>): string {
  if (!params) return '';
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== '');
  if (!entries.length) return '';
  return '?' + entries.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`).join('&');
}

/**
 * Drops `storeId` from a query/body. Used by entities that are business-scoped
 * on the backend (categories, variation-groups, addon-groups) — passing
 * `storeId` would trigger `property storeId should not exist` from
 * class-validator's whitelist.
 */
function stripStoreScope<T extends Record<string, unknown> | undefined>(
  params: T,
): T {
  if (!params) return params;
  const { storeId: _ignored, ...rest } = params as Record<string, unknown>;
  void _ignored;
  return rest as T;
}
