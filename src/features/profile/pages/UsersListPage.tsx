import { useState, useMemo, useEffect } from "react";
import { useUsersList, useMe } from "@/features/profile/hooks/userHooks";
import { UserCard } from "@/shared/components/UserCard";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Search, Loader2, ChevronLeft, ChevronRight, Users, Sparkles, FilterX } from "lucide-react";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { toast } from "sonner";
import { Skeleton } from "@/shared/components/ui/skeleton";

const USERS_PER_PAGE = 12;

export default function UsersListPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [selectedSkill, setSelectedSkill] = useState<string>("all");
  const [educationFilter, setEducationFilter] = useState("");
  const debouncedEducation = useDebounce(educationFilter, 500);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: currentUser } = useMe();

  const apiFilters = useMemo(() => {
    const filters: Record<string, any> = {};
    if (debouncedSearch) filters.Name = debouncedSearch;
    if (selectedSkill && selectedSkill !== "all") filters.Skills = [selectedSkill];
    return filters;
  }, [debouncedSearch, selectedSkill]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, selectedSkill, debouncedEducation]);

  const { data: users, isLoading, error } = useUsersList(apiFilters);

  const availableSkills = useMemo(() => {
    if (!users || !Array.isArray(users)) return [];
    const skillSet = new Set<string>();
    users.forEach((user) => {
      user.skills?.forEach((skill: { name?: string } | string) => {
        const skillName = typeof skill === "string" ? skill : skill.name;
        if (skillName) skillSet.add(skillName);
      });
    });
    return Array.from(skillSet).sort();
  }, [users]);

  const filteredAndSortedUsers = useMemo(() => {
    if (!users || !Array.isArray(users)) return [];
    let filtered = [...users];
    if (currentUser?.id) filtered = filtered.filter((user) => user.id !== currentUser.id);
    if (debouncedEducation) {
      const educationLower = debouncedEducation.toLowerCase();
      filtered = filtered.filter((user) => {
        return user.educations?.some(
          (edu: { institution?: string; degree?: string; fieldOfStudy?: string }) =>
            edu.institution?.toLowerCase().includes(educationLower) ||
            edu.degree?.toLowerCase().includes(educationLower) ||
            edu.fieldOfStudy?.toLowerCase().includes(educationLower)
        );
      });
    }
    filtered.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
    return filtered;
  }, [users, debouncedEducation, currentUser?.id]);

  const totalPages = Math.ceil(filteredAndSortedUsers.length / USERS_PER_PAGE);
  const startIndex = (currentPage - 1) * USERS_PER_PAGE;
  const endIndex = startIndex + USERS_PER_PAGE;
  const paginatedUsers = filteredAndSortedUsers.slice(startIndex, endIndex);

  if (error) {
    toast.error("Failed to load users. Please try again.");
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* ── Hero Section ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-12 md:py-20">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest mb-6">
              <Users className="w-3 h-3" />
              <span>Community Network</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight leading-none mb-6">
              Connect with <span className="text-blue-600">Top Talent</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-500 font-medium leading-relaxed max-w-2xl">
              Discover and collaborate with skilled professionals across the global Career Path network. Build your dream team today.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-10">
        {/* ── Search & Filter Bar ── */}
        <div className="bg-white border border-gray-100 rounded-[2.5rem] p-4 md:p-6 shadow-xl shadow-gray-200/50 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative group lg:col-span-1">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
              <Input
                placeholder="Search by name..."
                className="h-14 pl-12 rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-blue-100 transition-all text-sm font-medium"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <Select value={selectedSkill} onValueChange={setSelectedSkill}>
              <SelectTrigger className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white transition-all text-sm font-medium px-6">
                <SelectValue placeholder="All Skills" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-gray-100 shadow-xl p-2">
                <SelectItem value="all" className="rounded-xl font-medium">All Skills</SelectItem>
                {availableSkills.map((skill) => (
                  <SelectItem key={skill} value={skill} className="rounded-xl font-medium">
                    {skill}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="relative group lg:col-span-2">
              <Sparkles className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
              <Input
                placeholder="Education (Institution, Degree)..."
                className="h-14 pl-12 rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white transition-all text-sm font-medium"
                value={educationFilter}
                onChange={(e) => setEducationFilter(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* ── Content Grid ── */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-[380px] rounded-[2.5rem]" />
            ))}
          </div>
        ) : filteredAndSortedUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 px-4 text-center bg-white border border-gray-100 rounded-[3rem] shadow-sm">
            <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mb-8">
              <FilterX className="w-12 h-12 text-gray-200" />
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">No Talent Found</h3>
            <p className="text-lg text-gray-400 max-w-md font-medium leading-relaxed">
              We couldn't find any professionals matching your current filters. Try broadening your search criteria.
            </p>
            <Button 
              variant="outline" 
              onClick={() => { setSearch(""); setSelectedSkill("all"); setEducationFilter(""); }}
              className="mt-10 h-14 px-10 rounded-2xl border-gray-200 font-black text-xs uppercase tracking-widest hover:bg-gray-50 active:scale-95 transition-all"
            >
              Reset All Filters
            </Button>
          </div>
        ) : (
          <div className="space-y-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedUsers.map((user) => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>

            {/* ── Pagination ── */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-white border border-gray-100 p-4 md:p-6 rounded-[2rem] shadow-sm">
                <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
                  Showing <span className="text-gray-900">{startIndex + 1}-{Math.min(endIndex, filteredAndSortedUsers.length)}</span> of <span className="text-gray-900">{filteredAndSortedUsers.length}</span> talent
                </p>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="h-12 w-12 rounded-xl border-gray-100 hover:bg-gray-50 disabled:opacity-30 transition-all"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  
                  <div className="flex items-center gap-1.5 px-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "ghost"}
                            onClick={() => setCurrentPage(page)}
                            className={`
                              h-12 w-12 rounded-xl text-xs font-black transition-all
                              ${currentPage === page ? "bg-blue-600 text-white shadow-lg shadow-blue-100 scale-110" : "text-gray-400 hover:text-gray-900 hover:bg-gray-50"}
                            `}
                          >
                            {page}
                          </Button>
                        );
                      } else if (page === currentPage - 2 || page === currentPage + 2) {
                        return <span key={page} className="text-gray-300 font-black">···</span>;
                      }
                      return null;
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="h-12 w-12 rounded-xl border-gray-100 hover:bg-gray-50 disabled:opacity-30 transition-all"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

