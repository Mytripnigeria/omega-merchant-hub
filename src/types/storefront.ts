// Storefront types — aligned with backend storefront module

export type StoreStatus = "live" | "offline" | "maintenance";
export type MenuLayout = "grouped" | "grid" | "list";
export type PageStatus = "draft" | "published";
export type PageTemplate = "homepage" | "menu" | "standard" | "contact" | "faq";
export type BannerTheme = "light" | "dark";

export interface StorefrontConfig {
  businessId: string;

  storeName: string;
  tagline: string | null;
  logoUrl: string | null;
  faviconUrl: string | null;
  customDomain: string | null;
  storeStatus: StoreStatus;
  maintenanceMessage: string | null;

  activeThemeId: string | null;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  foregroundColor: string;
  fontFamily: string;

  onlineOrderingEnabled: boolean;
  reservationsEnabled: boolean;
  reviewsEnabled: boolean;
  walletEnabled: boolean;
  loyaltyEnabled: boolean;

  menuLayout: MenuLayout;
  menuShowImages: boolean;
  menuShowCalories: boolean;
  menuShowPrepTime: boolean;

  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string[];
  seoOgImageUrl: string | null;

  socialInstagram: string | null;
  socialFacebook: string | null;
  socialTwitter: string | null;
  socialTiktok: string | null;
  socialYoutube: string | null;
  socialWhatsapp: string | null;

  notifyOnNewOrder: boolean;
  notifyOnReservation: boolean;

  contactEmail: string | null;
  contactPhone: string | null;
  contactAddress: string | null;

  createdAt: string;
  updatedAt: string;
}

export type UpdateStorefrontConfigRequest = Partial<
  Omit<StorefrontConfig, "businessId" | "createdAt" | "updatedAt">
>;

export interface ThemePreset {
  id: string;
  businessId: string | null;
  name: string;
  description: string | null;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  foregroundColor: string;
  fontFamily: string;
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateThemePresetRequest {
  name: string;
  description?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  foregroundColor: string;
  fontFamily?: string;
}

export interface StorefrontPage {
  id: string;
  businessId: string;
  name: string;
  slug: string;
  template: PageTemplate;
  status: PageStatus;
  metaTitle: string | null;
  metaDescription: string | null;
  content: string | null;
  position: number;
  views: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStorefrontPageRequest {
  name: string;
  slug: string;
  template: PageTemplate;
  status?: PageStatus;
  metaTitle?: string;
  metaDescription?: string;
  content?: string;
  position?: number;
}

export type UpdateStorefrontPageRequest = Partial<CreateStorefrontPageRequest>;

export interface StorefrontPageFilters {
  status?: PageStatus;
  template?: PageTemplate;
  search?: string;
  page?: number;
  limit?: number;
}

export interface FeatureBanner {
  id: string;
  businessId: string;
  title: string;
  description: string | null;
  imageUrl: string;
  theme: BannerTheme;
  actionText: string | null;
  actionUrl: string | null;
  isActive: boolean;
  position: number;
  startsAt: string | null;
  endsAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFeatureBannerRequest {
  title: string;
  description?: string;
  imageUrl: string;
  theme?: BannerTheme;
  actionText?: string;
  actionUrl?: string;
  isActive?: boolean;
  position?: number;
  startsAt?: string;
  endsAt?: string;
}

export type UpdateFeatureBannerRequest = Partial<CreateFeatureBannerRequest>;

export interface FeatureBannerFilters {
  search?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface ReorderItem {
  id: string;
  position: number;
}

export interface StorefrontStats {
  totalPages: number;
  publishedPages: number;
  draftPages: number;
  totalBanners: number;
  activeBanners: number;
  totalViews: number;
}
