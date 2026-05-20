import React from "react";
import { Users, ClipboardList, UserCheck } from "lucide-react";

interface StatsCardsProps {
  totalUsers: number;
  totalRoles: number;
  activeRoles: number;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  totalUsers,
  totalRoles,
  activeRoles,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Total Users */}
      <div className="data-card p-5 flex items-start justify-between">
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-semibold tracking-wider uppercase text-muted-foreground">
            TOTAL USERS
          </span>
          <span className="text-3xl font-bold text-foreground leading-tight">
            {totalUsers.toLocaleString()}
          </span>
          <span className="text-xs text-success flex items-center gap-1">
            <span className="text-sm">↑</span>
            <span className="font-semibold">12%</span>
            <span className="text-muted-foreground font-normal"> vs last month</span>
          </span>
        </div>
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <Users className="w-4.5 h-4.5 text-primary" />
        </div>
      </div>

      {/* Total Roles */}
      <div className="data-card p-5 flex items-start justify-between">
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-semibold tracking-wider uppercase text-muted-foreground">
            TOTAL ROLES
          </span>
          <span className="text-3xl font-bold text-foreground leading-tight">
            {totalRoles}
          </span>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <span className="font-semibold">—0%</span>
            <span className="font-normal"> vs last month</span>
          </span>
        </div>
        <div className="w-9 h-9 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
          <ClipboardList className="w-4.5 h-4.5 text-success" />
        </div>
      </div>

      {/* Active Roles */}
      <div className="data-card p-5 flex items-start justify-between">
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-semibold tracking-wider uppercase text-muted-foreground">
            ACTIVE ROLES
          </span>
          <span className="text-3xl font-bold text-foreground leading-tight">
            {activeRoles}
          </span>
          <span className="text-xs text-success flex items-center gap-1">
            <span className="text-sm">↑</span>
            <span className="font-semibold">2</span>
            <span className="text-muted-foreground font-normal"> added recently</span>
          </span>
        </div>
        <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
          <UserCheck className="w-4.5 h-4.5 text-purple-600" />
        </div>
      </div>
    </div>
  );
};
