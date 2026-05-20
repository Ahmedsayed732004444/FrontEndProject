import type { SidebarConfig } from "@/shared/components/navigation/AppSidebar";
import {
  User,
  Briefcase,
  ClipboardList,
  Brain,
  Map,
  Building2,
  Shield,
  FileText,
} from "lucide-react";
import { usePermissions } from "@/features/auth/hooks/usePermissions";
import { authService } from "@/features/auth/services/authService";

export const useSidebarConfig = (): SidebarConfig | null => {
  const { isAdmin, isCompany } = usePermissions();

  const hasSession = authService.isAuthenticated();
  if (!hasSession) {
    return null;
  }

  // Core tabs visible to every authenticated user (role: user/member)
  const navigationLinks = [
    { label: "Profile", path: "/profile", icon: User },
    { label: "Jobs", path: "/jobs", icon: Briefcase },
    { label: "Job Tracker", path: "/job-tracker", icon: ClipboardList },
    { label: "AI Analysis", path: "/ai", icon: Brain },
    { label: "Roadmaps", path: "/roadmaps", icon: Map },
    { label: "Posts", path: "/posts", icon: FileText },
  ];

  // Company tab: visible to company and admin roles
  if (isCompany || isAdmin) {
    navigationLinks.push({
      label: "Company",
      path: "/company/dashboard",
      icon: Building2,
    });
  }

  // Admin tab: visible to admin role only
  if (isAdmin) {
    navigationLinks.push({
      label: "Admin",
      path: "/admin/dashboard",
      icon: Shield,
    });
  }

  return {
    navigationLinks,
    navigationLabel: "Navigation",
  };
};
