"use client";

import { Flame, Plus } from "lucide-react";

interface MissingMember {
  user_id: string;
  name: string;
  current_streak: number;
}

interface MissingMembersGridProps {
  members: MissingMember[];
  isAdmin: boolean;
}

/**
 * Renders a grid of team members who haven't submitted their daily ping.
 * Shown only to admins.
 */
export default function MissingMembersGrid({ members, isAdmin }: MissingMembersGridProps) {
  if (!isAdmin || members.length === 0) return null;

  return (
    <div className="mt-16 pt-16 border-t border-border/60">
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex items-center gap-3">
           <h3 className="text-sm font-black text-muted-foreground uppercase tracking-[0.2em]">
            Missing Pings
          </h3>
          <span className="bg-rose-500/10 text-rose-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-rose-500/10">
            {members.length} Pending
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {members.map((user) => (
          <div
            key={user.user_id}
            className="bg-card border border-border p-5 rounded-[2rem] flex items-center gap-5 hover:border-rose-500/30 hover:shadow-lg hover:shadow-rose-500/5 transition-all group relative overflow-hidden"
          >
            <div className="w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center text-sm font-black text-muted-foreground shadow-inner">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-black text-foreground truncate">
                {user.name}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Flame className="w-3.5 h-3.5 text-color-amber" />
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  {user.current_streak} Day Streak
                </span>
              </div>
            </div>
            <button className="opacity-0 group-hover:opacity-100 p-2.5 text-primary hover:bg-primary/10 rounded-xl transition-all shadow-sm">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
