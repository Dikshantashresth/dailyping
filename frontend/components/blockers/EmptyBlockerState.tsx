"use client";

import { CheckCircle2 } from "lucide-react";

/**
 * Renders a placeholder view when no active blockers are found.
 */
export default function EmptyBlockerState() {
  return (
    <div className="text-center py-20 bg-card border border-dashed border-border rounded-[2.5rem] shadow-sm">
      <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-green-600">
        <CheckCircle2 className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-foreground">Smooth Sailing!</h3>
      <p className="text-muted-foreground font-medium">No active blockers detected in your team's standups.</p>
    </div>
  );
}
