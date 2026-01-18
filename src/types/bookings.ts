// Bookings Types

export interface Reservation {
  id: string;
  storeId: string;
  customerId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  partySize: number;
  date: string;
  time: string;
  duration: number; // in minutes
  tableNumber?: string;
  status: "pending" | "confirmed" | "seated" | "completed" | "cancelled" | "no-show";
  notes?: string;
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: string;
  storeId: string;
  name: string;
  description?: string;
  type: "private" | "corporate" | "wedding" | "birthday" | "holiday" | "other";
  date: string;
  startTime: string;
  endTime: string;
  expectedGuests: number;
  confirmedGuests?: number;
  status: "inquiry" | "pending" | "confirmed" | "in-progress" | "completed" | "cancelled";
  contactName: string;
  contactPhone: string;
  contactEmail?: string;
  venueArea?: string;
  deposit?: number;
  depositPaid: boolean;
  totalAmount?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Filters
export interface ReservationFilters {
  storeId?: string;
  status?: Reservation["status"];
  date?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface EventFilters {
  storeId?: string;
  status?: Event["status"];
  type?: Event["type"];
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

export interface UpdateReservationRequest {
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  partySize?: number;
  date?: string;
  time?: string;
  duration?: number;
  tableNumber?: string;
  status?: Reservation["status"];
  notes?: string;
  specialRequests?: string;
}

export interface CreateEventRequest {
  storeId: string;
  name: string;
  description?: string;
  type: Event["type"];
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

export interface UpdateEventRequest {
  name?: string;
  description?: string;
  type?: Event["type"];
  date?: string;
  startTime?: string;
  endTime?: string;
  expectedGuests?: number;
  confirmedGuests?: number;
  status?: Event["status"];
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  venueArea?: string;
  deposit?: number;
  depositPaid?: boolean;
  totalAmount?: number;
  notes?: string;
}

// Stats
export interface BookingStats {
  totalReservations: number;
  todayReservations: number;
  upcomingReservations: number;
  totalEvents: number;
  upcomingEvents: number;
  cancelledReservations: number;
  noShowRate: number;
}
