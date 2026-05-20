import React, { useState } from "react";
import { useAnalyseCV } from "@/features/ai/hooks/useAi";
import {
  Upload,
  Download,
  Loader2,
  Zap,
  CheckCircle,
  XCircle,
  TrendingUp,
  AlertTriangle,
  MoreHorizontal,
  FileText,
  BarChart3,
} from "lucide-react";

interface CvAnalysisTabProps {
  hasResume: boolean | undefined;
}

/* ── Circular Score Ring ── */
const RoleScoreRing: React.FC<{ score: number; max?: number }> = ({ score, max = 100 }) => {
  const r = 44;
  const circ = 2 * Math.PI * r;
  const filled = (score / max) * circ;
  return (
    <div className="relative w-[110px] h-[110px] mx-auto mb-2">
      <svg width="110" height="110" viewBox="0 0 110 110" className="rotate-[-90deg]">
        <circle cx="55" cy="55" r={r} fill="none" stroke="#e5e7eb" strokeWidth="7" />
        <circle cx="55" cy="55" r={r} fill="none" stroke="#2563eb" strokeWidth="7"
          strokeDasharray={`${filled} ${circ}`} strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[26px] font-extrabold text-slate-900 leading-none">{score}</span>
        <span className="text-[11px] text-slate-400">/{max}</span>
      </div>
    </div>
  );
};

const SkillChip: React.FC<{ label: string; level?: string; color: string }> = ({ label, color }) => (
  <span className={`
    inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-xs font-medium
    ${color === "blue" ? "bg-blue-50 border-blue-200 text-blue-700" : 
      color === "green" ? "bg-green-50 border-green-200 text-green-700" : 
      "bg-slate-50 border-slate-200 text-slate-600"}
  `}>
    {label}
    <span className="text-[10px] opacity-70">◆</span>
  </span>
);

