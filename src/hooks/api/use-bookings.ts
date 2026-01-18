// Bookings API Hooks
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bookingService } from "@/services/mock/bookings";
import type { ReservationFilters, EventFilters, CreateReservationRequest, UpdateReservationRequest, CreateEventRequest, UpdateEventRequest } from "@/types/bookings";

export const bookingKeys = {
  all: ["bookings"] as const,
  reservations: () => [...bookingKeys.all, "reservations"] as const,
  reservation: (id: string) => [...bookingKeys.reservations(), id] as const,
  events: () => [...bookingKeys.all, "events"] as const,
  event: (id: string) => [...bookingKeys.events(), id] as const,
  stats: (storeId?: string) => [...bookingKeys.all, "stats", storeId] as const,
};

export function useReservations(filters?: ReservationFilters) {
  return useQuery({ queryKey: [...bookingKeys.reservations(), filters], queryFn: () => bookingService.getReservations(filters) });
}
export function useReservation(id: string) {
  return useQuery({ queryKey: bookingKeys.reservation(id), queryFn: () => bookingService.getReservation(id), enabled: !!id });
}
export function useCreateReservation() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (data: CreateReservationRequest) => bookingService.createReservation(data), onSuccess: () => qc.invalidateQueries({ queryKey: bookingKeys.reservations() }) });
}
export function useUpdateReservation() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, data }: { id: string; data: UpdateReservationRequest }) => bookingService.updateReservation(id, data), onSuccess: () => qc.invalidateQueries({ queryKey: bookingKeys.reservations() }) });
}
export function useDeleteReservation() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: string) => bookingService.deleteReservation(id), onSuccess: () => qc.invalidateQueries({ queryKey: bookingKeys.reservations() }) });
}
export function useEvents(filters?: EventFilters) {
  return useQuery({ queryKey: [...bookingKeys.events(), filters], queryFn: () => bookingService.getEvents(filters) });
}
export function useEvent(id: string) {
  return useQuery({ queryKey: bookingKeys.event(id), queryFn: () => bookingService.getEvent(id), enabled: !!id });
}
export function useCreateEvent() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (data: CreateEventRequest) => bookingService.createEvent(data), onSuccess: () => qc.invalidateQueries({ queryKey: bookingKeys.events() }) });
}
export function useUpdateEvent() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, data }: { id: string; data: UpdateEventRequest }) => bookingService.updateEvent(id, data), onSuccess: () => qc.invalidateQueries({ queryKey: bookingKeys.events() }) });
}
export function useDeleteEvent() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: string) => bookingService.deleteEvent(id), onSuccess: () => qc.invalidateQueries({ queryKey: bookingKeys.events() }) });
}
export function useBookingStats(storeId?: string) {
  return useQuery({ queryKey: bookingKeys.stats(storeId), queryFn: () => bookingService.getStats(storeId) });
}
