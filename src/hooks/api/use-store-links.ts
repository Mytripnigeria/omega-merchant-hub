import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { storeLinksApi } from "@/services/api/store-links";

const key = ["store-links", "incoming"] as const;

export function useIncomingStoreLinks() {
  return useQuery({ queryKey: key, queryFn: storeLinksApi.incoming });
}

export function useRespondStoreLink() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: "approved" | "declined";
    }) => storeLinksApi.respond(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });
}

export function useRevokeStoreLink() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => storeLinksApi.revoke(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });
}
