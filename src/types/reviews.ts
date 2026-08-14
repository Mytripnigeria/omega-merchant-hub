// Storefront order-review domain types.

export interface OrderReview {
  id: string;
  businessId: string;
  storeId: string;
  orderId: string;
  /** Human-facing number of the reviewed order (null if unavailable). */
  orderNumber: number | null;
  customerId: string;
  customerName: string;
  /** 1–5 stars. */
  rating: number;
  comment: string | null;
  /** Photos the customer attached to the review; null when none. */
  imageUrls: string[] | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrderReviewFilters {
  storeId?: string;
  rating?: number;
  isPublished?: boolean;
  page?: number;
  limit?: number;
}
