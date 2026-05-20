import React from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/shared/components/ui/sidebar";
import AppHeader from "@/shared/components/navigation/AppHeader";
import AppSidebar from "@/shared/components/navigation/AppSidebar";
import PublicHeader from "@/shared/components/navigation/PublicHeader";
import MinimalFooter from "@/shared/components/navigation/MinimalFooter";
import { useSidebarConfig } from "@/shared/hooks/useSidebarConfig";

/**
 * Authenticated app shell: fixed `AppHeader`, collapsible `AppSidebar`, main content area.
 * Profile (and similar) routes must be nested here so header + sidebar render.
 */
const AppLayout = () => {
  const config = useSidebarConfig();

  if (!config) {
    return (
      <div className="flex flex-col min-h-screen">
        <PublicHeader />
        <div className="flex flex-1 flex-col pt-16">
          <Outlet />
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "13rem",
          "--sidebar-width-icon": "3rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar config={config} />
      <div className="flex-1 min-w-0 flex flex-col min-h-svh">
        <AppHeader />
        <div className="flex flex-1 flex-col pt-16 min-h-[calc(100vh-64px)]">
          <div className="flex-1">
            <Outlet />
          </div>
          <MinimalFooter />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
