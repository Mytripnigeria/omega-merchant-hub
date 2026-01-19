import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { MobileMenuButton } from "./MobileMenuButton";
import { useOverflowDebug } from "@/hooks/use-overflow-debug";

export function DashboardLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Dev tool for overflow debugging
  useOverflowDebug();

  return (
    <div className="flex min-h-screen w-full bg-background overflow-x-hidden">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileMenuOpen}
        onMobileOpenChange={setMobileMenuOpen}
      />
      <div className="flex flex-1 flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-x-hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 sm:py-8">
            <Outlet />
          </div>
        </main>
      </div>
      
      {/* Floating Mobile Menu Button */}
      <MobileMenuButton onClick={() => setMobileMenuOpen(true)} />
    </div>
  );
}
