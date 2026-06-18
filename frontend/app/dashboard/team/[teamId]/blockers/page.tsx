"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams } from "next/navigation";
import { useAppSelector } from "@/lib/hooks";
import { ShieldAlert, CheckCircle2, Loader2, Search, Clock } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";

import BlockerCard from "@/components/blockers/BlockerCard";
import EmptyBlockerState from "@/components/blockers/EmptyBlockerState";

interface BlockerFlag {
  id: string;
  team_id: string;
  user_id: string;
  keyword: string;
  content?: string;
  tags?: string[];
  occurrence_count: number;
  first_seen: string;
  last_seen: string;
  resolved: boolean;
  resolved_at?: string;
  resolved_by?: string;
  name?: string;
  avatar_url?: string;
}

type FilterTab = "active" | "resolved" | "all";

export default function BlockersPage() {
  const params = useParams();
  const teamId = params.teamId as string;
  const { current: currentTeam } = useAppSelector((s) => s.team);
  const isAdmin = currentTeam?.role === "admin";

  const [blockers, setBlockers] = useState<BlockerFlag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<FilterTab>("active");
  const [search, setSearch] = useState("");

  const fetchBlockers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.get(`/blockers/${teamId}`);
      if (res.data.success) {
        setBlockers(res.data.blockers || []);
      }
    } catch (err: any) {
      if (err?.response?.status === 404) {
        setBlockers([]);
      } else {
        toast.error("Failed to load blockers");
      }
    } finally {
      setIsLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    fetchBlockers();
  }, [fetchBlockers]);

  const handleResolve = async (blockerId: string) => {
    try {
      const res = await api.patch(`/blockers/resolve/${teamId}/${blockerId}`);
      if (res.data.success) {
        toast.success("Blocker marked as resolved");
        fetchBlockers();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to resolve blocker");
    }
  };

  const filtered = useMemo(() => {
    let result = blockers;

    if (activeTab === "active") {
      result = result.filter((b) => !b.resolved);
    } else if (activeTab === "resolved") {
      result = result.filter((b) => b.resolved);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (b) =>
          b.keyword.toLowerCase().includes(q) ||
          b.content?.toLowerCase().includes(q) ||
          b.name?.toLowerCase().includes(q) ||
          b.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    return result;
  }, [blockers, activeTab, search]);

  const activeBlockers = blockers.filter((b) => !b.resolved);
  const resolvedBlockers = blockers
    .filter((b) => b.resolved)
    .sort((a, b) => {
      if (!a.resolved_at || !b.resolved_at) return 0;
      return new Date(b.resolved_at).getTime() - new Date(a.resolved_at).getTime();
    });

  const sidebarResolved = resolvedBlockers.slice(0, 5);

  const tabCounts = useMemo(
    () => ({
      active: activeBlockers.length,
      resolved: resolvedBlockers.length,
      all: blockers.length,
    }),
    [activeBlockers.length, resolvedBlockers.length, blockers.length]
  );

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
        <p className="text-[13px] text-muted-foreground animate-pulse">
          Scanning for blockers...
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 py-5 max-w-full mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-2">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Blockers</span>
        </div>
        <h1 className="text-xl font-semibold text-foreground font-[family-name:var(--font-outfit)]">
          Blockers
        </h1>
        <p className="text-[13px] text-muted-foreground mt-1">
          Identify and clear hurdles holding your team back.
        </p>
      </div>

      {/* Filter Tabs + Search */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center bg-muted/50 rounded-lg p-0.5">
          {(["active", "resolved", "all"] as FilterTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-all ${
                activeTab === tab
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "active" && "Active"}
              {tab === "resolved" && "Resolved"}
              {tab === "all" && "All"}
              <span className="ml-1.5 text-[10px] text-muted-foreground">
                {tabCounts[tab]}
              </span>
            </button>
          ))}
        </div>

        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search blockers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-8 pl-9 pr-3 bg-muted/30 border border-border rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex gap-6 items-start">
        <div className="flex-1 min-w-0">
          {filtered.length === 0 ? (
            <EmptyBlockerState
              variant={activeTab === "active" ? "active" : activeTab === "resolved" ? "resolved" : "all"}
            />
          ) : (
            <div className="space-y-3">
              {filtered.map((b) => (
                <BlockerCard
                  key={b.id}
                  blocker={b}
                  isAdmin={isAdmin}
                  onResolve={handleResolve}
                />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar - Recent Resolved (only on Active tab) */}
        {activeTab === "active" && sidebarResolved.length > 0 && (
          <div className="w-56 shrink-0 hidden lg:block">
            <div className="sticky top-6">
              <div className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[13px] font-semibold text-foreground flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                    Cleared
                  </h3>
                  <span className="text-[10px] text-muted-foreground">
                    {resolvedBlockers.length} total
                  </span>
                </div>

                <div className="space-y-2.5">
                  {sidebarResolved.map((b) => (
                    <div
                      key={b.id}
                      className="p-2.5 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => setActiveTab("resolved")}
                    >
                      <p className="text-[12px] font-medium text-foreground truncate mb-0.5">
                        {b.keyword}
                      </p>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-2.5 h-2.5 text-muted-foreground" />
                        <p className="text-[10px] text-muted-foreground">
                          {b.resolved_at
                            ? new Date(b.resolved_at).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })
                            : ""}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {resolvedBlockers.length > 5 && (
                  <button
                    onClick={() => setActiveTab("resolved")}
                    className="w-full mt-3 py-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors text-center"
                  >
                    View all {resolvedBlockers.length} resolved
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
