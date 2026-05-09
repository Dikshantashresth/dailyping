"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { useAppSelector } from "@/lib/hooks";
import { ShieldAlert, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";

// Components
import BlockerCard from "@/components/blockers/BlockerCard";
import EmptyBlockerState from "@/components/blockers/EmptyBlockerState";

interface BlockerFlag {
  id: string;
  team_id: string;
  keyword: string;
  occurrence_count: number;
  first_seen: string;
  last_seen: string;
  resolved: boolean;
  resolved_at?: string;
  resolved_by?: string;
}

export default function BlockersPage() {
  const params = useParams();
  const teamId = params.teamId as string;
  const { current: currentTeam } = useAppSelector((s) => s.team);
  const isAdmin = currentTeam?.role === "admin";

  const [blockers, setBlockers] = useState<BlockerFlag[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBlockers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.get(`/blockers/${teamId}`);
      if (res.data.success) {
        setBlockers(res.data.blockers || []);
      }
    } catch (err: unknown) {
      const error = err as any;
      if (error?.response?.status === 404) {
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
        fetchBlockers(); // Refresh list
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to resolve blocker");
    }
  };

  const active = blockers.filter((b) => !b.resolved);
  const resolved = blockers.filter((b) => b.resolved);

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-muted-foreground font-medium animate-pulse">
          Scanning for blockers...
        </p>
      </div>
    );
  }

  return (
    <div className="p-10 max-w-5xl mx-auto">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-rose-500" /> Blockers
          </h1>
          <p className="text-muted-foreground text-base mt-2 font-medium">
            Identify and clear hurdles holding your team back.
          </p>
        </div>
      </div>

      <div className="space-y-12">
        {/* Active Blockers */}
        <section>
          {active.length === 0 ? (
            <EmptyBlockerState />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {active.map((b) => (
                <BlockerCard
                  key={b.id}
                  blocker={b}
                  isAdmin={isAdmin}
                  onResolve={handleResolve}
                />
              ))}
            </div>
          )}
        </section>

        {/* Resolved Blockers */}
        {resolved.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-muted-foreground">
                Cleared Hurdles
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {resolved.map((b) => (
                <BlockerCard
                  key={b.id}
                  blocker={b}
                  isAdmin={isAdmin}
                  onResolve={handleResolve}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
