"use client";

import { ShieldAlert } from "lucide-react";
import { format } from "date-fns";
import type { Standup } from "@/lib/features/standupsSlice";

/**
 * Renders an individual standup update card.
 * @param {Standup} standup - The standup data object.
 */
export default function StandupCard({ standup }: { standup: Standup }) {
  const name = standup.profiles?.name || standup.user_name || "Unknown";

  // Parse did/will_do from JSON if stored that way
  let did = standup.did;
  let willDo = "";
  try {
    const obj = JSON.parse(standup.did);
    if (obj.did) {
      did = obj.did;
      willDo = obj.will_do || "";
    }
  } catch {}

  return (
    <div className="relative pl-8 pb-10 border-l border-border/50 last:pb-0">
      <div className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full bg-background border-2 border-primary" />
      
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground">
          {name.charAt(0).toUpperCase()}
        </div>
        <div className="flex items-center gap-2">
          <p className="text-sm font-bold text-foreground">{name}</p>
          <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">
            {standup.created_at
              ? format(new Date(standup.created_at), "h:mm a")
              : "Just now"}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="group">
          <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-1.5 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
            Yesterday
          </p>
          <p className="text-sm text-foreground/80 leading-relaxed pl-3.5">
            {did}
          </p>
        </div>

        <div className="group">
          <p className="text-[10px] font-bold text-primary/60 uppercase tracking-widest mb-1.5 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
            Today
          </p>
          <p className="text-sm text-foreground leading-relaxed pl-3.5">
            {willDo || "—"}
          </p>
        </div>

        {standup.blockers && (
          <div className="flex gap-2.5 items-start mt-4 px-3 py-2 bg-rose-500/5 rounded-lg border border-rose-500/10">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
            <p className="text-xs font-medium text-rose-700 dark:text-rose-300 italic">
              {standup.blockers}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
