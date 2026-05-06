import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Plus,
  Calendar as CalendarIcon,
  Users,
  Clock,
  PartyPopper,
  ArrowRight,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  useBookingStats,
  useReservations,
  useEvents,
} from "@/hooks/api/use-bookings";
import { useStore } from "@/contexts/StoreContext";
import type { ReservationStatus, EventStatus } from "@/types/bookings";

const ALL = "__all__";

const reservationStatusColor: Record<ReservationStatus, string> = {
  pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  confirmed: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  seated: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  completed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  "no-show": "bg-gray-200 text-gray-700 dark:bg-gray-800/50 dark:text-gray-300",
};

const eventStatusColor: Record<EventStatus, string> = {
  inquiry: "bg-slate-100 text-slate-700 dark:bg-slate-800/50 dark:text-slate-300",
  pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  confirmed: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "in-progress":
    "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  completed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

function ngn(n: number): string {
  return `₦${n.toLocaleString()}`;
}

export default function BookingsPage() {
  const navigate = useNavigate();
  const { currentStore } = useStore();
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"all" | "reservations" | "events">("all");

  const today = new Date().toISOString().slice(0, 10);
  const statsQuery = useBookingStats(currentStore?.id);
  const reservationsQuery = useReservations({
    storeId: currentStore?.id,
    dateFrom: today,
    search: search || undefined,
    limit: 25,
  });
  const eventsQuery = useEvents({
    storeId: currentStore?.id,
    dateFrom: today,
    search: search || undefined,
    limit: 25,
  });

  const stats = useMemo(() => {
    const s = statsQuery.data;
    return [
      {
        label: "Today",
        value: s ? String(s.todayReservations) : "—",
        icon: CalendarIcon,
      },
      {
        label: "Upcoming Reservations",
        value: s ? String(s.upcomingReservations) : "—",
        icon: Clock,
      },
      {
        label: "Upcoming Events",
        value: s ? String(s.upcomingEvents) : "—",
        icon: PartyPopper,
      },
      {
        label: "Expected Revenue",
        value: s ? ngn(s.expectedRevenue) : "—",
        icon: Users,
      },
    ];
  }, [statsQuery.data]);

  const reservations = reservationsQuery.data?.data ?? [];
  const events = eventsQuery.data?.data ?? [];

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Bookings</h1>
          <p className="text-sm text-muted-foreground">
            All upcoming reservations and events
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate("/bookings/reservations")}
          >
            <Plus className="mr-2 h-4 w-4" /> Reservation
          </Button>
          <Button size="sm" onClick={() => navigate("/bookings/events")}>
            <Plus className="mr-2 h-4 w-4" /> Event
          </Button>
        </div>
      </div>

      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border/50">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-muted flex items-center justify-center">
                  <stat.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                </div>
              </div>
              <p className="text-xl sm:text-2xl font-semibold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border/50">
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search bookings..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 bg-muted/50 border-0"
              />
            </div>
            <Select value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
              <SelectTrigger className="w-full sm:w-36 h-9 bg-muted/50 border-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="reservations">Reservations</SelectItem>
                <SelectItem value="events">Events</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="reservations">Reservations</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-2 mt-4">
              {reservationsQuery.isLoading || eventsQuery.isLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : reservations.length === 0 && events.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  No upcoming bookings.
                </div>
              ) : (
                <>
                  {reservations.slice(0, 10).map((r) => (
                    <div
                      key={r.id}
                      className="flex items-center justify-between p-4 border rounded-lg gap-3 hover:bg-muted/40 transition-colors cursor-pointer"
                      onClick={() => navigate("/bookings/reservations")}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            Reservation
                          </Badge>
                          <p className="font-medium truncate">{r.customerName}</p>
                          <span className="text-xs text-muted-foreground">
                            · {r.partySize} guests
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(`${r.date}T${r.time}`), "EEE, MMM d · p")}
                        </p>
                      </div>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "text-xs capitalize",
                          reservationStatusColor[r.status],
                        )}
                      >
                        {r.status}
                      </Badge>
                    </div>
                  ))}
                  {events.slice(0, 10).map((e) => (
                    <div
                      key={e.id}
                      className="flex items-center justify-between p-4 border rounded-lg gap-3 hover:bg-muted/40 transition-colors cursor-pointer"
                      onClick={() => navigate("/bookings/events")}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            Event
                          </Badge>
                          <p className="font-medium truncate">{e.name}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(`${e.date}T${e.startTime}`), "EEE, MMM d · p")}
                          {" · "}
                          {e.confirmedGuests ?? e.expectedGuests} guests
                        </p>
                      </div>
                      <Badge
                        variant="secondary"
                        className={cn("text-xs capitalize", eventStatusColor[e.status])}
                      >
                        {e.status}
                      </Badge>
                    </div>
                  ))}
                </>
              )}
            </TabsContent>

            <TabsContent value="reservations" className="space-y-2 mt-4">
              {reservationsQuery.isLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : reservations.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No upcoming reservations.
                </div>
              ) : (
                reservations.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="min-w-0">
                      <p className="font-medium truncate">{r.customerName}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(`${r.date}T${r.time}`), "EEE, MMM d · p")} ·{" "}
                        {r.partySize} guests
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "text-xs capitalize",
                        reservationStatusColor[r.status],
                      )}
                    >
                      {r.status}
                    </Badge>
                  </div>
                ))
              )}
              <div className="text-center pt-2">
                <Button
                  variant="link"
                  onClick={() => navigate("/bookings/reservations")}
                >
                  Manage all reservations <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="events" className="space-y-2 mt-4">
              {eventsQuery.isLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : events.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No upcoming events.
                </div>
              ) : (
                events.map((e) => (
                  <div
                    key={e.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="min-w-0">
                      <p className="font-medium truncate">{e.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(`${e.date}T${e.startTime}`), "EEE, MMM d · p")} ·{" "}
                        {e.confirmedGuests ?? e.expectedGuests} guests
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className={cn("text-xs capitalize", eventStatusColor[e.status])}
                    >
                      {e.status}
                    </Badge>
                  </div>
                ))
              )}
              <div className="text-center pt-2">
                <Button variant="link" onClick={() => navigate("/bookings/events")}>
                  Manage all events <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
