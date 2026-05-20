import { Button } from "@/shared/components/ui/button";
import team from "@/assets/imgs/home/hero-new.png";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { TextPlugin } from "gsap/TextPlugin";
import { useRef } from "react";
import { ArrowRight, Sparkles, Building2, Code, Laptop } from "lucide-react";

gsap.registerPlugin(TextPlugin);

interface HeroSectionProps {
  onGetStarted?: () => void;
  onBrowseJobs?: () => void;
}

export const HeroSection = ({
  onGetStarted,
  onBrowseJobs,
}: HeroSectionProps) => {
  const containerRef = useRef<HTMLElement>(null);
  const typeWriterRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(".hero-glow", { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 2, stagger: 0.2 });
    tl.fromTo(".hero-reveal", { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.12 }, "-=1.4");
    tl.fromTo(".hero-image-card", { autoAlpha: 0, y: 60, scale: 0.96 }, { autoAlpha: 1, y: 0, scale: 1, duration: 1 }, "-=0.8");
    tl.fromTo(".floating-shape", { autoAlpha: 0, scale: 0 }, { autoAlpha: 1, scale: 1, duration: 1, stagger: 0.3 }, "-=1");
    tl.fromTo(".trusted-by", { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.8 }, "-=0.5");

    const words = ["Developers", "Graduates", "Job Seekers", "Recruiters"];
    const mainTimeline = gsap.timeline({ repeat: -1 });

    words.forEach((word) => {
      const textTl = gsap.timeline({ repeat: 1, yoyo: true, repeatDelay: 1.8 });
      textTl.to(typeWriterRef.current, { duration: 0.8, text: word, ease: "none" });
      mainTimeline.add(textTl);
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative min-h-screen overflow-hidden bg-background">
      {/* Background Decorative Elements */}
      <div className="hero-glow absolute top-[-10%] left-1/2 -translate-x-1/2 h-[800px] w-[800px] rounded-full bg-primary/20 blur-[120px] dark:bg-primary/10 pointer-events-none" />
      <div className="hero-glow absolute bottom-[5%] right-[10%] h-[400px] w-[400px] rounded-full bg-purple-500/10 blur-[100px] dark:bg-purple-600/5 pointer-events-none" />
      <div className="hero-glow absolute top-[20%] left-[5%] h-[300px] w-[300px] rounded-full bg-blue-500/10 blur-[80px] dark:bg-blue-600/5 pointer-events-none" />

      {/* Floating Shapes */}
      <div className="floating-shape absolute top-1/4 left-10 w-24 h-24 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-3xl blur-xl animate-bounce pointer-events-none" style={{ animationDuration: '6s' }} />
      <div className="floating-shape absolute bottom-1/4 right-10 w-32 h-32 bg-gradient-to-tr from-blue-500/20 to-primary/20 rounded-full blur-xl animate-bounce pointer-events-none" style={{ animationDuration: '8s' }} />

      <div className="container relative z-10 mx-auto flex flex-col items-center px-4 pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="hero-reveal inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-5 py-2 text-sm font-semibold text-primary mb-10 shadow-sm backdrop-blur-md">
          <Sparkles className="h-4 w-4 animate-pulse" />
          <span>Next-Gen AI Career Platform</span>
        </div>

        <h1 className="hero-reveal text-center text-5xl font-black leading-[1.05] tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-8xl max-w-5xl">
          Elevate Your Career <br className="hidden sm:block" />
          With <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-blue-600">Precision AI</span>
        </h1>

        <p className="hero-reveal mt-8 text-center text-lg leading-relaxed text-muted-foreground sm:text-xl md:text-2xl max-w-3xl font-medium">
          Build your professional profile, analyze your skills, and let our intelligent algorithm match you with the perfect job opportunities.
        </p>

        <div className="hero-reveal mt-12 flex flex-col items-center gap-5 sm:flex-row">
          <Button onClick={onGetStarted} size="lg" className="group h-14 px-10 bg-primary text-white text-lg font-bold shadow-2xl shadow-primary/30 rounded-2xl transition-all hover:scale-105 hover:shadow-primary/40">
            <span className="flex items-center gap-2">Get Started Now <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" /></span>
          </Button>
          <Button onClick={onBrowseJobs} variant="outline" size="lg" className="h-14 px-10 text-lg font-bold border-border/80 rounded-2xl backdrop-blur-sm hover:bg-accent/50 transition-all">
            Explore Opportunities
          </Button>
        </div>

        {/* Dashboard Preview */}
        <div className="hero-image-card mt-20 w-full max-w-6xl relative">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
          <div className="relative rounded-[2.5rem] border border-white/10 bg-muted/20 p-2 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] backdrop-blur-xl overflow-hidden group">
            <div className="flex items-center gap-2 px-6 py-4 bg-muted/40 rounded-t-[2.2rem] border-b border-white/5">
              <div className="flex gap-2">
                <div className="h-3.5 w-3.5 rounded-full bg-red-500/60 shadow-sm" />
                <div className="h-3.5 w-3.5 rounded-full bg-yellow-500/60 shadow-sm" />
                <div className="h-3.5 w-3.5 rounded-full bg-green-500/60 shadow-sm" />
              </div>
            </div>
            <div className="relative overflow-hidden rounded-b-[2.2rem]">
              <img src={team} alt="Platform Dashboard" className="w-full h-auto transition-transform duration-700 group-hover:scale-[1.02]" />
            </div>
          </div>
        </div>

        {/* Trusted By Section */}
        <div className="trusted-by mt-32 w-full max-w-5xl">
          <div className="flex items-center gap-4 mb-10">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-border/50" />
            <p className="text-center text-xs font-bold text-muted-foreground/60 uppercase tracking-[0.2em]">Trusted by Industry Leaders</p>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-border/50" />
          </div>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-700">
            <div className="flex items-center gap-3 text-2xl font-black tracking-tighter text-foreground italic"><Building2 className="h-7 w-7 text-primary"/> TECHCORP</div>
            <div className="flex items-center gap-3 text-2xl font-black tracking-tighter text-foreground italic"><Laptop className="h-7 w-7 text-purple-500"/> DEVSTUDIO</div>
            <div className="flex items-center gap-3 text-2xl font-black tracking-tighter text-foreground italic"><Code className="h-7 w-7 text-blue-500"/> INNOVATE</div>
          </div>
        </div>
      </div>
    </section>
  );
};