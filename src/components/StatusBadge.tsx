import type { ReactNode } from "react";

type StatusType =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "default"
  | "blue";

interface StatusBadgeProps {
  children: ReactNode;
  type?: StatusType;
}

const typeStyles: Record<StatusType, string> = {
  success: "bg-health-50 text-health-700 border-health-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
  danger: "bg-warning-50 text-warning-700 border-warning-200",
  info: "bg-sky-50 text-sky-700 border-sky-200",
  default: "bg-slate-100 text-slate-700 border-slate-200",
  blue: "bg-police-50 text-police-700 border-police-200",
};

export default function StatusBadge({
  children,
  type = "default",
}: StatusBadgeProps) {
  return (
    <span className={`badge border ${typeStyles[type]}`}>{children}</span>
  );
}
