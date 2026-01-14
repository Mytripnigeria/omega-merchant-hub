import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { MessageSquare, Phone, Mail, Instagram, Facebook, Globe, Search, Plus, MessagesSquare } from "lucide-react";

export default function OmnichannelPage() {
  const [search, setSearch] = useState("");

  const channels = [
    { name: "Website Chat", icon: MessageSquare, status: "active", messages: 245, connected: true },
    { name: "WhatsApp", icon: Phone, status: "active", messages: 180, connected: true },
    { name: "Email", icon: Mail, status: "active", messages: 92, connected: true },
    { name: "Instagram", icon: Instagram, status: "inactive", messages: 0, connected: false },
    { name: "Facebook", icon: Facebook, status: "active", messages: 67, connected: true },
  ];

  const stats = [
    { label: "Active Channels", value: channels.filter(c => c.status === "active").length.toString() },
    { label: "Total Messages (30d)", value: channels.reduce((acc, c) => acc + c.messages, 0).toLocaleString() },
    { label: "Response Rate", value: "94%" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Omnichannel</h1>
          <p className="text-muted-foreground">Manage all communication channels in one place</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Channel
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search channels..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          className="pl-10" 
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {channels
          .filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
          .map((channel) => (
          <Card key={channel.name} className="transition-all hover:shadow-elevated">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${channel.status === "active" ? "bg-primary/10" : "bg-muted"}`}>
                    <channel.icon className={`h-5 w-5 ${channel.status === "active" ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <span className="text-base font-medium">{channel.name}</span>
                </div>
                <Switch checked={channel.status === "active"} />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <Badge variant={channel.status === "active" ? "default" : "secondary"}>
                  {channel.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Messages (30d)</span>
                <span className="font-medium">{channel.messages.toLocaleString()}</span>
              </div>
              <Button variant="outline" className="w-full" size="sm">
                Configure
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
