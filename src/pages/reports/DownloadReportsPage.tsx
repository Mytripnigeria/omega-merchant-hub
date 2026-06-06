import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileSpreadsheet,
  FileText,
  Calendar,
  Loader2,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { apiDownload } from "@/lib/api-client";
import { useStore } from "@/contexts/StoreContext";

type ExportType =
  | "sales"
  | "top-products"
  | "food-cost"
  | "waste"
  | "stock";

interface ReportSpec {
  type: ExportType;
  title: string;
  description: string;
  needsRange: boolean;
}

const REPORTS: ReportSpec[] = [
  {
    type: "sales",
    title: "Sales Report",
    description: "Daily revenue, orders, items, channel split for a date range.",
    needsRange: true,
  },
  {
    type: "top-products",
    title: "Best Sellers",
    description: "Top-selling products by revenue, with units and order counts.",
    needsRange: true,
  },
  {
    type: "food-cost",
    title: "Food Cost Analysis",
    description: "Cost vs. revenue per item and per category.",
    needsRange: true,
  },
  {
    type: "waste",
    title: "Waste Management",
    description: "Waste entries logged from the workstation, by reason and ingredient.",
    needsRange: true,
  },
  {
    type: "stock",
    title: "Stock Report",
    description: "Current inventory snapshot — value, status, expiring soon.",
    needsRange: false,
  },
];

function buildQs(params: Record<string, string | undefined>): string {
  const usp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "") usp.set(k, v);
  }
  const s = usp.toString();
  return s ? `?${s}` : "";
}

function defaultRange(): { from: string; to: string } {
  const now = new Date();
  const from = new Date(now.getFullYear(), now.getMonth(), 1);
  const iso = (d: Date) => d.toISOString().slice(0, 10);
  return { from: iso(from), to: iso(now) };
}

type PeriodPreset = "this_week" | "this_month" | "last_month" | "this_quarter" | "custom";

function rangeFor(preset: PeriodPreset, custom: { from: string; to: string }): {
  from: string;
  to: string;
} {
  if (preset === "custom") return custom;
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  const d = now.getDate();
  const iso = (date: Date) => date.toISOString().slice(0, 10);
  if (preset === "this_week") {
    const start = new Date(y, m, d - now.getDay());
    return { from: iso(start), to: iso(now) };
  }
  if (preset === "last_month") {
    const start = new Date(y, m - 1, 1);
    const end = new Date(y, m, 0);
    return { from: iso(start), to: iso(end) };
  }
  if (preset === "this_quarter") {
    const q = Math.floor(m / 3) * 3;
    return { from: iso(new Date(y, q, 1)), to: iso(now) };
  }
  // this_month
  return { from: iso(new Date(y, m, 1)), to: iso(now) };
}

export default function DownloadReportsPage() {
  const { currentStore } = useStore();
  const storeId = currentStore?.id;

  const [preset, setPreset] = useState<PeriodPreset>("this_month");
  const [custom, setCustom] = useState(defaultRange());
  const [downloading, setDownloading] = useState<{
    type: ExportType;
    format: "xlsx" | "pdf";
  } | null>(null);

  const range = rangeFor(preset, custom);

  const handleDownload = async (
    type: ExportType,
    needsRange: boolean,
    format: "xlsx" | "pdf",
  ) => {
    if (!storeId) {
      toast.error("Pick a store first");
      return;
    }
    setDownloading({ type, format });
    const qs = buildQs({
      type,
      format,
      storeId,
      storeName: currentStore?.name,
      ...(needsRange ? { dateFrom: range.from, dateTo: range.to } : {}),
    });
    try {
      await apiDownload(`/reports/export${qs}`);
      toast.success(`${format.toUpperCase()} downloaded`);
    } catch (err) {
      toast.error((err as Error).message ?? "Couldn't download report");
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Download Reports</h1>
        <p className="text-sm text-muted-foreground">
          Generate Excel (.xlsx) exports of any report for a date range
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Date range
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Period</Label>
              <Select
                value={preset}
                onValueChange={(v) => setPreset(v as PeriodPreset)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="this_week">This week</SelectItem>
                  <SelectItem value="this_month">This month</SelectItem>
                  <SelectItem value="last_month">Last month</SelectItem>
                  <SelectItem value="this_quarter">This quarter</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">From</Label>
              <Input
                type="date"
                value={preset === "custom" ? custom.from : range.from}
                onChange={(e) => {
                  setPreset("custom");
                  setCustom((c) => ({ ...c, from: e.target.value }));
                }}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">To</Label>
              <Input
                type="date"
                value={preset === "custom" ? custom.to : range.to}
                onChange={(e) => {
                  setPreset("custom");
                  setCustom((c) => ({ ...c, to: e.target.value }));
                }}
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Stock Report is a live snapshot and ignores the date range.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-3 md:grid-cols-2">
        {REPORTS.map((r) => {
          const xlsxBusy =
            downloading?.type === r.type && downloading.format === "xlsx";
          const pdfBusy =
            downloading?.type === r.type && downloading.format === "pdf";
          return (
            <Card key={r.type}>
              <CardContent className="p-4 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <FileSpreadsheet className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm">{r.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {r.description}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={xlsxBusy || pdfBusy || !storeId}
                    onClick={() => handleDownload(r.type, r.needsRange, "xlsx")}
                  >
                    {xlsxBusy ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <FileSpreadsheet className="h-4 w-4 sm:mr-2 text-green-600 dark:text-green-400" />
                        <span className="hidden sm:inline">Excel</span>
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={xlsxBusy || pdfBusy || !storeId}
                    onClick={() => handleDownload(r.type, r.needsRange, "pdf")}
                  >
                    {pdfBusy ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <FileText className="h-4 w-4 sm:mr-2 text-red-600 dark:text-red-400" />
                        <span className="hidden sm:inline">PDF</span>
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-dashed bg-muted/30">
        <CardContent className="p-4 flex items-start gap-3">
          <Sparkles className="h-4 w-4 text-muted-foreground mt-1 shrink-0" />
          <div className="text-xs text-muted-foreground space-y-1">
            <p>
              Each export is a real-time aggregation of orders, ingredients, and
              movements — there's nothing to schedule.
            </p>
            <p>
              Filenames carry the report type, date range, and download date so
              you can keep multiple versions in your downloads folder without
              confusion.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
