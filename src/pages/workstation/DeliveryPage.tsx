import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  Truck,
  MapPin,
  Clock,
  CheckCircle,
  Phone,
  Search,
} from "lucide-react";
import { TablePagination } from "@/components/ui/table-pagination";
import { useDeliveries, useAssignDelivery } from "@/hooks/api/use-deliveries";
import { useStaff } from "@/hooks/api/use-hr";
import { toast } from "sonner";
import type { Delivery, DeliveryStatus } from "@/services/api/deliveries";

const STATUS_BADGE: Record<DeliveryStatus, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-300" },
  assigned: { label: "Assigned", className: "bg-blue-500/10 text-blue-700 dark:text-blue-300" },
  in_transit: { label: "In transit", className: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300" },
  delivered: { label: "Delivered", className: "bg-green-500/10 text-green-700 dark:text-green-300" },
  failed: { label: "Failed", className: "bg-red-500/10 text-red-700 dark:text-red-300" },
};

const ALL = "__all__";

export default function DeliveryPage() {
  const [page, setPage] = useState(1);
  const [tab, setTab] = useState<"active" | "completed" | "all">("active");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Delivery | null>(null);
  const [riderToAssign, setRiderToAssign] = useState<string>("");

  const statusForTab =
    tab === "active"
      ? "pending,assigned,in_transit"
      : tab === "completed"
        ? "delivered,failed"
        : undefined;

  const { data, isLoading } = useDeliveries({
    page,
    limit: 20,
    status: statusForTab,
  });

  const assign = useAssignDelivery();
  const { data: staffPage } = useStaff();
  const riderCandidates = staffPage?.data ?? [];

  const filteredItems = (data?.data ?? []).filter((d) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      String(d.orderNumber ?? "").includes(q) ||
      (d.customerName ?? "").toLowerCase().includes(q) ||
      d.address.toLowerCase().includes(q) ||
      (d.riderName ?? "").toLowerCase().includes(q)
    );
  });

  const handleAssign = () => {
    if (!selected || !riderToAssign) return;
    assign.mutate(
      { id: selected.id, riderStaffId: riderToAssign },
      {
        onSuccess: () => {
          toast.success("Rider assigned");
          setSelected(null);
          setRiderToAssign("");
        },
        onError: (e: Error) => toast.error(e.message ?? "Couldn't assign"),
      },
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight flex items-center gap-2">
          <Truck className="h-5 w-5 sm:h-6 sm:w-6" />
          Deliveries
        </h1>
        <p className="text-sm text-muted-foreground">
          Assign riders, track in-transit deliveries, and audit completed runs.
        </p>
      </div>

      <Tabs
        value={tab}
        onValueChange={(v) => {
          setTab(v as "active" | "completed" | "all");
          setPage(1);
        }}
      >
        <TabsList>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>
        <TabsContent value={tab} className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="relative flex-1 min-w-[16rem]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by order, customer, address, rider..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <span className="text-sm text-muted-foreground">
                  {data?.total ?? 0} total
                </span>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : filteredItems.length === 0 ? (
                <p className="py-12 text-center text-sm text-muted-foreground">
                  No deliveries match.
                </p>
              ) : (
                <div className="space-y-2">
                  {filteredItems.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => setSelected(d)}
                      className="w-full text-left flex items-start justify-between gap-4 p-3 rounded-lg border bg-card hover:bg-muted/40 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold">#{d.orderNumber}</span>
                          <Badge className={STATUS_BADGE[d.status].className}>
                            {STATUS_BADGE[d.status].label}
                          </Badge>
                          {d.riderName && (
                            <span className="text-xs text-muted-foreground">
                              · Rider: {d.riderName}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 truncate">
                          {d.customerName ?? "Customer"} · {d.address}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(d.createdAt).toLocaleString()}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {data && data.totalPages > 1 && (
                <TablePagination
                  currentPage={page}
                  totalPages={data.totalPages}
                  onPageChange={setPage}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>
              {selected ? `Delivery #${selected.orderNumber}` : "Delivery"}
            </SheetTitle>
            <SheetDescription>
              {selected ? STATUS_BADGE[selected.status].label : ""}
            </SheetDescription>
          </SheetHeader>

          {selected && (
            <div className="py-4 space-y-4">
              <Card>
                <CardContent className="p-4 space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                    <span>{selected.address}</span>
                  </div>
                  {selected.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{selected.phone}</span>
                    </div>
                  )}
                  {selected.customerName && (
                    <div className="text-muted-foreground">
                      Customer:{" "}
                      <span className="text-foreground">{selected.customerName}</span>
                    </div>
                  )}
                  {selected.notes && (
                    <p className="text-xs italic text-muted-foreground">
                      Note: {selected.notes}
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs">
                  <Row label="Created" value={selected.createdAt} />
                  <Row label="Assigned" value={selected.assignedAt} />
                  <Row label="Picked up" value={selected.pickedUpAt} />
                  <Row label="Delivered" value={selected.deliveredAt} />
                  {selected.failureReason && (
                    <p className="text-destructive">
                      Failed: {selected.failureReason}
                    </p>
                  )}
                </CardContent>
              </Card>

              {selected.status === "pending" && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Assign rider</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-xs">Rider</Label>
                      <Select
                        value={riderToAssign || ALL}
                        onValueChange={(v) => setRiderToAssign(v === ALL ? "" : v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a rider" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={ALL} disabled>
                            Choose a rider
                          </SelectItem>
                          {riderCandidates.map((s) => (
                            <SelectItem key={s.id} value={s.id}>
                              {s.firstName} {s.lastName}
                              {s.roleName ? ` · ${s.roleName}` : ""}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      className="w-full"
                      disabled={!riderToAssign || assign.isPending}
                      onClick={handleAssign}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Confirm assignment
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          <SheetFooter>
            <Button variant="outline" onClick={() => setSelected(null)}>
              Close
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span>{value ? new Date(value).toLocaleString() : "—"}</span>
    </div>
  );
}
