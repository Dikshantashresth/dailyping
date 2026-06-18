"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setCurrentTeam } from "@/lib/features/teamSlice";
import { Flame, ShieldAlert, Trash2, Link2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

export default function MembersPage() {
  const params = useParams();
  const teamId = params.teamId as string;
  const { current: currentTeam, teams } = useAppSelector((s) => s.team);
  const dispatch = useAppDispatch();
  const isAdmin = currentTeam?.role === "admin";
  const [members, setMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Hydrate current team from teams list if not set or mismatched
  useEffect(() => {
    if (teams.length > 0) {
      if (!currentTeam || currentTeam.id !== teamId) {
        const found = teams.find((t) => t.id === teamId);
        if (found) dispatch(setCurrentTeam(found));
      }
    }
  }, [currentTeam, teams, teamId, dispatch]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await api.get(`/teams/${teamId}/members`);
        setMembers(res.data.members || []);
        console.log(res.data, members);
      } catch {
        console.error("Failed to fetch members");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMembers();
  }, [teamId]);

  const handleCopyInvite = () => {
    if (currentTeam?.invite_id) {
      navigator.clipboard.writeText(currentTeam.invite_id);
      toast.success("Invite link copied!");
    }
  };

  const handleKickOut = async (memberid: string) => {
    if (!isAdmin) return toast.error("Cannot Remove");
    const res = await api.delete(`/teams/${teamId}/remove/${memberid}`);
    if (res.data.success) {
      setMembers((prev) => prev.filter((i) => i.user_id != memberid));
      return toast.success("Removed a member");
    }
  };
  return (
    <div className="px-4 py-5 max-w mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Members</h1>
          <p className="text-[13px] text-muted-foreground mt-1">
            {members.length} member{members.length !== 1 ? "s" : ""} in this
            team
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={handleCopyInvite}
            className="inline-flex items-center gap-1.5 bg-foreground text-background h-8 px-4 rounded-lg text-[13px] font-medium hover:bg-foreground/90 transition-colors"
          >
            <Link2 className="w-4 h-4" /> Copy invite link
          </button>
        )}
      </div>

      <div className="border border-border rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-muted text-muted-foreground text-[10px] uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3 font-medium">Member</th>
                <th className="px-5 py-3 font-medium">Role</th>
                <th className="px-5 py-3 font-medium">Streak</th>
                <th className="px-5 py-3 font-medium">Best</th>
                {isAdmin && <th className="px-5 py-3 font-medium w-16"></th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {members.map((member, idx) => (
                <tr key={idx} className="hover:bg-muted/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-md bg-primary/10 text-primary flex items-center justify-center font-semibold text-[10px]">
                        {member.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div>
                        <p className="font-medium text-[13px]">
                          {member.name || "Unknown"}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {member.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    {member.role === "admin" ? (
                      <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-md font-semibold">
                        <ShieldAlert className="w-3 h-3" /> Admin
                      </span>
                    ) : (
                      <span className="text-[10px] text-muted-foreground">
                        Member
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1 text-orange-600 font-medium text-[13px]">
                      <Flame className="w-4 h-4" /> {member.current_streak || 0}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground text-[13px]">
                    {member.longest_streak || 0}
                  </td>
                  {isAdmin && (
                    <td className="px-5 py-3.5">
                      {member.role !== "admin" && (
                        <button
                          onClick={() => handleKickOut(member.user_id)}
                          className="p-1 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                          title="Remove member"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
