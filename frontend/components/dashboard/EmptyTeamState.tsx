"use client";

import { Users } from "lucide-react";

/**
 * Renders a placeholder view when the user has no teams.
 */
export default function EmptyTeamState() {
  return (
    <div className="text-center py-16 bg-card rounded-xl border border-dashed border-border shadow-sm">
      <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center mx-auto mb-6 text-muted-foreground">
        <Users className="w-6 h-6" />
      </div>
      <h2 className="text-lg font-semibold mb-2 text-foreground">
        No teams yet
      </h2>
      <p className="text-[13px] text-muted-foreground max-w-sm mx-auto">
        Start by creating a new team or joining an existing one from the
        sidebar.
      </p>
    </div>
  );
}
