"use client";

import { CalendarDays, Plus } from "lucide-react";

interface FeedHeaderProps {
  todayDate: string;
  pingCount: number;
  totalMembers: number;
  hasSubmittedToday: boolean;
  isLoading: boolean;
  windowOpen: boolean;
  onOpenSubmit: () => void;
}

/**
 * Renders the top header for the team feed including progress bar and CTA.
 */
export default function FeedHeader({
  todayDate,
  pingCount,
  totalMembers,
  hasSubmittedToday,
  isLoading,
  windowOpen,
  onOpenSubmit,
}: FeedHeaderProps) {
  const progress = Math.min(100, (pingCount / (totalMembers || 1)) * 100);

  return (
    <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
          <CalendarDays className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground leading-none">
            Team Feed
          </h1>
          <p className="text-xs text-muted-foreground font-medium mt-1.5 uppercase tracking-[0.1em]">
            {todayDate}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex flex-col items-end gap-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Team Progress
            </span>
            <span className="text-xs font-black text-foreground">
              {pingCount}/{totalMembers || "—"}
            </span>
          </div>
          <div className="w-24 h-1 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {!hasSubmittedToday && !isLoading && (
          <button
            onClick={onOpenSubmit}
            disabled={!windowOpen}
            className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${
              windowOpen
                ? "bg-foreground text-background hover:opacity-90"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
          >
            <Plus className="w-3.5 h-3.5" />{" "}
            {windowOpen ? "Submit Ping" : "Window Closed"}
          </button>
        )}
      </div>
    </div>
  );
}
