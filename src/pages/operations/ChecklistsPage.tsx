import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Search, Plus, ClipboardList, CheckCircle, Clock, MoreHorizontal } from "lucide-react";

const ChecklistsPage = () => {
  const [search, setSearch] = useState("");

  const checklists = [
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "default";
      case "in-progress": return "secondary";
      default: return "outline";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Checklists</h1>
          <p className="text-sm text-muted-foreground">Manage daily operational checklists</p>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Create Checklist
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-semibold">{stat.value}</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search checklists..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          className="pl-9 h-9 bg-muted/50 border-0" 
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {checklists.map((checklist) => {
          const progress = (checklist.completed / checklist.items) * 100;
          return (
            <Card key={checklist.id} className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-medium text-sm">{checklist.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Assigned to: {checklist.assignee} • Due: {checklist.dueTime}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusColor(checklist.status) as "default" | "secondary" | "outline"} className="text-xs font-normal">
                      {checklist.status}
                    </Badge>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
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
    </div>
  );
};

export default ChecklistsPage;
