// Bookings Mock Service
import type {
  Reservation,
  Event,
  ReservationFilters,
  EventFilters,
  CreateReservationRequest,
  UpdateReservationRequest,
  CreateEventRequest,
  UpdateEventRequest,
  BookingStats,
} from "@/types/bookings";

// Mock data
const mockReservations: Reservation[] = [
  {
    id: "res-001",
    storeId: "store-1",
    customerId: "cust-001",
    customerName: "Adebayo Johnson",
    customerPhone: "+234 801 234 5678",
    customerEmail: "adebayo@email.com",
    partySize: 4,
    date: "2024-01-20",
    time: "19:00",
    duration: 120,
    tableNumber: "T5",
    status: "confirmed",
    notes: "Anniversary dinner",
    specialRequests: "Window seat preferred",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "res-002",
    storeId: "store-1",
    customerName: "Funke Adeyemi",
    customerPhone: "+234 802 345 6789",
    partySize: 2,
    date: "2024-01-20",
    time: "20:00",
    duration: 90,
    tableNumber: "T3",
    status: "pending",
    createdAt: "2024-01-16T14:00:00Z",
    updatedAt: "2024-01-16T14:00:00Z",
  },
  {
    id: "res-003",
    storeId: "store-1",
    customerName: "Chidi Okonkwo",
    customerPhone: "+234 803 456 7890",
    partySize: 6,
    date: "2024-01-21",
    time: "18:30",
    duration: 150,
    status: "confirmed",
    specialRequests: "High chair needed",
    createdAt: "2024-01-17T09:00:00Z",
    updatedAt: "2024-01-17T09:00:00Z",
  },
];

const mockEvents: Event[] = [
  {
    id: "evt-001",
    storeId: "store-1",
    name: "Corporate Dinner - TechCorp",
    description: "Annual team dinner for TechCorp employees",
    type: "corporate",
    date: "2024-01-25",
    startTime: "18:00",
    endTime: "22:00",
    expectedGuests: 50,
    confirmedGuests: 45,
    status: "confirmed",
    contactName: "Sarah Okafor",
    contactPhone: "+234 801 111 2222",
    contactEmail: "sarah@techcorp.com",
    venueArea: "Main Hall",
    deposit: 100000,
    depositPaid: true,
    totalAmount: 500000,
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "evt-002",
    storeId: "store-1",
    name: "Birthday Party - Tunde",
    type: "birthday",
    date: "2024-01-28",
    startTime: "14:00",
    endTime: "18:00",
    expectedGuests: 30,
    status: "pending",
    contactName: "Tunde Bakare",
    contactPhone: "+234 802 222 3333",
    venueArea: "Private Dining",
    deposit: 50000,
    depositPaid: false,
    totalAmount: 200000,
    createdAt: "2024-01-12T10:00:00Z",
    updatedAt: "2024-01-12T10:00:00Z",
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const bookingService = {
  // Reservations
  async getReservations(filters?: ReservationFilters): Promise<{ data: Reservation[]; total: number }> {
    await delay(300);
    let result = [...mockReservations];
    
    if (filters?.storeId) {
      result = result.filter(r => r.storeId === filters.storeId);
    }
    if (filters?.status) {
      result = result.filter(r => r.status === filters.status);
    }
    if (filters?.date) {
      result = result.filter(r => r.date === filters.date);
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(r => 
        r.customerName.toLowerCase().includes(search) ||
        r.customerPhone.includes(search)
      );
    }
    
    const total = result.length;
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    result = result.slice((page - 1) * limit, page * limit);
    
    return { data: result, total };
  },

  async getReservation(id: string): Promise<Reservation | null> {
    await delay(200);
    return mockReservations.find(r => r.id === id) || null;
  },

  async createReservation(data: CreateReservationRequest): Promise<Reservation> {
    await delay(400);
    const newReservation: Reservation = {
      ...data,
      id: `res-${Date.now()}`,
      duration: data.duration || 90,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockReservations.push(newReservation);
    return newReservation;
  },

  async updateReservation(id: string, data: UpdateReservationRequest): Promise<Reservation | null> {
    await delay(300);
    const index = mockReservations.findIndex(r => r.id === id);
    if (index === -1) return null;
    
    mockReservations[index] = {
      ...mockReservations[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return mockReservations[index];
  },

  async deleteReservation(id: string): Promise<boolean> {
    await delay(300);
    const index = mockReservations.findIndex(r => r.id === id);
    if (index === -1) return false;
    mockReservations.splice(index, 1);
    return true;
  },

  // Events
  async getEvents(filters?: EventFilters): Promise<{ data: Event[]; total: number }> {
    await delay(300);
    let result = [...mockEvents];
    
    if (filters?.storeId) {
      result = result.filter(e => e.storeId === filters.storeId);
    }
    if (filters?.status) {
      result = result.filter(e => e.status === filters.status);
    }
    if (filters?.type) {
      result = result.filter(e => e.type === filters.type);
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(e => 
        e.name.toLowerCase().includes(search) ||
        e.contactName.toLowerCase().includes(search)
      );
    }
    
    const total = result.length;
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    result = result.slice((page - 1) * limit, page * limit);
    
    return { data: result, total };
  },

  async getEvent(id: string): Promise<Event | null> {
    await delay(200);
    return mockEvents.find(e => e.id === id) || null;
  },

  async createEvent(data: CreateEventRequest): Promise<Event> {
    await delay(400);
    const newEvent: Event = {
      ...data,
      id: `evt-${Date.now()}`,
      status: "inquiry",
      depositPaid: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockEvents.push(newEvent);
    return newEvent;
  },

  async updateEvent(id: string, data: UpdateEventRequest): Promise<Event | null> {
    await delay(300);
    const index = mockEvents.findIndex(e => e.id === id);
    if (index === -1) return null;
    
    mockEvents[index] = {
      ...mockEvents[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return mockEvents[index];
  },

  async deleteEvent(id: string): Promise<boolean> {
    await delay(300);
    const index = mockEvents.findIndex(e => e.id === id);
    if (index === -1) return false;
    mockEvents.splice(index, 1);
    return true;
  },

  // Stats
  async getStats(storeId?: string): Promise<BookingStats> {
    await delay(200);
    const reservations = storeId 
      ? mockReservations.filter(r => r.storeId === storeId)
      : mockReservations;
    const events = storeId 
      ? mockEvents.filter(e => e.storeId === storeId)
      : mockEvents;
    
    const today = new Date().toISOString().split('T')[0];
    
    return {
      totalReservations: reservations.length,
      todayReservations: reservations.filter(r => r.date === today).length,
      upcomingReservations: reservations.filter(r => r.date >= today && r.status !== 'cancelled').length,
      totalEvents: events.length,
      upcomingEvents: events.filter(e => e.date >= today && e.status !== 'cancelled').length,
      cancelledReservations: reservations.filter(r => r.status === 'cancelled').length,
      noShowRate: 5.2,
    };
  },
};
