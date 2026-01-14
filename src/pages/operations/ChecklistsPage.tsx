import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, ClipboardList } from "lucide-react";

const ChecklistsPage = () => {
  const checklists = [
    { id: 1, name: "Opening Checklist", items: 12, completed: 8, assignee: "Morning Shift" },
    { id: 2, name: "Closing Checklist", items: 15, completed: 15, assignee: "Evening Shift" },
    { id: 3, name: "Food Safety Check", items: 10, completed: 5, assignee: "Kitchen Staff" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Checklists</h1>
          <p className="text-muted-foreground">Manage daily operational checklists</p>
        </div>
        <Button><Plus className="mr-2 h-4 w-4" /> Create Checklist</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {checklists.map((checklist) => (
          <Card key={checklist.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{checklist.name}</CardTitle>
                <ClipboardList className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Progress</span>
                  <Badge variant={checklist.completed === checklist.items ? "default" : "secondary"}>
                    {checklist.completed}/{checklist.items}
                  </Badge>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full" 
                    style={{ width: `${(checklist.completed / checklist.items) * 100}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground">Assigned to: {checklist.assignee}</p>
                <Button variant="outline" className="w-full">View Details</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ChecklistsPage;
