import { Button } from "@/shared/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Zap } from "lucide-react";

export const CTASection = () => {
  const navigate = useNavigate();
  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/30 border-t border-border/50">
      <div className="container mx-auto px-4 text-center max-w-3xl">
        <span className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-blue-500/10 text-blue-600 text-sm font-semibold">
          <Zap className="h-4 w-4" /> Available for Free & Premium Users
        </span>
        <h2 className="text-3xl md:text-5xl font-extrabold mb-6">Ready to elevate your professional journey?</h2>
        <p className="text-lg text-muted-foreground mb-10">Start with a free account, or upgrade to <strong className="text-foreground">Premium</strong> for advanced AI insights and prioritized matching.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button onClick={() => navigate("/register")} size="lg" className="w-full sm:w-auto h-14 px-10 bg-purple-600 rounded-xl">Create Your Account Now <ArrowRight className="ml-2 h-5 w-5" /></Button>
          <Button onClick={() => navigate("/pricing")} size="lg" variant="outline" className="w-full sm:w-auto h-14 px-10 rounded-xl">View Premium Plans</Button>
        </div>
      </div>
    </section>
  );
};