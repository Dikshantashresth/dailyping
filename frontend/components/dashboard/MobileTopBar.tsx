"use client";

import { ThemeToggle } from "@/components/ThemeToggle";

interface MobileTopBarProps {
  onBackToHome: () => void;
}

/**
 * Renders the top header for mobile devices.
 */
export default function MobileTopBar({ onBackToHome }: MobileTopBarProps) {
  return (
    <header className="md:hidden h-14 bg-card border-b border-border flex items-center justify-between px-4 sticky top-0 z-50">
      <button onClick={onBackToHome} className="flex items-center gap-2">
        <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center text-white font-mono font-bold text-[10px]">
          DP
        </div>
        <span className="font-bold text-base tracking-tight text-foreground">Daily Ping</span>
      </button>
      <ThemeToggle />
    </header>
  );
}
