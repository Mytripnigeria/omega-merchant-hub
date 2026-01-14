import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { MessageSquare, Phone, Mail, Globe, Instagram, Facebook } from "lucide-react";

const OmnichannelPage = () => {
  const channels = [
    { name: "Website Chat", icon: MessageSquare, status: "active", messages: 245 },
    { name: "WhatsApp", icon: Phone, status: "active", messages: 180 },
    { name: "Email", icon: Mail, status: "active", messages: 92 },
    { name: "Instagram", icon: Instagram, status: "inactive", messages: 0 },
    { name: "Facebook", icon: Facebook, status: "active", messages: 67 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Omnichannel</h1>
          <p className="text-muted-foreground">Manage all communication channels</p>
        </div>
        <Button><Globe className="mr-2 h-4 w-4" /> Add Channel</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {channels.map((channel) => (
          <Card key={channel.name}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <channel.icon className="h-5 w-5" />
                  {channel.name}
                </div>
                <Switch checked={channel.status === "active"} />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge variant={channel.status === "active" ? "default" : "secondary"}>
                  {channel.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Messages (30d)</span>
                <span className="font-bold">{channel.messages}</span>
              </div>
              <Button variant="outline" className="w-full">Configure</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OmnichannelPage;
