import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, Users, Gift, TrendingUp, Plus, Settings, Edit, Eye } from "lucide-react";

interface LoyaltyTier {
  id: number;
  name: string;
  description: string;
  minPoints: number;
  discount: { name: string; type: string; value: number } | null;
  delivery: { name: string; value: number } | null;
  pointsPerN: number;
  valuePer100Points: number;
  minToRedeem: number;
  members: number;
  color: string;
  status: "active" | "inactive";
}

const tiersData: LoyaltyTier[] = [
  { 
    id: 1, 
    name: "Bronze", 
    description: "Entry level tier for new members",
    minPoints: 0, 
    discount: { name: "Bronze Discount", type: "percentage", value: 5 },
    delivery: null,
    pointsPerN: 10,
    valuePer100Points: 100,
    minToRedeem: 100,
    members: 456, 
    color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
    status: "active"
  },
  { 
    id: 2, 
    name: "Silver", 
    description: "For regular customers",
    minPoints: 500, 
    discount: { name: "Silver Discount", type: "percentage", value: 10 },
    delivery: { name: "Free Delivery", value: 0 },
    pointsPerN: 10,
    valuePer100Points: 150,
    minToRedeem: 100,
    members: 234, 
    color: "bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-300",
    status: "active"
  },
  { 
    id: 3, 
    name: "Gold", 
    description: "Premium member benefits",
    minPoints: 1500, 
    discount: { name: "Gold Discount", type: "percentage", value: 15 },
    delivery: { name: "Free Delivery", value: 0 },
    pointsPerN: 15,
    valuePer100Points: 200,
    minToRedeem: 50,
    members: 89, 
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    status: "active"
  },
  { 
    id: 4, 
    name: "Platinum", 
    description: "Exclusive VIP benefits",
    minPoints: 5000, 
    discount: { name: "Platinum Discount", type: "percentage", value: 20 },
    delivery: { name: "Priority Delivery", value: 0 },
    pointsPerN: 20,
    valuePer100Points: 250,
    minToRedeem: 50,
    members: 23, 
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    status: "active"
  },
];

const tierMembers = [
  { id: 1, name: "John Doe", email: "john@example.com", points: 5200, joinDate: "2025-06-15" },
  { id: 2, name: "Sarah Smith", email: "sarah@example.com", points: 4800, joinDate: "2025-07-20" },
  { id: 3, name: "Mike Johnson", email: "mike@example.com", points: 3200, joinDate: "2025-08-10" },
  { id: 4, name: "Lisa Brown", email: "lisa@example.com", points: 2900, joinDate: "2025-09-05" },
];

