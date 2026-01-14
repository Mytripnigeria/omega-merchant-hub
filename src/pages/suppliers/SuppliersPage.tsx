import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Search, Plus, MoreHorizontal, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

interface Supplier {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  category: string;
  outstanding: string;
  status: "Active" | "Inactive";
}

const suppliers: Supplier[] = [
  { id: "1", name: "Fresh Farms Ltd", contact: "John Adams", email: "john@freshfarms.com", phone: "+234 801 234 5678", category: "Produce", outstanding: "₦125,000", status: "Active" },
  { id: "2", name: "Metro Beverages", contact: "Sarah Lee", email: "sarah@metro.com", phone: "+234 802 345 6789", category: "Beverages", outstanding: "₦0", status: "Active" },
  { id: "3", name: "Quality Meats", contact: "Mike Brown", email: "mike@qualitymeats.com", phone: "+234 803 456 7890", category: "Meat", outstanding: "₦340,000", status: "Active" },
  { id: "4", name: "Bakery Supplies Co", contact: "Lisa White", email: "lisa@bakerysupplies.com", phone: "+234 804 567 8901", category: "Baking", outstanding: "₦80,000", status: "Inactive" },
  { id: "5", name: "Seafood Direct", contact: "David Chen", email: "david@seafood.com", phone: "+234 805 678 9012", category: "Seafood", outstanding: "₦215,000", status: "Active" },
];

const statusColors: Record<string, string> = {
  Active: "bg-green-100 text-green-700",
  Inactive: "bg-gray-100 text-gray-600",
};

export default function SuppliersPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Suppliers</h1>
          <p className="text-sm text-muted-foreground">
            Manage supplier relationships and orders
          </p>
        </div>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Supplier
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Suppliers</p>
            <p className="text-2xl font-semibold">24</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Active</p>
            <p className="text-2xl font-semibold">20</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Outstanding</p>
            <p className="text-2xl font-semibold text-red-600">₦760,000</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">This Month</p>
            <p className="text-2xl font-semibold">₦2.4M</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search suppliers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Suppliers Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6 w-12">
                  <input type="checkbox" className="rounded border-border" />
                </TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Outstanding</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-6 w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suppliers.map((supplier) => (
                <TableRow key={supplier.id} className="group cursor-pointer hover:bg-muted/50">
                  <TableCell className="pl-6">
                    <input type="checkbox" className="rounded border-border" />
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{supplier.name}</p>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{supplier.contact}</p>
                      <p className="text-sm text-muted-foreground">{supplier.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-normal">{supplier.category}</Badge>
                  </TableCell>
                  <TableCell className={cn("font-medium", supplier.outstanding !== "₦0" && "text-red-600")}>
                    {supplier.outstanding}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="secondary" 
                      className={cn("font-normal", statusColors[supplier.status])}
                    >
                      {supplier.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="pr-6">
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing 1-5 of 24 suppliers
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
