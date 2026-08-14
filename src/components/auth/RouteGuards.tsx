import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PageLoader } from "@/components/ui/page-loader";
import { Lock } from "lucide-react";
import {
  canView,
  firstAllowedPath,
  moduleForPath,
} from "@/lib/permissions";

/**
 * Wraps protected routes. Sends unauthenticated visitors to /auth/login,
 * preserving the original destination via location state so they land back
 * where they were after signing in.
 */
export function ProtectedRoute() {
  const { isAuthenticated, isLoading, permissions } = useAuth();
  const location = useLocation();

  if (isLoading) return <PageLoader />;
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/auth/login"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
  }
  // Module permissions. The API enforces these too — this stops a restricted
  // login reaching a screen by typing its URL, and keeps them out of dead ends.
  const module = moduleForPath(location.pathname);
  if (module && !canView(permissions, module)) {
    // Landing on the default route after login isn't the user's choice, so send
    // them to the first module they can actually open instead of scolding them.
    if (location.pathname === "/dashboard") {
      return <Navigate to={firstAllowedPath(permissions)} replace />;
    }
    return <NoModuleAccess />;
  }

  return <Outlet />;
}

/** Shown when a restricted login reaches a module it wasn't granted. */
function NoModuleAccess() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 p-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <Lock className="h-5 w-5 text-muted-foreground" />
      </div>
      <h2 className="text-lg font-semibold">You don't have access to this section</h2>
      <p className="max-w-sm text-sm text-muted-foreground">
        Your dashboard access doesn't include this module. Ask the business
        owner if you need it.
      </p>
    </div>
  );
}

/**
 * Wraps the auth screens (login / forgot password / onboarding). If the
 * visitor already has a session, redirect them straight to the dashboard.
 */
export function GuestRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <PageLoader />;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}
