"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

import Link from "next/link";
import { useAppSelector } from "@/lib/hooks";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Settings, Globe, Clock, Shield, Link2, Save } from "lucide-react";
import { Alert } from "@/components/ui/Alert";

export default function SettingsPage() {
  const params = useParams();
  const teamId = params.teamId as string;
  const router = useRouter();

  const { current: currentTeam } = useAppSelector((s) => s.team);
  const isAdmin = currentTeam?.role === "admin";

  const [teamName, setTeamName] = useState(currentTeam?.name || "");
  const [timeZone, setTimeZone] = useState(
    currentTeam?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
  );
  const [openTime, setOpenTime] = useState(
    currentTeam?.submission_open || "09:00",
  );
  const [closeTime, setCloseTime] = useState(
    currentTeam?.submission_close || "17:00",
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (currentTeam) {
      setTeamName(currentTeam.name);
      setTimeZone(
        currentTeam.timezone ||
          Intl.DateTimeFormat().resolvedOptions().timeZone,
      );
      setOpenTime(currentTeam.submission_open || "09:00");
      setCloseTime(currentTeam.submission_close || "17:00");
    }
  }, [currentTeam]);

  if (!isAdmin) {
    return (
      <div className="px-4 py-5 max-w-3xl mx-auto">
        <Alert
          variant="error"
          title="Access Denied"
          icon={<Shield className="w-4 h-4" />}
        >
          Only team admins can access these settings.
        </Alert>
      </div>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      name: teamName,
      timeZone,
      open_time: openTime.length === 5 ? `${openTime}:00` : openTime,
      close_time: closeTime.length === 5 ? `${closeTime}:00` : closeTime,
    };

    try {
      await api.patch(`/teams/${teamId}/settings`, payload);
      toast.success("Settings saved successfully!");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-4 py-5 max-w mx-auto">
      <div className="mb-10">
        <div className="flex items-center gap-2 text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-3">
          <Link
            href={`/dashboard/team/${teamId}`}
            className="hover:text-primary transition-colors"
          >
            Team Feed
          </Link>
          <span>/</span>
          <span className="text-foreground">Settings</span>
        </div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Team Settings
        </h1>
        <p className="text-[13px] text-muted-foreground mt-2">
          Configure your team's rules and preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <form
            onSubmit={handleSave}
            className="rounded-xl border border-border shadow-sm overflow-hidden"
          >
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-medium text-muted-foreground px-1">
                  Team Name
                </label>
                <div className="relative">
                  <Settings className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="w-full pl-11 pr-4 h-9 px-3 text-[13px] bg-muted/30 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    placeholder="Engineering Team"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-medium text-muted-foreground px-1">
                  Timezone
                </label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={timeZone}
                    onChange={(e) => setTimeZone(e.target.value)}
                    className="w-full pl-11 pr-4 h-9 px-3 text-[13px] bg-muted/30 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-color-blue/20 focus:border-color-blue transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-medium text-muted-foreground px-1">
                    Submissions Open
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="time"
                      value={openTime}
                      onChange={(e) => setOpenTime(e.target.value)}
                      className="w-full pl-11 pr-4 h-9 px-3 text-[13px] bg-muted/30 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-color-green/20 focus:border-color-green transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-medium text-muted-foreground px-1">
                    Submissions Close
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="time"
                      value={closeTime}
                      onChange={(e) => setCloseTime(e.target.value)}
                      className="w-full pl-11 pr-4 h-9 px-3 text-[13px] bg-muted/30 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-color-rose/20 focus:border-color-rose transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-muted/20 border-t border-border flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 bg-foreground text-background h-8 px-4 rounded-lg text-[13px] font-medium hover:opacity-90 cursor-pointer transition-all disabled:opacity-50 active:scale-95"
              >
                <Save className="w-4 h-4" />
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-border shadow-sm p-5">
            <h3 className="text-[13px] font-semibold mb-4 flex items-center gap-2">
              <Link2 className="w-4 h-4 text-primary" />
              Invite Link
            </h3>
            <p className="text-[12px] text-muted-foreground mb-4">
              Share this unique code with your team members to have them join
              this space.
            </p>
            <div className="space-y-3">
              <div className="p-3 bg-muted/50 rounded-lg border border-border/50 font-mono text-[12px] text-foreground break-all">
                {currentTeam?.invite_id}
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(currentTeam?.invite_id || "");
                  toast.success("Invite link copied!");
                }}
                className="w-full h-8 border border-border rounded-lg text-[12px] font-medium hover:bg-muted/50 transition-colors"
              >
                Copy Invite ID
              </button>
            </div>
          </div>

          <Alert
            variant="error"
            title="Danger Zone"
            icon={<Shield className="w-4 h-4" />}
          >
            <p className="mb-3">
              Leaving the team will remove your access and clear your standup
              history for this team.
            </p>
            <button
              onClick={async () => {
                if (
                  confirm(
                    "Are you sure you want to leave this team? This action cannot be undone.",
                  )
                ) {
                  try {
                    await api.delete(`/teams/${teamId}/leave`);
                    toast.success("You have left the team");
                    router.push("/dashboard");
                  } catch (err) {
                    toast.error("Failed to leave team");
                  }
                }
              }}
              className="h-8 px-4 bg-danger text-white rounded-lg text-[12px] font-medium hover:opacity-90 transition-all cursor-pointer"
            >
              Leave Team
            </button>
          </Alert>
        </div>
      </div>
    </div>
  );
}
