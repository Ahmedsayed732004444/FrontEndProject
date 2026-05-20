import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCheckHasResume } from "@/features/ai/hooks/useAi";
import { Button } from "@/shared/components/ui/button";
import { Loader2, LogIn } from "lucide-react";
import { authService } from "@/features/auth/services/authService";
import { AiHeroSection } from "@/features/ai/components/AiHeroSection";
import { CvAnalysisTab } from "@/features/ai/components/CvAnalysisTab";
import { JobMatchingTab } from "@/features/ai/components/JobMatchingTab";

const AiPage: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = authService.isAuthenticated();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("cv-analysis");

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "cv-analysis") {
      setActiveTab("cv-analysis");
    } else if (tab === "job-matching") {
      setActiveTab("job-matching");
    }
  }, [searchParams]);

  const { data: hasResume, isLoading: checkingResume } = useCheckHasResume();

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] p-8">
        <div className="bg-white border border-gray-200 rounded-2xl p-12 max-w-[420px] w-full text-center shadow-lg">
          <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-5">
            <LogIn className="w-7 h-7 text-blue-600" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mb-2">
            Authentication Required
          </h2>
          <p className="text-sm text-slate-500 mb-6 leading-relaxed">
            Please log in or create an account to access the AI Career
            Assistant and unlock your personalized insights.
          </p>
          <div className="flex flex-col gap-2.5">
            <Button
              onClick={() => navigate("/login")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              Sign In
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/register")}
              className="font-semibold"
            >
              Create Account
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (checkingResume) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-9 h-9 text-blue-600 animate-spin" />
        <p className="text-sm text-slate-500 font-medium">
          Waking up the AI...
        </p>
      </div>
    );
  }

  const tabs = [
    { key: "cv-analysis", label: "CV Analysis" },
    { key: "job-matching", label: "Job Matching" },
  ];

  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-8 sm:py-14 font-['Inter',_system-ui,_sans-serif]">
      <AiHeroSection />

      {/* ── Tab strip ── */}
      <div className="flex border-b border-gray-200 mb-6 gap-0 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`
                py-2.5 mr-7 border-none bg-transparent text-sm transition-all whitespace-nowrap -mb-[1px]
                ${isActive 
                  ? "font-semibold text-blue-600 border-b-2 border-blue-600" 
                  : "font-medium text-gray-500 border-b-2 border-transparent"}
              `}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── Tab content ── */}
      <div className="mt-2">
        {activeTab === "cv-analysis" && (
          <CvAnalysisTab hasResume={hasResume} />
        )}
        {activeTab === "job-matching" && (
          <JobMatchingTab hasResume={hasResume} setActiveTab={setActiveTab} />
        )}
      </div>
    </div>
  );
};

export default AiPage;
