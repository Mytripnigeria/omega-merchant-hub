import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Plus,
  Calendar as CalendarIcon,
  Users,
  Clock,
  Phone,
  Mail,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  UserCheck,
  AlertTriangle,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TablePagination } from "@/components/ui/table-pagination";
import { format } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  useReservations,
  useReservationStats,
  useCreateReservation,
  useUpdateReservation,
  useDeleteReservation,
  useConfirmReservation,
  useSeatReservation,
  useCompleteReservation,
  useNoShowReservation,
  useCancelReservation,
} from "@/hooks/api/use-bookings";
import { useStore } from "@/contexts/StoreContext";
import type { Reservation, ReservationStatus } from "@/types/bookings";

const ALL = "__all__";

const statusColor: Record<ReservationStatus, string> = {
  pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  confirmed: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  seated: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  completed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  "no-show": "bg-gray-200 text-gray-700 dark:bg-gray-800/50 dark:text-gray-300",
};

interface ReservationForm {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  partySize: string;
  date: string;
  time: string;
  duration: string;
  tableNumber: string;
  notes: string;
  specialRequests: string;
}

function emptyForm(): ReservationForm {
  return {
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    partySize: "2",
    date: new Date().toISOString().slice(0, 10),
    time: "19:00",
    duration: "120",
    tableNumber: "",
    notes: "",
    specialRequests: "",
  };
}

function reservationToForm(r: Reservation): ReservationForm {
  return {
    customerName: r.customerName,
    customerPhone: r.customerPhone,
    customerEmail: r.customerEmail ?? "",
    partySize: String(r.partySize),
    date: r.date,
    time: r.time,
    duration: r.duration != null ? String(r.duration) : "",
    tableNumber: r.tableNumber ?? "",
    notes: r.notes ?? "",
    specialRequests: r.specialRequests ?? "",
  };
}

