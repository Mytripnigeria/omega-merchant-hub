import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { TablePagination } from "@/components/ui/table-pagination";
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
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Plus,
  Mail,
  Phone,
  MapPin,
  Wallet,
  Gift,
  Users,
  ShoppingBag,
  Star,
  Trash2,
  Edit,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import {
  useCustomers,
  useCustomerStats,
  useCustomerOrders,
  useWalletTransactions,
  usePointsTransactions,
  useCreateCustomer,
  useUpdateCustomer,
  useDeleteCustomer,
  useCreditWallet,
  useDebitWallet,
  useAddPoints,
  useRedeemPoints,
} from "@/hooks/api/use-customers";
import type {
  Customer,
  CreateCustomerRequest,
  CustomerSource,
  CustomerStatus,
  LoyaltyTier,
} from "@/types/customers";

const ALL = "__all__";

const statusColor: Record<CustomerStatus, string> = {
  active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  vip: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  inactive: "bg-gray-100 text-gray-600 dark:bg-gray-800/50 dark:text-gray-400",
};

const tierColor: Record<LoyaltyTier, string> = {
  bronze: "bg-amber-100 text-amber-800",
  silver: "bg-slate-200 text-slate-800",
  gold: "bg-yellow-100 text-yellow-800",
  platinum: "bg-indigo-100 text-indigo-800",
};

interface CustomerForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthday: string;
  gender: string;
  country: string;
  state: string;
  city: string;
  street: string;
  zipCode: string;
  source: CustomerSource;
  notes: string;
}

function emptyForm(): CustomerForm {
  return {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    birthday: "",
    gender: "",
    country: "Nigeria",
    state: "",
    city: "",
    street: "",
    zipCode: "",
    source: "walk-in",
    notes: "",
  };
}

function customerToForm(c: Customer): CustomerForm {
  return {
    firstName: c.firstName,
    lastName: c.lastName,
    email: c.email ?? "",
    phone: c.phone ?? "",
    birthday: c.birthday ?? "",
    gender: c.gender ?? "",
    country: c.country ?? "",
    state: c.state ?? "",
    city: c.city ?? "",
    street: c.street ?? "",
    zipCode: c.zipCode ?? "",
    source: c.source,
    notes: c.notes ?? "",
  };
}

