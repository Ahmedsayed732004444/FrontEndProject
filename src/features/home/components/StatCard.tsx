import { cn } from "@/lib/utils";
import { Users } from "lucide-react";

interface StatCardProps {
  value: string;
  label: string;
  className?: string;
}

export const StatCard = ({ value, label, className }: StatCardProps) => {
  return (
    <div
      className={cn(
        "rounded-lg bg-card p-4 shadow-lg backdrop-blur-sm",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--success)] text-[var(--success-foreground)]">
          <Users className="h-4 w-4" />
        </div>
        <div>
          <p className="text-lg font-semibold text-card-foreground">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </div>
    </div>
  );
};

