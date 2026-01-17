import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useLoading } from "@/hooks/use-loading";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Activity, Clock, User, FileText, Search, Filter, ShoppingCart, Package, DollarSign, Eye, ArrowRight } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface ActivityItem {
  id: number;
  user: string;
  action: string;
  time: string;
  type: string;
  icon: LucideIcon;
  details?: {
    description?: string;
    referenceId?: string;
    changes?: { field: string; from: string; to: string }[];
    metadata?: { key: string; value: string }[];
  };
}

const activities: ActivityItem[] = [
  { 
    id: 1, user: "John Doe", action: "Created order #1234", time: "2 min ago", type: "order", icon: ShoppingCart,
    details: {
      description: "New order created for dine-in customer",
      referenceId: "ORD-1234",
      metadata: [
        { key: "Table", value: "Table 5" },
        { key: "Items", value: "3" },
        { key: "Total", value: "₦8,500" }
      ]
    }
  },
  { 
    id: 2, user: "Sarah Smith", action: "Updated product: Burger", time: "5 min ago", type: "product", icon: Package,
    details: {
      description: "Product price updated",
      referenceId: "PRD-0042",
      changes: [
        { field: "Price", from: "₦2,500", to: "₦2,800" },
        { field: "Status", from: "Active", to: "Active" }
      ]
    }
  },
  { 
    id: 3, user: "Mike Johnson", action: "Clocked in", time: "15 min ago", type: "shift", icon: Clock,
    details: {
      description: "Staff member started their shift",
      metadata: [
        { key: "Role", value: "Kitchen Staff" },
        { key: "Scheduled", value: "10:00 AM - 6:00 PM" }
      ]
    }
  },
  { 
    id: 4, user: "Emily Brown", action: "Processed refund #456", time: "20 min ago", type: "transaction", icon: DollarSign,
    details: {
      description: "Refund issued for damaged item",
      referenceId: "REF-456",
      metadata: [
        { key: "Amount", value: "₦3,200" },
        { key: "Reason", value: "Wrong order" },
        { key: "Original Order", value: "#1198" }
      ]
    }
  },
  { 
    id: 5, user: "John Doe", action: "Applied discount code", time: "25 min ago", type: "order", icon: ShoppingCart,
    details: {
      description: "Discount code applied to order",
      referenceId: "ORD-1230",
      metadata: [
        { key: "Code", value: "SAVE10" },
        { key: "Discount", value: "10%" },
        { key: "Savings", value: "₦850" }
      ]
    }
  },
  { 
    id: 6, user: "Sarah Smith", action: "Created order #1235", time: "30 min ago", type: "order", icon: ShoppingCart,
    details: {
      description: "New takeaway order created",
      referenceId: "ORD-1235",
      metadata: [
        { key: "Type", value: "Takeaway" },
        { key: "Items", value: "5" },
        { key: "Total", value: "₦12,400" }
      ]
    }
  },
];

const stats = [
  { label: "Actions Today", value: "248", icon: Activity },
  { label: "Active Users", value: "8", icon: User },
  { label: "Orders Processed", value: "67", icon: FileText },
];

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className={i === 2 ? "col-span-2 md:col-span-1" : ""}>
          <CardContent className="p-3 sm:p-4 pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-7 w-12" />
              </div>
              <Skeleton className="h-8 w-8" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ActivitiesSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ActivityPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const isLoading = useLoading(1000);
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(null);

  const filteredActivities = activities.filter(a => 
    (a.action.toLowerCase().includes(search.toLowerCase()) || a.user.toLowerCase().includes(search.toLowerCase())) &&
    (typeFilter === "all" || a.type === typeFilter)
  );

  const openViewSheet = (activity: ActivityItem) => {
    setSelectedActivity(activity);
  };

  const closeSheet = () => {
    setSelectedActivity(null);
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">Activity Log</h1>
        <p className="text-sm text-muted-foreground">Track all workstation activities</p>
      </div>

      {isLoading ? (
        <StatsSkeleton />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
          {stats.map((stat, index) => (
            <Card key={stat.label} className={index === 2 ? "col-span-2 md:col-span-1" : ""}>
              <CardContent className="p-3 sm:p-4 pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-xl sm:text-2xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground shrink-0" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardHeader className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search activities..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                className="pl-10" 
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="order">Orders</SelectItem>
                <SelectItem value="product">Products</SelectItem>
                <SelectItem value="shift">Shifts</SelectItem>
                <SelectItem value="transaction">Transactions</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          {isLoading ? (
            <ActivitiesSkeleton />
          ) : (
            <div className="space-y-3">
              {filteredActivities.map((activity) => (
                <div 
                  key={activity.id} 
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 border rounded-lg transition-colors hover:bg-muted/50 cursor-pointer"
                  onClick={() => openViewSheet(activity)}
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <activity.icon className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{activity.action}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">by {activity.user}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 pl-12 sm:pl-0">
                    <Badge variant="outline" className="text-xs">{activity.type}</Badge>
                    <span className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 shrink-0">
                      <Clock className="h-3 w-3" />
                      {activity.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Activity Detail Sheet */}
      <Sheet open={!!selectedActivity} onOpenChange={closeSheet}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <div className="flex items-center gap-3">
              {selectedActivity && (
                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                  <selectedActivity.icon className="h-5 w-5 text-muted-foreground" />
                </div>
              )}
              <div>
                <SheetTitle>{selectedActivity?.action}</SheetTitle>
                <SheetDescription>by {selectedActivity?.user} • {selectedActivity?.time}</SheetDescription>
              </div>
            </div>
          </SheetHeader>

          {selectedActivity && (
            <Tabs defaultValue="details" className="mt-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="changes">Changes</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4 mt-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm">{selectedActivity.details?.description || "No description available"}</p>
                </div>

                {selectedActivity.details?.referenceId && (
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Reference ID</Label>
                    <p className="text-sm font-mono font-medium">{selectedActivity.details.referenceId}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">User</Label>
                    <p className="text-sm font-medium">{selectedActivity.user}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Type</Label>
                    <Badge variant="outline" className="capitalize">{selectedActivity.type}</Badge>
                  </div>
                </div>

                {selectedActivity.details?.metadata && (
                  <div className="pt-4 border-t space-y-3">
                    <h4 className="font-medium text-sm">Additional Info</h4>
                    <div className="space-y-2">
                      {selectedActivity.details.metadata.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between py-2 border-b last:border-0">
                          <span className="text-sm text-muted-foreground">{item.key}</span>
                          <span className="text-sm font-medium">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="changes" className="space-y-4 mt-4">
                {selectedActivity.details?.changes && selectedActivity.details.changes.length > 0 ? (
                  <div className="space-y-3">
                    {selectedActivity.details.changes.map((change, idx) => (
                      <div key={idx} className="p-3 border rounded-lg">
                        <p className="text-xs text-muted-foreground mb-2">{change.field}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground line-through">{change.from}</span>
                          <ArrowRight className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm font-medium">{change.to}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <FileText className="h-10 w-10 text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground">No field changes recorded</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}

          <SheetFooter className="mt-6">
            <Button variant="outline" onClick={closeSheet} className="w-full">Close</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
