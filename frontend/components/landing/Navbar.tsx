"use client";

import Link from "next/link";
import { Zap } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

interface NavbarProps {
  isLoggedIn: boolean;
}

export default function Navbar({ isLoggedIn }: NavbarProps) {
  return (
    <nav className="h-20 border-b border-border bg-background/80 backdrop-blur-md flex items-center justify-between px-6 md:px-20 sticky top-0 z-50 transition-colors duration-300">
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white font-mono font-bold text-sm shadow-lg shadow-primary/20">
            DP
          </div>
          <span className="font-bold text-xl tracking-tight text-foreground">
            Daily Ping
          </span>
        </Link>
      </div>

      <div className="hidden md:flex items-center gap-10">
        <a
          href="#features"
          className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
        >
          Features
        </a>
        <a
          href="#pricing"
          className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
        >
          Pricing
        </a>
        <a
          href="#how-it-works"
          className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
        >
          How it works
        </a>

        <div className="flex items-center gap-4 border-l border-border pl-6 ml-2">
          <ThemeToggle />
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className="bg-foreground text-background px-6 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-all shadow-lg dark:shadow-none"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="bg-foreground text-background px-6 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-all shadow-lg dark:shadow-none"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="md:hidden flex items-center gap-4">
        <ThemeToggle />
        <button className="p-2 text-foreground">
          <Zap className="w-6 h-6" />
        </button>
      </div>
    </nav>
  );
}
