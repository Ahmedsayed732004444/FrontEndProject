import React from "react";
import { Skeleton } from "@/shared/components/ui/skeleton";

export const PageSkeleton: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-background">
      {/* Header Skeleton */}
      <header className="h-16 border-b border-border flex items-center px-6">
        <Skeleton className="w-32 h-8 rounded" />
        <div className="ml-auto flex gap-4">
          <Skeleton className="w-20 h-8 rounded" />
          <Skeleton className="w-8 h-8 rounded-full" />
        </div>
      </header>

      {/* Content Skeleton */}
      <main className="container mx-auto p-6 max-w-7xl">
        {/* Page Title */}
        <div className="mb-8">
          <Skeleton className="w-64 h-10 rounded mb-2" />
          <Skeleton className="w-96 h-4 rounded" />
        </div>

        {/* Grid layout similar to dashboards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>

        {/* Main body area */}
        <div className="space-y-4">
          <Skeleton className="w-full h-16 rounded-xl" />
          <Skeleton className="w-full h-32 rounded-xl" />
          <Skeleton className="w-full h-64 rounded-xl" />
        </div>
      </main>
    </div>
  );
};
