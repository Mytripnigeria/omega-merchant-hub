import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, Users, Clock } from "lucide-react";

const ReservationsPage = () => {
  const reservations = [
    { id: 1, name: "John Smith", date: "2024-01-20", time: "7:00 PM", guests: 4, table: "T-5", status: "confirmed" },
    { id: 2, name: "Sarah Johnson", date: "2024-01-20", time: "8:00 PM", guests: 2, table: "T-3", status: "pending" },
    { id: 3, name: "Mike Wilson", date: "2024-01-21", time: "6:30 PM", guests: 6, table: "T-8", status: "confirmed" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reservations</h1>
          <p className="text-muted-foreground">Manage table reservations</p>
        </div>
        <Button><Plus className="mr-2 h-4 w-4" /> New Reservation</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Today</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">12</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">58</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">5</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Upcoming Reservations</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reservations.map((res) => (
              <div key={res.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{res.name}</p>
                  <p className="text-sm text-muted-foreground">{res.date} at {res.time} • Table {res.table}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm">{res.guests} guests</span>
                  <Badge variant={res.status === "confirmed" ? "default" : "secondary"}>{res.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReservationsPage;