function ngn(n: number): string {
  return `₦${n.toLocaleString()}`;
}

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>(ALL);
  const [tierFilter, setTierFilter] = useState<string>(ALL);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [selected, setSelected] = useState<Customer | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<"view" | "create" | "edit">("view");
  const [form, setForm] = useState<CustomerForm>(emptyForm());

  const [walletAmount, setWalletAmount] = useState("");
  const [walletDescription, setWalletDescription] = useState("");
  const [pointsAmount, setPointsAmount] = useState("");
  const [pointsDescription, setPointsDescription] = useState("");

  const customersQuery = useCustomers({
    search: search || undefined,
    status: statusFilter === ALL ? undefined : (statusFilter as CustomerStatus),
    loyaltyTier: tierFilter === ALL ? undefined : (tierFilter as LoyaltyTier),
    page,
    limit: pageSize,
  });
  const statsQuery = useCustomerStats();
  const orders = useCustomerOrders(selected?.id ?? "");
  const wallet = useWalletTransactions(selected?.id ?? "");
  const points = usePointsTransactions(selected?.id ?? "");

  const createCustomer = useCreateCustomer();
  const updateCustomer = useUpdateCustomer();
  const deleteCustomer = useDeleteCustomer();
  const creditWallet = useCreditWallet();
  const debitWallet = useDebitWallet();
  const addPoints = useAddPoints();
  const redeemPoints = useRedeemPoints();

  const customers = customersQuery.data?.data ?? [];
  const total = customersQuery.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, total);

  const stats = useMemo(() => {
    const s = statsQuery.data;
    return [
      { label: "Total Customers", value: s ? String(s.total) : "—", icon: Users },
      { label: "Active", value: s ? String(s.active) : "—", icon: ShoppingBag },
      { label: "VIP", value: s ? String(s.vip) : "—", icon: Star },
      { label: "New This Month", value: s ? String(s.newThisMonth) : "—", icon: Plus },
    ];
  }, [statsQuery.data]);

  const openCreate = () => {
    setSelected(null);
    setForm(emptyForm());
    setSheetMode("create");
    setSheetOpen(true);
  };
  const openView = (c: Customer) => {
    setSelected(c);
    setForm(customerToForm(c));
    setSheetMode("view");
    setSheetOpen(true);
  };
  const openEdit = (c: Customer) => {
    setSelected(c);
    setForm(customerToForm(c));
    setSheetMode("edit");
    setSheetOpen(true);
  };
  const close = () => {
    setSheetOpen(false);
    setSelected(null);
    setWalletAmount("");
    setWalletDescription("");
    setPointsAmount("");
    setPointsDescription("");
  };

  const buildPayload = (): CreateCustomerRequest => ({
    firstName: form.firstName,
    lastName: form.lastName,
    email: form.email || undefined,
    phone: form.phone || undefined,
    birthday: form.birthday || undefined,
    gender: form.gender || undefined,
    country: form.country || undefined,
    state: form.state || undefined,
    city: form.city || undefined,
    street: form.street || undefined,
    zipCode: form.zipCode || undefined,
    source: form.source,
    notes: form.notes || undefined,
  });

  const handleCreate = () => {
    if (!form.firstName.trim() || !form.lastName.trim()) {
      toast.error("First and last name are required");
      return;
    }
    if (!form.email && !form.phone) {
      toast.error("Provide at least an email or phone");
      return;
    }
    createCustomer.mutate(buildPayload(), {
      onSuccess: () => {
        toast.success("Customer added");
        close();
      },
      onError: (e: Error) => toast.error(e.message ?? "Couldn't create customer"),
    });
  };

  const handleUpdate = () => {
    if (!selected) return;
    updateCustomer.mutate(
      { id: selected.id, data: buildPayload() },
      {
        onSuccess: () => {
          toast.success("Customer updated");
          close();
        },
        onError: (e: Error) => toast.error(e.message ?? "Couldn't update"),
      },
    );
  };

  const handleDelete = () => {
    if (!selected) return;
    if (!confirm(`Delete ${selected.firstName} ${selected.lastName}?`)) return;
    deleteCustomer.mutate(selected.id, {
      onSuccess: () => {
        toast.success("Customer deleted");
        close();
      },
      onError: (e: Error) => toast.error(e.message ?? "Couldn't delete"),
    });
  };

  const handleStatus = (status: CustomerStatus) => {
    if (!selected) return;
    updateCustomer.mutate(
      { id: selected.id, data: { status } },
      {
        onSuccess: (next) => {
          toast.success(`Marked ${status}`);
          setSelected(next);
        },
        onError: (e: Error) => toast.error(e.message ?? "Couldn't update status"),
      },
    );
  };

  const handleCreditWallet = (kind: "credit" | "debit") => {
    if (!selected) return;
    const amount = Number(walletAmount);
    if (!amount || amount <= 0 || !walletDescription.trim()) {
      toast.error("Amount and description are required");
      return;
    }
    const fn = kind === "credit" ? creditWallet : debitWallet;
    fn.mutate(
      {
        customerId: selected.id,
        amount,
        description: walletDescription,
      },
      {
        onSuccess: () => {
          toast.success(`Wallet ${kind}ed`);
          setWalletAmount("");
          setWalletDescription("");
        },
        onError: (e: Error) => toast.error(e.message ?? "Couldn't update wallet"),
      },
    );
  };

  const handlePoints = (kind: "add" | "redeem") => {
    if (!selected) return;
    const pts = Number(pointsAmount);
    if (!pts || pts <= 0 || !pointsDescription.trim()) {
      toast.error("Points and description are required");
      return;
    }
    const fn = kind === "add" ? addPoints : redeemPoints;
    fn.mutate(
      {
        customerId: selected.id,
        points: pts,
        description: pointsDescription,
      },
      {
        onSuccess: () => {
          toast.success(`Points ${kind === "add" ? "added" : "redeemed"}`);
          setPointsAmount("");
          setPointsDescription("");
        },
        onError: (e: Error) => toast.error(e.message ?? "Couldn't update points"),
      },
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Customers</h1>
          <p className="text-sm text-muted-foreground">
            Manage customer profiles, wallets and loyalty
          </p>
        </div>
        <Button size="sm" onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> Add Customer
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
                placeholder="Search by name, email, phone..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
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
              <SelectTrigger className="w-full sm:w-32 h-9 bg-muted/50 border-0">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="vip">VIP</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={tierFilter}
              onValueChange={(v) => {
                setTierFilter(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-36 h-9 bg-muted/50 border-0">
                <SelectValue placeholder="Tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All Tiers</SelectItem>
                <SelectItem value="bronze">Bronze</SelectItem>
                <SelectItem value="silver">Silver</SelectItem>
                <SelectItem value="gold">Gold</SelectItem>
                <SelectItem value="platinum">Platinum</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {customersQuery.isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : customers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">No customers yet</p>
              <Button variant="outline" size="sm" className="mt-3" onClick={openCreate}>
                Add your first customer
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-xs font-medium text-muted-foreground p-3">
                      Customer
                    </th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-3">
                      Contact
                    </th>
                    <th className="text-right text-xs font-medium text-muted-foreground p-3">
                      Orders
                    </th>
                    <th className="text-right text-xs font-medium text-muted-foreground p-3">
                      Spent
                    </th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-3">
                      Tier
                    </th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-3">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c) => {
                    const fullName = `${c.firstName} ${c.lastName}`.trim();
                    return (
                      <tr
                        key={c.id}
                        className="border-b border-border last:border-0 cursor-pointer hover:bg-muted/50"
                        onClick={() => openView(c)}
                      >
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-muted text-xs">
                                {fullName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{fullName}</p>
                              <p className="text-xs text-muted-foreground capitalize">
                                {c.source.replace("-", " ")}
                                {c.hasUserAccount ? " • storefront" : ""}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-sm">
                          <p className="truncate">{c.email ?? "—"}</p>
                          <p className="text-xs text-muted-foreground">{c.phone ?? "—"}</p>
                        </td>
                        <td className="p-3 text-sm text-right">{c.totalOrders}</td>
                        <td className="p-3 text-sm font-medium text-right">
                          {ngn(c.totalSpent)}
                        </td>
                        <td className="p-3">
                          <Badge
                            variant="secondary"
                            className={cn("text-xs font-normal capitalize", tierColor[c.loyaltyTier])}
                          >
                            {c.loyaltyTierName ?? c.loyaltyTier}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <Badge
                            variant="secondary"
                            className={cn("text-xs font-normal capitalize", statusColor[c.status])}
                          >
                            {c.status}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
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
          <SheetHeader className="pb-4 border-b">
            <SheetTitle>
              {sheetMode === "create"
                ? "Add Customer"
                : sheetMode === "edit"
                  ? "Edit Customer"
                  : selected
                    ? `${selected.firstName} ${selected.lastName}`
                    : "Customer"}
            </SheetTitle>
            {sheetMode === "view" && selected && (
              <SheetDescription>
                {selected.email ?? selected.phone ?? "—"} • Joined{" "}
                {format(new Date(selected.createdAt), "MMM d, yyyy")}
              </SheetDescription>
            )}
          </SheetHeader>

          {sheetMode === "view" && selected ? (
            <Tabs defaultValue="overview" className="mt-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="wallet">Wallet</TabsTrigger>
                <TabsTrigger value="points">Points</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4 mt-4">
                <div className="grid gap-3 text-sm">
                  {selected.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      {selected.email}
                    </div>
                  )}
                  {selected.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      {selected.phone}
                    </div>
                  )}
                  {(selected.city || selected.state || selected.country) && (
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <span>
                        {[selected.street, selected.city, selected.state, selected.country]
                          .filter(Boolean)
                          .join(", ")}
                      </span>
                    </div>
                  )}
                  {selected.birthday && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Birthday</span>
                      <span>{format(new Date(selected.birthday), "MMM d")}</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                  <div className="p-3 border rounded-lg text-center">
                    <p className="text-2xl font-semibold">{selected.totalOrders}</p>
                    <p className="text-xs text-muted-foreground">Orders</p>
                  </div>
                  <div className="p-3 border rounded-lg text-center">
                    <p className="text-2xl font-semibold">{ngn(selected.totalSpent)}</p>
                    <p className="text-xs text-muted-foreground">Total Spent</p>
                  </div>
                  <div className="p-3 border rounded-lg text-center">
                    <p className="text-2xl font-semibold">{ngn(selected.walletBalance)}</p>
                    <p className="text-xs text-muted-foreground">Wallet</p>
                  </div>
                  <div className="p-3 border rounded-lg text-center">
                    <p className="text-2xl font-semibold">{selected.points}</p>
                    <p className="text-xs text-muted-foreground">Points</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t text-sm">
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-xs">Status</p>
                    <Select
                      value={selected.status}
                      onValueChange={(v) => handleStatus(v as CustomerStatus)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="vip">VIP</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-xs">Referral Code</p>
                    <p className="font-mono">{selected.referralCode}</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-3 border-t">
                  <Button variant="outline" className="flex-1" onClick={() => openEdit(selected)}>
                    <Edit className="h-4 w-4 mr-2" /> Edit
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={handleDelete}
                    disabled={deleteCustomer.isPending}
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="orders" className="space-y-3 mt-4">
                {orders.isLoading ? (
                  <Skeleton className="h-40 w-full" />
                ) : (orders.data?.data ?? []).length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6">
                    No orders yet
                  </p>
                ) : (
                  (orders.data?.data ?? []).map((o) => (
                    <div
                      key={o.id}
                      className="flex justify-between p-3 border rounded-lg text-sm"
                    >
                      <div>
                        <p className="font-medium">#{o.orderNumber}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(o.createdAt), "MMM d, yyyy")} • {o.channel}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{ngn(o.total)}</p>
                        <Badge variant="outline" className="text-xs mt-1">
                          {o.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>

              <TabsContent value="wallet" className="space-y-4 mt-4">
                <div className="p-4 border rounded-lg flex items-center gap-3">
                  <Wallet className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-2xl font-semibold">{ngn(selected.walletBalance)}</p>
                    <p className="text-xs text-muted-foreground">Current balance</p>
                  </div>
                </div>
                <div className="space-y-2 border rounded-lg p-3">
                  <Input
                    placeholder="Amount (₦)"
                    type="number"
                    value={walletAmount}
                    onChange={(e) => setWalletAmount(e.target.value)}
                  />
                  <Input
                    placeholder="Description"
                    value={walletDescription}
                    onChange={(e) => setWalletDescription(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleCreditWallet("credit")}
                      disabled={creditWallet.isPending}
                      className="flex-1"
                    >
                      Credit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCreditWallet("debit")}
                      disabled={debitWallet.isPending}
                      className="flex-1"
                    >
                      Debit
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Recent transactions</p>
                  {wallet.isLoading ? (
                    <Skeleton className="h-24 w-full" />
                  ) : (wallet.data ?? []).length === 0 ? (
                    <p className="text-sm text-muted-foreground">No transactions</p>
                  ) : (
                    (wallet.data ?? []).slice(0, 8).map((t) => (
                      <div key={t.id} className="flex justify-between text-sm border-b py-1.5">
                        <div>
                          <p>{t.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(t.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                        <span
                          className={
                            t.type === "credit" ? "text-green-600" : "text-red-600"
                          }
                        >
                          {t.type === "credit" ? "+" : "-"}
                          {ngn(t.amount)}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="points" className="space-y-4 mt-4">
                <div className="p-4 border rounded-lg flex items-center gap-3">
                  <Gift className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-2xl font-semibold">{selected.points}</p>
                    <p className="text-xs text-muted-foreground">
                      Tier: {selected.loyaltyTierName ?? selected.loyaltyTier}
                    </p>
                  </div>
                </div>
                <div className="space-y-2 border rounded-lg p-3">
                  <Input
                    placeholder="Points"
                    type="number"
                    value={pointsAmount}
                    onChange={(e) => setPointsAmount(e.target.value)}
                  />
                  <Input
                    placeholder="Description"
                    value={pointsDescription}
                    onChange={(e) => setPointsDescription(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handlePoints("add")}
                      disabled={addPoints.isPending}
                      className="flex-1"
                    >
                      Add
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handlePoints("redeem")}
                      disabled={redeemPoints.isPending}
                      className="flex-1"
                    >
                      Redeem
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Recent transactions</p>
                  {points.isLoading ? (
                    <Skeleton className="h-24 w-full" />
                  ) : (points.data ?? []).length === 0 ? (
                    <p className="text-sm text-muted-foreground">No transactions</p>
                  ) : (
                    (points.data ?? []).slice(0, 8).map((t) => (
                      <div key={t.id} className="flex justify-between text-sm border-b py-1.5">
                        <div>
                          <p>{t.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(t.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                        <span
                          className={t.points >= 0 ? "text-green-600" : "text-red-600"}
                        >
                          {t.points >= 0 ? "+" : ""}
                          {t.points}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Birthday</Label>
                  <Input
                    type="date"
                    value={form.birthday}
                    onChange={(e) => setForm({ ...form, birthday: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Select
                    value={form.gender}
                    onValueChange={(v) => setForm({ ...form, gender: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Country</Label>
                  <Input
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>State</Label>
                  <Input
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Zip Code</Label>
                  <Input
                    value={form.zipCode}
                    onChange={(e) => setForm({ ...form, zipCode: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Street Address</Label>
                <Input
                  value={form.street}
                  onChange={(e) => setForm({ ...form, street: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Source</Label>
                <Select
                  value={form.source}
                  onValueChange={(v) => setForm({ ...form, source: v as CustomerSource })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="walk-in">Walk-in</SelectItem>
                    <SelectItem value="storefront">Storefront</SelectItem>
                    <SelectItem value="referral">Referral</SelectItem>
                    <SelectItem value="import">Import</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  rows={2}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </div>
            </div>
          )}

          {(sheetMode === "create" || sheetMode === "edit") && (
            <SheetFooter className="mt-4 pt-4 border-t flex-col sm:flex-row gap-2">
              <Button variant="outline" className="w-full sm:w-auto" onClick={close}>
                Cancel
              </Button>
              <Button
                className="w-full sm:w-auto"
                onClick={sheetMode === "create" ? handleCreate : handleUpdate}
                disabled={createCustomer.isPending || updateCustomer.isPending}
              >
                {sheetMode === "create" ? "Add Customer" : "Save Changes"}
              </Button>
            </SheetFooter>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
