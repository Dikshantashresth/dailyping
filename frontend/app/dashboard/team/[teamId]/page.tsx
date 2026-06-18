"use client";

import { CalendarDays, Flame, AlertTriangle } from "lucide-react";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useCallback, useEffect, useState } from "react";
import { setCurrentTeam } from "@/lib/features/teamSlice";
import { api } from "@/lib/api";
import { setTodayStandups } from "@/lib/features/standupsSlice";
import { format } from "date-fns";

import SubmitPingModal from "@/components/SubmitPingModal";
import StandupCard from "@/components/team/StandupCard";
import FeedHeader from "@/components/team/FeedHeader";
import StatusBanner from "@/components/team/StatusBanner";

interface MissingMember {
  user_id: string;
  name: string;
  current_streak: number;
}

export default function TeamStandupsPage() {
  const params = useParams();
  const teamId = params.teamId as string;
  const dispatch = useAppDispatch();
  const { current: currentTeam, teams } = useAppSelector((s) => s.team);
  const user = useAppSelector((s) => s.user);
  const standups = useAppSelector((s) => s.standups.today);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [missingUsers, setMissingUsers] = useState<MissingMember[]>([]);

  useEffect(() => {
    if (teams.length > 0) {
      if (!currentTeam || currentTeam.id !== teamId) {
        const found = teams.find((t) => t.id === teamId);
        if (found) dispatch(setCurrentTeam(found));
      }
    }
  }, [currentTeam, teams, teamId, dispatch]);

  const fetchStandups = useCallback(async () => {
    setIsLoading(true);
    try {
      const date = new Date().toISOString().split("T")[0];
      const res = await api.get(`/standups/today/${teamId}?date=${date}`);
      dispatch(setTodayStandups(res.data.standups || []));
    } catch {
      dispatch(setTodayStandups([]));
    } finally {
      setIsLoading(false);
    }
  }, [teamId, dispatch]);

  const fetchMissing = useCallback(async () => {
    if (currentTeam?.role !== "admin") return;
    try {
      const date = new Date().toISOString().split("T")[0];
      const res = await api.get(`/standups/missing/${teamId}?date=${date}`);
      if (res.data.success) {
        setMissingUsers(res.data.missing || []);
      }
    } catch {
      setMissingUsers([]);
    }
  }, [teamId, currentTeam?.role]);

  useEffect(() => {
    fetchStandups();
    fetchMissing();
  }, [fetchStandups, fetchMissing]);

  const hasSubmittedToday = standups.some((s) => s.user_id === user.id);
  const todayDate = format(new Date(), "EEEE, MMMM do");

  const isWindowOpen = () => {
    if (!currentTeam?.submission_open || !currentTeam?.submission_close)
      return true;
    const now = new Date();
    const currentTime = format(now, "HH:mm");
    return (
      currentTime >= currentTeam.submission_open &&
      currentTime <= currentTeam.submission_close
    );
  };

  const windowOpen = isWindowOpen();
  const isAdmin = currentTeam?.role === "admin";

  return (
    <div className="px-4 py-5 max-w-7xl mx-auto">
      <FeedHeader
        todayDate={todayDate}
        pingCount={standups.length}
        totalMembers={currentTeam?.members_count || 0}
        hasSubmittedToday={hasSubmittedToday}
        isLoading={isLoading}
        windowOpen={windowOpen}
        onOpenSubmit={() => setIsSubmitModalOpen(true)}
      />

      {!hasSubmittedToday && !isLoading && (
        windowOpen ? (
          <StatusBanner
            type="pending"
            streak={currentTeam?.current_streak}
            onAction={() => setIsSubmitModalOpen(true)}
          />
        ) : (
          <StatusBanner
            type="closed"
            openTime={currentTeam?.submission_open}
            closeTime={currentTeam?.submission_close}
          />
        )
      )}

      {/* Main Layout */}
      <div className="flex gap-6 items-start mt-6">
        {/* Feed - Main Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Timeline
          </h3>

          <div className="space-y-0 ml-3 border-l border-border/50">
            {isLoading ? (
              [1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="relative pl-7 pb-8 border-l border-border/50 last:pb-0"
                >
                   <div className="absolute left-0 top-0 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-muted animate-pulse" />
                  <div className="h-20 bg-muted/20 animate-pulse rounded-xl" />
                </div>
              ))
            ) : standups.length === 0 ? (
              <div className="text-center py-12 bg-muted/5 rounded-2xl border border-dashed border-border/60">
                <div className="w-8 h-8 bg-muted/20 rounded-lg flex items-center justify-center mx-auto mb-3 text-muted-foreground/50">
                  <CalendarDays className="w-5 h-5" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Be the first one to update
                </p>
              </div>
            ) : (
              standups.map((standup) => (
                <StandupCard key={standup.id} standup={standup} />
              ))
            )}
          </div>
        </div>

        {/* Missing Pings Sidebar */}
        {isAdmin && missingUsers.length > 0 && (
          <div className="w-64 shrink-0 hidden lg:block">
            <div className="sticky top-6">
              <div className="border-l-2 border-rose-500/40 pl-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                    <h3 className="text-[10px] font-bold text-foreground uppercase tracking-wide">
                      Missing Pings
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-full">
                    {missingUsers.length}
                  </span>
                </div>

                {/* Member List */}
                <div className="space-y-2.5">
                  {missingUsers.map((m) => (
                    <div
                      key={m.user_id}
                      className="flex items-center gap-2.5 py-1.5"
                    >
                      <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[9px] font-bold text-muted-foreground shrink-0">
                        {m.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[12px] font-medium text-foreground truncate">
                          {m.name}
                        </p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Flame className="w-2.5 h-2.5 text-amber-500" />
                          <span className="text-[9px] text-muted-foreground font-medium">
                            {m.current_streak}d streak
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <SubmitPingModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onSubmitted={fetchStandups}
        teamId={teamId}
      />
    </div>
  );
}
