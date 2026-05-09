"use client";

import Link from "next/link";
import { Home, User, Link2, Plus, ChevronRight, LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import type { Team } from "@/lib/features/teamSlice";

interface DesktopSidebarProps {
  pathname: string;
  isInsideTeam: boolean;
  currentTeam: Team | null;
  teams: Team[];
  user: { name: string | null };
  isLoading: boolean;
  isAdmin: boolean;
  teamNavLinks: any[];
  onBackToHome: () => void;
  onSelectTeam: (team: Team) => void;
  onLogout: () => void;
  onCopyInvite: () => void;
  setShowCreateModal: (show: boolean) => void;
  setShowJoinModal: (show: boolean) => void;
}

/**
 * Renders the persistent sidebar for desktop view.
 */
export default function DesktopSidebar({
  pathname,
  isInsideTeam,
  currentTeam,
  teams,
  user,
  isLoading,
  isAdmin,
  teamNavLinks,
  onBackToHome,
  onSelectTeam,
  onLogout,
  onCopyInvite,
  setShowCreateModal,
  setShowJoinModal,
}: DesktopSidebarProps) {
  return (
    <aside className="hidden md:flex w-64 bg-sidebar border-r border-border flex-col shrink-0">
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-border bg-card backdrop-blur-sm">
        <button onClick={onBackToHome} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-mono font-bold text-xs shadow-sm shadow-primary/20">
            DP
          </div>
          <span className="font-bold text-lg tracking-tight text-foreground">Daily Ping</span>
        </button>
        <ThemeToggle />
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        {isInsideTeam && currentTeam ? (
          <>
            <button
              onClick={onBackToHome}
              className="flex items-center gap-2.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-sidebar-hover rounded-lg transition-colors w-full mb-2"
            >
              <Home className="w-4 h-4 text-color-blue" />
              Back to home
            </button>

            <div className="px-3 py-3 mb-2 bg-card rounded-xl border border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                  {currentTeam.name.substring(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold truncate text-foreground">{currentTeam.name}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
                    {currentTeam.role}
                  </p>
                </div>
              </div>
            </div>

            <div className="h-px bg-border/60 mx-3 my-3" />

            {teamNavLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm ${
                    isActive
                      ? "bg-card shadow-sm border border-border text-foreground font-semibold"
                      : "text-muted-foreground hover:bg-sidebar-hover hover:text-foreground"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-primary" : ""}`} />
                  {link.name}
                </Link>
              );
            })}

            {isAdmin && currentTeam.invite_id && (
              <>
                <div className="h-px bg-border/60 mx-3 my-4" />
                <div className="px-3">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-2.5 px-1">Invite link</p>
                  <button
                    onClick={onCopyInvite}
                    className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground bg-muted/60 hover:bg-muted border border-border/40 px-3 py-2 rounded-lg transition-all w-full group"
                  >
                    <Link2 className="w-3.5 h-3.5 shrink-0 group-hover:text-primary transition-colors" />
                    <span className="truncate font-mono">{currentTeam.invite_id}</span>
                  </button>
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <Link
              href="/dashboard"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm mb-1 ${
                pathname === "/dashboard"
                  ? "bg-card shadow-sm border border-border text-foreground font-semibold"
                  : "text-muted-foreground hover:bg-sidebar-hover hover:text-foreground"
              }`}
            >
              <Home className={`w-4 h-4 ${pathname === "/dashboard" ? "text-color-blue" : ""}`} />
              Home
            </Link>

            <Link
              href="/dashboard/profile"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm mb-2 ${
                pathname === "/dashboard/profile"
                  ? "bg-card shadow-sm border border-border text-foreground font-semibold"
                  : "text-muted-foreground hover:bg-sidebar-hover hover:text-foreground"
              }`}
            >
              <User className={`w-4 h-4 ${pathname === "/dashboard/profile" ? "text-color-purple" : ""}`} />
              Profile
            </Link>

            <div className="h-px bg-border/60 mx-3 my-4" />

            <div className="px-3 mb-3 flex items-center justify-between">
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold px-1">Teams</p>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setShowJoinModal(true)}
                  className="p-1.5 text-muted-foreground hover:text-color-green hover:bg-card rounded-md transition-all shadow-sm border border-transparent hover:border-border"
                  title="Join team"
                >
                  <Link2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="p-1.5 text-muted-foreground hover:text-primary hover:bg-card rounded-md transition-all shadow-sm border border-transparent hover:border-border/50"
                  title="Create team"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-2 px-1">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-9 bg-muted/60 animate-pulse rounded-lg" />
                ))}
              </div>
            ) : teams.length === 0 ? (
              <p className="text-xs text-muted-foreground px-4 py-3 bg-muted/30 rounded-xl border border-border/40 mx-1">No teams yet</p>
            ) : (
              <div className="space-y-1">
                {teams.map((team, idx) => {
                  const teamColors = [
                    "text-color-blue bg-color-blue/10",
                    "text-color-green bg-color-green/10",
                    "text-color-purple bg-color-purple/10",
                    "text-color-rose bg-color-rose/10",
                    "text-color-amber bg-color-amber/10",
                  ];
                  const colorClass = teamColors[idx % teamColors.length];
                  return (
                    <button
                      key={team.id}
                      onClick={() => onSelectTeam(team)}
                      className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-card hover:text-foreground hover:shadow-sm border border-transparent hover:border-border transition-all group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 ${colorClass}`}>
                          {team.name.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="truncate">{team.name}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-0.5 shrink-0" />
                    </button>
                  );
                })}
              </div>
            )}
          </>
        )}
      </nav>

      {/* User footer */}
      <div className="border-t border-border p-3 bg-card/30">
        <div className="flex items-center justify-between px-3 py-2 bg-card/60 rounded-xl border border-border/50 shadow-sm">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-full bg-color-purple text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-sm">
              {user.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <span className="text-sm font-semibold truncate text-foreground">{user.name || "User"}</span>
          </div>
          <button
            onClick={onLogout}
            className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
