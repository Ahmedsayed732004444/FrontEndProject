import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/shared/components/ui/card";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  colorClass: string;
  bgClass: string;
  textClass: string;
  className?: string;
}

export const FeatureCard = ({
  icon: Icon,
  title,
  description,
  colorClass,
  bgClass,
  textClass,
  className,
}: FeatureCardProps) => {
  return (
    <Card
      className={cn(
        "border border-border shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full",
        bgClass,
        className
      )}
    >
      <CardContent className="p-6">
        <div className="mb-5 flex items-start justify-between">
          <div
            className={cn(
              "flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-inner",
              colorClass
            )}
          >
            <Icon className="h-7 w-7" />
          </div>
        </div>
        <h3 className={cn("mb-3 text-xl font-bold tracking-tight", textClass)}>{title}</h3>
        <p className="text-base leading-relaxed text-muted-foreground">
          {description}
        </p>
      </CardContent>
    </Card>
  );
};