export default function LoyaltyPage() {
  const [selectedTier, setSelectedTier] = useState<LoyaltyTier | null>(null);
  const [sheetMode, setSheetMode] = useState<"view" | "add" | "edit">("view");
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const stats = [
    { label: "Members", value: "802", icon: Users },
    { label: "Points Issued", value: "125K", icon: Star },
    { label: "Rewards", value: "1,234", icon: Gift },
    { label: "Retention", value: "78%", icon: TrendingUp },
  ];

  const openSheet = (mode: "view" | "add" | "edit", tier?: LoyaltyTier) => {
    setSheetMode(mode);
    setSelectedTier(tier || null);
    setIsSheetOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Loyalty Program</h1>
          <p className="text-sm text-muted-foreground">Manage tiers, points, and rewards</p>
        </div>
        <Button size="sm" onClick={() => openSheet("add")}>
          <Plus className="h-4 w-4 mr-2" />Add Tier
        </Button>
      </div>

      {/* Two-column layout for desktop */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats */}
          <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.label} className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                      <stat.icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <p className="text-2xl font-semibold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Loyalty Tiers */}
          <div className="grid gap-4 sm:grid-cols-2">
            {tiersData.map((tier) => (
              <Card 
                key={tier.name} 
                className="border-border/50 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => openSheet("view", tier)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <Badge className={`${tier.color} text-xs font-medium`}>{tier.name}</Badge>
                    <span className="text-xs text-muted-foreground">{tier.members} members</span>
                  </div>
                  <p className="text-lg font-semibold mb-1">{tier.minPoints.toLocaleString()}+ pts</p>
                  <p className="text-sm text-muted-foreground mb-3">{tier.discount?.value}% discount</p>
                  <ul className="space-y-1.5 mb-4">
                    {tier.discount && (
                      <li className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Star className="h-3 w-3 text-primary" />
                        {tier.discount.value}% off orders
                      </li>
                    )}
                    {tier.delivery && (
                      <li className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Star className="h-3 w-3 text-primary" />
                        {tier.delivery.name}
                      </li>
                    )}
                  </ul>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-xs"
                    onClick={(e) => { e.stopPropagation(); openSheet("edit", tier); }}
                  >
                    Edit Tier
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-sm font-medium">Point Settings</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Points per ₦1</Label>
                <Input type="number" defaultValue="10" className="h-9 bg-muted/50 border-0" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Value per 100 pts (₦)</Label>
                <Input type="number" defaultValue="100" className="h-9 bg-muted/50 border-0" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Min. to redeem</Label>
                <Input type="number" defaultValue="100" className="h-9 bg-muted/50 border-0" />
              </div>
              <Button size="sm" className="w-full">Save Settings</Button>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => openSheet("add")}>
                <Plus className="mr-2 h-4 w-4" />
                Add New Tier
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Gift className="mr-2 h-4 w-4" />
                Create Reward
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                View Members
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Top Members</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {["John Doe", "Sarah Smith", "Mike Johnson"].map((name, i) => (
                <div key={name} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                      {name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="text-sm">{name}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">{(5000 - i * 1200).toLocaleString()} pts</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader className="space-y-1 pb-4 border-b">
            <div className="flex items-center justify-between">
              <SheetTitle>
                {sheetMode === "add" ? "Add Loyalty Tier" : sheetMode === "edit" ? "Edit Tier" : selectedTier?.name}
              </SheetTitle>
              {sheetMode === "view" && selectedTier && (
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setSheetMode("edit")}>
                  <Edit className="h-4 w-4" />
                </Button>
              )}
            </div>
            {sheetMode === "view" && selectedTier && (
              <SheetDescription>{selectedTier.members} members in this tier</SheetDescription>
            )}
          </SheetHeader>

          {sheetMode === "view" && selectedTier ? (
            <Tabs defaultValue="details" className="mt-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Tier Details</TabsTrigger>
                <TabsTrigger value="members">Members History</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-6 mt-4">
                {/* Details Section */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-muted-foreground">Details</h4>
                  <div className="grid gap-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Name</span>
                      <span className="text-sm font-medium">{selectedTier.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Description</span>
                      <span className="text-sm font-medium text-right max-w-[200px]">{selectedTier.description}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Expected Accumulation</span>
                      <span className="text-sm font-medium">{selectedTier.minPoints.toLocaleString()} pts</span>
                    </div>
                  </div>
                </div>

                {/* Discount Section */}
                {selectedTier.discount && (
                  <div className="space-y-4 pt-4 border-t">
                    <h4 className="text-sm font-medium text-muted-foreground">Discount</h4>
                    <div className="grid gap-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Discount Name</span>
                        <span className="text-sm font-medium">{selectedTier.discount.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Type</span>
                        <span className="text-sm font-medium capitalize">{selectedTier.discount.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Value</span>
                        <span className="text-sm font-medium">{selectedTier.discount.value}%</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Delivery Section */}
                {selectedTier.delivery && (
                  <div className="space-y-4 pt-4 border-t">
                    <h4 className="text-sm font-medium text-muted-foreground">Delivery</h4>
                    <div className="grid gap-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Delivery Name</span>
                        <span className="text-sm font-medium">{selectedTier.delivery.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Discount Value</span>
                        <span className="text-sm font-medium">₦{selectedTier.delivery.value}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Point Settings Section */}
                <div className="space-y-4 pt-4 border-t">
                  <h4 className="text-sm font-medium text-muted-foreground">Point Settings</h4>
                  <div className="grid gap-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Points per ₦</span>
                      <span className="text-sm font-medium">{selectedTier.pointsPerN}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Value per 100 points</span>
                      <span className="text-sm font-medium">₦{selectedTier.valuePer100Points}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Minimum to Redeem</span>
                      <span className="text-sm font-medium">{selectedTier.minToRedeem} pts</span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="members" className="mt-4">
                <div className="space-y-3">
                  {tierMembers.map((member) => (
                    <div key={member.id} className="p-3 border rounded-lg space-y-2">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{member.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{member.email}</p>
                        </div>
                        <Badge variant="secondary" className="text-xs shrink-0">
                          {member.points.toLocaleString()} pts
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Member since {member.joinDate}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            /* Add/Edit Form */
            <div className="space-y-6 mt-4">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Tier Details</h4>
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input placeholder="e.g., Gold" defaultValue={selectedTier?.name} />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input placeholder="Brief description" defaultValue={selectedTier?.description} />
                </div>
                <div className="space-y-2">
                  <Label>Expected Accumulation (points)</Label>
                  <Input type="number" placeholder="1500" defaultValue={selectedTier?.minPoints} />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h4 className="text-sm font-medium">Discount</h4>
                <div className="space-y-2">
                  <Label>Select Discount Option</Label>
                  <Select defaultValue={selectedTier?.discount?.name}>
                    <SelectTrigger><SelectValue placeholder="Select discount" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bronze Discount">Bronze Discount</SelectItem>
                      <SelectItem value="Silver Discount">Silver Discount</SelectItem>
                      <SelectItem value="Gold Discount">Gold Discount</SelectItem>
                      <SelectItem value="Platinum Discount">Platinum Discount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h4 className="text-sm font-medium">Delivery</h4>
                <div className="space-y-2">
                  <Label>Select Delivery Option</Label>
                  <Select defaultValue={selectedTier?.delivery?.name}>
                    <SelectTrigger><SelectValue placeholder="Select delivery" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Free Delivery">Free Delivery</SelectItem>
                      <SelectItem value="Priority Delivery">Priority Delivery</SelectItem>
                      <SelectItem value="Express Delivery">Express Delivery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h4 className="text-sm font-medium">Point Settings</h4>
                <div className="space-y-2">
                  <Label>Points per ₦</Label>
                  <Input type="number" placeholder="10" defaultValue={selectedTier?.pointsPerN} />
                </div>
                <div className="space-y-2">
                  <Label>Value per 100 points (₦)</Label>
                  <Input type="number" placeholder="100" defaultValue={selectedTier?.valuePer100Points} />
                </div>
                <div className="space-y-2">
                  <Label>Minimum to Redeem</Label>
                  <Input type="number" placeholder="100" defaultValue={selectedTier?.minToRedeem} />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button variant="outline" className="flex-1" onClick={() => setIsSheetOpen(false)}>Cancel</Button>
                <Button className="flex-1">{sheetMode === "add" ? "Add Tier" : "Save Changes"}</Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
