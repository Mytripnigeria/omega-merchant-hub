import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Key, Smartphone, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import {
  useChangePassword,
  useSetup2FA,
  useEnable2FA,
  useDisable2FA,
} from "@/hooks/api/use-settings";

export function SecurityTab() {
  const changePassword = useChangePassword();
  const setup2FA = useSetup2FA();
  const enable2FA = useEnable2FA();
  const disable2FA = useDisable2FA();

  // Change password
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");

  // 2FA setup
  const [setupResult, setSetupResult] = useState<
    { secret: string; otpauthUrl: string; qrCode: string } | null
  >(null);
  const [verifyCode, setVerifyCode] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[] | null>(null);

  // Disable 2FA
  const [disablePwd, setDisablePwd] = useState("");
  const [disableCode, setDisableCode] = useState("");

  const handleChangePassword = async () => {
    if (!currentPwd || !newPwd) return toast.error("All fields are required");
    if (newPwd.length < 8) return toast.error("New password must be at least 8 characters");
    if (newPwd !== confirmPwd) return toast.error("Passwords do not match");
    try {
      await changePassword.mutateAsync({ currentPassword: currentPwd, newPassword: newPwd });
      toast.success("Password changed — please sign in again with your new password");
      setCurrentPwd("");
      setNewPwd("");
      setConfirmPwd("");
    } catch (err) {
      toast.error((err as Error).message ?? "Failed to change password");
    }
  };

  const handleSetup2FA = async () => {
    try {
      const result = await setup2FA.mutateAsync();
      setSetupResult(result);
    } catch (err) {
      toast.error((err as Error).message ?? "Failed to start 2FA setup");
    }
  };

  const handleEnable2FA = async () => {
    if (verifyCode.length !== 6) return toast.error("Enter the 6-digit code");
    try {
      const { backupCodes: codes } = await enable2FA.mutateAsync(verifyCode);
      setBackupCodes(codes);
      setSetupResult(null);
      setVerifyCode("");
      toast.success("2FA enabled — save your backup codes!");
    } catch (err) {
      toast.error((err as Error).message ?? "Verification failed");
    }
  };

  const handleDisable2FA = async () => {
    if (!disablePwd || disableCode.length !== 6)
      return toast.error("Password and 6-digit code required");
    try {
      await disable2FA.mutateAsync({ password: disablePwd, code: disableCode });
      toast.success("2FA disabled");
      setDisablePwd("");
      setDisableCode("");
    } catch (err) {
      toast.error((err as Error).message ?? "Failed to disable");
    }
  };

  return (
    <div className="grid gap-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Key className="h-5 w-5" />
            Change Password
          </CardTitle>
          <CardDescription>
            Choose a strong password — at least 8 characters
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Current password</Label>
            <Input
              type="password"
              value={currentPwd}
              onChange={(e) => setCurrentPwd(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>New password</Label>
            <Input
              type="password"
              value={newPwd}
              onChange={(e) => setNewPwd(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Confirm new password</Label>
            <Input
              type="password"
              value={confirmPwd}
              onChange={(e) => setConfirmPwd(e.target.value)}
            />
          </div>
          <Button onClick={handleChangePassword} disabled={changePassword.isPending}>
            {changePassword.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Change Password
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Two-Factor Authentication
          </CardTitle>
          <CardDescription>
            Use an authenticator app (Google Authenticator, Authy, 1Password) to protect
            your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!setupResult && !backupCodes && (
            <Button onClick={handleSetup2FA} disabled={setup2FA.isPending}>
              {setup2FA.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <ShieldCheck className="mr-2 h-4 w-4" />
              Set up 2FA
            </Button>
          )}

          {setupResult && (
            <div className="space-y-4 p-4 border rounded-lg">
              <div className="space-y-2">
                <p className="text-sm">
                  Scan this QR code with your authenticator app, then enter the 6-digit code below
                  to verify.
                </p>
                <img src={setupResult.qrCode} alt="2FA QR" className="w-48 h-48" />
                <p className="text-xs text-muted-foreground">
                  Or enter this secret manually: <code className="font-mono">{setupResult.secret}</code>
                </p>
              </div>
              <div className="space-y-2">
                <Label>6-digit code</Label>
                <Input
                  inputMode="numeric"
                  pattern="\d{6}"
                  maxLength={6}
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, ""))}
                />
              </div>
              <Button onClick={handleEnable2FA} disabled={enable2FA.isPending}>
                {enable2FA.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Verify and enable
              </Button>
            </div>
          )}

          {backupCodes && (
            <div className="space-y-3 p-4 border rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
              <p className="text-sm font-medium">
                Save these backup codes — each can be used once if you lose your authenticator:
              </p>
              <div className="grid grid-cols-2 gap-2 font-mono text-sm">
                {backupCodes.map((code) => (
                  <span key={code} className="p-2 bg-background rounded">
                    {code}
                  </span>
                ))}
              </div>
              <Button variant="outline" size="sm" onClick={() => setBackupCodes(null)}>
                I&apos;ve saved them
              </Button>
            </div>
          )}

          <div className="border-t pt-4">
            <p className="text-sm font-medium mb-2">Disable 2FA</p>
            <p className="text-xs text-muted-foreground mb-3">
              Requires your password and a current 6-digit code
            </p>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                value={disablePwd}
                onChange={(e) => setDisablePwd(e.target.value)}
              />
              <Input
                inputMode="numeric"
                placeholder="6-digit code"
                maxLength={6}
                value={disableCode}
                onChange={(e) => setDisableCode(e.target.value.replace(/\D/g, ""))}
              />
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDisable2FA}
                disabled={disable2FA.isPending}
              >
                {disable2FA.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Disable 2FA
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
