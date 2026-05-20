import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetInterviewQuestions, useSubmitInterview } from "@/features/jobs/hooks/useJobs";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  CheckCircle,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Flag,
  Clock,
  RotateCcw,
  Target,
  Zap,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Award,
  Sparkles,
} from "lucide-react";
import type { InterviewAnswer } from "@/features/interview/types/interview";

/* ─── shared style tokens ─── */
const card: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #e2e8f0",
  borderRadius: "16px",
  boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
};

/* ─── Circular score ring ─── */
const ScoreRing: React.FC<{ score: number; label: string }> = ({ score }) => {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const filled = (score / 100) * circ;
  const color = score >= 80 ? "#2563eb" : score >= 60 ? "#f59e0b" : "#ef4444";
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[130px] h-[130px]">
        <svg width="130" height="130" viewBox="0 0 130 130" className="-rotate-90">
          <circle cx="65" cy="65" r={r} fill="none" stroke="#f1f5f9" strokeWidth="8" />
          <circle cx="65" cy="65" r={r} fill="none" stroke={color} strokeWidth="8"
            strokeDasharray={`${filled} ${circ}`} strokeLinecap="round"
            className="transition-[stroke-dasharray] duration-1000 ease-out" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-slate-900 leading-none">{score}</span>
          <span className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-wider">OF 100</span>
          <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full mt-1.5 border border-blue-100 uppercase">Top 10%</span>
        </div>
      </div>
    </div>
  );
};

/* ─── Proficiency bar ─── */
const ProfBar: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div className="mb-2.5">
    <div className="flex justify-between mb-1">
      <span className="text-[12px] text-slate-600 font-medium">{label}</span>
      <span className="text-[12px] font-bold text-slate-900">{value}%</span>
    </div>
    <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
      <div className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-out" style={{ width: `${value}%` }} />
    </div>
  </div>
);

