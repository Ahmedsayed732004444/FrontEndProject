import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { LogOut, User } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";

import { useQuery } from "@tanstack/react-query";
import { profileService } from "@/features/profile/services/profileService";
import { ThemeToggle } from "@/shared/components/theme/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface PublicHeaderProps {
  leading?: ReactNode;
}

const PublicHeader = ({ leading }: PublicHeaderProps) => {
  const { isAuthenticated, logout, user } = useAuth();
  const location = useLocation();

  const { data: profilePic } = useQuery({
    queryKey: ["userProfile", "picture"],
    queryFn: () => profileService.getProfilePicture(),
    enabled: isAuthenticated,
    staleTime: 10 * 60 * 1000,
  });

  const guestLinks: { label: string; path: string }[] = [];

  // No primary nav links shown in navbar for authenticated users — all navigation is in the sidebar
  const primaryMemberLinks: { label: string; path: string }[] = [];

  const isActive = (path: string) => {
    const pathname = path.split("?")[0];
    if (path.includes("#")) return location.pathname === pathname.split("#")[0];
    if (pathname === "/") return location.pathname === "/";
    if (pathname === "/profile") return location.pathname === "/profile" || location.pathname.startsWith("/edit-profile");
    return location.pathname === pathname || location.pathname.startsWith(`${pathname}/`);
  };



  return (
    <header className="fixed top-0 left-0 right-0 z-[100] border-b border-border bg-background/95 backdrop-blur-md transition-[left] duration-200 ease-linear md:group-data-[state=expanded]/sidebar-wrapper:left-(--sidebar-width) md:group-data-[state=collapsed]/sidebar-wrapper:left-(--sidebar-width-icon)">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-2">
          <div className="flex min-w-0 flex-1 items-center gap-2 md:gap-6">
            {leading}
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0 group">
              <span className="text-xl font-bold tracking-tight text-primary">
                Career Path
              </span>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden items-center gap-1 md:flex shrink-0">
              {(isAuthenticated && user ? primaryMemberLinks : guestLinks).map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "relative px-3 py-2 text-sm font-medium transition-all duration-200 rounded-lg hover:bg-accent/50 whitespace-nowrap",
                    isActive(link.path)
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {link.label}
                  {isActive(link.path) && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary animate-in" />
                  )}
                </Link>
              ))}


            </nav>
          </div>

          {/* Auth Buttons */}
          <div className="flex shrink-0 items-center gap-3">
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full overflow-hidden p-0 ring-offset-background transition-all hover:ring-2 hover:ring-primary/20"
                  >
                    {profilePic ? (
                      <img src={profilePic} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-10 w-10 bg-gradient-to-br from-primary to-purple-600 text-white text-sm font-semibold flex items-center justify-center rounded-full">
                        {`${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.trim() ||
                          user.userName?.slice(0, 2).toUpperCase() ||
                          "U"}
                      </div>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 glass p-2 mt-2">
                  <DropdownMenuLabel className="font-normal px-2 py-3">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-semibold leading-none">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="opacity-50" />
                  <DropdownMenuItem asChild className="cursor-pointer rounded-md focus:bg-primary/10 focus:text-primary">
                    <Link to="/profile" className="flex items-center">
                      <User className="mr-3 h-4 w-4" />
                      <span>My Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="opacity-50" />
                  <DropdownMenuItem
                    onClick={() => logout()}
                    className="cursor-pointer rounded-md text-destructive focus:bg-destructive/10 focus:text-destructive"
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="hidden sm:block">
                  <Button variant="ghost" size="sm" className="font-semibold text-muted-foreground hover:text-foreground">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl shadow-lg shadow-primary/25 px-5">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default PublicHeader;