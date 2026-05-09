"use client";

import { CalendarDays } from "lucide-react";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useCallback, useEffect, useState } from "react";
import { setCurrentTeam } from "@/lib/features/teamSlice";
import { api } from "@/lib/api";
import { setTodayStandups } from "@/lib/features/standupsSlice";
import { format } from "date-fns";

// Components
import SubmitPingModal from "@/components/SubmitPingModal";

import StandupCard from "@/components/team/StandupCard";
import FeedHeader from "@/components/team/FeedHeader";
import StatusBanner from "@/components/team/StatusBanner";
import MissingMembersGrid from "@/components/team/MissingMembersGrid";
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
  const [missingUsers, setMissingUsers] = useState<MissingMember[]|[]>([]);

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
    <div className="p-8 max-w mx-auto">
      <FeedHeader
        todayDate={todayDate}
        pingCount={standups.length}
        totalMembers={currentTeam?.members_count || 0}
        hasSubmittedToday={hasSubmittedToday}
        isLoading={isLoading}
        windowOpen={windowOpen}
        onOpenSubmit={() => setIsSubmitModalOpen(true)}
      />

      {/* Conditional Status Banners */}
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

      {/* Feed Section */}
      <div className="mt-8">
        <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-8 px-2">
          Timeline
        </h3>
        
        <div className="space-y-0 ml-4 border-l border-border/50">
          {isLoading ? (
            [1, 2, 3].map((i) => (
              <div
                key={i}
                className="relative pl-8 pb-10 border-l border-border/50 last:pb-0"
              >
                 <div className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full bg-muted animate-pulse" />
                 <div className="h-32 bg-muted/20 animate-pulse rounded-xl" />
              </div>
            ))
          ) : standups.length === 0 ? (
            <div className="text-center py-20 bg-muted/5 rounded-3xl border border-dashed border-border/60">
              <div className="w-12 h-12 bg-muted/20 rounded-xl flex items-center justify-center mx-auto mb-4 text-muted-foreground/50">
                <CalendarDays className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">
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

        {/* Missing Pings Section (Admins only) */}
        <MissingMembersGrid members={missingUsers} isAdmin={isAdmin} />
     
  
      {/* Modal Integration */}
      <SubmitPingModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onSubmitted={fetchStandups}
        teamId={teamId}
      />
    </div>
  );
}

