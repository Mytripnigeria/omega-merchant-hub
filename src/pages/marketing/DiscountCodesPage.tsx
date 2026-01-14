import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
    { label: "Total Redeemed", value: "457", icon: Users },
    { label: "Avg. Discount", value: "18%", icon: Percent },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Discount Codes</h1>
          <p className="text-sm text-muted-foreground">Create and manage promotional codes</p>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Create Code
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-semibold">{stat.value}</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
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
              <SelectTrigger className="w-[120px] h-9 bg-muted/50 border-0">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="text-xs font-medium text-muted-foreground">Code</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Discount</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Min. Order</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Uses</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Expires</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Status</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {discounts.map((discount) => (
                <TableRow key={discount.id} className="border-border/50">
                  <TableCell className="font-mono font-medium text-sm">{discount.code}</TableCell>
                  <TableCell className="text-sm">
                    {discount.type === "percentage" ? `${discount.value}%` : `$${discount.value}`}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">${discount.minOrder}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{discount.uses}/{discount.maxUses}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{discount.expires}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={discount.status === "active" ? "default" : "secondary"} 
                      className="text-xs font-normal"
                    >
                      {discount.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
