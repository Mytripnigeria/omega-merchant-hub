import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { useLoading } from "@/hooks/use-loading";
import { MessageSquare, Phone, Mail, Instagram, Facebook, Search, Plus } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface Channel {
  name: string;
  icon: LucideIcon;
  status: "active" | "inactive";
  messages: number;
  connected: boolean;
}

const channels: Channel[] = [
  { name: "Website Chat", icon: MessageSquare, status: "active", messages: 245, connected: true },
  { name: "WhatsApp", icon: Phone, status: "active", messages: 180, connected: true },
  { name: "Email", icon: Mail, status: "active", messages: 92, connected: true },
  { name: "Instagram", icon: Instagram, status: "inactive", messages: 0, connected: false },
  { name: "Facebook", icon: Facebook, status: "active", messages: 67, connected: true },
];

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className={i === 2 ? "col-span-2 md:col-span-1" : ""}>
          <CardContent className="p-3 sm:p-4 pt-6">
            <Skeleton className="h-3 w-28 mb-2" />
            <Skeleton className="h-7 w-12" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ChannelsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <Card key={i} className="transition-all">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-lg" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-6 w-10 rounded-full" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-5 w-14 rounded-full" />
            </div>
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-4 w-8" />
            </div>
            <Skeleton className="h-8 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function OmnichannelPage() {
  const [search, setSearch] = useState("");
  const isLoading = useLoading(1000);

  const stats = [
    { label: "Active Channels", value: channels.filter(c => c.status === "active").length.toString() },
    { label: "Total Messages (30d)", value: channels.reduce((acc, c) => acc + c.messages, 0).toLocaleString() },
    { label: "Response Rate", value: "94%" },
  ];

  const filteredChannels = channels.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">Omnichannel</h1>
          <p className="text-sm text-muted-foreground">Manage all communication channels in one place</p>
        </div>
        <Button size="sm" className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Channel
        </Button>
      </div>

      {isLoading ? (
        <StatsSkeleton />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
          {stats.map((stat, index) => (
            <Card key={stat.label} className={index === 2 ? "col-span-2 md:col-span-1" : ""}>
              <CardContent className="p-3 sm:p-4 pt-6">
                <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-xl sm:text-2xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="relative w-full sm:max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search channels..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          className="pl-10" 
        />
      </div>

      {isLoading ? (
        <ChannelsSkeleton />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredChannels.map((channel) => (
            <Card key={channel.name} className="transition-all hover:shadow-md">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${channel.status === "active" ? "bg-primary/10" : "bg-muted"}`}>
                      <channel.icon className={`h-5 w-5 ${channel.status === "active" ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                    <span className="text-sm sm:text-base font-medium">{channel.name}</span>
                  </div>
                  <Switch checked={channel.status === "active"} />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <Badge 
                    className={channel.status === "active" 
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                      : ""
                    }
                    variant={channel.status === "active" ? "secondary" : "secondary"}
                  >
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
      )}
    </div>
  );
}
