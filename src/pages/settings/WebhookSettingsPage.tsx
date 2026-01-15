import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Webhook, MoreHorizontal, AlertCircle } from "lucide-react";

export default function WebhookSettingsPage() {
  const webhooks = [
    { id: 1, name: "Order Created", url: "https://api.example.com/orders", events: ["order.created"], status: "active" },
    { id: 2, name: "Payment Received", url: "https://api.example.com/payments", events: ["payment.completed"], status: "active" },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Webhooks</h1>
        <p className="text-sm text-muted-foreground">Send real-time event data to external services</p>
      </div>

      <div className="grid gap-6 max-w-2xl">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Webhook Endpoints</CardTitle>
              <CardDescription>{webhooks.length} configured endpoints</CardDescription>
            </div>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Webhook
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {webhooks.length > 0 ? (
              webhooks.map((webhook) => (
                <div key={webhook.id} className="p-4 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Webhook className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">{webhook.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={webhook.status === "active" ? "default" : "secondary"}>
                        {webhook.status}
                      </Badge>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground font-mono truncate">{webhook.url}</p>
                  <div className="flex gap-1 mt-2">
                    {webhook.events.map((event) => (
                      <Badge key={event} variant="secondary" className="text-xs">{event}</Badge>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <Webhook className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground text-sm">No webhooks configured</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Available Events</CardTitle>
            <CardDescription>Events that can trigger webhooks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-2">
              {[
                "order.created", "order.updated", "order.completed", "order.cancelled",
                "payment.completed", "payment.failed", "customer.created", "inventory.low"
              ].map((event) => (
                <Badge key={event} variant="outline" className="justify-start py-2 px-3">
                  {event}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
