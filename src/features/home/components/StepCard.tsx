import { cn } from "@/lib/utils";

interface StepCardProps {
  stepNumber: number;
  title: string;
  description: string;
  colorClass: string;
  className?: string;
}

export const StepCard = ({
  stepNumber,
  title,
  description,
  colorClass,
  className,
}: StepCardProps) => {
  return (
    <div className={cn("flex flex-col items-center text-center", className)}>
      {/* Numbered Circle */}
      <div
        className={cn(
          "mb-6 flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold text-white shadow-lg sm:h-20 sm:w-20 sm:text-3xl bg-gradient-to-br",
          colorClass
        )}
      >
        {stepNumber}
      </div>

      {/* Title */}
      <h3 className="mb-3 text-xl font-bold text-foreground sm:text-2xl">
        {title}
      </h3>

      {/* Description */}
      <p className="max-w-sm text-sm leading-relaxed text-muted-foreground sm:text-base">
        {description}
      </p>
    </div>
  );
};
