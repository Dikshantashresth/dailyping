"use client";

import { Flame, ArrowRight } from "lucide-react";
import type { Team } from "@/lib/features/teamSlice";

interface TeamCardProps {
  team: Team;
  theme: {
    bg: string;
    text: string;
  };
  onSelect: (team: Team) => void;
}

/**
 * Renders a card representing a team on the dashboard.
 * @param {Team} team - The team data.
 * @param {object} theme - The theme colors for the card.
 * @param {function} onSelect - Callback when the card is clicked.
 */
export default function TeamCard({ team, theme, onSelect }: TeamCardProps) {
  return (
    <button
      onClick={() => onSelect(team)}
      className="text-left bg-card border border-border rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 group relative active:scale-[0.98] shadow-sm"
    >
      {/* Header Pattern/Color */}
      <div className={`h-24 ${theme.bg} relative overflow-hidden`}>
        {/* Decorative circles */}
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
        <div className="absolute right-10 bottom-0 w-16 h-16 bg-black/5 rounded-full blur-lg" />

        <div className="absolute inset-0 p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-lg bg-card shadow-sm flex items-center justify-center text-sm font-bold">
              <span className={theme.text}>
                {team.name.substring(0, 2).toUpperCase()}
              </span>
            </div>
            <div className="px-2 py-0.5 bg-black/10 backdrop-blur-md rounded-md border border-white/10">
              <p className="text-[9px] text-white uppercase tracking-widest font-bold">
                {team.role}
              </p>
            </div>
          </div>
          <h3 className="font-semibold text-lg text-white truncate drop-shadow-sm">
            {team.name}
          </h3>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div
              className={`flex items-center gap-1.5 px-2 py-0.5 bg-muted ${theme.text} rounded-md text-[11px] font-medium border border-border/50`}
            >
              <Flame className="w-3.5 h-3.5" />
              {team.current_streak || 0}
            </div>
            {team.timezone && (
              <p className="text-[11px] text-muted-foreground font-medium">
                {team.timezone}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between group-hover:translate-x-1 transition-transform duration-300">
          <p className="text-[11px] font-medium text-foreground">
            View Standups
          </p>
          <div
            className={`w-7 h-7 bg-muted ${theme.text} border border-border/50 rounded-md flex items-center justify-center transition-colors group-hover:bg-primary group-hover:text-white`}
          >
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </button>
  );
}
