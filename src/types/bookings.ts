// Bookings Types — aligned with backend bookings module

export type ReservationStatus =
  | "pending"
  | "confirmed"
  | "seated"
  | "completed"
  | "cancelled"
  | "no-show";

export type EventType =
  | "private"
  | "corporate"
  | "wedding"
  | "birthday"
  | "holiday"
  | "other";

export type EventStatus =
  | "inquiry"
  | "pending"
  | "confirmed"
  | "in-progress"
  | "completed"
  | "cancelled";

export interface Reservation {
  id: string;
  businessId: string;
  storeId: string;
  customerId: string | null;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  partySize: number;
  date: string;
  time: string;
  duration: number | null;
  tableNumber: string | null;
  status: ReservationStatus;
  notes: string | null;
  specialRequests: string | null;
  seatedAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
  cancellationReason: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: string;
  businessId: string;
  storeId: string;
  customerId: string | null;
  name: string;
  description: string | null;
  type: EventType;
  date: string;
  startTime: string;
  endTime: string;
  expectedGuests: number;
  confirmedGuests: number | null;
  status: EventStatus;
  contactName: string;
  contactPhone: string;
  contactEmail: string | null;
  venueArea: string | null;
  deposit: number | null;
  depositPaid: boolean;
  totalAmount: number | null;
  paidAmount: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

// Filters

export interface ReservationFilters {
  storeId?: string;
  status?: ReservationStatus;
  customerId?: string;
  date?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface EventFilters {
  storeId?: string;
  status?: EventStatus;
  type?: EventType;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// Request types

export interface CreateReservationRequest {
  storeId: string;
  customerId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  partySize: number;
  date: string;
  time: string;
  duration?: number;
  tableNumber?: string;
  notes?: string;
  specialRequests?: string;
}

export interface UpdateReservationRequest
  extends Partial<Omit<CreateReservationRequest, "storeId">> {
  status?: ReservationStatus;
}

export interface CreateEventRequest {
  storeId: string;
  customerId?: string;
  name: string;
  description?: string;
  type: EventType;
  date: string;
  startTime: string;
  endTime: string;
  expectedGuests: number;
  contactName: string;
  contactPhone: string;
  contactEmail?: string;
  venueArea?: string;
  deposit?: number;
  totalAmount?: number;
  notes?: string;
}

export interface UpdateEventRequest
  extends Partial<Omit<CreateEventRequest, "storeId">> {
  status?: EventStatus;
  confirmedGuests?: number;
  depositPaid?: boolean;
}

// Stats

export interface ReservationStats {
  totalReservations: number;
  todayReservations: number;
  upcomingReservations: number;
  cancelledReservations: number;
  noShowCount: number;
  noShowRate: number;
}

export interface EventStats {
  totalEvents: number;
  upcomingEvents: number;
  inProgressEvents: number;
  expectedRevenue: number;
  collectedRevenue: number;
}

export interface BookingStats extends ReservationStats, EventStats {}

export interface CalendarFeedItem {
  kind: "reservation" | "event";
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string | null;
  status: string;
  guests: number;
}

export interface CalendarFeed {
  reservations: Reservation[];
  events: Event[];
  feed: CalendarFeedItem[];
}
