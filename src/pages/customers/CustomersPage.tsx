import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Users, Star, Wallet, ShoppingCart, Filter } from "lucide-react";

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState("all");

  const customers = [
    { id: 1, name: "John Doe", email: "john@email.com", phone: "+234 801 234 5678", tier: "Gold", points: 2450, orders: 45, spent: 1250.00, status: "active" },
    { id: 2, name: "Sarah Smith", email: "sarah@email.com", phone: "+234 802 345 6789", tier: "Silver", points: 890, orders: 23, spent: 650.00, status: "active" },
    { id: 3, name: "Mike Johnson", email: "mike@email.com", phone: "+234 803 456 7890", tier: "Bronze", points: 150, orders: 8, spent: 180.00, status: "active" },
    { id: 4, name: "Lisa Brown", email: "lisa@email.com", phone: "+234 804 567 8901", tier: "Gold", points: 3200, orders: 67, spent: 2100.00, status: "inactive" },
  ];

  const stats = [
    { label: "Total Customers", value: "1,234", icon: Users },
    { label: "Gold Members", value: "156", icon: Star },
    { label: "Avg. Spend", value: "$45.50", icon: Wallet },
    { label: "Orders Today", value: "89", icon: ShoppingCart },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Customers</h1>
          <p className="text-muted-foreground">Manage customer relationships and loyalty</p>
        </div>
        <Button variant="outline">Export</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search customers..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
            </div>
            <Select value={tierFilter} onValueChange={setTierFilter}>
              <SelectTrigger className="w-[150px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="gold">Gold</SelectItem>
                <SelectItem value="silver">Silver</SelectItem>
                <SelectItem value="bronze">Bronze</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-xs text-muted-foreground">{customer.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={customer.tier === "Gold" ? "default" : customer.tier === "Silver" ? "secondary" : "outline"}>
                      {customer.tier}
                    </Badge>
                  </TableCell>
                  <TableCell>{customer.points.toLocaleString()}</TableCell>
                  <TableCell>{customer.orders}</TableCell>
                  <TableCell>${customer.spent.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={customer.status === "active" ? "default" : "secondary"}>{customer.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">View</Button>
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
