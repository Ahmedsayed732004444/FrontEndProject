import { FileText, Briefcase, Compass, LayoutTemplate, LineChart, Video } from "lucide-react";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const features = [
  { icon: FileText, title: "AI Resume Analysis", description: "Get smart feedback on your resume to pass ATS filters and highlight strengths.", gradient: "from-purple-500 to-fuchsia-500" },
  { icon: Briefcase, title: "Application Tracking", description: "Manage your job hunt. Track statuses, follow-ups, and upcoming interviews.", gradient: "from-indigo-500 to-blue-500" },
  { icon: Compass, title: "Smart Discovery", description: "Get job recommendations based on your unique skills and career goals.", gradient: "from-teal-500 to-emerald-500" },
  { icon: LineChart, title: "Skill Gap Analysis", description: "Identify missing skills and get tailored learning paths for your dream role.", gradient: "from-emerald-500 to-green-500" },
  { icon: LayoutTemplate, title: "Digital Portfolio", description: "Create a stunning professional portfolio effortlessly to showcase your work.", gradient: "from-orange-500 to-rose-500" },
  { icon: Video, title: "Mock Interviews", description: "Practice with AI-driven interview simulations for technical and HR rounds.", gradient: "from-blue-500 to-cyan-500" },
];

export const FeaturesSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useGSAP(() => {
    gsap.fromTo(".feat-header", { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.8, scrollTrigger: { trigger: sectionRef.current, start: "top 65%" } });
    gsap.fromTo(".feat-card", { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08, scrollTrigger: { trigger: ".feat-grid", start: "top 70%" } });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="py-24 bg-background relative overflow-hidden">
      <div className="container relative z-10 mx-auto px-4 lg:px-8">
        <div className="feat-header mb-16 max-w-2xl mx-auto text-center">
          <p className="text-sm font-semibold tracking-widest text-purple-600 dark:text-purple-400 uppercase mb-4">Advanced Tools</p>
          <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl lg:text-5xl mb-6">Manage your entire <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">career journey</span></h2>
        </div>
        <div className="feat-grid grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="feat-card group relative rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-all hover:-translate-y-1">
              <div className={cn("mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-md", feature.gradient)}><feature.icon className="h-5 w-5" /></div>
              <h3 className="mb-2 text-lg font-bold text-foreground">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};