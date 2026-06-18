"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { format, subDays, startOfDay } from "date-fns";
import {
  Search,
  Calendar,
  Users,
  Filter,
  RefreshCcw,
  ChevronLeft,
  ChevronRight,
  History as HistoryIcon,
  Loader2,
} from "lucide-react";
import { type Standup } from "@/lib/features/standupsSlice";
import HistoryCard from "@/components/team/HistoryCard";

interface Member {
  id: string;
  user_id: string;
  name: string;
  avatar_url?: string;
}

interface BlockerFlag {
  id: string;
  team_id: string;
  user_id: string;
  keyword: string;
  content?: string;
  occurrence_count: number;
  last_seen: string;
  resolved: boolean;
  name?: string;
  avatar_url?: string;
}

export default function TeamHistoryPage() {
  const params = useParams();
  const teamId = params.teamId as string;

  const [standups, setStandups] = useState<Standup[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [activeBlockers, setActiveBlockers] = useState<BlockerFlag[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [userId, setUserId] = useState("");
  const [status, setStatus] = useState("all");
  const [dateRange, setDateRange] = useState("all");

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 6;

  const fetchMembers = useCallback(async () => {
    try {
      const res = await api.get(`/teams/${teamId}/members`);
      if (res.data.success) {
        setMembers(res.data.members || []);
      }
    } catch {
      console.error("Failed to fetch members");
    }
  }, [teamId]);

  const fetchActiveBlockers = useCallback(async () => {
    try {
      const res = await api.get(`/blockers/${teamId}`);
      if (res.data.success) {
        const blockers = res.data.blockers || [];
        setActiveBlockers(blockers.filter((b: BlockerFlag) => !b.resolved).slice(0, 5));
      }
    } catch {
      setActiveBlockers([]);
    }
  }, [teamId]);

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    try {
      let startDate = "";
      if (dateRange !== "all") {
        startDate = format(subDays(startOfDay(new Date()), parseInt(dateRange)), "yyyy-MM-dd");
      }

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search,
        userId,
        hasBlocker: status === "blocked" ? "true" : "",
        startDate,
      });

      const res = await api.get(`/standups/history/${teamId}?${queryParams.toString()}`);
      if (res.data.success) {
        setStandups(res.data.standups || []);
        setTotal(res.data.total || 0);
      }
    } catch {
      setStandups([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  }, [teamId, page, search, userId, status, dateRange]);

  useEffect(() => {
    fetchMembers();
    fetchActiveBlockers();
  }, [fetchMembers, fetchActiveBlockers]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="px-4 py-5 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-2">
          <span>History</span>
        </div>
        <h1 className="text-xl font-semibold text-foreground font-[family-name:var(--font-outfit)]">
          Standup History
        </h1>
        <p className="text-[13px] text-muted-foreground mt-1">
          Browse and analyze your team&apos;s past contributions and progress trends.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border p-3 rounded-xl mb-5 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search updates..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-3 h-8 bg-muted/30 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-[13px]"
          />
        </div>

        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          <select
            value={dateRange}
            onChange={(e) => {
              setDateRange(e.target.value);
              setPage(1);
            }}
            className="h-8 pl-9 pr-7 bg-muted/30 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-[13px] appearance-none cursor-pointer"
          >
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
            <option value="all">All Time</option>
          </select>
        </div>

        <div className="relative">
          <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          <select
            value={userId}
            onChange={(e) => {
              setUserId(e.target.value);
              setPage(1);
            }}
            className="h-8 pl-9 pr-7 bg-muted/30 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-[13px] appearance-none cursor-pointer min-w-[140px]"
          >
            <option value="">All Members</option>
            {members.map((m) => (
              <option key={m.user_id} value={m.user_id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="h-8 pl-9 pr-7 bg-muted/30 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-[13px] appearance-none cursor-pointer"
          >
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>

        <button
          onClick={fetchHistory}
          className="h-8 px-3 bg-foreground text-background rounded-lg text-[13px] font-medium hover:opacity-90 transition-opacity inline-flex items-center gap-1.5"
        >
          <RefreshCcw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Content */}
      <div className="flex gap-6 items-start">
        <div className="flex-1 min-w-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
              <p className="text-[13px] text-muted-foreground animate-pulse">Fetching history...</p>
            </div>
          ) : standups.length === 0 ? (
            <div className="text-center py-16 bg-card border border-dashed border-border rounded-xl">
              <div className="w-12 h-12 bg-muted/50 rounded-xl flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                <HistoryIcon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                No results found
              </h3>
              <p className="text-[13px] text-muted-foreground mt-1">
                Try adjusting your filters to find what you&apos;re looking for.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {standups.map((s) => (
                  <HistoryCard key={s.id} standup={s} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-1.5">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="w-8 h-8 flex items-center justify-center bg-card border border-border rounded-lg disabled:opacity-30 transition-all hover:bg-muted"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-1">
                    {[...Array(totalPages)]
                      .map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setPage(i + 1)}
                          className={`w-8 h-8 rounded-lg text-[12px] font-medium transition-all ${
                            page === i + 1
                              ? "bg-foreground text-background"
                              : "bg-card border border-border hover:bg-muted"
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))
                      .slice(Math.max(0, page - 3), Math.min(totalPages, page + 2))}
                  </div>

                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="w-8 h-8 flex items-center justify-center bg-card border border-border rounded-lg disabled:opacity-30 transition-all hover:bg-muted"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Active Blockers Sidebar */}
        {activeBlockers.length > 0 && (
          <div className="w-56 shrink-0 hidden lg:block">
            <div className="sticky top-6">
              <div className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[13px] font-semibold text-foreground">Active Blockers</h3>
                  <span className="w-5 h-5 rounded-md bg-danger text-danger-foreground text-[10px] font-semibold flex items-center justify-center">
                    {activeBlockers.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {activeBlockers.map((b) => (
                    <div key={b.id} className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-md bg-muted flex items-center justify-center text-[10px] font-semibold text-muted-foreground overflow-hidden shrink-0">
                        {b.avatar_url ? (
                          <img src={b.avatar_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          (b.name || "U").charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[12px] font-medium text-foreground truncate">{b.name || "Unknown"}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{b.keyword}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-3 pt-3 border-t border-border/50 text-center">
                  <a
                    href={`/dashboard/team/${teamId}/blockers`}
                    className="text-[10px] font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    View all blockers
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
