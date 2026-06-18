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
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center text-primary">
          <CalendarDays className="w-4 h-4" />
        </div>
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-foreground leading-none font-[family-name:var(--font-outfit)]">
            Team Feed
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {todayDate}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground">
              Progress
            </span>
            <span className="text-xs font-semibold text-foreground">
              {pingCount}/{totalMembers || "—"}
            </span>
          </div>
          <div className="w-20 h-1 bg-muted rounded-full overflow-hidden">
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
            className={`inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-xs font-medium transition-all active:scale-95 ${
              windowOpen
                ? "bg-foreground text-background hover:opacity-90"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            {windowOpen ? "Submit Ping" : "Closed"}
          </button>
        )}
      </div>
    </div>
  );
}
