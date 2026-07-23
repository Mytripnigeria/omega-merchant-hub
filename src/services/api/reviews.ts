import { apiRequest } from "@/lib/api-client";
import type { OrderReview, OrderReviewFilters } from "@/types/reviews";

export interface PaginatedReviews {
  data: OrderReview[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

function buildQuery(filters: OrderReviewFilters = {}): string {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(filters)) {
    if (v !== undefined && v !== null && v !== "") qs.set(k, String(v));
  }
  return qs.toString();
}

export const reviewsService = {
  list: (filters: OrderReviewFilters = {}): Promise<PaginatedReviews> => {
    const qs = buildQuery(filters);
    return apiRequest<PaginatedReviews>(`/reviews${qs ? `?${qs}` : ""}`);
  },

  moderate: (id: string, payload: { isPublished?: boolean }): Promise<OrderReview> =>
    apiRequest<OrderReview>(`/reviews/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
};
