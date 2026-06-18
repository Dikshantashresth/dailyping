"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

interface NavbarProps {
  isLoggedIn: boolean;
}

export default function Navbar({ isLoggedIn }: NavbarProps) {
  return (
    <nav className="h-14 border-b border-border bg-background/80 backdrop-blur-md flex items-center justify-between px-4 md:px-8 sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center text-primary-foreground font-[family-name:var(--font-jetbrains)] font-bold text-[10px]">
            DP
          </div>
          <span className="font-semibold text-[15px] text-foreground font-[family-name:var(--font-outfit)]">
            Daily Ping
          </span>
        </Link>
      </div>

      <div className="hidden md:flex items-center gap-8">
        <a
          href="#features"
          className="text-[13px] text-muted-foreground hover:text-foreground transition-colors"
        >
          Features
        </a>
        <a
          href="#pricing"
          className="text-[13px] text-muted-foreground hover:text-foreground transition-colors"
        >
          Pricing
        </a>
        <a
          href="#how-it-works"
          className="text-[13px] text-muted-foreground hover:text-foreground transition-colors"
        >
          How it works
        </a>

        <div className="flex items-center gap-3 border-l border-border pl-5">
          <ThemeToggle />
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className="bg-foreground text-background px-4 py-1.5 rounded-md text-[13px] font-medium hover:opacity-90 transition-all"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-[13px] text-muted-foreground hover:text-foreground transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="bg-foreground text-background px-4 py-1.5 rounded-md text-[13px] font-medium hover:opacity-90 transition-all"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="md:hidden flex items-center gap-3">
        <ThemeToggle />
        <button className="p-1.5 text-muted-foreground hover:text-foreground transition-colors">
          <Menu className="w-5 h-5" />
        </button>
      </div>
    </nav>
  );
}
