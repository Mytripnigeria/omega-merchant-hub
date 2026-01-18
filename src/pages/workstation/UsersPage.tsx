import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useLoading } from "@/hooks/use-loading";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { TablePagination } from "@/components/ui/table-pagination";
import { Plus, Users, Shield, Clock, Search, Mail, Phone, Key, Activity, Settings } from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: string;
  status: "active" | "inactive";
  lastActive: string;
  pin?: string;
  permissions?: string[];
  activityLog?: { date: string; action: string }[];
}

const users: User[] = [
  { id: 1, name: "John Doe", email: "john@example.com", phone: "+234 801 234 5678", role: "Admin", status: "active", lastActive: "Now", pin: "****", permissions: ["orders", "products", "reports", "settings"], activityLog: [{ date: "2026-01-15 10:30", action: "Logged in" }, { date: "2026-01-15 10:35", action: "Processed order #1234" }] },
  { id: 2, name: "Sarah Smith", email: "sarah@example.com", phone: "+234 802 345 6789", role: "Manager", status: "active", lastActive: "5m ago", permissions: ["orders", "products", "reports"] },
  { id: 3, name: "Mike Johnson", email: "mike@example.com", role: "Cashier", status: "inactive", lastActive: "2h ago", permissions: ["orders"] },
  { id: 4, name: "Emily Brown", email: "emily@example.com", phone: "+234 804 567 8901", role: "Kitchen", status: "active", lastActive: "Now", permissions: ["orders"] },
];

