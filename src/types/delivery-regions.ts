// DeliveryRegion types — aligned to the backend delivery-regions module.

export interface DeliveryRegion {
  id: string;
  storeId: string;
  name: string;
  description: string | null;
  fee: number;
  minOrderAmount: number;
  estimatedMinutes: number | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface DeliveryRegionFilters {
  storeId?: string;
  isActive?: boolean;
}

export interface CreateDeliveryRegionRequest {
  storeId: string;
  name: string;
  description?: string;
  fee: number;
  minOrderAmount?: number;
  estimatedMinutes?: number;
  isActive?: boolean;
  sortOrder?: number;
}

export type UpdateDeliveryRegionRequest = Partial<
  Omit<CreateDeliveryRegionRequest, 'storeId'>
>;
