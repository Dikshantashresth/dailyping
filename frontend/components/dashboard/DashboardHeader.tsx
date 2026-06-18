"use client";

/**
 * Renders the welcome header for the dashboard home page.
 * @param {string} name - The name of the user.
 */
export default function DashboardHeader({ name }: { name: string }) {
  return (
    <div className="mb-8">
      <h1 className="text-xl font-semibold font-[family-name:var(--font-outfit)] tracking-tight text-foreground">
        Welcome back, {name} 👋
      </h1>
      <p className="text-[13px] text-muted-foreground mt-2">
        Select a team to view standups and updates.
      </p>
    </div>
  );
}
