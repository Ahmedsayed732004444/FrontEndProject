import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetJobMatches } from "@/features/ai/hooks/useAi";
import {
  Briefcase,
  Target,
  BarChart3,
  Search,
  Loader2,
  MapPin,
  Building2,
  DollarSign,
  Zap,
} from "lucide-react";

interface JobMatchingTabProps {
  hasResume: boolean | undefined;
  setActiveTab: (tab: string) => void;
}

/* ── Circular score ring ── */
const ScoreRing: React.FC<{ score: number }> = ({ score }) => {
  const r = 28;
  const circ = 2 * Math.PI * r;
  const filled = (score / 100) * circ;
  const colorClass =
    score >= 80 ? "text-blue-600 stroke-blue-600" : score >= 60 ? "text-amber-500 stroke-amber-500" : "text-red-500 stroke-red-500";
  const label =
    score >= 85
      ? "LIKELY INTERVIEW"
      : score >= 70
      ? "GOOD FIT"
      : "PARTIAL FIT";

  return (
    <div className="flex flex-col items-center gap-1 shrink-0">
      <div className="relative w-[72px] h-[72px]">
        <svg
          width="72"
          height="72"
          viewBox="0 0 72 72"
          className="-rotate-90"
        >
          <circle
            cx="36"
            cy="36"
            r={r}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="5"
          />
          <circle
            cx="36"
            cy="36"
            r={r}
            fill="none"
            className={colorClass.split(" ")[1]}
            strokeWidth="5"
            strokeDasharray={`${filled} ${circ}`}
            strokeLinecap="round"
          />
        </svg>
        <div className={`absolute inset-0 flex items-center justify-center text-sm font-extrabold ${colorClass.split(" ")[0]}`}>
          {score}%
        </div>
      </div>
      <span className="text-[9.5px] font-bold tracking-wider text-slate-500 uppercase">
        {label}
      </span>
    </div>
  );
};