/* ─── Expandable review card ─── */
const ReviewCard: React.FC<{
  idx: number;
  detail: { questionId: number; question: string; yourAnswer: string; correctAnswer: string; isCorrect: boolean; explanation?: string };
}> = ({ idx, detail }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm transition-all">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-slate-50/50 transition-colors"
      >
        {detail.isCorrect ? (
          <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
        ) : (
          <XCircle className="w-5 h-5 text-red-500 shrink-0" />
        )}
        <span className="text-sm font-semibold text-slate-900 flex-1 leading-relaxed">
          <span className="text-slate-400 mr-2 font-medium">{idx + 1}.</span>
          {detail.question}
        </span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
        )}
      </button>

      {open && (
        <div className="px-5 pb-5 pt-0 border-t border-slate-50 animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
            <div className={`p-4 rounded-xl border ${detail.isCorrect ? "bg-emerald-50 border-emerald-100" : "bg-red-50 border-red-100"}`}>
              <p className={`text-[10px] font-bold tracking-widest uppercase mb-2 ${detail.isCorrect ? "text-emerald-700" : "text-red-700"}`}>YOUR ANSWER</p>
              <p className="text-sm text-slate-800 leading-relaxed">{detail.yourAnswer}</p>
            </div>
            <div className="p-4 rounded-xl border bg-emerald-50 border-emerald-100">
              <p className="text-[10px] font-bold tracking-widest uppercase text-emerald-700 mb-2">CORRECT ANSWER</p>
              <p className="text-sm text-slate-800 leading-relaxed">{detail.correctAnswer}</p>
            </div>
          </div>
          {detail.explanation && (
            <div className="mt-4 p-4 rounded-xl bg-blue-50/30 border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-xs font-bold text-slate-700">Expert Explanation</span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{detail.explanation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ─── MAIN COMPONENT ─── */
const InterviewPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { data: questions, isLoading, error } = useGetInterviewQuestions(jobId || "");
  const submitInterview = useSubmitInterview();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<InterviewAnswer[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [flagged, setFlagged] = useState(false);
  const [timer, setTimer] = useState(45 * 60); // 45 minutes in seconds

  useEffect(() => {
    if (isSubmitted) return;
    const interval = setInterval(() => setTimer((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(interval);
  }, [isSubmitted]);

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  /* ── Loading ── */
  if (isLoading) {
    return (
      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "32px 24px" }}>
        <Skeleton style={{ height: "8px", borderRadius: "4px", marginBottom: "32px" }} />
        <div style={{ ...card, padding: "32px" }}>
          <Skeleton style={{ height: "28px", width: "60%", marginBottom: "12px" }} />
          <Skeleton style={{ height: "16px", width: "100%", marginBottom: "8px" }} />
          <Skeleton style={{ height: "16px", width: "80%", marginBottom: "28px" }} />
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} style={{ height: "60px", borderRadius: "10px", marginBottom: "10px" }} />)}
        </div>
      </div>
    );
  }

  /* ── Error ── */
  if (error || !questions) {
    return (
      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ ...card, padding: "40px", textAlign: "center" }}>
          <XCircle style={{ width: "40px", height: "40px", color: "#ef4444", margin: "0 auto 12px" }} />
          <p style={{ fontSize: "15px", color: "#374151", marginBottom: "16px" }}>Failed to load interview questions.</p>
          <button onClick={() => navigate(-1)} style={{ height: "36px", padding: "0 18px", border: "1px solid #e2e8f0", borderRadius: "8px", background: "#fff", cursor: "pointer", fontWeight: 600, fontSize: "13.5px" }}>Go Back</button>
        </div>
      </div>
    );
  }

  /* ── Empty ── */
  if (questions.length === 0) {
    return (
      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ ...card, padding: "40px", textAlign: "center" }}>
          <p style={{ fontSize: "15px", color: "#374151", marginBottom: "16px" }}>No questions found for this interview.</p>
          <button onClick={() => navigate(-1)} style={{ height: "36px", padding: "0 18px", border: "1px solid #e2e8f0", borderRadius: "8px", background: "#fff", cursor: "pointer", fontWeight: 600, fontSize: "13.5px" }}>Go Back</button>
        </div>
      </div>
    );
  }

  /* ── Results view ── */
  if (isSubmitted && submitInterview.data) {
    const result = submitInterview.data;
    const percentage = Math.round((result.score / result.totalQuestions) * 100);
    const status = percentage >= 80 ? "EXCELLENT" : percentage >= 60 ? "GOOD" : "NEEDS IMPROVEMENT";
    const statusColor = percentage >= 80 ? "text-emerald-500" : percentage >= 60 ? "text-amber-500" : "text-red-500";
    const completionMins = Math.floor((45 * 60 - timer) / 60);
    const completionSecs = (45 * 60 - timer) % 60;

    const strengths = ["React Hooks", "State Management", "Component Lifecycle", "Accessibility (a11y)"];
    const growthAreas = ["Performance Optimization", "Webpack Config"];

    return (
      <div className="max-w-[860px] mx-auto p-4 sm:p-8 pb-16 font-sans bg-slate-50 min-h-screen">
        {/* Results header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight m-0">Interview Results</h1>
            <p className="text-sm text-slate-500 mt-1">
              {result.totalQuestions > 0 ? "Alex" : "Candidate"} · Senior Frontend Developer Assessment
            </p>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-1">
            <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">OVERALL STATUS</span>
            <span className={`flex items-center gap-1.5 text-base font-extrabold ${statusColor}`}>
              <Award className="w-4 h-4" />
              {status}
            </span>
          </div>
        </div>

        {/* Score card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-[160px_1fr_1fr] gap-8 items-start">
            {/* Score ring */}
            <div className="flex justify-center">
              <ScoreRing score={percentage} label="Score" />
            </div>

            {/* Strengths */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-4 h-4 text-emerald-500" />
                <span className="text-sm font-bold text-slate-900 uppercase tracking-wide">Strengths</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {strengths.map((s) => (
                  <span key={s} className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-[11px] font-semibold text-emerald-700">{s}</span>
                ))}
              </div>
              <div className="space-y-2 pt-4 border-t border-slate-100">
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Correctness</span>
                  <span className="font-bold text-slate-900">{result.correctAnswers} / {result.totalQuestions}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Completion Time</span>
                  <span className="font-bold text-slate-900">{completionMins}m {String(completionSecs).padStart(2, "0")}s</span>
                </div>
              </div>
            </div>

            {/* Growth + Market Readiness */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-bold text-slate-900 uppercase tracking-wide">Growth Areas</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {growthAreas.map((g) => (
                  <span key={g} className="px-2.5 py-1 rounded-full bg-amber-50 border border-amber-100 text-[11px] font-semibold text-amber-700">{g}</span>
                ))}
              </div>

              {/* Market readiness */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span className="text-xs font-bold text-slate-700">Market Readiness</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  Based on your score of {percentage}%, you demonstrate a strong command of core React principles.
                </p>
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">TECHNICAL PROFICIENCY</span>
                  <ProfBar label="Core React" value={95} />
                  <ProfBar label="Architecture" value={80} />
                  <ProfBar label="Performance" value={65} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed review */}
        <div className="mt-10">
          <h2 className="text-lg font-bold text-slate-900 mb-1">Detailed Review</h2>
          <p className="text-sm text-slate-500 mb-6">Review your answers and understand the rationale behind the correct solutions.</p>

          <div className="space-y-4">
            {result.details.map((detail, idx) => (
              <ReviewCard key={detail.questionId} idx={idx} detail={detail} />
            ))}
          </div>
        </div>

        {/* Bottom actions */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-10">
          <button
            onClick={() => { setIsSubmitted(false); setAnswers([]); setCurrentQuestionIndex(0); setTimer(45 * 60); }}
            className="h-10 px-6 border border-slate-200 rounded-xl bg-white text-sm font-bold text-slate-700 cursor-pointer hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Retake
          </button>
          <button
            onClick={() => navigate("/jobs")}
            className="h-10 px-8 border-none rounded-xl bg-blue-600 text-sm font-bold text-white cursor-pointer hover:bg-blue-700 transition-all shadow-md shadow-blue-200"
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  /* ── Assessment view ── */
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const progress = (currentQuestionIndex / questions.length) * 100;
  const currentAnswer = answers.find((a) => a.questionId === currentQuestion.id);
  const hasSelected = !!currentAnswer;

  const handleSelectOption = (optionId: number) => {
    setAnswers((prev) => {
      const existing = prev.findIndex((a) => a.questionId === currentQuestion.id);
      if (existing >= 0) {
        const next = [...prev];
        next[existing] = { questionId: currentQuestion.id, selectedOptionId: optionId };
        return next;
      }
      return [...prev, { questionId: currentQuestion.id, selectedOptionId: optionId }];
    });
  };

  const handleNext = () => {
    if (isLastQuestion) {
      if (!jobId) return;
      submitInterview.mutate({ jobId, request: { answers } }, { onSuccess: () => setIsSubmitted(true) });
    } else {
      setCurrentQuestionIndex((p) => p + 1);
    }
  };

  const handlePrevious = () => setCurrentQuestionIndex((p) => Math.max(0, p - 1));

  const timerWarning = timer < 5 * 60;

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      <div className="max-w-[720px] mx-auto p-4 sm:p-8 pb-24">

        {/* Top bar: breadcrumb + flag + timer */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <span className="text-sm text-slate-500 font-medium">
            Technical Assessment <span className="mx-1 text-slate-300">/</span>
            <span className="text-slate-900 font-bold">React Core</span>
          </span>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => setFlagged((f) => !f)}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 h-9 px-4 border rounded-xl text-xs font-bold transition-all shadow-sm
                ${flagged ? "bg-amber-50 border-amber-200 text-amber-700" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}
            >
              <Flag className="w-3.5 h-3.5" />
              {flagged ? "Flagged" : "Flag"}
            </button>
            <div className={`flex items-center gap-2 h-9 px-4 border rounded-xl text-sm font-bold shadow-sm
              ${timerWarning ? "bg-red-50 border-red-200 text-red-600 animate-pulse" : "bg-white border-slate-200 text-slate-700"}`}>
              <Clock className="w-3.5 h-3.5" />
              {formatTime(timer)}
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">
            <span className="text-blue-600">Question {currentQuestionIndex + 1} of {questions.length}</span>
            <span>{Math.round(progress)}% Done</span>
          </div>
          <div className="h-2 rounded-full bg-slate-200 overflow-hidden shadow-inner">
            <div className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Question card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-sm mb-6">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight mb-10 tracking-tight">
            {currentQuestion.question}
          </h2>

          {/* Answer options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option) => {
              const selected = currentAnswer?.selectedOptionId === option.id;
              return (
                <label
                  key={option.id}
                  onClick={() => handleSelectOption(option.id)}
                  className={`flex items-center gap-4 p-4 sm:p-5 border-2 rounded-2xl cursor-pointer transition-all duration-200 group
                    ${selected ? "border-blue-600 bg-blue-50/50 shadow-md shadow-blue-100/50" : "border-slate-100 hover:border-slate-200 bg-white"}`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all
                    ${selected ? "border-blue-600 bg-blue-600" : "border-slate-300 group-hover:border-slate-400 bg-white"}`}>
                    {selected && <div className="w-2 h-2 rounded-full bg-white shadow-sm" />}
                  </div>
                  <span className={`text-sm sm:text-base font-semibold leading-relaxed transition-colors
                    ${selected ? "text-blue-900" : "text-slate-600 group-hover:text-slate-900"}`}>
                    {option.optionText}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-4">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0 || submitInterview.isPending}
            className="flex items-center gap-2 h-11 px-5 border border-slate-200 rounded-xl bg-white text-sm font-bold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Previous
          </button>

          <button
            onClick={handleNext}
            disabled={!hasSelected || submitInterview.isPending}
            className={`flex items-center gap-2 h-11 px-6 rounded-xl text-sm font-bold text-white transition-all shadow-md
              ${!hasSelected || submitInterview.isPending ? "bg-slate-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-blue-200"}`}
          >
            {submitInterview.isPending ? "Submitting..." : isLastQuestion ? "Submit Interview" : "Next Question"}
            {!isLastQuestion && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewPage;
