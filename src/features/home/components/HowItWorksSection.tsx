import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FileEdit, Sparkles, Target, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

export const HowItWorksSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const steps = [
    { stepNumber: 1, title: "Build Your Profile", description: "Upload your resume and let our AI create a premium digital portfolio.", icon: FileEdit, gradient: "from-purple-500 to-fuchsia-500", accentTitle: "text-purple-400" },
    { stepNumber: 2, title: "Get Matched", description: "Our algorithm filters thousands of listings to find your perfect fit.", icon: Sparkles, gradient: "from-indigo-400 to-blue-500", accentTitle: "text-indigo-400" },
    { stepNumber: 3, title: "Land The Job", description: "Track applications and practice with AI interviews to step into your new role.", icon: Target, gradient: "from-teal-400 to-emerald-500", accentTitle: "text-teal-400" },
  ];

  useGSAP(() => {
    gsap.fromTo(".hiw-card", { autoAlpha: 0, x: -40 }, { autoAlpha: 1, x: 0, duration: 0.7, stagger: 0.2, scrollTrigger: { trigger: ".hiw-grid", start: "top 75%" } });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="py-24 bg-muted/20 relative overflow-hidden">
      <div className="container relative z-10 mx-auto px-4 lg:px-8">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl font-extrabold sm:text-4xl mb-4">How Career Path Works</h2>
        </div>
        <div className="hiw-grid relative flex flex-col md:flex-row items-center justify-center gap-6 lg:gap-10">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col md:flex-row items-center gap-6 w-full md:w-1/3">
              <div className="hiw-card group relative w-full rounded-3xl border border-border/50 bg-background/50 p-8 text-center flex flex-col items-center">
                <div className={cn("absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-7xl font-black opacity-10", step.accentTitle)}>{step.stepNumber}</div>
                <div className={cn("relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl text-white", step.gradient)}><step.icon className="h-8 w-8" /></div>
                <h3 className="mt-6 mb-3 text-2xl font-bold">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
              {index < 2 && <ArrowRight className="hidden md:block h-6 w-6 text-muted-foreground" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};