import React from "react";
import { Skeleton } from "@/shared/components/ui/skeleton";

interface BaseLoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const BaseLoader: React.FC<BaseLoaderProps> = ({ size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  };

  return (
    <div className={`flex items-center justify-center p-4 ${className}`}>
      <Skeleton className={`rounded-full ${sizeClasses[size]} animate-spin border-4 border-gray-200 border-t-primary bg-transparent`} />
    </div>
  );
};
