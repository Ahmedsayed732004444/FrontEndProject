import React from "react";
import { BotMessageSquare, Download, Share2 } from "lucide-react";

export const AiHeroSection: React.FC = () => {
  return (
    <div className="mb-6 sm:mb-8">
      {/* Live badge */}
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-blue-200 bg-blue-50 text-[11px] sm:text-[11.5px] font-semibold text-blue-700 mb-2.5 tracking-wide">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
        <BotMessageSquare className="w-3 h-3 sm:w-[13px] sm:h-[13px]" />
        AI CAREER ASSISTANT
      </div>

      {/* Title row */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4 sm:gap-6">
        <div className="max-w-[480px]">
          <h1 className="text-2xl sm:text-[28px] font-extrabold text-slate-900 mb-1.5 tracking-tight leading-tight">
            Career Optimization Engine
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            Leverage AI to align your profile with market demands and discover
            your perfect roles.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 mt-2 sm:mt-0">
          <button className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 h-9 px-3.5 border border-gray-200 rounded-lg bg-white text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
            <Download className="w-3 h-3 sm:w-[13px] sm:h-[13px]" />
            <span className="whitespace-nowrap">Export PDF Report</span>
          </button>
          <button className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 h-9 px-3.5 border border-gray-200 rounded-lg bg-white text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
            <Share2 className="w-3 h-3 sm:w-[13px] sm:h-[13px]" />
            <span className="whitespace-nowrap">Share with Recruiter</span>
          </button>
        </div>
      </div>
    </div>
  );
};
