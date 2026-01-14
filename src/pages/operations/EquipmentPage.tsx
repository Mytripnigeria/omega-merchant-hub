import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Wrench, AlertTriangle, CheckCircle } from "lucide-react";

const EquipmentPage = () => {
  const equipment = [
    { id: 1, name: "Industrial Oven", status: "operational", lastMaintenance: "2024-01-10", nextMaintenance: "2024-04-10" },
    { id: 2, name: "Walk-in Freezer", status: "maintenance", lastMaintenance: "2024-01-05", nextMaintenance: "2024-02-05" },
    { id: 3, name: "Dishwasher", status: "operational", lastMaintenance: "2024-01-15", nextMaintenance: "2024-04-15" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Equipment</h1>
          <p className="text-muted-foreground">Manage and track equipment maintenance</p>
        </div>
        <Button><Plus className="mr-2 h-4 w-4" /> Add Equipment</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Equipment</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">24</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Operational</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">21</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Needs Attention</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">3</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Equipment List</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {equipment.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">Last: {item.lastMaintenance} | Next: {item.nextMaintenance}</p>
                </div>
                <Badge variant={item.status === "operational" ? "default" : "secondary"}>{item.status}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EquipmentPage;
