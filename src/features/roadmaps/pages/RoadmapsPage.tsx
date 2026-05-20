import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetRoadmaps, useGetSavedRoadmaps, useToggleSaveRoadmap } from "@/features/roadmaps/hooks/useRoadmap";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import {
  BookOpen, Bookmark, BookmarkCheck,
  ChevronLeft, ChevronRight, Map, Sparkles,
  Calendar, Plus,
} from "lucide-react";
import type { RoadmapListItem } from "@/features/roadmaps/types/roadmap";

/* ── helpers (unchanged) ── */
const GRADIENT_PAIRS = [
  "from-violet-500/20 to-purple-500/10",
  "from-blue-500/20 to-cyan-500/10",
  "from-emerald-500/20 to-teal-500/10",
  "from-amber-500/20 to-orange-500/10",
  "from-rose-500/20 to-pink-500/10",
  "from-indigo-500/20 to-blue-500/10",
];

const ICON_COLORS = [
  "text-violet-500", "text-blue-500", "text-emerald-500",
  "text-amber-500",  "text-rose-500",  "text-indigo-500",
];

const BG_COLORS = [
  "bg-violet-100", "bg-blue-100", "bg-emerald-100",
  "bg-amber-100",  "bg-rose-100",  "bg-indigo-100",
];

const TOP_COLORS = [
  "border-t-violet-400", "border-t-blue-400", "border-t-emerald-400",
  "border-t-amber-400",  "border-t-rose-400",  "border-t-indigo-400",
];

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
}



/* ── card skeleton ── */
const RoadmapSkeleton = () => (
  <div className="bg-white border border-gray-100 rounded-[2rem] p-6 space-y-6 shadow-sm">
    <div className="flex items-start justify-between">
      <Skeleton className="w-14 h-14 rounded-2xl" />
      <Skeleton className="h-6 w-20 rounded-full" />
    </div>
    <div className="space-y-3">
      <Skeleton className="h-6 w-3/4 rounded-lg" />
      <Skeleton className="h-4 w-full rounded-md" />
      <Skeleton className="h-4 w-5/6 rounded-md" />
    </div>
    <div className="flex gap-3 pt-2">
      <Skeleton className="h-12 flex-1 rounded-xl" />
      <Skeleton className="h-12 w-12 rounded-xl" />
    </div>
  </div>
);

/* ── roadmap card ── */
const RoadmapCard: React.FC<{
  roadmap: RoadmapListItem;
  index: number;
  onView: (id: number) => void;
  onToggleSave: (r: RoadmapListItem) => void;
  isSaving: boolean;
}> = ({ roadmap, index, onView, onToggleSave, isSaving }) => {
  const colorIdx = index % GRADIENT_PAIRS.length;

  return (
    <div 
      className={`group bg-white border border-gray-100 rounded-[2rem] overflow-hidden hover:shadow-2xl hover:shadow-blue-50 hover:border-blue-100 transition-all duration-500 cursor-pointer flex flex-col`}
      onClick={() => onView(roadmap.id)}
    >
      <div className="p-6 sm:p-8 flex-1 flex flex-col space-y-5">
        {/* Icon + ID badge row */}
        <div className="flex items-start justify-between">
          <div className={`w-14 h-14 ${BG_COLORS[colorIdx]} rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500`}>
            <Map className={`w-7 h-7 ${ICON_COLORS[colorIdx]}`} />
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="text-[10px] font-black font-mono text-gray-300 tracking-widest uppercase">ID #{String(roadmap.id).padStart(3, "0")}</span>
            {roadmap.isSaved && (
              <span className="inline-flex items-center gap-1.5 text-[10px] font-black px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100 uppercase tracking-widest">
                <BookmarkCheck className="w-3 h-3" /> Saved
              </span>
            )}
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-2 flex-1">
          <h3 className="text-xl font-black text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">
            Skill Path #{roadmap.id}
          </h3>
          <p className="text-sm text-gray-500 font-medium leading-relaxed line-clamp-3">
            A comprehensive, structured learning journey designed to master core competencies and achieve professional excellence.
          </p>
        </div>

        {/* Meta Info */}
        <div className="flex items-center gap-4 py-2 border-t border-gray-50">
          <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-tighter">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(roadmap.createdAt)}
          </div>
          <div className="w-1 h-1 rounded-full bg-gray-200" />
          <div className="text-[10px] font-black text-gray-400 uppercase tracking-tighter flex items-center gap-1">
             <Sparkles className="w-3.5 h-3.5 text-amber-400" /> AI Guided
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2" onClick={(e) => e.stopPropagation()}>
          <Button
            className="flex-1 h-12 rounded-xl font-bold gap-2 bg-gray-900 hover:bg-blue-600 text-white text-xs transition-all active:scale-[0.98] group-hover:bg-blue-600"
            onClick={() => onView(roadmap.id)}
          >
            Explore Map <ChevronRight className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            className={`h-12 w-12 p-0 rounded-xl border-gray-100 transition-all active:scale-[0.98] ${
              roadmap.isSaved ? "bg-blue-50 border-blue-100 text-blue-600" : "bg-white text-gray-400 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-100"
            }`}
            onClick={(e) => { e.stopPropagation(); onToggleSave(roadmap); }}
            disabled={isSaving}
          >
            {roadmap.isSaved
              ? <BookmarkCheck className="w-5 h-5 fill-blue-600" />
              : <Bookmark className="w-5 h-5" />
            }
          </Button>
        </div>
      </div>
    </div>
  );
};

