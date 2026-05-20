import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Feature {
  text: string;
}

interface FeatureListProps {
  features: Feature[];
  className?: string;
}

export const FeatureList = ({ features, className }: FeatureListProps) => {
  return (
    <ul className={cn("flex flex-col gap-3", className)}>
      {features.map((feature, index) => (
        <li key={index} className="flex items-center gap-3">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--success)] text-[var(--success-foreground)]">
            <Check className="h-4 w-4" />
          </div>
          <span className="text-sm text-foreground md:text-base">
            {feature.text}
          </span>
        </li>
      ))}
    </ul>
  );
};

