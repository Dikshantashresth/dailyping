"use client";

import { Flame, Clock } from "lucide-react";
import { Alert, AlertBadge } from "@/components/ui/Alert";

interface StatusBannerProps {
  type: "pending" | "closed";
  streak?: number;
  openTime?: string;
  closeTime?: string;
  onAction?: () => void;
}

export default function StatusBanner({
  type,
  streak = 0,
  openTime,
  closeTime,
  onAction,
}: StatusBannerProps) {
  if (type === "pending") {
    return (
      <Alert variant="warning" icon={<Flame className="w-4 h-4" />} className="mb-4">
        <div className="flex items-center justify-between gap-3 w-full">
          <div>
            <p className="text-[13px] font-semibold text-foreground mb-0.5">
              You haven't pinged today
            </p>
            <p className="text-[11px] text-muted-foreground">
              Keep your <span className="text-primary font-semibold">{streak}</span> day streak alive
            </p>
          </div>
          <button
            onClick={onAction}
            className="bg-primary text-primary-foreground h-7 px-3 rounded-md text-[11px] font-medium hover:opacity-90 transition-all active:scale-95 shrink-0"
          >
            Submit Now
          </button>
        </div>
      </Alert>
    );
  }

  return (
    <Alert variant="error" icon={<Clock className="w-4 h-4" />} className="mb-4">
      <div className="flex items-center justify-between gap-3 w-full">
        <div>
          <p className="text-[13px] font-semibold text-foreground mb-0.5">
            Submission Window Closed
          </p>
          <p className="text-[11px] text-muted-foreground">
            Window was <span className="font-semibold">{openTime}</span> to <span className="font-semibold">{closeTime}</span>
          </p>
        </div>
        <AlertBadge variant="error">Closed</AlertBadge>
      </div>
    </Alert>
  );
}