export const JobMatchingTab: React.FC<JobMatchingTabProps> = ({
  hasResume,
  setActiveTab,
}) => {
  const navigate = useNavigate();
  const {
    data: jobMatches,
    isLoading: loadingMatches,
    refetch: refetchMatches,
  } = useGetJobMatches();

  const [minScore, setMinScore] = useState(75);
  const [empTypes, setEmpTypes] = useState<string[]>(["Full-time", "Remote"]);
  const [salary, setSalary] = useState("$120k - $150k");

  const handleFindMatches = () => {
    refetchMatches();
  };

  const handleViewJob = (jobId: string) => {
    navigate(`/jobs/${jobId}`);
  };

  const toggleEmpType = (type: string) => {
    setEmpTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const noResume = (hasResume as boolean | undefined) === false;

  /* ── No-resume gate ── */
  if (noResume) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[320px] border-2 border-dashed border-gray-200 rounded-xl bg-slate-50 gap-3 p-12 text-center">
        <Target className="w-10 h-10 text-blue-300" />
        <h3 className="text-lg font-bold text-slate-900">
          CV Required
        </h3>
        <p className="text-sm text-slate-500 max-w-[360px]">
          Upload your CV to let our AI scan thousands of jobs and find your
          perfect matches instantly.
        </p>
        <button
          onClick={() => setActiveTab("cv-analysis")}
          className="mt-2 h-10 px-5 rounded-lg border-none bg-blue-600 hover:bg-blue-700 text-white text-[13.5px] font-semibold transition-colors"
        >
          Go to CV Analysis to Upload
        </button>
      </div>
    );
  }

  /* ── analytics helpers ── */
  const totalMatches = jobMatches?.length ?? 0;
  const highAlignment = jobMatches?.filter((m) => m.match_percentage >= 85).length ?? 0;
  const avgScore =
    jobMatches && jobMatches.length > 0
      ? Math.round(
          jobMatches.reduce((s, m) => s + m.match_percentage, 0) /
            jobMatches.length
        )
      : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6 items-start">
      {/* ── LEFT: Filter Panel ── */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm lg:sticky lg:top-24">
        <h3 className="text-[14.5px] font-bold text-slate-900 mb-4">
          Match Criteria
        </h3>

        {/* Match Score Range */}
        <div className="mb-5">
          <p className="text-xs font-semibold text-slate-700 mb-2.5">
            Match Score Range
          </p>
          <input
            type="range"
            min={0}
            max={100}
            value={minScore}
            onChange={(e) => setMinScore(Number(e.target.value))}
            className="w-full accent-blue-600 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-gray-400 mt-2">
            <span>0%</span>
            <span className="text-blue-600 font-bold">
              {minScore}%+ MIN
            </span>
            <span>100%</span>
          </div>
        </div>

        {/* Employment Type */}
        <div className="mb-5">
          <p className="text-xs font-semibold text-slate-700 mb-2.5">
            Employment Type
          </p>
          <div className="flex flex-col gap-2">
            {["Full-time", "Contract", "Remote"].map((type) => (
              <label
                key={type}
                className="flex items-center gap-2.5 text-sm text-slate-600 cursor-pointer hover:text-slate-900 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={empTypes.includes(type)}
                  onChange={() => toggleEmpType(type)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                {type}
              </label>
            ))}
          </div>
        </div>

        {/* Salary Expectations */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-slate-700 mb-2.5">
            Salary Expectations
          </p>
          <select
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            className="w-full h-9 px-3 border border-gray-200 rounded-lg text-sm text-slate-700 bg-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          >
            {[
              "$80k - $100k",
              "$100k - $120k",
              "$120k - $150k",
              "$150k - $180k",
              "$180k+",
            ].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Find Matches button */}
        <button
          onClick={handleFindMatches}
          disabled={loadingMatches}
          className={`
            w-full h-9 border-none rounded-lg text-white text-[13px] font-semibold flex items-center justify-center gap-2 transition-all
            ${loadingMatches ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 shadow-sm active:transform active:scale-[0.98]"}
          `}
        >
          {loadingMatches ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Scanning...
            </>
          ) : (
            <>
              <Search className="w-3.5 h-3.5" />
              Find Matches
            </>
          )}
        </button>
      </div>

      {/* ── RIGHT: Results ── */}
      <div className="flex flex-col gap-4">
        {/* Analytics cards — only shown when we have data */}
        {jobMatches && jobMatches.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Matches Found */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10.5px] font-bold tracking-widest text-slate-400 uppercase mb-1">MATCHES FOUND</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-slate-900">{totalMatches}</span>
                    <span className="text-[11.5px] text-green-500 font-bold">+2 this week</span>
                  </div>
                </div>
                <Briefcase className="w-[18px] h-[18px] text-blue-300" />
              </div>
            </div>

            {/* High Alignment */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10.5px] font-bold tracking-widest text-slate-400 uppercase mb-1">HIGH ALIGNMENT</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-slate-900">{highAlignment}</span>
                    <span className="text-[11.5px] text-slate-500 font-medium">Top 10% Match</span>
                  </div>
                </div>
                <Target className="w-[18px] h-[18px] text-indigo-400" />
              </div>
            </div>

            {/* Avg Match Score */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10.5px] font-bold tracking-widest text-slate-400 uppercase mb-1">AVG MATCH SCORE</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-slate-900">{avgScore}%</span>
                    <span className="text-[11.5px] text-green-500 font-bold">Healthy Range</span>
                  </div>
                </div>
                <BarChart3 className="w-[18px] h-[18px] text-emerald-400" />
              </div>
            </div>
          </div>
        )}

        {/* Job match cards */}
        {jobMatches && jobMatches.length > 0 ? (
          jobMatches
            .sort((a, b) => b.match_percentage - a.match_percentage)
            .map((match) => {
              const score = Math.round(match.match_percentage);
              const isLikelyInterview = score >= 88;

              return (
                <div
                  key={match.job_id}
                  className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-blue-100 transition-all cursor-pointer group"
                  onClick={() => handleViewJob(match.job_id)}
                >
                  {/* Badge row */}
                  {isLikelyInterview && (
                    <div className="mb-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[11px] font-bold text-blue-700">
                        <Zap className="w-2.5 h-2.5" />
                        Likely Interview
                      </span>
                    </div>
                  )}

                  {/* Title + Score ring row */}
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {match.job_title}
                      </h3>

                      {/* Meta row */}
                      <div className="flex flex-wrap gap-x-4 gap-y-2 text-[13px] text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5" />
                          {match.job_title.includes("Frontend")
                            ? "TechNova Inc."
                            : "DesignSystem Corp"}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5" />
                          Remote
                        </span>
                        <span className="flex items-center gap-1.5 font-medium text-slate-700">
                          <DollarSign className="w-3.5 h-3.5 text-green-600" />
                          $130k – $160k
                        </span>
                      </div>
                    </div>

                    {/* Circular score */}
                    <div className="self-center sm:self-start">
                      <ScoreRing score={score} />
                    </div>
                  </div>

                  {/* Skills row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5 pt-5 border-t border-slate-50">
                    {/* Matched skills */}
                    {match.matched_skills.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-2.5">
                          <p className="text-[10.5px] font-bold tracking-widest text-slate-400 uppercase">MATCHED SKILLS</p>
                          <span className="px-1.5 py-0.5 rounded-md bg-green-50 border border-green-100 text-[10px] font-bold text-green-700">
                            {match.matched_skills.length} Matches
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {match.matched_skills.map((skill, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-0.5 rounded-full bg-green-50 border border-green-100 text-[12px] font-medium text-green-700"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Missing skills */}
                    {match.missing_skills.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-2.5">
                          <p className="text-[10.5px] font-bold tracking-widest text-slate-400 uppercase">SKILLS TO ACQUIRE</p>
                          <span className="px-1.5 py-0.5 rounded-md bg-amber-50 border border-amber-100 text-[10px] font-bold text-amber-700">
                            {match.missing_skills.length} Gaps
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {match.missing_skills.map((skill, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-100 text-[12px] font-medium text-amber-700"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-end mt-4 pt-4 border-t border-slate-50">
                    <button
                      onClick={() => handleViewJob(match.job_id)}
                      className={`
                        h-9 px-5 rounded-lg text-sm font-semibold transition-colors
                        ${score >= 88 ? "bg-[#1e3a8a] text-white hover:bg-[#1e40af] border-none" : "bg-white text-slate-700 border border-gray-200 hover:bg-gray-50"}
                      `}
                    >
                      View Match Details
                    </button>
                  </div>
                </div>
              );
            })
        ) : !loadingMatches ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center min-h-[280px] border-2 border-dashed border-gray-200 rounded-xl bg-slate-50 gap-2.5 p-10 text-center">
            <Search className="w-9 h-9 text-gray-300" />
            <h3 className="text-base font-bold text-slate-900">
              No matches yet
            </h3>
            <p className="text-[13.5px] text-slate-500 max-w-[320px]">
              Click "Find Matches" to scan thousands of roles aligned to your
              profile.
            </p>
          </div>
        ) : null}

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
};
