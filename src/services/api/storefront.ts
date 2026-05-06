import { apiRequest } from "@/lib/api-client";
import type {
  StorefrontConfig,
  UpdateStorefrontConfigRequest,
  ThemePreset,
  CreateThemePresetRequest,
  StorefrontPage,
  CreateStorefrontPageRequest,
  UpdateStorefrontPageRequest,
  StorefrontPageFilters,
  FeatureBanner,
  CreateFeatureBannerRequest,
  UpdateFeatureBannerRequest,
  FeatureBannerFilters,
  ReorderItem,
  StorefrontStats,
} from "@/types/storefront";

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

function buildQs(params?: Record<string, unknown>): string {
  if (!params) return "";
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") q.set(k, String(v));
  }
  const s = q.toString();
  return s ? `?${s}` : "";
}

export const storefrontConfigApi = {
  get() {
    return apiRequest<StorefrontConfig>("/storefront/config");
  },
  update(data: UpdateStorefrontConfigRequest) {
    return apiRequest<StorefrontConfig>("/storefront/config", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },
};

export const storefrontStatsApi = {
  get() {
    return apiRequest<StorefrontStats>("/storefront/stats");
  },
};

export const storefrontThemesApi = {
  list() {
    return apiRequest<ThemePreset[]>("/storefront/themes");
  },
  create(data: CreateThemePresetRequest) {
    return apiRequest<ThemePreset>("/storefront/themes", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  remove(id: string) {
    return apiRequest<void>(`/storefront/themes/${id}`, { method: "DELETE" });
  },
};

export const storefrontPagesApi = {
  list(filters?: StorefrontPageFilters) {
    return apiRequest<PaginatedResponse<StorefrontPage>>(
      `/storefront/pages${buildQs(filters)}`,
    );
  },
  get(id: string) {
    return apiRequest<StorefrontPage>(`/storefront/pages/${id}`);
  },
  create(data: CreateStorefrontPageRequest) {
    return apiRequest<StorefrontPage>("/storefront/pages", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  update(id: string, data: UpdateStorefrontPageRequest) {
    return apiRequest<StorefrontPage>(`/storefront/pages/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },
  remove(id: string) {
    return apiRequest<void>(`/storefront/pages/${id}`, { method: "DELETE" });
  },
  reorder(items: ReorderItem[]) {
    return apiRequest<void>("/storefront/pages/reorder", {
      method: "PATCH",
      body: JSON.stringify({ items }),
    });
  },
};

export const storefrontBannersApi = {
  list(filters?: FeatureBannerFilters) {
    return apiRequest<PaginatedResponse<FeatureBanner>>(
      `/storefront/banners${buildQs(filters)}`,
    );
  },
  get(id: string) {
    return apiRequest<FeatureBanner>(`/storefront/banners/${id}`);
  },
  create(data: CreateFeatureBannerRequest) {
    return apiRequest<FeatureBanner>("/storefront/banners", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  update(id: string, data: UpdateFeatureBannerRequest) {
    return apiRequest<FeatureBanner>(`/storefront/banners/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },
  remove(id: string) {
    return apiRequest<void>(`/storefront/banners/${id}`, { method: "DELETE" });
  },
  reorder(items: ReorderItem[]) {
    return apiRequest<void>("/storefront/banners/reorder", {
      method: "PATCH",
      body: JSON.stringify({ items }),
    });
  },
};
