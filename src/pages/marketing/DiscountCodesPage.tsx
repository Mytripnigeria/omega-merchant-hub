import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Plus, Tag, Percent, Users, MoreHorizontal } from "lucide-react";

export default function DiscountCodesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const discounts = [
    { id: 1, code: "WELCOME20", type: "percentage", value: 20, minOrder: 50, uses: 145, maxUses: 500, expires: "2026-02-28", status: "active" },
    { id: 2, code: "FLAT10", type: "fixed", value: 10, minOrder: 30, uses: 89, maxUses: 200, expires: "2026-01-31", status: "active" },
    { id: 3, code: "SUMMER15", type: "percentage", value: 15, minOrder: 40, uses: 200, maxUses: 200, expires: "2026-01-20", status: "expired" },
    { id: 4, code: "VIP25", type: "percentage", value: 25, minOrder: 100, uses: 23, maxUses: 50, expires: "2026-03-31", status: "active" },
  ];

  const stats = [
    { label: "Active Codes", value: "12", icon: Tag },
    { label: "Total Used", value: "457", icon: Users },
    { label: "Avg. Discount", value: "18%", icon: Percent },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Discount Codes</h1>
          <p className="text-sm text-muted-foreground">Create and manage promotional codes</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="h-4 w-4 mr-2" />Create Code</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Discount Code</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2"><Label>Code</Label><Input placeholder="e.g., SAVE20" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Type</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Value</Label><Input type="number" placeholder="20" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Min. Order</Label><Input type="number" placeholder="50" /></div>
                <div className="space-y-2"><Label>Max Uses</Label><Input type="number" placeholder="100" /></div>
              </div>
              <div className="space-y-2"><Label>Expires</Label><Input type="date" /></div>
              <Button className="w-full">Create Code</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Two-column layout for desktop */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats */}
          <div className="grid gap-3 grid-cols-3">
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

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search codes..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                className="pl-9 h-9 bg-muted/50 border-0" 
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[120px] h-9 bg-muted/50 border-0">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Discount Codes Table */}
          <Card className="border-border/50">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50 hover:bg-transparent">
                      <TableHead className="text-xs font-medium text-muted-foreground">Code</TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground">Discount</TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground hidden sm:table-cell">Min.</TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground hidden md:table-cell">Uses</TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground hidden md:table-cell">Expires</TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground">Status</TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {discounts.map((discount) => (
                      <TableRow key={discount.id} className="border-border/50 group cursor-pointer">
                        <TableCell className="font-mono font-medium text-sm">{discount.code}</TableCell>
                        <TableCell className="text-sm">
                          {discount.type === "percentage" ? `${discount.value}%` : `$${discount.value}`}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground hidden sm:table-cell">${discount.minOrder}</TableCell>
                        <TableCell className="text-sm text-muted-foreground hidden md:table-cell">{discount.uses}/{discount.maxUses}</TableCell>
                        <TableCell className="text-sm text-muted-foreground hidden md:table-cell">{discount.expires}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={discount.status === "active" ? "default" : "secondary"} 
                            className="text-xs font-normal"
                          >
                            {discount.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Top Performing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {discounts.filter(d => d.status === "active").slice(0, 3).map((discount) => (
                <div key={discount.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-mono text-sm font-medium">{discount.code}</p>
                    <p className="text-xs text-muted-foreground">{discount.uses} uses</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {discount.type === "percentage" ? `${discount.value}%` : `$${discount.value}`}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Plus className="mr-2 h-4 w-4" />
                Create New Code
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Tag className="mr-2 h-4 w-4" />
                Bulk Import
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Percent className="mr-2 h-4 w-4" />
                Analytics
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-muted/30">
            <CardContent className="p-4">
              <h4 className="font-medium text-sm mb-2">Pro Tip</h4>
              <p className="text-xs text-muted-foreground">
                Set expiration dates on your discount codes to create urgency and drive conversions.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
