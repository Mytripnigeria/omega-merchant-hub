import { apiRequest } from "@/lib/api-client";
import type {
  Reservation,
  ReservationFilters,
  CreateReservationRequest,
  UpdateReservationRequest,
  ReservationStats,
  Event,
  EventFilters,
  CreateEventRequest,
  UpdateEventRequest,
  EventStats,
  BookingStats,
  CalendarFeed,
} from "@/types/bookings";

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

function buildQs(params?: Record<string, unknown>): string {
  if (!params) return "";
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") q.set(k, String(v));
  }
  const s = q.toString();
  return s ? `?${s}` : "";
}

export const reservationsApi = {
  list(filters?: ReservationFilters) {
    return apiRequest<PaginatedResponse<Reservation>>(
      `/reservations${buildQs(filters)}`,
    );
  },
  get(id: string) {
    return apiRequest<Reservation>(`/reservations/${id}`);
  },
  stats(storeId?: string) {
    return apiRequest<ReservationStats>(
      `/reservations/stats${storeId ? `?storeId=${storeId}` : ""}`,
    );
  },
  create(data: CreateReservationRequest) {
    return apiRequest<Reservation>(`/reservations`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  update(id: string, data: UpdateReservationRequest) {
    return apiRequest<Reservation>(`/reservations/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },
  remove(id: string) {
    return apiRequest<void>(`/reservations/${id}`, { method: "DELETE" });
  },
  confirm(id: string) {
    return apiRequest<Reservation>(`/reservations/${id}/confirm`, { method: "POST" });
  },
  seat(id: string) {
    return apiRequest<Reservation>(`/reservations/${id}/seat`, { method: "POST" });
  },
  complete(id: string) {
    return apiRequest<Reservation>(`/reservations/${id}/complete`, { method: "POST" });
  },
  noShow(id: string) {
    return apiRequest<Reservation>(`/reservations/${id}/no-show`, { method: "POST" });
  },
  cancel(id: string, reason?: string) {
    return apiRequest<Reservation>(`/reservations/${id}/cancel`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    });
  },
};

export const eventsApi = {
  list(filters?: EventFilters) {
    return apiRequest<PaginatedResponse<Event>>(`/events${buildQs(filters)}`);
  },
  get(id: string) {
    return apiRequest<Event>(`/events/${id}`);
  },
  stats(storeId?: string) {
    return apiRequest<EventStats>(
      `/events/stats${storeId ? `?storeId=${storeId}` : ""}`,
    );
  },
  create(data: CreateEventRequest) {
    return apiRequest<Event>(`/events`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  update(id: string, data: UpdateEventRequest) {
    return apiRequest<Event>(`/events/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },
  remove(id: string) {
    return apiRequest<void>(`/events/${id}`, { method: "DELETE" });
  },
  confirm(id: string) {
    return apiRequest<Event>(`/events/${id}/confirm`, { method: "POST" });
  },
  start(id: string) {
    return apiRequest<Event>(`/events/${id}/start`, { method: "POST" });
  },
  complete(id: string) {
    return apiRequest<Event>(`/events/${id}/complete`, { method: "POST" });
  },
  cancel(id: string) {
    return apiRequest<Event>(`/events/${id}/cancel`, { method: "POST" });
  },
  recordPayment(id: string, payload: { amount: number; asDeposit?: boolean }) {
    return apiRequest<Event>(`/events/${id}/payments`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};

export const bookingsApi = {
  combinedStats(storeId?: string) {
    return apiRequest<BookingStats>(
      `/bookings/stats${storeId ? `?storeId=${storeId}` : ""}`,
    );
  },
  calendar(params: { dateFrom: string; dateTo: string; storeId?: string }) {
    return apiRequest<CalendarFeed>(`/bookings/calendar${buildQs(params)}`);
  },
};
