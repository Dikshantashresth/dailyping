"use client";

import { CheckCircle2, ShieldAlert, Search } from "lucide-react";

interface EmptyBlockerStateProps {
  variant?: "active" | "resolved" | "all";
}

const variantConfig = {
  active: {
    icon: <CheckCircle2 className="w-6 h-6" />,
    iconBg: "bg-success/10 text-success",
    title: "No active blockers",
    description: "Your team is clear. No hurdles detected in standups.",
  },
  resolved: {
    icon: <Search className="w-6 h-6" />,
    iconBg: "bg-muted text-muted-foreground",
    title: "No resolved blockers",
    description: "Blockers you mark as resolved will appear here.",
  },
  all: {
    icon: <ShieldAlert className="w-6 h-6" />,
    iconBg: "bg-muted text-muted-foreground",
    title: "No blockers found",
    description: "Try adjusting your search or filters.",
  },
};

export default function EmptyBlockerState({ variant = "active" }: EmptyBlockerStateProps) {
  const config = variantConfig[variant];

  return (
    <div className="text-center py-16 bg-card border border-dashed border-border rounded-xl">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 ${config.iconBg}`}>
        {config.icon}
      </div>
      <h3 className="text-lg font-semibold text-foreground">{config.title}</h3>
      <p className="text-[13px] text-muted-foreground mt-1">{config.description}</p>
    </div>
  );
}
