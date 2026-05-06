import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TablePagination } from "@/components/ui/table-pagination";
import {
  Search,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  PackageCheck,
  ArrowRightLeft,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import {
  useStockTransfers,
  useCreateStockTransfer,
  useApproveStockTransfer,
  useReceiveStockTransfer,
  useCancelStockTransfer,
  useDeleteStockTransfer,
  useInventoryLocations,
} from "@/hooks/api/use-procurement";
import { useIngredients } from "@/hooks/api/use-stock";
import { useStore } from "@/contexts/StoreContext";
import type {
  StockTransfer,
  StockTransferStatus,
} from "@/services/api/procurement";

const ALL = "__all__";

const statusColor: Record<StockTransferStatus, string> = {
  pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  "in-transit": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  received: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

interface TransferLine {
  ingredientId: string;
  quantity: string;
}

function ngn(n: number): string {
  return `₦${n.toLocaleString()}`;
}

export default function StockTransferPage() {
  const { currentStore } = useStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>(ALL);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<"view" | "create" | "receive">("create");
  const [selected, setSelected] = useState<StockTransfer | null>(null);

  const [fromLocationId, setFromLocationId] = useState("");
  const [toLocationId, setToLocationId] = useState("");
  const [notes, setNotes] = useState("");
  const [lines, setLines] = useState<TransferLine[]>([
    { ingredientId: "", quantity: "" },
  ]);
  const [receiveQuantities, setReceiveQuantities] = useState<Record<string, string>>({});

  const transfersQuery = useStockTransfers({
    storeId: currentStore?.id,
    status: statusFilter === ALL ? undefined : (statusFilter as StockTransferStatus),
    page,
    limit: pageSize,
  });
  const locationsQuery = useInventoryLocations({
    storeId: currentStore?.id,
    limit: 100,
  });
  const ingredientsQuery = useIngredients({
    storeId: currentStore?.id,
    limit: 200,
  });

  const createTransfer = useCreateStockTransfer();
  const approveTransfer = useApproveStockTransfer();
  const receiveTransfer = useReceiveStockTransfer();
  const cancelTransfer = useCancelStockTransfer();
  const deleteTransfer = useDeleteStockTransfer();

  const transfers = transfersQuery.data?.data ?? [];
  const total = transfersQuery.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, total);

  const locationsById = useMemo(() => {
    const map = new Map<string, string>();
    (locationsQuery.data?.data ?? []).forEach((l) => map.set(l.id, l.name));
    return map;
  }, [locationsQuery.data]);

  const filteredTransfers = useMemo(() => {
    if (!search.trim()) return transfers;
    const q = search.toLowerCase();
    return transfers.filter(
      (t) =>
        t.id.toLowerCase().includes(q) ||
        (t.notes ?? "").toLowerCase().includes(q) ||
        t.items.some((i) => i.name.toLowerCase().includes(q)),
    );
  }, [transfers, search]);

  const stats = [
    { label: "Total Transfers", value: String(total) },
    {
      label: "Pending",
      value: String(transfers.filter((t) => t.status === "pending").length),
    },
    {
      label: "In Transit",
      value: String(transfers.filter((t) => t.status === "in-transit").length),
    },
  ];

  const openCreate = () => {
    setSelected(null);
    setFromLocationId("");
    setToLocationId("");
    setNotes("");
    setLines([{ ingredientId: "", quantity: "" }]);
    setSheetMode("create");
    setSheetOpen(true);
  };
  const openView = (t: StockTransfer) => {
    setSelected(t);
    setSheetMode("view");
    setSheetOpen(true);
  };
  const openReceive = (t: StockTransfer) => {
    setSelected(t);
    const initial: Record<string, string> = {};
    t.items.forEach((i) => {
      initial[i.id] = String(i.quantity);
    });
    setReceiveQuantities(initial);
    setSheetMode("receive");
    setSheetOpen(true);
  };
  const close = () => {
    setSheetOpen(false);
    setSelected(null);
  };

  const handleCreate = () => {
    if (!currentStore) {
      toast.error("Select a store first");
      return;
    }
    if (!fromLocationId || !toLocationId) {
      toast.error("Pick both source and destination");
      return;
    }
    if (fromLocationId === toLocationId) {
      toast.error("Source and destination must differ");
      return;
    }
    const items = lines
      .filter((l) => l.ingredientId && Number(l.quantity) > 0)
      .map((l) => ({ ingredientId: l.ingredientId, quantity: Number(l.quantity) }));
    if (items.length === 0) {
      toast.error("Add at least one item");
      return;
    }
    createTransfer.mutate(
      {
        storeId: currentStore.id,
        fromLocationId,
        toLocationId,
        notes: notes || undefined,
        items,
      },
      {
        onSuccess: () => {
          toast.success("Transfer created");
          close();
        },
        onError: (e: Error) => toast.error(e.message ?? "Couldn't create"),
      },
    );
  };

  const handleApprove = (t: StockTransfer) => {
    if (
      !confirm(
        `Approve transfer? This will deduct stock from ${locationsById.get(t.fromLocationId) ?? "source"}.`,
      )
    )
      return;
    approveTransfer.mutate(t.id, {
      onSuccess: () => toast.success("Transfer approved"),
      onError: (e: Error) => toast.error(e.message ?? "Couldn't approve"),
    });
  };

  const handleReceive = () => {
    if (!selected) return;
    const items = selected.items.map((i) => ({
      itemId: i.id,
      receivedQuantity: Number(receiveQuantities[i.id] ?? i.quantity),
    }));
    receiveTransfer.mutate(
      { id: selected.id, items },
      {
        onSuccess: () => {
          toast.success("Transfer received");
          close();
        },
        onError: (e: Error) => toast.error(e.message ?? "Couldn't receive"),
      },
    );
  };

  const handleCancel = (t: StockTransfer) => {
    if (!confirm("Cancel this transfer?")) return;
    cancelTransfer.mutate(t.id, {
      onSuccess: () => toast.success("Transfer cancelled"),
      onError: (e: Error) => toast.error(e.message ?? "Couldn't cancel"),
    });
  };

  const handleDelete = (t: StockTransfer) => {
    if (t.status !== "pending") {
      toast.error("Only pending transfers can be deleted");
      return;
    }
    if (!confirm("Delete this pending transfer?")) return;
    deleteTransfer.mutate(t.id, {
      onSuccess: () => toast.success("Transfer deleted"),
      onError: (e: Error) => toast.error(e.message ?? "Couldn't delete"),
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Stock Transfers</h1>
          <p className="text-sm text-muted-foreground">
            Move stock between inventory locations
          </p>
        </div>
        <Button size="sm" onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> New Transfer
        </Button>
      </div>

      <div className="grid gap-3 grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label} className="border-border/50">
            <CardContent className="p-3 sm:p-4">
              <p className="text-2xl font-semibold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
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
                placeholder="Search transfers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 bg-muted/50 border-0"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(v) => {
                setStatusFilter(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-40 h-9 bg-muted/50 border-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-transit">In Transit</SelectItem>
                <SelectItem value="received">Received</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {transfersQuery.isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : filteredTransfers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ArrowRightLeft className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">No transfers yet</p>
              <Button variant="outline" size="sm" className="mt-3" onClick={openCreate}>
                Create your first transfer
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredTransfers.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between p-4 border rounded-lg gap-3 hover:bg-muted/40 transition-colors cursor-pointer"
                  onClick={() => openView(t)}
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">
                        {locationsById.get(t.fromLocationId) ?? "—"}
                      </p>
                      <ArrowRightLeft className="h-3 w-3 text-muted-foreground" />
                      <p className="font-medium text-sm">
                        {locationsById.get(t.toLocationId) ?? "—"}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {t.totalItems} item{t.totalItems !== 1 ? "s" : ""} • {ngn(t.totalValue)} •{" "}
                      {formatDistanceToNow(new Date(t.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge
                      variant="secondary"
                      className={`text-xs capitalize ${statusColor[t.status]}`}
                    >
                      {t.status}
                    </Badge>
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
                ? "New Stock Transfer"
                : sheetMode === "receive"
                  ? "Receive Transfer"
                  : "Transfer Details"}
            </SheetTitle>
          </SheetHeader>

          {sheetMode === "view" && selected ? (
            <div className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <Badge
                  variant="secondary"
                  className={`text-xs capitalize ${statusColor[selected.status]}`}
                >
                  {selected.status}
                </Badge>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(selected.createdAt), "PPp")}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">From</p>
                  <p className="font-medium">{locationsById.get(selected.fromLocationId) ?? "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">To</p>
                  <p className="font-medium">{locationsById.get(selected.toLocationId) ?? "—"}</p>
                </div>
                {selected.requestedByName && (
                  <div>
                    <p className="text-xs text-muted-foreground">Requested by</p>
                    <p className="font-medium">{selected.requestedByName}</p>
                  </div>
                )}
                {selected.approvedAt && (
                  <div>
                    <p className="text-xs text-muted-foreground">Approved</p>
                    <p className="font-medium">
                      {format(new Date(selected.approvedAt), "PPp")}
                    </p>
                  </div>
                )}
                {selected.receivedAt && (
                  <div>
                    <p className="text-xs text-muted-foreground">Received</p>
                    <p className="font-medium">
                      {format(new Date(selected.receivedAt), "PPp")}
                    </p>
                  </div>
                )}
              </div>
              {selected.notes && (
                <div className="text-sm">
                  <p className="text-xs text-muted-foreground mb-1">Notes</p>
                  <p>{selected.notes}</p>
                </div>
              )}
              <div className="space-y-2 pt-3 border-t">
                <p className="text-sm font-medium">Items</p>
                {selected.items.map((i) => (
                  <div key={i.id} className="flex justify-between p-2 border rounded text-sm">
                    <div>
                      <p className="font-medium">{i.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {i.quantity} {i.unit}
                        {i.receivedQuantity != null && (
                          <> · received {i.receivedQuantity} {i.unit}</>
                        )}
                      </p>
                    </div>
                    <p className="text-right font-medium">{ngn(i.totalCost)}</p>
                  </div>
                ))}
                <div className="flex justify-between pt-2 border-t font-medium">
                  <span>Total Value</span>
                  <span>{ngn(selected.totalValue)}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-3 border-t">
                {selected.status === "pending" && (
                  <>
                    <Button
                      onClick={() => handleApprove(selected)}
                      disabled={approveTransfer.isPending}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" /> Approve
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleCancel(selected)}
                      disabled={cancelTransfer.isPending}
                    >
                      <XCircle className="h-4 w-4 mr-2" /> Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(selected)}
                      disabled={deleteTransfer.isPending}
                    >
                      <Trash2 className="h-4 w-4 mr-2" /> Delete
                    </Button>
                  </>
                )}
                {selected.status === "in-transit" && (
                  <>
                    <Button onClick={() => openReceive(selected)}>
                      <PackageCheck className="h-4 w-4 mr-2" /> Receive
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleCancel(selected)}
                      disabled={cancelTransfer.isPending}
                    >
                      <XCircle className="h-4 w-4 mr-2" /> Cancel
                    </Button>
                  </>
                )}
              </div>
            </div>
          ) : sheetMode === "receive" && selected ? (
            <div className="space-y-4 mt-4">
              <p className="text-sm text-muted-foreground">
                Confirm received quantities for each item:
              </p>
              {selected.items.map((i) => (
                <div key={i.id} className="border rounded-lg p-3 space-y-2">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium text-sm">{i.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Shipped: {i.quantity} {i.unit}
                      </p>
                    </div>
                  </div>
                  <Input
                    type="number"
                    value={receiveQuantities[i.id] ?? ""}
                    onChange={(e) =>
                      setReceiveQuantities({
                        ...receiveQuantities,
                        [i.id]: e.target.value,
                      })
                    }
                  />
                </div>
              ))}
              <div className="flex gap-2 pt-3 border-t">
                <Button variant="outline" className="flex-1" onClick={close}>
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleReceive}
                  disabled={receiveTransfer.isPending}
                >
                  Confirm Receipt
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>From</Label>
                  <Select value={fromLocationId} onValueChange={setFromLocationId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Source" />
                    </SelectTrigger>
                    <SelectContent>
                      {(locationsQuery.data?.data ?? []).map((l) => (
                        <SelectItem key={l.id} value={l.id}>
                          {l.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>To</Label>
                  <Select value={toLocationId} onValueChange={setToLocationId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Destination" />
                    </SelectTrigger>
                    <SelectContent>
                      {(locationsQuery.data?.data ?? []).map((l) => (
                        <SelectItem key={l.id} value={l.id}>
                          {l.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Items</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setLines([...lines, { ingredientId: "", quantity: "" }])
                    }
                  >
                    <Plus className="h-3 w-3 mr-1" /> Add row
                  </Button>
                </div>
                {lines.map((line, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-12 gap-2 items-end border rounded p-2"
                  >
                    <div className="col-span-7 space-y-1">
                      <Label className="text-xs">Ingredient</Label>
                      <Select
                        value={line.ingredientId}
                        onValueChange={(v) =>
                          setLines(
                            lines.map((l, i) =>
                              i === idx ? { ...l, ingredientId: v } : l,
                            ),
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pick an ingredient" />
                        </SelectTrigger>
                        <SelectContent>
                          {(ingredientsQuery.data?.data ?? []).map((i) => (
                            <SelectItem key={i.id} value={i.id}>
                              {i.name} ({Number(i.currentStock)} {i.unit})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-3 space-y-1">
                      <Label className="text-xs">Quantity</Label>
                      <Input
                        type="number"
                        value={line.quantity}
                        onChange={(e) =>
                          setLines(
                            lines.map((l, i) =>
                              i === idx ? { ...l, quantity: e.target.value } : l,
                            ),
                          )
                        }
                      />
                    </div>
                    <div className="col-span-2 flex justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setLines(lines.filter((_, i) => i !== idx))}
                        disabled={lines.length === 1}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <SheetFooter className="flex-col sm:flex-row gap-2">
                <Button variant="outline" className="w-full sm:w-auto" onClick={close}>
                  Cancel
                </Button>
                <Button
                  className="w-full sm:w-auto"
                  onClick={handleCreate}
                  disabled={createTransfer.isPending}
                >
                  Create Transfer
                </Button>
              </SheetFooter>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
