import { Building, UserCircle } from "lucide-react";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FeatureList } from "./FeatureList";

gsap.registerPlugin(ScrollTrigger);

export const AudienceSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  const jobSeekerFeatures = [
    { text: "AI Resume & Profile Analysis" },
    { text: "Smart Job Discovery & Filtering" },
    { text: "Skill Gap Analysis & Insights" },
    { text: "Interview Preparation & Mock Interviews" },
  ];

  const recruiterFeatures = [
    { text: "Access to Pre-vetted Talent Pool" },
    { text: "AI-Powered Candidate Matching" },
    { text: "Company Branding & Employer Profile" },
    { text: "Automated Application Tracking" },
  ];

  useGSAP(() => {
    gsap.fromTo(".audience-box", { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.2, ease: "power2.out", scrollTrigger: { trigger: sectionRef.current, start: "top 70%" } });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="py-24 bg-background relative border-t border-border/50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl mb-6">
            One Platform. <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">Two Powerful Experiences.</span>
          </h2>
          <p className="text-lg text-muted-foreground">Tailored tools for students, professionals, and recruiters to succeed in the modern job market.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="audience-box relative rounded-3xl border border-border bg-card p-8 md:p-10 shadow-lg">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400"><UserCircle className="h-8 w-8" /></div>
            <h3 className="text-2xl font-bold text-foreground mb-4">For Job Seekers & Grads</h3>
            <p className="text-muted-foreground mb-8">Build a standout digital portfolio and let our AI match you with companies looking for your exact skills.</p>
            <FeatureList features={jobSeekerFeatures} />
          </div>

          <div className="audience-box relative rounded-3xl border border-border bg-card p-8 md:p-10 shadow-lg">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400"><Building className="h-8 w-8" /></div>
            <h3 className="text-2xl font-bold text-foreground mb-4">For Recruiters</h3>
            <p className="text-muted-foreground mb-8">Stop sifting through resumes. Post jobs and instantly get matched with AI-vetted tech professionals.</p>
            <FeatureList features={recruiterFeatures} />
          </div>
        </div>
      </div>
    </section>
  );
};