"use client";

import { AlertCircle, CheckCircle2 } from "lucide-react";
import type { Standup } from "@/lib/features/standupsSlice";

interface HistoryCardProps {
  standup: Standup;
}

export default function HistoryCard({ standup }: HistoryCardProps) {
  let did = standup.did;
  let willDo = "";
  try {
    const obj = JSON.parse(standup.did);
    if (obj.did) {
      did = obj.did;
      willDo = obj.will_do || "";
    }
  } catch {}

  const hasBlocker = standup.has_blockers || !!standup.blockers;

  return (
    <div
      className="bg-card border border-border p-4 rounded-xl animate-in fade-in slide-in-from-bottom-4 duration-500"
      style={{ animationDelay: `${Number(standup.id) * 150}ms` }}
    >
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-7 h-7 rounded-md bg-muted flex items-center justify-center text-[10px] font-semibold text-muted-foreground overflow-hidden shrink-0">
          {standup.avatar_url ? (
            <img src={standup.avatar_url} alt="" className="w-full h-full object-cover" />
          ) : (
            (standup.user_name || "U").charAt(0).toUpperCase()
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold text-foreground truncate">
            {standup.user_name}
          </p>
          <p className="text-[10px] text-muted-foreground">
            {standup.for_date}
          </p>
        </div>
        <div className="bg-success/10 px-2 py-0.5 rounded-md text-[10px] font-medium text-success flex items-center gap-1 shrink-0">
          <CheckCircle2 className="w-2.5 h-2.5" /> Pinged
        </div>
      </div>

      <div className="space-y-2.5">
        <div>
          <p className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider mb-0.5">
            Yesterday
          </p>
          <p className="text-[13px] text-foreground/80 leading-relaxed">
            {did}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-medium text-primary/60 uppercase tracking-wider mb-0.5">
            Today
          </p>
          <p className="text-[13px] text-foreground leading-relaxed">
            {willDo || "—"}
          </p>
        </div>
        {hasBlocker && (
          <div className="bg-danger/5 border border-danger/15 p-2 rounded-lg flex gap-2">
            <AlertCircle className="w-3 h-3 text-danger shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] font-semibold text-danger uppercase tracking-wider block mb-0.5">
                Blocker
              </span>
              <p className="text-[12px] text-foreground font-medium leading-tight">
                {standup.blockers}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
