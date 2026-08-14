/**
 * Merchant-dashboard module permissions — the client-side half of
 * `common/permissions/dashboard-permissions.ts` on the backend.
 *
 * The hub uses these to hide modules a login can't open. That is a
 * convenience, not the control: the API enforces the same rules and answers
 * 403 regardless of what the UI shows.
 */

export const DASHBOARD_MODULES = [
  { key: "dashboard", label: "Dashboard" },
  { key: "orders", label: "Orders" },
  { key: "stocks", label: "Stocks" },
  { key: "procurement", label: "Procurement" },
  { key: "suppliers", label: "Suppliers" },
  { key: "customers", label: "Customers" },
  { key: "marketing", label: "Marketing" },
  { key: "operations", label: "Operations" },
  { key: "hr", label: "HR" },
  { key: "reports", label: "Reports" },
  { key: "bookings", label: "Bookings" },
  { key: "payouts", label: "Payouts" },
  { key: "storefront", label: "Storefront" },
  { key: "plugins", label: "Plugins" },
  { key: "workstation", label: "Workstation" },
  { key: "settings", label: "Settings" },
] as const;

export type DashboardModule = (typeof DASHBOARD_MODULES)[number]["key"];

export const ALL_ACCESS = "all";

/**
 * Whether a granted set satisfies `required`. `manage` implies `view`, and
 * `all` implies everything.
 *
 * `granted === null` means unrestricted — the business owner, or any login
 * created before module permissions existed.
 */
export function can(
  granted: string[] | null | undefined,
  required: string,
): boolean {
  if (granted === null || granted === undefined) return true;
  if (granted.includes(ALL_ACCESS)) return true;
  if (granted.includes(required)) return true;
  if (required.endsWith(".view")) {
    return granted.includes(`${required.slice(0, -".view".length)}.manage`);
  }
  return false;
}

/** Convenience: may this login open the module at all? */
export function canView(
  granted: string[] | null | undefined,
  module: DashboardModule,
): boolean {
  return can(granted, `${module}.view`);
}

/** Convenience: may this login change things in the module? */
export function canManage(
  granted: string[] | null | undefined,
  module: DashboardModule,
): boolean {
  return can(granted, `${module}.manage`);
}

/**
 * Route prefix → module, so a direct URL can be checked the same way the
 * sidebar is filtered. Longest prefix wins.
 */
const ROUTE_MODULES = ([
  { prefix: "/dashboard", module: "dashboard" },
  { prefix: "/orders", module: "orders" },
  { prefix: "/stocks", module: "stocks" },
  { prefix: "/procurement", module: "procurement" },
  { prefix: "/suppliers", module: "suppliers" },
  { prefix: "/customers", module: "customers" },
  { prefix: "/marketing", module: "marketing" },
  { prefix: "/operations", module: "operations" },
  { prefix: "/hr", module: "hr" },
  { prefix: "/reports", module: "reports" },
  { prefix: "/bookings", module: "bookings" },
  { prefix: "/payouts", module: "payouts" },
  { prefix: "/storefront", module: "storefront" },
  { prefix: "/plugins", module: "plugins" },
  { prefix: "/workstation", module: "workstation" },
  { prefix: "/settings", module: "settings" },
] as { prefix: string; module: DashboardModule }[]).sort(
  (a, b) => b.prefix.length - a.prefix.length,
);

/** The module a hub path belongs to, or null when it isn't module-scoped. */
export function moduleForPath(pathname: string): DashboardModule | null {
  const rule = ROUTE_MODULES.find(
    (r) => pathname === r.prefix || pathname.startsWith(`${r.prefix}/`),
  );
  return rule?.module ?? null;
}

/** First module this login can actually open — where to land them after login. */
export function firstAllowedPath(granted: string[] | null | undefined): string {
  const rule = ROUTE_MODULES.slice()
    .sort(
      (a, b) =>
        DASHBOARD_MODULES.findIndex((m) => m.key === a.module) -
        DASHBOARD_MODULES.findIndex((m) => m.key === b.module),
    )
    .find((r) => canView(granted, r.module));
  return rule?.prefix ?? "/dashboard";
}
