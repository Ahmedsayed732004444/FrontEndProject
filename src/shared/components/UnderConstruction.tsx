import { Construction } from "lucide-react";

export const UnderConstruction = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
      <Construction className="w-16 h-16 text-muted-foreground/40" />
      <h2 className="text-2xl font-bold text-foreground">Under Construction</h2>
      <p className="text-muted-foreground max-w-sm">
        This page is coming soon. We're working hard to bring it to you.
      </p>
    </div>
  );
};
