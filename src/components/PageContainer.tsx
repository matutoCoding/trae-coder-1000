import type { ReactNode } from "react";
import { ChevronRight, Home } from "lucide-react";

interface PageContainerProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: { label: string; path?: string }[];
  children: ReactNode;
  actions?: ReactNode;
}

export default function PageContainer({
  title,
  subtitle,
  breadcrumbs,
  children,
  actions,
}: PageContainerProps) {
  return (
    <div className="animate-fade-in-up">
      <div className="mb-6">
        {breadcrumbs && (
          <div className="flex items-center gap-1 text-sm text-slate-500 mb-3">
            <Home className="w-4 h-4" />
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center gap-1">
                <ChevronRight className="w-4 h-4" />
                <span
                  className={
                    index === breadcrumbs.length - 1
                      ? "text-slate-700"
                      : "hover:text-police-600 cursor-pointer"
                  }
                >
                  {crumb.label}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">{title}</h1>
            {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-3">{actions}</div>}
        </div>
      </div>

      <div className="space-y-6">{children}</div>
    </div>
  );
}
