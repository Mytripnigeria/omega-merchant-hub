import { useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Banknote,
  CheckCircle2,
  Clock,
  DollarSign,
  Loader2,
  Plus,
  Trash2,
  Wallet as WalletIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import {
  useBankAccounts,
  useCreateBankAccount,
  useCreatePayout,
  useMerchantWallet,
  useMerchantWalletTransactions,
  usePayouts,
  usePayoutStats,
  useRemoveBankAccount,
  useUpdateBankAccount,
} from "@/hooks/api/use-payouts";
import type {
  Payout,
  PayoutBankAccount,
  PayoutStatus,
} from "@/types/payouts";

// Common Nigerian bank codes. Paystack accepts these as the `bankCode` when
// resolving NUBAN accounts. Kept short on purpose — admins who need a less
// common bank can request we expand the list.
const NIGERIAN_BANKS = [
  { code: "044", name: "Access Bank" },
  { code: "063", name: "Access Bank (Diamond)" },
  { code: "050", name: "Ecobank" },
  { code: "070", name: "Fidelity Bank" },
  { code: "011", name: "First Bank" },
  { code: "214", name: "First City Monument Bank (FCMB)" },
  { code: "058", name: "GTBank" },
  { code: "030", name: "Heritage Bank" },
  { code: "082", name: "Keystone Bank" },
  { code: "076", name: "Polaris Bank" },
  { code: "101", name: "Providus Bank" },
  { code: "221", name: "Stanbic IBTC" },
  { code: "068", name: "Standard Chartered" },
  { code: "232", name: "Sterling Bank" },
  { code: "100", name: "SunTrust Bank" },
  { code: "032", name: "Union Bank" },
  { code: "033", name: "UBA" },
  { code: "215", name: "Unity Bank" },
  { code: "035", name: "Wema Bank" },
  { code: "057", name: "Zenith Bank" },
  { code: "999991", name: "OPay" },
  { code: "50515", name: "Moniepoint" },
  { code: "50211", name: "Kuda Bank" },
  { code: "999992", name: "PalmPay" },
] as const;

function formatNaira(amount: number | string): string {
  const n = typeof amount === "string" ? Number(amount) : amount;
  if (!Number.isFinite(n)) return "₦0";
  return `₦${Math.round(n).toLocaleString()}`;
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleString("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function statusColor(status: PayoutStatus): string {
  switch (status) {
    case "success":
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    case "pending":
    case "queued":
    case "processing":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
    case "failed":
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    case "cancelled":
      return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
    default:
      return "";
  }
}

export default function PayoutsPage() {
  const { toast } = useToast();
  const { data: wallet, isLoading: walletLoading } = useMerchantWallet();
  const { data: stats } = usePayoutStats();
  const { data: payouts, isLoading: payoutsLoading } = usePayouts({
    page: 1,
    limit: 50,
  });
  const { data: bankAccounts, isLoading: banksLoading } = useBankAccounts();
  const { data: walletTxs } = useMerchantWalletTransactions({
    page: 1,
    limit: 25,
  });

  const createPayout = useCreatePayout();
  const createBank = useCreateBankAccount();
  const updateBank = useUpdateBankAccount();
  const removeBank = useRemoveBankAccount();

  const [requestOpen, setRequestOpen] = useState(false);
  const [addBankOpen, setAddBankOpen] = useState(false);
  const [selectedPayout, setSelectedPayout] = useState<Payout | null>(null);

  const defaultBankId = useMemo(
    () => bankAccounts?.find((b) => b.isDefault)?.id,
    [bankAccounts],
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
            Payouts
          </h1>
          <p className="text-sm text-muted-foreground">
            Withdraw your earnings to your bank account
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => {
              if (!bankAccounts || bankAccounts.length === 0) {
                toast({
                  title: "Add a bank account first",
                  description:
                    "You need at least one bank account before you can request a payout.",
                });
                setAddBankOpen(true);
                return;
              }
              setRequestOpen(true);
            }}
            disabled={!wallet || wallet.availableBalance <= 0}
          >
            <DollarSign className="h-4 w-4 mr-2" />
            Request Payout
          </Button>
        </div>
      </div>

      {/* Wallet stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-4 pt-6 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Available</p>
              {walletLoading ? (
                <Skeleton className="h-7 w-28 mt-1" />
              ) : (
                <p className="text-2xl font-bold">
                  {formatNaira(wallet?.availableBalance ?? 0)}
                </p>
              )}
              <p className="text-[11px] text-muted-foreground mt-1">
                Withdrawable now
              </p>
            </div>
            <WalletIcon className="h-8 w-8 text-muted-foreground" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 pt-6 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Reserved</p>
              {walletLoading ? (
                <Skeleton className="h-7 w-28 mt-1" />
              ) : (
                <p className="text-2xl font-bold">
                  {formatNaira(wallet?.reservedBalance ?? 0)}
                </p>
              )}
              <p className="text-[11px] text-muted-foreground mt-1">
                Earmarked for in-flight payouts
              </p>
            </div>
            <Clock className="h-8 w-8 text-muted-foreground" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 pt-6 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Total Paid Out</p>
              <p className="text-2xl font-bold">
                {formatNaira(stats?.totalPaidOut ?? 0)}
              </p>
              <p className="text-[11px] text-muted-foreground mt-1">
                {stats?.successCount ?? 0} successful payouts
              </p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-muted-foreground" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="payouts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
          <TabsTrigger value="banks">Bank Accounts</TabsTrigger>
          <TabsTrigger value="activity">Wallet Activity</TabsTrigger>
        </TabsList>

        {/* ─── Payouts ─────────────────────────────────────────────── */}
        <TabsContent value="payouts" className="space-y-3">
          <Card>
            <CardContent className="p-0">
              {payoutsLoading ? (
                <div className="p-6 space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : !payouts || payouts.data.length === 0 ? (
                <div className="p-12 text-center text-sm text-muted-foreground">
                  No payouts yet. Click <strong>Request Payout</strong> to
                  withdraw your earnings.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4 text-xs font-medium text-muted-foreground">
                          Reference
                        </th>
                        <th className="text-left p-4 text-xs font-medium text-muted-foreground">
                          Amount
                        </th>
                        <th className="text-left p-4 text-xs font-medium text-muted-foreground">
                          Bank
                        </th>
                        <th className="text-left p-4 text-xs font-medium text-muted-foreground">
                          Status
                        </th>
                        <th className="text-left p-4 text-xs font-medium text-muted-foreground">
                          Requested
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {payouts.data.map((p) => (
                        <tr
                          key={p.id}
                          className="border-b last:border-0 hover:bg-muted/50 cursor-pointer"
                          onClick={() => setSelectedPayout(p)}
                        >
                          <td className="p-4 font-mono text-xs">
                            {p.reference}
                          </td>
                          <td className="p-4 font-medium">
                            {formatNaira(p.amount)}
                          </td>
                          <td className="p-4 text-muted-foreground">
                            {p.bankAccount?.bankName ?? "—"}
                            {p.bankAccount
                              ? ` · ****${p.bankAccount.accountNumber.slice(-4)}`
                              : ""}
                          </td>
                          <td className="p-4">
                            <Badge className={statusColor(p.status)}>
                              {p.status}
                            </Badge>
                          </td>
                          <td className="p-4 text-muted-foreground text-xs">
                            {formatDate(p.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── Bank Accounts ───────────────────────────────────────── */}
        <TabsContent value="banks" className="space-y-3">
          <div className="flex justify-end">
            <Button size="sm" onClick={() => setAddBankOpen(true)}>
              <Plus className="h-4 w-4 mr-2" /> Add Bank Account
            </Button>
          </div>
          {banksLoading ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          ) : !bankAccounts || bankAccounts.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center text-sm text-muted-foreground">
                You haven't added any bank accounts yet.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {bankAccounts.map((b) => (
                <Card key={b.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Banknote className="h-4 w-4 text-muted-foreground" />
                        <CardTitle className="text-base">{b.label}</CardTitle>
                      </div>
                      {b.isDefault && (
                        <Badge variant="outline" className="text-xs">
                          Default
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm">
                      <p className="text-muted-foreground">
                        {b.bankName ?? "Bank"}
                      </p>
                      <p className="font-mono">{b.accountNumber}</p>
                      <p className="text-xs text-muted-foreground">
                        {b.accountName ?? "—"}
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-xs">
                        <Switch
                          checked={b.isDefault}
                          disabled={updateBank.isPending}
                          onCheckedChange={(v) => {
                            if (!v) return; // Can only promote a non-default
                            updateBank.mutate(
                              { id: b.id, payload: { isDefault: true } },
                              {
                                onSuccess: () =>
                                  toast({ title: "Default account updated" }),
                                onError: (err) =>
                                  toast({
                                    title: "Update failed",
                                    description: (err as Error).message,
                                    variant: "destructive",
                                  }),
                              },
                            );
                          }}
                        />
                        <span className="text-muted-foreground">
                          Set as default
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={removeBank.isPending}
                        onClick={() => {
                          if (
                            !confirm(`Remove ${b.label} (****${b.accountNumber.slice(-4)})?`)
                          )
                            return;
                          removeBank.mutate(b.id, {
                            onSuccess: () =>
                              toast({ title: "Bank account removed" }),
                            onError: (err) =>
                              toast({
                                title: "Remove failed",
                                description: (err as Error).message,
                                variant: "destructive",
                              }),
                          });
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ─── Wallet Activity ─────────────────────────────────────── */}
        <TabsContent value="activity" className="space-y-3">
          <Card>
            <CardContent className="p-0">
              {!walletTxs || walletTxs.data.length === 0 ? (
                <div className="p-12 text-center text-sm text-muted-foreground">
                  No wallet activity yet.
                </div>
              ) : (
                <div className="divide-y">
                  {walletTxs.data.map((tx) => (
                    <div
                      key={tx.id}
                      className="p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        {tx.type === "credit" ? (
                          <ArrowDownRight className="h-4 w-4 text-green-600" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4 text-red-600" />
                        )}
                        <div>
                          <p className="text-sm font-medium">
                            {tx.description}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {tx.reason.replace(/_/g, " ")} ·{" "}
                            {formatDate(tx.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-sm font-bold ${
                            tx.type === "credit"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {tx.type === "credit" ? "+" : "-"}
                          {formatNaira(tx.amount)}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          Balance {formatNaira(tx.balanceAfter)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ─── Request Payout dialog ─────────────────────────────────── */}
      <RequestPayoutDialog
        open={requestOpen}
        onOpenChange={setRequestOpen}
        wallet={wallet}
        bankAccounts={bankAccounts ?? []}
        defaultBankId={defaultBankId}
        onSubmit={(payload) =>
          createPayout.mutate(payload, {
            onSuccess: () => {
              toast({
                title: "Payout requested",
                description: "We'll process it shortly.",
              });
              setRequestOpen(false);
            },
            onError: (err) =>
              toast({
                title: "Payout failed",
                description: (err as Error).message,
                variant: "destructive",
              }),
          })
        }
        submitting={createPayout.isPending}
      />

      {/* ─── Add Bank Account dialog ──────────────────────────────── */}
      <AddBankAccountDialog
        open={addBankOpen}
        onOpenChange={setAddBankOpen}
        onSubmit={(payload) =>
          createBank.mutate(payload, {
            onSuccess: () => {
              toast({ title: "Bank account added" });
              setAddBankOpen(false);
            },
            onError: (err) =>
              toast({
                title: "Could not add bank account",
                description: (err as Error).message,
                variant: "destructive",
              }),
          })
        }
        submitting={createBank.isPending}
      />

      {/* ─── Payout detail sheet ───────────────────────────────────── */}
      <Sheet
        open={!!selectedPayout}
        onOpenChange={(open) => !open && setSelectedPayout(null)}
      >
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="font-mono text-base">
              {selectedPayout?.reference}
            </SheetTitle>
            <SheetDescription>
              Requested {formatDate(selectedPayout?.createdAt)}
            </SheetDescription>
          </SheetHeader>

          {selectedPayout && (
            <div className="mt-6 space-y-5">
              <div>
                <p className="text-xs text-muted-foreground">Amount</p>
                <p className="text-3xl font-bold">
                  {formatNaira(selectedPayout.amount)}
                </p>
                <Badge className={`mt-2 ${statusColor(selectedPayout.status)}`}>
                  {selectedPayout.status}
                </Badge>
              </div>

              <div className="space-y-2 pt-4 border-t text-sm">
                <DetailRow label="Bank">
                  {selectedPayout.bankAccount?.bankName ?? "—"}
                </DetailRow>
                <DetailRow label="Account">
                  {selectedPayout.bankAccount
                    ? `****${selectedPayout.bankAccount.accountNumber.slice(-4)}`
                    : "—"}
                </DetailRow>
                <DetailRow label="Account name">
                  {selectedPayout.bankAccount?.accountName ?? "—"}
                </DetailRow>
                <DetailRow label="Queued">
                  {formatDate(selectedPayout.queuedAt)}
                </DetailRow>
                <DetailRow label="Processing">
                  {formatDate(selectedPayout.processingAt)}
                </DetailRow>
                <DetailRow label="Settled">
                  {formatDate(selectedPayout.settledAt)}
                </DetailRow>
                {selectedPayout.providerTransferCode && (
                  <DetailRow label="Provider code">
                    <span className="font-mono text-xs">
                      {selectedPayout.providerTransferCode}
                    </span>
                  </DetailRow>
                )}
                {selectedPayout.failureReason && (
                  <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-3 text-xs text-red-700 dark:text-red-400">
                    {selectedPayout.failureReason}
                  </div>
                )}
                {selectedPayout.note && (
                  <DetailRow label="Note">{selectedPayout.note}</DetailRow>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right">{children}</span>
    </div>
  );
}

interface RequestPayoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  wallet: { availableBalance: number } | undefined;
  bankAccounts: PayoutBankAccount[];
  defaultBankId: string | undefined;
  onSubmit: (payload: {
    amount: number;
    bankAccountId: string;
    note?: string;
  }) => void;
  submitting: boolean;
}

function RequestPayoutDialog({
  open,
  onOpenChange,
  wallet,
  bankAccounts,
  defaultBankId,
  onSubmit,
  submitting,
}: RequestPayoutDialogProps) {
  const [amount, setAmount] = useState("");
  const [bankAccountId, setBankAccountId] = useState<string>(
    defaultBankId ?? "",
  );
  const [note, setNote] = useState("");

  // Keep the bank-account select in sync with the default when the dialog opens.
  useMemo(() => {
    if (open) {
      setBankAccountId(defaultBankId ?? bankAccounts[0]?.id ?? "");
      setAmount("");
      setNote("");
    }
  }, [open, defaultBankId, bankAccounts]);

  const available = wallet?.availableBalance ?? 0;
  const amountNum = Number(amount);
  const overdraft = amountNum > available;
  const valid =
    Number.isFinite(amountNum) &&
    amountNum > 0 &&
    !overdraft &&
    bankAccountId !== "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request Payout</DialogTitle>
          <DialogDescription>
            Available balance: <strong>{formatNaira(available)}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="amount">Amount (₦)</Label>
            <Input
              id="amount"
              type="number"
              min={1}
              step={1}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
            />
            {overdraft && (
              <p className="text-xs text-red-600 mt-1">
                Exceeds available balance
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="bank">Bank account</Label>
            <Select value={bankAccountId} onValueChange={setBankAccountId}>
              <SelectTrigger id="bank">
                <SelectValue placeholder="Pick an account" />
              </SelectTrigger>
              <SelectContent>
                {bankAccounts.map((b) => (
                  <SelectItem key={b.id} value={b.id}>
                    {b.label} · {b.bankName ?? "Bank"} · ****
                    {b.accountNumber.slice(-4)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="note">Note (optional)</Label>
            <Input
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. weekly settlement"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            disabled={!valid || submitting}
            onClick={() =>
              onSubmit({
                amount: amountNum,
                bankAccountId,
                note: note.trim() || undefined,
              })
            }
          >
            {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Request {amountNum > 0 ? formatNaira(amountNum) : ""}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface AddBankAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: {
    label: string;
    accountNumber: string;
    bankCode: string;
    isDefault?: boolean;
  }) => void;
  submitting: boolean;
}

function AddBankAccountDialog({
  open,
  onOpenChange,
  onSubmit,
  submitting,
}: AddBankAccountDialogProps) {
  const [label, setLabel] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  useMemo(() => {
    if (open) {
      setLabel("");
      setAccountNumber("");
      setBankCode("");
      setIsDefault(false);
    }
  }, [open]);

  const valid =
    label.trim() !== "" &&
    /^[0-9]{10}$/.test(accountNumber) &&
    bankCode !== "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Bank Account</DialogTitle>
          <DialogDescription>
            Paystack will verify the account number against the selected bank.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="label">Label</Label>
            <Input
              id="label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Main account"
            />
          </div>

          <div>
            <Label htmlFor="bank">Bank</Label>
            <Select value={bankCode} onValueChange={setBankCode}>
              <SelectTrigger id="bank">
                <SelectValue placeholder="Pick a bank" />
              </SelectTrigger>
              <SelectContent>
                {NIGERIAN_BANKS.map((b) => (
                  <SelectItem key={b.code} value={b.code}>
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="accountNumber">Account number (NUBAN)</Label>
            <Input
              id="accountNumber"
              inputMode="numeric"
              maxLength={10}
              value={accountNumber}
              onChange={(e) =>
                setAccountNumber(e.target.value.replace(/[^0-9]/g, ""))
              }
              placeholder="10-digit account number"
            />
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="default"
              checked={isDefault}
              onCheckedChange={setIsDefault}
            />
            <Label htmlFor="default" className="text-sm font-normal">
              Set as default
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            disabled={!valid || submitting}
            onClick={() =>
              onSubmit({
                label: label.trim(),
                accountNumber,
                bankCode,
                isDefault: isDefault || undefined,
              })
            }
          >
            {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Add Account
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
