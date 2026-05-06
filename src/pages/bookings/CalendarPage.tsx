import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Users,
  Clock,
  PartyPopper,
} from "lucide-react";
import {
  addMonths,
  endOfMonth,
  format,
  startOfMonth,
  subMonths,
} from "date-fns";
import { useBookingsCalendar } from "@/hooks/api/use-bookings";
import { useStore } from "@/contexts/StoreContext";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CalendarPage() {
  const navigate = useNavigate();
  const { currentStore } = useStore();
  const [cursor, setCursor] = useState(new Date());

  const startDate = useMemo(() => startOfMonth(cursor), [cursor]);
  const endDate = useMemo(() => endOfMonth(cursor), [cursor]);

  const calendarQuery = useBookingsCalendar({
    dateFrom: format(startDate, "yyyy-MM-dd"),
    dateTo: format(endDate, "yyyy-MM-dd"),
    storeId: currentStore?.id,
  });

  const monthLabel = format(cursor, "MMMM yyyy");
  const today = format(new Date(), "yyyy-MM-dd");

  // Build day grid
  const days = useMemo(() => {
    const start = startDate.getDay(); // 0 = Sun
    const total = endDate.getDate();
    const cells: Array<{ date: string; day: number } | null> = [];
    for (let i = 0; i < start; i++) cells.push(null);
    for (let d = 1; d <= total; d++) {
      const dateStr = format(
        new Date(cursor.getFullYear(), cursor.getMonth(), d),
        "yyyy-MM-dd",
      );
      cells.push({ date: dateStr, day: d });
    }
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [startDate, endDate, cursor]);

  const itemsByDate = useMemo(() => {
    const map = new Map<
      string,
      { reservations: number; events: number; guests: number }
    >();
    const feed = calendarQuery.data?.feed ?? [];
    for (const f of feed) {
      const cur = map.get(f.date) ?? { reservations: 0, events: 0, guests: 0 };
      if (f.kind === "reservation") cur.reservations++;
      else cur.events++;
      cur.guests += f.guests;
      map.set(f.date, cur);
    }
    return map;
  }, [calendarQuery.data]);

  const monthStats = useMemo(() => {
    const reservations = calendarQuery.data?.reservations.length ?? 0;
    const events = calendarQuery.data?.events.length ?? 0;
    const guests = (calendarQuery.data?.feed ?? []).reduce(
      (sum, f) => sum + f.guests,
      0,
    );
    return [
      { label: "Reservations", value: String(reservations), icon: CalendarIcon },
      { label: "Events", value: String(events), icon: PartyPopper },
      { label: "Total Guests", value: String(guests), icon: Users },
    ];
  }, [calendarQuery.data]);

  const todayItems = useMemo(() => {
    return (calendarQuery.data?.feed ?? []).filter((f) => f.date === today);
  }, [calendarQuery.data, today]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Calendar</h1>
          <p className="text-sm text-muted-foreground">
            Reservations and events at a glance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setCursor(subMonths(cursor, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium px-2 min-w-32 text-center">
            {monthLabel}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setCursor(addMonths(cursor, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="ml-2"
            onClick={() => setCursor(new Date())}
          >
            Today
          </Button>
        </div>
      </div>

      <div className="grid gap-3 grid-cols-3">
        {monthStats.map((s) => (
          <Card key={s.label} className="border-border/50">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-muted flex items-center justify-center">
                  <s.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                </div>
              </div>
              <p className="text-xl sm:text-2xl font-semibold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">{monthLabel}</CardTitle>
          </CardHeader>
          <CardContent>
            {calendarQuery.isLoading ? (
              <Skeleton className="h-80 w-full" />
            ) : (
              <div className="grid grid-cols-7 gap-1">
                {WEEKDAYS.map((d) => (
                  <div
                    key={d}
                    className="text-center text-xs font-medium text-muted-foreground py-2"
                  >
                    {d}
                  </div>
                ))}
                {days.map((cell, i) => {
                  if (!cell)
                    return <div key={`empty-${i}`} className="min-h-[68px]" />;
                  const counts = itemsByDate.get(cell.date);
                  const isToday = cell.date === today;
                  return (
                    <div
                      key={cell.date}
                      className={cn(
                        "min-h-[68px] border rounded p-1 text-center cursor-pointer hover:bg-muted/40 transition-colors",
                        isToday ? "border-primary bg-primary/5" : "border-border/50",
                      )}
                      onClick={() => navigate("/bookings/reservations")}
                    >
                      <p
                        className={cn(
                          "text-xs mb-1",
                          isToday
                            ? "text-primary font-medium"
                            : "text-muted-foreground",
                        )}
                      >
                        {cell.day}
                      </p>
                      {counts && (
                        <div className="space-y-0.5">
                          {counts.reservations > 0 && (
                            <Badge
                              variant="outline"
                              className="text-[10px] h-4 px-1 w-full"
                            >
                              {counts.reservations} res
                            </Badge>
                          )}
                          {counts.events > 0 && (
                            <Badge
                              variant="secondary"
                              className="text-[10px] h-4 px-1 w-full"
                            >
                              {counts.events} evt
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" /> Today
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {calendarQuery.isLoading ? (
              <Skeleton className="h-32 w-full" />
            ) : todayItems.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                Nothing scheduled today
              </p>
            ) : (
              todayItems.map((item) => (
                <div
                  key={`${item.kind}-${item.id}`}
                  className="p-3 border rounded-lg cursor-pointer hover:bg-muted/40"
                  onClick={() =>
                    navigate(
                      item.kind === "reservation"
                        ? "/bookings/reservations"
                        : "/bookings/events",
                    )
                  }
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <Badge variant="outline" className="text-xs capitalize">
                      {item.kind}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {item.startTime}
                      {item.endTime ? ` – ${item.endTime}` : ""}
                    </span>
                  </div>
                  <p className="font-medium text-sm truncate">{item.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.guests} guest{item.guests === 1 ? "" : "s"} · {item.status}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/bookings/reservations")}
          >
            <Plus className="h-4 w-4 mr-2" /> Reservation
          </Button>
          <Button size="sm" onClick={() => navigate("/bookings/events")}>
            <Plus className="h-4 w-4 mr-2" /> Event
          </Button>
        </div>
      </div>
    </div>
  );
}
