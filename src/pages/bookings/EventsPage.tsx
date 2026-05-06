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
  PartyPopper,
  Users,
  Phone,
  Mail,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  Play,
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
  useEvents,
  useEventStats,
  useCreateEvent,
  useUpdateEvent,
  useDeleteEvent,
  useConfirmEvent,
  useStartEvent,
  useCompleteEvent,
  useCancelEvent,
  useRecordEventPayment,
} from "@/hooks/api/use-bookings";
import { useStore } from "@/contexts/StoreContext";
import type { Event, EventStatus, EventType } from "@/types/bookings";

const ALL = "__all__";

const statusColor: Record<EventStatus, string> = {
  inquiry: "bg-slate-100 text-slate-700 dark:bg-slate-800/50 dark:text-slate-300",
  pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  confirmed: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "in-progress":
    "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  completed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

interface EventForm {
  name: string;
  description: string;
  type: EventType;
  date: string;
  startTime: string;
  endTime: string;
  expectedGuests: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  venueArea: string;
  deposit: string;
  totalAmount: string;
  notes: string;
}

function emptyForm(): EventForm {
  return {
    name: "",
    description: "",
    type: "private",
    date: new Date().toISOString().slice(0, 10),
    startTime: "18:00",
    endTime: "22:00",
    expectedGuests: "20",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    venueArea: "",
    deposit: "",
    totalAmount: "",
    notes: "",
  };
}

function eventToForm(e: Event): EventForm {
  return {
    name: e.name,
    description: e.description ?? "",
    type: e.type,
    date: e.date,
    startTime: e.startTime,
    endTime: e.endTime,
    expectedGuests: String(e.expectedGuests),
    contactName: e.contactName,
    contactPhone: e.contactPhone,
    contactEmail: e.contactEmail ?? "",
    venueArea: e.venueArea ?? "",
    deposit: e.deposit != null ? String(e.deposit) : "",
    totalAmount: e.totalAmount != null ? String(e.totalAmount) : "",
    notes: e.notes ?? "",
  };
}

function ngn(n: number): string {
  return `₦${n.toLocaleString()}`;
}

export default function EventsPage() {
  const { currentStore } = useStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>(ALL);
  const [typeFilter, setTypeFilter] = useState<string>(ALL);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<"view" | "create" | "edit">("create");
  const [selected, setSelected] = useState<Event | null>(null);
  const [form, setForm] = useState<EventForm>(emptyForm());

  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentAsDeposit, setPaymentAsDeposit] = useState(false);

  const eventsQuery = useEvents({
    storeId: currentStore?.id,
    status: statusFilter === ALL ? undefined : (statusFilter as EventStatus),
    type: typeFilter === ALL ? undefined : (typeFilter as EventType),
    search: search || undefined,
    page,
    limit: pageSize,
  });
  const statsQuery = useEventStats(currentStore?.id);

  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const deleteEvent = useDeleteEvent();
  const confirmEvent = useConfirmEvent();
  const startEvent = useStartEvent();
  const completeEvent = useCompleteEvent();
  const cancelEvent = useCancelEvent();
  const recordPayment = useRecordEventPayment();

  const events = eventsQuery.data?.data ?? [];
  const total = eventsQuery.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, total);

  const stats = useMemo(() => {
    const s = statsQuery.data;
    return [
      {
        label: "Upcoming",
        value: s ? String(s.upcomingEvents) : "—",
        icon: CalendarIcon,
      },
      {
        label: "In Progress",
        value: s ? String(s.inProgressEvents) : "—",
        icon: Clock,
      },
      {
        label: "Expected Revenue",
        value: s ? ngn(s.expectedRevenue) : "—",
        icon: DollarSign,
      },
      {
        label: "Collected",
        value: s ? ngn(s.collectedRevenue) : "—",
        icon: DollarSign,
      },
    ];
  }, [statsQuery.data]);

  const openCreate = () => {
    setSelected(null);
    setForm(emptyForm());
    setSheetMode("create");
    setSheetOpen(true);
  };
  const openView = (e: Event) => {
    setSelected(e);
    setForm(eventToForm(e));
    setPaymentAmount("");
    setPaymentAsDeposit(false);
    setSheetMode("view");
    setSheetOpen(true);
  };
  const openEdit = (e: Event) => {
    setSelected(e);
    setForm(eventToForm(e));
    setSheetMode("edit");
    setSheetOpen(true);
  };
  const close = () => {
    setSheetOpen(false);
    setSelected(null);
  };

  const buildPayload = () => ({
    name: form.name,
    description: form.description || undefined,
    type: form.type,
    date: form.date,
    startTime: form.startTime,
    endTime: form.endTime,
    expectedGuests: Number(form.expectedGuests) || 1,
    contactName: form.contactName,
    contactPhone: form.contactPhone,
    contactEmail: form.contactEmail || undefined,
    venueArea: form.venueArea || undefined,
    deposit: form.deposit ? Number(form.deposit) : undefined,
    totalAmount: form.totalAmount ? Number(form.totalAmount) : undefined,
    notes: form.notes || undefined,
  });

  const handleCreate = () => {
    if (!currentStore) {
      toast.error("Select a store first");
      return;
    }
    if (!form.name.trim() || !form.contactName.trim() || !form.contactPhone.trim()) {
      toast.error("Name, contact name and phone are required");
      return;
    }
    createEvent.mutate(
      { storeId: currentStore.id, ...buildPayload() },
      {
        onSuccess: () => {
          toast.success("Event created");
          close();
        },
        onError: (e: Error) => toast.error(e.message ?? "Couldn't create"),
      },
    );
  };

  const handleUpdate = () => {
    if (!selected) return;
    updateEvent.mutate(
      { id: selected.id, data: buildPayload() },
      {
        onSuccess: () => {
          toast.success("Event updated");
          close();
        },
        onError: (e: Error) => toast.error(e.message ?? "Couldn't update"),
      },
    );
  };

  const handleDelete = (e: Event) => {
    if (!confirm(`Delete event "${e.name}"?`)) return;
    deleteEvent.mutate(e.id, {
      onSuccess: () => {
        toast.success("Event deleted");
        if (selected?.id === e.id) close();
      },
      onError: (e: Error) => toast.error(e.message ?? "Couldn't delete"),
    });
  };

  const transitionAction = (
    fn: ReturnType<typeof useConfirmEvent>,
    id: string,
    successMsg: string,
  ) => {
    fn.mutate(id, {
      onSuccess: (updated: Event) => {
        toast.success(successMsg);
        setSelected(updated);
      },
      onError: (e: Error) => toast.error(e.message ?? "Couldn't update"),
    });
  };

  const handleRecordPayment = () => {
    if (!selected) return;
    const amount = Number(paymentAmount);
    if (!amount || amount <= 0) {
      toast.error("Amount must be positive");
      return;
    }
    recordPayment.mutate(
      { id: selected.id, amount, asDeposit: paymentAsDeposit },
      {
        onSuccess: (updated: Event) => {
          toast.success("Payment recorded");
          setSelected(updated);
          setPaymentAmount("");
          setPaymentAsDeposit(false);
        },
        onError: (e: Error) => toast.error(e.message ?? "Couldn't record"),
      },
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Events</h1>
          <p className="text-sm text-muted-foreground">
            Manage private functions, corporate events, and parties
          </p>
        </div>
        <Button size="sm" onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> New Event
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
                placeholder="Search events..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-9 h-9 bg-muted/50 border-0"
              />
            </div>
            <Select
              value={typeFilter}
              onValueChange={(v) => {
                setTypeFilter(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-36 h-9 bg-muted/50 border-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All Types</SelectItem>
                <SelectItem value="private">Private</SelectItem>
                <SelectItem value="corporate">Corporate</SelectItem>
                <SelectItem value="wedding">Wedding</SelectItem>
                <SelectItem value="birthday">Birthday</SelectItem>
                <SelectItem value="holiday">Holiday</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
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
                <SelectItem value={ALL}>All Status</SelectItem>
                <SelectItem value="inquiry">Inquiry</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {eventsQuery.isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <PartyPopper className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">No events</p>
              <Button variant="outline" size="sm" className="mt-3" onClick={openCreate}>
                Create your first event
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {events.map((e) => (
                <div
                  key={e.id}
                  className="flex items-center justify-between p-4 border rounded-lg gap-3 hover:bg-muted/40 transition-colors cursor-pointer"
                  onClick={() => openView(e)}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium truncate">{e.name}</p>
                      <Badge variant="outline" className="text-xs capitalize">
                        {e.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {format(new Date(`${e.date}T${e.startTime}`), "EEE, MMM d · p")}
                      {" · "}
                      {e.confirmedGuests ?? e.expectedGuests} guests
                      {e.venueArea && ` · ${e.venueArea}`}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <Badge
                      variant="secondary"
                      className={cn("text-xs capitalize", statusColor[e.status])}
                    >
                      {e.status}
                    </Badge>
                    {e.totalAmount != null && (
                      <span className="text-xs text-muted-foreground">
                        {ngn(e.totalAmount)}
                      </span>
                    )}
                  </div>
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
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {sheetMode === "create"
                ? "New Event"
                : sheetMode === "edit"
                  ? `Edit ${selected?.name}`
                  : selected?.name}
            </SheetTitle>
            {sheetMode === "view" && selected && (
              <SheetDescription>
                {format(new Date(`${selected.date}T${selected.startTime}`), "EEEE, MMMM d · p")}
                {" – "}
                {selected.endTime}
              </SheetDescription>
            )}
          </SheetHeader>

          {sheetMode === "view" && selected ? (
            <Tabs defaultValue="details" className="mt-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="payments">Payments</TabsTrigger>
                <TabsTrigger value="actions">Actions</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-3 mt-4 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Type</p>
                    <p className="font-medium capitalize">{selected.type}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Status</p>
                    <Badge
                      variant="secondary"
                      className={cn("text-xs capitalize", statusColor[selected.status])}
                    >
                      {selected.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Expected guests</p>
                    <p className="font-medium">{selected.expectedGuests}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Confirmed</p>
                    <p className="font-medium">
                      {selected.confirmedGuests ?? "—"}
                    </p>
                  </div>
                  {selected.venueArea && (
                    <div className="col-span-2">
                      <p className="text-xs text-muted-foreground">Venue area</p>
                      <p className="font-medium">{selected.venueArea}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-2 pt-3 border-t">
                  <p className="text-xs text-muted-foreground">Contact</p>
                  <div className="space-y-1">
                    <p className="font-medium">{selected.contactName}</p>
                    <p className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      {selected.contactPhone}
                    </p>
                    {selected.contactEmail && (
                      <p className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        {selected.contactEmail}
                      </p>
                    )}
                  </div>
                </div>

                {selected.description && (
                  <div className="pt-3 border-t">
                    <p className="text-xs text-muted-foreground mb-1">Description</p>
                    <p>{selected.description}</p>
                  </div>
                )}
                {selected.notes && (
                  <div className="pt-3 border-t">
                    <p className="text-xs text-muted-foreground mb-1">Notes</p>
                    <p>{selected.notes}</p>
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
                    disabled={deleteEvent.isPending}
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="payments" className="space-y-3 mt-4">
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div className="p-3 border rounded-lg text-center">
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className="font-semibold">
                      {selected.totalAmount != null ? ngn(selected.totalAmount) : "—"}
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg text-center">
                    <p className="text-xs text-muted-foreground">Deposit</p>
                    <p className="font-semibold">
                      {selected.deposit != null ? ngn(selected.deposit) : "—"}
                    </p>
                    {selected.depositPaid && (
                      <Badge variant="outline" className="mt-1 text-xs">
                        Paid
                      </Badge>
                    )}
                  </div>
                  <div className="p-3 border rounded-lg text-center">
                    <p className="text-xs text-muted-foreground">Collected</p>
                    <p className="font-semibold">{ngn(selected.paidAmount)}</p>
                  </div>
                </div>

                <div className="space-y-2 border rounded-lg p-3">
                  <Label>Record payment</Label>
                  <Input
                    type="number"
                    placeholder="Amount (₦)"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                  />
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={paymentAsDeposit}
                      onChange={(e) => setPaymentAsDeposit(e.target.checked)}
                    />
                    <span>Mark deposit as paid</span>
                  </label>
                  <Button
                    onClick={handleRecordPayment}
                    disabled={recordPayment.isPending}
                    className="w-full"
                  >
                    <DollarSign className="h-4 w-4 mr-2" /> Record Payment
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="actions" className="space-y-2 mt-4">
                <div className="grid grid-cols-2 gap-2">
                  {(selected.status === "inquiry" || selected.status === "pending") && (
                    <Button
                      onClick={() => transitionAction(confirmEvent, selected.id, "Confirmed")}
                      disabled={confirmEvent.isPending}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" /> Confirm
                    </Button>
                  )}
                  {selected.status === "confirmed" && (
                    <Button
                      onClick={() => transitionAction(startEvent, selected.id, "Started")}
                      disabled={startEvent.isPending}
                    >
                      <Play className="h-4 w-4 mr-2" /> Start
                    </Button>
                  )}
                  {selected.status === "in-progress" && (
                    <Button
                      onClick={() => transitionAction(completeEvent, selected.id, "Completed")}
                      disabled={completeEvent.isPending}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" /> Complete
                    </Button>
                  )}
                  {(selected.status === "inquiry" ||
                    selected.status === "pending" ||
                    selected.status === "confirmed") && (
                    <Button
                      variant="destructive"
                      onClick={() => transitionAction(cancelEvent, selected.id, "Cancelled")}
                      disabled={cancelEvent.isPending}
                    >
                      <XCircle className="h-4 w-4 mr-2" /> Cancel
                    </Button>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select
                    value={form.type}
                    onValueChange={(v) => setForm({ ...form, type: v as EventType })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="private">Private</SelectItem>
                      <SelectItem value="corporate">Corporate</SelectItem>
                      <SelectItem value="wedding">Wedding</SelectItem>
                      <SelectItem value="birthday">Birthday</SelectItem>
                      <SelectItem value="holiday">Holiday</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Expected guests</Label>
                  <Input
                    type="number"
                    min={1}
                    value={form.expectedGuests}
                    onChange={(e) =>
                      setForm({ ...form, expectedGuests: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Start</Label>
                  <Input
                    type="time"
                    value={form.startTime}
                    onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>End</Label>
                  <Input
                    type="time"
                    value={form.endTime}
                    onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Venue area</Label>
                <Input
                  placeholder="e.g. Main Hall, Private Dining"
                  value={form.venueArea}
                  onChange={(e) => setForm({ ...form, venueArea: e.target.value })}
                />
              </div>
              <div className="space-y-2 pt-3 border-t">
                <Label>Contact name</Label>
                <Input
                  value={form.contactName}
                  onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={form.contactPhone}
                    onChange={(e) =>
                      setForm({ ...form, contactPhone: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={form.contactEmail}
                    onChange={(e) =>
                      setForm({ ...form, contactEmail: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                <div className="space-y-2">
                  <Label>Deposit (₦)</Label>
                  <Input
                    type="number"
                    value={form.deposit}
                    onChange={(e) => setForm({ ...form, deposit: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Total amount (₦)</Label>
                  <Input
                    type="number"
                    value={form.totalAmount}
                    onChange={(e) =>
                      setForm({ ...form, totalAmount: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  rows={2}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </div>

              <SheetFooter className="flex-col sm:flex-row gap-2 pt-4 border-t">
                <Button variant="outline" className="w-full sm:w-auto" onClick={close}>
                  Cancel
                </Button>
                <Button
                  className="w-full sm:w-auto"
                  onClick={sheetMode === "create" ? handleCreate : handleUpdate}
                  disabled={createEvent.isPending || updateEvent.isPending}
                >
                  {sheetMode === "create" ? "Create Event" : "Save Changes"}
                </Button>
              </SheetFooter>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
