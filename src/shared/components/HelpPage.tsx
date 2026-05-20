import React from "react";
import { 
  HelpCircle, 
  Lightbulb, 
  Target, 
  Rocket, 
  Mail, 
  ChevronRight,
  Sparkles,
  Zap,
  Globe,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";

const HelpPage: React.FC = () => {
  const email = "sayed732004444@gmail.com";

  const features = [
    {
      icon: <Sparkles className="h-6 w-6 text-yellow-500" />,
      title: "AI-Powered Career Guidance",
      description: "Our advanced AI analyzes your skills and aspirations to suggest the perfect career path for you."
    },
    {
      icon: <Zap className="h-6 w-6 text-blue-500" />,
      title: "Personalized Learning Roadmaps",
      description: "Get step-by-step guides and curated resources to master the skills needed for your dream job."
    },
    {
      icon: <Globe className="h-6 w-6 text-green-500" />,
      title: "Job Tracker",
      description: "Manage all your job applications in one place with our intuitive tracking system."
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-purple-500" />,
      title: "Verified Assessments",
      description: "Take skill assessments and add verified badges to your profile to stand out to recruiters."
    }
  ];

  const benefits = [
    {
      title: "Identify Skill Gaps",
      content: "Understand exactly what you need to learn to reach the next level in your career."
    },
    {
      title: "Save Time",
      content: "Stop searching for resources; let our AI curate the best learning materials for you."
    },
    {
      title: "Boost Visibility",
      content: "Professional profiles and verified skills make you 3x more likely to be noticed by top companies."
    }
  ];

  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="text-center space-y-6">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-2">
          <HelpCircle className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
          How can we help you today?
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Discover how Career Path can transform your professional journey and help you achieve your goals with the power of AI.
        </p>
      </div>

      {/* What We Do Section */}
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-yellow-500/10 text-yellow-600">
            <Lightbulb className="h-6 w-6" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight">What We Do</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-none bg-card/50 backdrop-blur-sm shadow-md hover:shadow-xl transition-all duration-300 group overflow-hidden">
              <CardContent className="p-8 relative">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  {feature.icon}
                </div>
                <div className="mb-4 h-12 w-12 flex items-center justify-center rounded-xl bg-muted group-hover:bg-primary/10 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* How You Benefit Section */}
      <div className="space-y-8 bg-muted/30 rounded-[2rem] p-8 md:p-12 border border-border/50">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
            <Target className="h-6 w-6" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight">How You Benefit</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="space-y-4">
              <div className="flex items-center gap-2 text-primary font-bold">
                <ChevronRight className="h-5 w-5" />
                <span>Benefit {index + 1}</span>
              </div>
              <h4 className="text-xl font-bold">{benefit.title}</h4>
              <p className="text-muted-foreground leading-relaxed">
                {benefit.content}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Our Mission Section */}
      <div className="relative rounded-[2.5rem] bg-primary text-primary-foreground p-10 md:p-16 overflow-hidden">
        <div className="absolute top-0 right-0 -m-20 h-80 w-80 rounded-full bg-white/10 blur-[80px]" />
        <div className="absolute bottom-0 left-0 -m-20 h-60 w-60 rounded-full bg-black/10 blur-[60px]" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 text-sm font-bold backdrop-blur-md">
              <Rocket className="h-4 w-4" />
              <span>Our Mission</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black leading-tight">
              Empowering the next generation of professionals.
            </h2>
            <p className="text-primary-foreground/80 text-lg leading-relaxed max-w-xl">
              We believe that everyone deserves a clear path to success. Career Path uses cutting-edge technology to level the playing field and provide expert guidance to everyone, everywhere.
            </p>
          </div>
          <div className="w-full md:w-auto">
            <Button size="lg" variant="secondary" className="h-14 px-8 text-lg font-bold rounded-2xl shadow-xl hover:scale-105 transition-transform" asChild>
              <a href={`mailto:${email}`}>
                Join Our Mission
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="text-center space-y-8 pb-10">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">Still have questions?</h2>
          <p className="text-muted-foreground text-lg">
            We're always here to listen. Send us a message and we'll get back to you as soon as possible.
          </p>
        </div>
        
        <div className="max-w-md mx-auto p-8 rounded-3xl bg-card shadow-2xl border border-border/50 space-y-6">
          <div className="h-16 w-16 mx-auto flex items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Mail className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Direct Email</p>
            <p className="text-2xl font-bold text-foreground break-all">{email}</p>
          </div>
          <Button size="lg" className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20" asChild>
            <a href={`mailto:${email}`}>
              Send us a message
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
