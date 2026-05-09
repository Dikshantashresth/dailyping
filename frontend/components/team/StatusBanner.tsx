"use client";

import { Flame, Clock } from "lucide-react";

interface StatusBannerProps {
  type: "pending" | "closed";
  streak?: number;
  openTime?: string;
  closeTime?: string;
  onAction?: () => void;
}

/**
 * Renders status alerts for the team feed (e.g. pending submission or closed window).
 */
export default function StatusBanner({
  type,
  streak = 0,
  openTime,
  closeTime,
  onAction,
}: StatusBannerProps) {
  if (type === "pending") {
    return (
      <div className="bg-primary/5 border border-primary/20 rounded-3xl p-6 mb-10 flex flex-col md:flex-row items-center justify-between gap-6 group">
        <div className="flex items-center gap-5 text-center md:text-left">
          <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
            <Flame className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-black text-lg text-foreground">
              You haven't pinged today
            </h3>
            <p className="text-sm text-muted-foreground font-semibold">
              Keep your <span className="text-primary">{streak}</span> day streak alive!
            </p>
          </div>
        </div>
        <button
          onClick={onAction}
          className="w-full md:w-auto bg-primary text-white px-10 py-4 rounded-2xl text-sm font-black hover:opacity-90 shadow-xl shadow-primary/20 transition-all active:scale-95"
        >
          Submit Now
        </button>
      </div>
    );
  }

  return (
    <div className="bg-rose-500/5 border border-rose-500/10 rounded-3xl p-6 mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-5 text-center md:text-left">
        <div className="w-12 h-12 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-500">
          <Clock className="w-7 h-7" />
        </div>
        <div>
          <h3 className="font-black text-lg text-rose-900 dark:text-rose-100">
            Submission Window Closed
          </h3>
          <p className="text-sm text-rose-700/70 dark:text-rose-300/70 font-semibold">
            The window was from <span className="font-black">{openTime}</span> to{" "}
            <span className="font-black">{closeTime}</span>.
          </p>
        </div>
      </div>
      <div className="px-6 py-3 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-black uppercase tracking-widest border border-rose-500/20">
        Come back tomorrow
      </div>
    </div>
  );
}
