import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, MapPin, MoreHorizontal } from "lucide-react";

export default function LocationSettingsPage() {
  const locations = [
    { id: 1, name: "Victoria Island", address: "123 Adeola Odeku St, VI", status: "active", isMain: true },
    { id: 2, name: "Lekki Phase 1", address: "45 Admiralty Way, Lekki", status: "active", isMain: false },
    { id: 3, name: "Ikoyi", address: "12 Bourdillon Rd, Ikoyi", status: "inactive", isMain: false },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Locations</h1>
        <p className="text-sm text-muted-foreground">Manage your store locations</p>
      </div>

      <div className="grid gap-6 max-w-2xl">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Store Locations</CardTitle>
              <CardDescription>{locations.filter(l => l.status === "active").length} active locations</CardDescription>
            </div>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Location
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {locations.map((location) => (
              <div key={location.id} className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{location.name}</p>
                      {location.isMain && <Badge variant="secondary" className="text-xs">Main</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">{location.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={location.status === "active" ? "default" : "secondary"}>
                    {location.status}
                  </Badge>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Delivery Zones</CardTitle>
            <CardDescription>Configure delivery areas for each location</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <p className="text-muted-foreground text-sm mb-4">No delivery zones configured</p>
                <Button variant="outline" size="sm">Configure Zones</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
