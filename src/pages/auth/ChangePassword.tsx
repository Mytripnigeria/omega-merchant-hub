import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Key } from "lucide-react";
import { toast } from "sonner";
import { useChangePassword } from "@/hooks/api/use-settings";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Forced password change for a staff login still on the temporary password
 * generated when the owner granted dashboard access. ProtectedRoute redirects
 * here and refuses every other route until it's done, so there is deliberately
 * no cancel — the only ways out are setting a password or signing out.
 *
 * The API invalidates the refresh token on a password change, so a successful
 * change ends the session and returns to the sign-in screen, matching what the
 * Settings > Security tab already does.
 */
export default function ChangePassword() {
  const changePassword = useChangePassword();
  const { admin, logout } = useAuth();

  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");

  const submit = async () => {
    if (!currentPwd || !newPwd) return toast.error("All fields are required");
    if (newPwd.length < 8) return toast.error("New password must be at least 8 characters");
    if (newPwd === currentPwd) return toast.error("New password must differ from the temporary one");
    if (newPwd !== confirmPwd) return toast.error("Passwords do not match");
    try {
      await changePassword.mutateAsync({
        currentPassword: currentPwd,
        newPassword: newPwd,
      });
      toast.success("Password updated — please sign in with your new password");
      logout();
    } catch (err) {
      toast.error((err as Error).message ?? "Failed to change password");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
            <Key className="h-5 w-5 text-muted-foreground" />
          </div>
          <CardTitle>Choose a password</CardTitle>
          <CardDescription>
            {admin?.email
              ? `${admin.email} is signed in with a temporary password. `
              : "You're signed in with a temporary password. "}
            Set your own to continue.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Temporary password</Label>
            <Input
              id="current-password"
              type="password"
              value={currentPwd}
              onChange={(e) => setCurrentPwd(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">New password</Label>
            <Input
              id="new-password"
              type="password"
              value={newPwd}
              onChange={(e) => setNewPwd(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm new password</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPwd}
              onChange={(e) => setConfirmPwd(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between gap-3 pt-2">
            <Button variant="ghost" onClick={logout}>
              Sign out
            </Button>
            <Button onClick={submit} disabled={changePassword.isPending}>
              {changePassword.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Set password
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
