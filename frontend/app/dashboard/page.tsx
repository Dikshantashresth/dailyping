"use client";

import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { setCurrentTeam, type Team } from "@/lib/features/teamSlice";
import { useRouter } from "next/navigation";

// Components
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import TeamCard from "@/components/dashboard/TeamCard";
import EmptyTeamState from "@/components/dashboard/EmptyTeamState";

// Constants
import { CARD_THEMES } from "./constants";

export default function DashboardHomePage() {
  const { teams } = useAppSelector((s) => s.team);
  const user = useAppSelector((s) => s.user);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleSelectTeam = (team: Team) => {
    dispatch(setCurrentTeam(team));
    router.push(`/dashboard/team/${team.id}`);
  };

  return (
    <div className="p-10 max-w-6xl mx-auto">
      <DashboardHeader name={user.name || "User"} />

      {teams.length === 0 ? (
        <EmptyTeamState />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team, idx) => {
            const theme = CARD_THEMES[idx % CARD_THEMES.length];
            return (
              <TeamCard
                key={team.id}
                team={team}
                theme={theme}
                onSelect={handleSelectTeam}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

