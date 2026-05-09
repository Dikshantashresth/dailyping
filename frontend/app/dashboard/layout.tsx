"use client";

import { useEffect, useState, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { setTeams, setCurrentTeam, clearTeam, type Team } from "@/lib/features/teamSlice";
import { setUser, clearUser } from "@/lib/features/userSlice";
import { api } from "@/lib/api";
import { toast } from "sonner";
import {
  CalendarDays,
  Settings,
  ShieldAlert,
  Clock,
  Users,
} from "lucide-react";

// Components
import CreateTeamModal from "@/components/CreateTeamModal";
import JoinTeamModal from "@/components/JoinTeamModal";
import AppLoadingScreen from "@/components/dashboard/AppLoadingScreen";
import DesktopSidebar from "@/components/dashboard/DesktopSidebar";
import MobileTopBar from "@/components/dashboard/MobileTopBar";
import MobileTabBar from "@/components/dashboard/MobileTabBar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.user);
  const { current: currentTeam, teams } = useAppSelector((s) => s.team);
  const [isLoading, setIsLoading] = useState(true);
  const [isAppReady, setIsAppReady] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  const fetchTeams = useCallback(async () => {
    try {
      const res = await api.get("/teams/getteams");
      if (res.data.success) {
        dispatch(setTeams(res.data.teams));
      }
    } catch {
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, router]);

  const fetchUser = useCallback(async () => {
    try {
      const res = await api.get("/auth/me");
      if (res.data.success) {
        dispatch(setUser({
          id: res.data.user.id,
          email: res.data.user.email,
          name: res.data.user.name
        }));
      }
    } catch (err) {
      console.error("Failed to fetch user profile", err);
    }
  }, [dispatch]);

  useEffect(() => {
    const init = async () => {
      await Promise.all([fetchUser(), fetchTeams()]);
      setIsAppReady(true);
    };
    init();
  }, [fetchUser, fetchTeams]);

  // Hydrate current team from URL on refresh
  useEffect(() => {
    if (isAppReady && pathname.startsWith("/dashboard/team/")) {
      const teamId = pathname.split("/")[3];
      if (teamId && (!currentTeam || currentTeam.id !== teamId)) {
        const team = teams.find(t => t.id === teamId);
        if (team) {
          dispatch(setCurrentTeam(team));
        }
      }
    }
  }, [isAppReady, pathname, teams, currentTeam, dispatch]);


  if (!isAppReady) {
    return <AppLoadingScreen />;
  }


  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      toast.success("Logged out successfully");
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      dispatch(clearUser());
      dispatch(clearTeam());
      router.push("/login");
    }
  };


  const handleSelectTeam = (team: Team) => {
    dispatch(setCurrentTeam(team));
    router.push(`/dashboard/team/${team.id}`);
  };

  const handleBackToHome = () => {
    dispatch(clearTeam());
    router.push("/dashboard");
  };

  const isInsideTeam = pathname.startsWith("/dashboard/team/") && !!currentTeam;
  const isAdmin = currentTeam?.role === "admin";

  const teamNavLinks = isInsideTeam && currentTeam ? [
    { name: "Standups", href: `/dashboard/team/${currentTeam.id}`, icon: CalendarDays },
    { name: "History", href: `/dashboard/team/${currentTeam.id}/history`, icon: Clock },
    { name: "Members", href: `/dashboard/team/${currentTeam.id}/members`, icon: Users },
    { name: "Blockers", href: `/dashboard/team/${currentTeam.id}/blockers`, icon: ShieldAlert },
  ] : [];

  if (isInsideTeam && isAdmin && currentTeam) {
    teamNavLinks.push({ name: "Settings", href: `/dashboard/team/${currentTeam.id}/settings`, icon: Settings });
  }

  const handleCopyInvite = () => {
    if (currentTeam?.invite_id) {
        navigator.clipboard.writeText(currentTeam.invite_id);
        toast.success("Invite link copied!");
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden flex-col md:flex-row">
      <DesktopSidebar 
        pathname={pathname}
        isInsideTeam={isInsideTeam}
        currentTeam={currentTeam}
        teams={teams}
        user={user}
        isLoading={isLoading}
        isAdmin={isAdmin}
        teamNavLinks={teamNavLinks}
        onBackToHome={handleBackToHome}
        onSelectTeam={handleSelectTeam}
        onLogout={handleLogout}
        onCopyInvite={handleCopyInvite}
        setShowCreateModal={setShowCreateModal}
        setShowJoinModal={setShowJoinModal}
      />

      <MobileTopBar onBackToHome={handleBackToHome} />

      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        {children}
      </main>

      <MobileTabBar 
        pathname={pathname}
        isInsideTeam={isInsideTeam}
        currentTeam={currentTeam}
        setShowJoinModal={setShowJoinModal}
      />

      {/* Modals */}
      <CreateTeamModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={fetchTeams}
      />
      <JoinTeamModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        onJoined={fetchTeams}
      />
    </div>
  );
}