export const CvAnalysisTab: React.FC<CvAnalysisTabProps> = ({ hasResume: _hasResume }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [checklistItems, setChecklistItems] = useState([
    { id: 1, text: 'Quantify performance improvements (e.g., "Reduced load time by 6%")', checked: true },
    { id: 2, text: "Highlight mentoring or leadership experience explicitly. Crucial for transitioning to Staff/Lead roles.", checked: false },
    { id: 3, text: "Add specific architectural decisions to project descriptions. Move beyond just listing technologies used.", checked: false },
  ]);

  const analyseCVMutation = useAnalyseCV();

  const validateFile = (file: File): boolean => {
    const allowedTypes = [".pdf", ".doc", ".docx"];
    const maxSize = 5 * 1024 * 1024;
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
    if (!allowedTypes.includes(fileExtension)) { alert("Please select a PDF, DOC, or DOCX file"); return false; }
    if (file.size > maxSize) { alert("File size must be less than 5MB"); return false; }
    return true;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && validateFile(file)) { setSelectedFile(file); }
    else { setSelectedFile(null); event.target.value = ""; }
  };

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && validateFile(file)) setSelectedFile(file);
  };

  const handleAnalyseCV = () => {
    if (selectedFile) {
      analyseCVMutation.mutate(selectedFile, { onSuccess: (result) => setAnalysisResult(result) });
    }
  };

  const handleDownloadAnalysis = () => {
    const blob = new Blob([analysisResult], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "cv-analysis.txt"; a.click();
    window.URL.revokeObjectURL(url);
  };

  const parseAnalysisText = (text: string) => {
    const sections: { [key: string]: string } = {};
    const lines = text.split("\n");
    let currentSection = "", currentContent = "";
    for (const line of lines) {
      const t = line.trim();
      if (t.endsWith(":") && !t.startsWith("*") && !t.startsWith("-")) {
        if (currentSection) sections[currentSection] = currentContent.trim();
        currentSection = t.replace(/:$/, ""); currentContent = "";
      } else { currentContent += line + "\n"; }
    }
    if (currentSection) sections[currentSection] = currentContent.trim();
    return sections;
  };

  const toggleChecklist = (id: number) => {
    setChecklistItems((prev) => prev.map((item) => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const cardClassName = "bg-white border border-gray-200 rounded-xl p-5 sm:p-6 shadow-sm";
  const sectionTitleClassName = "text-[14.5px] font-bold text-slate-900 mb-3.5";

  return (
    <div className="flex flex-col gap-5">

      {/* ── Upload card ── */}
      <div className={cardClassName}>
        <div
          onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
          onClick={() => document.getElementById("cv-upload")?.click()}
          className={`
            border-2 border-dashed rounded-lg p-7 sm:p-10 text-center cursor-pointer mb-3.5 transition-all
            ${isDragging ? "border-blue-600 bg-blue-50" : "border-gray-300 bg-slate-50 hover:bg-slate-100/80"}
          `}
        >
          <input id="cv-upload" type="file" accept=".pdf,.doc,.docx" onChange={handleFileSelect} className="hidden" />
          <Upload className="w-7 h-7 text-gray-400 mx-auto mb-2.5" />
          <p className="text-sm font-semibold text-gray-700 mb-1">
            {selectedFile ? selectedFile.name : "Select or Drop CV"}
          </p>
          <p className="text-xs text-gray-400">
            {selectedFile ? "Click or drag to replace" : "Supports PDF, DOC, DOCX up to 5MB"}
          </p>
        </div>

        <button
          onClick={handleAnalyseCV}
          disabled={!selectedFile || analyseCVMutation.isPending}
          className={`
            w-full h-10 border-none rounded-lg text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors
            ${!selectedFile || analyseCVMutation.isPending ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}
          `}
        >
          {analyseCVMutation.isPending ? (
            <><Loader2 className="w-[15px] h-[15px] animate-spin" /> Running Deep Analysis...</>
          ) : (
            <><Zap className="w-3.5 h-3.5" /> Launch AI Analysis</>
          )}
        </button>
      </div>

      {/* ── Results (shown after analysis) ── */}
      {analysisResult && (
        <>
          {/* Top 3 metric cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {/* Role Alignment Score */}
            <div className={cardClassName}>
              <p className="text-xs font-semibold text-slate-500 mb-2.5 uppercase tracking-wider">Role Alignment Score</p>
              <RoleScoreRing score={85} />
              <p className="text-xs text-slate-500 text-center leading-relaxed">
                Highly aligned for <strong>Senior Frontend Engineer</strong> positions.
              </p>
            </div>

            {/* Market Readiness */}
            <div className={cardClassName}>
              <p className="text-xs font-semibold text-slate-500 mb-3 uppercase tracking-wider">Market Readiness</p>
              <div className="flex justify-between text-[11px] text-gray-400 mb-1.5 font-medium">
                <span>Top 10%</span><span>Applicant Pool</span>
              </div>
              <div className="h-1.5 rounded-full bg-gray-100 mb-4 overflow-hidden">
                <div className="w-[78%] h-full bg-blue-600 rounded-full" />
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex gap-2.5 items-start">
                  <TrendingUp className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-700 leading-normal">
                    <strong className="text-slate-900">High Demand Profile</strong><br />
                    Your React & TypeScript combination is requested in 78% of target listings.
                  </p>
                </div>
                <div className="flex gap-2.5 items-start">
                  <BarChart3 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-700 leading-normal">
                    <strong className="text-slate-900">Compensation Tier</strong><br />
                    Positioned for Tier 1 comp packages in the current macro-environment.
                  </p>
                </div>
              </div>
            </div>

            {/* Skill DNA */}
            <div className={`${cardClassName} md:col-span-2 lg:col-span-1`}>
              <p className="text-xs font-semibold text-slate-500 mb-3 uppercase tracking-wider">Skill DNA Analysis</p>
              <div className="flex flex-col gap-3.5">
                <div>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-[11px] font-bold text-slate-700">Technical</span>
                    <span className="text-[11px] text-blue-600 font-semibold">Expert</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <SkillChip label="React" level="Expert" color="blue" />
                    <SkillChip label="TypeScript" level="Expert" color="blue" />
                    <SkillChip label="Node.js" level="Expert" color="blue" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-[11px] font-bold text-slate-700">Power Skills</span>
                    <span className="text-[11px] text-green-600 font-semibold">Advanced</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <SkillChip label="Mentorship" level="Adv" color="green" />
                    <SkillChip label="System Design" level="Adv" color="green" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-[11px] font-bold text-slate-700">Tools</span>
                    <span className="text-[11px] text-slate-500 font-semibold">Proficient</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <SkillChip label="Figma" level="Prof" color="gray" />
                    <SkillChip label="Docker" level="Prof" color="gray" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Strengths + Strategic Gaps */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
            {/* Strengths */}
            <div className={cardClassName}>
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <h3 className={sectionTitleClassName + " mb-0"}>Strengths &amp; Differentiators</h3>
              </div>
              {[
                { n: 1, title: "Frontend Architecture Setup", desc: "Proven ability to design scalable component libraries, reducing technical debt by an estimated 30% based on project history." },
                { n: 2, title: "Performance Optimization", desc: "Consistent track record of improving Core Web Vitals, a highly sought-after metric in top-tier consumer applications." },
                { n: 3, title: "Cross-functional Collaboration", desc: "Strong signals in working alongside Product and Design, indicated by frequent successful feature deliveries." },
              ].map((s) => (
                <div key={s.n} className="flex gap-3 mb-3.5 last:mb-0">
                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[11px] font-bold text-slate-500 shrink-0 mt-0.5">{s.n}</div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 mb-0.5">{s.title}</p>
                    <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Strategic Gaps */}
            <div className={cardClassName}>
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <h3 className={sectionTitleClassName + " mb-0"}>Strategic Gaps</h3>
              </div>
              {[
                { title: "Cloud Orchestration (Kubernetes)", priority: "High Priority", priority_color: "text-red-600", bg: "bg-red-50", link: "Bridge this gap →", desc: "Required for 65% of Principal/Staff level roles." },
                { title: "Advanced CI/CD Pipelines", priority: "Medium Priority", priority_color: "text-amber-600", bg: "bg-amber-50", link: "Explore learning modules →", desc: "Expected competency for technical leadership." },
              ].map((g, i) => (
                <div key={i} className="border border-slate-100 rounded-lg p-3.5 mb-2.5 last:mb-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-bold text-slate-900">{g.title}</span>
                    <span className={`px-2 py-0.5 rounded-full ${g.bg} text-[10px] font-bold uppercase tracking-tight ${g.priority_color}`}>{g.priority}</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-2">{g.desc}</p>
                  <button className="text-xs text-blue-600 font-semibold hover:underline bg-none border-none p-0 cursor-pointer">{g.link}</button>
                </div>
              ))}
            </div>
          </div>

          {/* Career Trajectory */}
          <div className={cardClassName}>
            <div className="flex justify-between items-center mb-5">
              <h3 className={sectionTitleClassName + " mb-0"}>Career Trajectory: Path to Lead Architect</h3>
              <button className="bg-none border-none cursor-pointer text-slate-400 hover:text-slate-600">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-col gap-0">
              {[
                { active: true, tag: "CURRENT STATE", title: "Senior Frontend Engineer", desc: "Mastery of UI/UX implementation and frontend state management.", chips: [] },
                { active: false, tag: "6-12 MONTHS (AI RECOMMENDATION)", title: "Staff Engineer / Tech Lead", desc: "Focus on system design, cross-team architecture, and mentoring.", chips: ["System Design", "Leadership"] },
                { active: false, tag: "2-3 YEARS", title: "Principal Architect", desc: "Defining technical vision, org-wide standards, and evaluating new tech stacks.", chips: [] },
              ].map((step, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center shrink-0">
                    <div className={`
                      w-3.5 h-3.5 rounded-full mt-1 shrink-0
                      ${step.active ? "bg-blue-600" : "bg-white border-2 border-slate-300"}
                    `} />
                    {i < 2 && <div className="w-[1px] flex-1 bg-slate-200 my-1.5" />}
                  </div>
                  <div className={`${i < 2 ? "pb-5" : "pb-0"} flex-1`}>
                    {step.active ? (
                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5">
                        <p className="text-[10px] font-bold tracking-widest text-blue-600 uppercase mb-1">{step.tag}</p>
                        <p className="text-sm font-bold text-slate-900 mb-1">{step.title}</p>
                        <p className="text-xs text-slate-500 leading-normal">{step.desc}</p>
                      </div>
                    ) : (
                      <div className="pl-1">
                        <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1">{step.tag}</p>
                        <p className="text-sm font-bold text-slate-700 mb-1">{step.title}</p>
                        <p className="text-xs text-slate-500 leading-normal mb-2">{step.desc}</p>
                        {step.chips.length > 0 && (
                          <div className="flex gap-1.5 flex-wrap">
                            {step.chips.map((c) => (
                              <span key={c} className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[11px] font-medium text-slate-600">{c}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resume Optimization Checklist */}
          <div className={cardClassName}>
            <h3 className={sectionTitleClassName}>Resume Optimization Checklist</h3>
            <div className="flex flex-col gap-3 mb-5">
              {checklistItems.map((item) => (
                <label key={item.id} className="flex gap-3 cursor-pointer items-start">
                  <input type="checkbox" checked={item.checked} onChange={() => toggleChecklist(item.id)}
                    className="w-4 h-4 mt-0.5 accent-blue-600 shrink-0" />
                  <div className="flex-1">
                    <p className={`text-sm leading-relaxed ${item.checked ? "font-semibold text-slate-600" : "font-medium text-slate-900"}`}>{item.text}</p>
                  </div>
                </label>
              ))}
            </div>
            <div className="flex justify-end">
              <button className="h-9 px-5 border-none rounded-lg bg-[#1e3a8a] hover:bg-[#1e40af] text-white text-xs font-bold transition-colors">
                Auto-Update Resume
              </button>
            </div>
          </div>

          {/* Raw AI sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {Object.entries(parseAnalysisText(analysisResult)).map(([section, content]) => {
              const isStrengths = section.toLowerCase().includes("strength") || section.toLowerCase().includes("good");
              const isWeaknesses = section.toLowerCase().includes("weakness") || section.toLowerCase().includes("improve");
              return (
                <div key={section} className={cardClassName}>
                  <div className="flex items-center gap-2 mb-3">
                    {isStrengths && <CheckCircle className="w-3.5 h-3.5 text-green-500" />}
                    {isWeaknesses && <XCircle className="w-3.5 h-3.5 text-amber-500" />}
                    {!isStrengths && !isWeaknesses && <FileText className="w-3.5 h-3.5 text-blue-600" />}
                    <h4 className="text-sm font-bold text-slate-900">{section}</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{content}</p>
                </div>
              );
            })}
          </div>

          {/* Download button */}
          <div className="flex justify-end mt-2">
            <button onClick={handleDownloadAnalysis} className="inline-flex items-center gap-2 h-9 px-4 border border-slate-200 rounded-lg bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
              <Download className="w-3.5 h-3.5" />
              Export Report
            </button>
          </div>
        </>
      )}
    </div>
  );
};
