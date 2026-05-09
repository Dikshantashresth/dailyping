"use client";

import Link from "next/link";
import { Home, Clock, ShieldAlert, Users, User } from "lucide-react";
import type { Team } from "@/lib/features/teamSlice";

interface MobileTabBarProps {
  pathname: string;
  isInsideTeam: boolean;
  currentTeam: Team | null;
  setShowJoinModal: (show: boolean) => void;
}

/**
 * Renders the bottom tab navigation for mobile devices.
 */
export default function MobileTabBar({
  pathname,
  isInsideTeam,
  currentTeam,
  setShowJoinModal,
}: MobileTabBarProps) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-border flex items-center justify-around px-2 z-50 pb-safe">
      <Link 
        href="/dashboard"
        className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${pathname === "/dashboard" ? "text-primary" : "text-muted-foreground"}`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] font-bold">Home</span>
      </Link>
      
      {isInsideTeam && currentTeam ? (
        <>
          <Link 
            href={`/dashboard/team/${currentTeam.id}/history`}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${pathname.includes("/history") ? "text-primary" : "text-muted-foreground"}`}
          >
            <Clock className="w-5 h-5" />
            <span className="text-[10px] font-bold">History</span>
          </Link>
          <Link 
            href={`/dashboard/team/${currentTeam.id}/blockers`}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${pathname.includes("/blockers") ? "text-primary" : "text-muted-foreground"}`}
          >
            <ShieldAlert className="w-5 h-5" />
            <span className="text-[10px] font-bold">Blockers</span>
          </Link>
        </>
      ) : (
        <button 
          onClick={() => setShowJoinModal(true)}
          className="flex flex-col items-center gap-1 p-2 text-muted-foreground"
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px] font-bold">Teams</span>
        </button>
      )}

      <Link 
        href="/dashboard/profile"
        className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${pathname === "/dashboard/profile" ? "text-primary" : "text-muted-foreground"}`}
      >
        <User className="w-5 h-5" />
        <span className="text-[10px] font-bold">Profile</span>
      </Link>
    </nav>
  );
}
