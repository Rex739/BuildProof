"use client";

import { CheckCircle2, Info, X, XCircle } from "lucide-react";
import { useBuildProof } from "@/components/buildproof-provider";
import { cn } from "@/lib/utils";

const toastStyles = {
  success: {
    icon: CheckCircle2,
    className: "border-emerald-400/30 bg-emerald-400/10 text-emerald-100",
  },
  error: {
    icon: XCircle,
    className: "border-red-400/30 bg-red-400/10 text-red-100",
  },
  info: {
    icon: Info,
    className: "border-sky-400/30 bg-sky-400/10 text-sky-100",
  },
};

export function ToastViewport() {
  const { toasts, dismissToast } = useBuildProof();

  return (
    <div className="fixed right-4 top-20 z-50 grid w-[calc(100vw-2rem)] max-w-sm gap-3">
      {toasts.map((toast) => {
        const style = toastStyles[toast.type];
        const Icon = style.icon;
        return (
          <div
            key={toast.id}
            className={cn(
              "rounded-lg border p-4 shadow-glow backdrop-blur-xl",
              style.className,
            )}
          >
            <div className="flex items-start gap-3">
              <Icon className="mt-0.5 h-5 w-5 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{toast.title}</p>
                {toast.description ? (
                  <p className="mt-1 text-sm text-muted-foreground">{toast.description}</p>
                ) : null}
              </div>
              <button
                className="rounded-md p-1 text-muted-foreground transition hover:bg-slate-800 hover:text-foreground"
                onClick={() => dismissToast(toast.id)}
                type="button"
                aria-label="Dismiss toast"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
