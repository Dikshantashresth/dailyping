"use client";

import { Users } from "lucide-react";

/**
 * Renders a placeholder view when the user has no teams.
 */
export default function EmptyTeamState() {
  return (
    <div className="text-center py-24 bg-card rounded-3xl border border-dashed border-border shadow-sm">
      <div className="w-20 h-20 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-6 text-muted-foreground">
        <Users className="w-10 h-10" />
      </div>
      <h2 className="text-2xl font-bold mb-2 text-foreground">
        No teams yet
      </h2>
      <p className="text-muted-foreground max-w-sm mx-auto font-medium">
        Start by creating a new team or joining an existing one from the
        sidebar.
      </p>
    </div>
  );
}
