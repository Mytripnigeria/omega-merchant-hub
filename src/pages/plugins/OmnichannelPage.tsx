import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { useLoading } from "@/hooks/use-loading";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Phone, Mail, Instagram, Facebook, Search, Plus, Settings, Activity, Clock, Key } from "lucide-react";
import { LucideIcon } from "lucide-react";
import { ChowdeckPanel } from "@/components/plugins/ChowdeckPanel";

interface Channel {
  id: number;
  name: string;
  icon: LucideIcon;
  status: "active" | "inactive";
  messages: number;
  connected: boolean;
  apiKey?: string;
  webhookUrl?: string;
  responseTime?: string;
  autoReply?: boolean;
  recentMessages?: { from: string; message: string; time: string }[];
}

const channels: Channel[] = [
  { id: 1, name: "Website Chat", icon: MessageSquare, status: "active", messages: 245, connected: true, responseTime: "2 min", autoReply: true, recentMessages: [{ from: "John Doe", message: "Is delivery available?", time: "5 min ago" }, { from: "Sarah Smith", message: "What are your hours?", time: "15 min ago" }] },
  { id: 2, name: "WhatsApp", icon: Phone, status: "active", messages: 180, connected: true, apiKey: "wa_*****", responseTime: "5 min", autoReply: false },
  { id: 3, name: "Email", icon: Mail, status: "active", messages: 92, connected: true, responseTime: "1 hour", autoReply: true },
  { id: 4, name: "Instagram", icon: Instagram, status: "inactive", messages: 0, connected: false },
  { id: 5, name: "Facebook", icon: Facebook, status: "active", messages: 67, connected: true, responseTime: "10 min", autoReply: true },
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
        <Card key={i}>
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
            <div className="flex items-center justify-between"><Skeleton className="h-3 w-12" /><Skeleton className="h-5 w-14 rounded-full" /></div>
            <div className="flex items-center justify-between"><Skeleton className="h-3 w-24" /><Skeleton className="h-4 w-8" /></div>
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
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [sheetMode, setSheetMode] = useState<"view" | "configure">("view");

  const stats = [
    { label: "Active Channels", value: channels.filter(c => c.status === "active").length.toString() },
    { label: "Total Messages (30d)", value: channels.reduce((acc, c) => acc + c.messages, 0).toLocaleString() },
    { label: "Response Rate", value: "94%" },
  ];

  const filteredChannels = channels.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  const openViewSheet = (channel: Channel) => {
    setSelectedChannel(channel);
    setSheetMode("view");
  };

  const openConfigureSheet = (channel: Channel) => {
    setSelectedChannel(channel);
    setSheetMode("configure");
  };

  const closeSheet = () => {
    setSelectedChannel(null);
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">Omnichannel</h1>
          <p className="text-sm text-muted-foreground">Manage all communication channels in one place</p>
        </div>
        <Button size="sm" className="w-full sm:w-auto"><Plus className="h-4 w-4 mr-2" />Add Channel</Button>
      </div>

      {/* Marketplace order channels — live integrations, configured per store. */}
      <ChowdeckPanel />

      {isLoading ? <StatsSkeleton /> : (
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
        <Input placeholder="Search channels..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>

      {isLoading ? <ChannelsSkeleton /> : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredChannels.map((channel) => (
            <Card key={channel.id} className="transition-all hover:shadow-md cursor-pointer" onClick={() => openViewSheet(channel)}>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${channel.status === "active" ? "bg-primary/10" : "bg-muted"}`}>
                      <channel.icon className={`h-5 w-5 ${channel.status === "active" ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                    <span className="text-sm sm:text-base font-medium">{channel.name}</span>
                  </div>
                  <Switch checked={channel.status === "active"} onClick={(e) => e.stopPropagation()} />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <Badge className={channel.status === "active" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : ""} variant="secondary">{channel.status}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Messages (30d)</span>
                  <span className="font-medium">{channel.messages.toLocaleString()}</span>
                </div>
                <Button variant="outline" className="w-full" size="sm" onClick={(e) => { e.stopPropagation(); openConfigureSheet(channel); }}>Configure</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Sheet open={!!selectedChannel} onOpenChange={closeSheet}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <div className="flex items-center gap-3">
              {selectedChannel && (
                <div className={`p-2 rounded-lg ${selectedChannel.status === "active" ? "bg-primary/10" : "bg-muted"}`}>
                  <selectedChannel.icon className={`h-5 w-5 ${selectedChannel.status === "active" ? "text-primary" : "text-muted-foreground"}`} />
                </div>
              )}
              <div>
                <SheetTitle>{selectedChannel?.name}</SheetTitle>
                <SheetDescription>{selectedChannel?.status === "active" ? "Connected and active" : "Not connected"}</SheetDescription>
              </div>
            </div>
          </SheetHeader>

          {selectedChannel && (
            <Tabs defaultValue="overview" className="mt-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="messages">Messages</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1"><Label className="text-xs text-muted-foreground">Status</Label><Badge className={selectedChannel.status === "active" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : ""} variant="secondary">{selectedChannel.status}</Badge></div>
                  <div className="space-y-1"><Label className="text-xs text-muted-foreground">Messages (30d)</Label><p className="text-sm font-medium">{selectedChannel.messages}</p></div>
                  {selectedChannel.responseTime && <div className="space-y-1"><Label className="text-xs text-muted-foreground">Avg Response</Label><p className="text-sm font-medium">{selectedChannel.responseTime}</p></div>}
                  <div className="space-y-1"><Label className="text-xs text-muted-foreground">Auto-Reply</Label><Badge variant={selectedChannel.autoReply ? "default" : "secondary"}>{selectedChannel.autoReply ? "Enabled" : "Disabled"}</Badge></div>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4 mt-4">
                <div className="flex items-center justify-between">
                  <div><p className="font-medium text-sm">Auto-Reply</p><p className="text-xs text-muted-foreground">Automatically respond to messages</p></div>
                  <Switch checked={selectedChannel.autoReply} />
                </div>
                {selectedChannel.apiKey && (
                  <div className="space-y-2">
                    <Label>API Key</Label>
                    <div className="flex gap-2">
                      <Input value={selectedChannel.apiKey} readOnly className="font-mono" type="password" />
                      <Button variant="outline" size="icon"><Key className="h-4 w-4" /></Button>
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  <Label>Response Template</Label>
                  <Textarea placeholder="Enter auto-reply message..." defaultValue="Thank you for contacting us! We'll get back to you shortly." />
                </div>
              </TabsContent>

              <TabsContent value="messages" className="space-y-4 mt-4">
                {selectedChannel.recentMessages && selectedChannel.recentMessages.length > 0 ? (
                  <div className="space-y-3">
                    {selectedChannel.recentMessages.map((msg, idx) => (
                      <div key={idx} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{msg.from}</span>
                          <span className="text-xs text-muted-foreground">{msg.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{msg.message}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <MessageSquare className="h-10 w-10 text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground">No recent messages</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}

          <SheetFooter className="mt-6 flex-col sm:flex-row gap-2">
            {selectedChannel?.connected ? (
              <>
                <Button variant="outline" className="w-full sm:w-auto">Save Settings</Button>
                <Button variant="destructive" className="w-full sm:w-auto">Disconnect</Button>
              </>
            ) : (
              <Button className="w-full">Connect {selectedChannel?.name}</Button>
            )}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
