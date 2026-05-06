import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Search,
  FileText,
  DollarSign,
  Calendar,
  Plus,
  Trash2,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { TablePagination } from "@/components/ui/table-pagination";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  usePayslips,
  useStaff,
  useCreatePayslip,
  useUpdatePayslip,
  useDeletePayslip,
  useApprovePayslip,
  useMarkPayslipPaid,
} from "@/hooks/api/use-hr";
import { useStore } from "@/contexts/StoreContext";
import type {
  Payslip,
  PayslipAdjustment,
  PayslipAdjustmentInput,
} from "@/types/hr";

const ALL = "__all__";
type SheetMode = "view" | "create" | "edit" | "mark-paid";

interface AdjustmentRow {
  id?: string;
  name: string;
  amount: string;
  type: PayslipAdjustment["type"];
  isDeduction: boolean;
}

interface PayslipForm {
  staffId: string;
  period: string;
  periodStart: string;
  periodEnd: string;
  baseSalary: string;
  hoursWorked: string;
  overtimeHours: string;
  overtimeRate: string;
  notes: string;
  adjustments: AdjustmentRow[];
}

interface MarkPaidForm {
  paymentDate: string;
  paymentMethod: NonNullable<Payslip["paymentMethod"]>;
  receiptUrl: string;
}

function emptyForm(): PayslipForm {
  const today = new Date();
  const period = format(today, "yyyy-MM");
  const start = format(new Date(today.getFullYear(), today.getMonth(), 1), "yyyy-MM-dd");
  const end = format(new Date(today.getFullYear(), today.getMonth() + 1, 0), "yyyy-MM-dd");
  return {
    staffId: "",
    period,
    periodStart: start,
    periodEnd: end,
    baseSalary: "0",
    hoursWorked: "",
    overtimeHours: "",
    overtimeRate: "",
    notes: "",
    adjustments: [],
  };
}

function payslipToForm(p: Payslip): PayslipForm {
  const adjustments: AdjustmentRow[] = [
    ...p.additions.map((a) => ({
      id: a.id,
      name: a.name,
      amount: String(a.amount),
      type: a.type,
      isDeduction: false,
    })),
    ...p.deductions.map((a) => ({
      id: a.id,
      name: a.name,
      amount: String(a.amount),
      type: a.type,
      isDeduction: true,
    })),
  ];
  return {
    staffId: p.staffId,
    period: p.period,
    periodStart: p.periodStart,
    periodEnd: p.periodEnd,
    baseSalary: String(p.baseSalary),
    hoursWorked: p.hoursWorked != null ? String(p.hoursWorked) : "",
    overtimeHours: p.overtimeHours != null ? String(p.overtimeHours) : "",
    overtimeRate: p.overtimeRate != null ? String(p.overtimeRate) : "",
    notes: p.notes ?? "",
    adjustments,
  };
}

function formToAdjustments(form: PayslipForm): PayslipAdjustmentInput[] {
  return form.adjustments
    .filter((a) => a.name.trim().length > 0 && Number(a.amount) > 0)
    .map((a) => ({
      name: a.name,
      amount: Number(a.amount),
      type: a.type,
      isDeduction: a.isDeduction,
    }));
}

function statusColor(status: Payslip["status"]): string {
  switch (status) {
    case "paid":
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    case "approved":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    case "pending":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
    case "draft":
      return "bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-300";
    case "cancelled":
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    default:
      return "";
  }
}

function ngn(amount: number): string {
  return `₦${amount.toLocaleString()}`;
}

