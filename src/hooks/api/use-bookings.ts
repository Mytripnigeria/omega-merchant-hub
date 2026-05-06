// Bookings API Hooks — wired to the real backend
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  bookingsApi,
  eventsApi,
  reservationsApi,
} from "@/services/api/bookings";
import type {
  CreateEventRequest,
  CreateReservationRequest,
  EventFilters,
  ReservationFilters,
  UpdateEventRequest,
  UpdateReservationRequest,
} from "@/types/bookings";

export const bookingKeys = {
  all: ["bookings"] as const,
  reservations: () => [...bookingKeys.all, "reservations"] as const,
  reservationList: (filters?: ReservationFilters) =>
    [...bookingKeys.reservations(), "list", filters] as const,
  reservation: (id: string) =>
    [...bookingKeys.reservations(), "detail", id] as const,
  reservationStats: (storeId?: string) =>
    [...bookingKeys.reservations(), "stats", storeId] as const,
  events: () => [...bookingKeys.all, "events"] as const,
  eventList: (filters?: EventFilters) =>
    [...bookingKeys.events(), "list", filters] as const,
  event: (id: string) => [...bookingKeys.events(), "detail", id] as const,
  eventStats: (storeId?: string) =>
    [...bookingKeys.events(), "stats", storeId] as const,
  combinedStats: (storeId?: string) =>
    [...bookingKeys.all, "stats", storeId] as const,
  calendar: (range: { dateFrom: string; dateTo: string; storeId?: string }) =>
    [...bookingKeys.all, "calendar", range] as const,
};

function invalidateReservations(qc: ReturnType<typeof useQueryClient>) {
  qc.invalidateQueries({ queryKey: bookingKeys.reservations() });
  qc.invalidateQueries({ queryKey: bookingKeys.all });
}

function invalidateEvents(qc: ReturnType<typeof useQueryClient>) {
  qc.invalidateQueries({ queryKey: bookingKeys.events() });
  qc.invalidateQueries({ queryKey: bookingKeys.all });
}

// ─── Reservations ──────────────────────────────────────────────────────

export function useReservations(filters?: ReservationFilters) {
  return useQuery({
    queryKey: bookingKeys.reservationList(filters),
    queryFn: () => reservationsApi.list(filters),
  });
}

export function useReservation(id: string) {
  return useQuery({
    queryKey: bookingKeys.reservation(id),
    queryFn: () => reservationsApi.get(id),
    enabled: !!id,
  });
}

export function useReservationStats(storeId?: string) {
  return useQuery({
    queryKey: bookingKeys.reservationStats(storeId),
    queryFn: () => reservationsApi.stats(storeId),
  });
}

export function useCreateReservation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateReservationRequest) => reservationsApi.create(data),
    onSuccess: () => invalidateReservations(qc),
  });
}

export function useUpdateReservation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateReservationRequest }) =>
      reservationsApi.update(id, data),
    onSuccess: () => invalidateReservations(qc),
  });
}

export function useDeleteReservation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => reservationsApi.remove(id),
    onSuccess: () => invalidateReservations(qc),
  });
}

export function useConfirmReservation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => reservationsApi.confirm(id),
    onSuccess: () => invalidateReservations(qc),
  });
}

export function useSeatReservation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => reservationsApi.seat(id),
    onSuccess: () => invalidateReservations(qc),
  });
}

export function useCompleteReservation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => reservationsApi.complete(id),
    onSuccess: () => invalidateReservations(qc),
  });
}

export function useNoShowReservation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => reservationsApi.noShow(id),
    onSuccess: () => invalidateReservations(qc),
  });
}

export function useCancelReservation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      reservationsApi.cancel(id, reason),
    onSuccess: () => invalidateReservations(qc),
  });
}

// ─── Events ────────────────────────────────────────────────────────────

export function useEvents(filters?: EventFilters) {
  return useQuery({
    queryKey: bookingKeys.eventList(filters),
    queryFn: () => eventsApi.list(filters),
  });
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: bookingKeys.event(id),
    queryFn: () => eventsApi.get(id),
    enabled: !!id,
  });
}

export function useEventStats(storeId?: string) {
  return useQuery({
    queryKey: bookingKeys.eventStats(storeId),
    queryFn: () => eventsApi.stats(storeId),
  });
}

export function useCreateEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateEventRequest) => eventsApi.create(data),
    onSuccess: () => invalidateEvents(qc),
  });
}

export function useUpdateEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEventRequest }) =>
      eventsApi.update(id, data),
    onSuccess: () => invalidateEvents(qc),
  });
}

export function useDeleteEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => eventsApi.remove(id),
    onSuccess: () => invalidateEvents(qc),
  });
}

export function useConfirmEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => eventsApi.confirm(id),
    onSuccess: () => invalidateEvents(qc),
  });
}

export function useStartEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => eventsApi.start(id),
    onSuccess: () => invalidateEvents(qc),
  });
}

export function useCompleteEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => eventsApi.complete(id),
    onSuccess: () => invalidateEvents(qc),
  });
}

export function useCancelEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => eventsApi.cancel(id),
    onSuccess: () => invalidateEvents(qc),
  });
}

export function useRecordEventPayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...payload
    }: {
      id: string;
      amount: number;
      asDeposit?: boolean;
    }) => eventsApi.recordPayment(id, payload),
    onSuccess: () => invalidateEvents(qc),
  });
}

// ─── Combined ──────────────────────────────────────────────────────────

export function useBookingStats(storeId?: string) {
  return useQuery({
    queryKey: bookingKeys.combinedStats(storeId),
    queryFn: () => bookingsApi.combinedStats(storeId),
  });
}

export function useBookingsCalendar(range: {
  dateFrom: string;
  dateTo: string;
  storeId?: string;
}) {
  return useQuery({
    queryKey: bookingKeys.calendar(range),
    queryFn: () => bookingsApi.calendar(range),
    enabled: !!range.dateFrom && !!range.dateTo,
  });
}
