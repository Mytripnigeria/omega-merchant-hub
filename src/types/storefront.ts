// Feature Banner Types
export interface FeatureBanner {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  theme: 'light' | 'dark';
  actionText: string;
  actionUrl: string;
  isActive: boolean;
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFeatureBannerRequest {
  title: string;
  description: string;
  imageUrl: string;
  theme: 'light' | 'dark';
  actionText: string;
  actionUrl: string;
  isActive?: boolean;
  position?: number;
}

export interface UpdateFeatureBannerRequest {
  title?: string;
  description?: string;
  imageUrl?: string;
  theme?: 'light' | 'dark';
  actionText?: string;
  actionUrl?: string;
  isActive?: boolean;
  position?: number;
}

export interface FeatureBannerFilters {
  search?: string;
  isActive?: boolean;
}