export default function PayslipsPage() {
  const { currentStore } = useStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>(ALL);
  const [periodFilter, setPeriodFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<SheetMode>("view");
  const [selected, setSelected] = useState<Payslip | null>(null);
  const [form, setForm] = useState<PayslipForm>(emptyForm());
  const [paidForm, setPaidForm] = useState<MarkPaidForm>({
    paymentDate: format(new Date(), "yyyy-MM-dd"),
    paymentMethod: "bank",
    receiptUrl: "",
  });

  const payslipsQuery = usePayslips({
    storeId: currentStore?.id,
    status: statusFilter === ALL ? undefined : (statusFilter as Payslip["status"]),
    period: periodFilter || undefined,
    page,
    limit: pageSize,
  });
  const staffQuery = useStaff({ storeId: currentStore?.id, limit: 200 });

  const createPayslip = useCreatePayslip();
  const updatePayslip = useUpdatePayslip();
  const deletePayslip = useDeletePayslip();
  const approvePayslip = useApprovePayslip();
  const markPaid = useMarkPayslipPaid();

  const payslips = payslipsQuery.data?.data ?? [];
  const total = payslipsQuery.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, total);

  const filteredPayslips = useMemo(() => {
    if (!search.trim()) return payslips;
    const q = search.toLowerCase();
    return payslips.filter(
      (p) => p.staffName.toLowerCase().includes(q) || p.period.toLowerCase().includes(q),
    );
  }, [payslips, search]);

  const stats = useMemo(() => {
    const totalNet = payslips.reduce((sum, p) => sum + p.netPay, 0);
    const paid = payslips.filter((p) => p.status === "paid").length;
    const pending = payslips.filter(
      (p) => p.status === "pending" || p.status === "draft",
    ).length;
    return [
      { label: "Total Payslips", value: String(total), icon: FileText },
      { label: "Paid", value: String(paid), icon: CheckCircle2 },
      { label: "Pending", value: String(pending), icon: Calendar },
      { label: "Net Total", value: ngn(totalNet), icon: DollarSign },
    ];
  }, [payslips, total]);

  const openCreate = () => {
    setSelected(null);
    setForm(emptyForm());
    setSheetMode("create");
    setSheetOpen(true);
  };
  const openView = (p: Payslip) => {
    setSelected(p);
    setForm(payslipToForm(p));
    setSheetMode("view");
    setSheetOpen(true);
  };
  const openEdit = (p: Payslip) => {
    setSelected(p);
    setForm(payslipToForm(p));
    setSheetMode("edit");
    setSheetOpen(true);
  };
  const openMarkPaid = (p: Payslip) => {
    setSelected(p);
    setPaidForm({
      paymentDate: format(new Date(), "yyyy-MM-dd"),
      paymentMethod: "bank",
      receiptUrl: "",
    });
    setSheetMode("mark-paid");
    setSheetOpen(true);
  };
  const close = () => {
    setSheetOpen(false);
    setSelected(null);
  };

  const addAdjustment = (isDeduction: boolean) => {
    setForm({
      ...form,
      adjustments: [
        ...form.adjustments,
        {
          name: "",
          amount: "0",
          type: isDeduction ? "tax" : "allowance",
          isDeduction,
        },
      ],
    });
  };

  const updateAdjustment = (idx: number, patch: Partial<AdjustmentRow>) => {
    setForm({
      ...form,
      adjustments: form.adjustments.map((a, i) => (i === idx ? { ...a, ...patch } : a)),
    });
  };

  const removeAdjustment = (idx: number) => {
    setForm({
      ...form,
      adjustments: form.adjustments.filter((_, i) => i !== idx),
    });
  };

  const handleCreate = () => {
    if (!currentStore) {
      toast.error("Select a store first");
      return;
    }
    if (!form.staffId) {
      toast.error("Pick a staff member");
      return;
    }
    createPayslip.mutate(
      {
        storeId: currentStore.id,
        staffId: form.staffId,
        period: form.period,
        periodStart: form.periodStart,
        periodEnd: form.periodEnd,
        baseSalary: Number(form.baseSalary) || 0,
        hoursWorked: form.hoursWorked ? Number(form.hoursWorked) : undefined,
        overtimeHours: form.overtimeHours ? Number(form.overtimeHours) : undefined,
        overtimeRate: form.overtimeRate ? Number(form.overtimeRate) : undefined,
        notes: form.notes || undefined,
        adjustments: formToAdjustments(form),
      },
      {
        onSuccess: () => {
          toast.success("Payslip created");
          close();
        },
        onError: (e: Error) => toast.error(e.message ?? "Couldn't create payslip"),
      },
    );
  };

  const handleUpdate = () => {
    if (!selected) return;
    updatePayslip.mutate(
      {
        id: selected.id,
        data: {
          period: form.period,
          periodStart: form.periodStart,
          periodEnd: form.periodEnd,
          baseSalary: Number(form.baseSalary) || 0,
          hoursWorked: form.hoursWorked ? Number(form.hoursWorked) : undefined,
          overtimeHours: form.overtimeHours ? Number(form.overtimeHours) : undefined,
          overtimeRate: form.overtimeRate ? Number(form.overtimeRate) : undefined,
          notes: form.notes || undefined,
          adjustments: formToAdjustments(form),
        },
      },
      {
        onSuccess: () => {
          toast.success("Payslip updated");
          close();
        },
        onError: (e: Error) => toast.error(e.message ?? "Couldn't update payslip"),
      },
    );
  };

  const handleDelete = () => {
    if (!selected) return;
    if (!confirm(`Delete payslip for ${selected.staffName} (${selected.period})?`)) return;
    deletePayslip.mutate(selected.id, {
      onSuccess: () => {
        toast.success("Payslip deleted");
        close();
      },
      onError: (e: Error) => toast.error(e.message ?? "Couldn't delete payslip"),
    });
  };

  const handleApprove = () => {
    if (!selected) return;
    approvePayslip.mutate(selected.id, {
      onSuccess: (updated) => {
        toast.success(`Payslip ${updated.status}`);
        setSelected(updated);
      },
      onError: (e: Error) => toast.error(e.message ?? "Couldn't approve"),
    });
  };

  const handleMarkPaid = () => {
    if (!selected) return;
    markPaid.mutate(
      {
        id: selected.id,
        paymentDate: paidForm.paymentDate,
        paymentMethod: paidForm.paymentMethod,
        receiptUrl: paidForm.receiptUrl || undefined,
      },
      {
        onSuccess: () => {
          toast.success("Payslip marked paid");
          close();
        },
        onError: (e: Error) => toast.error(e.message ?? "Couldn't mark paid"),
      },
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Payslips</h1>
          <p className="text-sm text-muted-foreground">
            Generate and disburse staff payslips
          </p>
        </div>
        <Button size="sm" onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Create Payslip
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
        <CardHeader className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by staff or period..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 bg-muted/50 border-0"
              />
            </div>
            <Input
              type="month"
              placeholder="Period"
              value={periodFilter}
              onChange={(e) => {
                setPeriodFilter(e.target.value);
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
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {payslipsQuery.isLoading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : filteredPayslips.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">No payslips yet</p>
              <Button variant="outline" size="sm" className="mt-3" onClick={openCreate}>
                Create your first payslip
              </Button>
            </div>
          ) : (
            <>
              <div className="block sm:hidden divide-y divide-border">
                {filteredPayslips.map((p) => (
                  <div
                    key={p.id}
                    className="p-4 space-y-3 cursor-pointer hover:bg-muted/50"
                    onClick={() => openView(p)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar className="h-10 w-10 shrink-0">
                          <AvatarFallback className="bg-muted text-xs">
                            {p.staffName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-medium truncate">{p.staffName}</p>
                          <p className="text-xs text-muted-foreground">{p.period}</p>
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className={cn("text-xs font-normal shrink-0 capitalize", statusColor(p.status))}
                      >
                        {p.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Net Pay</span>
                      <span className="font-medium">{ngn(p.netPay)}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left text-xs font-medium text-muted-foreground p-4">Staff</th>
                      <th className="text-left text-xs font-medium text-muted-foreground p-4">Period</th>
                      <th className="text-right text-xs font-medium text-muted-foreground p-4">Gross</th>
                      <th className="text-right text-xs font-medium text-muted-foreground p-4">Net</th>
                      <th className="text-left text-xs font-medium text-muted-foreground p-4">Status</th>
                      <th className="text-left text-xs font-medium text-muted-foreground p-4">Paid</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayslips.map((p) => (
                      <tr
                        key={p.id}
                        className="border-b border-border last:border-0 cursor-pointer hover:bg-muted/50"
                        onClick={() => openView(p)}
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-muted text-xs">
                                {p.staffName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <p className="font-medium text-sm">{p.staffName}</p>
                          </div>
                        </td>
                        <td className="p-4 text-sm">{p.period}</td>
                        <td className="p-4 text-sm text-right">{ngn(p.grossPay)}</td>
                        <td className="p-4 text-sm font-medium text-right">{ngn(p.netPay)}</td>
                        <td className="p-4">
                          <Badge
                            variant="secondary"
                            className={cn("text-xs font-normal capitalize", statusColor(p.status))}
                          >
                            {p.status}
                          </Badge>
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">
                          {p.paymentDate ? format(new Date(p.paymentDate), "MMM d, yyyy") : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
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
          <SheetHeader className="space-y-1 pb-4 border-b">
            <SheetTitle>
              {sheetMode === "create"
                ? "Create Payslip"
                : sheetMode === "edit"
                  ? "Edit Payslip"
                  : sheetMode === "mark-paid"
                    ? "Mark as Paid"
                    : selected
                      ? `${selected.staffName} – ${selected.period}`
                      : "Payslip"}
            </SheetTitle>
            {sheetMode === "view" && selected && (
              <SheetDescription>
                {format(new Date(selected.periodStart), "MMM d")} –{" "}
                {format(new Date(selected.periodEnd), "MMM d, yyyy")}
              </SheetDescription>
            )}
          </SheetHeader>

          {sheetMode === "view" && selected ? (
            <div className="mt-4">
              <Tabs defaultValue="summary">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                  <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
                  <TabsTrigger value="payment">Payment</TabsTrigger>
                </TabsList>

                <TabsContent value="summary" className="space-y-4 mt-4">
                  <div className="grid gap-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Status</span>
                      <Badge className={cn("text-xs capitalize", statusColor(selected.status))}>
                        {selected.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Base Salary</span>
                      <span className="font-medium">{ngn(selected.baseSalary)}</span>
                    </div>
                    {selected.hoursWorked != null && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Hours Worked</span>
                        <span className="font-medium">{selected.hoursWorked}</span>
                      </div>
                    )}
                    {selected.overtimeHours ? (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Overtime</span>
                        <span className="font-medium">
                          {selected.overtimeHours}h × {ngn(selected.overtimeRate ?? 0)}
                        </span>
                      </div>
                    ) : null}
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Gross Pay</span>
                      <span className="font-medium">{ngn(selected.grossPay)}</span>
                    </div>
                    <div className="flex justify-between text-base">
                      <span className="font-medium">Net Pay</span>
                      <span className="font-semibold">{ngn(selected.netPay)}</span>
                    </div>
                  </div>
                  {selected.notes && (
                    <div className="pt-3 border-t text-sm">
                      <p className="text-muted-foreground text-xs mb-1">Notes</p>
                      <p>{selected.notes}</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="breakdown" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Additions</h4>
                    {selected.additions.length === 0 ? (
                      <p className="text-sm text-muted-foreground">None</p>
                    ) : (
                      selected.additions.map((a) => (
                        <div
                          key={a.id}
                          className="flex justify-between text-sm border rounded p-2"
                        >
                          <span>
                            {a.name} <span className="text-muted-foreground">({a.type})</span>
                          </span>
                          <span className="font-medium text-green-600">+{ngn(a.amount)}</span>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="space-y-2 pt-3 border-t">
                    <h4 className="text-sm font-medium text-muted-foreground">Deductions</h4>
                    {selected.deductions.length === 0 ? (
                      <p className="text-sm text-muted-foreground">None</p>
                    ) : (
                      selected.deductions.map((a) => (
                        <div
                          key={a.id}
                          className="flex justify-between text-sm border rounded p-2"
                        >
                          <span>
                            {a.name} <span className="text-muted-foreground">({a.type})</span>
                          </span>
                          <span className="font-medium text-red-600">-{ngn(a.amount)}</span>
                        </div>
                      ))
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="payment" className="space-y-3 mt-4 text-sm">
                  {selected.paymentDate ? (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Paid On</span>
                        <span className="font-medium">
                          {format(new Date(selected.paymentDate), "PPP")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Method</span>
                        <span className="font-medium capitalize">{selected.paymentMethod}</span>
                      </div>
                      {selected.receiptUrl && (
                        <div>
                          <a
                            href={selected.receiptUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary underline text-sm"
                          >
                            View receipt
                          </a>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-muted-foreground">Not yet paid.</p>
                  )}
                </TabsContent>
              </Tabs>

              <SheetFooter className="flex-col sm:flex-row gap-2 mt-6 pt-4 border-t">
                {selected.status === "draft" && (
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto"
                    onClick={() => openEdit(selected)}
                  >
                    Edit
                  </Button>
                )}
                {(selected.status === "draft" || selected.status === "pending") && (
                  <Button
                    className="w-full sm:w-auto"
                    onClick={handleApprove}
                    disabled={approvePayslip.isPending}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                )}
                {selected.status === "approved" && (
                  <Button
                    className="w-full sm:w-auto"
                    onClick={() => openMarkPaid(selected)}
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    Mark Paid
                  </Button>
                )}
                {selected.status === "draft" && (
                  <Button
                    variant="destructive"
                    className="w-full sm:w-auto"
                    onClick={handleDelete}
                    disabled={deletePayslip.isPending}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                )}
              </SheetFooter>
            </div>
          ) : sheetMode === "mark-paid" && selected ? (
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Payment Date</Label>
                <Input
                  type="date"
                  value={paidForm.paymentDate}
                  onChange={(e) =>
                    setPaidForm({ ...paidForm, paymentDate: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <Select
                  value={paidForm.paymentMethod}
                  onValueChange={(v) =>
                    setPaidForm({
                      ...paidForm,
                      paymentMethod: v as MarkPaidForm["paymentMethod"],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank">Bank Transfer</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="check">Check</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Receipt URL (optional)</Label>
                <Input
                  type="url"
                  placeholder="https://…"
                  value={paidForm.receiptUrl}
                  onChange={(e) => setPaidForm({ ...paidForm, receiptUrl: e.target.value })}
                />
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button variant="outline" className="flex-1" onClick={close}>
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleMarkPaid}
                  disabled={markPaid.isPending}
                >
                  Confirm Payment
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 mt-4">
              {sheetMode === "create" && (
                <div className="space-y-2">
                  <Label>Staff Member</Label>
                  <Select
                    value={form.staffId}
                    onValueChange={(v) => setForm({ ...form, staffId: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select staff" />
                    </SelectTrigger>
                    <SelectContent>
                      {(staffQuery.data?.data ?? []).map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.firstName} {s.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label>Period (YYYY-MM)</Label>
                  <Input
                    value={form.period}
                    onChange={(e) => setForm({ ...form, period: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Period Start</Label>
                  <Input
                    type="date"
                    value={form.periodStart}
                    onChange={(e) => setForm({ ...form, periodStart: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Period End</Label>
                  <Input
                    type="date"
                    value={form.periodEnd}
                    onChange={(e) => setForm({ ...form, periodEnd: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Base Salary (₦)</Label>
                <Input
                  type="number"
                  value={form.baseSalary}
                  onChange={(e) => setForm({ ...form, baseSalary: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label>Hours</Label>
                  <Input
                    type="number"
                    value={form.hoursWorked}
                    onChange={(e) => setForm({ ...form, hoursWorked: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>OT Hours</Label>
                  <Input
                    type="number"
                    value={form.overtimeHours}
                    onChange={(e) => setForm({ ...form, overtimeHours: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>OT Rate (₦)</Label>
                  <Input
                    type="number"
                    value={form.overtimeRate}
                    onChange={(e) => setForm({ ...form, overtimeRate: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t">
                <div className="flex items-center justify-between">
                  <Label>Adjustments</Label>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addAdjustment(false)}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add bonus
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addAdjustment(true)}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add deduction
                    </Button>
                  </div>
                </div>
                {form.adjustments.length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    No adjustments. Add bonuses, allowances, or deductions.
                  </p>
                ) : (
                  form.adjustments.map((a, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-12 gap-2 items-end border rounded-lg p-2"
                    >
                      <div className="col-span-4 space-y-1">
                        <Label className="text-xs">Name</Label>
                        <Input
                          value={a.name}
                          onChange={(e) => updateAdjustment(i, { name: e.target.value })}
                        />
                      </div>
                      <div className="col-span-3 space-y-1">
                        <Label className="text-xs">Amount</Label>
                        <Input
                          type="number"
                          value={a.amount}
                          onChange={(e) => updateAdjustment(i, { amount: e.target.value })}
                        />
                      </div>
                      <div className="col-span-3 space-y-1">
                        <Label className="text-xs">Type</Label>
                        <Select
                          value={a.type}
                          onValueChange={(v) =>
                            updateAdjustment(i, { type: v as PayslipAdjustment["type"] })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bonus">Bonus</SelectItem>
                            <SelectItem value="allowance">Allowance</SelectItem>
                            <SelectItem value="commission">Commission</SelectItem>
                            <SelectItem value="tax">Tax</SelectItem>
                            <SelectItem value="insurance">Insurance</SelectItem>
                            <SelectItem value="loan">Loan</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-2 flex justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeAdjustment(i)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                      <div className="col-span-12 text-xs text-muted-foreground">
                        {a.isDeduction ? "Deduction (subtracted)" : "Addition (added)"}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  rows={2}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button variant="outline" className="flex-1" onClick={close}>
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={sheetMode === "create" ? handleCreate : handleUpdate}
                  disabled={createPayslip.isPending || updatePayslip.isPending}
                >
                  {sheetMode === "create" ? "Create Payslip" : "Save Changes"}
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
