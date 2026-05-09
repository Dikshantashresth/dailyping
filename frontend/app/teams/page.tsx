"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAppDispatch } from "@/lib/hooks";
import { setTeams, Team } from "@/lib/features/teamSlice";
import { Users, Plus, ArrowRight } from "lucide-react";
import Link from "next/link";
import { setUser } from "@/lib/features/userSlice";


export default function TeamsPage() {
  const [teams, setTeamsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await api.get('/teams/getteams');
        if (res.data.success) {
          setTeamsList(res.data.teams || []);
          // Hydrate basic user info so we have it
          dispatch(setUser({ id: "hydrated-id", email: "user@example.com" }));
        }
      } catch (error) {
        console.error("Failed to fetch teams", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTeams();
  }, [dispatch]);

  const handleSelectTeam = (teamData: Team) => {
    dispatch(setTeams([teamData]));
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-24 px-6 bg-background text-foreground">
      <div className="w-full max-w-3xl">
        <div className="mb-12">
          <h1 className="text-3xl font-semibold tracking-tight">Your Teams</h1>
          <p className="text-muted-foreground mt-2">
            Select a team to view its dashboard, or create a new one.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-muted/30 animate-pulse rounded-xl border border-border" />
            ))}
          </div>
        ) : teams.length === 0 ? (
          <div className="text-center py-20 bg-muted/10 border border-border rounded-xl border-dashed">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-medium mb-2">You haven't joined any teams</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Get started by creating a new team for your workspace or join an existing one using an invite link.
            </p>
            <Link 
              href="/onboarding"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(59,130,246,0.2)]"
            >
              <Plus className="w-5 h-5" /> Let's Go
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teams.map((t) => (
              <button
                key={t.id}
                onClick={() => handleSelectTeam(t)}
                className="flex items-center justify-between p-6 bg-card border border-border rounded-xl hover:border-primary hover:bg-muted/20 transition-all text-left group"
              >
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-primary/10 text-primary rounded-md flex items-center justify-center font-mono font-bold text-lg">
                      {t.name.substring(0, 2).toUpperCase()}
                    </div>
                    <h3 className="font-medium text-lg">{t.name}</h3>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-3">
                    <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {t.role.toUpperCase()}</span>
                    <span>•</span>
                    <span>{t.timezone}</span>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors transform group-hover:translate-x-1" />
              </button>
            ))}
            
            <Link
              href="/onboarding"
              className="flex flex-col items-center justify-center p-6 border border-border border-dashed rounded-xl hover:border-primary hover:bg-muted/10 transition-all text-muted-foreground hover:text-foreground h-full min-h-[120px]"
            >
              <Plus className="w-6 h-6 mb-2" />
              <span className="font-medium">Create or join another team</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
