import { apiRequest } from "@/lib/api-client";

export type StoreLinkStatus = "pending" | "approved" | "declined" | "revoked";

export interface StoreLink {
  id: string;
  requesterStoreId: string;
  requesterStoreName: string | null;
  targetStoreId: string;
  targetStoreName: string | null;
  status: StoreLinkStatus;
  message: string | null;
  respondedAt: string | null;
  createdAt: string;
}

/**
 * Requests from another store's workstation asking to help run this
 * business's orders. Only orders are ever shared — menu, stock, staff and
 * reports stay here.
 */
export const storeLinksApi = {
  incoming() {
    return apiRequest<StoreLink[]>("/store-links/incoming");
  },
  respond(id: string, status: "approved" | "declined") {
    return apiRequest<StoreLink>(`/store-links/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },
  revoke(id: string) {
    return apiRequest<void>(`/store-links/${id}`, { method: "DELETE" });
  },
};
