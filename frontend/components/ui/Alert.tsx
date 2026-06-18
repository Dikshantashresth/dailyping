"use client";

import { type ReactNode } from "react";
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
} from "lucide-react";

type AlertVariant = "success" | "error" | "warning" | "info";

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  icon?: ReactNode;
  className?: string;
}

const variantStyles: Record<
  AlertVariant,
  {
    container: string;
    icon: string;
    iconColor: string;
    titleColor: string;
    textColor: string;
    badge: string;
  }
> = {
  success: {
    container: "bg-success/5 border-success/15",
    icon: "bg-success/10 text-success",
    iconColor: "text-success",
    titleColor: "text-foreground",
    textColor: "text-muted-foreground",
    badge: "bg-success/10 text-success",
  },
  error: {
    container: "bg-danger/5 border-danger/15",
    icon: "bg-danger/10 text-danger",
    iconColor: "text-danger",
    titleColor: "text-foreground",
    textColor: "text-muted-foreground",
    badge: "bg-danger/10 text-danger",
  },
  warning: {
    container: "bg-warning/5 border-warning/15",
    icon: "bg-warning/10 text-warning",
    iconColor: "text-warning",
    titleColor: "text-foreground",
    textColor: "text-muted-foreground",
    badge: "bg-warning/10 text-warning",
  },
  info: {
    container: "bg-color-blue/5 border-color-blue/15",
    icon: "bg-color-blue/10 text-color-blue",
    iconColor: "text-color-blue",
    titleColor: "text-foreground",
    textColor: "text-muted-foreground",
    badge: "bg-color-blue/10 text-color-blue",
  },
};

const defaultIcons: Record<AlertVariant, ReactNode> = {
  success: <CheckCircle2 className="w-4 h-4" />,
  error: <AlertCircle className="w-4 h-4" />,
  warning: <AlertTriangle className="w-4 h-4" />,
  info: <Info className="w-4 h-4" />,
};

export function Alert({
  variant = "info",
  title,
  children,
  dismissible = false,
  onDismiss,
  icon,
  className = "",
}: AlertProps) {
  const styles = variantStyles[variant];

  return (
    <div
      className={`relative flex items-start gap-3 p-3 rounded-lg border ${styles.container} ${className}`}
      role="alert"
    >
      <div
        className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${styles.icon}`}
      >
        {icon || defaultIcons[variant]}
      </div>

      <div className="flex-1 min-w-0">
        {title && (
          <p className={`text-[13px] font-semibold ${styles.titleColor} mb-0.5`}>
            {title}
          </p>
        )}
        <div className={`text-[12px] ${styles.textColor} leading-relaxed`}>
          {children}
        </div>
      </div>

      {dismissible && onDismiss && (
        <button
          onClick={onDismiss}
          className="shrink-0 p-0.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

export function AlertBadge({
  variant = "info",
  children,
  className = "",
}: {
  variant?: AlertVariant;
  children: ReactNode;
  className?: string;
}) {
  const styles = variantStyles[variant];
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md uppercase tracking-wider ${styles.badge} ${className}`}
    >
      {children}
    </span>
  );
}
