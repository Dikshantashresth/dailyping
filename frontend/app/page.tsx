"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import {
  ArrowRight,
  Zap,
  Clock,
  BarChart3,
  Shield,
  Users2,
  CheckCircle2,
} from "lucide-react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

import Navbar from "@/components/landing/Navbar";
import InteractiveMockup from "@/components/landing/InteractiveMockup";
import {
  FeatureCard,
  Step,
  PricingFeature,
} from "@/components/landing/LandingComponents";

export default function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/auth/me");
        if (res.data.success) {
          setIsLoggedIn(true);
        }
      } catch (err) {
        setIsLoggedIn(false);
      }
    };
    checkAuth();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden">
      <Navbar isLoggedIn={isLoggedIn} />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative pt-20 pb-24 px-4">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 opacity-30 pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-[120px]" />
            <div className="absolute top-40 right-10 w-80 h-80 bg-color-blue/20 rounded-full blur-[120px]" />
          </div>

          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.15] mb-6 text-foreground font-[family-name:var(--font-outfit)]">
              Standups that actually{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-color-purple to-color-blue">
                work for you.
              </span>
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
              Ditch the hour-long Zoom calls. Keep your team aligned, focused,
              and moving fast with async daily updates.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              {isLoggedIn ? (
                <Link
                  href="/dashboard"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-foreground text-background px-8 py-2.5 rounded-lg text-[13px] font-medium hover:opacity-90 shadow-md transition-all active:scale-[0.98]"
                >
                  Go to Dashboard <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/signup"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-foreground text-background px-8 py-2.5 rounded-lg text-[13px] font-medium hover:opacity-90 shadow-md transition-all active:scale-[0.98]"
                  >
                    Start for free <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="#features"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-card text-foreground px-8 py-2.5 rounded-lg text-[13px] font-medium border border-border hover:bg-muted transition-all active:scale-[0.98]"
                  >
                    See features
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Product Preview */}
          <div className="max-w-5xl mx-auto mt-16 relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-color-blue rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200" />
            <div className="relative bg-card rounded-xl border border-border shadow-lg overflow-hidden aspect-[16/10] md:aspect-[16/9]">
              <InteractiveMockup />
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-12 border-y border-border/50 bg-muted/20">
          <div className="max-w-5xl mx-auto px-4 text-center">
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-[0.2em] mb-8">
              Trusted by fast-moving teams at
            </p>
            <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
              <span className="text-lg font-bold italic text-foreground font-[family-name:var(--font-outfit)]">TECHFLOW</span>
              <span className="text-lg font-bold uppercase tracking-tighter text-foreground font-[family-name:var(--font-outfit)]">
                Velocity.
              </span>
              <span className="text-lg font-bold tracking-widest text-foreground font-[family-name:var(--font-outfit)]">NEXUS</span>
              <span className="text-lg font-bold font-serif uppercase text-foreground">
                Prism
              </span>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-20 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3 font-[family-name:var(--font-outfit)]">
                Everything you need, nothing you don&apos;t.
              </h2>
              <p className="text-muted-foreground text-[13px] max-w-md mx-auto">
                Focus on progress, not process. Built for teams that ship fast.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              <FeatureCard
                icon={<Clock className="w-5 h-5" />}
                title="Custom Windows"
                description="Set specific submission windows that match your team's rhythm and timezone."
                color="text-primary bg-primary/10"
              />
              <FeatureCard
                icon={<BarChart3 className="w-5 h-5" />}
                title="Streak Tracking"
                description="Gamify consistency. Watch your team's streak grow as everyone stays aligned."
                color="text-color-purple bg-color-purple/10"
              />
              <FeatureCard
                icon={<Shield className="w-5 h-5" />}
                title="Blocker Alerts"
                description="Instantly flag issues holding you back. Get the help you need, when you need it."
                color="text-color-rose bg-color-rose/10"
              />
              <FeatureCard
                icon={<Users2 className="w-5 h-5" />}
                title="Team History"
                description="Look back at previous standups to track progress and identify patterns."
                color="text-color-blue bg-color-blue/10"
              />
              <FeatureCard
                icon={<CheckCircle2 className="w-5 h-5" />}
                title="Verified Status"
                description="Secure email verification ensures only invited team members can join."
                color="text-color-green bg-color-green/10"
              />
              <FeatureCard
                icon={<Zap className="w-5 h-5" />}
                title="Lightning Fast"
                description="Submit your daily ping in under 60 seconds. Get in, get out, get shipping."
                color="text-color-amber bg-color-amber/10"
              />
            </div>
          </div>
        </section>

        {/* How it works */}
        <section
          id="how-it-works"
          className="py-20 px-4 bg-foreground text-background rounded-xl mx-4"
        >
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold leading-tight mb-8 font-[family-name:var(--font-outfit)]">
                  It&apos;s as simple as 1, 2, 3.
                </h2>
                <div className="space-y-8">
                  <Step
                    num="01"
                    title="Create your space"
                    desc="Set up your team in seconds. Invite members with a unique secure link."
                  />
                  <Step
                    num="02"
                    title="Submit daily pings"
                    desc="Team members post quick updates: What's done, what's next, and any hurdles."
                  />
                  <Step
                    num="03"
                    title="Watch the streak"
                    desc="Celebrate consistency and keep the momentum high every single day."
                  />
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square bg-white/5 rounded-xl border border-white/10 flex items-center justify-center overflow-hidden">
                  <InteractiveMockup />
                </div>
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-primary/20 rounded-full blur-[60px]" />
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-20 px-4 bg-muted/10">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3 font-[family-name:var(--font-outfit)]">
                Simple, transparent pricing.
              </h2>
              <p className="text-muted-foreground text-[13px] max-w-md mx-auto">
                Choose the plan that fits your team&apos;s size and stage.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              {/* Free */}
              <div className="bg-card p-8 rounded-xl border border-border flex flex-col hover:border-primary/20 transition-all">
                <div className="mb-6">
                  <h3 className="text-[15px] font-semibold text-foreground mb-1">
                    Free
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    For individuals &amp; small teams.
                  </p>
                </div>
                <div className="mb-6 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-foreground font-[family-name:var(--font-outfit)]">
                    $0
                  </span>
                  <span className="text-muted-foreground text-[11px]">
                    / forever
                  </span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  <PricingFeature text="1 Team" />
                  <PricingFeature text="Up to 10 members" />
                  <PricingFeature text="7-day history" />
                  <PricingFeature text="Basic analytics" />
                </ul>
                <Link
                  href="/signup"
                  className="w-full py-2 px-4 rounded-lg bg-muted text-foreground text-[13px] font-medium text-center hover:bg-muted/80 transition-all"
                >
                  Get Started
                </Link>
              </div>

              {/* Pro */}
              <div className="bg-foreground p-8 rounded-xl shadow-lg shadow-primary/10 flex flex-col relative overflow-hidden text-background">
                <div className="absolute top-0 right-0 bg-primary px-4 py-1 rounded-bl-lg text-[9px] font-semibold text-white uppercase tracking-wider">
                  Best Value
                </div>
                <div className="mb-6">
                  <h3 className="text-[15px] font-semibold text-background mb-1">Pro</h3>
                  <p className="text-[11px] text-background/60">
                    For growing startups &amp; agencies.
                  </p>
                </div>
                <div className="mb-6 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-background font-[family-name:var(--font-outfit)]">$9</span>
                  <span className="text-background/60 text-[11px]">
                    / month
                  </span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  <PricingFeature text="Unlimited Teams" isDark />
                  <PricingFeature text="Up to 50 members" isDark />
                  <PricingFeature text="90-day history" isDark />
                  <PricingFeature text="Advanced Analytics" isDark />
                  <PricingFeature text="Email Digests" isDark />
                  <PricingFeature text="Priority Support" isDark />
                </ul>
                <Link
                  href="/signup"
                  className="w-full py-2 px-4 rounded-lg bg-background text-foreground text-[13px] font-medium text-center hover:opacity-90 shadow-md transition-all"
                >
                  Go Pro
                </Link>
              </div>

              {/* Enterprise */}
              <div className="bg-card p-8 rounded-xl border border-border flex flex-col hover:border-primary/20 transition-all">
                <div className="mb-6">
                  <h3 className="text-[15px] font-semibold text-foreground mb-1">
                    Enterprise
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    For large organizations.
                  </p>
                </div>
                <div className="mb-6 flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-foreground font-[family-name:var(--font-outfit)]">
                    Custom
                  </span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  <PricingFeature text="Unlimited everything" />
                  <PricingFeature text="Dedicated Support" />
                  <PricingFeature text="SSO/SAML Integration" />
                  <PricingFeature text="Custom Integrations" />
                  <PricingFeature text="Role Management" />
                </ul>
                <Link
                  href="/signup"
                  className="w-full py-2 px-4 rounded-lg bg-foreground text-background text-[13px] font-medium text-center hover:opacity-90 transition-all"
                >
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-28 px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-8 tracking-tight font-[family-name:var(--font-outfit)]">
            Ready to start pinging?
          </h2>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center gap-2 bg-foreground text-background px-8 py-3 rounded-lg text-[13px] font-medium hover:opacity-90 shadow-md transition-all active:scale-[0.98]"
          >
            Join Daily Ping Now <Zap className="w-4 h-4 ml-0.5" />
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border pt-14 pb-8 px-4 md:px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-14">
          <div className="col-span-1 md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-foreground rounded-md flex items-center justify-center text-background font-[family-name:var(--font-jetbrains)] font-bold text-[10px]">
                DP
              </div>
              <span className="font-semibold text-[15px] text-foreground font-[family-name:var(--font-outfit)]">
                Daily Ping
              </span>
            </div>
            <p className="text-muted-foreground text-[13px] max-w-sm leading-relaxed">
              The lightweight, async standup tool for teams that value focus and
              speed. Built for the modern developer.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-8 h-8 bg-muted/50 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
              >
                <FaGithub className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-muted/50 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
              >
                <FaTwitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-muted/50 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
              >
                <FaLinkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-foreground">
              Product
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="#features"
                  className="text-[13px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#how-it-works"
                  className="text-[13px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  How it works
                </Link>
              </li>
              <li>
                <Link
                  href="/signup"
                  className="text-[13px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  Get Started
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-foreground">
              Company
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="#"
                  className="text-[13px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[13px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[13px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[13px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-5xl mx-auto pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-muted-foreground">
            &copy; {new Date().getFullYear()} Daily Ping. Built for fast teams.
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <div className="w-1.5 h-1.5 bg-color-green rounded-full animate-pulse" />
            System operational
          </div>
        </div>
      </footer>
    </div>
  );
}
