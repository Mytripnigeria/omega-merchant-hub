import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { reviewsService } from "@/services/api/reviews";
import type { OrderReviewFilters } from "@/types/reviews";

export const reviewKeys = {
  all: ["reviews"] as const,
  lists: () => [...reviewKeys.all, "list"] as const,
  list: (filters?: OrderReviewFilters) =>
    [...reviewKeys.lists(), filters] as const,
};

export function useReviews(filters?: OrderReviewFilters) {
  return useQuery({
    queryKey: reviewKeys.list(filters),
    queryFn: () => reviewsService.list(filters),
    staleTime: 10 * 1000,
  });
}

export function useModerateReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: { isPublished?: boolean };
    }) => reviewsService.moderate(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: reviewKeys.all }),
  });
}