export default function ReservationsPage() {
  const { currentStore } = useStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>(ALL);
  const [dateFilter, setDateFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<"view" | "create" | "edit">("create");
  const [selected, setSelected] = useState<Reservation | null>(null);
  const [form, setForm] = useState<ReservationForm>(emptyForm());
  const [cancelReason, setCancelReason] = useState("");

  const reservationsQuery = useReservations({
    storeId: currentStore?.id,
    status:
      statusFilter === ALL ? undefined : (statusFilter as ReservationStatus),
    date: dateFilter || undefined,
    search: search || undefined,
    page,
    limit: pageSize,
  });
  const statsQuery = useReservationStats(currentStore?.id);

  const createReservation = useCreateReservation();
  const updateReservation = useUpdateReservation();
  const deleteReservation = useDeleteReservation();
  const confirmReservation = useConfirmReservation();
  const seatReservation = useSeatReservation();
  const completeReservation = useCompleteReservation();
  const noShowReservation = useNoShowReservation();
  const cancelReservation = useCancelReservation();

  const reservations = reservationsQuery.data?.data ?? [];
  const total = reservationsQuery.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, total);

  const stats = useMemo(() => {
    const s = statsQuery.data;
    return [
      {
        label: "Today",
        value: s ? String(s.todayReservations) : "—",
        icon: CalendarIcon,
      },
      {
        label: "Upcoming",
        value: s ? String(s.upcomingReservations) : "—",
        icon: Clock,
      },
      {
        label: "Cancelled",
        value: s ? String(s.cancelledReservations) : "—",
        icon: XCircle,
      },
      {
        label: "No-show rate",
        value: s ? `${Math.round(s.noShowRate * 100)}%` : "—",
        icon: AlertTriangle,
      },
    ];
  }, [statsQuery.data]);

  const openCreate = () => {
    setSelected(null);
    setForm(emptyForm());
    setSheetMode("create");
    setSheetOpen(true);
  };
  const openView = (r: Reservation) => {
    setSelected(r);
    setForm(reservationToForm(r));
    setCancelReason("");
    setSheetMode("view");
    setSheetOpen(true);
  };
  const openEdit = (r: Reservation) => {
    setSelected(r);
    setForm(reservationToForm(r));
    setSheetMode("edit");
    setSheetOpen(true);
  };
  const close = () => {
    setSheetOpen(false);
    setSelected(null);
  };

  const buildPayload = () => ({
    customerName: form.customerName,
    customerPhone: form.customerPhone,
    customerEmail: form.customerEmail || undefined,
    partySize: Number(form.partySize) || 1,
    date: form.date,
    time: form.time,
    duration: form.duration ? Number(form.duration) : undefined,
    tableNumber: form.tableNumber || undefined,
    notes: form.notes || undefined,
    specialRequests: form.specialRequests || undefined,
  });

  const handleCreate = () => {
    if (!currentStore) {
      toast.error("Select a store first");
      return;
    }
    if (!form.customerName.trim() || !form.customerPhone.trim()) {
      toast.error("Customer name and phone are required");
      return;
    }
    createReservation.mutate(
      { storeId: currentStore.id, ...buildPayload() },
      {
        onSuccess: () => {
          toast.success("Reservation created");
          close();
        },
        onError: (e: Error) => toast.error(e.message ?? "Couldn't create"),
      },
    );
  };

  const handleUpdate = () => {
    if (!selected) return;
    updateReservation.mutate(
      { id: selected.id, data: buildPayload() },
      {
        onSuccess: () => {
          toast.success("Reservation updated");
          close();
        },
        onError: (e: Error) => toast.error(e.message ?? "Couldn't update"),
      },
    );
  };

  const handleDelete = (r: Reservation) => {
    if (!confirm(`Delete reservation for ${r.customerName}?`)) return;
    deleteReservation.mutate(r.id, {
      onSuccess: () => {
        toast.success("Reservation deleted");
        if (selected?.id === r.id) close();
      },
      onError: (e: Error) => toast.error(e.message ?? "Couldn't delete"),
    });
  };

  const transitionAction = (
    fn: ReturnType<typeof useConfirmReservation>,
    id: string,
    successMsg: string,
  ) => {
    fn.mutate(id, {
      onSuccess: (updated: Reservation) => {
        toast.success(successMsg);
        setSelected(updated);
      },
      onError: (e: Error) => toast.error(e.message ?? "Couldn't update"),
    });
  };

  const handleCancel = (r: Reservation) => {
    cancelReservation.mutate(
      { id: r.id, reason: cancelReason || undefined },
      {
        onSuccess: (updated: Reservation) => {
          toast.success("Reservation cancelled");
          setSelected(updated);
          setCancelReason("");
        },
        onError: (e: Error) => toast.error(e.message ?? "Couldn't cancel"),
      },
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Reservations</h1>
          <p className="text-sm text-muted-foreground">
            Manage table reservations and walk-in bookings
          </p>
        </div>
        <Button size="sm" onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> New Reservation
        </Button>
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
                placeholder="Search by name, phone, email..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-9 h-9 bg-muted/50 border-0"
              />
            </div>
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                setPage(1);
              }}
              className="w-full sm:w-44 h-9 bg-muted/50 border-0"
            />
            <Select
              value={statusFilter}
              onValueChange={(v) => {
                setStatusFilter(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-36 h-9 bg-muted/50 border-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="seated">Seated</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="no-show">No-show</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {reservationsQuery.isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : reservations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CalendarIcon className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">No reservations</p>
              <Button variant="outline" size="sm" className="mt-3" onClick={openCreate}>
                Create your first reservation
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {reservations.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between p-4 border rounded-lg gap-3 hover:bg-muted/40 transition-colors cursor-pointer"
                  onClick={() => openView(r)}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium truncate">{r.customerName}</p>
                      <span className="text-xs text-muted-foreground">
                        · {r.partySize} guest{r.partySize === 1 ? "" : "s"}
                      </span>
                      {r.tableNumber && (
                        <Badge variant="outline" className="text-xs">
                          {r.tableNumber}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {format(new Date(`${r.date}T${r.time}`), "EEE, MMM d · p")}
                      {" · "}
                      {r.customerPhone}
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className={cn("text-xs capitalize shrink-0", statusColor[r.status])}
                  >
                    {r.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {total > 0 && (
        <TablePagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={total}
          startIndex={startIndex + 1}
          endIndex={endIndex}
          pageSize={pageSize}
          onPageChange={setPage}
        />
      )}

      <Sheet open={sheetOpen} onOpenChange={(o) => (o ? setSheetOpen(true) : close())}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {sheetMode === "create"
                ? "New Reservation"
                : sheetMode === "edit"
                  ? "Edit Reservation"
                  : selected?.customerName}
            </SheetTitle>
            {sheetMode === "view" && selected && (
              <SheetDescription>
                {format(new Date(`${selected.date}T${selected.time}`), "EEEE, MMMM d · p")}
              </SheetDescription>
            )}
          </SheetHeader>

          {sheetMode === "view" && selected ? (
            <Tabs defaultValue="details" className="mt-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="actions">Actions</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-3 mt-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    {selected.customerPhone}
                  </div>
                  {selected.customerEmail && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      {selected.customerEmail}
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                  <div>
                    <p className="text-xs text-muted-foreground">Party</p>
                    <p className="font-medium">{selected.partySize}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Table</p>
                    <p className="font-medium">{selected.tableNumber ?? "—"}</p>
                  </div>
                  {selected.duration != null && (
                    <div>
                      <p className="text-xs text-muted-foreground">Duration</p>
                      <p className="font-medium">{selected.duration} min</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-muted-foreground">Status</p>
                    <Badge
                      variant="secondary"
                      className={cn("text-xs capitalize", statusColor[selected.status])}
                    >
                      {selected.status}
                    </Badge>
                  </div>
                </div>
                {selected.notes && (
                  <div>
                    <p className="text-xs text-muted-foreground">Notes</p>
                    <p>{selected.notes}</p>
                  </div>
                )}
                {selected.specialRequests && (
                  <div>
                    <p className="text-xs text-muted-foreground">Special requests</p>
                    <p>{selected.specialRequests}</p>
                  </div>
                )}
                {selected.cancellationReason && (
                  <div className="pt-3 border-t">
                    <p className="text-xs text-muted-foreground">Cancelled</p>
                    <p>{selected.cancellationReason}</p>
                  </div>
                )}

                <div className="flex gap-2 pt-3 border-t">
                  <Button variant="outline" className="flex-1" onClick={() => openEdit(selected)}>
                    <Edit className="h-4 w-4 mr-2" /> Edit
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => handleDelete(selected)}
                    disabled={deleteReservation.isPending}
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="actions" className="space-y-3 mt-4">
                <div className="grid grid-cols-2 gap-2">
                  {selected.status === "pending" && (
                    <Button
                      onClick={() =>
                        transitionAction(
                          confirmReservation,
                          selected.id,
                          "Reservation confirmed",
                        )
                      }
                      disabled={confirmReservation.isPending}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" /> Confirm
                    </Button>
                  )}
                  {selected.status === "confirmed" && (
                    <Button
                      onClick={() =>
                        transitionAction(
                          seatReservation,
                          selected.id,
                          "Marked seated",
                        )
                      }
                      disabled={seatReservation.isPending}
                    >
                      <UserCheck className="h-4 w-4 mr-2" /> Seat
                    </Button>
                  )}
                  {selected.status === "seated" && (
                    <Button
                      onClick={() =>
                        transitionAction(
                          completeReservation,
                          selected.id,
                          "Reservation completed",
                        )
                      }
                      disabled={completeReservation.isPending}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" /> Complete
                    </Button>
                  )}
                  {(selected.status === "pending" ||
                    selected.status === "confirmed") && (
                    <Button
                      variant="outline"
                      onClick={() =>
                        transitionAction(
                          noShowReservation,
                          selected.id,
                          "Marked no-show",
                        )
                      }
                      disabled={noShowReservation.isPending}
                    >
                      <AlertTriangle className="h-4 w-4 mr-2" /> No-show
                    </Button>
                  )}
                </div>

                {(selected.status === "pending" ||
                  selected.status === "confirmed" ||
                  selected.status === "seated") && (
                  <div className="space-y-2 pt-3 border-t">
                    <Label>Cancel reservation</Label>
                    <Input
                      placeholder="Reason (optional)"
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                    />
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={() => handleCancel(selected)}
                      disabled={cancelReservation.isPending}
                    >
                      <XCircle className="h-4 w-4 mr-2" /> Cancel Reservation
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          ) : (
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Customer name</Label>
                <Input
                  value={form.customerName}
                  onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={form.customerPhone}
                    onChange={(e) =>
                      setForm({ ...form, customerPhone: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={form.customerEmail}
                    onChange={(e) =>
                      setForm({ ...form, customerEmail: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label>Party size</Label>
                  <Input
                    type="number"
                    min={1}
                    value={form.partySize}
                    onChange={(e) => setForm({ ...form, partySize: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Time</Label>
                  <Input
                    type="time"
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Duration (min)</Label>
                  <Input
                    type="number"
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Table</Label>
                  <Input
                    placeholder="e.g. T5"
                    value={form.tableNumber}
                    onChange={(e) =>
                      setForm({ ...form, tableNumber: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  rows={2}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Special requests</Label>
                <Textarea
                  rows={2}
                  value={form.specialRequests}
                  onChange={(e) =>
                    setForm({ ...form, specialRequests: e.target.value })
                  }
                />
              </div>

              <SheetFooter className="flex-col sm:flex-row gap-2 pt-4 border-t">
                <Button variant="outline" className="w-full sm:w-auto" onClick={close}>
                  Cancel
                </Button>
                <Button
                  className="w-full sm:w-auto"
                  onClick={sheetMode === "create" ? handleCreate : handleUpdate}
                  disabled={
                    createReservation.isPending || updateReservation.isPending
                  }
                >
                  {sheetMode === "create" ? "Create" : "Save Changes"}
                </Button>
              </SheetFooter>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