/* ── main page ── */
const RoadmapsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 6;

  const { data: allData,   isLoading: loadingAll   } = useGetRoadmaps({ PageNumber: currentPage, PageSize: PAGE_SIZE });
  const { data: savedData, isLoading: loadingSaved } = useGetSavedRoadmaps({ PageNumber: currentPage, PageSize: PAGE_SIZE });
  const toggleSave = useToggleSaveRoadmap();

  const currentData = activeTab === "all" ? allData : savedData;
  const isLoading   = activeTab === "all" ? loadingAll : loadingSaved;

  const handleTabChange = (t: string) => { setActiveTab(t); setCurrentPage(1); };
  const handleView      = (id: number) => navigate(`/roadmaps/${id}`);
  const handleToggle    = (r: RoadmapListItem) => toggleSave.mutate(r.id);

  const items = currentData?.items ?? [];
  const totalPages = currentData?.totalPages ?? 1;
  const totalCount = (currentData?.totalPages ?? 0) * PAGE_SIZE;

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 lg:p-10">
      <div className="max-w-6xl mx-auto">
        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-12">
          <div className="space-y-3">
             {/* Breadcrumb */}
             <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
               <span>Resources</span>
               <ChevronRight className="w-3 h-3 opacity-50" />
               <span className="text-blue-600">Roadmaps</span>
             </div>
             <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-none">
               Skill <span className="text-blue-600">Architect</span>
             </h1>
             <p className="text-lg text-gray-500 font-medium max-w-lg leading-relaxed">
               AI-engineered learning paths to master your industry benchmarks.
             </p>
          </div>
          <Button
            className="w-full md:w-auto shrink-0 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl h-14 px-8 gap-3 font-bold shadow-xl shadow-blue-200 transition-all active:scale-[0.98]"
            onClick={() => {}}
          >
            <Plus className="w-5 h-5" /> New Custom Path
          </Button>
        </div>

        {/* ── Tabs ── */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
            <TabsList className="bg-white border border-gray-100 p-1.5 h-14 rounded-2xl w-full sm:w-auto flex shadow-sm">
              <TabsTrigger
                value="all"
                className="flex-1 sm:flex-none px-10 rounded-xl font-black text-sm transition-all data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=active]:shadow-lg"
              >
                All Paths
              </TabsTrigger>
              <TabsTrigger
                value="saved"
                className="flex-1 sm:flex-none px-10 rounded-xl font-black text-sm transition-all data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=active]:shadow-lg"
              >
                My Collection
              </TabsTrigger>
            </TabsList>

            <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
              Showing {items.length} of {totalCount || items.length} results
            </div>
          </div>

          <TabsContent value="all" className="mt-0 outline-none">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, i) => <RoadmapSkeleton key={i} />)}
              </div>
            ) : items.length === 0 ? (
              <div className="bg-white border border-gray-100 rounded-[3rem] p-24 text-center shadow-sm">
                <div className="w-24 h-24 bg-gray-50 text-gray-200 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                  <Map className="w-12 h-12" />
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-3">No Paths Available</h3>
                <p className="text-lg text-gray-500 max-w-sm mx-auto leading-relaxed">We're still curating high-impact roadmaps for your profile. Check back shortly.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {items.map((r, i) => (
                  <RoadmapCard
                    key={r.id} roadmap={r} index={i}
                    onView={handleView} onToggleSave={handleToggle}
                    isSaving={toggleSave.isPending}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="saved" className="mt-0 outline-none">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 3 }).map((_, i) => <RoadmapSkeleton key={i} />)}
              </div>
            ) : items.length === 0 ? (
              <div className="bg-white border border-gray-100 rounded-[3rem] p-24 text-center shadow-sm">
                <div className="w-24 h-24 bg-gray-50 text-gray-200 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                  <Bookmark className="w-12 h-12" />
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-3">Empty Collection</h3>
                <p className="text-lg text-gray-500 max-w-sm mx-auto mb-10 leading-relaxed">
                  Start bookmarking roadmaps to build your personalized skill development library.
                </p>
                <Button variant="outline" onClick={() => handleTabChange("all")} className="rounded-2xl h-14 px-10 font-black border-gray-100 text-blue-600 gap-3 hover:bg-blue-50 transition-all shadow-xl shadow-gray-50">
                  <Map className="w-5 h-5" /> Browse All Paths
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {items.map((r, i) => (
                  <RoadmapCard
                    key={r.id} roadmap={r} index={i}
                    onView={handleView} onToggleSave={handleToggle}
                    isSaving={toggleSave.isPending}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* ── Pagination ── */}
        {currentData && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-8 mt-20 mb-12 px-6">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
              Showing {((currentPage - 1) * PAGE_SIZE) + 1} - {Math.min(currentPage * PAGE_SIZE, totalCount)} of {totalCount} Paths
            </p>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(p => p - 1)}
                disabled={!currentData.hasPreviousPage}
                className="w-12 h-12 rounded-2xl border-gray-100 bg-white text-gray-400 hover:text-blue-600 hover:border-blue-100 disabled:opacity-30 transition-all shadow-sm"
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>

              <div className="flex items-center gap-2 px-4">
                {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => {
                  const page = i + 1;
                  const isCurrent = page === currentPage;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`min-w-[48px] h-12 rounded-2xl text-xs font-black transition-all duration-300 ${
                        isCurrent
                          ? "bg-gray-900 text-white shadow-xl shadow-gray-200 scale-110"
                          : "bg-white border border-gray-100 text-gray-500 hover:border-blue-200 hover:text-blue-600"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(p => p + 1)}
                disabled={!currentData.hasNextPage}
                className="w-12 h-12 rounded-2xl border-gray-100 bg-white text-gray-400 hover:text-blue-600 hover:border-blue-100 disabled:opacity-30 transition-all shadow-sm"
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoadmapsPage;
