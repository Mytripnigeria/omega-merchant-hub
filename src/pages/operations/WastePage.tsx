import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useLoading } from "@/hooks/use-loading";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Trash2, TrendingDown, AlertTriangle, MoreHorizontal, Calendar, User } from "lucide-react";

interface WasteItem {
  id: number;
  item: string;
  quantity: string;
  reason: string;
  cost: number;
  date: string;
  loggedBy: string;
}

const wasteLog: WasteItem[] = [
  { id: 1, item: "Lettuce", quantity: "5 kg", reason: "Spoilage", cost: 25, date: "2026-01-15", loggedBy: "John D." },
  { id: 2, item: "Chicken Breast", quantity: "3 kg", reason: "Overproduction", cost: 45, date: "2026-01-15", loggedBy: "Sarah M." },
  { id: 3, item: "Milk", quantity: "2 L", reason: "Expired", cost: 8, date: "2026-01-14", loggedBy: "Mike R." },
  { id: 4, item: "Bread Rolls", quantity: "24 pcs", reason: "Overproduction", cost: 12, date: "2026-01-14", loggedBy: "Emma W." },
];

const stats = [
  { label: "Total Waste (MTD)", value: "$1,250", icon: Trash2 },
  { label: "Waste %", value: "3.2%", icon: AlertTriangle },
  { label: "vs Last Month", value: "-15%", icon: TrendingDown, positive: true },
  { label: "Items Logged", value: "42", icon: Trash2 },
];

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="border-border/50">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-7 w-16" />
              </div>
              <Skeleton className="h-7 w-7 sm:h-8 sm:w-8 rounded-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function WasteSkeleton() {
  return (
    <>
      {/* Mobile skeleton */}
      <div className="block sm:hidden divide-y divide-border -mx-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="px-3 py-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-4 w-12" />
            </div>
          </div>
        ))}
      </div>
      {/* Desktop skeleton */}
      <div className="hidden sm:block overflow-x-auto -mx-4">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              {Array.from({ length: 7 }).map((_, i) => (
                <th key={i} className="p-4"><Skeleton className="h-3 w-16" /></th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 4 }).map((_, i) => (
              <tr key={i} className="border-b last:border-0">
                <td className="p-4"><Skeleton className="h-4 w-24" /></td>
                <td className="p-4"><Skeleton className="h-4 w-16" /></td>
                <td className="p-4"><Skeleton className="h-5 w-20 rounded-full" /></td>
                <td className="p-4"><Skeleton className="h-4 w-24" /></td>
                <td className="p-4"><Skeleton className="h-4 w-20" /></td>
                <td className="p-4"><Skeleton className="h-4 w-12" /></td>
                <td className="p-4"><Skeleton className="h-8 w-8" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

const WastePage = () => {
  const [search, setSearch] = useState("");
  const [reasonFilter, setReasonFilter] = useState("all");
  const isLoading = useLoading(1000);

  const getReasonColor = (reason: string) => {
    switch (reason.toLowerCase()) {
      case "spoilage": return "destructive";
      case "expired": return "destructive";
      case "overproduction": return "secondary";
      default: return "outline";
    }
  };

  const filteredWaste = wasteLog.filter(w => {
    const matchesSearch = w.item.toLowerCase().includes(search.toLowerCase());
    const matchesReason = reasonFilter === "all" || w.reason.toLowerCase() === reasonFilter;
    return matchesSearch && matchesReason;
  });

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-foreground">Waste Management</h1>
          <p className="text-sm text-muted-foreground">Track and reduce food waste</p>
        </div>
        <Button size="sm" className="w-full sm:w-auto">
          <Plus className="h-4 w-4 sm:mr-2" />
          <span className="sm:inline">Log Waste</span>
        </Button>
      </div>

      {isLoading ? (
        <StatsSkeleton />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-border/50">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
                    <p className={`text-xl sm:text-2xl font-semibold ${stat.positive ? "text-green-600" : ""}`}>
                      {stat.value}
                    </p>
                  </div>
                  <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <stat.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="border-border/50">
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search waste log..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                className="pl-9" 
              />
            </div>
            <Select value={reasonFilter} onValueChange={setReasonFilter}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="All Reasons" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reasons</SelectItem>
                <SelectItem value="spoilage">Spoilage</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="overproduction">Overproduction</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <WasteSkeleton />
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="block sm:hidden divide-y divide-border -mx-3">
                {filteredWaste.map((item) => (
                  <div key={item.id} className="px-3 py-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-medium text-sm">{item.item}</p>
                        <p className="text-xs text-muted-foreground">{item.quantity}</p>
                      </div>
                      <Badge 
                        variant={getReasonColor(item.reason) as "default" | "secondary" | "destructive" | "outline"}
                        className="text-xs font-normal shrink-0"
                      >
                        {item.reason}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{item.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{item.loggedBy}</span>
                        </div>
                      </div>
                      <span className="font-medium text-red-500">-${item.cost}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden sm:block overflow-x-auto -mx-4">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left text-xs font-medium text-muted-foreground p-4">Item</th>
                      <th className="text-left text-xs font-medium text-muted-foreground p-4">Quantity</th>
                      <th className="text-left text-xs font-medium text-muted-foreground p-4">Reason</th>
                      <th className="text-left text-xs font-medium text-muted-foreground p-4">Date</th>
                      <th className="text-left text-xs font-medium text-muted-foreground p-4">Logged By</th>
                      <th className="text-right text-xs font-medium text-muted-foreground p-4">Cost</th>
                      <th className="text-left text-xs font-medium text-muted-foreground p-4 w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredWaste.map((item) => (
                      <tr key={item.id} className="border-b border-border last:border-0 hover:bg-muted/50 group cursor-pointer">
                        <td className="p-4 font-medium text-sm">{item.item}</td>
                        <td className="p-4 text-sm text-muted-foreground">{item.quantity}</td>
                        <td className="p-4">
                          <Badge 
                            variant={getReasonColor(item.reason) as "default" | "secondary" | "destructive" | "outline"}
                            className="text-xs font-normal"
                          >
                            {item.reason}
                          </Badge>
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">{item.date}</td>
                        <td className="p-4 text-sm text-muted-foreground">{item.loggedBy}</td>
                        <td className="p-4 text-sm font-medium text-right text-red-500">
                          -${item.cost}
                        </td>
                        <td className="p-4">
                          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
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
    </div>
  );
};

export default WastePage;
