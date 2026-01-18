import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { useLoading } from "@/hooks/use-loading";
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
import { Plus, MapPin, Store, MoreHorizontal, Edit, Trash2, Eye, Phone, Mail } from "lucide-react";
import { useStore } from "@/contexts/StoreContext";

interface StoreData {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  manager?: string;
  description?: string;
}

function StoresSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <Skeleton className="h-8 w-8 rounded" />
            </div>
            <Skeleton className="h-5 w-32 mb-2" />
            <Skeleton className="h-4 w-48 mb-4" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-24" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function StoresSettingsTab() {
  const { stores } = useStore();
  const isLoading = useLoading(1000);
  
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<StoreData | null>(null);
  const [sheetMode, setSheetMode] = useState<"add" | "edit" | "view">("add");

  const handleAddNew = () => {
    setSelectedStore(null);
    setSheetMode("add");
    setIsSheetOpen(true);
  };

  const handleView = (store: StoreData) => {
    setSelectedStore(store);
    setSheetMode("view");
    setIsSheetOpen(true);
  };

  const handleEdit = (store: StoreData) => {
    setSelectedStore(store);
    setSheetMode("edit");
    setIsSheetOpen(true);
  };

  const storesList: StoreData[] = stores.map((s) => ({
    ...s,
    manager: "Store Manager",
    description: "Main store location",
  }));

  const stats = [
    { label: "Total Stores", value: storesList.length },
    { label: "Active", value: storesList.filter((s) => s.isActive).length },
    { label: "Inactive", value: storesList.filter((s) => !s.isActive).length },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Store Locations</h2>
          <p className="text-sm text-muted-foreground">Manage your store locations and branches</p>
        </div>
        <Button size="sm" onClick={handleAddNew}>
          <Plus className="h-4 w-4 mr-2" />
          Add Store
        </Button>
      </div>

      {/* Stats */}
      {isLoading ? (
        <div className="grid gap-3 grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="border-border/50">
              <CardContent className="p-4">
                <Skeleton className="h-8 w-12 mb-1" />
                <Skeleton className="h-4 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-3 grid-cols-3">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-border/50">
              <CardContent className="p-4">
                <p className="text-2xl font-semibold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Stores Grid */}
      {isLoading ? (
        <StoresSkeleton />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {storesList.map((store) => (
            <Card key={store.id} className={`border-border/50 ${!store.isActive ? "opacity-60" : ""}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Store className="h-5 w-5 text-primary" />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleView(store)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(store)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium">{store.name}</h3>
                    <Badge variant={store.isActive ? "default" : "secondary"} className="text-xs">
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
        </div>
      )}

      {/* Add/Edit/View Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {sheetMode === "add" ? "Add New Store" : sheetMode === "edit" ? "Edit Store" : "Store Details"}
            </SheetTitle>
            <SheetDescription>
              {sheetMode === "add"
                ? "Create a new store location"
                : sheetMode === "edit"
                ? "Update store information"
                : "View store details"}
            </SheetDescription>
          </SheetHeader>

          <div className="grid gap-6 py-6">
            {/* Store Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Store Information</h3>

              <div className="space-y-2">
                <Label>Store Name</Label>
                <Input
                  placeholder="e.g., Lekki Phase 1"
                  defaultValue={selectedStore?.name}
                  disabled={sheetMode === "view"}
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Brief description of this store..."
                  defaultValue={selectedStore?.description}
                  disabled={sheetMode === "view"}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Address</Label>
                <Textarea
                  placeholder="Full store address"
                  defaultValue={selectedStore?.address}
                  disabled={sheetMode === "view"}
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    placeholder="+234..."
                    defaultValue={selectedStore?.phone}
                    disabled={sheetMode === "view"}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    placeholder="store@example.com"
                    defaultValue={selectedStore?.email}
                    disabled={sheetMode === "view"}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Store Manager</Label>
                <Input
                  placeholder="Manager name"
                  defaultValue={selectedStore?.manager}
                  disabled={sheetMode === "view"}
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="text-sm font-medium">Active Status</p>
                  <p className="text-xs text-muted-foreground">Store is open and receiving orders</p>
                </div>
                <Switch defaultChecked={selectedStore?.isActive ?? true} disabled={sheetMode === "view"} />
              </div>
            </div>

            {sheetMode === "view" && selectedStore && (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">Additional Info</h3>
                <Card className="border-border/50">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Created</span>
                      <span>{new Date(selectedStore.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Store ID</span>
                      <span className="font-mono">{selectedStore.id}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {sheetMode !== "view" && (
            <SheetFooter className="gap-2">
              <Button variant="outline" onClick={() => setIsSheetOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsSheetOpen(false)}>
                {sheetMode === "add" ? "Create Store" : "Save Changes"}
              </Button>
            </SheetFooter>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
