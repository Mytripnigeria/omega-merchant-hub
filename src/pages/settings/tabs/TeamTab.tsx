import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * Admin-team management lives in the HR module under Staff. This tab is a friendly
 * navigator to that page. Admin-level invite flow ships with HR's existing staff invite
 * and is filtered there by role.
 */
export function TeamTab() {
  return (
    <div className="grid gap-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Management
          </CardTitle>
          <CardDescription>
            Manage merchant-hub administrators and staff who can access this dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Staff records (including merchant-hub admins) are managed in the HR module. Use Staff
            management to invite, remove, and adjust roles for team members.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button asChild>
              <Link to="/hr">Open HR / Staff</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/hr?tab=roles">Manage Roles</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
