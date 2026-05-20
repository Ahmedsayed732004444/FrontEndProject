import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetRoadmapById, useToggleSaveRoadmap } from "@/features/roadmaps/hooks/useRoadmap";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  ArrowLeft, Bookmark, BookmarkCheck, Clock,
  AlertTriangle, ExternalLink, Briefcase,
  BookOpen, Sparkles,
  Play, FileText,
} from "lucide-react";

/* ── type badges (unchanged logic) ── */



function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short" });
}



/* ── resource icon helper ── */
const ResourceIcon = ({ type }: { type: string }) => {
  const t = type.toLowerCase();
  if (t === "video") return <Play className="w-3.5 h-3.5 text-blue-500 shrink-0" />;
  return <FileText className="w-3.5 h-3.5 text-red-400 shrink-0" />;
};

/* ── loading skeleton ── */
const DetailsSkeleton = () => (
  <div className="min-h-screen bg-gray-50 px-6 py-6">
    <Skeleton className="h-4 w-32 mb-4" />
    <div className="bg-white border border-gray-200 rounded-xl p-6 mb-5 space-y-3">
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
    <div className="grid grid-cols-3 gap-4 mb-6">
      {[0,1,2].map(i => <Skeleton key={i} className="h-24 rounded-xl" />)}
    </div>
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      ))}
    </div>
  </div>
);

/* ── main page ── */
const RoadmapDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const roadmapId = parseInt(id!);

  const { data: roadmap, isLoading, error } = useGetRoadmapById(roadmapId);
  const toggleSave = useToggleSaveRoadmap();

  const handleToggleSave = () => { if (roadmap) toggleSave.mutate(roadmap.id); };

  if (isLoading) return <DetailsSkeleton />;

  if (error || !roadmap) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-xl bg-red-50 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Roadmap Not Found</h2>
          <p className="text-sm text-gray-500 mb-5">The requested roadmap was not found or could not be loaded.</p>
          <Button onClick={() => navigate("/roadmaps")} className="rounded-lg gap-2 bg-blue-600 hover:bg-blue-700">
            <ArrowLeft className="w-4 h-4" /> Back to Roadmaps
          </Button>
        </div>
      </div>
    );
  }

  const { roadmapData } = roadmap;
  const totalModules    = roadmapData.modules.length;
  const projectModules  = roadmapData.modules.filter(m => m.project).length;
  const totalResources  = roadmapData.modules.reduce((sum, m) => sum + m.resources.length, 0);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-6">

      {/* Back */}
      <button
        onClick={() => navigate("/roadmaps")}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors font-medium mb-4"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Roadmaps
      </button>

      {/* ── Hero Card ── */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 border border-gray-200 rounded-xl p-7 mb-5">

        {/* Generation failed banner */}
        {roadmapData.generation_failed && (
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-5">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-700">
              This roadmap was generated with partial data. Some information may be incomplete.
            </p>
          </div>
        )}

        {/* Path badge */}
        <div className="mb-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border border-gray-200 bg-white text-gray-600">
            <Sparkles className="w-3 h-3 text-blue-500" />
            {roadmapData.roadmap_type ?? "Advanced Path"}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">
          {roadmapData.roadmap_title}
        </h1>

        {/* Description — use a fallback if none */}
        <p className="text-sm text-gray-600 leading-relaxed mb-5 max-w-2xl">
          {(roadmapData as any).description ??
            "Master the technical depth and strategic oversight required to lead complex engineering initiatives. This roadmap covers system architecture, team management, and scaling cloud infrastructure."}
        </p>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-5 text-sm text-gray-500">
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            {roadmapData.duration_weeks} Weeks
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            Updated {formatDate(roadmap.createdAt)}
          </span>
          {roadmap.isSaved && (
            <span className="flex items-center gap-1.5 text-blue-600 font-medium">
              <BookmarkCheck className="w-4 h-4" />
              Saved
            </span>
          )}
        </div>
      </div>

      {/* ── Stats Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{totalModules}</p>
            <p className="text-xs text-gray-500">Core Modules</p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
            <Briefcase className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{projectModules}</p>
            <p className="text-xs text-gray-500">Capstone Projects</p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4 sm:col-span-2 lg:col-span-1">
          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
            <ExternalLink className="w-5 h-5 text-gray-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{totalResources}+</p>
            <p className="text-xs text-gray-500">Curated Resources</p>
          </div>
        </div>
      </div>

      {/* ── Learning Modules ── */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Learning Modules</h2>

        <div className="relative space-y-0">
          {/* Vertical timeline line */}
          <div className="absolute left-[19px] top-5 bottom-5 w-px bg-gray-200 hidden sm:block" />

          {roadmapData.modules.map((module, index) => (
            <div key={index} className="relative flex gap-4 pb-4">
              {/* Week dot */}
              <div className="hidden sm:flex shrink-0 z-10">
                <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center text-xs font-bold bg-white ${
                  module.project
                    ? "border-amber-300 text-amber-600"
                    : "border-blue-600 bg-blue-600 text-white"
                }`}>
                  W{module.week}
                </div>
              </div>

              {/* Card */}
              <div className="flex-1 bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="p-5">
                  {/* Week badge mobile */}
                  <span className="sm:hidden inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold mb-2">
                    W{module.week}
                  </span>

                  <h3 className="text-base font-bold text-gray-900 mb-2">{module.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4">{module.description}</p>

                  {/* Skills */}
                  {module.skills_covered.length > 0 && (
                    <div className="mb-4">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Skills Covered</p>
                      <div className="flex flex-wrap gap-1.5">
                        {module.skills_covered.map((skill, si) => (
                          <span
                            key={si}
                            className="text-xs text-gray-600 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Resources */}
                  {module.resources.length > 0 && (
                    <div className="border-t border-gray-100 pt-4">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Key Resources</p>
                      <div className="space-y-2.5">
                        {module.resources.map((resource, ri) => (
                          <a
                            key={ri}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-start gap-2 group"
                          >
                            <ResourceIcon type={resource.type} />
                            <div className="min-w-0">
                              <p className="text-sm text-blue-600 group-hover:text-blue-800 font-medium leading-tight truncate">
                                {resource.url}
                              </p>
                              <p className="text-xs text-gray-400 mt-0.5 capitalize">
                                {resource.type} • {resource.type === "video" ? "45 min" : "15 min read"}
                              </p>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA Footer ── */}
      <div className="bg-white border border-gray-200 rounded-xl p-8 text-center mt-2">
        <h3 className="text-lg font-bold text-gray-900 mb-1">Ready to start learning?</h3>
        <p className="text-sm text-gray-500 mb-5">Save this roadmap to your dashboard to track your progress.</p>
        <Button
          onClick={handleToggleSave}
          disabled={toggleSave.isPending}
          className={`rounded-lg font-semibold gap-2 h-10 px-8 ${
            roadmap.isSaved
              ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {roadmap.isSaved
            ? <><Bookmark className="w-4 h-4" /> Unsave Roadmap</>
            : <><BookmarkCheck className="w-4 h-4" /> Save Roadmap</>
          }
        </Button>
      </div>
    </div>
  );
};

export default RoadmapDetailsPage;
