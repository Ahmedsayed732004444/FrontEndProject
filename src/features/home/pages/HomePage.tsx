import React from "react";
import { useNavigate } from "react-router-dom";
import { HeroSection, CTASection } from "@/features/home/components";

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/register");
  };

  const handleBrowseJobs = () => {
    navigate("/jobs");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <HeroSection
        onGetStarted={handleGetStarted}
        onBrowseJobs={handleBrowseJobs}
      />
      <CTASection />
    </div>
  );
};

export default Home;
