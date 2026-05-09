"use client";

/**
 * Renders the initial loading screen for the dashboard.
 */
export default function AppLoadingScreen() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-background">
      <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white font-mono font-bold text-xl shadow-xl shadow-primary/20 animate-bounce mb-8">
        DP
      </div>
      <div className="flex flex-col items-center gap-2">
        <p className="text-lg font-bold text-foreground animate-pulse tracking-tight">Daily Ping</p>
        <div className="h-1 w-32 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary animate-progress rounded-full" />
        </div>
      </div>
    </div>
  );
}
