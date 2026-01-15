import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Printer, MoreHorizontal, Wifi, WifiOff } from "lucide-react";

export default function PrinterSettingsPage() {
  const printers = [
    { id: 1, name: "Kitchen Printer", location: "Main Kitchen", type: "Receipt", connected: true },
    { id: 2, name: "Bar Printer", location: "Bar Counter", type: "Receipt", connected: true },
    { id: 3, name: "Front Desk", location: "Reception", type: "Receipt", connected: false },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Printers</h1>
        <p className="text-sm text-muted-foreground">Manage connected printers</p>
      </div>

      <div className="grid gap-6 max-w-2xl">
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg">Connected Printers</CardTitle>
              <CardDescription>{printers.filter(p => p.connected).length} of {printers.length} online</CardDescription>
            </div>
            <Button size="sm" className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Add Printer
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {printers.map((printer) => (
              <div key={printer.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border gap-3">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <Printer className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{printer.name}</p>
                      {printer.connected ? (
                        <Wifi className="h-3 w-3 text-green-500" />
                      ) : (
                        <WifiOff className="h-3 w-3 text-destructive" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{printer.location} • {printer.type}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-2 pl-14 sm:pl-0">
                  <Badge variant={printer.connected ? "default" : "secondary"}>
                    {printer.connected ? "Online" : "Offline"}
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
            <CardTitle className="text-lg">Print Routing</CardTitle>
            <CardDescription>Configure which orders go to which printer</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { category: "Food Orders", printer: "Kitchen Printer" },
              { category: "Beverages", printer: "Bar Printer" },
              { category: "Receipts", printer: "Front Desk" },
            ].map((route) => (
              <div key={route.category} className="flex items-center justify-between p-3 rounded-lg border">
                <p className="text-sm font-medium">{route.category}</p>
                <Badge variant="secondary">{route.printer}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
