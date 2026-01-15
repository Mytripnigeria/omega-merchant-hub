import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useLoading } from "@/hooks/use-loading";
import { Search, Plus, ClipboardList, CheckCircle, Clock, MoreHorizontal } from "lucide-react";

interface Checklist {
  id: number;
  name: string;
  items: number;
  completed: number;
  assignee: string;
  dueTime: string;
  status: "in-progress" | "completed" | "pending";
}

const checklists: Checklist[] = [
  { id: 1, name: "Opening Checklist", items: 12, completed: 8, assignee: "Morning Shift", dueTime: "6:00 AM", status: "in-progress" },
  { id: 2, name: "Closing Checklist", items: 15, completed: 15, assignee: "Evening Shift", dueTime: "10:00 PM", status: "completed" },
  { id: 3, name: "Food Safety Check", items: 10, completed: 5, assignee: "Kitchen Staff", dueTime: "12:00 PM", status: "in-progress" },
  { id: 4, name: "Equipment Inspection", items: 8, completed: 0, assignee: "Maintenance", dueTime: "2:00 PM", status: "pending" },
];

const stats = [
  { label: "Active Checklists", value: "4", icon: ClipboardList },
  { label: "Completed Today", value: "8", icon: CheckCircle },
  { label: "Pending", value: "2", icon: Clock },
];

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className={i === 2 ? "col-span-2 md:col-span-1" : ""}>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-7 w-10" />
              </div>
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ChecklistsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-1.5 w-full rounded-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

const ChecklistsPage = () => {
  const [search, setSearch] = useState("");
  const isLoading = useLoading(1000);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "default";
      case "in-progress": return "secondary";
      default: return "outline";
    }
  };

  const filteredChecklists = checklists.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-foreground">Checklists</h1>
          <p className="text-sm text-muted-foreground">Manage daily operational checklists</p>
        </div>
        <Button size="sm" className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Create Checklist
        </Button>
      </div>

      {isLoading ? (
        <StatsSkeleton />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
          {stats.map((stat, index) => (
            <Card key={stat.label} className={`border-border/50 ${index === 2 ? "col-span-2 md:col-span-1" : ""}`}>
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-xl sm:text-2xl font-semibold">{stat.value}</p>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <stat.icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="relative w-full sm:max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search checklists..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          className="pl-9" 
        />
      </div>

      {isLoading ? (
        <ChecklistsSkeleton />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredChecklists.map((checklist) => {
            const progress = (checklist.completed / checklist.items) * 100;
            return (
              <Card key={checklist.id} className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3 gap-3">
                    <div className="min-w-0">
                      <h3 className="font-medium text-sm truncate">{checklist.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        Assigned to: {checklist.assignee} • Due: {checklist.dueTime}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant={getStatusColor(checklist.status) as "default" | "secondary" | "outline"} className="text-xs font-normal">
                        {checklist.status}
                      </Badge>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hidden sm:flex">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{checklist.completed}/{checklist.items} items</span>
                    </div>
                    <Progress value={progress} className="h-1.5" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ChecklistsPage;
