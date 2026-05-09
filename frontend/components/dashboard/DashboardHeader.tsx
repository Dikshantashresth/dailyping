"use client";

/**
 * Renders the welcome header for the dashboard home page.
 * @param {string} name - The name of the user.
 */
export default function DashboardHeader({ name }: { name: string }) {
  return (
    <div className="mb-10">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        Welcome back, {name} 👋
      </h1>
      <p className="text-muted-foreground text-base mt-2 font-medium">
        Select a team to view standups and updates.
      </p>
    </div>
  );
}
