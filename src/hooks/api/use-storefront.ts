import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  storefrontConfigApi,
  storefrontStatsApi,
  storefrontThemesApi,
  storefrontPagesApi,
  storefrontBannersApi,
} from "@/services/api/storefront";
import type {
  CreateFeatureBannerRequest,
  CreateStorefrontPageRequest,
  CreateThemePresetRequest,
  FeatureBanner,
  FeatureBannerFilters,
  ReorderItem,
  StorefrontConfig,
  StorefrontPage,
  StorefrontPageFilters,
  UpdateFeatureBannerRequest,
  UpdateStorefrontConfigRequest,
  UpdateStorefrontPageRequest,
} from "@/types/storefront";

export const storefrontKeys = {
  all: ["storefront"] as const,
  config: () => [...storefrontKeys.all, "config"] as const,
  stats: () => [...storefrontKeys.all, "stats"] as const,
  themes: () => [...storefrontKeys.all, "themes"] as const,
  pages: () => [...storefrontKeys.all, "pages"] as const,
  pageList: (filters?: StorefrontPageFilters) =>
    [...storefrontKeys.pages(), "list", filters] as const,
  page: (id: string) => [...storefrontKeys.pages(), "detail", id] as const,
  banners: () => [...storefrontKeys.all, "banners"] as const,
  bannerList: (filters?: FeatureBannerFilters) =>
    [...storefrontKeys.banners(), "list", filters] as const,
  banner: (id: string) => [...storefrontKeys.banners(), "detail", id] as const,
};

// Aliased to keep existing import surface compatible
export const featureBannerKeys = {
  all: storefrontKeys.banners(),
  lists: () => [...storefrontKeys.banners(), "list"] as const,
  list: (filters?: FeatureBannerFilters) =>
    storefrontKeys.bannerList(filters),
  details: () => [...storefrontKeys.banners(), "detail"] as const,
  detail: (id: string) => storefrontKeys.banner(id),
};

// ─── Config ───────────────────────────────────────────────────────────

export function useStorefrontConfig() {
  return useQuery({
    queryKey: storefrontKeys.config(),
    queryFn: () => storefrontConfigApi.get(),
  });
}

export function useUpdateStorefrontConfig() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateStorefrontConfigRequest) =>
      storefrontConfigApi.update(data),
    onSuccess: (updated: StorefrontConfig) => {
      // Merge into the cache so a partial PATCH echo doesn't drop other fields.
      qc.setQueryData<StorefrontConfig>(storefrontKeys.config(), (old) =>
        old ? { ...old, ...updated } : updated,
      );
      qc.invalidateQueries({ queryKey: storefrontKeys.config() });
    },
  });
}

export function useStorefrontStats() {
  return useQuery({
    queryKey: storefrontKeys.stats(),
    queryFn: () => storefrontStatsApi.get(),
  });
}

// ─── Themes ───────────────────────────────────────────────────────────

export function useStorefrontThemes() {
  return useQuery({
    queryKey: storefrontKeys.themes(),
    queryFn: () => storefrontThemesApi.list(),
  });
}

export function useCreateStorefrontTheme() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateThemePresetRequest) =>
      storefrontThemesApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: storefrontKeys.themes() }),
  });
}

export function useDeleteStorefrontTheme() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => storefrontThemesApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: storefrontKeys.themes() });
      qc.invalidateQueries({ queryKey: storefrontKeys.config() });
    },
  });
}

// ─── Pages ────────────────────────────────────────────────────────────

export function useStorefrontPages(filters?: StorefrontPageFilters) {
  return useQuery({
    queryKey: storefrontKeys.pageList(filters),
    queryFn: () => storefrontPagesApi.list(filters),
  });
}

export function useStorefrontPage(id: string) {
  return useQuery({
    queryKey: storefrontKeys.page(id),
    queryFn: () => storefrontPagesApi.get(id),
    enabled: !!id,
  });
}

function invalidatePages(qc: ReturnType<typeof useQueryClient>) {
  qc.invalidateQueries({ queryKey: storefrontKeys.pages() });
  qc.invalidateQueries({ queryKey: storefrontKeys.stats() });
}

export function useCreateStorefrontPage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateStorefrontPageRequest) =>
      storefrontPagesApi.create(data),
    onSuccess: () => invalidatePages(qc),
  });
}

export function useUpdateStorefrontPage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateStorefrontPageRequest;
    }) => storefrontPagesApi.update(id, data),
    onSuccess: (updated: StorefrontPage) => {
      qc.setQueryData(storefrontKeys.page(updated.id), updated);
      invalidatePages(qc);
    },
  });
}

export function useDeleteStorefrontPage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => storefrontPagesApi.remove(id),
    onSuccess: () => invalidatePages(qc),
  });
}

export function useReorderStorefrontPages() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (items: ReorderItem[]) => storefrontPagesApi.reorder(items),
    onSuccess: () => invalidatePages(qc),
  });
}

// ─── Banners ──────────────────────────────────────────────────────────

export function useFeatureBanners(filters?: FeatureBannerFilters) {
  return useQuery({
    queryKey: storefrontKeys.bannerList(filters),
    queryFn: () => storefrontBannersApi.list(filters),
  });
}

export function useFeatureBanner(id: string) {
  return useQuery({
    queryKey: storefrontKeys.banner(id),
    queryFn: () => storefrontBannersApi.get(id),
    enabled: !!id,
  });
}

function invalidateBanners(qc: ReturnType<typeof useQueryClient>) {
  qc.invalidateQueries({ queryKey: storefrontKeys.banners() });
  qc.invalidateQueries({ queryKey: storefrontKeys.stats() });
}

export function useCreateFeatureBanner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateFeatureBannerRequest) =>
      storefrontBannersApi.create(data),
    onSuccess: () => invalidateBanners(qc),
  });
}

export function useUpdateFeatureBanner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateFeatureBannerRequest;
    }) => storefrontBannersApi.update(id, data),
    onSuccess: (updated: FeatureBanner) => {
      qc.setQueryData(storefrontKeys.banner(updated.id), updated);
      invalidateBanners(qc);
    },
  });
}

export function useDeleteFeatureBanner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => storefrontBannersApi.remove(id),
    onSuccess: () => invalidateBanners(qc),
  });
}

export function useReorderFeatureBanners() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (items: ReorderItem[]) => storefrontBannersApi.reorder(items),
    onSuccess: () => invalidateBanners(qc),
  });
}