const stats = [
  { label: "Total Users", value: "24", icon: Users },
  { label: "Active Now", value: "8", icon: Shield },
  { label: "Roles", value: "5", icon: Clock },
];

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className={i === 2 ? "col-span-2 md:col-span-1" : ""}>
          <CardContent className="p-3 sm:p-4 pt-6">
            <div className="flex items-center justify-between"><div className="space-y-2"><Skeleton className="h-3 w-20" /><Skeleton className="h-7 w-10" /></div><Skeleton className="h-8 w-8" /></div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function UsersSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border rounded-lg">
          <div className="flex items-center gap-4"><Skeleton className="h-10 w-10 rounded-full" /><div className="space-y-2"><Skeleton className="h-4 w-28" /><Skeleton className="h-3 w-36" /></div></div>
          <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4"><Skeleton className="h-5 w-16 rounded-full" /><Skeleton className="h-4 w-16" /><Skeleton className="h-5 w-14 rounded-full" /></div>
        </div>
      ))}
    </div>
  );
}

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const isLoading = useLoading(1000);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<"view" | "edit" | "add">("view");

  const filteredUsers = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));
  
  const totalItems = filteredUsers.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  const openViewSheet = (user: User) => { setSelectedUser(user); setSheetMode("view"); };
  const openEditSheet = (user: User) => { setSelectedUser(user); setSheetMode("edit"); };
  const openAddSheet = () => { setSelectedUser(null); setSheetMode("add"); setIsAddSheetOpen(true); };
  const closeSheet = () => { setSelectedUser(null); setIsAddSheetOpen(false); };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">Users</h1>
          <p className="text-sm text-muted-foreground">Manage workstation users and access</p>
        </div>
        <Button size="sm" className="w-full sm:w-auto" onClick={openAddSheet}><Plus className="mr-2 h-4 w-4" />Add User</Button>
      </div>

      {isLoading ? <StatsSkeleton /> : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
          {stats.map((stat, index) => (
            <Card key={stat.label} className={index === 2 ? "col-span-2 md:col-span-1" : ""}>
              <CardContent className="p-3 sm:p-4 pt-6">
                <div className="flex items-center justify-between">
                  <div><p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p><p className="text-xl sm:text-2xl font-bold">{stat.value}</p></div>
                  <stat.icon className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground shrink-0" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardHeader className="p-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          {isLoading ? <UsersSkeleton /> : (
            <div className="space-y-3">
              {paginatedUsers.map((user) => (
                <div key={user.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 border rounded-lg transition-colors hover:bg-muted/50 cursor-pointer" onClick={() => openViewSheet(user)}>
                  <div className="flex items-center gap-3 sm:gap-4">
                    <Avatar className="h-9 w-9 sm:h-10 sm:w-10 shrink-0"><AvatarFallback className="text-xs">{user.name.split(" ").map(n => n[0]).join("")}</AvatarFallback></Avatar>
                    <div className="min-w-0"><p className="font-medium text-sm truncate">{user.name}</p><p className="text-xs sm:text-sm text-muted-foreground truncate">{user.email}</p></div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4 pl-12 sm:pl-0">
                    <Badge variant="outline" className="text-xs">{user.role}</Badge>
                    <span className="text-xs sm:text-sm text-muted-foreground shrink-0">{user.lastActive}</span>
                    <Badge className={user.status === "active" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : ""} variant="secondary">{user.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        startIndex={startIndex + 1}
        endIndex={endIndex}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />

      <Sheet open={!!selectedUser || isAddSheetOpen} onOpenChange={closeSheet}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <div className="flex items-center gap-3">
              {selectedUser && <Avatar className="h-10 w-10"><AvatarFallback>{selectedUser.name.split(" ").map(n => n[0]).join("")}</AvatarFallback></Avatar>}
              <div>
                <SheetTitle>{sheetMode === "add" ? "Add User" : sheetMode === "edit" ? "Edit User" : selectedUser?.name}</SheetTitle>
                <SheetDescription>{sheetMode === "add" ? "Create a new workstation user" : selectedUser?.email}</SheetDescription>
              </div>
            </div>
          </SheetHeader>

          {sheetMode === "view" && selectedUser ? (
            <Tabs defaultValue="details" className="mt-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="permissions">Access</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4 mt-4">
                <div className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center gap-3"><Mail className="h-4 w-4 text-muted-foreground" /><div><p className="text-sm font-medium">{selectedUser.email}</p><p className="text-xs text-muted-foreground">Email</p></div></div>
                  {selectedUser.phone && <div className="flex items-center gap-3"><Phone className="h-4 w-4 text-muted-foreground" /><div><p className="text-sm font-medium">{selectedUser.phone}</p><p className="text-xs text-muted-foreground">Phone</p></div></div>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1"><Label className="text-xs text-muted-foreground">Role</Label><Badge variant="outline">{selectedUser.role}</Badge></div>
                  <div className="space-y-1"><Label className="text-xs text-muted-foreground">Status</Label><Badge className={selectedUser.status === "active" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : ""} variant="secondary">{selectedUser.status}</Badge></div>
                  <div className="space-y-1"><Label className="text-xs text-muted-foreground">Last Active</Label><p className="text-sm font-medium">{selectedUser.lastActive}</p></div>
                  {selectedUser.pin && <div className="space-y-1"><Label className="text-xs text-muted-foreground">PIN</Label><p className="text-sm font-mono">{selectedUser.pin}</p></div>}
                </div>
              </TabsContent>

              <TabsContent value="permissions" className="space-y-4 mt-4">
                {["orders", "products", "reports", "settings", "staff", "inventory"].map((perm) => (
                  <div key={perm} className="flex items-center justify-between py-2">
                    <span className="text-sm capitalize">{perm}</span>
                    <Switch checked={selectedUser.permissions?.includes(perm)} />
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="activity" className="space-y-4 mt-4">
                {selectedUser.activityLog && selectedUser.activityLog.length > 0 ? (
                  <div className="space-y-3">
                    {selectedUser.activityLog.map((log, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3"><Activity className="h-4 w-4 text-muted-foreground" /><span className="text-sm">{log.action}</span></div>
                        <span className="text-xs text-muted-foreground">{log.date}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Activity className="h-10 w-10 text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground">No recent activity</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          ) : (
            <div className="space-y-4 mt-6">
              <div className="space-y-2"><Label>Full Name</Label><Input placeholder="Enter name" defaultValue={selectedUser?.name} /></div>
              <div className="space-y-2"><Label>Email</Label><Input type="email" placeholder="email@example.com" defaultValue={selectedUser?.email} /></div>
              <div className="space-y-2"><Label>Phone</Label><Input placeholder="+234..." defaultValue={selectedUser?.phone} /></div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select defaultValue={selectedUser?.role || "Cashier"}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Cashier">Cashier</SelectItem>
                    <SelectItem value="Kitchen">Kitchen</SelectItem>
                    <SelectItem value="Server">Server</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>PIN (4 digits)</Label><Input type="password" placeholder="****" maxLength={4} /></div>
            </div>
          )}

          <SheetFooter className="mt-6 flex-col sm:flex-row gap-2">
            {sheetMode === "view" ? (
              <>
                <Button variant="outline" onClick={() => openEditSheet(selectedUser!)} className="w-full sm:w-auto">Edit User</Button>
                <Button variant="outline" className="w-full sm:w-auto"><Key className="mr-2 h-4 w-4" />Reset PIN</Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={closeSheet} className="w-full sm:w-auto">Cancel</Button>
                <Button className="w-full sm:w-auto">{sheetMode === "add" ? "Create User" : "Save Changes"}</Button>
              </>
            )}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
