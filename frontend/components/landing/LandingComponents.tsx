"use client";

import { CheckCircle2 } from "lucide-react";

export function FeatureCard({ icon, title, description, color }: any) {
  return (
    <div className="p-6 rounded-xl border border-border bg-card hover:border-primary/20 hover:shadow-md transition-all group">
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-500 ${color}`}
      >
        {icon}
      </div>
      <h3 className="text-[15px] font-semibold mb-2 text-foreground">{title}</h3>
      <p className="text-muted-foreground text-[13px] leading-relaxed">
        {description}
      </p>
    </div>
  );
}

export function Step({ num, title, desc }: any) {
  return (
    <div className="flex gap-5">
      <span className="text-lg font-semibold text-primary/40 pt-0.5 font-[family-name:var(--font-jetbrains)]">{num}</span>
      <div>
        <h4 className="text-[15px] font-semibold text-background mb-1.5">{title}</h4>
        <p className="text-background/60 text-[13px] leading-relaxed max-w-sm">
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
        className={`w-4 h-4 shrink-0 ${isDark ? "text-primary" : "text-color-green"}`}
      />
      <span
        className={`text-[13px] ${isDark ? "text-background/80" : "text-muted-foreground"}`}
      >
        {text}
      </span>
    </li>
  );
}
