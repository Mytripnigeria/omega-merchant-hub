import type { 
  FeatureBanner, 
  CreateFeatureBannerRequest, 
  UpdateFeatureBannerRequest, 
  FeatureBannerFilters 
} from '@/types/storefront';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

let mockBanners: FeatureBanner[] = [
  {
    id: 'banner-1',
    title: 'Weekend Special Offers',
    description: 'Enjoy 20% off on all main courses this weekend. Limited time only!',
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
    theme: 'dark',
    actionText: 'View Menu',
    actionUrl: '/menu',
    isActive: true,
    position: 1,
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-01-15T14:30:00Z',
  },
  {
    id: 'banner-2',
    title: 'New Seasonal Dishes',
    description: 'Discover our new seasonal menu featuring fresh, locally-sourced ingredients.',
    imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
    theme: 'light',
    actionText: 'Explore Now',
    actionUrl: '/seasonal',
    isActive: true,
    position: 2,
    createdAt: '2026-01-08T09:00:00Z',
    updatedAt: '2026-01-12T16:00:00Z',
  },
  {
    id: 'banner-3',
    title: 'Book Your Table',
    description: 'Reserve your spot for a memorable dining experience with friends and family.',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
    theme: 'dark',
    actionText: 'Reserve Now',
    actionUrl: '/reservations',
    isActive: false,
    position: 3,
    createdAt: '2026-01-05T11:00:00Z',
    updatedAt: '2026-01-05T11:00:00Z',
  },
  {
    id: 'banner-4',
    title: 'Loyalty Rewards Program',
    description: 'Join our loyalty program and earn points with every order. Exclusive perks await!',
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
    theme: 'light',
    actionText: 'Join Now',
    actionUrl: '/loyalty',
    isActive: true,
    position: 4,
    createdAt: '2026-01-01T08:00:00Z',
    updatedAt: '2026-01-10T12:00:00Z',
  },
];

export const storefrontService = {
  // Feature Banners
  async getFeatureBanners(filters?: FeatureBannerFilters): Promise<{ data: FeatureBanner[]; total: number }> {
    await delay(500);
    
    let filtered = [...mockBanners];
    
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(b => 
        b.title.toLowerCase().includes(search) || 
        b.description.toLowerCase().includes(search)
      );
    }
    
    if (filters?.isActive !== undefined) {
      filtered = filtered.filter(b => b.isActive === filters.isActive);
    }
    
    // Sort by position
    filtered.sort((a, b) => a.position - b.position);
    
    return { data: filtered, total: filtered.length };
  },

  async getFeatureBanner(id: string): Promise<FeatureBanner | null> {
    await delay(300);
    return mockBanners.find(b => b.id === id) || null;
  },

  async createFeatureBanner(data: CreateFeatureBannerRequest): Promise<FeatureBanner> {
    await delay(500);
    
    const maxPosition = Math.max(...mockBanners.map(b => b.position), 0);
    
    const newBanner: FeatureBanner = {
      id: `banner-${Date.now()}`,
      title: data.title,
      description: data.description,
      imageUrl: data.imageUrl,
      theme: data.theme,
      actionText: data.actionText,
      actionUrl: data.actionUrl,
      isActive: data.isActive ?? true,
      position: data.position ?? maxPosition + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    mockBanners.push(newBanner);
    return newBanner;
  },

  async updateFeatureBanner(id: string, data: UpdateFeatureBannerRequest): Promise<FeatureBanner | null> {
    await delay(500);
    
    const index = mockBanners.findIndex(b => b.id === id);
    if (index === -1) return null;
    
    mockBanners[index] = {
      ...mockBanners[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    
    return mockBanners[index];
  },

  async deleteFeatureBanner(id: string): Promise<boolean> {
    await delay(300);
    
    const index = mockBanners.findIndex(b => b.id === id);
    if (index === -1) return false;
    
    mockBanners.splice(index, 1);
    
    // Reorder positions
    mockBanners.sort((a, b) => a.position - b.position);
    mockBanners.forEach((b, i) => {
      b.position = i + 1;
    });
    
    return true;
  },

  async reorderFeatureBanners(orderedIds: string[]): Promise<FeatureBanner[]> {
    await delay(300);
    
    orderedIds.forEach((id, index) => {
      const banner = mockBanners.find(b => b.id === id);
      if (banner) {
        banner.position = index + 1;
        banner.updatedAt = new Date().toISOString();
      }
    });
    
    mockBanners.sort((a, b) => a.position - b.position);
    return mockBanners;
  },
};
