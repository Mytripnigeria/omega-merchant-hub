import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  MapPin,
  Store as StoreIcon,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Phone,
  Mail,
  Loader2,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  useStores,
  useCreateStore,
  useUpdateStore,
  useDeleteStore,
} from "@/hooks/api/use-settings";
import type { Store, WeeklyHours, DayHours } from "@/types";

const DAYS: (keyof WeeklyHours)[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const TIMEZONES = ["Africa/Lagos", "Africa/Accra", "Africa/Nairobi", "UTC", "Europe/London"];

const DEFAULT_DAY: DayHours = { open: "09:00", close: "21:00", closed: false };
const DEFAULT_HOURS: WeeklyHours = {
  monday: { ...DEFAULT_DAY },
  tuesday: { ...DEFAULT_DAY },
  wednesday: { ...DEFAULT_DAY },
  thursday: { ...DEFAULT_DAY },
  friday: { ...DEFAULT_DAY },
  saturday: { ...DEFAULT_DAY },
  sunday: { ...DEFAULT_DAY, closed: true },
};

export function StoresSettingsTab() {
  const { data: storesPage, isLoading } = useStores();
  const stores: Store[] = storesPage?.data ?? [];
  const createStore = useCreateStore();
  const updateStore = useUpdateStore();
  const deleteStore = useDeleteStore();

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<"add" | "edit" | "view">("add");
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  // Form state
  const [formName, setFormName] = useState("");
  const [formAddress, setFormAddress] = useState("");
  const [formCity, setFormCity] = useState("");
  const [formState, setFormState] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formTimezone, setFormTimezone] = useState("Africa/Lagos");
  const [formIsActive, setFormIsActive] = useState(true);
  const [formHours, setFormHours] = useState<WeeklyHours>(DEFAULT_HOURS);
  const [formRadius, setFormRadius] = useState<string>("");

  const resetForm = () => {
    setFormName("");
    setFormAddress("");
    setFormCity("");
    setFormState("");
    setFormPhone("");
    setFormEmail("");
    setFormDescription("");
    setFormTimezone("Africa/Lagos");
    setFormIsActive(true);
    setFormHours(DEFAULT_HOURS);
    setFormRadius("");
  };

  useEffect(() => {
    if (selectedStore && (sheetMode === "edit" || sheetMode === "view")) {
      setFormName(selectedStore.name);
      setFormAddress(selectedStore.address);
      setFormCity(selectedStore.city ?? "");
      setFormState(selectedStore.state ?? "");
      setFormPhone(selectedStore.phone);
      setFormEmail(selectedStore.email);
      setFormDescription(selectedStore.description ?? "");
      setFormTimezone(selectedStore.timezone ?? "Africa/Lagos");
      setFormIsActive(selectedStore.isActive);
      setFormHours(selectedStore.openingHours ?? DEFAULT_HOURS);
      setFormRadius(
        selectedStore.deliveryRadiusKm != null
          ? String(selectedStore.deliveryRadiusKm)
          : "",
      );
    }
  }, [selectedStore, sheetMode]);

  const openAdd = () => {
    setSelectedStore(null);
    resetForm();
    setSheetMode("add");
    setIsSheetOpen(true);
  };

  const openEdit = (store: Store) => {
    setSelectedStore(store);
    setSheetMode("edit");
    setIsSheetOpen(true);
  };

  const openView = (store: Store) => {
    setSelectedStore(store);
    setSheetMode("view");
    setIsSheetOpen(true);
  };

  const updateDayHours = (day: keyof WeeklyHours, patch: Partial<DayHours>) => {
    setFormHours((prev) => ({ ...prev, [day]: { ...prev[day], ...patch } }));
  };

  const buildPayload = () => ({
    name: formName.trim(),
    address: formAddress.trim(),
    city: formCity || undefined,
    state: formState || undefined,
    phone: formPhone.trim(),
    email: formEmail.trim(),
    description: formDescription || undefined,
    timezone: formTimezone,
    openingHours: formHours,
    deliveryRadiusKm: formRadius ? Number(formRadius) : undefined,
  });

  const handleSubmit = async () => {
    if (!formName.trim()) return toast.error("Name is required");
    if (!formAddress.trim()) return toast.error("Address is required");
    if (!formPhone.trim()) return toast.error("Phone is required");
    if (!formEmail.trim()) return toast.error("Email is required");
    try {
      if (sheetMode === "add") {
        await createStore.mutateAsync(buildPayload());
        toast.success("Store created");
      } else if (sheetMode === "edit" && selectedStore) {
        await updateStore.mutateAsync({
          id: selectedStore.id,
          data: { ...buildPayload(), isActive: formIsActive },
        });
        toast.success("Store updated");
      }
      setIsSheetOpen(false);
      resetForm();
    } catch (err) {
      toast.error((err as Error).message ?? "Failed to save store");
    }
  };

  const handleDelete = (store: Store) => {
    deleteStore.mutate(store.id, {
      onSuccess: () => toast.success("Store deleted"),
      onError: (e: Error) => toast.error(e.message ?? "Failed to delete"),
    });
  };

  const isPending = createStore.isPending || updateStore.isPending;

  const stats = [
    { label: "Total Stores", value: stores.length },
    { label: "Active", value: stores.filter((s) => s.isActive).length },
    { label: "Inactive", value: stores.filter((s) => !s.isActive).length },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Store Locations</h2>
          <p className="text-sm text-muted-foreground">
            Manage your store branches, hours, and delivery zones
          </p>
        </div>
        <Button size="sm" onClick={openAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Store
        </Button>
      </div>

      <div className="grid gap-3 grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label} className="border-border/50">
            <CardContent className="p-4">
              <p className="text-2xl font-semibold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stores.map((store) => (
            <Card
              key={store.id}
              className={`border-border/50 ${!store.isActive ? "opacity-60" : ""}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <StoreIcon className="h-5 w-5 text-primary" />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openView(store)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openEdit(store)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDelete(store)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium">{store.name}</h3>
                    <Badge
                      variant={store.isActive ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {store.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground flex items-start gap-1">
                    <MapPin className="h-3 w-3 mt-0.5 shrink-0" />
                    <span className="line-clamp-2">{store.address}</span>
                  </p>
                </div>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    <span>{store.phone}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    <span className="truncate">{store.email}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {stores.length === 0 && (
            <div className="col-span-full p-12 text-center text-sm text-muted-foreground">
              No stores yet — click &quot;Add Store&quot; to create one.
            </div>
          )}
        </div>
      )}

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {sheetMode === "add" ? "Add Store" : sheetMode === "edit" ? "Edit Store" : "Store Details"}
            </SheetTitle>
            <SheetDescription>
              {sheetMode === "view"
                ? "Read-only view of this store"
                : "Configure store info, hours, and delivery"}
            </SheetDescription>
          </SheetHeader>

          <div className="grid gap-6 py-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Store Information</h3>
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  disabled={sheetMode === "view"}
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  disabled={sheetMode === "view"}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Textarea
                  value={formAddress}
                  onChange={(e) => setFormAddress(e.target.value)}
                  disabled={sheetMode === "view"}
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input
                    value={formCity}
                    onChange={(e) => setFormCity(e.target.value)}
                    disabled={sheetMode === "view"}
                  />
                </div>
                <div className="space-y-2">
                  <Label>State</Label>
                  <Input
                    value={formState}
                    onChange={(e) => setFormState(e.target.value)}
                    disabled={sheetMode === "view"}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    disabled={sheetMode === "view"}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    disabled={sheetMode === "view"}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select
                    value={formTimezone}
                    onValueChange={setFormTimezone}
                    disabled={sheetMode === "view"}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIMEZONES.map((tz) => (
                        <SelectItem key={tz} value={tz}>
                          {tz}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Delivery radius (km)</Label>
                  <Input
                    type="number"
                    min={0}
                    step="0.1"
                    value={formRadius}
                    onChange={(e) => setFormRadius(e.target.value)}
                    disabled={sheetMode === "view"}
                  />
                </div>
              </div>
              {sheetMode !== "add" && (
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Active</p>
                    <p className="text-xs text-muted-foreground">Store is open and visible</p>
                  </div>
                  <Switch
                    checked={formIsActive}
                    onCheckedChange={setFormIsActive}
                    disabled={sheetMode === "view"}
                  />
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Operating Hours</h3>
              <div className="space-y-2">
                {DAYS.map((day) => (
                  <div
                    key={day}
                    className="flex items-center gap-3 p-2 border rounded-lg"
                  >
                    <span className="w-24 text-sm capitalize">{day}</span>
                    <Switch
                      checked={!formHours[day].closed}
                      onCheckedChange={(open) => updateDayHours(day, { closed: !open })}
                      disabled={sheetMode === "view"}
                    />
                    <Input
                      type="time"
                      value={formHours[day].open}
                      onChange={(e) => updateDayHours(day, { open: e.target.value })}
                      disabled={sheetMode === "view" || formHours[day].closed}
                      className="w-28"
                    />
                    <span className="text-xs text-muted-foreground">to</span>
                    <Input
                      type="time"
                      value={formHours[day].close}
                      onChange={(e) => updateDayHours(day, { close: e.target.value })}
                      disabled={sheetMode === "view" || formHours[day].closed}
                      className="w-28"
                    />
                    {formHours[day].closed && (
                      <span className="text-xs text-muted-foreground">Closed</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {sheetMode !== "view" && (
            <SheetFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => setIsSheetOpen(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {sheetMode === "add" ? "Create Store" : "Save Changes"}
              </Button>
            </SheetFooter>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
