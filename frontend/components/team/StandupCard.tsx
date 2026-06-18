"use client";

import { ShieldAlert } from "lucide-react";
import { format } from "date-fns";
import type { Standup } from "@/lib/features/standupsSlice";

export default function StandupCard({ standup }: { standup: Standup }) {
  const name = standup.profiles?.name || standup.user_name || "Unknown";

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
    <div className="relative pl-7 pb-6 border-l border-border/50 last:pb-0">
      <div className="absolute left-0 top-0 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-background border-2 border-primary" />

      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 rounded-md bg-muted flex items-center justify-center text-[9px] font-bold text-muted-foreground">
          {name.charAt(0).toUpperCase()}
        </div>
        <p className="text-[13px] font-semibold text-foreground">{name}</p>
        <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
        <p className="text-[10px] text-muted-foreground">
          {standup.created_at
            ? format(new Date(standup.created_at), "h:mm a")
            : "Just now"}
        </p>
      </div>

      <div className="space-y-2.5 pl-1">
        <div>
          <p className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider mb-0.5 flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
            Yesterday
          </p>
          <p className="text-[13px] text-foreground/80 leading-relaxed pl-2.5">
            {did}
          </p>
        </div>

        <div>
          <p className="text-[10px] font-medium text-primary/60 uppercase tracking-wider mb-0.5 flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-primary/40" />
            Today
          </p>
          <p className="text-[13px] text-foreground leading-relaxed pl-2.5">
            {willDo || "—"}
          </p>
        </div>

        {standup.blockers && (
          <div className="flex gap-2 items-start mt-2 px-2.5 py-1.5 bg-danger/5 rounded-md border border-danger/15">
            <ShieldAlert className="w-3 h-3 text-danger shrink-0 mt-0.5" />
            <p className="text-[11px] font-medium text-danger leading-snug">
              {standup.blockers}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
