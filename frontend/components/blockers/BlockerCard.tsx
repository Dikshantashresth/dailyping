"use client";

import { Calendar, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";

interface BlockerCardProps {
  blocker: {
    id: string;
    keyword: string;
    occurrence_count: number;
    last_seen: string;
    resolved: boolean;
    resolved_at?: string;
  };
  isAdmin: boolean;
  onResolve: (id: string) => void;
}

/**
 * Renders an individual blocker card with its status and resolve actions.
 */
export default function BlockerCard({ blocker, isAdmin, onResolve }: BlockerCardProps) {
  const { keyword, occurrence_count, last_seen, resolved, resolved_at } = blocker;

  if (resolved) {
    return (
      <div className="bg-muted/30 border border-border/50 rounded-2xl p-4 opacity-70 grayscale hover:grayscale-0 transition-all">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-bold text-foreground capitalize truncate">"{keyword}"</p>
          <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
        </div>
        <p className="text-[10px] text-muted-foreground font-medium">
          Resolved {resolved_at ? format(new Date(resolved_at), "MMM d") : ""}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-rose-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">
            {occurrence_count} {occurrence_count === 1 ? 'Report' : 'Reports'}
          </span>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              Last seen {format(new Date(last_seen), "MMM d")}
            </span>
          </div>
        </div>
        <h3 className="text-2xl font-black text-foreground capitalize mb-2">"{keyword}"</h3>
        <p className="text-sm text-muted-foreground font-medium leading-relaxed">
          This hurdle has been flagged multiple times. Coordinate with your team to clear it.
        </p>
      </div>
      
      {isAdmin && (
        <button
          onClick={() => onResolve(blocker.id)}
          className="mt-6 w-full py-2.5 rounded-xl bg-foreground text-background font-bold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4" /> Mark as Resolved
        </button>
      )}
    </div>
  );
}
