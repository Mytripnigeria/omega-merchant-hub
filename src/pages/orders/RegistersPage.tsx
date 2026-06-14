import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Eye, Download, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";
import { useStore } from "@/contexts/StoreContext";
import { useCashSessions } from "@/hooks/api/use-cash-sessions";
import { useQueryClient } from "@tanstack/react-query";
import { cashSessionsService } from "@/services/api/cash-sessions";
import { cashSessionKeys } from "@/hooks/api/use-cash-sessions";
import type { CashSession } from "@/types/cash-sessions";

const fmt = (d: string | null) =>
  d ? new Date(d).toLocaleString() : "—";

export default function RegistersPage() {
  const { currentStore, isAllStoresMode } = useStore();
  const storeId = isAllStoresMode ? undefined : currentStore?.id;
  const { data, isLoading } = useCashSessions({ storeId, limit: 50 });
  const registers = data?.data ?? [];

  const qc = useQueryClient();
  const [selected, setSelected] = useState<CashSession | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDownload = async (id: string) => {
    setDownloading(true);
    try {
      const blob = await cashSessionsService.downloadReport(id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `register-${id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      toast.error((e as Error).message ?? "Download failed");
    } finally {
      setDownloading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      await cashSessionsService.remove(id);
      await qc.invalidateQueries({ queryKey: cashSessionKeys.all });
      toast.success("Register deleted");
      setSelected(null);
    } catch (e) {
      toast.error((e as Error).message ?? "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Registers</h1>
        <p className="text-sm text-muted-foreground">
          Cash register sessions across your stores
        </p>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Register Sessions</h2>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : registers.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              No register sessions yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Opened On</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead>Closed On</TableHead>
                  <TableHead className="text-right">Close Amount</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {registers.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{fmt(r.openedAt)}</TableCell>
                    <TableCell>{r.staffName}</TableCell>
                    <TableCell>
                      {r.closedAt ? (
                        fmt(r.closedAt)
                      ) : (
                        <Badge variant="secondary">Open</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatPrice(Number(r.actualTotal))}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setSelected(r)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Register Details</DialogTitle>
            <DialogDescription>
              {selected?.counterName ?? "Register session"}
            </DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-2 text-sm">
              <Row label="Counter" value={selected.counterName ?? "—"} />
              <Row label="Created By" value={selected.staffName} />
              <Row
                label="Opening Amount"
                value={formatPrice(Number(selected.openingFloat))}
              />
              <Row
                label="Closing Amount"
                value={formatPrice(Number(selected.actualTotal))}
              />
              <Row
                label="Staffs Joined In"
                value={(selected.staffsJoined ?? [selected.staffName]).join(", ")}
              />
              <Row label="Opened On" value={fmt(selected.openedAt)} />
              <Row label="Closed On" value={fmt(selected.closedAt)} />
              <Row label="Updated On" value={fmt(selected.updatedAt)} />
            </div>
          )}
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="destructive"
              onClick={() => selected && handleDelete(selected.id)}
              disabled={deleting}
            >
              {deleting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Delete Register
            </Button>
            <Button
              onClick={() => selected && handleDownload(selected.id)}
              disabled={downloading}
            >
              {downloading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              Download Register (PDF)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1 border-b last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  );
}
