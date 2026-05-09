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

// Components
import Navbar from "@/components/landing/Navbar";
import InteractiveMockup from "@/components/landing/InteractiveMockup";
import { 
  FeatureCard, 
  Step, 
  PricingFeature 
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
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden transition-colors duration-300">
      <Navbar isLoggedIn={isLoggedIn} />

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative pt-24 pb-32 px-6">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 opacity-30 pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-[120px]" />
            <div className="absolute top-40 right-10 w-80 h-80 bg-color-blue/20 rounded-full blur-[120px]" />
          </div>

          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[1.1] mb-8 text-foreground">
              Standups that actually <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-color-purple to-color-blue">
                work for you.
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
              Ditch the hour-long Zoom calls. Keep your team aligned, focused,
              and moving fast with beautiful, async daily updates.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {isLoggedIn ? (
                <Link
                  href="/dashboard"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-foreground text-background px-10 py-4 rounded-2xl text-base font-bold hover:opacity-90 shadow-2xl dark:shadow-none transition-all active:scale-95"
                >
                  Go to Dashboard <ArrowRight className="w-5 h-5" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/signup"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-foreground text-background px-10 py-4 rounded-2xl text-base font-bold hover:opacity-90 shadow-2xl dark:shadow-none transition-all active:scale-95"
                  >
                    Start for free <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    href="#features"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-card text-foreground px-10 py-4 rounded-2xl text-base font-bold border border-border hover:bg-muted transition-all active:scale-95"
                  >
                    See features
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Product Preview - Interactive Mockup */}
          <div className="max-w-6xl mx-auto mt-24 relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-color-blue rounded-[3rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-card rounded-[2.5rem] border border-border shadow-2xl overflow-hidden aspect-[16/10] md:aspect-[16/9]">
              <InteractiveMockup />
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-20 border-y border-border/50 bg-muted/20">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-[0.2em] mb-12">
              Trusted by fast-moving teams at
            </p>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
              <span className="text-2xl font-black italic text-foreground">TECHFLOW</span>
              <span className="text-2xl font-black uppercase tracking-tighter text-foreground">
                Velocity.
              </span>
              <span className="text-2xl font-black tracking-widest text-foreground">NEXUS</span>
              <span className="text-2xl font-black font-serif uppercase text-foreground">
                Prism
              </span>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-32 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-24">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
                Everything you need, <br />
                nothing you don't.
              </h2>
              <p className="text-muted-foreground text-lg font-medium max-w-xl mx-auto">
                Focus on progress, not process. Built for teams that ship fast.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Clock className="w-6 h-6" />}
                title="Custom Windows"
                description="Set specific submission windows that match your team's rhythm and timezone."
                color="text-primary bg-primary/10"
              />
              <FeatureCard
                icon={<BarChart3 className="w-6 h-6" />}
                title="Streak Tracking"
                description=" Gamify consistency. Watch your team's streak grow as everyone stays aligned."
                color="text-color-purple bg-color-purple/10"
              />
              <FeatureCard
                icon={<Shield className="w-6 h-6" />}
                title="Blocker Alerts"
                description="Instantly flag issues holding you back. Get the help you need, when you need it."
                color="text-color-rose bg-color-rose/10"
              />
              <FeatureCard
                icon={<Users2 className="w-6 h-6" />}
                title="Team History"
                description="Look back at previous standups to track progress and identify patterns."
                color="text-color-blue bg-color-blue/10"
              />
              <FeatureCard
                icon={<CheckCircle2 className="w-6 h-6" />}
                title="Verified Status"
                description="Secure email verification ensures only invited team members can join."
                color="text-color-green bg-color-green/10"
              />
              <FeatureCard
                icon={<Zap className="w-6 h-6" />}
                title="Lightning Fast"
                description="Submit your daily ping in under 60 seconds. Get in, get out, get shipping."
                color="text-color-amber bg-color-amber/10"
              />
            </div>
          </div>
        </section>

        {/* How it works Section */}
        <section
          id="how-it-works"
          className="py-32 px-6 bg-foreground text-background rounded-[4rem] mx-6"
        >
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-20 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-black leading-tight mb-8 text-background">
                  It's as simple <br /> as 1, 2, 3.
                </h2>
                <div className="space-y-12">
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
                <div className="aspect-square bg-white/5 rounded-[3rem] border border-white/10 flex items-center justify-center overflow-hidden">
                  <InteractiveMockup />
                </div>
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-[80px]" />
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-32 px-6 bg-muted/10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
                Simple, transparent pricing.
              </h2>
              <p className="text-muted-foreground text-lg font-medium max-w-xl mx-auto">
                Choose the plan that fits your team's size and stage.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Free Tier */}
              <div className="bg-card p-10 rounded-[2.5rem] border border-border shadow-sm flex flex-col group hover:border-primary/20 transition-all">
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    Free
                  </h3>
                  <p className="text-sm text-muted-foreground font-medium">
                    For individuals & small teams.
                  </p>
                </div>
                <div className="mb-8 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-foreground">
                    $0
                  </span>
                  <span className="text-muted-foreground font-medium text-sm">
                    / forever
                  </span>
                </div>
                <ul className="space-y-4 mb-10 flex-1">
                  <PricingFeature text="1 Team" />
                  <PricingFeature text="Up to 10 members" />
                  <PricingFeature text="7-day history" />
                  <PricingFeature text="Basic analytics" />
                </ul>
                <Link
                  href="/signup"
                  className="w-full py-4 px-6 rounded-2xl bg-muted text-foreground font-bold text-center hover:bg-muted/80 transition-all"
                >
                  Get Started
                </Link>
              </div>

              {/* Pro Tier */}
              <div className="bg-foreground p-10 rounded-[2.5rem] shadow-2xl shadow-primary/10 flex flex-col relative overflow-hidden group text-background">
                <div className="absolute top-0 right-0 bg-primary px-6 py-2 rounded-bl-2xl text-[10px] font-black text-white uppercase tracking-widest">
                  Best Value
                </div>
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-background mb-2">Pro</h3>
                  <p className="text-sm text-background/60 font-medium">
                    For growing startups & agencies.
                  </p>
                </div>
                <div className="mb-8 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-background">$9</span>
                  <span className="text-background/60 font-medium text-sm">
                    / month
                  </span>
                </div>
                <ul className="space-y-4 mb-10 flex-1">
                  <PricingFeature text="Unlimited Teams" isDark />
                  <PricingFeature text="Up to 50 members" isDark />
                  <PricingFeature text="90-day history" isDark />
                  <PricingFeature text="Advanced Analytics" isDark />
                  <PricingFeature text="Email Digests" isDark />
                  <PricingFeature text="Priority Support" isDark />
                </ul>
                <Link
                  href="/signup"
                  className="w-full py-4 px-6 rounded-2xl bg-background text-foreground font-bold text-center hover:opacity-90 shadow-xl transition-all"
                >
                  Go Pro
                </Link>
              </div>

              {/* Enterprise Tier */}
              <div className="bg-card p-10 rounded-[2.5rem] border border-border shadow-sm flex flex-col group hover:border-primary/20 transition-all">
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    Enterprise
                  </h3>
                  <p className="text-sm text-muted-foreground font-medium">
                    For large organizations.
                  </p>
                </div>
                <div className="mb-8 flex items-baseline gap-1">
                  <span className="text-3xl font-black text-foreground">
                    Custom
                  </span>
                </div>
                <ul className="space-y-4 mb-10 flex-1">
                  <PricingFeature text="Unlimited everything" />
                  <PricingFeature text="Dedicated Support" />
                  <PricingFeature text="SSO/SAML Integration" />
                  <PricingFeature text="Custom Integrations" />
                  <PricingFeature text="Role Management" />
                </ul>
                <Link
                  href="/signup"
                  className="w-full py-4 px-6 rounded-2xl bg-foreground text-background font-bold text-center hover:opacity-90 transition-all"
                >
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-40 px-6 text-center">
          <h2 className="text-5xl md:text-7xl font-black mb-10 tracking-tight text-foreground">
            Ready to start <br /> pinging?
          </h2>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center gap-2 bg-foreground text-background px-12 py-5 rounded-2xl text-lg font-bold hover:opacity-90 shadow-2xl dark:shadow-none transition-all active:scale-95"
          >
            Join Daily Ping Now <Zap className="w-5 h-5 ml-1" />
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border pt-20 pb-10 px-6 md:px-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center text-background font-mono font-bold text-xs">
                DP
              </div>
              <span className="font-bold text-lg tracking-tight text-foreground">
                Daily Ping
              </span>
            </div>
            <p className="text-muted-foreground text-base max-w-sm font-medium leading-relaxed">
              The lightweight, async standup tool for teams that value focus and
              speed. Built for the modern developer.
            </p>
            <div className="flex items-center gap-5">
              <a
                href="#"
                className="w-10 h-10 bg-muted/50 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
              >
                <FaGithub className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-muted/50 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
              >
                <FaTwitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-muted/50 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
              >
                <FaLinkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-widest text-foreground">
              Product
            </h4>
            <ul className="space-y-4">
              <li>
                <Link
                  href="#features"
                  className="text-sm text-muted-foreground font-medium hover:text-foreground transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#how-it-works"
                  className="text-sm text-muted-foreground font-medium hover:text-foreground transition-colors"
                >
                  How it works
                </Link>
              </li>
              <li>
                <Link
                  href="/signup"
                  className="text-sm text-muted-foreground font-medium hover:text-foreground transition-colors"
                >
                  Get Started
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-widest text-foreground">
              Company
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground font-medium hover:text-foreground transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground font-medium hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground font-medium hover:text-foreground transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground font-medium hover:text-foreground transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-10 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm text-muted-foreground font-medium">
            © {new Date().getFullYear()} Daily Ping. Made with ❤️ for fast
            teams.
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-color-green rounded-full animate-pulse" />
            System fully operational
          </div>
        </div>
      </footer>
    </div>
  );
}

