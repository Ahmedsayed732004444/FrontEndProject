
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const StatsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const stats = [
    { value: "50,000+", label: "Active Job Seekers" },
    { value: "12,000+", label: "Successful Hires" },
    { value: "2M+", label: "Resumes Analyzed" },
    { value: "500+", label: "Partner Companies" },
  ];

  useGSAP(() => {
    gsap.fromTo(".stat-item", { autoAlpha: 0, scale: 0.8 }, { autoAlpha: 1, scale: 1, stagger: 0.15, scrollTrigger: { trigger: sectionRef.current, start: "top 70%" } });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="py-24 bg-slate-900 border-y border-white/10 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/40 via-slate-900/80 to-slate-900" />
      <div className="container relative z-10 mx-auto px-4">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <div key={i} className="stat-item text-center">
              <p className="text-4xl font-bold text-white mb-2">{stat.value}</p>
              <p className="text-sm font-medium uppercase text-white/80">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};