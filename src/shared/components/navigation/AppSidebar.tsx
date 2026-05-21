import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/shared/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { type LucideIcon, Settings, LogOut, HelpCircle } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useNotifications } from "@/features/notifications/context/NotificationsContext";

export interface SidebarLink {
  label: string;
  path: string;
  icon: LucideIcon;
}

export interface SidebarConfig {
  navigationLinks: SidebarLink[];
  actionLinks?: SidebarLink[];
  navigationLabel?: string;
  actionLabel?: string;
}

interface AppSidebarProps {
  config: SidebarConfig;
}

const AppSidebar = ({ config }: AppSidebarProps) => {
  const location = useLocation();
  const { logout } = useAuth();
  const { unreadCount } = useNotifications();
  const { setOpenMobile, isMobile } = useSidebar();

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const isActive = (path: string) => {
    const pathname = path.split("?")[0];
    if (pathname === "/profile") {
      return (
        location.pathname === "/profile" ||
        location.pathname.startsWith("/edit-profile")
      );
    }
    if (pathname === "/") {
      return location.pathname === "/";
    }
    return (
      location.pathname === pathname ||
      location.pathname.startsWith(`${pathname}/`)
    );
  };

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-sidebar-border bg-sidebar"
    >
      {/* ── Brand Header ── */}
      <SidebarHeader className="px-4 py-4 border-b border-sidebar-border relative overflow-hidden">
        {/* Subtle brand gradient accent (Raycast-style) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, color-mix(in oklch, var(--primary) 8%, transparent), transparent)",
          }}
          aria-hidden="true"
        />
        <Link
          to="/"
          onClick={handleLinkClick}
          className="flex flex-col group-data-[state=collapsed]:items-center relative"
        >
          <span
            className="text-lg font-bold text-sidebar-primary tracking-tight leading-tight group-data-[state=collapsed]:hidden"
            style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
          >
            Career Path
          </span>
          <span className="text-xs text-sidebar-foreground/50 font-medium group-data-[state=collapsed]:hidden">
            Career Platform
          </span>
          {/* Collapsed icon fallback */}
          <span className="hidden text-lg font-bold text-sidebar-primary group-data-[state=collapsed]:block">
            CP
          </span>
        </Link>
      </SidebarHeader>

      {/* ── Main Navigation ── */}
      <SidebarContent className="px-3 py-3">
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {config.navigationLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <SidebarMenuItem key={`${link.label}-${link.path}`}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={link.label}
                      onClick={handleLinkClick}
                      className={cn(
                        "h-10 px-3 rounded-md transition-colors duration-[var(--duration-normal)] font-medium text-sm relative",
                        active
                          ? "bg-sidebar-accent text-sidebar-primary before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-3/4 before:w-1 before:bg-sidebar-primary before:rounded-r-full"
                          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                      )}
                    >
                      <Link to={link.path} className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                          <Icon
                            className={cn(
                              "h-4 w-4 shrink-0 transition-colors",
                              active
                                ? "text-sidebar-primary"
                                : "text-sidebar-foreground/50"
                            )}
                            aria-hidden="true"
                          />
                          <span>{link.label}</span>
                        </div>
                        {link.label === "Notifications" && unreadCount > 0 && (
                          <span className="bg-destructive text-destructive-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center shrink-0">
                            {unreadCount > 99 ? "99+" : unreadCount}
                          </span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ── Bottom: Settings + Help + Logout ── */}
      <SidebarFooter className="px-3 py-3 border-t border-sidebar-border">
        <SidebarMenu className="gap-0.5">
          {/* Settings */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Settings"
              onClick={handleLinkClick}
              className={cn(
                "h-10 px-3 rounded-md transition-colors duration-[var(--duration-normal)] font-medium text-sm relative",
                isActive("/settings")
                  ? "bg-sidebar-accent text-sidebar-primary before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-3/4 before:w-1 before:bg-sidebar-primary before:rounded-r-full"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <Link to="/settings" className="flex items-center gap-3">
                <Settings
                  className={cn(
                    "h-4 w-4 shrink-0 transition-colors",
                    isActive("/settings")
                      ? "text-sidebar-primary"
                      : "text-sidebar-foreground/50"
                  )}
                  aria-hidden="true"
                />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Help */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Help"
              onClick={handleLinkClick}
              className={cn(
                "h-10 px-3 rounded-md transition-colors duration-[var(--duration-normal)] font-medium text-sm relative",
                isActive("/help")
                  ? "bg-sidebar-accent text-sidebar-primary before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-3/4 before:w-1 before:bg-sidebar-primary before:rounded-r-full"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <Link to="/help" className="flex items-center gap-3">
                <HelpCircle
                  className={cn(
                    "h-4 w-4 shrink-0 transition-colors",
                    isActive("/help")
                      ? "text-sidebar-primary"
                      : "text-sidebar-foreground/50"
                  )}
                  aria-hidden="true"
                />
                <span>Help</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Logout */}
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Logout"
              onClick={() => logout()}
              className="h-10 px-3 rounded-md transition-colors duration-[var(--duration-normal)] font-medium text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground cursor-pointer"
            >
              <LogOut className="h-4 w-4 shrink-0 text-sidebar-foreground/50" aria-hidden="true" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
