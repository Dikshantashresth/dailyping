"use client";

import { CheckCircle2 } from "lucide-react";

export function FeatureCard({ icon, title, description, color }: any) {
  return (
    <div className="p-8 rounded-[2rem] border border-border bg-card hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all group">
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-500 ${color}`}
      >
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-foreground">{title}</h3>
      <p className="text-muted-foreground text-sm font-medium leading-relaxed">
        {description}
      </p>
    </div>
  );
}

export function Step({ num, title, desc }: any) {
  return (
    <div className="flex gap-6">
      <span className="text-2xl font-black text-primary/40 pt-1">{num}</span>
      <div>
        <h4 className="text-xl font-bold text-background mb-2">{title}</h4>
        <p className="text-background/60 text-base font-medium leading-relaxed max-w-sm">
          {desc}
        </p>
      </div>
    </div>
  );
}

export function PricingFeature({ text, isDark }: { text: string; isDark?: boolean }) {
  return (
    <li className="flex items-center gap-3">
      <CheckCircle2
        className={`w-5 h-5 shrink-0 ${isDark ? "text-primary" : "text-color-green"}`}
      />
      <span
        className={`text-sm font-medium ${isDark ? "text-backgorund/80" : "text-muted-foreground"}`}
      >
        {text}
      </span>
    </li>
  );
}
